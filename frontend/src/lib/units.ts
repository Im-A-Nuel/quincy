import { parseUnits, formatUnits } from "viem";

// Both reward tokens (cUSD and CELO) use 18 decimals on Celo, so one pair of
// helpers covers either.
const TOKEN_DECIMALS = 18;

/** Parse a human token amount (e.g. "2.5") into base units (wei-scale). */
export function toTokenUnits(amount: string | number): bigint {
  return parseUnits(String(amount), TOKEN_DECIMALS);
}

/** Format base-unit token amount back into a decimal string. */
export function fromTokenUnits(value: bigint): string {
  return formatUnits(value, TOKEN_DECIMALS);
}

/** Convert a JS Date (or ISO string) into a unix-seconds bigint for the chain. */
export function toUnixSeconds(date: Date | string): bigint {
  const ms = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  return BigInt(Math.floor(ms / 1000));
}
