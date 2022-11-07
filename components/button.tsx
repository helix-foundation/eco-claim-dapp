import React from "react";
import styles from "css/modules/button.module.scss";
import classNames from "classnames";
import Loader from "./loader";

type ButtonType = {
  title: string;
  showArrow?: boolean;
  secondary?: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  small?: boolean;
};

const Button = ({
  title,
  isLoading = false,
  disabled = false,
  showArrow = false,
  secondary = false,
  small,
  onClick = () => {},
  onMouseOver,
  onMouseOut,
}: ButtonType) => {
  return (
    <a
      onClick={disabled ? undefined : onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className={classNames(
        styles.button,
        showArrow ? styles["button-hasArrow"] : undefined,
        secondary ? styles["button-secondary"] : undefined,
        disabled ? styles["button-disabled"] : undefined,
        isLoading ? styles["button-loading"] : undefined,
        small ? styles["button-small"] : undefined
      )}
    >
      <span className={styles.button_wrapper}>
        <span className={styles.button_content}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {title}

              {showArrow && (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.9875 8.36721C14.0485 8.25867 14.0834 8.1334 14.0834 8C14.0834 7.90283 14.0649 7.80999 14.0312 7.72477C13.9947 7.63183 13.9388 7.54472 13.8637 7.46959L9.197 2.80292C8.9041 2.51003 8.42923 2.51003 8.13634 2.80292C7.84344 3.09581 7.84344 3.57069 8.13634 3.86358L11.5228 7.25H2.66669C2.25247 7.25 1.91669 7.58579 1.91669 8C1.91669 8.41421 2.25247 8.75 2.66669 8.75H11.5226L8.13634 12.1363C7.84344 12.4291 7.84344 12.904 8.13634 13.1969C8.42923 13.4898 8.9041 13.4898 9.197 13.1969L13.8562 8.53767C13.8925 8.50245 13.9251 8.4636 13.9536 8.42172C13.9658 8.40393 13.977 8.38575 13.9875 8.36721Z" />
                </svg>
              )}
            </>
          )}
        </span>
      </span>
    </a>
  );
};

export default Button;
