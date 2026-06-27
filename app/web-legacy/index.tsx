// Polyfill for import.meta (required for some ESM packages on Metro web)
if (typeof (globalThis as any).import === "undefined") {
  (globalThis as any).import = { meta: { env: {} } };
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth-store";

// Layouts
import AuthLayout from "./layouts/auth-layout";
import AppLayout from "./layouts/app-layout";

// Auth Pages
import SignIn from "./auth/sign-in";
import SignUp from "./auth/sign-up";

// App Pages
import Dashboard from "./dashboard";
import Progress from "./progress";
import Journal from "./journal";
import Settings from "./settings";

// Partner Pages
import PartnerJoin from "./partner/join";

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Protected Route Component
 * Redirects to sign-in if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#6B2D3E",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <>{children}</>;
}

/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#6B2D3E",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * Web App Router
 *
 * Routes:
 * - /auth/sign-in (public)
 * - /auth/sign-up (public)
 * - /dashboard (protected)
 * - /progress (protected)
 * - /journal (protected)
 * - /settings (protected)
 * - /partner/:code (public, auto-join)
 */
export default function WebApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route
              path="sign-in"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="sign-up"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
          </Route>

          {/* Protected App Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="journal" element={<Journal />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Partner Join Route - Public (auto-join via URL) */}
          <Route path="/partner/:code" element={<PartnerJoin />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
