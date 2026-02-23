import React from "react";
import {
    Modal as RNModal,
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    ModalProps as RNModalProps,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Icon } from "./Icon";
import { colors, radius, spacing, typography } from "../../theme";

interface ModalProps extends RNModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
}

export const Modal = ({
    visible,
    onClose,
    title,
    children,
    ...props
}: ModalProps) => {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            {...props}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback
                        onPress={(e) => e.stopPropagation()}
                    >
                        <KeyboardAvoidingView
                            behavior={
                                Platform.OS === "ios" ? "padding" : undefined
                            }
                            style={styles.sheet}
                        >
                            <View style={styles.handle} />
                            <View style={styles.header}>
                                <Text style={typography.h2}>{title}</Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeBtn}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        color={colors.text.secondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {children}
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: colors.bg.primary,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
        minHeight: "50%",
        maxHeight: "90%",
        borderTopWidth: 1,
        borderColor: colors.border.subtle,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.bg.elevated,
        alignSelf: "center",
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    closeBtn: {
        padding: spacing.sm,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.full,
    },
});
