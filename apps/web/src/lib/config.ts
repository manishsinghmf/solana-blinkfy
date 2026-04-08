const DEFAULT_API_URL = "http://localhost:3001";

function ensureAbsoluteUrl(value: string): string {
  return new URL(value).toString().replace(/\/$/, "");
}

export function getPublicApiUrl(): string {
  return ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL);
}
