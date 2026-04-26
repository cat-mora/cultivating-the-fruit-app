import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../../lib/auth/auth-service';

/**
 * Sign In Page
 *
 * Email/password authentication for web users
 * Features:
 * - Email and password form
 * - Error handling
 * - Link to sign up
 * - Warm Bible app aesthetic
 */
export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
        {/* Email Input */}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#DEB9C5';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#F5EDE0';
            }}
          />
        </div>

        {/* Password Input */}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#DEB9C5';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#F5EDE0';
            }}
          />
        </div>

        {/* Error Message */}
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

        {/* Submit Button */}
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
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#84364D';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#6B2D3E';
            }
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up Link */}
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
        <Link
          to="/auth/sign-up"
          style={{
            color: '#6B2D3E',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
