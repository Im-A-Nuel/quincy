# Overview

Quincy has three independently deployable pieces. The smart contract is the single source of truth for funds and bounty status; everything else exists to make reading that state fast.

```
                     ┌─────────────────────┐
                     │   MiniPay (Opera)    │
                     │  in-app browser WV    │
                     └──────────┬───────────┘
                                │
                     ┌──────────▼───────────┐
                     │  Next.js Frontend      │
                     │  - wagmi/viem client   │
                     │  - MiniPay hook        │
                     │  - API routes (reads)  │
                     └───┬──────────────┬─────┘
                         │ writes       │ reads
                         │ (tx)         │ (fast query)
             ┌───────────▼───┐   ┌──────▼─────────┐
             │  QuincyBounty  │   │  Postgres        │
             │  .sol (Celo    │   │  (Neon)          │
             │  mainnet)      │   │  indexed state    │
             └───────┬────────┘   └──────▲─────────┘
                     │ emits events        │
                     │                     │ writes
             ┌───────▼─────────────────────┴───┐
             │  Indexer (Node.js + viem)         │
             │  polls contract logs               │
             └────────────────────────────────────┘
```

## The non-negotiable rule: read/write split

* **All writes** — create, claim, submit proof, approve, cancel, dispute — go **directly from the frontend to the contract** via the connected wallet (wagmi). The backend never proxies a write.
* **All list reads** — bounty lists, filters, profiles — go through the **indexer-backed `/api/v1/*` API**. The frontend never scans chain logs itself.

This split exists because scanning chain logs for a filtered, sorted, paginated list directly from the browser is slow and RPC-expensive; a single detail read (`getBounty(id)`) is cheap enough that some pages could go either way, but the convention is kept consistent.

## Contract wins

If the indexer's Postgres mirror and the contract's actual state ever disagree, **the contract is authoritative**. The indexer rebuilds each row from a direct contract read (`getBounty`, `getReputation`) every time it processes a relevant event, so it structurally can't drift — see [Indexer → How It Works](../indexer/overview.md).

## Why this shape

* [Smart Contract](../smart-contract/overview.md) design decisions (single contract, no proxy, cUSD-only, one-tx-per-step)
* [Tech Stack](tech-stack.md) — what runs where and why
* [Design Decisions](design-decisions.md) — the tradeoffs behind the non-obvious choices
