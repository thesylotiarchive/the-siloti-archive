const { Redis } = require("@upstash/redis");
const fs = require("fs");
const path = require("path");

// Simple .env parser to avoid external package dependencies
try {
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.substring(0, equalsIdx).trim();
        const value = trimmed.substring(equalsIdx + 1).trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn("Failed to read .env file:", e);
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function main() {
  const keys = ["page:people"];
  const deleted = await redis.del(...keys);
  console.log(`[Cache Invalidator] Successfully cleared keys: ${keys.join(", ")}. Count deleted: ${deleted}`);
}

main().catch(console.error);
