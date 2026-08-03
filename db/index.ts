import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDb() {
  // Keep the Cloudflare-only module out of the Node.js startup path. This lets
  // the standalone server run on Docker/Coolify while retaining D1 support
  // when this application is deployed to a Cloudflare runtime.
  const cloudflareWorkersModule = "cloudflare:workers";
  const { env } = await import(cloudflareWorkersModule);

  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}
