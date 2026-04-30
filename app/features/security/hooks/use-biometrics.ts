// This file provides TypeScript type resolution for platform-specific implementations
// Actual implementation is in use-biometrics.native.ts and use-biometrics.web.ts

import { useState, useCallback } from 'react';

export const useBiometrics = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    // Platform-specific implementation will override this
    return false;
  }, []);

  return { authenticate, isAuthenticating, error };
};
