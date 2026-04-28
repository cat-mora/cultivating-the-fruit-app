import { Outlet } from 'react-router-dom';

/**
 * Auth Layout
 *
 * Layout for public authentication pages (sign-in, sign-up)
 * Features:
 * - Centered auth form
 * - Warm Bible app aesthetic
 * - Mobile-first responsive design
 */
export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)',
        padding: '20px',
      }}
    >
      {/* Logo/Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <img
          src={require('../../../assets/images/logo-full.png')}
          alt="Cultivating the Fruits"
          style={{
            maxWidth: '280px',
            height: 'auto',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Auth Form Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(107, 45, 62, 0.1)',
          padding: '40px 32px',
        }}
      >
        <Outlet />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#8B6F47',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <p style={{ margin: 0 }}>
          "But the fruit of the Spirit is love, joy, peace..."
          <br />
          <span style={{ fontSize: '12px', opacity: 0.8 }}>
            — Galatians 5:22-23
          </span>
        </p>
      </div>
    </div>
  );
}
