# Project Status

## Done

* **Smart contract** — `QuincyBounty.sol` deployed and live on Celo Mainnet, supporting both cUSD and CELO as reward tokens. Full lifecycle implemented, 100% line/function test coverage plus a per-token escrow-balance invariant, Slither-clean.
* **Frontend** — every page listed in [Frontend → Overview](frontend/overview.md) built and deployed, including the full write-flow UI (create, claim, submit proof with real IPFS upload, approve, cancel, dispute), a complete soft/indigo design system with dark mode, and a marketing landing page.
* **Indexer** — built and verified live against the deployed contract and a production Postgres database (Neon). Deploy tooling (Dockerfile, Render blueprint) is ready.
* **API** — `/api/v1/bounties` and `/api/v1/profiles/:address` implemented and reading real indexed data.

## Not yet done

* **Indexer isn't running continuously.** It's been verified to work correctly, but isn't deployed as an always-on worker yet — see [Indexer → Deployment](indexer/deployment.md). Until it is, the frontend's list/search pages will show stale or empty data even though the contract itself has activity.
* **No bounties have been created on mainnet yet.** The deployer wallet holds CELO for gas but no cUSD, so the full lifecycle hasn't been exercised end-to-end against real funds. See [FAQ](faq.md) if you're wondering why the app currently shows an empty state.
* **Alfajores (staging) has no deployment.** Its public RPC has been unreachable since Celo's L2 migration — see [Deployment → A Note on Alfajores](smart-contract/deployment.md#a-note-on-alfajores).
* **Celoscan source verification** is unconfirmed — it was flaky immediately post-deploy (indexing lag) and hasn't been retried.

## Explicitly out of scope

Carried over from the original requirements and still true:

* Arbitrary ERC-20 reward tokens beyond cUSD and CELO (see [Design Decisions](architecture/design-decisions.md#cusd--celo-only-no-arbitrary-erc-20-support))
* DAO/voting-based dispute resolution (admin-resolved — see [Security](security.md#known-centralization-tradeoff))
* A proxy/upgradeable contract pattern
* A native mobile app outside the MiniPay Mini App
* Star ratings or text reviews (numeric reputation counters only)
* Push notifications
