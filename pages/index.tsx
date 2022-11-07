import { FullScreenLayout } from "components/layout";
import { NextPage } from "next";
import React, { createContext, useEffect, useState } from "react";
import TextPage from "components/text";
import VideoPage from "components/video";
import styles from "css/modules/intro.module.scss";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

enum IntroState {
    Text = 1,
    Video,
    Complete
}

const introCookieName = "eco-claim-intro"

const Intro: NextPage = () => {
    const [introState, setIntroState] = useState<IntroState>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const handleVideoComplete = () => {
        setIntroState(IntroState.Text);
    }

    const handleTextComplete = () => {
        setIntroState(IntroState.Complete);

        handleRedirect();
    }

    const handleRedirect = (hasDelay: boolean = true) => {
        setTimeout(() => {
            router.push("/claim?fromIntro=true");
        }, hasDelay ? 1000 : 0)
    }

    const [cookies, setCookie] = useCookies([introCookieName]);

    useEffect(() => {
        if (cookies[introCookieName]) {
            if (parseInt(IntroState[cookies[introCookieName]]) === IntroState.Complete) {
                setIntroState(IntroState.Complete);
                handleRedirect(false);
                return;
            } else {
                setIntroState(parseInt(IntroState[cookies[introCookieName]]));
            }
        } else {
            setIntroState(IntroState.Video);
        }
    }, []);

    useEffect(() => {
        if (introState) {
            setCookie(introCookieName, IntroState[introState], { path: '/', expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)) });
        }
    }, [introState])

    return (
        <FullScreenLayout>
            <IntroContext.Provider value={{
                introState,
                setIntroState
            }}>
                <div className={classNames(
                    styles.intro,
                    introState === IntroState.Video ? styles["intro-stateVideo"] : undefined,
                    introState === IntroState.Text ? styles["intro-stateText"] : undefined,
                    introState === IntroState.Complete ? styles["intro-stateComplete"] : undefined
                )}>
                    <div className={styles.introWrapper}>
                        <div className={styles.introVideo}>
                            <VideoPage onComplete={handleVideoComplete} pauseAll={introState === IntroState.Text} />
                        </div>
                        <div className={styles.introText}>
                            <TextPage shouldPlay={introState === IntroState.Text} onComplete={handleTextComplete} />
                        </div>
                    </div>
                </div>
            </IntroContext.Provider>
        </FullScreenLayout>
    )
}

const IntroContext = createContext<{
    introState: IntroState,
    setIntroState: (_: IntroState) => void
}>({
    introState: IntroState.Video,
    setIntroState: () => { }
})

export default Intro;