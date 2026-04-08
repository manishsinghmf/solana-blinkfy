export interface BlinkFormValues {
  recipientAddress: string;
  amountSol: string;
}

export function normalizeAmountInput(value: string): string {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith(".")) {
    return `0${trimmedValue}`;
  }

  return trimmedValue;
}

export function isSecureActionUrl(apiUrl: string): boolean {
  const parsed = new URL(apiUrl);
  return parsed.protocol === "https:";
}

export function buildBlinkHref(apiUrl: string, values: BlinkFormValues): string {
  const actionUrl = new URL("/api/actions/send-sol", apiUrl);

  actionUrl.searchParams.set("to", values.recipientAddress.trim());
  actionUrl.searchParams.set("amount", normalizeAmountInput(values.amountSol));

  return `solana-action:${encodeURIComponent(actionUrl.toString())}`;
}
