# Quincy

**Escrow-backed micro-task bounty marketplace on Celo, built MiniPay-first.**

Quincy lets anyone post a small task with a cUSD reward locked in a smart contract. A worker (a "hunter") claims the task, completes it, and submits proof; when the poster approves, the contract releases the reward automatically. Funds are always held by the contract — never by Quincy — so payment is guaranteed by code, not by trust.

## Why Quincy exists

Informal micro-task work — running errands, small research, simple design, translation — happens constantly, but usually without any payment guarantee. Posters can delay or avoid paying after work is delivered, and workers have no way to enforce payment without a trusted middleman. Quincy removes that risk by escrowing the reward on-chain **before** the work begins.

* **Non-custodial** — all funds move only through the smart contract.
* **Stable rewards** — bounties are paid in cUSD, a Celo stablecoin, so value doesn't swing between posting and payout.
* **On-chain reputation** — every completed bounty builds a public, verifiable track record for both sides.
* **MiniPay-first** — designed to run inside the MiniPay in-app browser with one-tap wallet connect on low-end devices.

## What's in this book

* **[Getting Started](getting-started/quickstart.md)** — run the app locally in a few minutes.
* **[Architecture](architecture/overview.md)** — how the frontend, contract, and indexer fit together.
* **[Smart Contract](smart-contract/overview.md)** — the escrow contract's functions, events, and deployed addresses.
* **[Frontend](frontend/overview.md)** — the Next.js app's structure and design system.
* **[Indexer](indexer/overview.md)** — how on-chain events become fast reads.
* **[API Reference](api-reference/bounties.md)** — the read-only REST endpoints the frontend calls.
* **[Guides](guides/lifecycle-walkthrough.md)** — walkthroughs of common flows.

## Quick links

| Resource | Link |
|---|---|
| Live app | [quincy-celo.vercel.app](https://quincy-celo.vercel.app) |
| Deployed contract (Celo Mainnet) | [`0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5`](https://celoscan.io/address/0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5) |
| Source code | [GitHub](https://github.com/Im-A-Nuel/quincy) |
