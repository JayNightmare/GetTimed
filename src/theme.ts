import { StyleSheet } from "react-native";

export const colors = {
    bg: {
        primary: "#09090b", // zinc-950
        secondary: "#18181b", // zinc-900
        tertiary: "#27272a", // zinc-800
        elevated: "#3f3f46", // zinc-700
    },
    purple: {
        DEFAULT: "#9333ea", // purple-600
        light: "#a855f7", // purple-500
        dark: "#7e22ce", // purple-700
        subtle: "#581c87", // purple-900
        text: "#c084fc", // purple-400
    },
    text: {
        primary: "#fafafa", // zinc-50
        secondary: "#a1a1aa", // zinc-400
        muted: "#71717a", // zinc-500
        inverse: "#09090b",
    },
    border: {
        DEFAULT: "#27272a", // zinc-800
        subtle: "rgba(39,39,42,0.5)",
    },
    status: {
        error: "#ef4444",
        success: "#22c55e",
    },
    white: "#ffffff",
    black: "#000000",
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
} as const;

export const typography = StyleSheet.create({
    h1: { fontSize: 28, fontWeight: "700", color: colors.text.primary },
    h2: { fontSize: 22, fontWeight: "700", color: colors.text.primary },
    h3: { fontSize: 18, fontWeight: "600", color: colors.text.primary },
    body: { fontSize: 16, fontWeight: "400", color: colors.text.primary },
    caption: { fontSize: 14, fontWeight: "500", color: colors.text.secondary },
    small: { fontSize: 12, fontWeight: "500", color: colors.text.muted },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text.secondary,
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
});
