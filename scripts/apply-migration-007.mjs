/**
 * Applies supabase/migrations/007_newsletter_email_enhancements.sql to your remote Postgres.
 *
 * Requires DATABASE_URL in .env.local (Supabase Dashboard → Project Settings → Database
 * → Connection string → URI). Use the password from the same page (not the anon key).
 *
 * Run: npm run db:apply-007
 */

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return;
  const raw = readFileSync(p, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "Missing DATABASE_URL. Add it to .env.local:\n" +
      "  Supabase Dashboard → Project Settings → Database → Connection string (URI)\n" +
      "  Example: postgresql://postgres.[ref]:[YOUR-DB-PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres\n" +
      "\nThen run: npm run db:apply-007"
  );
  process.exit(1);
}

const sqlPath = join(
  root,
  "supabase/migrations/007_newsletter_email_enhancements.sql"
);
const migrationSql = readFileSync(sqlPath, "utf8");

const sql = postgres(url, { max: 1, ssl: "require" });

try {
  console.log("Applying", sqlPath, "...");
  await sql.unsafe(migrationSql);
  console.log("Done. Migration 007 applied successfully.");
} catch (e) {
  console.error("Migration failed:", e.message || e);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
