# Deployment

The indexer is a **long-running worker**, not a serverless function — it needs a host that keeps a process alive continuously, not one that spins up per-request.

## Render (recommended)

A blueprint is included at `indexer/render.yaml`. On [render.com](https://render.com):

1. New → Blueprint, point it at this repo.
2. It provisions a Docker background worker from `indexer/Dockerfile` with `CELO_RPC_URL`, `QUINCY_ADDRESS`, `START_BLOCK`, `POLL_INTERVAL_MS`, and `BLOCK_RANGE` pre-filled.
3. Set `DATABASE_URL` in the dashboard (the only secret not baked into the blueprint).

## Docker (any host)

```bash
cd indexer
docker build -t quincy-indexer .
docker run \
  -e DATABASE_URL=postgresql://... \
  -e CELO_RPC_URL=https://forno.celo.org \
  -e QUINCY_ADDRESS=0x4a81cf92d285a9b92fecb1ea187cd2466e048b21 \
  -e START_BLOCK=72020154 \
  quincy-indexer
```

## Before first start

Run the migration once against whatever database you're pointing at:

```bash
cd indexer
npm install
npm run migrate
```

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon/Supabase) |
| `CELO_RPC_URL` | Celo RPC endpoint |
| `QUINCY_ADDRESS` | Deployed contract address |
| `START_BLOCK` | Block to index from — the contract's deploy block |
| `POLL_INTERVAL_MS` | Delay between poll cycles (default 15000) |
| `BLOCK_RANGE` | Max blocks per `getLogs` call (default 2000) |
