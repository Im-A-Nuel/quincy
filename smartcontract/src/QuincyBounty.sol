// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

    /// @notice Read the full bounty struct.
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return _bounties[bountyId];
    }

    /// @notice Read a wallet's on-chain reputation counters.
    function getReputation(address user) external view returns (Reputation memory) {
        return _reputations[user];
    }
}
