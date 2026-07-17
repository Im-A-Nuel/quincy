# Overview

The indexer is a small Node.js + viem worker that mirrors on-chain `QuincyBounty` events into Postgres so the frontend's list/filter/search pages don't have to scan chain logs on every request. It holds no authority — see [Architecture → Contract Wins](../architecture/overview.md#contract-wins).

## How it works

1. Poll the Celo RPC for `QuincyBounty` logs in block ranges, starting from a persisted checkpoint (or `START_BLOCK` on first run).
2. Stay `CONFIRMATIONS` (5) blocks behind the chain head — forno is load-balanced, and a lagging node can reject `getLogs` for a block it hasn't seen yet.
3. For every log in a range, note which bounty id and which wallets it touched (not the event payload itself).
4. For each touched bounty id, call `getBounty(id)` and upsert the full row — decoding the JSON metadata packed into `description` (see [Design Decisions → On-chain Metadata](../architecture/design-decisions.md#metadata-packed-into-the-on-chain-description-field)).
5. For each touched wallet, call `getReputation(address)` and upsert its counters.
6. Persist the new checkpoint.
7. Sleep `POLL_INTERVAL_MS`, repeat.

A poll-cycle error (a flaky RPC call) is logged and retried on the next cycle rather than crashing the process.

## Why rebuild instead of accumulate

Because every row is rebuilt from a direct contract read rather than derived by applying event deltas, the mirror **cannot drift** from on-chain state — a missed or duplicated event just means a slightly stale row until the next event touches that bounty again, never a wrong one.

## Schema

```sql
bounties (id, poster_address, hunter_address, title, description, category,
          reward_amount, status, proof_uri, deadline, created_at, updated_at,
          tx_hash_created, tx_hash_completed)

reputations (wallet_address, bounties_posted, bounties_completed_as_poster,
             bounties_claimed, bounties_completed_as_hunter,
             total_earned, total_spent)

indexer_state (last_block)   -- single-row checkpoint
```

Full DDL is in `indexer/sql/schema.sql`; apply it with `npm run migrate` (idempotent — every statement is `IF NOT EXISTS`).
