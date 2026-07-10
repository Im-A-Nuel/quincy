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

/** Deployed QuincyBounty address per network (from env). */
export const QUINCY_ADDRESS: Record<"celo" | "alfajores", `0x${string}`> = {
  celo: (process.env.NEXT_PUBLIC_QUINCY_ADDRESS_CELO ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
  alfajores: (process.env.NEXT_PUBLIC_QUINCY_ADDRESS_ALFAJORES ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export const cusdAddress = CUSD_ADDRESS[ACTIVE_CHAIN_KEY];
export const quincyAddress = QUINCY_ADDRESS[ACTIVE_CHAIN_KEY];

/** Block explorer base for the active chain. */
export const explorerBase =
  ACTIVE_CHAIN_KEY === "celo"
    ? "https://celoscan.io"
    : "https://alfajores.celoscan.io";

export const txUrl = (hash: string) => `${explorerBase}/tx/${hash}`;
export const addressUrl = (addr: string) => `${explorerBase}/address/${addr}`;
