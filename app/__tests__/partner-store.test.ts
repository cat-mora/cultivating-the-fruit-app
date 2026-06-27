import { act } from "react-test-renderer";
import { usePartnerStore } from "../store/partner-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)), // Mock initial empty state
  removeItem: jest.fn(),
}));

describe("usePartnerStore", () => {
  const MOCK_PARTNER = {
    id: "123",
    partnerId: "partner-1",
    partnerEmail: "partner1@example.com",
    linkedAt: "2026-03-31T10:00:00Z",
  };

  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      usePartnerStore.setState({
        linkedPartners: [],
        currentInviteCode: null,
        inviteCodeExpiry: null,
      });
    });
    jest.clearAllMocks(); // Clear AsyncStorage mocks
  });

  it("should return initial state", () => {
    const { linkedPartners, currentInviteCode, inviteCodeExpiry } =
      usePartnerStore.getState();
    expect(linkedPartners).toEqual([]);
    expect(currentInviteCode).toBeNull();
    expect(inviteCodeExpiry).toBeNull();
  });

  it("should add a partner", () => {
    act(() => {
      usePartnerStore.getState().addPartner(MOCK_PARTNER);
    });
    const { linkedPartners } = usePartnerStore.getState();
    expect(linkedPartners).toEqual([MOCK_PARTNER]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "partner-storage",
      expect.any(String), // Expecting a serialized string
    );
  });

  it("should remove a partner", () => {
    act(() => {
      usePartnerStore.getState().addPartner(MOCK_PARTNER);
    });
    act(() => {
      usePartnerStore.getState().removePartner(MOCK_PARTNER.partnerId);
    });
    const { linkedPartners } = usePartnerStore.getState();
    expect(linkedPartners).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "partner-storage",
      expect.any(String),
    );
  });

  it("should set an invite code", () => {
    const code = "ABCDEF";
    const expiry = "2026-04-01T10:00:00Z";
    act(() => {
      usePartnerStore.getState().setInviteCode(code, expiry);
    });
    const { currentInviteCode, inviteCodeExpiry } = usePartnerStore.getState();
    expect(currentInviteCode).toBe(code);
    expect(inviteCodeExpiry).toBe(expiry);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "partner-storage",
      expect.any(String),
    );
  });

  it("should clear the invite code", () => {
    const code = "ABCDEF";
    const expiry = "2026-04-01T10:00:00Z";
    act(() => {
      usePartnerStore.getState().setInviteCode(code, expiry);
    });
    act(() => {
      usePartnerStore.getState().clearInviteCode();
    });
    const { currentInviteCode, inviteCodeExpiry } = usePartnerStore.getState();
    expect(currentInviteCode).toBeNull();
    expect(inviteCodeExpiry).toBeNull();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "partner-storage",
      expect.any(String),
    );
  });

  it("should return linked partners using getLinkedPartners", () => {
    act(() => {
      usePartnerStore.getState().addPartner(MOCK_PARTNER);
    });
    const linkedPartners = usePartnerStore.getState().getLinkedPartners();
    expect(linkedPartners).toEqual([MOCK_PARTNER]);
  });
});
