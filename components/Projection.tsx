import classNames from "classnames";
import styles from "css/modules/projection.module.scss";
import { BigNumber, utils } from "ethers";
import { VerifiedClaim } from "hooks/VerifiedClaims";
import { useEcoClaim } from "providers/EcoClaim";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "./button";
import CurrencyItem from "./CurrencyItem";
import { HelpOverlayContext } from "./HelpOverlay";
import HStack, { StackGapSize } from "./hstack";
import LinkButton from "./LinkButton";
import VStack from "./vstack";

type ProjectionProps = {
    value?: number;
    claim: VerifiedClaim;
    onClaimButtonClick: () => void;
    isClaimPending: boolean;
}

const points = 5;

const Projection = ({ claim, onClaimButtonClick, isClaimPending }: ProjectionProps) => {

    const [x, setX] = useState(0);

    const [currentCliffX, setCurrentCliffX] = useState(0);
    const [cliffs, setCliffs] = useState([]);
    const [currentCliff, setCurrentCliff] = useState<{ availableAfter: number, amount: BigNumber } | null>(null);

    const [sliderRect, setSliderRect] = useState<DOMRect>(null);
    const [wrapperHeight, setWrapperHeight] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(x);
    const [showDetails, setShowDetails] = useState(true);
    const measureRef = useRef<HTMLDivElement>(null);

    const ecoClaim = useEcoClaim();

    const futureClaims = ecoClaim.getVestingCliffs(claim.points, Date.now());

    useEffect(() => {
        if (sliderRef.current) {
            setSliderRect(sliderRef.current.getBoundingClientRect());
            setWrapperHeight(measureRef.current.getBoundingClientRect().height);
        }
    }, [showDetails, sliderRef])

    useEffect(() => {
        const getCurrentCliff = () => {
            const currTime = Math.round(Date.now() / 1000);

            const cliffWidth = sliderRect.width / (points - 1);

            const vestingCliffs = ecoClaim.getVestingCliffs(claim.points, claim.tokenClaim.claimTime.toNumber());
            // reduce to only the upticks in amount
            const cliffs = [vestingCliffs[0], vestingCliffs[5], vestingCliffs[17], vestingCliffs[23]];

            // find the earliest cliff that hasn't been reached yet
            const index = cliffs.findIndex((cliff) => cliff.availableAfter > currTime)

            if (index === -1) {
                // no such index? all cliffs have passed
                const yearInSeconds = 31536000;
                setCurrentCliffX(sliderRect.width - cliffWidth + (cliffWidth * ((currTime - cliffs[cliffs.length - 1].availableAfter) / yearInSeconds)));
                setCurrentCliff(cliffs[cliffs.length - 1]);
            } else {
                const currentCliffTimeRange = cliffs[index].availableAfter - (index > 0 ? cliffs[index - 1].availableAfter : claim.tokenClaim.claimTime.toNumber());
                const timeSinceCurrentCliffStarted = currTime - (index > 0 ? cliffs[index - 1].availableAfter : claim.tokenClaim.claimTime.toNumber());

                setCurrentCliffX(index === 0 ? 0 : ((index - 1) * cliffWidth) + ((timeSinceCurrentCliffStarted / currentCliffTimeRange) * cliffWidth))
                setCurrentCliff(index > 0 ? cliffs[index - 1] : null);
            }

            setCliffs(cliffs);
        }

        if (claim.tokenClaim && sliderRect) {
            getCurrentCliff();
            const timer = setInterval(() => getCurrentCliff(), 5000);
            return () => clearInterval(timer);
        }

    }, [claim, sliderRect, ecoClaim]);

    useEffect(() => {
        if (claim.tokenClaim) {
            setShowDetails(true);
        }
    }, [claim])

    const setSliderXPosition = (clientX) => {
        const x = Math.min(Math.max(0, clientX - sliderRect.left), sliderRect.width);
        setX(x);
        xRef.current = x;
    }

    const getValuesFromSliderPosition = (): [string, string] => {
        const x = getSliderRatio();
        const sectionSize = 1 / (points - 1);

        const cliffs = [futureClaims[0], futureClaims[5], futureClaims[17], futureClaims[23]];

        const i = Math.floor(x / sectionSize);

        if (i >= points - 1) {
            return [getEco(), utils.formatUnits(cliffs[cliffs.length-1].amount)];
        }
        else {
            return [getEco(), utils.formatUnits(cliffs[i].amount)];
        }
    }

    const snapToNearestPoint = () => {
        const sectionSize = 1 / (points - 1);

        for (let i = 0; i < points; i++) {
            if (getSliderRatio() <= i * sectionSize) {
                if (getSliderRatio() < ((i * sectionSize) - (sectionSize * 0.5))) {
                    return ((i - 1) * sectionSize) * sliderRect.width;
                }

                return (i * sectionSize) * sliderRect.width;
            }
        }

    }

    const handleMouseDown = (e) => {
        setSliderXPosition(e.clientX);

        const snappedX = snapToNearestPoint();

        setX(snappedX);
        xRef.current = snappedX;
    }

    const handleDrag = (e) => {
        setSliderXPosition(e.clientX);
    }

    const getSliderRatio = () => {
        if (!sliderRef.current) {
            return 0
        }

        return xRef.current / sliderRect.width
    }

    const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleMouseUp);

        const snappedX = snapToNearestPoint();

        setX(snappedX);
        xRef.current = snappedX;
    }

    const handleThumbMouseDown = (e) => {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", handleMouseUp);
    }

    const getCurrentSection = () => {
        const x = getSliderRatio();
        const sectionSize = 1 / (points - 1);

        for (let i = 0; i < points + 1; i++) {
            if (x < sectionSize * i) {
                return i - 1;
            }
        }
    }

    const getLabelText = () => {
        switch (getCurrentSection()) {
            case 0: {
                if (cliffs.length > 0) {
                    return new Date(cliffs[0].availableAfter * 1000).toLocaleDateString('en-US');
                } else {
                    return "After 30 days"
                }
            }
            case 1: {
                if (cliffs.length > 0) {
                    return new Date(cliffs[1].availableAfter * 1000).toLocaleDateString('en-US');
                } else {
                    return "After 6 months"
                }
            }
            case 2: {
                if (cliffs.length > 0) {
                    return new Date(cliffs[2].availableAfter * 1000).toLocaleDateString('en-US');
                } else {
                    return "After 18 months"
                }
            }
            case 3: {
                if (cliffs.length > 0) {
                    return new Date(cliffs[3].availableAfter * 1000).toLocaleDateString('en-US');
                } else {
                    return "After 2 years"
                }
            }
            case 4: {
                if (cliffs.length > 0) {
                    return new Date(cliffs[3].availableAfter * 1000).toLocaleDateString('en-US');
                } else {
                    return "After 2+ years"
                }
            }
        }
    }

    const getMaxValue = () => {
        return utils.formatUnits(futureClaims[futureClaims.length - 1].amount);
    }

    const getMinValue = () => {
        return utils.formatUnits(futureClaims[0].amount);
    }

    const getDisplayValues = () => {
        let [eco, ecox] = getValuesFromSliderPosition();
        if (currentCliff) {
            // a cliff has passed, get realtime values
            eco = getEco();
            ecox = String(utils.formatUnits(currentCliff.amount));
        }
        else if (claim.tokenClaim) {
            // the claim has gone through, but no cliff has passed, show 0
            eco = "0";
            ecox = "0";

        }
        else if (!showDetails) {
            // no claim, no details, show reg values
            eco = getEco();
            ecox = String(getMinValue()) + " \u2013 " + String(getMaxValue());
        }
        return {
            eco,
            ecox,
        }
    }

    const getEco = () => {
        return utils.formatUnits(claim.points.mul(ecoClaim.POINTS_MULTIPLIER).mul(ecoClaim.currentInflationMultiplier).div(ecoClaim.initialInflationMultiplier));
    }

    const { setShouldShow } = useContext(HelpOverlayContext);

    if (claim.tokenRelease) {
        return <></>;
    }

    return (
        <div className={classNames(
            styles.projection,
            claim.tokenClaim ? styles.highlighted : undefined
        )}>
            <HStack align="end">
                <VStack style={{ flex: 1 }} gapSize={StackGapSize.Small}>
                    <p className={`sectionSubtitle ${!claim.tokenClaim ? "text-color-medium" : ""}`}>Second Claim</p>
                    <CurrencyItem amount={getDisplayValues().eco} currency="eco" />
                    <CurrencyItem amount={getDisplayValues().ecox} currency="ecox" />
                </VStack>
                <VStack>
                    {!claim.tokenClaim &&
                        <div style={{ flex: 1, textAlign: "right" }}>
                            <LinkButton text={`${showDetails ? "Hide" : "Show"} details`} small color="gray" onClick={() => { setShowDetails(current => !current) }} />
                        </div>
                    }
                    {currentCliff && (
                        <HStack justify="end">
                            <Button title="Claim Now" showArrow onClick={onClaimButtonClick} disabled={isClaimPending} isLoading={isClaimPending} />
                        </HStack>
                    )}
                </VStack>

            </HStack>

            <div className={classNames(styles.projectionWrapper, showDetails ? styles.projectionVisible : undefined)} style={{
                height: showDetails ? wrapperHeight : undefined
            }}>
                <div ref={measureRef} className={styles.projectionInnerWrapper}>
                    <VStack gapSize={StackGapSize.Large}>
                        <p className="text-size-small text-color-medium">
                            {!claim.tokenClaim ?
                                `30 days after you complete your first claim, you’ll be able to claim another ${getEco()} ECO. And you’ll also be able to claim more ECOx, although the longer you wait, the more you’ll get. `
                                : currentCliffX ?
                                    `You’re ready to claim another ${getEco()} ECO. And you’ll also be able to claim more ECOx, although the longer you wait, the more you’ll get. ` :
                                    `In 30 days, you’ll be able to claim another ${getEco()} ECO. And you’ll also be able to claim more ECOx, although the longer you wait, the more you’ll get. `
                            }
                            <a href="https://eco.org/articles/eco-ecox-overview#community-claim" rel="noreferrer" target="_blank" style={{ cursor: "pointer" }}>Want to learn more?</a>
                        </p>
                        <div className={styles.chartWrapper}>
                            <div className={styles.projectionChart}>
                                <svg preserveAspectRatio="none" width="243" height="80" viewBox="0 0 243 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M243 0H182.25V20H121.5V40H60.75V60H0V80H60.75H121.5H182.25H243V0Z" fill="#D9D9D9" />
                                </svg>
                                <div className={styles.projectionChartOverlay}>
                                    <>
                                        <svg preserveAspectRatio="none" width="243" height="80" viewBox="0 0 243 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M243 0H182.25V20H121.5V40H60.75V60H0V80H60.75H121.5H182.25H243V0Z" fill="#D9D9D9" />
                                        </svg>
                                        <div style={{ width: `calc(100% - ${x}px)` }} />
                                        <span style={{ right: `calc(100% - ${x + 1}px)`, zIndex: 1 }}>
                                            <label style={{
                                                transform: `translateX(${x < 30 ? "24px" : x > sliderRect.width - 30 ? "-30px" : 0})`
                                            }}>{getLabelText()}</label>
                                        </span>
                                    </>
                                    {currentCliffX && currentCliff ? (
                                        <>
                                            <span className={styles.projectionChartCurrentIndicator} style={{ right: `calc(100% - ${currentCliffX}px)`, zIndex: 0 }}>
                                                <label style={{
                                                    transform: `translateX(${currentCliffX < 30 ? "24px" : currentCliffX > sliderRect.width - 30 ? "-30px" : 0})`,
                                                }}>Current ECOx payout ({getDisplayValues().ecox})</label>
                                            </span>
                                        </>
                                    ) : null}
                                </div>
                            </div>

                            <div className={styles.projectionSlider}>
                                <div className={styles.slider} ref={sliderRef} onMouseDown={handleMouseDown}>
                                    <div className={styles.sliderThumb} onMouseDown={handleThumbMouseDown} style={{
                                        transform: `translateX(${x}px)`
                                    }}>
                                        <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.550293 4.49996L4.79293 0.257324V8.74261L0.550293 4.49996Z" fill="#D9D9D9" />
                                            <path d="M12.2427 4.49996L8.00004 0.257324V8.74261L12.2427 4.49996Z" fill="#D9D9D9" />
                                        </svg>
                                    </div>
                                    <div className={styles.sliderFill} style={{
                                        width: `calc(${getSliderRatio()} * 100%)`
                                    }} />
                                    <div className={styles.sliderMarkings}>
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sliderLabels}>
                                <label>{utils.formatUnits(futureClaims[0].amount)} ECOx</label>
                                <label>{utils.formatUnits(futureClaims[5].amount)} ECOx</label>
                                <label>{utils.formatUnits(futureClaims[17].amount)} ECOx</label>
                                <label>{utils.formatUnits(futureClaims[23].amount)} ECOx</label>
                            </div>
                        </div>
                    </VStack>
                </div>
            </div>
        </div>
    )
}

export default Projection;