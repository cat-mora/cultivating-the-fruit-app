import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { signOut } from "@/lib/auth/auth-service";

/**
 * App Layout
 *
 * Layout for protected app pages (dashboard, progress, journal, settings)
 * Features:
 * - Top navigation bar
 * - Tab navigation (mobile-optimized)
 * - Sign out button
 * - Warm Bible app aesthetic
 */
export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const tabs = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/progress", label: "Progress", icon: "📊" },
    { path: "/journal", label: "Journal", icon: "📝" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFF9F0",
      }}
    >
      {/* Top Navigation Bar */}
      <nav
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F5EDE0",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#6B2D3E",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          🍇 Cultivating the Fruits
        </div>

        <button
          onClick={handleSignOut}
          style={{
            background: "transparent",
            border: "1px solid #DEB9C5",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#6B2D3E",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#F8E8ED";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F5EDE0",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "sticky",
          bottom: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                color: isActive ? "#7D8C69" : "#8B6F47",
                fontSize: "12px",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                transition: "color 0.2s",
                minWidth: "60px",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  marginBottom: "4px",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
