import React from "react";
import styles from "css/modules/copy.module.scss";
import classNames from "classnames";

type CopyType = {
    children: React.ReactNode;
    large?: Boolean;
};

const Copy = ({ children, large }: CopyType) => {
    return (
        <div className={classNames(styles.copy, large ? styles["copy-large"] : undefined)}>
            {children}
        </div>
    );
};

export default Copy;