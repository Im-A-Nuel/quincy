# Design Decisions

The non-obvious choices, and why they were made.

## One transaction per lifecycle step

Create, claim, submit proof, approve, cancel, and dispute are each a **separate on-chain transaction** — never batched, even where combining two steps would save gas.

**Why:** this is deliberate, not an oversight. It maximizes verifiable on-chain transaction volume per completed bounty (4–6 tx per full lifecycle) and gives a clean audit trail for disputes. Celo gas fees are sub-cent, so the UX cost of extra confirmations is small relative to the traceability benefit.

## cUSD only, no multi-token support

The contract's token address is `immutable`, set once at deploy time to cUSD's canonical address.

**Why:** cUSD is a stablecoin — reward value doesn't move between posting and payout, which is the entire point of an escrow guarantee. MiniPay users already hold cUSD by default. Supporting arbitrary ERC-20s (or the native CELO token) would reintroduce the volatility problem the contract exists to remove, and was explicitly ruled out rather than just deferred — see `docs/REQUIREMENTS.md` in the repo for the original non-goals list.

## No proxy / upgradeable contract pattern

`QuincyBounty.sol` is a single, non-upgradeable contract.

**Why:** keeps the audit surface small for a solo build under time pressure, and avoids the class of bugs proxy patterns introduce (storage collisions, uninitialized implementations). Revisit only if the project continues past its initial scope.

## Admin-resolved disputes, not DAO/voting

`resolveDispute` is `onlyAdmin` — a single EOA for MVP.

**Why:** a voting mechanism needs its own token/quorum design that isn't worth building before there's real dispute volume to justify it. This is a known centralization tradeoff — the plan is to move the admin role to a Safe multisig once usage justifies it, not to decentralize dispute *resolution* logic itself.

## Custom indexer instead of a subgraph

A hand-rolled Node.js + viem poller, not The Graph.

**Why:** faster to stand up solo, full control over the schema. The Graph's hosting/deployment overhead wasn't justified at this scale — revisit if bounty volume grows significantly.

## Metadata packed into the on-chain `description` field

The contract has one `string description` field; the frontend encodes `{title, category, description}` as JSON into it (see `frontend/src/lib/metadata.ts`) rather than adding separate contract fields.

**Why:** there's no off-chain write path — the contract is the only place bounty content is ever written — so adding a title/category column purely for the indexer to read back out would mean either extending the contract (more audit surface, redeploy risk) or maintaining a second off-chain source of truth for content that's supposed to be on-chain. Packing it into the existing field keeps the contract's interface minimal while still giving the indexer structured data to mirror.
