import React from "react";
import styles from "./MToggle.module.scss";

interface MToggleProps {
  /** The main label displayed next to or above the toggle */
  label?: string;
  /** A smaller helper text displayed near the label */
  helperText?: string;
  /** The controlled toggle state */
  checked: boolean;
  /** Called when the toggle changes state */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** If true, the switch is disabled and not interactive */
  disabled?: boolean;
  /** Additional className for custom styling */
  className?: string;
}

/**
 * A reusable toggle switch component supporting label, helper text,
 * four states (unchecked, checked, focus/hover, disabled), and
 * standard ARIA accessibility.
 */
const MToggle: React.FC<MToggleProps> = ({
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <label className={`${styles["toggle"]} ${className}`}>
      {/* Text container for label and helper text */}
      <div className={styles["toggle__text"]}>
        {label && <span className={styles["toggle__label"]}>{label}</span>}
        {helperText && (
          <span
            className={`${styles["toggle__helper"]} ${
              disabled ? styles["toggle__helper--disabled"] : ""
            }`}
          >
            {helperText}
          </span>
        )}
      </div>

      {/* Actual switch container */}
      <div className={styles["toggle__switch"]}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles["toggle__checkbox"]}
        />
        <span className={styles["toggle__slider"]}></span>
      </div>
    </label>
  );
};

export default MToggle;
