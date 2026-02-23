import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    TouchableOpacityProps,
} from "react-native";
import { Icon, IconName } from "./Icon";
import { colors, radius, spacing } from "../../theme";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
    icon?: IconName;
}

const variantStyles = {
    primary: {
        bg: colors.purple.DEFAULT,
        text: colors.white,
        activeBg: colors.purple.dark,
    },
    secondary: {
        bg: colors.bg.tertiary,
        text: colors.text.primary,
        activeBg: colors.bg.elevated,
    },
    danger: {
        bg: colors.status.error,
        text: colors.white,
        activeBg: "#dc2626",
    },
    ghost: {
        bg: "transparent",
        text: colors.purple.text,
        activeBg: colors.bg.tertiary,
    },
};

export const Button = ({
    title,
    variant = "primary",
    isLoading = false,
    icon,
    style,
    disabled,
    ...props
}: ButtonProps) => {
    const v = variantStyles[variant];

    return (
        <TouchableOpacity
            style={[
                styles.base,
                { backgroundColor: v.bg },
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.75}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={v.text} />
            ) : (
                <View style={styles.content}>
                    {icon && (
                        <Icon
                            name={icon}
                            size={20}
                            color={v.text}
                            style={{ marginRight: spacing.sm }}
                        />
                    )}
                    <Text style={[styles.text, { color: v.text }]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.xl,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 17,
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.5,
    },
});
