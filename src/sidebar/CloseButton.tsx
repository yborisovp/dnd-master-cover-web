// CloseButton.tsx
import React from "react";
import styles from "./CloseButton.module.scss"; // Import the SCSS module

interface CloseButtonProps {
  /** Is the button currently in the "close" (X) state? */
  isChecked: boolean;
  /** Callback function when the button is clicked */
  onClick: () => void;
  /** Optional additional CSS class names */
  className?: string;
  /** Accessible label for the button */
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  isChecked,
  onClick,
  className = "",
  ariaLabel = "Toggle menu", // Provide a default aria-label
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClick(); // Call the passed onClick handler
  };

  return (
    // The label makes the entire visual area clickable
    <label
      className={`${className} ${styles.hamburger}`}
      aria-label={ariaLabel}
    >
      {/* Hidden checkbox controls the state via CSS :checked */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange} // Use onChange for checkboxes
      />
      {/* SVG visual representation */}
      <svg viewBox="0 0 32 32">
        <path
          className={`${styles.line} ${styles.lineTopBottom}`}
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path className={styles.line} d="M7 16 27 16" />
      </svg>
    </label>
  );
};

export default CloseButton;
