import { JSX } from "react";

import styles from "./Button.module.scss";
type ButtonProps = {
  className?: string;
  centerInitial?: boolean;
  children: JSX.Element | string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isActive?: boolean;
  isSuggest?: boolean;
  isDangerous?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

export const MButton = ({
  className,
  children,
  centerInitial,
  onClick,
  isActive,
  isSuggest,
  isDangerous,
  type,
}: ButtonProps) => {
  let classNameLocal = styles.button;
  if (className != null) {
    classNameLocal += " " + className;
  }
  if (isActive) {
    classNameLocal += " " + styles.active;
  }
  if (isSuggest) {
    classNameLocal += " " + styles.suggest;
  }
  if (isDangerous) {
    classNameLocal += " " + styles.dangerous;
  }
  return (
    <button
      type={type}
      className={classNameLocal}
      style={{ placeSelf: centerInitial ? "initial" : "center" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
