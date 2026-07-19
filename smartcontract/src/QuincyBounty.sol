// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title QuincyBounty
/// @notice Escrow contract for micro-task bounties, payable in cUSD or CELO.
///         The contract holds all funds; each lifecycle step is a separate
///         transaction and emits an event that the off-chain indexer mirrors
///         into Postgres.
/// @dev `minReward` is a single raw-unit threshold applied to whichever token
///      a bounty uses. Since cUSD and CELO are not equal in USD value, this is
///      a deliberate MVP simplification, not a price-equivalence guarantee.
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
        address token;
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
        uint256 totalEarnedCUSD;
        uint256 totalSpentCUSD;
        uint256 totalEarnedCELO;
        uint256 totalSpentCELO;
    }

    /// @notice The cUSD token - one of two allowed reward tokens.
    IERC20 public immutable cUSD;
    /// @notice The native CELO token (ERC20-wrapped) - the other allowed reward token.
    IERC20 public immutable celoToken;
    /// @notice Address allowed to resolve disputes (single EOA for MVP).
    address public immutable admin;
    /// @notice Minimum reward (raw token units), to avoid dust-value spam bounties.
    uint256 public immutable minReward;
    /// @notice Id assigned to the next created bounty.
    uint256 public nextBountyId = 1;

    mapping(uint256 => Bounty) private _bounties;
    mapping(address => Reputation) private _reputations;

    event BountyCreated(
        uint256 indexed bountyId,
        address indexed poster,
        address indexed token,
        uint256 reward,
        uint256 deadline
    );
    event BountyClaimed(uint256 indexed bountyId, address indexed hunter);
    event ProofSubmitted(uint256 indexed bountyId, string proofURI);
    event BountyApproved(uint256 indexed bountyId, address indexed hunter, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId);
    event BountyDisputed(uint256 indexed bountyId);
    event DisputeResolved(uint256 indexed bountyId, bool paidHunter);

    error ZeroAddress();
    error TokenNotAllowed();
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

    constructor(address cusd, address celo, address admin_, uint256 minReward_) {
        if (cusd == address(0) || celo == address(0) || admin_ == address(0)) {
            revert ZeroAddress();
        }
        cUSD = IERC20(cusd);
        celoToken = IERC20(celo);
        admin = admin_;
        minReward = minReward_;
    }

    /// @notice True if `token` is one of the two allowed reward tokens.
    function isAllowedToken(address token) public view returns (bool) {
        return token == address(cUSD) || token == address(celoToken);
    }

    /// @notice Create a bounty and lock its reward in escrow. Requires the
    ///         caller to have approved this contract for `reward` of `token`
    ///         first. `token` must be cUSD or CELO.
    function createBounty(
        address token,
        string calldata description,
        uint256 reward,
        uint256 deadline
    ) external nonReentrant returns (uint256 bountyId) {
        if (!isAllowedToken(token)) revert TokenNotAllowed();
        if (reward < minReward) revert RewardTooLow();
        if (deadline <= block.timestamp) revert DeadlineInPast();

        bountyId = nextBountyId++;
        _bounties[bountyId] = Bounty({
            poster: msg.sender,
            hunter: address(0),
            token: token,
            reward: reward,
            deadline: deadline,
            status: Status.Open,
            description: description,
            proofURI: ""
        });
        _reputations[msg.sender].bountiesPosted++;

        emit BountyCreated(bountyId, msg.sender, token, reward, deadline);
        IERC20(token).safeTransferFrom(msg.sender, address(this), reward);
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
        _recordPayout(b.poster, b.hunter, b.token, b.reward);

        emit BountyApproved(bountyId, b.hunter, b.reward);
        IERC20(b.token).safeTransfer(b.hunter, b.reward);
    }

    /// @notice Cancel an unclaimed bounty and refund the poster in full.
    ///         Only the poster, only while Open.
    function cancelBounty(uint256 bountyId) external nonReentrant {
        Bounty storage b = _bounties[bountyId];
        if (msg.sender != b.poster) revert NotPoster();
        if (b.status != Status.Open) revert InvalidStatus();

        b.status = Status.Cancelled;

        emit BountyCancelled(bountyId);
        IERC20(b.token).safeTransfer(b.poster, b.reward);
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
            _recordPayout(b.poster, b.hunter, b.token, b.reward);
            recipient = b.hunter;
        } else {
            b.status = Status.Cancelled;
            recipient = b.poster;
        }

        emit DisputeResolved(bountyId, payHunter);
        IERC20(b.token).safeTransfer(recipient, b.reward);
    }

    /// @dev Shared reputation bookkeeping for a successful payout, whether via
    ///      approveBounty or an admin resolving a dispute in the hunter's favor.
    function _recordPayout(address poster, address hunter, address token, uint256 reward) private {
        _reputations[poster].bountiesCompletedAsPoster++;
        _reputations[hunter].bountiesCompletedAsHunter++;
        if (token == address(cUSD)) {
            _reputations[hunter].totalEarnedCUSD += reward;
            _reputations[poster].totalSpentCUSD += reward;
        } else {
            _reputations[hunter].totalEarnedCELO += reward;
            _reputations[poster].totalSpentCELO += reward;
        }
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
