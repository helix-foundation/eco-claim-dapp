import type { NextPage } from "next";

import { BigNumber, ethers, utils } from "ethers";
import { useContext, useEffect, useReducer, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

import { upperFirst } from "lodash";

import ClaimDetails from "components/ClaimDetails";
import Copy from "components/copy";
import HStack, { StackGapSize } from "components/hstack";
import Layout from "components/layout";
import LoggedOut from "components/loggedOut";
import Projection from "components/Projection";
import VStack from "components/vstack";
import { ClaimState, useVerifiedClaims, VerifiedClaim } from "hooks/VerifiedClaims";
import { useEcoClaim } from "providers/EcoClaim";
import EcoClaim from "../assets/abi/EcoClaim.json";
import useMerkleTree from "../hooks/MerkleTree";

import classNames from "classnames";
import Button from "components/button";
import ClaimDetailsHeaderClaimed from "components/ClaimDetailsHeaderClaimed";
import ClaimDetailsHeaderUnclaimed from "components/ClaimDetailsHeaderUnclaimed";
import { UIBlockContext } from "components/UIBlock";
import styles from "css/modules/home.module.scss";
import { txError, toast } from "utilities";
import { AlertContext } from "components/Alert";
import Pill from "components/Pill";

export const shortAddress = (address: string) => {
    if (!address) { return "" }
    return `${address.slice(0, 4)} ••• ${address.slice(address.length - 4, address.length)}`;
}


const Home: NextPage = () => {
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAwaitingClaimConfirmation, setIsAwaitingClaimConfirmation] = useState(false);
    const [isAwaitingReleaseConfirmation, setIsAwaitingReleaseConfirmation] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<VerifiedClaim>(null);
    const [isFullyVested, setIsFullyVested] = useState(false);

    const ecoClaim = useEcoClaim();
    const [eligible, unclaimed, notReadyForSecondClaim, readyForSecondClaim, fullyClaimed] = useVerifiedClaims(address);

    // ask to connect wallet, or if wallet is connected, get data on registrations and mints
    const { leaves } = useMerkleTree();

    const uiBlockContext = useContext(UIBlockContext);
    const alertContext = useContext(AlertContext);

    useEffect(() => {
        const getCurrentCliff = () => {
            const currTime = Math.round(Date.now() / 1000);

            const vestingCliffs = ecoClaim.getVestingCliffs(selectedClaim.points, selectedClaim.tokenClaim.claimTime.toNumber());
            // reduce to only the upticks in amount
            const cliffs = [vestingCliffs[0], vestingCliffs[5], vestingCliffs[17], vestingCliffs[23]];

            // find the earliest cliff that hasn't been reached yet
            const index = cliffs.findIndex((cliff) => cliff.availableAfter > currTime)

            if (index === -1) {
                // no such index? all cliffs have passed
                setIsFullyVested(true);
            } else {
                setIsFullyVested(index >= cliffs.length);
            }
        }

        if (selectedClaim && selectedClaim.tokenClaim) {
            getCurrentCliff();
        }

    }, [selectedClaim, ecoClaim]);

    const claim = async ({ app, userid, points }: VerifiedClaim) => {
        setIsLoading(true);
        try {
            if (!leaves) {
                throw new Error("Tree has not been fetched yet");
            }

            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

            let index = leaves.indexOf(
                utils.solidityKeccak256(
                    ["string", "uint256"],
                    [`${app}:${userid}`, points]
                )
            );

            if (index < 0) {
                setIsLoading(false);
                throw new Error("Your Claim does not match with a leaf in the tree");
            }

            const proof = tree.getHexProof(leaves[index]).map(hash => hash === "0x" ? "0x0000000000000000000000000000000000000000000000000000000000000000" : hash);

            const claimContract = new ethers.Contract(
                ecoClaim.address,
                EcoClaim.abi,
                signer!
            );

            const claimTx = await claimContract.claimTokens(
                proof,
                `${app}:${userid}`,
                points,
                { gasLimit: 500_000 }
            );

            const claimReceipt = await claimTx.wait();


            if (!claimReceipt.status) {
                setIsLoading(false);
                throw new Error(claimTx);
            } else {
                setIsAwaitingClaimConfirmation(true);
            }
        } catch (err) {
            setIsLoading(false);
            txError("Claim failed", err)
            console.log(err);
        }
    };

    // aka second claim
    const release = async ({ app, userid }) => {
        setIsLoading(true);
        try {

            const claimContract = new ethers.Contract(
                ecoClaim.address,
                EcoClaim.abi,
                signer!
            );

            const claimTx = await claimContract.releaseTokens(`${app}:${userid}`,
                { gasLimit: 500_000 }
            );

            const claimReceipt = await claimTx.wait();

            if (!claimReceipt.status) {
                setIsLoading(false);
                throw new Error(claimTx);
            } else {
                setIsAwaitingReleaseConfirmation(true);
            }
        } catch (err) {
            setIsLoading(false);
            txError("Claim failed", err)
            console.log(err);
        }
    }

    const getClaimForUserId = (userId: string): VerifiedClaim => {
        for (let claim of eligible) {
            if (claim.userid === userId) {
                return claim;
            }
        }

        return null;
    }

    useEffect(() => {
        setIsConnected(!!address)
        setSelectedClaim(null)
    }, [address])

    useEffect(() => {
        if (eligible.length === 1 && !selectedClaim) {
            setSelectedClaim(unclaimed[0])
        }
    }, [unclaimed])

    useEffect(() => {
        if (!selectedClaim) { return }

        const refreshedSelectedClaim = getClaimForUserId(selectedClaim.userid);
        // first claim
        if (refreshedSelectedClaim && refreshedSelectedClaim.tokenClaim && isAwaitingClaimConfirmation) {
            setSelectedClaim(refreshedSelectedClaim);
            setIsLoading(false);
            setIsAwaitingClaimConfirmation(false);
            toast({ title: "Claim successful!", intent: 'success' });
        }
        // second claim
        if (refreshedSelectedClaim && refreshedSelectedClaim.tokenRelease && isAwaitingReleaseConfirmation) {
            setSelectedClaim(refreshedSelectedClaim);
            setIsLoading(false);
            setIsAwaitingReleaseConfirmation(false);
            toast({ title: "Claim successful!", intent: 'success' });
        }
    }, [eligible, selectedClaim])

    useEffect(() => {
        uiBlockContext.setShouldShow(isLoading);
    }, [isLoading])


    const getClaimCount = () => {
        if (unclaimed.length === 1) {
            return "1 claim";
        } else {
            return `${unclaimed.length} claims`;
        }
    }

    const handleClaimButtonClick = () => {
        if (!selectedClaim.tokenClaim) {
            claim(selectedClaim);
        }
        else {
            if (!isFullyVested) {
                alertContext.setAlert({
                    primaryButtonHandler: () => {
                        alertContext.setShouldShow(false);
                    },
                    secondaryButtonHandler: () => {
                        alertContext.setShouldShow(false);
                        release(selectedClaim);
                    }
                })
                alertContext.setShouldShow(true);
            } else {
                release(selectedClaim);
            }
        }
    }

    return (
        <Layout>

            <div className={styles.homeWrapper}>
                <div className={styles.homeContent}>
                    {!isConnected ?
                        <LoggedOut />
                        :
                        <VStack gapSize={StackGapSize.XLarge}>
                            {selectedClaim ?
                                <>
                                    {selectedClaim.tokenClaim ?
                                        <ClaimDetailsHeaderClaimed onBackButtonClick={() => { setSelectedClaim(null) }} eligibleClaims={eligible} selectedClaim={selectedClaim} />
                                        :
                                        <>
                                            <ClaimDetailsHeaderUnclaimed onBackButtonClick={() => { setSelectedClaim(null) }} eligibleClaims={eligible} selectedClaim={selectedClaim} />
                                            <ClaimDetails
                                                claimingEndsAt={ecoClaim.claimingEndsAt}
                                                claim={selectedClaim}
                                                hasAdditionalClaims={eligible.length > 1}
                                                onClaimButtonClick={handleClaimButtonClick}
                                                isClaimPending={isLoading}
                                                handleChangeButtonClick={() => { setSelectedClaim(null) }}
                                            />
                                        </>
                                    }
                                    <div />
                                    <Projection
                                        claim={selectedClaim} onClaimButtonClick={handleClaimButtonClick}
                                        isClaimPending={isLoading}
                                    />
                                    {(unclaimed.length + readyForSecondClaim.length) > 0 &&
                                        <div>
                                            <Button small title="You have another claim" secondary showArrow onClick={() => { setSelectedClaim(null) }} />
                                        </div>
                                    }
                                </>
                                :
                                <>
                                    {eligible.length === 0 ?
                                        <Copy>
                                            <p className="text-size-xlarge text-color-normal font-romana">
                                                <span className="text-color-medium">Welcome <strong>{shortAddress(address)}</strong>,</span>
                                                <br />
                                                <span className="text-color-normal">Looks like you don&apos;t have any claims to redeem.</span>
                                            </p>
                                            <p>There don&apos;t appear to be any tokens you are eligible to claim. If you believe there should be, make sure that you&apos;ve linked your identity to this wallet on <a href="https://nft.eco.id">nft.eco.id</a>. If you have done that and it still isn&apos;t working, please send a message in the <strong>#eco-support</strong> channel in <a href="https://discord.eco.org" target="_blank" rel="noreferrer">the Discord</a>.</p>
                                        </Copy>
                                        :
                                        <Copy>
                                            <p className="text-size-xlarge text-color-normal font-romana">
                                                <span className="text-color-medium">Welcome <strong>{shortAddress(address)}</strong>,</span>
                                                <br />
                                                <span className="text-color-normal">You have {getClaimCount()} to redeem.</span>
                                            </p>
                                        </Copy>
                                    }

                                    {readyForSecondClaim.length > 0 &&
                                        <VStack>
                                            <p className="sectionSubtitle">Ready to redeem second claim</p>
                                            {readyForSecondClaim.map(claim => {
                                                return <ClaimButton key={claim.userid} claim={claim} onButtonClick={(_) => { setSelectedClaim(claim) }} actionAvailable={false} />
                                            })}
                                        </VStack>

                                    }
                                    {unclaimed.length > 0 &&
                                        <VStack>
                                            <p className="sectionSubtitle">Ready to redeem first claim</p>
                                            {unclaimed.map(claim => {
                                                return <ClaimButton key={claim.userid} claim={claim} onButtonClick={(_) => { setSelectedClaim(claim) }} actionAvailable={false} />
                                            })}
                                        </VStack>

                                    }

                                    {notReadyForSecondClaim.length > 0 &&
                                        <VStack>
                                            <p className="sectionSubtitle">Awaiting second redeem</p>
                                            {notReadyForSecondClaim.map(claim => {
                                                return <ClaimButton key={claim.userid} claim={claim} onButtonClick={(_) => { }} actionAvailable />
                                            })}
                                        </VStack>

                                    }
                                    {fullyClaimed.length > 0 &&
                                        <VStack>
                                            <p className="sectionSubtitle">Fully redeemed</p>
                                            {fullyClaimed.map(claim => {
                                                return <ClaimButton key={claim.userid} claim={claim} onButtonClick={() => { }} actionAvailable />
                                            })}
                                        </VStack>

                                    }
                                </>
                            }
                        </VStack>
                    }
                </div>
            </div>

        </Layout >
    );
};

type ClaimButtonProps = {
    claim: VerifiedClaim;
    onButtonClick: (id: string) => void;
    actionAvailable: boolean;
}

const ClaimButton = ({ claim, actionAvailable, onButtonClick }: ClaimButtonProps) => {

    const ecoClaim = useEcoClaim();

    const getDate = (claimTime: BigNumber) => {
        return new Date(claimTime.toNumber() * 1000).toLocaleDateString('en-US');
    }

    return <div className={classNames(styles.claimButton, actionAvailable ? styles.actionAvailable : undefined)} key={claim.userid}>
        <HStack gapSize={StackGapSize.Large}>
            <div className={styles.icon}>
                {claim.app === "twitter" &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                }
                {claim.app === "discord" &&
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M41.625 10.7696C37.6445 7.56644 31.3477 7.02347 31.0781 7.00394C30.6602 6.96879 30.2617 7.20316 30.0898 7.58988C30.0742 7.61332 29.9375 7.92972 29.7852 8.42191C32.418 8.86722 35.6523 9.76175 38.5781 11.5782C39.0469 11.8672 39.1914 12.4844 38.9023 12.9532C38.7109 13.2618 38.3867 13.4297 38.0508 13.4297C37.8711 13.4297 37.6875 13.3789 37.5234 13.2774C32.4922 10.1563 26.2109 10 25 10C23.7891 10 17.5039 10.1563 12.4766 13.2774C12.0078 13.5703 11.3906 13.4258 11.1016 12.9571C10.8086 12.4844 10.9531 11.8711 11.4219 11.5782C14.3477 9.76566 17.582 8.86722 20.2148 8.42582C20.0625 7.92972 19.9258 7.61722 19.9141 7.58988C19.7383 7.20316 19.3438 6.96097 18.9219 7.00394C18.6523 7.02347 12.3555 7.56644 8.32031 10.8125C6.21484 12.7618 2 24.1524 2 34C2 34.1758 2.04687 34.3438 2.13281 34.4961C5.03906 39.6055 12.9727 40.9414 14.7812 41C14.7891 41 14.8008 41 14.8125 41C15.1328 41 15.4336 40.8477 15.6211 40.5899L17.4492 38.0743C12.5156 36.8008 9.99609 34.6368 9.85156 34.5078C9.4375 34.1446 9.39844 33.5118 9.76562 33.0977C10.1289 32.6836 10.7617 32.6446 11.1758 33.0078C11.2344 33.0625 15.875 37 25 37C34.1406 37 38.7812 33.0469 38.8281 33.0078C39.2422 32.6485 39.8711 32.6836 40.2383 33.1016C40.6016 33.5157 40.5625 34.1446 40.1484 34.5078C40.0039 34.6368 37.4844 36.8008 32.5508 38.0743L34.3789 40.5899C34.5664 40.8477 34.8672 41 35.1875 41C35.1992 41 35.2109 41 35.2188 41C37.0273 40.9414 44.9609 39.6055 47.8672 34.4961C47.9531 34.3438 48 34.1758 48 34C48 24.1524 43.7852 12.7618 41.625 10.7696ZM18.5 30C16.5664 30 15 28.211 15 26C15 23.7891 16.5664 22 18.5 22C20.4336 22 22 23.7891 22 26C22 28.211 20.4336 30 18.5 30ZM31.5 30C29.5664 30 28 28.211 28 26C28 23.7891 29.5664 22 31.5 22C33.4336 22 35 23.7891 35 26C35 28.211 33.4336 30 31.5 30Z"
                            fill="black" />
                    </svg>
                }
            </div>
            <VStack gapSize={StackGapSize.Small}>
                <strong>{upperFirst(claim.app)}</strong>
                <VStack gapSize={StackGapSize.Small}>
                    <span className="text-size-small text-color-medium">ID: {claim.userid}</span>
                    {claim.claimState > ClaimState.Unclaimed && (
                        <HStack gapSize={StackGapSize.Small}>
                            <Pill><>1st claim • {getDate(claim.tokenClaim.claimTime)}</></Pill>
                            <span className="text-size-small text-color-medium">{utils.formatUnits(claim.tokenClaim.amountEco)} ECO • {utils.formatUnits(claim.tokenClaim.amountEcox)} ECOx</span>
                        </HStack>
                    )}
                    {claim.claimState === ClaimState.FullyClaimed ? (
                        <HStack gapSize={StackGapSize.Small}>
                            <Pill><>2nd claim • {getDate(claim.tokenRelease.claimTime)}</></Pill>
                            <span className="text-size-small text-color-medium">{utils.formatUnits(claim.tokenRelease.amountEco)} ECO • {utils.formatUnits(claim.tokenRelease.amountEcox)} ECOx</span>
                        </HStack>
                    ) : claim.claimState > ClaimState.Unclaimed ? (
                        <HStack gapSize={StackGapSize.Small}>
                            <Pill><>2nd claim</></Pill>
                            <span className="text-size-small text-color-medium">Eligible {getDate(BigNumber.from(ecoClaim.getVestingCliffs(claim.points, claim.tokenClaim.claimTime.toNumber())[0].availableAfter))}</span>
                        </HStack>
                    ) : null}
                </VStack>
            </VStack>
        </HStack>
        {!actionAvailable && <Button showArrow title="Select" onClick={onButtonClick.bind(this, claim.userid)} />}
    </div>
};

export default Home;
