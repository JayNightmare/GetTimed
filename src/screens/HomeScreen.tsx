import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
    addWeeks,
    subWeeks,
} from "date-fns";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TimesheetModal } from "../components/TimesheetModal";
import { colors, spacing, radius, typography } from "../theme";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTimesheets, useJobTypes } from "../db/hooks";
import { Timesheet } from "../db";

type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
};

export const HomeScreen = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { settings } = useSettingsStore();
    const { getTimesheets, deleteTimesheet } = useTimesheets();
    const { getJobTypes } = useJobTypes();

    const [currentWeekStart, setCurrentWeekStart] = useState(() =>
        startOfWeek(new Date()),
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

    const weekDays = Array.from({ length: 7 }).map((_, i) =>
        addDays(currentWeekStart, i),
    );

    const loadTimesheets = useCallback(() => {
        const weekStartMs = currentWeekStart.getTime();
        const weekEndMs = addDays(currentWeekStart, 7).getTime() - 1;
        setTimesheets(getTimesheets(weekStartMs, weekEndMs) || []);
    }, [currentWeekStart]);

    useFocusEffect(
        useCallback(() => {
            loadTimesheets();
        }, [loadTimesheets]),
    );

    const openLogForDate = useCallback((date: Date) => {
        setSelectedDate(date);
        setModalVisible(true);
    }, []);

    const totalHours = timesheets.reduce(
        (acc, ts) => acc + (ts.duration || 0),
        0,
    );
    const quotaHours = settings.weeklyQuotaHours || 40;
    const progressPercent = Math.min((totalHours / quotaHours) * 100, 100);

    const jobTypes = getJobTypes() || [];
    const getJobTypeColor = (id: number) => {
        const jt = jobTypes.find((j) => j.id === id);
        return jt ? jt.color : colors.bg.secondary;
    };
    const getJobTypeName = (id: number) => {
        const jt = jobTypes.find((j) => j.id === id);
        return jt ? jt.name : "Unknown";
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={typography.label}>
                        {format(currentWeekStart, "MMMM yyyy")}
                    </Text>
                    <Text style={[typography.h1, { marginTop: 4 }]}>
                        GetTimed
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={styles.settingsBtn}
                    activeOpacity={0.7}
                >
                    <Icon name="settings" size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            {/* Week Navigation */}
            <View style={styles.weekNav}>
                <TouchableOpacity
                    onPress={() =>
                        setCurrentWeekStart(subWeeks(currentWeekStart, 1))
                    }
                    style={styles.navArrow}
                >
                    <Icon
                        name="chevronLeft"
                        size={20}
                        color={colors.text.secondary}
                    />
                </TouchableOpacity>
                <Text style={typography.caption}>
                    Week of {format(currentWeekStart, "MMM d")}
                </Text>
                <TouchableOpacity
                    onPress={() =>
                        setCurrentWeekStart(addWeeks(currentWeekStart, 1))
                    }
                    style={styles.navArrow}
                >
                    <Icon
                        name="chevronRight"
                        size={20}
                        color={colors.text.secondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Calendar Strip */}
            <Card style={{ marginBottom: spacing.xl }}>
                <View style={styles.dayRow}>
                    {weekDays.map((date, i) => {
                        const isToday = isSameDay(date, new Date());
                        return (
                            <TouchableOpacity
                                key={i}
                                onPress={() => openLogForDate(date)}
                                style={[
                                    styles.dayCell,
                                    isToday && styles.dayCellToday,
                                ]}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.dayLabel,
                                        isToday && styles.dayLabelToday,
                                    ]}
                                >
                                    {format(date, "EEE")}
                                </Text>
                                <Text
                                    style={[
                                        styles.dayNumber,
                                        isToday && styles.dayNumberToday,
                                    ]}
                                >
                                    {format(date, "d")}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <Text style={typography.caption}>
                        Total:{" "}
                        <Text
                            style={{
                                color: colors.purple.text,
                                fontWeight: "700",
                            }}
                        >
                            {totalHours}h
                        </Text>{" "}
                        / {quotaHours}h
                    </Text>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progressPercent}%` },
                            ]}
                        />
                    </View>
                </View>
            </Card>

            {/* Recent Logs */}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[typography.h3, { marginBottom: spacing.lg }]}>
                    Recent Logs
                </Text>
                {timesheets.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon
                            name="calendar"
                            size={48}
                            color={colors.text.muted}
                        />
                        <Text
                            style={[
                                typography.caption,
                                { marginTop: spacing.lg },
                            ]}
                        >
                            No timesheets logged recently.
                        </Text>
                        <Text
                            style={[
                                typography.small,
                                { marginTop: spacing.xs },
                            ]}
                        >
                            Tap a day above or use the button below.
                        </Text>
                    </View>
                ) : (
                    timesheets.map((ts) => (
                        <Card
                            key={ts.id}
                            style={{
                                marginBottom: spacing.md,
                                padding: spacing.md,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        flex: 1,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 6,
                                            backgroundColor: getJobTypeColor(
                                                ts.job_type_id,
                                            ),
                                            marginRight: spacing.md,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            paddingRight: spacing.sm,
                                        }}
                                    >
                                        <Text style={typography.body}>
                                            {getJobTypeName(ts.job_type_id)}
                                        </Text>
                                        <Text
                                            style={[
                                                typography.small,
                                                {
                                                    color: colors.text.muted,
                                                    marginTop: 2,
                                                },
                                            ]}
                                        >
                                            {format(
                                                new Date(ts.start_time),
                                                "MMM d, HH:mm",
                                            )}{" "}
                                            • {ts.duration}h
                                        </Text>
                                        {ts.description ? (
                                            <Text
                                                style={[
                                                    typography.caption,
                                                    {
                                                        marginTop: 4,
                                                        color: colors.text
                                                            .secondary,
                                                    },
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {ts.description}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        deleteTimesheet(ts.id);
                                        loadTimesheets();
                                    }}
                                    style={{ padding: spacing.sm }}
                                >
                                    <Icon
                                        name="trash"
                                        size={18}
                                        color={colors.text.muted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>

            {/* Floating Action */}
            <View style={styles.fab}>
                <Button
                    title="Log Time"
                    icon="plus"
                    onPress={() => openLogForDate(new Date())}
                />
            </View>

            <TimesheetModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    loadTimesheets();
                }}
                initialDate={selectedDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    settingsBtn: {
        backgroundColor: colors.bg.secondary,
        padding: spacing.md,
        borderRadius: radius.xl,
    },
    weekNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    navArrow: {
        padding: spacing.sm,
    },
    dayRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: spacing.md,
    },
    dayCell: {
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        height: 62,
        borderRadius: radius.lg,
        backgroundColor: colors.bg.tertiary,
    },
    dayCellToday: {
        backgroundColor: colors.purple.DEFAULT,
    },
    dayLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.text.secondary,
        marginBottom: 4,
    },
    dayLabelToday: {
        color: "rgba(196,132,252,0.8)",
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text.primary,
    },
    dayNumberToday: {
        color: colors.white,
    },
    progressSection: {
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border.subtle,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.full,
        marginLeft: spacing.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: colors.purple.DEFAULT,
        borderRadius: radius.full,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        opacity: 0.6,
    },
    fab: {
        position: "absolute",
        bottom: 40,
        left: spacing.lg,
        right: spacing.lg,
    },
});
