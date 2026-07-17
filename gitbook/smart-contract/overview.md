# Overview

`QuincyBounty.sol` is a single, non-upgradeable Solidity contract that holds every bounty's escrowed cUSD and its full lifecycle state. It is the sole source of truth — see [Architecture → Contract Wins](../architecture/overview.md#contract-wins).

## Deployed addresses

| Network | Address |
|---|---|
| Celo Mainnet | [`0x4a81cf92d285a9b92fecb1ea187cd2466e048b21`](https://celoscan.io/address/0x4a81cf92d285a9b92fecb1ea187cd2466e048b21) |
| Alfajores | Not deployed (public testnet RPC unreachable at deploy time) |

Full deployment record (tx hash, block, admin address, deploy date) lives in `docs/DEPLOYMENTS.md` in the repo.

## State model

```solidity
enum Status { Open, InProgress, PendingReview, Completed, Cancelled, Disputed }

struct Bounty {
    address poster;
    address hunter;
    uint256 reward;
    uint256 deadline;
    Status status;
    string description;  // JSON-encoded {title, category, description} - see below
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
```

Every bounty and every wallet's reputation counters live in contract storage (`mapping(uint256 => Bounty)`, `mapping(address => Reputation)`), readable via `getBounty(id)` / `getReputation(address)`.

## Lifecycle

```
Open ──claim──▶ InProgress ──submitProof──▶ PendingReview ──approve──▶ Completed
  │                  │                            │
  └──cancel──▶ Cancelled                           ├──dispute──▶ Disputed ──resolveDispute(true)──▶ Completed
                                                    │                    └─resolveDispute(false)─▶ Cancelled
                                                    └──dispute──▶ Disputed (same as above)
```

Each arrow is a separate transaction — see [Design Decisions → One Transaction Per Step](../architecture/design-decisions.md#one-transaction-per-lifecycle-step).

See [Functions](functions.md) and [Events](events.md) for the full interface.
