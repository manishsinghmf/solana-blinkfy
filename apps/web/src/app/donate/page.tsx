import type { Metadata } from "next";

import {
  buildBlinkHrefFromActionUrl,
  buildInterstitialHref,
  buildPresetActionUrl,
} from "../../lib/blink";
import { getPublicApiUrl, getPublicWebUrl, getPublicXHandle } from "../../lib/config";

const PAGE_PATH = "/donate";
const DONATION_AMOUNT = "0.1";
const API_URL = getPublicApiUrl();
const WEB_URL = getPublicWebUrl();
const X_HANDLE = getPublicXHandle();
const PAGE_URL = new URL(PAGE_PATH, WEB_URL).toString();
const OG_IMAGE_URL = new URL("/donate/opengraph-image", WEB_URL).toString();
const TWITTER_IMAGE_URL = new URL("/donate/twitter-image", WEB_URL).toString();
const ACTION_URL = buildPresetActionUrl(API_URL, {
  key: "donate-0-1",
  title: "Donate 0.1 SOL",
  description: "Support Blinkfy with a fixed 0.1 SOL donation.",
  actionPath: "/api/actions/donate",
  amountSol: DONATION_AMOUNT,
  actionLabel: "Donate",
});
const BLINK_HREF = buildBlinkHrefFromActionUrl(ACTION_URL);
const INTERSTITIAL_URL = buildInterstitialHref(WEB_URL, BLINK_HREF);

export const metadata: Metadata = {
  title: "Support Blinkfy with 0.1 SOL",
  description: "Preview Blinkfy's 0.1 SOL donation page, then open the Solana Action flow to send support.",
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Support Blinkfy with 0.1 SOL",
    description: "Preview Blinkfy's 0.1 SOL donation page, then open the Solana Action flow to send support.",
    url: PAGE_URL,
    siteName: "Blinkfy",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Blinkfy donation page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Blinkfy with 0.1 SOL",
    description: "Preview Blinkfy's 0.1 SOL donation page, then open the Solana Action flow to send support.",
    images: [TWITTER_IMAGE_URL],
    creator: X_HANDLE,
    site: X_HANDLE,
  },
  category: "technology",
  other: {
    "twitter:url": PAGE_URL,
    "twitter:image:alt": "Blinkfy donation page preview",
    "og:image:secure_url": OG_IMAGE_URL,
  },
};

export default function DonatePage() {
  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>Blinkfy Donation</p>
        <h1 style={titleStyle}>Support Blinkfy with 0.1 SOL</h1>
        <p style={descriptionStyle}>
          This page is the share-friendly donation landing page for Blinkfy. It gives social platforms a clean
          preview and gives supporters a direct path into the Solana Action flow.
        </p>

        <div style={buttonRowStyle}>
          <a href={INTERSTITIAL_URL} style={primaryButtonStyle}>
            Open Donation Flow
          </a>
          <a href={ACTION_URL} style={secondaryButtonStyle}>
            View Action JSON
          </a>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>What this page does</h2>
        <p style={bodyStyle}>
          X and similar platforms can preview this route like a normal web page because it has route-specific Open
          Graph and Twitter metadata. The donation itself still happens after the user opens Blinkfy&apos;s Action flow.
        </p>
      </section>

      <section style={detailsGridStyle}>
        <article style={detailCardStyle}>
          <h2 style={sectionTitleStyle}>Share URL</h2>
          <p style={monoTextStyle}>{PAGE_URL}</p>
        </article>

        <article style={detailCardStyle}>
          <h2 style={sectionTitleStyle}>Interstitial URL</h2>
          <p style={monoTextStyle}>{INTERSTITIAL_URL}</p>
        </article>

        <article style={detailCardStyle}>
          <h2 style={sectionTitleStyle}>Action URL</h2>
          <p style={monoTextStyle}>{ACTION_URL}</p>
        </article>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "48px 20px 72px",
  display: "grid",
  gap: "24px",
};

const heroStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "28px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,248,237,0.92))",
  border: "1px solid var(--border)",
  boxShadow: "0 24px 60px rgba(28, 26, 23, 0.08)",
  display: "grid",
  gap: "18px",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--accent-strong)",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
  lineHeight: 0.95,
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: "42rem",
  fontSize: "1.08rem",
  lineHeight: 1.7,
  color: "var(--muted)",
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "0 18px",
  borderRadius: "999px",
  background: "var(--accent)",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: "transparent",
  color: "var(--ink)",
  border: "1px solid var(--border)",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "28px",
  borderRadius: "24px",
  background: "var(--panel)",
  border: "1px solid var(--border)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: "1.2rem",
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.7,
  color: "var(--muted)",
};

const detailsGridStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  display: "grid",
  gap: "16px",
};

const detailCardStyle: React.CSSProperties = {
  padding: "24px",
  borderRadius: "22px",
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid var(--border)",
};

const monoTextStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--muted)",
  wordBreak: "break-all",
};
