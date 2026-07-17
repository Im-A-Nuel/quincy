# Quickstart

Run the Quincy frontend locally against sample data — no wallet, contract, or database required.

## Requirements

* Node.js 18+
* npm

## 1. Install

```bash
git clone https://github.com/Im-A-Nuel/quincy.git
cd quincy/frontend
npm install
```

## 2. Enable mock data

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_USE_MOCKS=1
```

With mocks on, the landing page, bounty list, bounty detail, and profile pages render from sample data — no backend needed.

## 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Next steps

* Want to connect a real wallet and the deployed contract? See [Environment Variables](environment-variables.md).
* Want to understand how the pieces fit together first? See [Architecture Overview](../architecture/overview.md).
