# Testing

## Running the suite

```bash
cd smartcontract
forge test
```

`forge test` must pass before any deploy — non-negotiable. See [foundry.toml](https://github.com/Im-A-Nuel/quincy/blob/main/smartcontract/foundry.toml) for the invariant run configuration.

Run a single test:

```bash
forge test --match-test test_CreateBounty_LocksReward
```

## What's covered

* **Unit tests** (`test/QuincyBounty.t.sol`) — every function's happy path plus every revert condition listed in [Functions](functions.md), including the full dispute flow (pay hunter / refund poster / non-admin rejection).
* **Invariant test** (`test/invariant/QuincyInvariant.t.sol`) — a `Handler` contract drives random sequences of create/claim/submit/approve/cancel calls, and after each run the test asserts:

  > The contract's cUSD balance always equals the sum of rewards for every bounty still in `Open`, `InProgress`, `PendingReview`, or `Disputed` — i.e. escrow can never silently leak or over/under-pay.

## Static analysis

The contract has also been run through [Slither](https://github.com/crytic/slither):

```bash
pip install slither-analyzer
slither smartcontract
```

Current findings: one informational note (`createBounty` comparing `deadline` against `block.timestamp`, which is intentional — deadlines are day-scale, so the few seconds a validator could nudge the timestamp are irrelevant). No high or medium findings.

## Coverage

```bash
forge coverage
```

`QuincyBounty.sol` is at 100% line and function coverage.
