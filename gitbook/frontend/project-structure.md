# Project Structure

```
frontend/src/
├── app/                    # Next.js App Router - pages, layouts, API routes
│   ├── api/
│   │   ├── v1/              # read routes (bounties, profiles) - see API Reference
│   │   └── upload/           # IPFS proof upload (Pinata)
│   ├── bounties/[id]/       # detail page + its dynamic OG image
│   ├── opengraph-image.tsx  # default social share card (next/og)
│   ├── manifest.ts           # PWA manifest
│   └── layout.tsx            # root layout: font, theme init script, splash screens
│
├── components/
│   ├── ui/                  # generic primitives: Button, Card, Chip, Avatar, TxButton...
│   ├── bounty/               # bounty-specific: BountyCard, ClaimAction, SubmitProofAction...
│   ├── landing/               # marketing page sections
│   ├── home/                  # connected-dashboard sections
│   ├── profile/                # reputation page sections
│   ├── nav/                    # AppShell, TopNav, BottomNav, ScrollProgressBar
│   ├── toast/                   # toast notification system
│   └── illustrations/            # hand-coded SVG spot illustrations
│
├── hooks/                   # useBounties, useCusd, useBountyActions, useMiniPay,
│                              # useCountUp, useInView, useSlidingIndicator...
│
├── lib/
│   ├── api.ts                # read API client (mock-aware)
│   ├── chains.ts               # chain/contract/cUSD address config
│   ├── wagmi.ts                 # wagmi config (injected connector for MiniPay)
│   ├── metadata.ts               # title/category/description JSON codec
│   ├── abi/                       # QuincyBounty + ERC20 ABIs
│   ├── server/                     # server-only: Postgres pool, row mappers
│   └── confetti.ts, units.ts, format.ts, upload.ts, ...
│
└── public/                  # generated icons, illustrations, splash screens
```

## Conventions

* **One file per component**, named after the export.
* **`"use client"` only where needed** — most of `components/ui` and `hooks` are client components (they use React state/effects or wagmi); server-only code lives under `lib/server/` and is never imported from a client file.
* **No `next/image`** — see [Tech Stack](../architecture/tech-stack.md#frontend-conventions-worth-knowing).
* **Mock branches live in `lib/api.ts` and `lib/mocks.ts`**, not scattered through components — a component never checks `NEXT_PUBLIC_USE_MOCKS` itself, it just calls the API client.
