import styles from "css/modules/pill.module.scss";
import { ReactNode } from "react";

const Pill = ({
    children
}: { children: ReactNode }) => {
    return (
        <div className={styles.pill}>
            {children}
        </div>
    )
}

export default Pill;