import { createPublicClient, http, getContract } from "viem";
import { celo } from "viem/chains";
import { env } from "./env.js";
import { quincyAbi } from "./abi.js";

export const publicClient = createPublicClient({
  chain: celo,
  transport: http(env.celoRpc),
});

/** Typed contract handle for the deployed QuincyBounty. */
export const quincy = getContract({
  address: env.quincyAddress,
  abi: quincyAbi,
  client: publicClient,
});
