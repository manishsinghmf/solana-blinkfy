import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px",
          background:
            "radial-gradient(circle at top left, rgba(23,107,95,0.35), transparent 34%), radial-gradient(circle at bottom right, rgba(203,123,48,0.28), transparent 28%), linear-gradient(180deg, #f7f0e3 0%, #efe5d3 100%)",
          color: "#1c1a17",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 26,
              color: "#0f4e45",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#176b5f",
              }}
            />
            Blinkfy Donation
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 900 }}>
            <h1 style={{ margin: 0, fontSize: 78, lineHeight: 0.95 }}>Support Blinkfy with 0.1 SOL</h1>
            <p style={{ margin: 0, fontSize: 32, lineHeight: 1.35, color: "#5d554a" }}>
              Open the donation page, review the Solana Action, and continue into the Blinkfy payment flow.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            Donate 0.1 SOL
          </div>
          <div style={{ fontSize: 28, color: "#5d554a" }}>blinkfy-web.vercel.app/donate</div>
        </div>
      </div>
    ),
    size,
  );
}
