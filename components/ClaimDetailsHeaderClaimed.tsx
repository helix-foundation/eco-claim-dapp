import { utils } from "ethers";
import { ClaimState, VerifiedClaim } from "hooks/VerifiedClaims";
import { shortAddress } from "pages/claim";
import Button from "./button";
import Callout from "./callout";
import { upperFirst } from "lodash";

import Copy from "./copy";
import CurrencyItem from "./CurrencyItem";
import { StackGapSize } from "./hstack";
import LinkButton from "./LinkButton";
import VStack from "./vstack";

type ClaimDetailsHeaderClaimedProps = {
    eligibleClaims: VerifiedClaim[];
    selectedClaim: VerifiedClaim;
    onBackButtonClick: () => void;
}


const ClaimDetailsHeaderClaimed = ({ eligibleClaims, selectedClaim, onBackButtonClick }: ClaimDetailsHeaderClaimedProps) => {

    return (
        <>
            <VStack>
                {eligibleClaims.length > 1 &&
                    <div>
                        <LinkButton isBounded onClick={onBackButtonClick} text="Back" color="gray" small leadingIcon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                    d="M15.0303 3.96967C15.3232 4.26256 15.3232 4.73744 15.0303 5.03033L8.06066 12L15.0303 18.9697C15.3232 19.2626 15.3232 19.7374 15.0303 20.0303C14.7374 20.3232 14.2626 20.3232 13.9697 20.0303L6.46967 12.5303C6.17678 12.2374 6.17678 11.7626 6.46967 11.4697L13.9697 3.96967C14.2626 3.67678 14.7374 3.67678 15.0303 3.96967Z"
                                    fill="black" />
                            </svg>
                        } />
                    </div>
                }
                {selectedClaim.tokenRelease ? (
                    <Copy>
                        <p className="text-size-xlarge text-color-normal font-romana">
                            <span className="text-color-medium"> {upperFirst(selectedClaim.app)}{" "}({shortAddress(selectedClaim.userid)}),</span>
                            <br />
                            <span className="text-color-normal">your claim is complete.</span>
                        </p>
                        <p>It&apos;s time to build. To learn more about how to vote with your tokens, and how else you can use them, visit <a href="https://eco.org/" rel="noreferrer" target="_blank">eco.org</a> or drop into the <a href="http://discord.eco.org" rel="noreferrer" target="_blank">Eco Discord</a>.</p>
                    </Copy>
                ) : (
                    <Copy>
                        <p className="text-size-xlarge text-color-normal font-romana">
                            <span className="text-color-medium"> {upperFirst(selectedClaim.app)}{" "}({shortAddress(selectedClaim.userid)}),</span>
                            <br />
                            <span className="text-color-normal">{selectedClaim.claimState === ClaimState.ReadyForSecondClaim ? "Congratulations, you're eligible to claim!" : "you've completed your first claim. But there's still more to come..."}</span>
                        </p>
                        <p>It pays to be early. But it also pays to be patient. {selectedClaim.claimState === ClaimState.ReadyForSecondClaim ? "You're eligible to make your final claim now, but will be able " : "You'll be eligible "}to claim more ECOx depending on how long you wait.</p>
                        <p>You can transfer claimed ECO and ECOx to your connected wallet. Note that there will be a gas cost for the claim.</p>
                    </Copy>
                )
                }
            </VStack>
            <VStack gapSize={StackGapSize.None}>
                <p className="sectionSubtitle text-color-medium">First claim on {new Date(selectedClaim.tokenClaim.claimTime.toNumber() *
                    1000).toLocaleDateString('en-US')}</p>
                <CurrencyItem amount={utils.formatUnits(selectedClaim.tokenClaim.amountEco)} currency="eco" />
                <CurrencyItem amount={utils.formatUnits(selectedClaim.tokenClaim.amountEcox)} currency="ecox" />
            </VStack>

            {selectedClaim.tokenRelease ? (
                <VStack gapSize={StackGapSize.None}>
                    <p className="sectionSubtitle text-color-medium">Second claim on {new Date(selectedClaim.tokenRelease.claimTime.toNumber() *
                        1000).toLocaleDateString('en-US')}</p>
                    <CurrencyItem amount={utils.formatUnits(selectedClaim.tokenRelease.amountEco)} currency="eco" />
                    <CurrencyItem amount={utils.formatUnits(selectedClaim.tokenRelease.amountEcox)} currency="ecox" />
                </VStack>
            ) : <></>
            }
        </>
    )
}

export default ClaimDetailsHeaderClaimed;