# Events

Every state-changing function emits exactly one event. The [indexer](../indexer/overview.md) subscribes to all seven as its sole write path into Postgres — if a function doesn't emit, the indexer never sees the change.

| Event | Emitted by | Fields |
|---|---|---|
| `BountyCreated` | `createBounty` | `bountyId` (indexed), `poster` (indexed), `reward`, `deadline` |
| `BountyClaimed` | `claimBounty` | `bountyId` (indexed), `hunter` (indexed) |
| `ProofSubmitted` | `submitProof` | `bountyId` (indexed), `proofURI` |
| `BountyApproved` | `approveBounty` | `bountyId` (indexed), `hunter` (indexed), `reward` |
| `BountyCancelled` | `cancelBounty` | `bountyId` (indexed) |
| `BountyDisputed` | `disputeBounty` | `bountyId` (indexed) |
| `DisputeResolved` | `resolveDispute` | `bountyId` (indexed), `paidHunter` |

## How the indexer uses these

The indexer doesn't decode event payloads into database rows directly. Instead, each event just tells it *which* bounty id (and which wallets) changed; it then calls `getBounty(id)` / `getReputation(address)` directly and overwrites the corresponding row with the fresh on-chain state. This means:

* The event *payload* fields above matter less than the event *firing at all* — the indexer would work identically if every event carried only `bountyId`.
* The mirrored Postgres data can never drift from the contract, because it's always rebuilt from a live read, not accumulated from event deltas.

See [Indexer → How It Works](../indexer/overview.md#how-it-works) for the full poll loop.
