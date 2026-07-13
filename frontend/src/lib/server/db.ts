import { Pool } from "pg";

// Server-only Postgres pool for the read API. Reuses a single pool across
// requests/hot-reloads. Reads mirror the indexer's tables; the contract remains
// the source of truth.
const globalForPool = globalThis as unknown as { _quincyPool?: Pool };

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForPool._quincyPool) {
    globalForPool._quincyPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return globalForPool._quincyPool;
}
