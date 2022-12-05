import { gql, useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import { useEcoClaim } from "providers/EcoClaim";

import productionPointsDB from "../assets/production/points.json";
import stagingPointsDB from "../assets/staging/points.json";
import developmentPointsDB from "../assets/development/points.json";
import { useEffect, useState } from "react";

let pointsDB;
switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case 'production':
        pointsDB = productionPointsDB;
        break;
    case 'staging':
        pointsDB = stagingPointsDB;
        break;
    case 'development':
    default:
        pointsDB = developmentPointsDB;
}

export type TokenClaim = {
    points: BigNumber;
    amountEco: BigNumber;
    amountEcox: BigNumber;
    recipient: string;
    claimTime: BigNumber;
}

export type TokenRelease = {
    amountEco: BigNumber;
    amountEcox: BigNumber;
    recipient: string;
    claimTime: BigNumber;
    gasPayer: string;
    feeAmount: string;
}

export enum ClaimState {
    Unclaimed,
    NotReadyForSecondClaim,
    ReadyForSecondClaim,
    FullyClaimed
}

export type VerifiedClaim = {
    app: string;
    userid: string;
    points: BigNumber;
    recipient: string;
    verifiers: { address: string, revocable: boolean }[];
    claimState: ClaimState;
    nft: {
        tokenID: number;
        tokenURI: string;
    } | null;
    tokenClaim: TokenClaim | null;
    tokenRelease: TokenRelease | null;
}

const points: { [claim: string]: string } = pointsDB;

// returns a list of your claims that are eligible to, or have already redeem points

export const useVerifiedClaims = (address: string | null): VerifiedClaim[][] => {

    const ecoClaim = useEcoClaim();

    const { data, loading, error, startPolling } = useQuery(VERIFIED_CLAIMS, {
        variables: {
            address
        },
        pollInterval: 5000
    });
    startPolling(5000);

    const [verifiedClaims, setVerifiedClaims] = useState<VerifiedClaim[][]>([[],[],[],[],[]]);

    useEffect(() => {
        const parseVerifiedClaims = () => {
            // all eligible claims regardless of state
            let eligible: VerifiedClaim[] = [];
            // eligible claims separated by state
            let unclaimed: VerifiedClaim[] = [];
            let notReadyForSecondClaim: VerifiedClaim[] = [];
            let readyForSecondClaim: VerifiedClaim[] = [];
            let fullyClaimed: VerifiedClaim[] = [];

            eligible = data.verifiedClaims.reduce((eligibleClaims: VerifiedClaim[], subgraphVerifiedClaim) => {
                // no points, not claimable
                // not verified by the trusted verifier, not claimable
                const pts = BigNumber.from(points[subgraphVerifiedClaim.id] || 0);
    
                if (pts.gt(0) && subgraphVerifiedClaim.verifiers.find((verifier) => verifier.address === ecoClaim.trustedVerifier)) {
                    const [app, userid] = subgraphVerifiedClaim.id.split(':');
    
                    let verifiedClaim: VerifiedClaim = {
                        ...subgraphVerifiedClaim,
                        app,
                        userid,
                        points: pts,
                        tokenClaim: subgraphVerifiedClaim.tokenClaim ? {
                            ...subgraphVerifiedClaim.tokenClaim,
                            points: BigNumber.from(subgraphVerifiedClaim.tokenClaim.points),
                            amountEco: BigNumber.from(subgraphVerifiedClaim.tokenClaim.amountEco),
                            amountEcox: BigNumber.from(subgraphVerifiedClaim.tokenClaim.amountEcox),
                            claimTime: BigNumber.from(subgraphVerifiedClaim.tokenClaim.claimTime),
                        } : null,
                        tokenRelease: subgraphVerifiedClaim.tokenRelease ? {
                            ...subgraphVerifiedClaim.tokenRelease,
                            claimTime: BigNumber.from(subgraphVerifiedClaim.tokenRelease.claimTime)
                        } : null
                    }
                    
                    if (verifiedClaim.tokenClaim) {
                        if (verifiedClaim.tokenRelease) {
                            verifiedClaim.claimState = ClaimState.FullyClaimed;
                            fullyClaimed.push(verifiedClaim);
                        }
                        else {
                            const secondClaimAvailableAt = ecoClaim.getVestingCliffs(verifiedClaim.points, verifiedClaim.tokenClaim.claimTime.toNumber())[0].availableAfter;
                            if (Math.round(Date.now()/1000) < secondClaimAvailableAt) {
                                verifiedClaim.claimState = ClaimState.NotReadyForSecondClaim;
                                notReadyForSecondClaim.push(verifiedClaim);
                            }
                            else {
                                verifiedClaim.claimState = ClaimState.ReadyForSecondClaim;
                                readyForSecondClaim.push(verifiedClaim);
                            }
                        }
                    }
                    else {
                        verifiedClaim.claimState = ClaimState.Unclaimed;
                        unclaimed.push(verifiedClaim);
                    }
                    eligibleClaims.push(verifiedClaim);
                }
                return eligibleClaims;
            }, []);
            setVerifiedClaims([eligible, unclaimed, notReadyForSecondClaim, readyForSecondClaim, fullyClaimed]);
        }
        if (data) {
            parseVerifiedClaims();
            const timer = setInterval(() => parseVerifiedClaims(), 5000);
            return () => clearInterval(timer);
        }
    }, [data, ecoClaim]);

    if (error) {
        console.log(error);
    }
    return verifiedClaims;
}

const VERIFIED_CLAIMS = gql`
    query VerifiedClaims($address: String) {
        verifiedClaims(where: {recipient: $address}) {
            id
            recipient
            verifiers {
                address
                revocable
            }
            nft {
                tokenID
                tokenURI
            }
            tokenClaim {
                points
                amountEco
                amountEcox
                recipient
                claimTime
            }
            tokenRelease {
                amountEco
                amountEcox
                recipient
                claimTime
                gasPayer
                feeAmount
            }
        }
    }
`
