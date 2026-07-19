import { celo, celoAlfajores } from "viem/chains";

/** Which network the app targets, driven by env. */
export const ACTIVE_CHAIN_KEY =
  (process.env.NEXT_PUBLIC_CHAIN as "celo" | "alfajores") ?? "alfajores";

export const activeChain = ACTIVE_CHAIN_KEY === "celo" ? celo : celoAlfajores;

/** Canonical cUSD token address per network. */
export const CUSD_ADDRESS: Record<"celo" | "alfajores", `0x${string}`> = {
  celo: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  alfajores: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
};

/** Canonical native-CELO (ERC20-wrapped) token address per network. */
export const CELO_ADDRESS: Record<"celo" | "alfajores", `0x${string}`> = {
  celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  // Not currently deployed on Alfajores - see docs/DEPLOYMENTS.md.
  alfajores: "0x0000000000000000000000000000000000000000",
};

/** Deployed QuincyBounty address per network. Env overrides the default. */
export const QUINCY_ADDRESS: Record<"celo" | "alfajores", `0x${string}`> = {
  celo: (process.env.NEXT_PUBLIC_QUINCY_ADDRESS_CELO ??
    "0x9af5fbb05054a4d072def7bb73978c48dfe6d3d5") as `0x${string}`,
  alfajores: (process.env.NEXT_PUBLIC_QUINCY_ADDRESS_ALFAJORES ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export const cusdAddress = CUSD_ADDRESS[ACTIVE_CHAIN_KEY];
export const celoTokenAddress = CELO_ADDRESS[ACTIVE_CHAIN_KEY];
export const quincyAddress = QUINCY_ADDRESS[ACTIVE_CHAIN_KEY];

/** The two reward tokens a bounty can be posted in. */
export interface RewardToken {
  address: `0x${string}`;
  symbol: "cUSD" | "CELO";
  decimals: 18;
}

export const REWARD_TOKENS: RewardToken[] = [
  { address: cusdAddress, symbol: "cUSD", decimals: 18 },
  { address: celoTokenAddress, symbol: "CELO", decimals: 18 },
];

/** Look up a reward token by its contract address. */
export function findRewardToken(address?: string | null): RewardToken | undefined {
  if (!address) return undefined;
  return REWARD_TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase());
}

/** Symbol for a reward token address, falling back to a short address if unknown. */
export function tokenSymbol(address?: string | null): string {
  return findRewardToken(address)?.symbol ?? "TOKEN";
}

/** Block explorer base for the active chain. */
export const explorerBase =
  ACTIVE_CHAIN_KEY === "celo"
    ? "https://celoscan.io"
    : "https://alfajores.celoscan.io";

export const txUrl = (hash: string) => `${explorerBase}/tx/${hash}`;
export const addressUrl = (addr: string) => `${explorerBase}/address/${addr}`;
