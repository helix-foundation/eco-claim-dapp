import Callout from "./callout";
import ConnectWalletButton from "./ConnectWalletButton";
import Copy from "./copy";
import { StackGapSize } from "./hstack";
import VStack from "./vstack";

const LoggedOut = () => {

    return (
        <VStack gapSize={StackGapSize.Large}>
            <div>
                <p className="sectionSubtitle">Welcome Researcher...</p>
                <h2 className="sectionTitle">Connect your wallet</h2>
            </div>
            <Copy large>
                <p className="text-size-large">To check your eligibility for claiming ECO and ECOx, connect your wallet.</p>
            </Copy>
            <div>
                <ConnectWalletButton />
            </div>
            <div />
            <div />
            <div style={{ maxWidth: 400 }}>
                <Callout>
                    <p><strong>Note:</strong> Use the Ethereum wallet you linked to your Discord or Twitter accounts on <a href="http://nft.eco.id">nft.eco.id</a>. If you haven’t linked your wallet with your accounts yet, go there first.</p>
                </Callout>
            </div>
        </VStack>
    )
}

export default LoggedOut;