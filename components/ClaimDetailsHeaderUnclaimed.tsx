import { VerifiedClaim } from "hooks/VerifiedClaims";
import { upperFirst } from "lodash";
import { shortAddress } from "pages/claim";
import Copy from "./copy";
import LinkButton from "./LinkButton";
import VStack from "./vstack";


type ClaimDetailsHeaderUnclaimedProps = {
    eligibleClaims: VerifiedClaim[];
    onBackButtonClick: () => void;
    selectedClaim: VerifiedClaim;
}

const ClaimDetailsHeaderUnclaimed = ({ eligibleClaims, onBackButtonClick, selectedClaim }: ClaimDetailsHeaderUnclaimedProps) => {
    return (
        <VStack>
            {
                eligibleClaims.length > 1 &&
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
            <Copy>
                <p className="text-size-xlarge text-color-normal font-romana">
                    <span className="text-color-medium"> Welcome {upperFirst(selectedClaim.app)}{" "}({shortAddress(selectedClaim.userid)})</span>
                    <br />
                    <span className="text-color-normal">Congratulations, you’re eligible to claim!</span>
                </p>
                <p>You can transfer ECO and ECOx to your connected wallet. Note that there will be a gas cost for the claim.</p>
            </Copy>
        </VStack >
    )
}

export default ClaimDetailsHeaderUnclaimed;