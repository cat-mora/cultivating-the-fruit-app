import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePartnerLinkByCode, useAcceptPartnerInvite } from '@/lib/data/queries/use-partner';
import { useAuthStore } from '@/store/auth-store';

/**
 * Partner Join Page
 *
 * Auto-join partner via URL: /partner/:code
 *
 * Flow:
 * 1. Extract code from URL
 * 2. Fetch invite details from Supabase
 * 3. Show invite info to user
 * 4. Accept on confirmation
 * 5. Redirect to the app home
 */
export default function PartnerJoin() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [status, setStatus] = useState<'loading' | 'ready' | 'accepting' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch invite by code
  const { data: invite, isLoading: isFetchingInvite, error: fetchError } = usePartnerLinkByCode(code || '');

  // Accept mutation
  const acceptMutation = useAcceptPartnerInvite();

  // Check invite validity on load
  useEffect(() => {
    if (isFetchingInvite || isLoading) {
      setStatus('loading');
      return;
    }

    if (!user) {
      // Redirect to sign in with return URL
      navigate(`/auth/sign-in?redirect=/partner/${code}`);
      return;
    }

    if (fetchError) {
      setStatus('error');
      setErrorMessage('Failed to load invite. Please check the link and try again.');
      return;
    }

    if (!invite) {
      setStatus('error');
      setErrorMessage('Invalid or expired invite code.');
      return;
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      setStatus('error');
      setErrorMessage('This invite has expired.');
      return;
    }

    // Check if already accepted
    if (invite.status !== 'pending') {
      setStatus('error');
      setErrorMessage('This invite has already been used.');
      return;
    }

    // Check if self-invite
    if (invite.creator_id === user.id) {
      setStatus('error');
      setErrorMessage('You cannot accept your own invite.');
      return;
    }

    setStatus('ready');
  }, [invite, isFetchingInvite, user, isLoading, fetchError, code, navigate]);

  const handleAccept = async () => {
    if (!code) return;

    setStatus('accepting');

    try {
      await acceptMutation.mutateAsync(code);
      setStatus('success');

      // Redirect to the stable app root after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to accept invite');
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '20px',
            }}
          >
            🔗
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#6B2D3E',
              margin: '0 0 8px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Loading invite...
          </h2>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(107, 45, 62, 0.1)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}
          >
            ❌
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#6B2D3E',
              margin: '0 0 12px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Invite Not Available
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#8B6F47',
              margin: '0 0 32px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {errorMessage}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              background: '#6B2D3E',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(107, 45, 62, 0.1)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}
          >
            🤝
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#6B2D3E',
              margin: '0 0 12px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Partner Connected!
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#8B6F47',
              margin: '0 0 32px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            You're now connected as accountability partners. You can see each other's progress in Settings.
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#A67C89',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Ready state - show confirmation
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF9F0 0%, #F5EDE0 100%)',
        padding: '20px',
      }}
    >
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}
          >
            🤝
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#6B2D3E',
              margin: '0 0 12px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Partner Invitation
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#8B6F47',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            You've been invited to become accountability partners on Cultivating the Fruits
          </p>
        </div>

        <div
          style={{
            background: '#F8E8ED',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B2D3E',
              margin: '0 0 8px 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            As partners, you'll be able to:
          </p>
          <ul
            style={{
              fontSize: '14px',
              color: '#8B6F47',
              margin: 0,
              paddingLeft: '20px',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            <li>See each other's daily progress</li>
            <li>Track each other's streaks</li>
            <li>Encourage spiritual growth together</li>
          </ul>
          <p
            style={{
              fontSize: '13px',
              color: '#A67C89',
              margin: '12px 0 0 0',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Note: Your journal remains private
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDecline}
            disabled={status === 'accepting'}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#6B2D3E',
              background: 'transparent',
              border: '2px solid #DEB9C5',
              borderRadius: '8px',
              cursor: status === 'accepting' ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              opacity: status === 'accepting' ? 0.5 : 1,
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={status === 'accepting'}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              background: status === 'accepting' ? '#A67C89' : '#6B2D3E',
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'accepting' ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {status === 'accepting' ? 'Accepting...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
