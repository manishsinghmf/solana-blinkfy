export interface BlinkFormValues {
  recipientAddress: string;
  amountSol: string;
}

export interface ProviderActionPreset {
  key: string;
  title: string;
  description: string;
  actionPath: string;
  amountSol: string;
  actionLabel: string;
}

export interface ActionParameter {
  name: string;
  label: string;
  type?: "number" | "text" | "url" | "email" | "date" | "datetime-local" | "checkbox" | "radio";
  required?: boolean;
}

export interface LinkedAction {
  type?: "transaction" | "post";
  label: string;
  href: string;
  parameters?: ActionParameter[];
}

export interface ActionGetResponse {
  type?: "action";
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  links?: {
    actions: LinkedAction[];
  };
  error?: {
    message: string;
  };
}

export interface ActionPostResponse {
  type?: "transaction";
  transaction?: string;
  message?: string;
  error?: {
    message: string;
  };
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

export function buildActionUrl(apiUrl: string, values: BlinkFormValues): string {
  const actionUrl = new URL("/api/actions/send-sol", apiUrl);

  actionUrl.searchParams.set("to", values.recipientAddress.trim());
  actionUrl.searchParams.set("amount", normalizeAmountInput(values.amountSol));

  return actionUrl.toString();
}

export function buildPresetActionUrl(apiUrl: string, preset: ProviderActionPreset): string {
  const actionUrl = new URL(preset.actionPath, apiUrl);
  actionUrl.searchParams.set("amount", normalizeAmountInput(preset.amountSol));

  return actionUrl.toString();
}

export function buildBlinkHrefFromActionUrl(actionUrl: string): string {
  return `solana-action:${encodeURIComponent(actionUrl)}`;
}

export function buildBlinkHref(apiUrl: string, values: BlinkFormValues): string {
  return buildBlinkHrefFromActionUrl(buildActionUrl(apiUrl, values));
}

export function buildInterstitialHref(webOrigin: string, blinkHref: string): string {
  const interstitialUrl = new URL("/", webOrigin);
  interstitialUrl.searchParams.set("action", blinkHref);

  return interstitialUrl.toString();
}

export function parseBlinkActionParam(actionParam: string): {
  blinkHref: string;
  actionUrl: string;
} {
  const trimmedValue = actionParam.trim();

  if (!trimmedValue.startsWith("solana-action:")) {
    throw new Error("The action query parameter must start with solana-action:.");
  }

  const rawActionLink = trimmedValue.slice("solana-action:".length);
  const decodedActionUrl = decodeURIComponent(rawActionLink);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(decodedActionUrl);
  } catch {
    throw new Error("The decoded action URL is not a valid absolute URL.");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Blink interstitials only support HTTPS action URLs.");
  }

  return {
    blinkHref: trimmedValue,
    actionUrl: parsedUrl.toString(),
  };
}

export function resolveLinkedActionHref(actionUrl: string, href: string, values: Record<string, string>): string {
  const interpolatedHref = href.replace(/\{([^}]+)\}/g, (_match, paramName: string) => {
    const value = values[paramName]?.trim();

    if (!value) {
      throw new Error(`Missing required value for "${paramName}".`);
    }

    return encodeURIComponent(value);
  });

  return new URL(interpolatedHref, actionUrl).toString();
}
