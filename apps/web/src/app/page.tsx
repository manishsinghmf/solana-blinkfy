"use client";

import { Buffer } from "buffer";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

import {
  type ActionGetResponse,
  type ActionPostResponse,
  type LinkedAction,
  buildActionUrl,
  buildBlinkHrefFromActionUrl,
  buildInterstitialHref,
  buildPresetActionUrl,
  isSecureActionUrl,
  normalizeAmountInput,
  parseBlinkActionParam,
  type ProviderActionPreset,
  resolveLinkedActionHref,
} from "../lib/blink";
import { getPublicApiUrl } from "../lib/config";

const API_URL = getPublicApiUrl();
const IS_SECURE_ACTION_URL = isSecureActionUrl(API_URL);
const FIXED_PROVIDER_PRESETS: ProviderActionPreset[] = [
  {
    key: "donate-0-1",
    title: "Donate 0.1 SOL",
    description: "Support the Blinkfy creator with a fixed donation flow.",
    actionPath: "/api/actions/donate",
    amountSol: "0.1",
    actionLabel: "Donate",
  },
  {
    key: "tip-0-05",
    title: "Tip 0.05 SOL",
    description: "Send a small fixed tip with one click.",
    actionPath: "/api/actions/tip",
    amountSol: "0.05",
    actionLabel: "Tip",
  },
  {
    key: "split-0-5",
    title: "Split Payment 0.5 SOL",
    description: "Demonstrate a two-recipient fixed split payment.",
    actionPath: "/api/actions/split-payment",
    amountSol: "0.5",
    actionLabel: "Pay",
  },
];

if (typeof window !== "undefined") {
  window.Buffer = window.Buffer ?? Buffer;
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageShell><p style={mutedTextStyle}>Loading Blinkfy...</p></PageShell>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  return (
    <PageShell>
      {actionParam ? (
        <BlinkClientSection actionParam={actionParam} />
      ) : (
        <GeneratorSection />
      )}
    </PageShell>
  );
}

function GeneratorSection() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountSol, setAmountSol] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{
    title: string;
    actionUrl: string;
    blinkUrl: string;
    interstitialUrl: string;
  } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedAmount = normalizeAmountInput(amountSol);
    const actionUrl = buildActionUrl(API_URL, {
      recipientAddress,
      amountSol: normalizedAmount,
    });
    const blinkUrl = buildBlinkHrefFromActionUrl(actionUrl);
    const webOrigin = window.location.origin;

    setAmountSol(normalizedAmount);
    setGeneratedLinks({
      title: `Send ${normalizedAmount} SOL`,
      actionUrl,
      blinkUrl,
      interstitialUrl: buildInterstitialHref(webOrigin, blinkUrl),
    });
  }

  function handlePresetClick(preset: ProviderActionPreset) {
    const actionUrl = buildPresetActionUrl(API_URL, preset);
    const blinkUrl = buildBlinkHrefFromActionUrl(actionUrl);
    const webOrigin = window.location.origin;

    setGeneratedLinks({
      title: preset.title,
      actionUrl,
      blinkUrl,
      interstitialUrl: buildInterstitialHref(webOrigin, blinkUrl),
    });
  }

  return (
    <>
      <Header
        eyebrow="Solana Blinks"
        title="Generate Blinks"
        description="Enter a recipient and amount. Blinkfy will generate a raw Action URL, a raw solana-action URI, and a Blinkfy interstitial URL that can render the Action inside the website."
      />

      <form onSubmit={handleSubmit} style={stackStyle}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Recipient address</span>
          <input
            type="text"
            value={recipientAddress}
            onChange={(event) => setRecipientAddress(event.target.value)}
            placeholder="Enter Solana wallet address"
            required
            style={inputStyles}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>Amount in SOL</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.000000001"
            value={amountSol}
            onChange={(event) => setAmountSol(event.target.value)}
            placeholder="0.10"
            required
            style={inputStyles}
          />
        </label>

        <button type="submit" style={primaryButtonStyle}>
          Generate Blink URLs
        </button>
      </form>

      <InfoCard title="Generated Output">
        {generatedLinks ? (
          <div style={stackStyle}>
            <p style={{ margin: 0, fontWeight: 700 }}>{generatedLinks.title}</p>
            <LinkRow
              label="Blink URL"
              href={generatedLinks.interstitialUrl}
              value={generatedLinks.interstitialUrl}
              externalLabel="Open Blinkfy client"
              primary
            />
            <LinkRow
              label="Raw Action URL"
              href={generatedLinks.actionUrl}
              value={generatedLinks.actionUrl}
              externalLabel="Open Action JSON"
            />
            <LinkRow
              label="Raw solana-action URI"
              href={generatedLinks.blinkUrl}
              value={generatedLinks.blinkUrl}
            />
          </div>
        ) : (
          <p style={mutedTextStyle}>Submit the form to generate the interstitial and Action URLs.</p>
        )}
      </InfoCard>

      <InfoCard title="Fixed Provider Action Presets">
        <div style={presetGridStyle}>
          {FIXED_PROVIDER_PRESETS.map((preset) => (
            <div key={preset.key} style={presetCardStyle}>
              <div style={{ display: "grid", gap: "8px" }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{preset.title}</p>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{preset.description}</p>
              </div>
              <button type="button" style={primaryButtonStyle} onClick={() => handlePresetClick(preset)}>
                Generate {preset.actionLabel} Blink
              </button>
            </div>
          ))}
        </div>
      </InfoCard>

      {!IS_SECURE_ACTION_URL ? (
        <Notice>
          This generator currently targets <code>{API_URL}</code>. Because it is not an
          <code style={{ marginLeft: "0.35rem" }}>https://</code>
          Action URL, most Blink-aware clients and wallets will reject it. Use a public HTTPS API deployment before testing wallet execution.
        </Notice>
      ) : null}

      <p style={footerNoteStyle}>
        API endpoint: <code>{API_URL}/api/actions/send-sol</code>
      </p>
    </>
  );
}

function BlinkClientSection({ actionParam }: Readonly<{ actionParam: string }>) {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [parseError, setParseError] = useState<string | null>(null);
  const [actionUrl, setActionUrl] = useState("");
  const [blinkHref, setBlinkHref] = useState("");
  const [metadata, setMetadata] = useState<ActionGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [executingHref, setExecutingHref] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetadata() {
      setLoading(true);
      setRequestError(null);
      setExecutionMessage(null);

      try {
        const parsed = parseBlinkActionParam(actionParam);
        setActionUrl(parsed.actionUrl);
        setBlinkHref(parsed.blinkHref);
        setParseError(null);

        const { response, payload } = await fetchActionJson<ActionGetResponse>(parsed.actionUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(payload.error?.message ?? "Failed to fetch action metadata.");
        }

        setMetadata(payload);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load action.";
        setMetadata(null);
        setRequestError(message);
        setParseError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadMetadata();
  }, [actionParam]);

  async function executeLinkedAction(action: LinkedAction, values: Record<string, string>) {
    if (!actionUrl) {
      return;
    }

    if (!connected || !publicKey) {
      setExecutionMessage("Connect a wallet to execute this action.");
      return;
    }

    setExecutingHref(action.href);
    setExecutionMessage(null);

    try {
      const resolvedHref = resolveLinkedActionHref(actionUrl, action.href, values);
      const { response, payload } = await fetchActionJson<ActionPostResponse>(resolvedHref, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: publicKey.toBase58(),
        }),
      });

      if (!response.ok) {
        throw new Error(payload.error?.message ?? payload.message ?? "Action execution failed.");
      }

      if (!payload.transaction) {
        throw new Error("This action response does not contain a transaction to sign.");
      }

      const transaction = deserializeTransaction(payload.transaction);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setExecutionMessage(payload.message ?? `Transaction sent: ${signature}`);
    } catch (error) {
      setExecutionMessage(error instanceof Error ? error.message : "Failed to execute the action.");
    } finally {
      setExecutingHref(null);
    }
  }

  const actionEntries = useMemo(() => metadata?.links?.actions ?? [], [metadata]);

  return (
    <>
      <Header
        eyebrow="Blinkfy Client"
        title="Render and execute a Solana Action in Blinkfy"
        description="Blinkfy is acting as a Blink-aware client. It decodes the action URL, fetches metadata, renders linked actions, and uses your connected wallet to sign the returned transaction."
      />

      <InfoCard title="Action Context">
        <div style={stackStyle}>
          <LinkRow label="Decoded Action URL" href={actionUrl || undefined} value={actionUrl || "Unavailable"} />
          <LinkRow label="Raw solana-action URI" value={blinkHref || actionParam} />
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <WalletMultiButton />
          </div>
        </div>
      </InfoCard>

      {loading ? <InfoCard title="Status"><p style={mutedTextStyle}>Loading Action metadata...</p></InfoCard> : null}

      {parseError && !loading ? (
        <Notice variant="error">
          <strong>Unable to render this Blink.</strong> {parseError}
        </Notice>
      ) : null}

      {metadata && !loading ? (
        <>
          <InfoCard title={metadata.title}>
            <div style={{ display: "grid", gap: "14px" }}>
              <img
                src={metadata.icon}
                alt={metadata.title}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "18px",
                  objectFit: "cover",
                  border: "1px solid var(--border)",
                }}
              />
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{metadata.description}</p>
              <p style={{ margin: 0, fontWeight: 700 }}>Primary label: {metadata.label}</p>
              {metadata.error?.message ? (
                <Notice variant="error">{metadata.error.message}</Notice>
              ) : null}
            </div>
          </InfoCard>

          <InfoCard title="Available Actions">
            {actionEntries.length > 0 ? (
              <div style={stackStyle}>
                {actionEntries.map((action, index) => (
                  <LinkedActionCard
                    key={`${action.href}-${index}`}
                    action={action}
                    executing={executingHref === action.href}
                    onExecute={executeLinkedAction}
                  />
                ))}
              </div>
            ) : (
              <p style={mutedTextStyle}>This Action did not expose any linked actions.</p>
            )}
          </InfoCard>
        </>
      ) : null}

      {requestError && !loading ? <Notice variant="error">{requestError}</Notice> : null}
      {executionMessage ? <Notice>{executionMessage}</Notice> : null}
    </>
  );
}

function LinkedActionCard({
  action,
  executing,
  onExecute,
}: Readonly<{
  action: LinkedAction;
  executing: boolean;
  onExecute: (action: LinkedAction, values: Record<string, string>) => Promise<void>;
}>) {
  const [values, setValues] = useState<Record<string, string>>({});
  const parameterList = action.parameters ?? [];

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
        padding: "16px",
        borderRadius: "18px",
        background: "rgba(255, 255, 255, 0.78)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>{action.label}</p>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "0.95rem" }}>
          Type: {action.type ?? "post"} | Path: <code>{action.href}</code>
        </p>
      </div>

      {parameterList.length > 0 ? (
        <div style={stackStyle}>
          {parameterList.map((parameter) => (
            <label key={parameter.name} style={fieldStyle}>
              <span style={labelStyle}>{parameter.label}</span>
              <input
                type={parameter.type === "number" ? "number" : "text"}
                value={values[parameter.name] ?? ""}
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    [parameter.name]: event.target.value,
                  }))
                }
                required={parameter.required}
                style={inputStyles}
              />
            </label>
          ))}
        </div>
      ) : null}

      <button type="button" style={primaryButtonStyle} disabled={executing} onClick={() => void onExecute(action, values)}>
        {executing ? "Executing..." : action.label}
      </button>
    </div>
  );
}

function deserializeTransaction(transactionBase64: string) {
  const transactionBuffer = Buffer.from(transactionBase64, "base64");

  try {
    return VersionedTransaction.deserialize(transactionBuffer);
  } catch {
    return Transaction.from(transactionBuffer);
  }
}

async function fetchActionJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<{
  response: Response;
  payload: T;
}> {
  const response = await fetch(input, init);
  const rawBody = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const preview = rawBody.slice(0, 160).trim();
    throw new Error(
      `Expected JSON from the Action endpoint, but received ${contentType || "non-JSON content"} instead. ` +
      `This usually means the route is not deployed or returned an HTML error page. Preview: ${preview}`,
    );
  }

  try {
    return {
      response,
      payload: JSON.parse(rawBody) as T,
    };
  } catch {
    throw new Error("The Action endpoint returned invalid JSON.");
  }
}

function Header({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <>
      <p style={eyebrowStyle}>{eyebrow}</p>
      <h1 style={titleStyle}>{title}</h1>
      <p style={descriptionStyle}>{description}</p>
    </>
  );
}

function PageShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section style={panelStyle}>{children}</section>
    </main>
  );
}

function InfoCard({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        marginTop: "26px",
        padding: "18px",
        borderRadius: "18px",
        background: "rgba(23, 107, 95, 0.08)",
        border: "1px solid rgba(23, 107, 95, 0.18)",
      }}
    >
      <p style={{ margin: "0 0 12px", fontWeight: 700 }}>{title}</p>
      {children}
    </div>
  );
}

function LinkRow({
  label,
  value,
  href,
  externalLabel,
  primary = false,
}: Readonly<{
  label: string;
  value: string;
  href?: string;
  externalLabel?: string;
  primary?: boolean;
}>) {
  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{
            color: primary ? "var(--accent-strong)" : "var(--ink)",
            wordBreak: "break-all",
            textDecorationThickness: "2px",
          }}
        >
          {value}
        </a>
      ) : (
        <code style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{value}</code>
      )}
      {href && externalLabel ? (
        <div>
          <a href={href} target="_blank" rel="noreferrer" style={secondaryLinkStyle}>
            {externalLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}

function Notice({
  children,
  variant = "info",
}: Readonly<{
  children: React.ReactNode;
  variant?: "info" | "error";
}>) {
  const isError = variant === "error";

  return (
    <p
      style={{
        margin: "16px 0 0",
        padding: "14px 16px",
        borderRadius: "14px",
        background: isError ? "rgba(184, 68, 42, 0.12)" : "rgba(203, 123, 48, 0.12)",
        border: isError
          ? "1px solid rgba(184, 68, 42, 0.28)"
          : "1px solid rgba(203, 123, 48, 0.24)",
        color: "var(--ink)",
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  );
}

const panelStyle: React.CSSProperties = {
  width: "min(100%, 760px)",
  background: "var(--panel)",
  border: "1px solid var(--border)",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 18px 48px rgba(28, 26, 23, 0.08)",
  backdropFilter: "blur(12px)",
};

const stackStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.85rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const titleStyle: React.CSSProperties = {
  margin: "12px 0 10px",
  fontSize: "clamp(2rem, 5vw, 3.25rem)",
  lineHeight: 1,
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--muted)",
  fontSize: "1rem",
  lineHeight: 1.6,
};

const mutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--muted)",
  lineHeight: 1.6,
};

const footerNoteStyle: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: "0.92rem",
  color: "var(--muted)",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  background: "var(--accent)",
  color: "white",
  fontSize: "1rem",
  fontWeight: 700,
  padding: "14px 18px",
  cursor: "pointer",
};

const inputStyles: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid var(--border)",
  background: "white",
  font: "inherit",
  color: "var(--ink)",
};

const secondaryLinkStyle: React.CSSProperties = {
  color: "var(--accent-strong)",
  fontWeight: 700,
};

const presetGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const presetCardStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid var(--border)",
};
