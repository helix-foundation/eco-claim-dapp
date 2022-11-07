import { createContext } from "react";
import styles from "css/modules/helpOverlay.module.scss";
import VStack from "./vstack";
import { StackGapSize } from "./hstack";
import classNames from "classnames";

type HelpOverlayProps = {
    shouldShow: boolean;
}

const HelpOverlay = ({ shouldShow }: HelpOverlayProps) => {

    return (
        <HelpOverlayContext.Consumer>
            {context => (
                <div className={classNames(
                    styles.helpOverlay,
                    shouldShow ? styles["helpOverlay-isVisible"] : undefined)}>
                    <div className={styles.container}>
                        <button className={styles.overlayClose} onClick={() => context.setShouldShow(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L12 12L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L12 12L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className={styles.title}>Help</div>
                        <VStack gapSize={StackGapSize.XLarge}>
                            <div className={styles.question}>
                                <div className={styles.questionTitle}>How do I know if I am eligible for a claim?</div>
                                <div className={styles.questionBody}>
                                    You are eligible if you (1) had Points in Eco&apos;s pre-launch Discord and Twitter communities, and (2) have verified your wallet address and social account ownership through <a href="https://nft.eco.id" target="_blank" rel="noreferrer">nft.eco.id</a>. You simply need to connect your wallet (the same one you used on <a href="https://nft.eco.id" target="_blank" rel="noreferrer">nft.eco.id</a>) to check if you have an available claim. If you are not eligible under the conditions above, drop into the <a href="http://discord.eco.org" target="_blank" rel="noreferrer">Eco Discord</a> and look for ways you can contribute going forward!
                                </div>
                            </div>

                            <div className={styles.question}>
                                <div className={styles.questionTitle}>How are claims calculated?</div>
                                <div className={styles.questionBody}>
                                    Claims are handled by the Eco claim contract <a href="https://etherscan.io/address/0x64a62830548334aa2188b9be2b0868b25cd7ab69" target="_blank" rel="noreferrer">here</a>. You can read more about the community claim logic <a href="https://eco.org/articles/eco-ecox-overview#community-claim" target="_blank" rel="noreferrer" >here</a>.
                                </div>
                            </div>

                            <div className={styles.question}>
                                <div className={styles.questionTitle}>I don&apos;t have any Ethereum (ETH) in my wallet. Can I still claim?</div>
                                <div className={styles.questionBody}>
                                    You do not need ETH to connect your wallet address or validate your claim eligibility. But you will need a small amount of ETH (&#60;0.05) to claim tokens. For most users, the easiest way to purchase ETH is directly through MetaMask; you can use a debit or credit card. You can also find helpful information under ‘Getting started’ <a href="https://metamask.io/faqs/" target="_blank" rel="noreferrer">here</a>.
                                </div>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.question}>
                                <div className={styles.questionBody}>
                                    Still need help? Drop into the <a href="http://discord.eco.org" target="_blank" rel="noreferrer" >Eco Discord</a> and post your questions!
                                </div>
                            </div>

                        </VStack>
                    </div>
                </div>
            )}
        </HelpOverlayContext.Consumer>
    )
}

export const HelpOverlayContext = createContext<{
    shouldShow: boolean;
    setShouldShow: (_: boolean) => void;
}>({
    shouldShow: false,
    setShouldShow: () => { }
})

export default HelpOverlay;