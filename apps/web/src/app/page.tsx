"use client";

import { FormEvent, useState } from "react";

import { buildBlinkHref, isSecureActionUrl, normalizeAmountInput } from "../lib/blink";
import { getPublicApiUrl } from "../lib/config";

const API_URL = getPublicApiUrl();
const IS_SECURE_ACTION_URL = isSecureActionUrl(API_URL);

export default function HomePage() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountSol, setAmountSol] = useState("");
  const [blinkUrl, setBlinkUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedAmount = normalizeAmountInput(amountSol);

    const nextBlinkUrl = buildBlinkHref(API_URL, {
      recipientAddress,
      amountSol: normalizedAmount,
    });

    setAmountSol(normalizedAmount);
    setBlinkUrl(nextBlinkUrl);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "min(100%, 560px)",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 18px 48px rgba(28, 26, 23, 0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Solana Blink PoC
        </p>
        <h1
          style={{
            margin: "12px 0 10px",
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            lineHeight: 1,
          }}
        >
          Generate a devnet transfer Blink
        </h1>
        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          Enter a recipient and SOL amount. The app will generate a shareable
          <code style={{ marginLeft: "0.35rem" }}>solana-action:</code>
          link pointing at the backend Action endpoint.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ marginTop: "28px", display: "grid", gap: "18px" }}
        >
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 700 }}>Recipient address</span>
            <input
              type="text"
              value={recipientAddress}
              onChange={(event) => setRecipientAddress(event.target.value)}
              placeholder="Enter Solana wallet address"
              required
              style={inputStyles}
            />
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 700 }}>Amount in SOL</span>
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

          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: "999px",
              background: "var(--accent)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              padding: "14px 18px",
              cursor: "pointer",
            }}
          >
            Generate Blink URL
          </button>
        </form>

        <div
          style={{
            marginTop: "26px",
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(23, 107, 95, 0.08)",
            border: "1px solid rgba(23, 107, 95, 0.18)",
          }}
        >
          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Generated Blink</p>
          {blinkUrl ? (
            <a
              href={blinkUrl}
              style={{
                color: "var(--accent-strong)",
                wordBreak: "break-all",
                textDecorationThickness: "2px",
              }}
            >
              {blinkUrl}
            </a>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Submit the form to generate the link.
            </p>
          )}
        </div>

        {!IS_SECURE_ACTION_URL ? (
          <p
            style={{
              margin: "16px 0 0",
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(203, 123, 48, 0.12)",
              border: "1px solid rgba(203, 123, 48, 0.24)",
              color: "var(--ink)",
              lineHeight: 1.6,
            }}
          >
            This Blink currently targets <code>{API_URL}</code>. Because it is not an
            <code style={{ marginLeft: "0.35rem" }}>https://</code>
            Action URL, many wallets and Blink clients will not open a signing popup for it.
            Use a public HTTPS tunnel for the API, then set
            <code style={{ marginLeft: "0.35rem" }}>NEXT_PUBLIC_API_URL</code>
            to that HTTPS origin.
          </p>
        ) : null}

        <p style={{ margin: "18px 0 0", fontSize: "0.92rem", color: "var(--muted)" }}>
          API endpoint: <code>{API_URL}/api/actions/send-sol</code>
        </p>
      </section>
    </main>
  );
}

const inputStyles: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid var(--border)",
  background: "white",
  font: "inherit",
  color: "var(--ink)",
};
