# Deployment

## Prerequisites

* `forge test` passing (non-negotiable — see [Testing](testing.md))
* A funded deployer wallet: enough CELO for gas, plus a `PRIVATE_KEY` env var
* An RPC endpoint (`CELO_RPC_URL` for mainnet)

## Deploy script

`script/Deploy.s.sol` picks the correct cUSD address automatically based on the target chain's id (`42220` for Celo mainnet, `44787` for Alfajores) and defaults the admin role to the deployer unless `ADMIN_ADDRESS` is set.

```bash
cd smartcontract
export PRIVATE_KEY=0x...
export CELO_RPC_URL=https://forno.celo.org

# Dry run first (no --broadcast) to see the gas estimate
forge script script/Deploy.s.sol:Deploy --rpc-url celo

# Then actually broadcast
forge script script/Deploy.s.sol:Deploy --rpc-url celo --broadcast
```

The script logs the deployed address, chain id, cUSD address, and admin address on success.

## After deploying

1. Verify the contract's on-chain state matches expectations (admin, minReward, cUSD address) with a few `cast call`s.
2. Update `NEXT_PUBLIC_QUINCY_ADDRESS_CELO` (or `_ALFAJORES`) in the frontend's environment — see [Environment Variables](../getting-started/environment-variables.md).
3. Update `QUINCY_ADDRESS` and `START_BLOCK` (the deploy block) in the indexer's environment — see [Indexer → Deployment](../indexer/deployment.md).
4. Record the address, tx hash, and block number somewhere durable (the repo keeps this in `docs/DEPLOYMENTS.md`).

## Source verification

Celoscan uses the Etherscan v2 API. From `smartcontract/`:

```bash
forge verify-contract <address> src/QuincyBounty.sol:QuincyBounty \
  --verifier etherscan \
  --verifier-url "https://api.etherscan.io/v2/api?chainid=42220" \
  --etherscan-api-key "$CELOSCAN_API_KEY" \
  --constructor-args "$(cast abi-encode "constructor(address,address,uint256)" <cusd> <admin> <minReward>)" \
  --compiler-version 0.8.24
```

Verification can be flaky immediately after deploy if Celoscan hasn't indexed the contract yet — wait a minute and retry rather than assuming failure.

## A note on Alfajores

The public Alfajores RPC endpoint (`alfajores-forno.celo-testnet.org`) has been unreachable (NXDOMAIN) since Celo's L2 migration, and other public providers have stopped serving Alfajores traffic. The current mainnet deployment was made directly, skipping staging, for this reason. If a working Alfajores RPC becomes available again, redeploying there first is still the safer path for future contract changes.
