import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../../../lib/auth/auth-service';

/**
 * Sign Up Page
 *
 * Email/password registration for web users
 * Features:
 * - Email and password form with confirmation
 * - Error handling and validation
 * - Link to sign in
 * - Warm Bible app aesthetic
 */
export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInviteError('');

    // Validate invite code
    if (!inviteCode.trim()) {
      setInviteError('Invite code is required');
      return;
    }

    if (inviteCode.trim().length !== 8) {
      setInviteError('Invite code must be 8 characters');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithEmail(email, password, inviteCode.trim().toUpperCase());
      // After signup, user will need to complete onboarding
      // For now, just redirect to dashboard (onboarding will be added in Phase 5)
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';

      // Check if error is invite code related
      if (errorMessage.toLowerCase().includes('invite')) {
        setInviteError(errorMessage);
      } else {
        setError(errorMessage);
      }
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
        Create Account
      </h2>
      <p
        style={{
          fontSize: '14px',
          color: '#8B6F47',
          margin: '0 0 32px 0',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        Begin your journey of cultivating spiritual fruits
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

        {/* Invite Code Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="inviteCode"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B2D3E',
              marginBottom: '8px',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
            maxLength={8}
            placeholder="XXXXXXXX"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: inviteError ? '2px solid #FCC' : '2px solid #F5EDE0',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, monospace',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
            onFocus={(e) => {
              if (!inviteError) {
                e.target.style.borderColor = '#DEB9C5';
              }
            }}
            onBlur={(e) => {
              if (!inviteError) {
                e.target.style.borderColor = '#F5EDE0';
              }
            }}
          />
          <p
            style={{
              fontSize: '12px',
              color: '#8B6F47',
              margin: '4px 0 0 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Enter the 8-character code provided by an administrator
          </p>
          {inviteError && (
            <div
              style={{
                background: '#FEE',
                border: '1px solid #FCC',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '8px',
                fontSize: '14px',
                color: '#C00',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {inviteError}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '20px' }}>
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
            autoComplete="new-password"
            disabled={isLoading}
            minLength={8}
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
          <p
            style={{
              fontSize: '12px',
              color: '#8B6F47',
              margin: '4px 0 0 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            At least 8 characters
          </p>
        </div>

        {/* Confirm Password Input */}
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B2D3E',
              marginBottom: '8px',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {/* Sign In Link */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#8B6F47',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/auth/sign-in"
          style={{
            color: '#6B2D3E',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
