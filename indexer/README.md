# Quincy Indexer

A small Node.js + viem process that mirrors on-chain `QuincyBounty` events into
Postgres so the frontend can list and filter bounties quickly. The contract is
always the source of truth; the indexer is a read optimization only.

## How it works

1. Poll the Celo RPC for `QuincyBounty` logs in block ranges from a checkpoint.
2. For every affected bounty id, call `getBounty(id)` and upsert the full row
   (decoding the JSON metadata packed into the on-chain `description`).
3. For every affected wallet, call `getReputation(addr)` and upsert its counters.
4. Persist the last processed block so restarts resume where they left off.

Because each row is rebuilt from a direct contract read, the mirror can never
drift from on-chain state.

## Setup

```bash
npm install
cp .env.example .env    # fill in DATABASE_URL etc.
npm run migrate         # create tables
npm start               # begin indexing
```

## Environment

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (Supabase) |
| `CELO_RPC` | Celo RPC endpoint |
| `QUINCY_ADDRESS` | Deployed contract address |
| `START_BLOCK` | Block to index from (contract deploy block) |
| `POLL_INTERVAL_MS` | Delay between polls |
| `BLOCK_RANGE` | Max blocks per `getLogs` call |
