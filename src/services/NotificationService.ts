import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#a855f7",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification!");
            return;
        }
    } else {
        console.log("Must use physical device for Push Notifications");
    }
}

export async function scheduleDailyReminder(time: string) {
    // Clear existing to avoid duplicates
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
        if (notif.content.title === "Log Your Time ⏰") {
            await Notifications.cancelScheduledNotificationAsync(
                notif.identifier,
            );
        }
    }

    const [hour, minute] = time.split(":").map(Number);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Log Your Time ⏰",
            body: "Don't forget to record your deep work for today!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

export async function scheduleDraftReminder() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Incomplete Timesheet",
            body: "You have a draft waiting to be saved. Tap to complete.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 3600, // 1 hour
            repeats: false,
        },
    });
}
