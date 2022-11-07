import { createContext } from "react";
import Loader from "./loader";
import TextLoader from "./TextLoader";

const UIBlock = () => {
    return (
        <UIBlockContext.Consumer>
            {context => (
                context.shouldShow &&
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        padding: "var(--space-large)",
                        backgroundColor: "var(--color-background)",
                        borderRadius: 5,
                        boxShadow: "0 0 6px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8
                    }}>
                        <Loader />
                        <TextLoader />
                    </div>
                </div>
            )}
        </UIBlockContext.Consumer>
    )
}


export const UIBlockContext = createContext<{
    shouldShow: boolean;
    setShouldShow: (_: boolean) => void;
}>({
    shouldShow: false,
    setShouldShow: () => { }
})

export default UIBlock;