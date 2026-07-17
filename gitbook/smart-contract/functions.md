# Functions

## Write functions

### `createBounty`

```solidity
function createBounty(string calldata description, uint256 reward, uint256 deadline)
    external
    nonReentrant
    returns (uint256 bountyId)
```

Locks `reward` cUSD in escrow and opens a bounty. Caller must have called `approve` on the cUSD contract for at least `reward` first — `createBounty` pulls funds via `transferFrom`.

* Reverts `RewardTooLow` if `reward < minReward`.
* Reverts `DeadlineInPast` if `deadline <= block.timestamp`.
* Emits `BountyCreated`.

### `claimBounty`

```solidity
function claimBounty(uint256 bountyId) external
```

Caller becomes the hunter. First claim wins — no auction.

* Reverts `InvalidStatus` if the bounty isn't `Open`.
* Reverts `PosterCannotClaim` if the caller is the poster.
* Emits `BountyClaimed`.

### `submitProof`

```solidity
function submitProof(uint256 bountyId, string calldata proofURI) external
```

Only the current hunter. `proofURI` is typically an `ipfs://` URI.

* Reverts `NotHunter` if the caller isn't the bounty's hunter.
* Reverts `InvalidStatus` if the bounty isn't `InProgress`.
* Emits `ProofSubmitted`.

### `approveBounty`

```solidity
function approveBounty(uint256 bountyId) external nonReentrant
```

Only the poster. Transfers the escrowed reward to the hunter and increments both parties' reputation counters.

* Reverts `NotPoster` if the caller isn't the bounty's poster.
* Reverts `InvalidStatus` if the bounty isn't `PendingReview`.
* Emits `BountyApproved`.

### `cancelBounty`

```solidity
function cancelBounty(uint256 bountyId) external nonReentrant
```

Only the poster, only while `Open`. Refunds the full reward.

* Reverts `NotPoster`.
* Reverts `InvalidStatus` if the bounty isn't `Open` (i.e. it's already been claimed).
* Emits `BountyCancelled`.

### `disputeBounty`

```solidity
function disputeBounty(uint256 bountyId) external
```

Either the poster or the hunter, while `InProgress` or `PendingReview`.

* Reverts `NotParty` if the caller is neither the poster nor the hunter.
* Reverts `InvalidStatus` otherwise.
* Emits `BountyDisputed`.

### `resolveDispute`

```solidity
function resolveDispute(uint256 bountyId, bool payHunter) external onlyAdmin nonReentrant
```

Admin-only. `payHunter = true` pays the hunter and marks `Completed`; `false` refunds the poster and marks `Cancelled`.

* Reverts `NotAdmin` if the caller isn't the configured admin address.
* Reverts `InvalidStatus` if the bounty isn't `Disputed`.
* Emits `DisputeResolved`.

## Read functions

### `getBounty`

```solidity
function getBounty(uint256 bountyId) external view returns (Bounty memory)
```

Returns the full `Bounty` struct, including a zeroed one for an id that was never created.

### `getReputation`

```solidity
function getReputation(address user) external view returns (Reputation memory)
```

Returns a wallet's on-chain reputation counters (zeroed if the wallet has no activity).

## Custom errors

| Error | Thrown when |
|---|---|
| `ZeroAddress()` | Constructor called with a zero cUSD or admin address |
| `RewardTooLow()` | `createBounty` reward is below `minReward` |
| `DeadlineInPast()` | `createBounty` deadline is not in the future |
| `InvalidStatus()` | Action attempted from a status that doesn't allow it |
| `NotPoster()` | Caller isn't the bounty's poster |
| `NotHunter()` | Caller isn't the bounty's hunter |
| `NotParty()` | Caller is neither poster nor hunter |
| `NotAdmin()` | Caller isn't the configured admin |
| `PosterCannotClaim()` | Poster tried to claim their own bounty |
