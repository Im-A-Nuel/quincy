import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./db.js";

// Apply sql/schema.sql. Safe to run repeatedly (all statements use IF NOT EXISTS).
async function migrate() {
  const here = dirname(fileURLToPath(import.meta.url));
  const schema = readFileSync(join(here, "..", "sql", "schema.sql"), "utf8");
  await pool.query(schema);
  console.log("Schema applied.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
