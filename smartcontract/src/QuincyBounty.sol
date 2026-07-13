// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title QuincyBounty
/// @notice Escrow contract for micro-task bounties paid in cUSD. The contract
///         holds all funds; each lifecycle step is a separate transaction and
///         emits an event that the off-chain indexer mirrors into Postgres.
contract QuincyBounty is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status {
        Open,
        InProgress,
        PendingReview,
        Completed,
        Cancelled,
        Disputed
    }

    struct Bounty {
        address poster;
        address hunter;
        uint256 reward;
        uint256 deadline;
        Status status;
        string description;
        string proofURI;
    }

    struct Reputation {
        uint64 bountiesPosted;
        uint64 bountiesCompletedAsPoster;
        uint64 bountiesClaimed;
        uint64 bountiesCompletedAsHunter;
        uint256 totalEarned;
        uint256 totalSpent;
    }

    /// @notice The cUSD token used for all rewards.
    IERC20 public immutable cUSD;
    /// @notice Address allowed to resolve disputes (single EOA for MVP).
    address public admin;
    /// @notice Minimum reward, to avoid dust-value spam bounties.
    uint256 public minReward;
    /// @notice Id assigned to the next created bounty.
    uint256 public nextBountyId = 1;

    mapping(uint256 => Bounty) private _bounties;
    mapping(address => Reputation) private _reputations;

    event BountyCreated(
        uint256 indexed bountyId, address indexed poster, uint256 reward, uint256 deadline
    );
    event BountyClaimed(uint256 indexed bountyId, address indexed hunter);
    event ProofSubmitted(uint256 indexed bountyId, string proofURI);
    event BountyApproved(uint256 indexed bountyId, address indexed hunter, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId);
    event BountyDisputed(uint256 indexed bountyId);
    event DisputeResolved(uint256 indexed bountyId, bool paidHunter);

    error ZeroAddress();
    error RewardTooLow();
    error DeadlineInPast();
    error InvalidStatus();
    error NotPoster();
    error NotHunter();
    error NotParty();
    error NotAdmin();
    error PosterCannotClaim();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address cusd, address admin_, uint256 minReward_) {
        if (cusd == address(0) || admin_ == address(0)) revert ZeroAddress();
        cUSD = IERC20(cusd);
        admin = admin_;
        minReward = minReward_;
    }

    /// @notice Create a bounty and lock its reward in escrow. Requires the
    ///         caller to have approved this contract for `reward` cUSD first.
    function createBounty(string calldata description, uint256 reward, uint256 deadline)
        external
        nonReentrant
        returns (uint256 bountyId)
    {
        if (reward < minReward) revert RewardTooLow();
        if (deadline <= block.timestamp) revert DeadlineInPast();

        bountyId = nextBountyId++;
        _bounties[bountyId] = Bounty({
            poster: msg.sender,
            hunter: address(0),
            reward: reward,
            deadline: deadline,
            status: Status.Open,
            description: description,
            proofURI: ""
        });
        _reputations[msg.sender].bountiesPosted++;

        emit BountyCreated(bountyId, msg.sender, reward, deadline);
        cUSD.safeTransferFrom(msg.sender, address(this), reward);
    }

    /// @notice Claim an open bounty as the hunter. First claim wins.
    function claimBounty(uint256 bountyId) external {
        Bounty storage b = _bounties[bountyId];
        if (b.status != Status.Open) revert InvalidStatus();
        if (b.poster == msg.sender) revert PosterCannotClaim();

        b.hunter = msg.sender;
        b.status = Status.InProgress;
        _reputations[msg.sender].bountiesClaimed++;

        emit BountyClaimed(bountyId, msg.sender);
    }

    /// @notice Submit a proof URI for a claimed bounty. Only the hunter.
    function submitProof(uint256 bountyId, string calldata proofURI) external {
        Bounty storage b = _bounties[bountyId];
        if (msg.sender != b.hunter) revert NotHunter();
        if (b.status != Status.InProgress) revert InvalidStatus();

        b.proofURI = proofURI;
        b.status = Status.PendingReview;

        emit ProofSubmitted(bountyId, proofURI);
    }

    /// @notice Approve the submitted proof and release the reward to the hunter.
    ///         Only the poster; follows checks-effects-interactions.
    function approveBounty(uint256 bountyId) external nonReentrant {
        Bounty storage b = _bounties[bountyId];
        if (msg.sender != b.poster) revert NotPoster();
        if (b.status != Status.PendingReview) revert InvalidStatus();

        b.status = Status.Completed;
        _reputations[b.poster].bountiesCompletedAsPoster++;
        _reputations[b.hunter].bountiesCompletedAsHunter++;
        _reputations[b.hunter].totalEarned += b.reward;
        _reputations[b.poster].totalSpent += b.reward;

        emit BountyApproved(bountyId, b.hunter, b.reward);
        cUSD.safeTransfer(b.hunter, b.reward);
    }

    /// @notice Cancel an unclaimed bounty and refund the poster in full.
    ///         Only the poster, only while Open.
    function cancelBounty(uint256 bountyId) external nonReentrant {
        Bounty storage b = _bounties[bountyId];
        if (msg.sender != b.poster) revert NotPoster();
        if (b.status != Status.Open) revert InvalidStatus();

        b.status = Status.Cancelled;

        emit BountyCancelled(bountyId);
        cUSD.safeTransfer(b.poster, b.reward);
    }

    /// @notice Open a dispute. Either party may call it while the bounty is
    ///         in progress or awaiting review.
    function disputeBounty(uint256 bountyId) external {
        Bounty storage b = _bounties[bountyId];
        if (msg.sender != b.poster && msg.sender != b.hunter) revert NotParty();
        if (b.status != Status.InProgress && b.status != Status.PendingReview) {
            revert InvalidStatus();
        }

        b.status = Status.Disputed;

        emit BountyDisputed(bountyId);
    }

    /// @notice Resolve a dispute, paying the hunter or refunding the poster.
    ///         Admin-only for MVP; follows checks-effects-interactions.
    function resolveDispute(uint256 bountyId, bool payHunter) external onlyAdmin nonReentrant {
        Bounty storage b = _bounties[bountyId];
        if (b.status != Status.Disputed) revert InvalidStatus();

        address recipient;
        if (payHunter) {
            b.status = Status.Completed;
            _reputations[b.poster].bountiesCompletedAsPoster++;
            _reputations[b.hunter].bountiesCompletedAsHunter++;
            _reputations[b.hunter].totalEarned += b.reward;
            _reputations[b.poster].totalSpent += b.reward;
            recipient = b.hunter;
        } else {
            b.status = Status.Cancelled;
            recipient = b.poster;
        }

        emit DisputeResolved(bountyId, payHunter);
        cUSD.safeTransfer(recipient, b.reward);
    }

    /// @notice Read the full bounty struct.
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return _bounties[bountyId];
    }

    /// @notice Read a wallet's on-chain reputation counters.
    function getReputation(address user) external view returns (Reputation memory) {
        return _reputations[user];
    }
}
