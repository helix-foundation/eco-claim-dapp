import styles from "css/modules/textLoader.module.scss";
import React, { useRef, useState } from "react";

type TextLoaderProps = {
    phrases?: string[];
}

const defaultPhrases = [
    "Hang tight, this can take a minute or two.",
    "Constructing additional pylons...",
    "Still loading...",
    "Watering Merkle trees...",
    "Reticulating splines...",
    "Mining more vespene gas...",
    "Building a block...",
    "Coordinating consensus...",
    "Consulting the chain...",
    "Reading a few whitepapers..."
]

const TextLoader = ({ phrases = defaultPhrases }: TextLoaderProps) => {
    const [index, setIndex] = useState(0);
    const [height, setHeight] = useState(0);

    React.useEffect(() => {
        setHeight(measureRef.current.getBoundingClientRect().height);

        const timer = window.setInterval(() => {
            setIndex(prev => prev === phrases.length - 1 ? 0 : prev + 1);
        }, 2500);
        return () => {
          window.clearInterval(timer);
        };
      }, []);

    const measureRef = useRef<HTMLDivElement>(null);
    

    return (
        <div className={styles.textLoader}>
            <div className={styles.placeholder}>
                <div className={styles.text} ref={measureRef}>
                    {phrases[0]}
                </div>
            </div>
            <div className={styles.phrases} style={{
                transform: `translateY(${index * -height}px)`
            }}>
                {phrases.map((phrase) => (
                    <div className={styles.phrase} key={`${phrase}`}>
                        <div className={styles.text}>
                            <p>{phrase}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TextLoader;