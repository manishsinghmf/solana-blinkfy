const DEFAULT_API_URL = "http://localhost:3001";
const DEFAULT_RPC_URL = "https://api.devnet.solana.com";

function ensureAbsoluteUrl(value: string): string {
  return new URL(value).toString().replace(/\/$/, "");
}

export function getPublicApiUrl(): string {
  return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL);
}

export function getPublicRpcUrl(): string {
  return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? DEFAULT_RPC_URL);
}
