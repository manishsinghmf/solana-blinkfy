import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(currentDir, "../../../../.env"),
});

const DEFAULT_API_ORIGIN = "http://localhost:3001";
const DEFAULT_WEB_ORIGIN = "http://localhost:3000";
const DEFAULT_SOLANA_RPC_URL = "https://api.devnet.solana.com";

function ensureValidHttpUrl(value: string, label: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid absolute URL.`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} must use http or https.`);
  }

  return parsed.origin;
}

function ensureValidRpcUrl(value: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("SOLANA_RPC_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("SOLANA_RPC_URL must use http or https.");
  }

  return parsed.toString();
}

export interface AppEnv {
  port: number;
  apiOrigin: string;
  webOrigin: string;
  solanaRpcUrl: string;
}

export function getEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  const port = Number(env.PORT ?? "3001");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  return {
    port,
    apiOrigin: ensureValidHttpUrl(env.API_ORIGIN ?? DEFAULT_API_ORIGIN, "API_ORIGIN"),
    webOrigin: ensureValidHttpUrl(env.WEB_ORIGIN ?? DEFAULT_WEB_ORIGIN, "WEB_ORIGIN"),
    solanaRpcUrl: ensureValidRpcUrl(env.SOLANA_RPC_URL ?? DEFAULT_SOLANA_RPC_URL),
  };
}
