# Environment Variables

The frontend reads its configuration entirely from environment variables — no config files to edit. Copy `frontend/.env.example` to `frontend/.env.local` and fill in what you need.

## Chain & RPC

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_CHAIN` | Active network: `celo` (mainnet) or `alfajores` (staging) | `alfajores` |
| `NEXT_PUBLIC_CELO_RPC` | Celo mainnet RPC endpoint | `https://forno.celo.org` |
| `NEXT_PUBLIC_ALFAJORES_RPC` | Alfajores testnet RPC endpoint | `https://alfajores-forno.celo-testnet.org` |

## Contract

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_QUINCY_ADDRESS_CELO` | Deployed `QuincyBounty` address on mainnet |
| `NEXT_PUBLIC_QUINCY_ADDRESS_ALFAJORES` | Deployed address on testnet (not currently deployed) |

## Data & reads

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | Base path for the read API | `/api/v1` |
| `DATABASE_URL` | Postgres connection string the API routes read from (Neon/Supabase) | — |
| `NEXT_PUBLIC_USE_MOCKS` | Set to `1` to render every page from sample data instead of the API | `0` |

## Proof uploads

| Variable | Description |
|---|---|
| `PINATA_JWT` | Server-side JWT for the `/api/upload` route to pin proof files to IPFS. If unset, upload is disabled (501) and hunters paste a link/CID instead. |

## Common setups

**Local UI development, no backend:**

```bash
NEXT_PUBLIC_USE_MOCKS=1
```

**Full local stack against production data:**

```bash
NEXT_PUBLIC_USE_MOCKS=0
NEXT_PUBLIC_CHAIN=celo
NEXT_PUBLIC_CELO_RPC=https://forno.celo.org
DATABASE_URL=postgresql://...
PINATA_JWT=eyJ...
```

See [Deploying the Frontend](../frontend/deployment.md) for how these map to Vercel project settings.
