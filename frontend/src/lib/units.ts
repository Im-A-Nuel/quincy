import { parseUnits, formatUnits } from "viem";
import { CUSD_DECIMALS } from "./constants";

/** Parse a human cUSD amount (e.g. "2.5") into base units (wei-scale). */
export function toCusdUnits(amount: string | number): bigint {
  return parseUnits(String(amount), CUSD_DECIMALS);
}

/** Format base-unit cUSD back into a decimal string. */
export function fromCusdUnits(value: bigint): string {
  return formatUnits(value, CUSD_DECIMALS);
}

/** Convert a JS Date (or ISO string) into a unix-seconds bigint for the chain. */
export function toUnixSeconds(date: Date | string): bigint {
  const ms = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  return BigInt(Math.floor(ms / 1000));
}
