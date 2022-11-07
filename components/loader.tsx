import React from "react";
import styles from "css/modules/loader.module.scss";

type LoaderProps = {};

const Loader = ({}: LoaderProps) => {
  return (
    <div className={styles.loader}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Loader;
