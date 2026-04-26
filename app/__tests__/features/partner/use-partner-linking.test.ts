import { renderHook, act } from '@testing-library/react-native';
import { usePartnerLinking } from '../../../features/partner/hooks/use-partner-linking';
import { supabase } from '../../../lib/supabase/config';

const mockSetInviteCode = jest.fn();
const mockAddPartner = jest.fn();
const mockSetLinkedPartners = jest.fn();

jest.mock('../../../lib/supabase/config', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../../../store/partner-store', () => ({
  usePartnerStore: jest.fn(() => ({
    setInviteCode: mockSetInviteCode,
    addPartner: mockAddPartner,
    setLinkedPartners: mockSetLinkedPartners,
    linkedPartners: [],
    currentInviteCode: null,
    inviteCodeExpiry: null,
  })),
}));

type PartnerLinkRow = {
  creator_id: string;
  partner_id?: string | null;
  invite_code?: string;
  status?: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  accepted_at?: string | null;
  created_at?: string;
};

function createInsertChain(result: unknown) {
  return {
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve(result)),
      })),
    })),
  };
}

function createInviteLookupChain(result: unknown) {
  const secondEq = jest.fn(() => ({
    single: jest.fn(() => Promise.resolve(result)),
  }));

  return {
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: secondEq,
      })),
    })),
  };
}

function createUpdateChain(result: unknown) {
  return {
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve(result)),
    })),
  };
}

function createProfileLookupChain(email: string | null) {
  return {
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: { email }, error: null })),
      })),
    })),
  };
}

function createAcceptedLinksChain(result: { data: PartnerLinkRow[] | null; error: { message: string } | null }) {
  return {
    select: jest.fn(() => ({
      or: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve(result)),
      })),
    })),
  };
}

describe('usePartnerLinking', () => {
  const MOCK_USER_ID = 'user-123';
  const MOCK_PARTNER_ID = 'partner-456';
  const MOCK_EXPIRES_AT = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates an invite code and updates the local invite state', async () => {
    (supabase.from as jest.Mock).mockReturnValue(
      createInsertChain({ data: { invite_code: 'ABC123', expires_at: MOCK_EXPIRES_AT }, error: null })
    );

    const { result } = renderHook(() => usePartnerLinking());

    let response;
    await act(async () => {
      response = await result.current.generateInviteCode(MOCK_USER_ID);
    });

    expect(response).toEqual({
      data: expect.objectContaining({
        inviteCode: expect.any(String),
        expiresAt: expect.any(String),
      }),
      error: null,
    });
    expect(mockSetInviteCode).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(result.current.isLoading).toBe(false);
  });

  it('returns a user-facing error when the invite code is invalid', async () => {
    (supabase.from as jest.Mock).mockReturnValue(
      createInviteLookupChain({ data: null, error: { message: 'not found' } })
    );

    const { result } = renderHook(() => usePartnerLinking());

    let response;
    await act(async () => {
      response = await result.current.joinPartnerByCode(MOCK_USER_ID, 'BAD999');
    });

    expect(response).toEqual({
      data: null,
      error: 'Invalid invitation code',
    });
    expect(mockAddPartner).not.toHaveBeenCalled();
  });

  it('rejects self-invites', async () => {
    (supabase.from as jest.Mock).mockReturnValue(
      createInviteLookupChain({
        data: {
          creator_id: MOCK_USER_ID,
          expires_at: MOCK_EXPIRES_AT,
        },
        error: null,
      })
    );

    const { result } = renderHook(() => usePartnerLinking());

    let response;
    await act(async () => {
      response = await result.current.joinPartnerByCode(MOCK_USER_ID, 'ABC123');
    });

    expect(response).toEqual({
      data: null,
      error: 'You cannot accept your own invite',
    });
  });

  it('accepts a partner invite and hydrates the local partner cache', async () => {
    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'partner_links') {
        return {
          ...createInviteLookupChain({
            data: {
              creator_id: MOCK_PARTNER_ID,
              expires_at: MOCK_EXPIRES_AT,
            },
            error: null,
          }),
          ...createUpdateChain({ error: null }),
        };
      }

      if (table === 'profiles') {
        return createProfileLookupChain('partner@example.com');
      }

      return {};
    });

    const { result } = renderHook(() => usePartnerLinking());

    let response;
    await act(async () => {
      response = await result.current.joinPartnerByCode(MOCK_USER_ID, 'ABC123');
    });

    expect(response).toEqual({
      data: {
        partnerId: MOCK_PARTNER_ID,
        partnerEmail: 'partner@example.com',
        linkedAt: expect.any(String),
      },
      error: null,
    });
    expect(mockAddPartner).toHaveBeenCalledWith(
      expect.objectContaining({
        partnerId: MOCK_PARTNER_ID,
        partnerEmail: 'partner@example.com',
      })
    );
  });

  it('hydrates accepted partners from Supabase into the local store', async () => {
    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'partner_links') {
        return createAcceptedLinksChain({
          data: [
            {
              creator_id: MOCK_USER_ID,
              partner_id: MOCK_PARTNER_ID,
              expires_at: MOCK_EXPIRES_AT,
              accepted_at: '2026-04-25T10:00:00.000Z',
              created_at: '2026-04-25T09:00:00.000Z',
            },
          ],
          error: null,
        });
      }

      if (table === 'profiles') {
        return createProfileLookupChain('partner@example.com');
      }

      return {};
    });

    const { result } = renderHook(() => usePartnerLinking());

    let response;
    await act(async () => {
      response = await result.current.fetchLinkedPartners(MOCK_USER_ID);
    });

    expect(response).toEqual({
      data: [
        {
          id: MOCK_PARTNER_ID,
          partnerId: MOCK_PARTNER_ID,
          partnerEmail: 'partner@example.com',
          linkedAt: '2026-04-25T10:00:00.000Z',
        },
      ],
      error: null,
    });
    expect(mockSetLinkedPartners).toHaveBeenCalledWith([
      {
        id: MOCK_PARTNER_ID,
        partnerId: MOCK_PARTNER_ID,
        partnerEmail: 'partner@example.com',
        linkedAt: '2026-04-25T10:00:00.000Z',
      },
    ]);
  });

  it('sets isLoading during asynchronous work', async () => {
    (supabase.from as jest.Mock).mockReturnValue(
      createInsertChain(
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { invite_code: 'ABC123', expires_at: MOCK_EXPIRES_AT }, error: null }), 50)
        )
      )
    );

    const { result } = renderHook(() => usePartnerLinking());

    let pendingPromise: Promise<unknown>;
    act(() => {
      pendingPromise = result.current.generateInviteCode(MOCK_USER_ID);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await pendingPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
