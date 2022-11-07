import { createContext, FC, ReactNode, useContext } from "react";
import { BigNumber } from "ethers";
import { gql, useQuery } from "@apollo/client";

export const EcoClaimContext = createContext<{
    address: string;
    VESTING_PERIOD: BigNumber;
    CLAIMABLE_PERIOD: BigNumber;
    POINTS_TO_ECOX_RATIO: number;
    initialInflationMultiplier: BigNumber;
    trustedVerifier: string;
    pointsMerkleRoot: string;
    vestedMultiples: number[];
    VESTING_DIVIDER: number;
    POINTS_MULTIPLIER: number;
    claimingEndsAt: BigNumber;
    ecoAddress: string;
    ecoxAddress: string;
    currentInflationMultiplier: BigNumber;
    getVestingCliffs: (points: BigNumber, claimTime: number) => { availableAfter: number, amount: BigNumber }[];
}>({
    address: "",
    VESTING_PERIOD: BigNumber.from(0),
    CLAIMABLE_PERIOD: BigNumber.from(0),
    POINTS_TO_ECOX_RATIO: 0,
    initialInflationMultiplier: BigNumber.from(0),
    trustedVerifier: "",
    pointsMerkleRoot: "",
    vestedMultiples: [0, 0, 0, 0],
    VESTING_DIVIDER: 1,
    POINTS_MULTIPLIER: 0,
    claimingEndsAt: BigNumber.from(0),
    ecoAddress: "",
    ecoxAddress: "",
    currentInflationMultiplier: BigNumber.from(0),
    getVestingCliffs: () => [],
});

export const EcoClaimProvider = ({ children }: { children: ReactNode }) => {

    let ecoClaim = {
        address: "",
        VESTING_PERIOD: BigNumber.from(0),
        CLAIMABLE_PERIOD: BigNumber.from(0),
        POINTS_TO_ECOX_RATIO: 0,
        initialInflationMultiplier: BigNumber.from(0),
        trustedVerifier: "",
        pointsMerkleRoot: "",
        vestedMultiples: [0, 0, 0, 0],
        VESTING_DIVIDER: 1,
        POINTS_MULTIPLIER: 0,
        claimingEndsAt: BigNumber.from(0),
        ecoAddress: "",
        ecoxAddress: "",
        currentInflationMultiplier: BigNumber.from(0)
    }

    const { data, loading, error } = useQuery(CLAIM_CONTRACT);

    if (error) {
        console.log(error);
    }
    else if (data) {
        ecoClaim = {
            ...data.globals.ecoClaim,
            POINTS_TO_ECOX_RATIO: parseInt(data.globals.ecoClaim.POINTS_TO_ECOX_RATIO),
            VESTING_DIVIDER: parseInt(data.globals.ecoClaim.VESTING_DIVIDER),
            POINTS_MULTIPLIER: parseInt(data.globals.ecoClaim.POINTS_MULTIPLIER),
            vestedMultiples: data.globals.ecoClaim.vestedMultiples.map((multiple: string) => parseInt(multiple)),
            VESTING_PERIOD: BigNumber.from(data.globals.ecoClaim.VESTING_PERIOD),
            CLAIMABLE_PERIOD: BigNumber.from(data.globals.ecoClaim.CLAIMABLE_PERIOD),
            initialInflationMultiplier: BigNumber.from(data.globals.ecoClaim.initialInflationMultiplier),
            claimingEndsAt: BigNumber.from(data.globals.ecoClaim.claimingEndsAt),
            ecoAddress: data.globals.eco,
            ecoxAddress: data.globals.ecox,
            currentInflationMultiplier: BigNumber.from(data.globals.currentInflationMultiplier)
        }
    }

    // returns the timestamp (in seconds) and amount claimable for each month after claim time, up to 2 years (24 months) 
    // elements where the amount is larger than the preceeding element represent cliffs (indexes 0, 5, 17, 23)
    const getVestingCliffs = (
        points: BigNumber,
        claimTime: number = Math.round(Date.now() / 1000)
    ) => {
        return ecoClaim.vestedMultiples.map((multiple: number, index: number) => ({
            availableAfter: claimTime + ecoClaim.VESTING_PERIOD.mul(index + 1).toNumber(),
            amount: points.mul(ecoClaim.vestedMultiples[index]).div(ecoClaim.VESTING_DIVIDER)
        }));
    }

    return (
        <EcoClaimContext.Provider value={{ ...ecoClaim, getVestingCliffs }} >
            {children}
        </EcoClaimContext.Provider>
    )
}

const CLAIM_CONTRACT = gql`
    query ClaimContract {
        globals(id:"0") {
            eco
            ecox
            currentInflationMultiplier
            ecoClaim {
                address: id
                VESTING_PERIOD
                CLAIMABLE_PERIOD
                POINTS_TO_ECOX_RATIO
                initialInflationMultiplier
                trustedVerifier
                pointsMerkleRoot
                vestedMultiples
                VESTING_DIVIDER
                POINTS_MULTIPLIER
                claimingEndsAt
            }
        }
    }
`

export const useEcoClaim = () => useContext(EcoClaimContext);