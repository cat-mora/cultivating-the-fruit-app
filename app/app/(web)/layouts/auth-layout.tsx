import { ReactNode } from "react";

const logoImage = require("../../../assets/images/logo-full.png");

function getWebAssetUri(asset: unknown): string | undefined {
  if (typeof asset === "string") return asset;
  if (asset && typeof asset === "object") {
    const assetRecord = asset as { uri?: unknown; default?: unknown };
    if (typeof assetRecord.uri === "string") return assetRecord.uri;
    if (typeof assetRecord.default === "string") return assetRecord.default;
    if (assetRecord.default && typeof assetRecord.default === "object") {
      const defaultAsset = assetRecord.default as { uri?: unknown };
      if (typeof defaultAsset.uri === "string") return defaultAsset.uri;
    }
  }
  return undefined;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const logoSrc = getWebAssetUri(logoImage);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <img
          src={logoSrc}
          alt="Cultivating the Fruit"
          style={{ maxWidth: "280px", height: "auto", margin: "0 auto" }}
        />
        <p
          style={{
            fontSize: "15px",
            color: "#8B6F47",
            margin: "12px 0 0 0",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Love renewed through daily action
        </p>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(107, 45, 62, 0.1)",
          padding: "40px 32px",
        }}
      >
        {children}
      </div>
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          color: "#8B6F47",
          fontSize: "14px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <p style={{ margin: 0 }}>
          "But the fruit of the Spirit is love, joy, peace..."
          <br />
          <span style={{ fontSize: "12px", opacity: 0.8 }}>
            Galatians 5:22-23
          </span>
        </p>
      </div>
    </div>
  );
}
