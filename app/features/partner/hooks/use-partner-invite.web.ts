import { useState } from "react";
import { useCreatePartnerInvite } from "../../../lib/data/queries/use-partner";
import { getWebUrl } from "../../../lib/feature-flags";

/**
 * Web-Specific Partner Invite Hook
 *
 * Generates shareable URLs for partner invites
 * Uses Web Share API when available (mobile browsers)
 * Falls back to clipboard copy
 */

export interface PartnerInviteResult {
  inviteCode: string;
  inviteUrl: string;
  expiresAt: string;
}

export function useWebPartnerInvite() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const createInviteMutation = useCreatePartnerInvite();

  /**
   * Generate a new partner invite URL
   */
  const generateInvite = async (): Promise<PartnerInviteResult> => {
    try {
      const invite = await createInviteMutation.mutateAsync();

      const webUrl = getWebUrl();
      const inviteUrl = `${webUrl}/partner/${invite.invite_code}`;

      return {
        inviteCode: invite.invite_code,
        inviteUrl,
        expiresAt: invite.expires_at,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to generate invite",
      );
    }
  };

  /**
   * Share invite using Web Share API (mobile) or copy to clipboard (desktop)
   */
  const shareInvite = async (inviteUrl: string): Promise<boolean> => {
    setIsSharing(true);
    setShareError(null);

    try {
      // Check if Web Share API is available (mobile browsers)
      if (navigator.share) {
        await navigator.share({
          title: "Join me on Cultivating the Fruits",
          text: "Let's be accountability partners on our spiritual journey!",
          url: inviteUrl,
        });

        setIsSharing(false);
        return true;
      }

      // Fallback: Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl);
        setIsSharing(false);
        return true;
      }

      // Fallback for older browsers: Create temp input
      const tempInput = document.createElement("input");
      tempInput.value = inviteUrl;
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      setIsSharing(false);
      return true;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to share";
      setShareError(errorMsg);
      setIsSharing(false);
      return false;
    }
  };

  /**
   * Generate AND share in one step
   */
  const generateAndShare = async (): Promise<boolean> => {
    try {
      const result = await generateInvite();
      return await shareInvite(result.inviteUrl);
    } catch (error) {
      setShareError(
        error instanceof Error ? error.message : "Failed to generate invite",
      );
      return false;
    }
  };

  /**
   * Check if Web Share API is supported
   */
  const canUseWebShare = (): boolean => {
    return typeof navigator !== "undefined" && "share" in navigator;
  };

  return {
    generateInvite,
    shareInvite,
    generateAndShare,
    canUseWebShare,
    isSharing,
    shareError,
    isCreating: createInviteMutation.isPending,
  };
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const tempInput = document.createElement("input");
    tempInput.value = text;
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.select();
    const success = document.execCommand("copy");
    document.body.removeChild(tempInput);

    return success;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Format expiry time for display
 */
export function formatExpiryTime(expiresAt: string): string {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}
