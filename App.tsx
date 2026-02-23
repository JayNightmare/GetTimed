import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "./src/db";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import {
    registerForPushNotificationsAsync,
    scheduleDailyReminder,
} from "./src/services/NotificationService";
import { useSettingsStore } from "./src/store/useSettingsStore";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
    const { settings } = useSettingsStore();

    useEffect(() => {
        registerForPushNotificationsAsync().catch(console.error);
    }, []);

    useEffect(() => {
        if (settings.dailyReminderEnabled) {
            scheduleDailyReminder(settings.dailyReminderTime).catch(
                console.error,
            );
        }
    }, [settings.dailyReminderEnabled, settings.dailyReminderTime]);

    return (
        <SQLiteProvider databaseName="gettimed.db" onInit={migrateDbIfNeeded}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "#09090b" },
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
                <StatusBar style="light" />
            </NavigationContainer>
        </SQLiteProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#09090b",
    },
});
