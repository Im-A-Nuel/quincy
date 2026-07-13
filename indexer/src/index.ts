import { run } from "./indexer.js";
import { pool } from "./db.js";

async function main() {
  await run();
}

main().catch(async (err) => {
  console.error("Indexer crashed:", err);
  await pool.end().catch(() => {});
  process.exit(1);
});
