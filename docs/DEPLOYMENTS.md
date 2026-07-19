# Deployments

On-chain addresses for `QuincyBounty.sol`.

## Celo Mainnet (chain id 42220) — current

| Field | Value |
|---|---|
| Contract | `0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5` |
| Deploy tx | `0x8c9478c5a5ce9563d037530a24c3cc7db2fa0de0034686254a4ff2b001ebb1fd` |
| Block | 72544655 |
| Gas used | 1,420,320 |
| Deployer / admin | `0x22227781CCf9d1F547574E7Dec05FE56De6A0B25` |
| cUSD token | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| CELO token | `0x471EcE3750Da237f93B8E339c536989b8978A438` |
| Min reward | 0.5 (raw units, either token) |
| Deployed | 2026-07-19 |
| Explorer | https://celoscan.io/address/0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5 |

This deployment adds native CELO as a second allowed reward token alongside cUSD
(see the contract's `isAllowedToken`). It **supersedes** the cUSD-only
deployment below — the old contract still exists on-chain but is no longer the
one the frontend/indexer point at, and never had any bounties created against
it (nextBountyId was still 1 at the time of retirement).

Source verified on Celoscan (`forge verify-contract` via the Etherscan V2
unified API, `chainid=42220` — Celoscan's own V1 verify endpoint is
deprecated and rejects submissions). See
https://celoscan.io/address/0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5#code.

## Celo Mainnet — superseded (cUSD-only)

| Field | Value |
|---|---|
| Contract | `0x4a81cf92d285a9b92fecb1ea187cd2466e048b21` |
| Deploy tx | `0xa7937dde4a2707dd0469874a4c07a408ad9650ec64265e53b4ac79dce2f8d82b` |
| Block | 72020154 |
| Deployed | 2026-07-13 |
| Status | Retired — replaced by the dual-token deployment above. No bounties were ever created against it. |

## Celo Alfajores (chain id 44787)

Not deployed. The public Alfajores forno RPC endpoint has been unreachable
since Celo's L2 migration; staging deployment is deferred indefinitely in
favor of deploying directly to mainnet.
