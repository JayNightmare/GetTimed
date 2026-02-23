import React, { useState } from "react";
import {
    View,
    Text,
    Switch,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { useDraftStore } from "../store/useDraftStore";
import { useJobTypes, useTimesheets } from "../db/hooks";
import { colors, spacing, radius, typography } from "../theme";
import { format } from "date-fns";

interface TimesheetModalProps {
    visible: boolean;
    onClose: () => void;
    initialDate: Date;
}

export const TimesheetModal = ({
    visible,
    onClose,
    initialDate,
}: TimesheetModalProps) => {
    const { draft, updateDraft, clearDraft } = useDraftStore();
    const { getJobTypes } = useJobTypes();
    const { addTimesheet } = useTimesheets();
    const [isPresetMode, setIsPresetMode] = useState(true);
    const [startTimeStr, setStartTimeStr] = useState("09:00");
    const [durationStr, setDurationStr] = useState("8");

    // Preset Mode State
    const [selectedPresetId, setSelectedPresetId] = useState<number | null>(
        null,
    );
    const [presetHours, setPresetHours] = useState(4);
    const [presetMinutes, setPresetMinutes] = useState(0);

    const jobTypes = getJobTypes() || [];

    const handleSaveCustom = () => {
        if (!draft?.jobTypeId) {
            if (jobTypes.length > 0) {
                updateDraft({ jobTypeId: jobTypes[0].id });
            } else {
                return;
            }
        }

        const typeId =
            draft?.jobTypeId || (jobTypes.length > 0 ? jobTypes[0].id : 1);

        const [hoursText, minutesText] = startTimeStr.split(":");
        const hours = parseInt(hoursText) || 9;
        const minutes = parseInt(minutesText) || 0;

        const startDate = new Date(initialDate);
        startDate.setHours(hours, minutes, 0, 0);

        const durationHours = parseFloat(durationStr) || 8;

        addTimesheet({
            id:
                Date.now().toString() +
                Math.floor(Math.random() * 1000).toString(),
            job_type_id: typeId,
            start_time: startDate.getTime(),
            end_time: startDate.getTime() + durationHours * 3600000,
            duration: durationHours,
            description: draft?.description || "",
        });

        clearDraft();
        setStartTimeStr("09:00");
        setDurationStr("8");
        onClose();
    };

    const handleSavePreset = () => {
        const typeId =
            selectedPresetId || (jobTypes.length > 0 ? jobTypes[0].id : 1);
        const startDate = new Date(initialDate);
        startDate.setHours(9, 0, 0, 0);

        const durationHours = presetHours + presetMinutes / 60;

        addTimesheet({
            id:
                Date.now().toString() +
                Math.floor(Math.random() * 1000).toString(),
            job_type_id: typeId,
            start_time: startDate.getTime(),
            end_time: startDate.getTime() + durationHours * 3600000,
            duration: durationHours,
            description: "Quick log",
        });

        onClose();
        // Reset defaults for next time
        setPresetHours(4);
        setPresetMinutes(0);
        setSelectedPresetId(null);
    };

    const incrementHours = () => setPresetHours((h) => Math.min(24, h + 1));
    const decrementHours = () => setPresetHours((h) => Math.max(0, h - 1));
    const incrementMinutes = () =>
        setPresetMinutes((m) => Math.min(45, m + 15));
    const decrementMinutes = () => setPresetMinutes((m) => Math.max(0, m - 15));

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title={`Log for ${format(initialDate, "MMM d")}`}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Mode Toggle */}
                <View style={styles.modeToggle}>
                    <View>
                        <Text style={typography.h3}>Preset Mode</Text>
                        <Text style={[typography.small, { marginTop: 4 }]}>
                            Use templates for faster entry
                        </Text>
                    </View>
                    <Switch
                        value={isPresetMode}
                        onValueChange={setIsPresetMode}
                        trackColor={{
                            false: colors.bg.tertiary,
                            true: colors.purple.DEFAULT,
                        }}
                        thumbColor={colors.white}
                    />
                </View>

                {isPresetMode ? (
                    <View style={{ marginBottom: spacing.xl }}>
                        <Text
                            style={[
                                typography.label,
                                { marginBottom: spacing.xs },
                            ]}
                        >
                            Job Type
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: spacing.xl }}
                        >
                            {jobTypes.map((jt) => {
                                const isSelected =
                                    selectedPresetId === jt.id ||
                                    (selectedPresetId === null &&
                                        jobTypes[0]?.id === jt.id);
                                return (
                                    <TouchableOpacity
                                        key={jt.id}
                                        onPress={() =>
                                            setSelectedPresetId(jt.id)
                                        }
                                        style={{
                                            paddingHorizontal: spacing.md,
                                            paddingVertical: spacing.sm,
                                            borderRadius: radius.full,
                                            backgroundColor: isSelected
                                                ? colors.purple.DEFAULT
                                                : colors.bg.secondary,
                                            marginRight: spacing.sm,
                                            borderWidth: 1,
                                            borderColor: isSelected
                                                ? colors.purple.DEFAULT
                                                : colors.border.subtle,
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: jt.color,
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                marginRight: 6,
                                            }}
                                        />
                                        <Text
                                            style={[
                                                typography.body,
                                                {
                                                    color: isSelected
                                                        ? colors.white
                                                        : colors.text.secondary,
                                                },
                                            ]}
                                        >
                                            {jt.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <Text
                            style={[
                                typography.label,
                                { marginBottom: spacing.md },
                            ]}
                        >
                            Duration
                        </Text>
                        <View style={styles.durationContainer}>
                            {/* Hours Column */}
                            <View style={styles.counterCol}>
                                <TouchableOpacity
                                    onPress={incrementHours}
                                    style={styles.counterBtn}
                                >
                                    <Icon
                                        name="chevronUp"
                                        size={24}
                                        color={colors.text.primary}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>
                                    {presetHours} h
                                </Text>
                                <TouchableOpacity
                                    onPress={decrementHours}
                                    style={styles.counterBtn}
                                >
                                    <Icon
                                        name="chevronDown"
                                        size={24}
                                        color={colors.text.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Minutes Column */}
                            <View style={styles.counterCol}>
                                <TouchableOpacity
                                    onPress={incrementMinutes}
                                    style={styles.counterBtn}
                                >
                                    <Icon
                                        name="chevronUp"
                                        size={24}
                                        color={colors.text.primary}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>
                                    {presetMinutes.toString().padStart(2, "0")}{" "}
                                    m
                                </Text>
                                <TouchableOpacity
                                    onPress={decrementMinutes}
                                    style={styles.counterBtn}
                                >
                                    <Icon
                                        name="chevronDown"
                                        size={24}
                                        color={colors.text.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Button
                            title="Save Entry"
                            onPress={handleSavePreset}
                            style={{ marginTop: spacing.xl }}
                        />
                    </View>
                ) : (
                    <View>
                        <Text
                            style={[
                                typography.label,
                                { marginBottom: spacing.xs },
                            ]}
                        >
                            Job Type
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: spacing.lg }}
                        >
                            {jobTypes.map((jt) => (
                                <TouchableOpacity
                                    key={jt.id}
                                    onPress={() =>
                                        updateDraft({ jobTypeId: jt.id })
                                    }
                                    style={{
                                        paddingHorizontal: spacing.md,
                                        paddingVertical: spacing.sm,
                                        borderRadius: radius.full,
                                        backgroundColor:
                                            draft?.jobTypeId === jt.id
                                                ? colors.purple.DEFAULT
                                                : colors.bg.secondary,
                                        marginRight: spacing.sm,
                                        borderWidth: 1,
                                        borderColor:
                                            draft?.jobTypeId === jt.id
                                                ? colors.purple.DEFAULT
                                                : colors.border.subtle,
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: jt.color,
                                            width: 8,
                                            height: 8,
                                            borderRadius: 4,
                                            marginRight: 6,
                                        }}
                                    />
                                    <Text
                                        style={[
                                            typography.body,
                                            {
                                                color:
                                                    draft?.jobTypeId === jt.id
                                                        ? colors.white
                                                        : colors.text.secondary,
                                            },
                                        ]}
                                    >
                                        {jt.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: spacing.sm }}>
                                <Input
                                    label="Start Time"
                                    placeholder="09:00"
                                    value={startTimeStr}
                                    onChangeText={setStartTimeStr}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.sm }}>
                                <Input
                                    label="Duration (h)"
                                    placeholder="8"
                                    keyboardType="numeric"
                                    value={durationStr}
                                    onChangeText={setDurationStr}
                                />
                            </View>
                        </View>
                        <Input
                            label="What I did"
                            placeholder="Describe what you focused on..."
                            multiline
                            numberOfLines={4}
                            value={draft?.description || ""}
                            onChangeText={(t) =>
                                updateDraft({ description: t })
                            }
                            style={{ height: 120, textAlignVertical: "top" }}
                        />
                    </View>
                )}

                {!isPresetMode && (
                    <View
                        style={{
                            marginTop: spacing.xxl,
                            marginBottom: spacing.lg,
                        }}
                    >
                        <Button title="Save Entry" onPress={handleSaveCustom} />
                    </View>
                )}
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modeToggle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(24,24,27,0.8)",
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border.subtle,
    },
    row: {
        flexDirection: "row",
        marginBottom: spacing.xs,
    },
    durationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.xxl,
        paddingVertical: spacing.lg,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border.subtle,
    },
    counterCol: {
        alignItems: "center",
    },
    counterBtn: {
        padding: spacing.sm,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.full,
    },
    counterValue: {
        fontSize: 32,
        fontWeight: "700",
        color: colors.text.primary,
        marginVertical: spacing.md,
        width: 80,
        textAlign: "center",
    },
});
