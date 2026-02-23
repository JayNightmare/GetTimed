import React from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "../../theme";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Input = ({
    label,
    error,
    containerStyle,
    style,
    ...props
}: InputProps) => {
    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError, style]}
                placeholderTextColor={colors.text.muted}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.caption,
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.bg.secondary,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        borderRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md + 2,
        fontSize: 16,
        color: colors.text.primary,
    },
    inputError: {
        borderColor: colors.status.error,
    },
    error: {
        color: colors.status.error,
        fontSize: 13,
        marginTop: 6,
        marginLeft: 4,
    },
});
