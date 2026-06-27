import { useUserStore } from "../../../store/user-store";
import { getJourneyContentForDay } from "../utils/journey-metrics";

/**
 * Get daily content based on activity completion, not calendar dates
 * Users progress through days by completing activities, preventing lost content from missed days
 */
export const useDailyContent = () => {
  const selectedStream = useUserStore((state) => state.selectedStream);
  const selectedTranslation = useUserStore(
    (state) => state.selectedTranslation,
  );
  const currentDay = useUserStore((state) => state.currentDay);

  const todayContent = getJourneyContentForDay(selectedStream, currentDay);

  if (!todayContent) return null;

  // Extract the specific translation text
  const scriptureText =
    todayContent.bible_text[selectedTranslation] ||
    todayContent.bible_text["NIV"];

  return {
    ...todayContent,
    scriptureText,
  };
};
