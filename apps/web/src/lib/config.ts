const DEFAULT_API_URL = "http://localhost:3001";
const DEFAULT_RPC_URL = "https://api.devnet.solana.com";
const DEFAULT_WEB_URL = "http://localhost:3000";

function ensureAbsoluteUrl(value: string): string {
  return new URL(value).toString().replace(/\/$/, "");
}

export function getPublicApiUrl(): string {
  return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL);
}

export function getPublicRpcUrl(): string {
  return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? DEFAULT_RPC_URL);
}

export function getPublicWebUrl(): string {
  return ensureAbsoluteUrl(process.env.WEB_ORIGIN ?? process.env.NEXT_PUBLIC_WEB_ORIGIN ?? DEFAULT_WEB_URL);
}

export function getPublicXHandle(): string | undefined {
  const value = process.env.NEXT_PUBLIC_X_HANDLE?.trim();
  return value ? (value.startsWith("@") ? value : `@${value}`) : undefined;
}
