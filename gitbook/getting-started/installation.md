# Installation

Quincy is a monorepo with three independently runnable pieces. You rarely need all three at once — see [Quickstart](quickstart.md) if you just want the UI running.

```
quincy/
├── frontend/        # Next.js app (UI, wallet, read API client)
├── smartcontract/   # Foundry project: QuincyBounty.sol + tests
└── indexer/         # Node.js worker mirroring on-chain events into Postgres
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in values, see Environment Variables
npm run dev                  # http://localhost:3000
```

## Smart contract

Requires [Foundry](https://book.getfoundry.sh/getting-started/installation).

```bash
cd smartcontract
bash scripts/install-deps.sh   # forge-std + OpenZeppelin into lib/ (git-ignored)
forge build
forge test
```

`forge test` must pass before any deploy — see [Smart Contract → Testing](../smart-contract/testing.md).

## Indexer

```bash
cd indexer
npm install
cp .env.example .env   # DATABASE_URL, CELO_RPC_URL, QUINCY_ADDRESS, START_BLOCK
npm run migrate         # create tables (idempotent)
npm start                # begin indexing from START_BLOCK
```

See [Indexer → Deployment](../indexer/deployment.md) for running this continuously instead of locally.

## Putting it together

For the frontend to show real (non-mock) data, it needs the same `DATABASE_URL` the indexer writes to. Set `NEXT_PUBLIC_USE_MOCKS=0` and point both processes at the same Postgres database.
