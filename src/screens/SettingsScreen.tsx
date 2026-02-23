import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Switch,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { useSettingsStore } from "../store/useSettingsStore";
import { useJobTypes } from "../db/hooks";
import { JobType } from "../db";
import { colors, spacing, radius, typography } from "../theme";
import { useNavigation } from "@react-navigation/native";

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const { settings, updateSettings } = useSettingsStore();
    const { getJobTypes, addJobType, removeJobType } = useJobTypes();
    const [jobTypes, setJobTypes] = useState<JobType[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [newJobName, setNewJobName] = useState("");

    const loadJobTypes = useCallback(() => {
        setJobTypes(getJobTypes());
    }, []);

    useEffect(() => {
        loadJobTypes();
    }, [loadJobTypes]);

    const handleAddJobType = () => {
        if (newJobName.trim()) {
            const colorsList = [
                "#9333ea",
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#ec4899",
                "#8b5cf6",
            ];
            const randomColor =
                colorsList[Math.floor(Math.random() * colorsList.length)];
            addJobType(newJobName.trim(), randomColor);
            setNewJobName("");
            setAddModalVisible(false);
            loadJobTypes();
        }
    };

    const handleDeleteJobType = (id: number) => {
        removeJobType(id);
        loadJobTypes();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={typography.h1}>Settings</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeBtn}
                    activeOpacity={0.7}
                >
                    <Icon name="close" size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                    style={[
                        typography.label,
                        { marginTop: spacing.lg, marginBottom: spacing.lg },
                    ]}
                >
                    Preferences
                </Text>
                <Card style={{ marginBottom: spacing.xl }}>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={typography.body}>Daily Reminders</Text>
                            <Text style={[typography.small, { marginTop: 4 }]}>
                                Check in at {settings.dailyReminderTime}
                            </Text>
                        </View>
                        <Switch
                            value={settings.dailyReminderEnabled}
                            onValueChange={(val) =>
                                updateSettings({ dailyReminderEnabled: val })
                            }
                            trackColor={{
                                false: colors.bg.tertiary,
                                true: colors.purple.DEFAULT,
                            }}
                            thumbColor={colors.white}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={{ paddingVertical: spacing.sm }}>
                        <Text
                            style={[
                                typography.body,
                                { marginBottom: spacing.md },
                            ]}
                        >
                            Weekly Target Hours
                        </Text>
                        <Input
                            placeholder="40"
                            keyboardType="numeric"
                            value={settings.weeklyQuotaHours.toString()}
                            onChangeText={(t) =>
                                updateSettings({
                                    weeklyQuotaHours: parseInt(t) || 0,
                                })
                            }
                        />
                    </View>
                </Card>

                <Text
                    style={[
                        typography.label,
                        { marginTop: spacing.lg, marginBottom: spacing.lg },
                    ]}
                >
                    Job Types
                </Text>
                <Card style={{ marginBottom: 40 }}>
                    {jobTypes.map((jt, index) => (
                        <React.Fragment key={jt.id}>
                            <View style={styles.jobTypeRow}>
                                <View style={styles.jobTypeLabel}>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: jt.color },
                                        ]}
                                    />
                                    <Text style={typography.body}>
                                        {jt.name}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{ padding: spacing.sm }}
                                    onPress={() => handleDeleteJobType(jt.id)}
                                >
                                    <Icon
                                        name="trash"
                                        size={18}
                                        color={colors.text.muted}
                                    />
                                </TouchableOpacity>
                            </View>
                            {index < jobTypes.length - 1 && (
                                <View style={styles.divider} />
                            )}
                        </React.Fragment>
                    ))}
                    {jobTypes.length > 0 && (
                        <View
                            style={[
                                styles.divider,
                                { marginBottom: spacing.lg },
                            ]}
                        />
                    )}
                    <Button
                        title="Add Job Type"
                        variant="ghost"
                        icon="plus"
                        onPress={() => setAddModalVisible(true)}
                    />
                </Card>
            </ScrollView>

            <Modal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                title="Add Job Type"
            >
                <View>
                    <Input
                        label="Job Type Name"
                        placeholder="e.g. Design Work"
                        value={newJobName}
                        onChangeText={setNewJobName}
                    />
                    <Button
                        title="Save Job Type"
                        onPress={handleAddJobType}
                        style={{
                            marginTop: spacing.xl,
                            marginBottom: spacing.lg,
                        }}
                    />
                </View>
            </Modal>
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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.xxl,
    },
    closeBtn: {
        padding: spacing.md,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.subtle,
        marginVertical: spacing.sm,
    },
    jobTypeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
    },
    jobTypeLabel: {
        flexDirection: "row",
        alignItems: "center",
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.md,
    },
});
