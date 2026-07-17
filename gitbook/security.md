# Security

## Contract

* **Reentrancy** — every fund-moving function (`createBounty`, `approveBounty`, `cancelBounty`, `resolveDispute`) is `nonReentrant` and follows checks-effects-interactions: state is updated before the external `cUSD` transfer call.
* **Escrow correctness** — proven by a Foundry invariant test, not just asserted: the contract's cUSD balance must always equal the sum of rewards for every bounty still in an escrow-holding status. See [Testing](smart-contract/testing.md).
* **Front-running** — `claimBounty` is first-claim-wins via a single status check; no auction mechanism, no MEV surface worth exploiting at this scale.
* **Static analysis** — run through Slither; one informational finding (timestamp comparison, intentional), no high/medium issues. See [Testing → Static Analysis](smart-contract/testing.md#static-analysis).

## Known centralization tradeoff

The dispute-resolver (`admin`) is a single EOA, set immutably at deploy time. This is a deliberate MVP tradeoff, not an oversight — see [Design Decisions → Admin-Resolved Disputes](architecture/design-decisions.md#admin-resolved-disputes-not-daovoting). The plan is to move this role to a Safe multisig once real dispute volume justifies the operational overhead. Until then, whoever holds that key can resolve any dispute — for either party — but **cannot** touch funds outside an active dispute; every other fund movement requires the poster's or hunter's own signature.

## Frontend / infrastructure

* **No off-chain custody, ever.** The backend (API routes) is read-only end to end — see [Architecture → Read/Write Split](architecture/overview.md#the-non-negotiable-rule-readwrite-split). It cannot move funds even in principle; there's no code path that holds a private key or calls a write function.
* **Secrets** — `DATABASE_URL`, `PINATA_JWT`, and the deployer's `PRIVATE_KEY` live only in environment variables / hosting-platform secret stores, never in the repo. `.env*` files are git-ignored throughout the monorepo.
* **Indexer trust model** — the indexer only ever *reads* the contract and *writes* to its own Postgres mirror; it has no wallet, no ability to submit transactions, and its output is fully re-derivable from the chain at any time (see [Indexer → Overview](indexer/overview.md#why-rebuild-instead-of-accumulate)).

## Reporting

This is a hackathon-stage project without a formal bug bounty. If you find something concerning, please open an issue on [GitHub](https://github.com/Im-A-Nuel/quincy) rather than a public PR that exposes the details before a fix ships.
