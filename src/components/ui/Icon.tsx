import React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export type IconName =
    | "calendar"
    | "check"
    | "settings"
    | "plus"
    | "close"
    | "chevronLeft"
    | "chevronRight"
    | "chevronUp"
    | "chevronDown"
    | "clock"
    | "trash";

interface IconProps extends SvgProps {
    name: IconName;
    size?: number;
    color?: string;
}

const iconPaths: Record<IconName, string> = {
    calendar:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    check: "M5 13l4 4L19 7",
    settings:
        "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    plus: "M12 4v16m8-8H4",
    close: "M6 18L18 6M6 6l12 12",
    chevronLeft: "M15 19l-7-7 7-7",
    chevronRight: "M9 5l7 7-7 7",
    chevronUp: "M5 15l7-7 7 7",
    chevronDown: "M19 9l-7 7-7-7",
    clock: "M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
};

export const Icon = ({
    name,
    size = 24,
    color = "currentColor",
    ...props
}: IconProps) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            color={color}
            {...props}
        >
            <Path
                d={iconPaths[name]}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
