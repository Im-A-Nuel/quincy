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
| `DATABASE_URL` | Postgres connection string (Neon/Supabase) |
| `CELO_RPC_URL` | Celo RPC endpoint |
| `QUINCY_ADDRESS` | Deployed contract address |
| `START_BLOCK` | Block to index from (contract deploy block) |
| `POLL_INTERVAL_MS` | Delay between polls |
| `BLOCK_RANGE` | Max blocks per `getLogs` call |

## Deploy (24/7 worker)

The indexer is a long-running process, not a serverless function. Run it as a
background worker.

**Render** (blueprint included): push to GitHub, then on render.com choose
New > Blueprint and select this repo. `render.yaml` provisions a Docker worker;
set `DATABASE_URL` in the dashboard (other vars are pre-filled).

**Docker** (any host):

```bash
cd indexer
docker build -t quincy-indexer .
docker run -e DATABASE_URL=... -e CELO_RPC_URL=https://forno.celo.org \
  -e QUINCY_ADDRESS=0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5 \
  -e START_BLOCK=72544655 quincy-indexer
```

Run `npm run migrate` once against the database before first start.
