import React, { ReactNode } from "react";
import styles from "css/modules/stacks.module.scss";
import classNames from "classnames";

export enum StackGapSize {
    None,
    XSmall,
    Small,
    Medium,
    Large,
    XLarge
}

type JustifyType = "start" | "end" | "center";
type AlignType = "start" | "end" | "center" | "baseline";

type StackType = {
    children: ReactNode;
    isFull?: boolean;
    centerContent?: boolean;
    gapSize?: StackGapSize;
    justify?: JustifyType;
    align?: AlignType;
};

export const gapSizeMap = new Map<StackGapSize, string>([
    [StackGapSize.None, "none"],
    [StackGapSize.XSmall, "xsmall"],
    [StackGapSize.Small, "small"],
    [StackGapSize.Medium, "medium"],
    [StackGapSize.Large, "large"],
    [StackGapSize.XLarge, "xlarge"]
]);

export const justifyTypeMap = new Map<JustifyType, string>([
    ["start", "u-justify-start"],
    ["end", "u-justify-end"],
    ["center", "u-justify-center"]
]);

export const alignTypeMap = new Map<AlignType, string>([
  ["start", "u-align-start"],
  ["end", "u-align-end"],
  ["center", "u-align-center"],
  ["baseline", "u-align-baseline"]
]);

const HStack = ({ children, isFull, justify, align, centerContent, gapSize = StackGapSize.Medium }: StackType) => {
    return (
        <div className={classNames(
            styles.hStack,
            isFull ? styles['hStack-full'] : undefined,
            centerContent ? styles['hStack-centered'] : undefined,
            styles[`hStack-${gapSizeMap.get(gapSize)}`],
            justify && justifyTypeMap.get(justify),
            align && alignTypeMap.get(align)
        )}>
            {children}
        </div>
    );
};

export default HStack;