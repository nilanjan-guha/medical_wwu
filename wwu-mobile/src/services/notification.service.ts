import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const registerForPushNotifications = async () => {
  const permission = await Notifications.requestPermissionsAsync();
  return permission.status === "granted";
};

export const scheduleDailyReminder = async (title: string, body: string, hour = 9) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0
    }
  });
};
