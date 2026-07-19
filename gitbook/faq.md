# FAQ

**Can I post a bounty in CELO instead of cUSD?**
Yes — the contract accepts either cUSD or native CELO's ERC-20 wrapper as the reward token, picked per-bounty via a token selector in the create form. See [Design Decisions](architecture/design-decisions.md#cusd--celo-only-no-arbitrary-erc-20-support).

**Can I use another ERC-20 as the reward token?**
Not currently — `createBounty` reverts `TokenNotAllowed` for anything besides cUSD and CELO, both fixed at deploy time. Arbitrary ERC-20 support is explicitly out of scope for this version; see the non-goals in `docs/REQUIREMENTS.md`.

**Why does approving a bounty take two transactions sometimes?**
`createBounty` needs an `approve` first only if your existing allowance for the chosen reward token is below the reward amount. The frontend checks this per-token and skips the extra transaction when it's not needed. See [Lifecycle Walkthrough → Post & Lock](guides/lifecycle-walkthrough.md#1-post--lock).

**Why isn't the bounty list updating instantly after I create one?**
There's a small delay — the [indexer](indexer/overview.md) polls on an interval (default 15s) rather than reacting to events in real time. The contract state itself is instant; only the indexed read-copy lags briefly.

**What happens if the indexer goes down?**
Reads get stale (or empty, if it's never run) but nothing is at risk — the contract holds the real state regardless, and the indexer rebuilds every row from a live contract read the moment it's back up. See [Architecture → Contract Wins](architecture/overview.md#contract-wins).

**Who can resolve a dispute?**
A single admin wallet, for now — a known, documented tradeoff. See [Security → Known Centralization Tradeoff](security.md#known-centralization-tradeoff).

**Is this deployed on mainnet or just testnet?**
Mainnet. See [Smart Contract → Deployed Addresses](smart-contract/overview.md#deployed-addresses). Alfajores staging was skipped because its public RPC has been unreachable since Celo's L2 migration — see [Deployment → A Note on Alfajores](smart-contract/deployment.md#a-note-on-alfajores).

**Where do I report a bug?**
[GitHub Issues](https://github.com/Im-A-Nuel/quincy). See [Security → Reporting](security.md#reporting).
