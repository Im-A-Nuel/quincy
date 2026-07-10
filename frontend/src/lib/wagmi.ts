import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ACTIVE_CHAIN_KEY } from "./chains";

const celoRpc = process.env.NEXT_PUBLIC_CELO_RPC ?? "https://forno.celo.org";
const alfajoresRpc =
  process.env.NEXT_PUBLIC_ALFAJORES_RPC ??
  "https://alfajores-forno.celo-testnet.org";

/**
 * wagmi config for Quincy. Uses the injected connector so MiniPay's in-app
 * provider (window.ethereum) auto-connects; falls back to any injected wallet
 * in a normal browser.
 */
export const wagmiConfig = createConfig({
  chains: ACTIVE_CHAIN_KEY === "celo" ? [celo, celoAlfajores] : [celoAlfajores, celo],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [celo.id]: http(celoRpc),
    [celoAlfajores.id]: http(alfajoresRpc),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
