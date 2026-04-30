import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../lib/data/queries/use-profile';
import { usePartnerLinks } from '../../../lib/data/queries/use-partner';
import { JourneyStream, BibleTranslation } from '../../../store/user-store';
import { supabase } from '../../../lib/supabase/config';
import { ChangePasswordForm } from '../../../features/auth/components/change-password-form';

const streams: { id: JourneyStream; label: string; description: string }[] = [
  { id: 'strengthen', label: 'Strengthen', description: 'Deepen and strengthen your marriage bond' },
  { id: 'repair', label: 'Repair', description: 'Heal and restore your relationship' },
  { id: 'family', label: 'Family', description: 'Cultivate family unity and connection' },
];

const translations: BibleTranslation[] = ['NIV', 'NLT', 'ESV', 'KJV', 'NKJV'];

export default function SettingsWeb() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: partners } = usePartnerLinks();
  const [isResetting, setIsResetting] = useState(false);
  const [selectedStream, setSelectedStream] = useState<JourneyStream>(profile?.stream || 'strengthen');
  const [selectedTranslation, setSelectedTranslation] = useState<BibleTranslation>(
    profile?.translation || 'NIV'
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleSavePreferences = async () => {
    try {
      // Save preferences to Supabase
      await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder

      setSaveMessage('✓ Preferences saved');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('✗ Failed to save preferences');
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Sign out of your account?')) {
      await supabase.auth.signOut();
      navigate('/auth/sign-in');
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'Start over? This will clear your progress, journal entries, and reset your journey. This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      // Reset logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Placeholder
      navigate('/onboarding');
    } catch (error) {
      alert('Reset failed. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const linkedPartners = partners?.length || 0;

  return (
    <div className="flex-1 bg-cream min-h-screen overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <header className="mt-14 mb-8">
          <h1 className="text-3xl font-serif text-wine mb-2">Settings</h1>
          <p className="text-charcoal/60">Customize your spiritual journey</p>
        </header>

        {/* Journey Stream */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-charcoal mb-4">Journey Stream</h2>
          <div className="space-y-2">
            {streams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className={`w-full p-4 rounded-[16px] border-2 text-left transition-all ${
                  selectedStream === stream.id
                    ? 'border-wine bg-wine/10'
                    : 'border-cream-dark bg-white hover:border-wine/30'
                }`}
              >
                <p className={`font-bold mb-1 ${selectedStream === stream.id ? 'text-wine' : 'text-charcoal'}`}>
                  {stream.label}
                </p>
                <p className="text-charcoal/60 text-sm">{stream.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Bible Translation */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-charcoal mb-4">Bible Translation</h2>
          <div className="flex flex-wrap gap-2">
            {translations.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTranslation(t)}
                className={`px-5 py-2.5 rounded-full border transition-colors ${
                  selectedTranslation === t
                    ? 'bg-wine border-wine text-white'
                    : 'bg-white border-cream-dark text-charcoal hover:border-wine/50'
                }`}
              >
                <span className="font-semibold">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Save Preferences */}
        <button
          onClick={handleSavePreferences}
          className="w-full mb-8 p-4 rounded-full bg-sage text-white font-bold shadow-md hover:bg-sage/90 active:scale-95 transition-all"
        >
          Save Preferences
        </button>

        {saveMessage && (
          <div
            className={`mb-8 p-4 rounded-[16px] text-center ${
              saveMessage.includes('✓')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Partner Connection */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-charcoal mb-4">Partner Connection</h2>
          <button
            onClick={() => navigate('/partner')}
            className="w-full p-5 rounded-[20px] border-2 border-rose bg-rose-light/30 hover:bg-rose-light/50 transition-colors text-left"
          >
            <p className="text-wine font-bold mb-1">Relational Handshake</p>
            <p className="text-charcoal/60 text-sm">
              {linkedPartners > 0
                ? `${linkedPartners} partner(s) linked`
                : 'Link your journey with a partner'}
            </p>
          </button>
        </section>

        {/* Account Actions */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-charcoal mb-4">Account</h2>
          <div className="space-y-3">
            {/* Change Password */}
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full p-5 rounded-[20px] border-2 border-cream-dark bg-white hover:border-sage transition-colors text-left"
            >
              <p className="text-charcoal font-bold mb-1">Change Password</p>
              <p className="text-charcoal/60 text-sm">
                Update your account password
              </p>
            </button>

            {/* Export Data */}
            <button
              onClick={() => alert('Export feature coming soon!')}
              className="w-full p-5 rounded-[20px] border-2 border-cream-dark bg-white hover:border-sage transition-colors text-left"
            >
              <p className="text-charcoal font-bold mb-1">Export Data</p>
              <p className="text-charcoal/60 text-sm">
                Download your journey progress and journal entries
              </p>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full p-5 rounded-[20px] border-2 border-cream-dark bg-white hover:border-wine/50 transition-colors text-left"
            >
              <p className="text-charcoal font-bold mb-1">Sign Out</p>
              <p className="text-charcoal/60 text-sm">
                Sign out of your account on this device
              </p>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className={`w-full p-5 rounded-[20px] border-2 text-left transition-all ${
              isResetting
                ? 'border-rose/30 bg-rose-light/20 cursor-not-allowed'
                : 'border-rose bg-rose-light/30 hover:bg-rose-light/50'
            }`}
          >
            <p className="text-wine font-bold mb-1">
              {isResetting ? 'Resetting...' : 'Reset Journey'}
            </p>
            <p className="text-charcoal/60 text-sm">
              Clear all progress, journal entries, and start over. This cannot be undone.
            </p>
          </button>
        </section>

        {/* Footer */}
        <footer className="p-4 bg-parchment rounded-[16px] border border-cream-dark">
          <p className="text-charcoal/40 text-center text-xs">
            Cultivating the Fruits v1.0.0 • Web Edition
          </p>
        </footer>

        {/* Spacer */}
        <div className="h-20" />
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Change Password</h2>
            <ChangePasswordForm
              onSuccess={() => {
                setShowPasswordChange(false);
                setSaveMessage('✓ Password updated successfully');
                setTimeout(() => setSaveMessage(null), 3000);
              }}
              onCancel={() => setShowPasswordChange(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
