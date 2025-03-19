import { ReactNode } from "react";
import styles from "./Wrapper.module.scss";

type MWrapperProps = {
  children: ReactNode;
};

const MWrapper = ({ children }: MWrapperProps) => {
  return <div className={styles.container}>{children}</div>;
};

export default MWrapper;
