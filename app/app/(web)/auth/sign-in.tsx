import { useState, FormEvent } from 'react';
import { Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmail } from '../../../lib/auth/auth-service';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logoSrc = Image.resolveAssetSource(require('../../../assets/images/logo-full.png'))?.uri;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <img
          src={logoSrc}
          alt="Cultivating the Fruit"
          style={{ maxWidth: '280px', height: 'auto', marginBottom: '12px' }}
        />
        <p
          style={{
            fontSize: '15px',
            color: '#8B6F47',
            margin: 0,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Love renewed through daily action
        </p>
      </div>

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
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#6B2D3E',
            margin: '0 0 8px 0',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#8B6F47',
            margin: '0 0 32px 0',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Sign in to continue your spiritual journey
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6B2D3E',
                marginBottom: '8px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #F5EDE0',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#DEB9C5'; }}
              onBlur={(e) => { e.target.style.borderColor = '#F5EDE0'; }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6B2D3E',
                marginBottom: '8px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
              autoComplete="current-password"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #F5EDE0',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#DEB9C5'; }}
              onBlur={(e) => { e.target.style.borderColor = '#F5EDE0'; }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#FEE',
                border: '1px solid #FCC',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#C00',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              background: isLoading ? '#A67C89' : '#6B2D3E',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.background = '#84364D'; }}
            onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.background = '#6B2D3E'; }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#8B6F47',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Don't have an account?{' '}
          <Link href="/(web)/auth/sign-up" style={{ color: '#6B2D3E', fontWeight: '600', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
