import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/use-auth';
import { PartnerLinkingScreen } from '../features/partner/components/partner-linking-screen';

export default function PartnerLinkingRoute() {
  const router = useRouter();
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return <PartnerLinkingScreen userId={userId} onPartnerLinked={() => router.back()} />;
}
