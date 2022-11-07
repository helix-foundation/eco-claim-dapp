import classNames from "classnames";
import styles from "css/modules/linkButton.module.scss";
import { ReactNode } from "react";

type LinkButtonProps = {
    text: string;
    color?: "accent" | "gray";
    small?: boolean;
    onClick?: () => void;
    leadingIcon?: ReactNode;
    isBounded?: boolean;
}

const LinkButton = ({ text, color = "accent", small, onClick, leadingIcon, isBounded }: LinkButtonProps) => {
    return (
        <button className={classNames(
            styles.linkButton,
            color === "gray" && styles["linkButton-colorGray"],
            small && "text-size-small",
            isBounded && styles["linkButton-bounded"]
        )}
            onClick={onClick}>
                {leadingIcon}
                <span>{text}</span>
            </button>
    )
}

export default LinkButton;