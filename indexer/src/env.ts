import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  celoRpc: process.env.CELO_RPC ?? "https://forno.celo.org",
  quincyAddress: required("QUINCY_ADDRESS") as `0x${string}`,
  startBlock: BigInt(process.env.START_BLOCK ?? "0"),
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? "15000"),
  blockRange: BigInt(process.env.BLOCK_RANGE ?? "2000"),
};
