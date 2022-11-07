import classNames from "classnames";
import Button from "components/button";
import { FullScreenLayout } from "components/layout";
import styles from "css/modules/text.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const text = [
    "A money game we can actually all win… together.",
    "A new money experience.",
    "As you’ve known for years, a new financial system must be built. One that is aligned with the best interests of you, its users.",
    "The past decade has given us the technology we need to create this, together.",
    "It’s time for a new money — for a new game.",
    "You already have your ticket for entry to that game — your first proof of identity.",
    "But ... The Points are the point. They always have been.",
    "If you’re here, you’ve earned them already. And your identity token is what will give you the right to claim them.",
    "You’re in the earliest cohort of players — so remember, it’s your responsibility to help the game grow.",
    "You’re about to receive two types of coins — the coins you need to play the game, so to speak.",
    "$ECO — which is an entirely new, open currency. It’s meant for spending and saving, and anything you’d use an existing currency for.",
    "... and ...",
    "$ECOx — which tracks the growth of the Economy.",
    "You’ll want to use ECO to play with, pay with, send, and save.",
    "You’ll want to use ECOx to keep yourself motivated to do so.",
    "If you haven’t read the Eco Manual yet, we’d recommend you do.",
    "Welcome to the first money game we can actually all win. Together."
]

type ParagraphProps = {
    text: string;
    onComplete: () => void;
    isFocused: boolean;
    bold: boolean;
}

const Paragraph = ({ text, onComplete, isFocused, bold }: ParagraphProps) => {

    const [textIndex, setTextIndex] = useState(0);
    const splitText = text.split(" ");
    const duration = 1000;
    let interval;

    useEffect(() => {
        if (textIndex > splitText.length - 1) {
            setTimeout(() => {
                onComplete();
            }, duration);
            clearInterval(interval);
            return;
        }

        interval = setInterval(() => {
            setTextIndex(oldIndex => oldIndex + 1);
        }, 60);

        return () => {
            clearInterval(interval);
        }
    }, [textIndex])

    return (
        <div className={classNames(styles.paraOuter, isFocused ? styles.paraFocused : styles.paraMuted, bold ? styles.paraBold : undefined)}>
            <TransitionGroup className={styles.paraWrapper}>
                {[...Array(textIndex)].map((_, index) => {
                    return <Word key={`${splitText[index]}-${index}`} text={splitText[index]} />
                })}
            </TransitionGroup>
            <div className={styles.placeholder}>
                {splitText.map((text, index) => (
                    <span className={styles.textItem} key={text + index}>
                        <span>{`${text}`}&nbsp;</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

type WordProps = {
    text: string
}

const Word = ({ text, ...restProps }: WordProps) => {
    const ref = useRef(null);
    return (
        <CSSTransition
            {...restProps}
            timeout={0}
            appear={true}
            nodeRef={ref}
            classNames={{
                enterActive: styles.textEntering,
                enterDone: styles.textEnterDone
            }}
        >
            <span className={styles.textItem} ref={ref}>
                <span>{text}&nbsp;</span>
            </span>
        </CSSTransition>
    )
}

type TextPageProps = {
    shouldPlay: boolean;
    onComplete: () => void;
}

const TextPage = ({ shouldPlay = false, onComplete }: TextPageProps) => {

    const [showText, setShowText] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [paragraphIndex, setParagraphIndex] = useState(1);
    const [readyForNext, setReadyForNext] = useState(false);
    const [shouldFocus, setShouldFocus] = useState(true);

    const textRef = useRef(null);

    const handleComplete = () => {
        setReadyForNext(true);

        if (paragraphIndex >= text.length) {
            setIsComplete(true);
        }
    }

    const advanceParagraph = () => {
        if (paragraphIndex >= text.length) {
            return;
        }
        setParagraphIndex(oldIndex => oldIndex + 1);
        setReadyForNext(false);
        textRef.current.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }

    const handleKeyDown = (e) => {
        if (!readyForNext) { return }
        setShouldFocus(true);
        advanceParagraph()
    }

    const handleMouseWheel = (e) => {
        setShouldFocus(false)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        textRef.current.addEventListener("wheel", handleMouseWheel);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (textRef.current) {
                textRef.current.removeEventListener("wheel", handleMouseWheel);
            }
        }
    }, [readyForNext])

    useEffect(() => {
        if (shouldPlay && !showText) {
            setShowText(true);
        }
    }, [shouldPlay, showText])

    const handleContinueClick = () => {
        onComplete();
    }

    return (
        <FullScreenLayout>
            <div className={styles.scroll} ref={textRef}>
                <div className={classNames(
                    styles.text,
                )}>
                    {showText &&
                        <div className={styles.textWrapper}>
                            {[...Array(paragraphIndex)].map((_, index) => {
                                return (
                                    <React.Fragment key={index + text[index]}>
                                        <Paragraph bold={index === 0} isFocused={shouldFocus ? index === paragraphIndex - 1 : true} text={text[index]} onComplete={handleComplete} />
                                        {index === paragraphIndex - 1 && index !== text.length - 1 &&
                                            <>
                                                <div className={classNames(
                                                    styles.enter,
                                                    readyForNext ? styles.enterReady : undefined
                                                )}>
                                                    Press Any Key
                                                </div>
                                            </>
                                        }
                                        {index === text.length - 1 &&
                                            <div className={classNames(
                                                styles.continueButton,
                                                isComplete ? styles.continueButtonVisible : undefined
                                            )}>
                                                <Button title="Continue" showArrow onClick={handleContinueClick} />
                                            </div>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </FullScreenLayout>

    );
}

export default TextPage;