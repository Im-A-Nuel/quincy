# Quincy

**Escrow-backed micro-task bounty marketplace on Celo, built MiniPay-first.**

Quincy lets anyone post a small task with a reward locked in a smart contract. A worker claims the task, completes it, and submits proof; when the poster approves, the contract releases the reward automatically. Funds are always held by the contract - never by Quincy - so payment is guaranteed by code, not by trust.

---

## Why Quincy

Informal micro-task work (running errands, small research, simple design, translation) happens constantly, but usually without any payment guarantee. Posters can delay or avoid paying after work is delivered, and workers have no way to enforce payment without a trusted middleman. Quincy removes that risk by escrowing the reward on-chain **before** the work begins.

- **Non-custodial** - all funds move only through the smart contract.
- **Stable rewards** - bounties are paid in cUSD, a Celo stablecoin, so value doesn't swing between posting and payout.
- **On-chain reputation** - every completed bounty builds a public, verifiable track record for both sides.
- **MiniPay-first** - designed to run inside the MiniPay in-app browser with one-tap wallet connect on low-end devices.

---

## How it works

1. **Post & lock** - a poster creates a bounty and locks the cUSD reward in the escrow contract.
2. **Claim & work** - a worker (hunter) claims the open bounty and completes the task off-chain.
3. **Submit proof** - the hunter uploads proof to IPFS and submits the link on-chain.
4. **Approve & pay** - the poster approves, and the contract releases the reward to the hunter instantly.

If a bounty is never claimed, the poster can cancel it and get a full refund. If a proof is disputed, an admin resolves it manually (a decentralized dispute mechanism is planned for later).

Each lifecycle step is a separate on-chain transaction, giving a clean, auditable trail from creation to payout.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Wallet | wagmi v2 + viem, MiniPay auto-connect |
| Smart contract | Solidity ^0.8.24, Foundry, OpenZeppelin |
| Indexer | Node.js + viem, mirrors contract events into Postgres |
| Database | Postgres (Supabase) - read layer only |
| Chain | Celo Mainnet (primary), Alfajores (staging) |
| Token | cUSD |
| Proof storage | IPFS via web3.storage |

The smart contract is the single source of truth for funds and bounty status. The indexer and database exist only to make reads fast; if they ever disagree with the contract, the contract wins.

---

## Repository structure

```
quincy/
├── frontend/        # Next.js app (UI, wallet, read API client)
├── smartcontract/   # Foundry project: QuincyBounty.sol + tests
└── docs/            # Architecture, requirements, schema, API reference
```

Reads (bounty lists, profiles) are served from the indexer-backed API. Writes (create, claim, submit, approve, cancel, dispute) go directly from the frontend to the contract via the connected wallet.

---

## Getting started (frontend)

Requirements: Node.js 18+ and npm.

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

To explore the UI without a deployed contract or indexer, enable mock data:

```bash
# in frontend/.env.local
NEXT_PUBLIC_USE_MOCKS=1
```

With mocks on, the landing page, bounty list, bounty detail, and profile pages render from sample data.

### Frontend scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting |

### Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CHAIN` | Active network: `celo` or `alfajores` |
| `NEXT_PUBLIC_CELO_RPC` | Celo mainnet RPC URL |
| `NEXT_PUBLIC_ALFAJORES_RPC` | Alfajores testnet RPC URL |
| `NEXT_PUBLIC_QUINCY_ADDRESS_CELO` | Deployed contract address (mainnet) |
| `NEXT_PUBLIC_QUINCY_ADDRESS_ALFAJORES` | Deployed contract address (testnet) |
| `NEXT_PUBLIC_API_BASE` | Read API base path |
| `NEXT_PUBLIC_W3S_TOKEN` | web3.storage token for IPFS uploads |
| `NEXT_PUBLIC_USE_MOCKS` | Set to `1` to render the UI from sample data |

---

## Smart contract

`QuincyBounty.sol` holds all escrow logic and bounty state. Core functions:

- `createBounty` - lock a cUSD reward and open a bounty
- `claimBounty` - a hunter claims an open bounty
- `submitProof` - the hunter submits an IPFS proof URI
- `approveBounty` - the poster approves and the reward is released
- `cancelBounty` - the poster refunds an unclaimed bounty
- `disputeBounty` / `resolveDispute` - dispute flow (admin-resolved)

Every state-changing function emits an event; the indexer subscribes to these events as its sole write path into the database.

See `docs/` for the full architecture, requirements, database schema, and contract interface.

---

## Deployed contract

`QuincyBounty` is live on **Celo Mainnet**:

- Address: [`0x4a81cf92d285a9b92fecb1ea187cd2466e048b21`](https://celoscan.io/address/0x4a81cf92d285a9b92fecb1ea187cd2466e048b21)
- Deploy tx: `0xa7937dde4a2707dd0469874a4c07a408ad9650ec64265e53b4ac79dce2f8d82b`

See `docs/DEPLOYMENTS.md` for full deployment details.

## Status

Quincy is under active development. The frontend read experience (browse, detail, profile) is in place and the escrow contract is deployed on Celo Mainnet; the event indexer is being built out next.

---

## License

MIT
