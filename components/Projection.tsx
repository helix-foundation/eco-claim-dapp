import classNames from "classnames";
import styles from "css/modules/projection.module.scss";
import { utils } from "ethers";
import { VerifiedClaim } from "hooks/VerifiedClaims";
import { useEcoClaim } from "providers/EcoClaim";
import { useContext, useEffect, useRef, useState } from "react";
import CurrencyItem from "./CurrencyItem";
import { HelpOverlayContext } from "./HelpOverlay";
import HStack, { StackGapSize } from "./hstack";
import LinkButton from "./LinkButton";
import VStack from "./vstack";

type ProjectionProps = {
    value?: number;
    claim: VerifiedClaim;
}

const Projection = ({ value = 100, claim }: ProjectionProps) => {

    const [x, setX] = useState(0);
    const [sliderRect, setSliderRect] = useState<DOMRect>(null);
    const [wrapperHeight, setWrapperHeight] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(x);
    const [showDetails, setShowDetails] = useState(false);
    const measureRef = useRef<HTMLDivElement>(null);

    const ecoClaim = useEcoClaim();

    const futureClaims = ecoClaim.getVestingCliffs(claim.points, Date.now());

    useEffect(() => {
        setSliderRect(sliderRef.current.getBoundingClientRect());
        setWrapperHeight(measureRef.current.getBoundingClientRect().height);
    }, [showDetails])

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

    const getValue = () => {
        const x = getSliderRatio();
        const points = 5;
        const sectionSize = 1 / (points - 1);

        for (let i = 1; i < points + 1; i++) {
            if (i === points) {
                return utils.formatUnits(futureClaims[i - 2].amount);
            }

            if (x < sectionSize * i) {
                return utils.formatUnits(futureClaims[i - 1].amount);
            }
        }
    }

    const getMaxValue = () => {
        return utils.formatUnits(futureClaims[futureClaims.length - 1].amount);
    }

    const getMinValue = () => {
        return utils.formatUnits(futureClaims[0].amount);
    }

    const snapToNearestPoint = () => {
        const points = 5;
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
        const points = 5;
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
                return "After 30 days"
            }
            case 1: {
                return "After 6 months"
            }
            case 2: {
                return "After 18 months"
            }
            case 3: {
                return "After 2 years"
            }
            case 4: {
                return "After 2+ years"
            }
        }
    }

    const getDisplayValue = () => {
        if (showDetails) {
            return String(getValue());
        } else {
            return String(getMinValue()) + " \u2013 " + String(getMaxValue());
        }
    }

    const getEcoDisplayValue = () => {
        return String(getEco());
    }

    const getEco = () => {
        return utils.formatUnits(claim.points.mul(ecoClaim.POINTS_MULTIPLIER).mul(ecoClaim.currentInflationMultiplier).div(ecoClaim.initialInflationMultiplier));
    }

    const { setShouldShow } = useContext(HelpOverlayContext);

    const handleLearnMoreClick = () => {
        setShouldShow(true);
    }

    return (
        <div className={classNames(
            styles.projection,
            claim.tokenClaim ? styles.highlighted : undefined
        )}>
            <HStack align="end">
                <VStack gapSize={StackGapSize.None}>
                    <p className={`sectionSubtitle ${!claim.tokenClaim ? "text-color-medium" : ""}`}>Available to claim later</p>
                    <CurrencyItem amount={getEcoDisplayValue()} currency="eco" />
                    <CurrencyItem amount={getDisplayValue()} currency="ecox" />
                </VStack>
                {!claim.tokenClaim &&
                    <div style={{ flex: 1, textAlign: "right" }}>
                        <LinkButton text={`${showDetails ? "Hide" : "Show"} details`} small color="gray" onClick={() => { setShowDetails(current => !current) }} />
                    </div>
                }
            </HStack>

            <div className={classNames(styles.projectionWrapper, showDetails ? styles.projectionVisible : undefined)} style={{
                height: showDetails ? wrapperHeight : undefined
            }}>
                <div ref={measureRef} className={styles.projectionInnerWrapper}>
                    <VStack gapSize={StackGapSize.Large}>
                        <p className="text-size-small text-color-medium">
                            {!claim.tokenClaim ?
                                <> 30 days after you complete this first claim, you’ll be able to claim another {getEco()} ECO. And you’ll also be able to claim more ECOx, although the longer you wait, the more you’ll get. <a onClick={handleLearnMoreClick} style={{ cursor: "pointer" }}>Want to learn more?</a></>
                                :
                                <>In 30 days, you’ll be able to claim another {getEco()} ECO. And you’ll also be able to claim more ECOx, although the longer you wait, the more you’ll get. <a onClick={handleLearnMoreClick} style={{ cursor: "pointer" }}>Want to learn more?</a></>
                            }
                        </p>
                        <div className={styles.chartWrapper}>
                            <div className={styles.projectionChart}>
                                <svg preserveAspectRatio="none" width="243" height="80" viewBox="0 0 243 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M243 0H182.25V20H121.5V40H60.75V60H0V80H60.75H121.5H182.25H243V0Z" fill="#D9D9D9" />
                                </svg>
                                <div className={styles.projectionChartOverlay}>
                                    <svg preserveAspectRatio="none" width="243" height="80" viewBox="0 0 243 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M243 0H182.25V20H121.5V40H60.75V60H0V80H60.75H121.5H182.25H243V0Z" fill="#D9D9D9" />
                                    </svg>
                                    <div style={{ width: `calc(100% - ${x}px)` }} />
                                    <span style={{ right: `calc(100% - ${x + 1}px)` }}>
                                        <label style={{
                                            transform: `translateX(${x < 30 ? "24px" : x > sliderRect.width - 30 ? "-30px" : 0})`
                                        }}>{getLabelText()}</label>
                                    </span>
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