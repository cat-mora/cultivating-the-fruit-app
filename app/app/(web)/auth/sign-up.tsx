import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../../lib/auth/auth-service';
import { validateSignupInvite, markInviteAsUsed } from '../../lib/admin/admin-service';

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
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate invite code
    if (!inviteCode || inviteCode.trim().length !== 6) {
      setError('Please enter a valid 6-character invite code');
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
      // Validate invite code before creating account
      const invite = await validateSignupInvite(inviteCode.trim());

      if (!invite) {
        setError('Invalid, expired, or already used invite code');
        setIsLoading(false);
        return;
      }

      // Create account
      const user = await signUpWithEmail(email, password);

      if (!user) {
        setError('Failed to create account');
        setIsLoading(false);
        return;
      }

      // Mark invite as used
      const marked = await markInviteAsUsed(inviteCode.trim(), user.id);

      if (!marked) {
        console.error('Failed to mark invite as used, but account was created');
      }

      // After signup, user will need to complete onboarding
      // For now, just redirect to dashboard (onboarding will be added in Phase 5)
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
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
            maxLength={6}
            disabled={isLoading}
            placeholder="ABC123"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #F5EDE0',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              textTransform: 'uppercase',
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
            Enter the 6-character code provided by an admin
          </p>
        </div>

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
