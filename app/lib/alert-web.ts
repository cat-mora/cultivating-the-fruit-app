/**
 * Web-compatible Alert utility
 * Provides Alert.alert functionality for web platform
 */

export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: Array<{ text: string; onPress?: () => void }>,
  ) => {
    if (typeof window === "undefined") return;

    const buttonText = buttons && buttons.length > 0 ? buttons[0].text : "OK";
    const onPress =
      buttons && buttons.length > 0 ? buttons[0].onPress : undefined;

    // Use native browser alert for now (we can make this prettier later)
    const fullMessage = message ? `${title}\n\n${message}` : title;
    window.alert(fullMessage);

    if (onPress) {
      onPress();
    }
  },
};
