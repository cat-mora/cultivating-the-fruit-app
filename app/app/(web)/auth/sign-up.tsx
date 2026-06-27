import { useEffect, useState, FormEvent } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { signUpWithEmail } from "../../../lib/auth/auth-service";

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

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string | string[];
    code?: string | string[];
  }>();
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logoSrc = getWebAssetUri(logoImage);

  useEffect(() => {
    const emailParam = Array.isArray(params.email)
      ? params.email[0]
      : params.email;
    const codeParam = Array.isArray(params.code) ? params.code[0] : params.code;

    if (emailParam) {
      setEmail((currentEmail) => currentEmail || emailParam);
    }

    if (codeParam) {
      setInviteCode((currentCode) => currentCode || codeParam.toUpperCase());
    }
  }, [params.code, params.email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInviteError("");

    // Validate invite code
    if (!inviteCode.trim()) {
      setInviteError("Invite code is required");
      return;
    }

    if (inviteCode.trim().length !== 6) {
      setInviteError("Invite code must be 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUpWithEmail(
        email,
        password,
        inviteCode.trim().toUpperCase(),
      );

      // Check if email confirmation is required
      if (result && !result.session) {
        // Email confirmation required
        setError(
          "Account created! Please check your email to confirm your account before signing in.",
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setInviteCode("");
      } else {
        // Immediately authenticated, go to onboarding
        router.replace("/onboarding");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign up failed";

      // Check if error is invite code related
      if (errorMessage.toLowerCase().includes("invite")) {
        setInviteError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img
          src={logoSrc}
          alt="Cultivating the Fruit"
          style={{ maxWidth: "280px", height: "auto", marginBottom: "12px" }}
        />
        <p
          style={{
            fontSize: "15px",
            color: "#8B6F47",
            margin: 0,
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
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#6B2D3E",
            margin: "0 0 8px 0",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Create Account
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#8B6F47",
            margin: "0 0 32px 0",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Create your account and begin your daily marriage practice
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6B2D3E",
                marginBottom: "8px",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid #F5EDE0",
                borderRadius: "8px",
                outline: "none",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#DEB9C5";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F5EDE0";
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="inviteCode"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6B2D3E",
                marginBottom: "8px",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Invite Code
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              maxLength={6}
              placeholder="XXXXXX"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: inviteError ? "2px solid #FCC" : "2px solid #F5EDE0",
                borderRadius: "8px",
                outline: "none",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, monospace",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
              onFocus={(e) => {
                if (!inviteError) e.target.style.borderColor = "#DEB9C5";
              }}
              onBlur={(e) => {
                if (!inviteError) e.target.style.borderColor = "#F5EDE0";
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#8B6F47",
                margin: "4px 0 0 0",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Enter the 6-character code provided by an administrator
            </p>
            {inviteError && (
              <div
                style={{
                  background: "#FEE",
                  border: "1px solid #FCC",
                  borderRadius: "8px",
                  padding: "12px",
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#C00",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {inviteError}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6B2D3E",
                marginBottom: "8px",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={isLoading}
              minLength={8}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid #F5EDE0",
                borderRadius: "8px",
                outline: "none",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#DEB9C5";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F5EDE0";
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#8B6F47",
                margin: "4px 0 0 0",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              At least 8 characters
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6B2D3E",
                marginBottom: "8px",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid #F5EDE0",
                borderRadius: "8px",
                outline: "none",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#DEB9C5";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F5EDE0";
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#FEE",
                border: "1px solid #FCC",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
                fontSize: "14px",
                color: "#C00",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#FFFFFF",
              background: isLoading ? "#A67C89" : "#6B2D3E",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#84364D";
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#6B2D3E";
            }}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#8B6F47",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            style={
              {
                color: "#6B2D3E",
                fontWeight: "600",
                textDecoration: "none",
              } as any
            }
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
