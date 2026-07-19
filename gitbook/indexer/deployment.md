# Deployment

The standalone indexer (`indexer/`) is a **long-running worker**, not a serverless function — it needs a host that keeps a process alive continuously, not one that spins up per-request. That costs money on every host that offers it (Render's free tier doesn't cover background workers).

## Vercel Cron (recommended - free, no extra host)

`frontend/src/app/api/cron/sync/route.ts` is a serverless port of the same sync logic (`processRange`/`syncBounty`/`syncReputation`), refactored to run once per invocation instead of looping. `frontend/vercel.json` schedules it daily via [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) - no separate worker to host, it deploys as part of the normal frontend deploy.

* **Cron frequency is capped by plan.** Vercel's Hobby (free) tier only allows a cron job to fire once per day - a shorter schedule (e.g. every 5 min) fails deployment outright. `frontend/vercel.json` uses `0 3 * * *` to stay within that limit; bump it to something like `*/5 * * * *` if the project is on Pro.
* To keep data fresh despite the once-daily cron on Hobby, every write hook in `frontend/src/hooks/useBountyActions.ts` also fires a best-effort nudge (`frontend/src/lib/triggerSync.ts`) at the same route a few seconds after its own transaction, so the acting user sees their own change without waiting for the cron. This is fire-and-forget and does not cover changes made by other users/wallets - the daily cron is the only thing guaranteed to catch those.
* Each run processes at most ~3000 new blocks (`MAX_BLOCK_RANGE` in `sync.ts`) to stay inside the serverless function's execution limit; a large catch-up gap resolves itself over a few ticks instead of one call.
* Optionally set a `CRON_SECRET` env var in the Vercel project - the route then requires `Authorization: Bearer <CRON_SECRET>`, which Vercel's own cron invoker sends automatically when that env var is present. Note this also blocks the client-side nudge above (it can't know the secret), leaving the daily cron as the only sync path until the next write from a session that predates the secret.
* Trade-off vs. the standalone worker: without the write-triggered nudge, data could lag up to a day; with it, the acting user's own changes appear within seconds, other users' changes lag up to a day on Hobby.

Use the standalone worker instead if you need faster propagation or you're already paying for an always-on host:

## Render

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
  -e QUINCY_ADDRESS=0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5 \
  -e START_BLOCK=72544655 \
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
