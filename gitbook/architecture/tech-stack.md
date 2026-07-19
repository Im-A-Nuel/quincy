# Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Smart contract | Solidity ^0.8.24, Foundry, OpenZeppelin | `ReentrancyGuard`, `IERC20`/`SafeERC20`. No proxy/upgradeability. |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS | No heavy UI kit — bundle target under 500KB gzipped for low-end MiniPay devices. |
| Wallet | wagmi v2 + viem | Custom `useMiniPay()` hook detects `window.ethereum.isMiniPay` and auto-connects. |
| Backend | Next.js API Routes | Read-only. Every write bypasses this entirely — see [Overview](overview.md#the-non-negotiable-rule-readwrite-split). |
| Indexer | Node.js + viem | Polls contract logs, rebuilds rows from direct contract reads. |
| Database | Postgres (Neon) | Indexed read layer only, never a source of truth. |
| Chain | Celo Mainnet (primary), Alfajores (staging, currently unreachable via public RPC) | |
| Token | cUSD or CELO, picked per bounty | See [Design Decisions](design-decisions.md#cusd--celo-only-no-arbitrary-erc-20-support). |
| Proof storage | IPFS via Pinata | Hunters upload client-side through `/api/upload`; only the CID goes on-chain. |
| Hosting | Vercel (frontend + API routes), Render (indexer worker) | |

## Frontend conventions worth knowing

* **No `next/image`** — plain `<img>` tags throughout, images pre-optimized (resized/compressed) at generation time instead of relying on runtime optimization.
* **No animation library** — all motion (spring easing, scroll-reveal, confetti, count-up numbers) is hand-rolled CSS/Canvas to keep the bundle light. See [Frontend → Design System](../frontend/design-system.md).
* **No global state library** — TanStack Query for server state, component state for everything else.
