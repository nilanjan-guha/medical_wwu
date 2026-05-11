import { useEffect } from "react";
import { registerForPushNotifications, scheduleDailyReminder } from "../services/notification.service";

export const useNotifications = () => {
  useEffect(() => {
    const run = async () => {
      const granted = await registerForPushNotifications();
      if (granted) {
        await scheduleDailyReminder(
          "WWU Mood Check-in",
          "How are you feeling today? Take a 1-minute emotional check-in.",
          9
        );
      }
    };

    run();
  }, []);
};
