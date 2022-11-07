import classNames from "classnames";
import Button from "components/button";
import { FullScreenLayout } from "components/layout";
import Loader from "components/loader";
import styles from "css/modules/video.module.scss";
import { useEffect, useRef, useState } from "react";


enum PlayState {
    Playing,
    Paused,
    Waiting
}

enum MutedState {
    Unmuted,
    Muted
}

type VideoProps = {
    onComplete: () => void;
    pauseAll: boolean;
}

const VideoPage = ({ onComplete, pauseAll = false }: VideoProps) => {

    const [isLoaded, setLoaded] = useState(false);
    const [isVideoLoaded, setVideoLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playState, setPlayState] = useState<PlayState>(PlayState.Paused);
    const [mutedState, setMutedState] = useState<MutedState>(MutedState.Unmuted);
    const [timeWidth, setTimeWidth] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>();
    const timeRef = useRef<HTMLDivElement>();

    useEffect(() => {
        setLoaded(true);
        
        if (videoRef.current.readyState > 0) {
            setVideoLoaded(true);
        }
        
        const interval = setInterval(() => {
            if (isVideoLoaded) {
                getTimeWidth();
            }
        }, 100)

        return () => {
            clearInterval(interval)
        }
    }, [isVideoLoaded])

    useEffect(() => {
        if (!pauseAll) {
            window.addEventListener("keydown", handleKeypress);
        }

        return () => {
            window.removeEventListener("keydown", handleKeypress);
        }
    }, [playState, pauseAll])

    useEffect(() => {
        if (isPlaying) {
            if (pauseAll) {
                handlePauseClick();
            }
        }
    }, [pauseAll])

    const handleKeypress = (e) => {
        if (!isVideoLoaded) { return }

        if (e.key == " " || e.code == "Space") {
            if (playState === PlayState.Paused) {
                handlePlayClick();
            } else if (playState === PlayState.Playing) {
                handlePauseClick();
            }
            return;
        }

        if (e.code === "ArrowLeft") {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - (videoRef.current.duration / 40));
            return;
        }

        if (e.code === "ArrowRight") {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + (videoRef.current.duration / 40), videoRef.current.duration);
            return;
        }
    }

    const handleMouseOver = () => {
        setIsHovered(true);
    }

    const handleMouseOut = () => {
        setIsHovered(false)
    }

    const handleClick = () => {
        setIsPlaying(true);
        handlePlayClick();
    }

    const handlePlayClick = () => {
        //if (!isVideoLoaded) { return }

        if (videoRef.current) {
            videoRef.current.play();
            setPlayState(PlayState.Playing);
        }
    }

    const handlePauseClick = () => {
        if (!isVideoLoaded) { return }

        if (videoRef.current) {
            videoRef.current.pause();
            setPlayState(PlayState.Paused);
        }
    }

    const handleMuteClick = () => {
        if (!isVideoLoaded) { return }

        videoRef.current.muted = !videoRef.current.muted;
    }

    const handleTimeClick = (e) => {
        if (!isVideoLoaded) { return }

        const rect = timeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = videoRef.current.duration * (x / rect.width);
        videoRef.current.currentTime = time;
        setTimeWidth(x / rect.width);
    }

    const handleMouseMove = (e) => {
        handleTimeClick(e);
    }

    const handleTimeMouseDown = (e) => {
        handleTimeClick(e);
        window.addEventListener("mousemove", handleMouseMove);
        setIsScrubbing(true);

        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", handleMouseMove);
            setIsScrubbing(false);
        })
    }

    const getTimeWidth = () => {
        if (videoRef.current) {
            setTimeWidth(videoRef.current.currentTime / videoRef.current.duration);

            if (videoRef.current.currentTime === videoRef.current.duration) {
                setIsCompleted(true);
                setCanSkip(true);
            }
        }
    }

    const handleVideoEnd = () => {
        setIsCompleted(true);
        setPlayState(PlayState.Paused);
    }

    const handleFullScreenClick = () => {
        videoRef.current.requestFullscreen();
    }

    const handleVideoPlay = () => {
        if (playState !== PlayState.Playing) {
            setPlayState(PlayState.Playing);
        }
    }

    const handleVideoPause = () => {
        if (playState !== PlayState.Paused) {
            setPlayState(PlayState.Paused);
        }
    }

    const handleWaiting = () => {
        setPlayState(PlayState.Waiting)
    }

    const handleVideoVolumeChange = () => {
        setMutedState(oldMutedState => {
            if (videoRef.current.muted === false && oldMutedState === MutedState.Muted) {
                return MutedState.Unmuted;
            } else if (videoRef.current.muted && oldMutedState === MutedState.Unmuted) {
                return MutedState.Muted;
            }

            return oldMutedState
        })
    }

    const handleVideoLoaded = () => {
        setVideoLoaded(true);
    }

    const handlePlaying = () => {
        if (playState !== PlayState.Playing) {
            setPlayState(PlayState.Playing);
        }
    }

    return (
        <FullScreenLayout>
            <div className={classNames(
                styles.video,
                isLoaded ? styles["video-is-loaded"] : undefined,
                isVideoLoaded ? "loaded" : undefined,
                isHovered ? styles["video-is-primed"] : undefined,
                isPlaying ? styles["video-isPlaying"] : undefined,
                isCompleted ? styles["video-isCompleted"] : undefined,
                canSkip ? styles["video-canSkip"] : undefined,
                isScrubbing ? styles["video-isScrubbing"] : undefined
            )}>
                <div className={styles.skipButton}>
                    <Button title="Continue" showArrow onClick={() => {
                        onComplete()
                    }} />
                </div>

                <div className={styles.videoWrapper}>
                    <svg width="194" height="31" viewBox="0 0 194 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_227_1062)">
                            <circle cx="12.5" cy="15.5" r="12" stroke="black" />
                            <mask id="mask0_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="5"
                                width="21" height="21">
                                <circle cx="12.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_227_1062)">
                                <rect x="-1" y="4" width="14" height="23" fill="black" />
                            </g>
                            <circle cx="56.5" cy="15.5" r="12" stroke="black" />
                            <circle cx="56.5" cy="15.5" r="15" stroke="black" strokeDasharray="2 2" />
                            <circle cx="100.5" cy="15.5" r="12" stroke="black" strokeDasharray="32 32" />
                            <path d="M92 15.5H109" stroke="black" />
                            <path d="M100.5 12L100.5 19" stroke="black" />
                            <mask id="path-9-inside-1_227_1062" fill="white">
                                <path fillRule="evenodd" clipRule="evenodd"
                                    d="M141.5 28C148.404 28 154 22.4036 154 15.5C154 8.59644 148.404 3 141.5 3C134.596 3 129 8.59644 129 15.5C129 22.4036 134.596 28 141.5 28ZM146.45 15.5L141.5 10.5503L136.55 15.5L141.5 20.4497L146.45 15.5Z" />
                            </mask>
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M141.5 28C148.404 28 154 22.4036 154 15.5C154 8.59644 148.404 3 141.5 3C134.596 3 129 8.59644 129 15.5C129 22.4036 134.596 28 141.5 28ZM146.45 15.5L141.5 10.5503L136.55 15.5L141.5 20.4497L146.45 15.5Z"
                                fill="black" />
                            <path
                                d="M141.5 10.5503L142.207 9.84315L141.5 9.13604L140.793 9.84315L141.5 10.5503ZM146.45 15.5L147.157 16.2071L147.864 15.5L147.157 14.7929L146.45 15.5ZM136.55 15.5L135.843 14.7929L135.136 15.5L135.843 16.2071L136.55 15.5ZM141.5 20.4497L140.793 21.1569L141.5 21.864L142.207 21.1569L141.5 20.4497ZM153 15.5C153 21.8513 147.851 27 141.5 27V29C148.956 29 155 22.9558 155 15.5H153ZM141.5 4C147.851 4 153 9.14873 153 15.5H155C155 8.04416 148.956 2 141.5 2V4ZM130 15.5C130 9.14873 135.149 4 141.5 4V2C134.044 2 128 8.04416 128 15.5H130ZM141.5 27C135.149 27 130 21.8513 130 15.5H128C128 22.9558 134.044 29 141.5 29V27ZM140.793 11.2574L145.743 16.2071L147.157 14.7929L142.207 9.84315L140.793 11.2574ZM137.257 16.2071L142.207 11.2574L140.793 9.84315L135.843 14.7929L137.257 16.2071ZM142.207 19.7426L137.257 14.7929L135.843 16.2071L140.793 21.1569L142.207 19.7426ZM145.743 14.7929L140.793 19.7426L142.207 21.1569L147.157 16.2071L145.743 14.7929Z"
                                fill="black" mask="url(#path-9-inside-1_227_1062)" />
                            <mask id="mask1_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="170" y="5"
                                width="21" height="21">
                                <circle cx="180.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask1_227_1062)">
                                <rect x="167" y="4" width="14" height="23" fill="black" />
                            </g>
                            <mask id="mask2_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="181" y="5"
                                width="21" height="21">
                                <circle cx="191.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask2_227_1062)">
                                <rect x="178.818" y="4" width="10.1818" height="23" fill="black" />
                            </g>
                            <mask id="mask3_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="189" y="5"
                                width="21" height="21">
                                <circle cx="199.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask3_227_1062)">
                                <rect x="188.136" y="4.5" width="5.36364" height="22" stroke="black" />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_227_1062">
                                <rect width="194" height="31" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    {playState === PlayState.Waiting &&
                        <div className={styles.videoOverlay}>
                            <Loader />
                        </div>
                    }
                    <video onPlaying={handlePlaying} onWaiting={handleWaiting} onLoadedData={handleVideoLoaded} onVolumeChange={handleVideoVolumeChange} onPause={handleVideoPause} onPlay={handleVideoPlay} playsInline ref={videoRef} onEnded={handleVideoEnd}>
                        <source src="https://cdn.staging.eco.id/mintflow_part_2.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className={styles.time} onMouseDown={handleTimeMouseDown} ref={timeRef}>
                    <div className={styles.timeTrack}>
                        <div style={{ width: `calc(${Math.min(timeWidth, 1)} * 100%)` }} />
                    </div>
                </div>
                <div className={styles.buttonWrapper}>
                    {!isPlaying && videoRef.current &&
                        <Button title="Begin" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClick} />
                    }
                    <div className={styles.controls}>
                        {playState === PlayState.Paused &&
                            <div className={styles.control} onClick={handlePlayClick}>
                                <svg width="119" height="174" viewBox="0 0 119 174" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M118.794 87L0 0.206055V173.794L118.794 87Z" fill="#D9D9D9" />
                                </svg>
                            </div>
                        }

                        {(playState === PlayState.Playing || playState === PlayState.Waiting) &&
                            <div className={styles.control} onClick={handlePauseClick}>
                                <svg width="140" height="169" viewBox="0 0 140 169" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="52" height="169" fill="#D9D9D9" />
                                    <rect x="88" width="52" height="169" fill="#D9D9D9" />
                                </svg>
                            </div>
                        }

                        {mutedState === MutedState.Unmuted &&
                            <div className={styles.control} onClick={handleMuteClick}>
                                <svg width="462" height="360" viewBox="0 0 462 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M246.524 1.63592C252.455 4.34806 256.26 10.271 256.26 16.7933V343.333C256.26 349.856 252.455 355.779 246.523 358.491C240.592 361.203 233.623 360.206 228.69 355.939L117.385 259.66H17C7.79529 259.66 0.333374 252.198 0.333374 242.993V115.707C0.333374 106.502 7.79529 99.04 17 99.04H119.026L228.69 4.18769C233.623 -0.0790806 240.592 -1.07622 246.524 1.63592Z" fill="#111111" />
                                    <path d="M400.66 7.89519C394.895 0.719253 384.404 -0.42468 377.228 5.34015C370.053 11.105 368.909 21.5955 374.673 28.7715C409.195 71.7432 428.012 125.212 428.012 180.333C428.012 235.454 409.195 288.923 374.673 331.895C368.909 339.071 370.053 349.562 377.228 355.326C384.404 361.091 394.895 359.947 400.66 352.771C439.936 303.881 461.346 243.047 461.346 180.333C461.346 117.62 439.936 56.7859 400.66 7.89519Z" fill="#111111" />
                                    <path d="M357.749 51.7778C352.288 44.3684 341.854 42.7892 334.444 48.2507C327.035 53.7122 325.456 64.1461 330.917 71.5555C354.145 103.067 366.675 141.186 366.675 180.333C366.675 219.48 354.145 257.599 330.917 289.111C325.456 296.52 327.035 306.954 334.444 312.416C341.854 317.877 352.288 316.298 357.749 308.889C385.2 271.648 400.009 226.598 400.009 180.333C400.009 134.069 385.2 89.0188 357.749 51.7778Z" fill="#111111" />
                                    <path d="M310.933 99.8547C305.883 92.1595 295.55 90.0157 287.855 95.0665C280.159 100.117 278.016 110.45 283.066 118.145C295.192 136.619 301.652 158.235 301.652 180.333C301.652 202.431 295.192 224.047 283.066 242.521C278.016 250.217 280.159 260.549 287.855 265.6C295.55 270.651 305.883 268.507 310.933 260.812C326.625 236.904 334.986 208.931 334.986 180.333C334.986 151.736 326.625 123.762 310.933 99.8547Z" fill="#111111" />
                                </svg>
                            </div>
                        }

                        {mutedState === MutedState.Muted &&
                            <div className={styles.control} onClick={handleMuteClick}>
                                <svg width="456" height="360" viewBox="0 0 456 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M246.524 1.63592C252.455 4.34806 256.26 10.271 256.26 16.7933V343.333C256.26 349.856 252.455 355.779 246.523 358.491C240.592 361.203 233.623 360.206 228.69 355.939L117.385 259.66H17C7.79529 259.66 0.333374 252.198 0.333374 242.993V115.707C0.333374 106.502 7.79529 99.04 17 99.04H119.026L228.69 4.18769C233.623 -0.0790806 240.592 -1.07622 246.524 1.63592Z" fill="#111111" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M322.747 108.747C328.41 103.084 337.59 103.084 343.253 108.747L387 152.494L430.747 108.747C436.41 103.084 445.59 103.084 451.253 108.747C456.916 114.41 456.916 123.59 451.253 129.253L407.506 173L451.253 216.747C456.916 222.41 456.916 231.59 451.253 237.253C445.59 242.916 436.41 242.916 430.747 237.253L387 193.506L343.253 237.253C337.59 242.916 328.41 242.916 322.747 237.253C317.084 231.59 317.084 222.41 322.747 216.747L366.494 173L322.747 129.253C317.084 123.59 317.084 114.41 322.747 108.747Z" fill="black" />
                                </svg>

                            </div>
                        }

                        <div className={styles.control} onClick={handleFullScreenClick}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.75 0.75H18.5C18.9142 0.75 19.25 1.08579 19.25 1.5V8.25C19.25 8.66421 18.9142 9 18.5 9C18.0858 9 17.75 8.66421 17.75 8.25V3.31066L3.31066 17.75H8.25C8.66421 17.75 9 18.0858 9 18.5C9 18.9142 8.66421 19.25 8.25 19.25H1.5C1.08579 19.25 0.75 18.9142 0.75 18.5V11.75C0.75 11.3358 1.08579 11 1.5 11C1.91421 11 2.25 11.3358 2.25 11.75V16.6893L16.6893 2.25H11.75C11.3358 2.25 11 1.91421 11 1.5C11 1.08579 11.3358 0.75 11.75 0.75Z" fill="black" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </FullScreenLayout>

    );
}

export default VideoPage;