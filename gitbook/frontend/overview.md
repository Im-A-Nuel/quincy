# Overview

The frontend is a Next.js 14 App Router application. It's the only piece end users interact with directly — the contract and indexer are invisible infrastructure behind it.

## Two halves

**Reads** go through Next.js API Routes (`/api/v1/*`) backed by Postgres — see [API Reference](../api-reference/bounties.md). **Writes** go directly from the browser to the contract via a connected wallet (wagmi) — see [Architecture → Read/Write Split](../architecture/overview.md#the-non-negotiable-rule-readwrite-split).

## MiniPay

Quincy is designed to run inside [MiniPay](https://www.opera.com/products/minipay)'s in-app browser first, with a normal-browser fallback second. A custom hook, `useMiniPay()`, checks `window.ethereum.isMiniPay` and auto-connects the wallet with no manual step when true — see `frontend/src/hooks/useMiniPay.ts`.

## Mock mode

Every page can render from static sample data instead of the live API, controlled by `NEXT_PUBLIC_USE_MOCKS=1`. This is how [Quickstart](../getting-started/quickstart.md) gets the whole UI running with zero backend setup — see `frontend/src/lib/mocks.ts` and the mock branches inside `frontend/src/lib/api.ts`.

## Pages

| Route | Purpose |
|---|---|
| `/` | Marketing landing (disconnected) or personalized dashboard (connected) |
| `/bounties` | Browse/search/filter open bounties |
| `/bounties/[id]` | Bounty detail, styled as an escrow receipt, with the contextual action for the connected wallet's role |
| `/create` | Post a bounty (approve cUSD → createBounty) |
| `/my` | The connected wallet's bounties, grouped by status |
| `/profile/[address]` | Public reputation page for any wallet |
| `/account` | Redirects to the connected wallet's own profile |

See [Project Structure](project-structure.md) for how the code backing these is organized.
