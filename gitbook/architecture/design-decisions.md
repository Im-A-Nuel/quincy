# Design Decisions

The non-obvious choices, and why they were made.

## One transaction per lifecycle step

Create, claim, submit proof, approve, cancel, and dispute are each a **separate on-chain transaction** — never batched, even where combining two steps would save gas.

**Why:** this is deliberate, not an oversight. It maximizes verifiable on-chain transaction volume per completed bounty (4–6 tx per full lifecycle) and gives a clean audit trail for disputes. Celo gas fees are sub-cent, so the UX cost of extra confirmations is small relative to the traceability benefit.

## cUSD + CELO only, no arbitrary ERC-20 support

The contract accepts exactly two reward tokens — cUSD and native CELO's canonical ERC-20 wrapper — both `immutable`, set once at deploy time. `createBounty` takes a `token` parameter and reverts `TokenNotAllowed` for anything else.

**Why:** cUSD's stability was the original reasoning for an escrow-friendly reward (see the superseded single-token version of this decision below), but MiniPay users and hunters commonly hold CELO too, and locking it in escrow for a short, day-scale bounty window doesn't meaningfully reintroduce volatility risk in practice. Rather than opening the door to arbitrary ERC-20s (which would need a price oracle or per-token trust decisions), the contract keeps an allowlist of exactly two known-good tokens. Reputation counters (`totalEarned`/`totalSpent`) are tracked **per token** rather than summed, since cUSD and CELO units aren't fungible with each other in USD terms — summing them would produce a meaningless number.

**Superseded:** the original MVP only allowed cUSD, for the reasons above. That non-goal from `docs/REQUIREMENTS.md` was revisited and lifted once CELO's ERC20 wrapper was confirmed to use the same 18-decimal `transferFrom`/`transfer` interface as cUSD, making dual-token support a small, well-contained contract change rather than a redesign.

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
