import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const loadLocalEnv = () => {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (process.env[key]) continue;

    process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
  }
};

loadLocalEnv();

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "ORDER_ACTION_SECRET",
  "FIREBASE_DATABASE_SECRET",
  "STEADFAST_API_URL",
  "STEADFAST_API_KEY",
  "STEADFAST_SECRET_KEY",
];

const recommended = [
  "STEADFAST_ENDPOINT_SECRET",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "META_CONVERSIONS_ACCESS_TOKEN",
  "META_PIXEL_ID",
];

const missing = required.filter((key) => !process.env[key]?.trim());
const missingRecommended = recommended.filter((key) => !process.env[key]?.trim());

if (missing.length) {
  console.error("Missing required production environment variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

if (missingRecommended.length) {
  console.warn("Missing recommended production environment variables:");
  for (const key of missingRecommended) {
    console.warn(`- ${key}`);
  }
}

console.log("Production environment check passed.");
