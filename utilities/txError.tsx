import { etherscanURL, toast } from "./";

type Error = {
    code?: string;
    transactionHash?: string;
    message?: string;
};

const txError = (title: string, error: Error) => {
    let body: string | JSX.Element;
    if (error.code === "ACTION_REJECTED") {
        body = "User Rejected Transaction";
    } else if (error.transactionHash) {
        body = (
            <a
                href={etherscanURL(error.transactionHash, "tx")}
                target="_blank"
                rel="noopener noreferrer"
            >View on Etherscan</a>
        );
    } else if (error.message) {
        body = error.message;
    }

    toast({ title, body, intent: 'danger' });
};

export default txError;