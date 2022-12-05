import { createContext } from "react";
import styles from "css/modules/alert.module.scss";
import VStack from "./vstack";
import HStack, { StackGapSize } from "./hstack";
import classNames from "classnames";
import Button from "./button";

type AlertProps = {
    shouldShow: boolean;
    alertBody: AlertType;
}

const Alert = ({ shouldShow, alertBody }: AlertProps) => {

    return (
        <AlertContext.Consumer>
            {context => (
                <div className={classNames(
                    styles.alert,
                    shouldShow ? styles["alert-isVisible"] : undefined)}>
                    <div className={styles.container}>
                        <button className={styles.alertClose} onClick={() => context.setShouldShow(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L12 12L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L12 12L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <VStack gapSize={StackGapSize.Medium}>
                            <p className={styles.title}>Are you sure?</p>
                            <p>You haven't yet reached the maximum possible earned ECOx based on your payout schedule.</p>
                            <div />
                            <HStack>
                                <Button title="Cancel" onClick={alertBody.primaryButtonHandler} />
                                <Button title="Yes, continue claim" secondary onClick={alertBody.secondaryButtonHandler} />
                            </HStack>
                        </VStack>
                    </div>
                </div>
            )}
        </AlertContext.Consumer>
    )
}

export const AlertContext = createContext<{
    shouldShow: boolean;
    setShouldShow: (_: boolean) => void;
    alertBody: AlertType;
    setAlert: (_: AlertType) => void;
}>({
    shouldShow: false,
    setShouldShow: () => { },
    alertBody: {
        primaryButtonHandler: () => {},
        secondaryButtonHandler: () => {}
    },
    setAlert: () => { }
})

export type AlertType = {
    primaryButtonHandler: () => void;
    secondaryButtonHandler: () => void;
}

export default Alert;