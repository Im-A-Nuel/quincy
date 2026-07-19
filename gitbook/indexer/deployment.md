# Deployment

The standalone indexer (`indexer/`) is a **long-running worker**, not a serverless function — it needs a host that keeps a process alive continuously, not one that spins up per-request. That costs money on every host that offers it (Render's free tier doesn't cover background workers).

## Vercel Cron (recommended - free, no extra host)

The sync logic (`processRange`/`syncBounty`/`syncReputation`, ported to run once per invocation instead of looping) lives in `frontend/src/lib/server/sync.ts` and is exposed through two routes:

* **`/api/cron/sync`** - protected. Requires `Authorization: Bearer <CRON_SECRET>` whenever a `CRON_SECRET` env var is set in the Vercel project; Vercel's own cron invoker sends that header automatically. This is the one `frontend/vercel.json` schedules.
* **`/api/sync-now`** - unauthenticated. Meant to be called from the browser, not a scheduler - see below.

`frontend/vercel.json` schedules `/api/cron/sync` daily via [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) - no separate worker to host, it deploys as part of the normal frontend deploy.

* **Cron frequency is capped by plan.** Vercel's Hobby (free) tier only allows a cron job to fire once per day - a shorter schedule (e.g. every 5 min) fails deployment outright. `frontend/vercel.json` uses `0 3 * * *` to stay within that limit; bump it to something like `*/5 * * * *` if the project is on Pro.
* To keep data fresh despite the once-daily cron on Hobby, every write hook in `frontend/src/hooks/useBountyActions.ts` also fires a best-effort nudge (`frontend/src/lib/triggerSync.ts`) at `/api/sync-now` a few seconds after its own transaction, so the acting user sees their own change without waiting for the cron. `/api/sync-now` has no secret check on purpose - the browser can't know a server secret - which is safe here since the route can only touch the indexed read-copy, never funds; worst case of it being publicly callable is a redundant, idempotent sync. This nudge is fire-and-forget and only covers the acting wallet's own writes - the daily cron is the only thing guaranteed to catch changes made by other users.
* Each run (either route) processes at most ~3000 new blocks (`MAX_BLOCK_RANGE` in `sync.ts`) to stay inside the serverless function's execution limit; a large catch-up gap resolves itself over a few ticks instead of one call.
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
