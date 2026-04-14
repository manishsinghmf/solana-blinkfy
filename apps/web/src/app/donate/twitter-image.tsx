import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 675,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "50px",
          background:
            "radial-gradient(circle at top left, rgba(23,107,95,0.32), transparent 34%), radial-gradient(circle at bottom right, rgba(203,123,48,0.24), transparent 28%), linear-gradient(180deg, #f7f0e3 0%, #efe5d3 100%)",
          color: "#1c1a17",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 24,
              color: "#0f4e45",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#176b5f",
              }}
            />
            Blinkfy Donation
          </div>

          <h1 style={{ margin: 0, fontSize: 74, lineHeight: 0.95 }}>Support Blinkfy with 0.1 SOL</h1>
          <p style={{ margin: 0, fontSize: 30, lineHeight: 1.35, color: "#5d554a" }}>
            Share this page on X, let people preview the donation details, then send them into the Blinkfy Solana
            Action flow.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
              borderRadius: 999,
              background: "#176b5f",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Open Donation Flow
          </div>
          <div style={{ fontSize: 26, color: "#5d554a" }}>blinkfy-web.vercel.app/donate</div>
        </div>
      </div>
    ),
    size,
  );
}
