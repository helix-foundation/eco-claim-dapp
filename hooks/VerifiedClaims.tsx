import { gql, useQuery } from "@apollo/client";
import { BigNumber } from "ethers";

import productionPointsDB from "../assets/production/points.json";
import stagingPointsDB from "../assets/staging/points.json";
import developmentPointsDB from "../assets/development/points.json";

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

export type VerifiedClaim = {
    app: string;
    userid: string;
    points: BigNumber;
    recipient: string;
    verifiers: { address: string, revocable: boolean }[];
    nft: {
        tokenID: number;
        tokenURI: string;
    } | null;
    tokenClaim: TokenClaim | null;
}

const points: { [claim: string]: string } = pointsDB;

// returns a list of your claims that are eligible to, or have already redeem points

export const useVerifiedClaims = (address: string | null, trustedVerifier: string | null): VerifiedClaim[] => {

    const { data, loading, error, startPolling } = useQuery(VERIFIED_CLAIMS, {
        variables: {
            address
        },
        pollInterval: 5000
    });
    startPolling(5000);

    let verifiedClaims = [];

    if (error) {
        console.log(error);
    }
    else if (data) {
        verifiedClaims = data.verifiedClaims.reduce((eligibleClaims: VerifiedClaim[], verifiedClaim) => {
            // no points, not claimable
            // not verified by the trusted verifier, not claimable
            const pts = BigNumber.from(points[verifiedClaim.id] || 0);

            if (pts.gt(0) && verifiedClaim.verifiers.find((verifier) => verifier.address === trustedVerifier)) {
                const [app, userid] = verifiedClaim.id.split(':');
                eligibleClaims.push({
                    ...verifiedClaim,
                    app,
                    userid,
                    points: pts,
                    tokenClaim: verifiedClaim.tokenClaim ? {
                        ...verifiedClaim.tokenClaim,
                        points: BigNumber.from(verifiedClaim.tokenClaim.points),
                        amountEco: BigNumber.from(verifiedClaim.tokenClaim.amountEco),
                        amountEcox: BigNumber.from(verifiedClaim.tokenClaim.amountEcox),
                        claimTime: BigNumber.from(verifiedClaim.tokenClaim.claimTime),
                    } : null
                })
            }
            return eligibleClaims;
        }, []);
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
        }
    }
`
