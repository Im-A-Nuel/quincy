# Quincy Smart Contract

Foundry project for `QuincyBounty.sol` - the escrow contract holding all bounty funds and state on Celo.

## Setup

Requires [Foundry](https://book.getfoundry.sh/getting-started/installation).

```bash
# install dependencies into lib/ (forge-std + OpenZeppelin, not vendored in git)
bash scripts/install-deps.sh

forge build
forge test
```

Run a single test:

```bash
forge test --match-test test_CreateBounty_LocksReward
```

## Deploy

Set RPC + key env, then run the deploy script:

```bash
export CELO_RPC=https://forno.celo.org
export ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
export PRIVATE_KEY=0x...

forge script script/Deploy.s.sol --rpc-url alfajores --broadcast
```

`forge test` must pass before any deploy.

## Layout

```
smartcontract/
  src/QuincyBounty.sol      # escrow + bounty lifecycle
  test/QuincyBounty.t.sol   # unit + invariant tests
  script/Deploy.s.sol       # deployment script
  lib/                      # forge-std + openzeppelin (git-ignored)
```

See `../docs/SCHEMA.md` for the full contract interface.
