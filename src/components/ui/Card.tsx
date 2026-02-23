import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const Card = ({ style, children, ...props }: ViewProps) => {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(24,24,27,0.85)",
        borderRadius: radius.xxl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: "rgba(39,39,42,0.7)",
    },
});
