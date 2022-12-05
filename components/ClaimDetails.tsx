

import classNames from "classnames";
import styles from "css/modules/claim-details.module.scss";
import { BigNumber, utils } from "ethers";
import { VerifiedClaim } from "hooks/VerifiedClaims";
import { useEcoClaim } from "providers/EcoClaim";
import Countdown from "react-countdown";
import Button from "./button";
import CurrencyItem from "./CurrencyItem";
import HStack, { StackGapSize } from "./hstack";
import VStack from "./vstack";

type ClaimDetailsProps = {
    claimingEndsAt: BigNumber;
    claim: VerifiedClaim;
    hasAdditionalClaims: boolean;
    onClaimButtonClick: () => void;
    isClaimPending: boolean;
    handleChangeButtonClick: () => void;
}

const ClaimDetails = ({ claimingEndsAt, claim, hasAdditionalClaims, onClaimButtonClick, isClaimPending, handleChangeButtonClick }: ClaimDetailsProps) => {

    const ecoClaim = useEcoClaim();

    const getEco = () => {
        return utils.formatUnits(claim.points.mul(ecoClaim.POINTS_MULTIPLIER).mul(ecoClaim.currentInflationMultiplier).div(ecoClaim.initialInflationMultiplier));
    }

    const getEcoX = () => {
        return utils.formatUnits(claim.points.div(ecoClaim.POINTS_TO_ECOX_RATIO));
    }

    if (!claim) {
        return <div className={styles.loader} />
    }

    return (
        <div className={styles.claimDetails}>
            <HStack align="end">
                <VStack style={{ flex: 1 }} gapSize={StackGapSize.Small}>
                    <p className="sectionSubtitle">First Claim</p>
                    <CurrencyItem amount={getEco()} currency="eco" message="The points are the point" />
                    <CurrencyItem amount={getEcoX()} currency="ecox" message="We all win together" />
                </VStack>

                <VStack>
                    <HStack justify="end">
                        <Button title="Start Claim" showArrow onClick={onClaimButtonClick} disabled={isClaimPending} isLoading={isClaimPending} />
                    </HStack>
                </VStack>
            </HStack>

            <div className={styles.countdown}>
                {claimingEndsAt.gt(0) && (
                    <Countdown
                        date={claimingEndsAt.toNumber() * 1000}
                        renderer={({ days, hours, minutes, seconds, completed }) =>
                            completed ? (
                                <div>Sorry, the claim window is over</div>
                            ) : (
                                <>
                                    <p className={classNames(
                                        `text-size-small`,
                                        styles.countdownLabel
                                    )}>Claim Window ends in: {days}d, {hours}h, {minutes}m, {seconds}s</p>
                                    <p className="text-size-small">You’ll be eligible to claim more ECO and ECOx starting 30 days after you complete this claim process. <a href="https://eco.org/articles/eco-ecox-overview#community-claim" rel="noreferrer" target="_blank" className="text-color-medium">Want to know more?</a>.
                                    </p>
                                </>
                            )
                        }
                    />
                )}
            </div>

        </div>
    )
}

export default ClaimDetails;