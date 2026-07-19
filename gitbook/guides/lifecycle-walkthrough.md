# Lifecycle Walkthrough

A complete bounty from posting to payout, with what happens on each side.

## 1. Post & lock

A poster fills in the [Create](../frontend/overview.md) form (title, category, description, reward token, reward, deadline) and submits.

* **Frontend:** if the connected wallet's allowance for the chosen reward token (cUSD or CELO) is below the reward, it first sends an `approve` transaction on that token's contract; then it packs `{title, category, description}` as JSON (see [Design Decisions](../architecture/design-decisions.md#metadata-packed-into-the-on-chain-description-field)) and calls `createBounty(token, description, reward, deadline)`.
* **Contract:** reverts `TokenNotAllowed` if `token` isn't cUSD or CELO; otherwise pulls `reward` of `token` via `transferFrom`, opens the bounty (`Status.Open`), emits `BountyCreated`.
* **Indexer:** sees the event, calls `getBounty`, upserts the row.
* **Result:** the bounty appears in [Explore](../frontend/overview.md) once the indexer catches up (poll interval, default 15s).

Two transactions if an approval was needed, one if the allowance was already sufficient — this is the one case in the app where step count varies, because `approve` isn't a bounty lifecycle step.

## 2. Claim & work

A hunter opens the bounty and clicks Claim.

* **Contract:** `claimBounty` reverts `PosterCannotClaim` if the caller is the poster, or `InvalidStatus` if it's not `Open`. Otherwise: `hunter` is set, status → `InProgress`, emits `BountyClaimed`.
* The hunter does the actual task off-chain — nothing on-chain happens here.

## 3. Submit proof

The hunter uploads a file (through `/api/upload` → Pinata → IPFS) or pastes a link/CID, then submits.

* **Contract:** `submitProof` reverts `NotHunter` if called by anyone else, or `InvalidStatus` if not `InProgress`. Otherwise: `proofURI` is set, status → `PendingReview`, emits `ProofSubmitted`.

## 4. Approve & pay

The poster reviews the proof and approves.

* **Contract:** `approveBounty` reverts `NotPoster` / `InvalidStatus` as appropriate. Otherwise: transfers the escrowed reward to the hunter, increments both wallets' reputation counters, status → `Completed`, emits `BountyApproved`.
* **Frontend:** fires a confetti burst and shows a "Share to Farcaster" button, which opens a Warpcast compose intent with the bounty's [dynamic OG card](../frontend/design-system.md) embedded.

## Off the happy path

**Poster wants to cancel** (only while `Open`, i.e. before anyone claims): `cancelBounty` refunds the full reward, status → `Cancelled`.

**Either party disputes** (while `InProgress` or `PendingReview`): `disputeBounty` moves the bounty to `Disputed`. The admin wallet then calls `resolveDispute(id, payHunter)` — `true` pays the hunter and completes it, `false` refunds the poster and cancels it. See [Design Decisions → Admin-Resolved Disputes](../architecture/design-decisions.md#admin-resolved-disputes-not-daovoting).

Every arrow above is a separate on-chain transaction, deliberately — see [Design Decisions → One Transaction Per Step](../architecture/design-decisions.md#one-transaction-per-lifecycle-step).
