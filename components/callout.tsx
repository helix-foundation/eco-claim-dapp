import React from "react";
import styles from "css/modules/callout.module.scss";
import classNames from "classnames";

type CalloutType = {
    children: React.ReactNode;
    large?: Boolean;
};

const Callout = ({ children, large }: CalloutType) => {
    return (
        <div className={classNames(styles.callout)}>
            {children}
        </div>
    );
};

export default Callout;