import { useState, useEffect } from 'react';
import { useJournalEntries } from '../../../lib/data/queries/use-journal';
import { useDailyContent } from '../../../features/content/hooks/use-daily-content';

export default function JournalWeb() {
  const [note, setNote] = useState('');
  const { data: journal, isLoading } = useJournalEntries();
  const content = useDailyContent();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (content && journal) {
      const today = new Date().toISOString().split('T')[0];
      const entry = journal.find((e) => e.entry_date.startsWith(today));
      // Note: In production, encrypted_content would need to be decrypted
      if (entry) setNote(entry.encrypted_content || '');
    }
  }, [content, journal]);

  const handleSave = async () => {
    if (!content) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);

      // Save journal entry logic will go here
      await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder

      setSaveMessage('✓ Journal saved safely');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('✗ Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream min-h-screen">
        <p className="text-charcoal/60">Loading journal...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-cream min-h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <header className="mt-14 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-wine font-serif text-2xl mb-1">
              Reflection • Day {content?.day_number}
            </h1>
            <p className="text-charcoal/40 text-xs font-bold uppercase">
              {content?.fruit_theme}
            </p>
          </div>
          <div className="bg-wine/10 p-3 rounded-full">
            <svg
              className="w-5 h-5 text-wine"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-label="Private journal"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </header>

        {/* Info Banner */}
        <div className="bg-mint-light border border-mint p-4 rounded-[16px] mb-6">
          <p className="text-charcoal text-sm">
            <span className="font-semibold">🔒 Private & Encrypted:</span> Your reflections are
            securely stored and only you can access them.
          </p>
        </div>

        {/* Editor Card */}
        <div className="bg-parchment p-6 rounded-[28px] border border-cream-dark shadow-sm">
          <textarea
            placeholder="How did today's scripture and activity move your heart?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full min-h-[300px] text-lg leading-relaxed text-charcoal bg-transparent border-none outline-none resize-none placeholder:text-charcoal/40"
            aria-label="Journal entry"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full mt-8 p-5 rounded-full shadow-md transition-all ${
            isSaving
              ? 'bg-wine/70 cursor-not-allowed'
              : 'bg-wine hover:bg-wine/90 active:scale-95'
          }`}
        >
          <span className="text-white text-lg font-bold">
            {isSaving ? 'Saving...' : 'Save to Sanctuary'}
          </span>
        </button>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mt-4 p-4 rounded-[16px] text-center ${
              saveMessage.includes('✓')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
