import React, { JSX, useState } from "react";
import styles from "./Accordion.module.scss";

export interface AccordionProps {
  title: string;
  issuesCount?: number; // e.g. "2 issues"
  isDisabled?: boolean; // For disabled state
  children?: JSX.Element; // Expanded content
}

const MAccordion: React.FC<AccordionProps> = ({
  title,
  issuesCount,
  isDisabled = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isDisabled) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`${styles.accordion} ${isDisabled ? styles.disabled : ""} ${
        isOpen ? styles.open : ""
      }`}
    >
      <div className={styles.header} onClick={handleToggle}>
        <div className={styles.title}>{title}</div>
        {issuesCount && (
          <div className={styles.issuesCount}>{issuesCount} issues</div>
        )}
        <span className={isOpen ? styles.arrowUp : styles.arrowDown}></span>
      </div>

      {/* Show content only if not disabled and isOpen */}
      {isOpen && !isDisabled && (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
};

export default MAccordion;
