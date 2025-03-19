import React, { useState, MouseEvent } from "react";
import styles from "./Dropdown.module.scss";

export interface DropDownListItem {
  leftIcon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  selected?: boolean;
}

type MDropdownProps = {
  list: DropDownListItem[];
  heading?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  selectedItemPreview?: boolean;
};

const MDropdown: React.FC<MDropdownProps> = ({
  list,
  heading,
  position = "bottom-left",
  selectedItemPreview,
}) => {
  if (position === "top-left" || position === "top-right") {
    list = [
      ...list.filter(({ selected }) => selected),
      ...list.filter(({ selected }) => !selected),
    ];
  } else {
    list = [
      ...list.filter(({ selected }) => !selected),
      ...list.filter(({ selected }) => selected),
    ];
  }
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
    setIsOpen(false);
  };

  const formatItem = (
    index: number,
    item?: DropDownListItem,
    active: boolean = true
  ) => {
    if (item === undefined) {
      return <></>;
    }
    return (
      <div
        key={index}
        className={styles.dropdownItem}
        onClick={() => active && handleItemClick(item.onClick)}
      >
        {item.leftIcon && <span className={styles.icon}>{item.leftIcon}</span>}
        <span>{item.text}</span>
      </div>
    );
  };
  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownButton} onClick={handleToggle}>
        {selectedItemPreview ? (
          formatItem(
            0,
            list.find((s) => s.selected === true),
            false
          )
        ) : (
          <>Select</>
        )}
        <span className={isOpen ? styles.arrowUp : styles.arrowDown}></span>
      </button>

      {isOpen && (
        <div className={`${styles.dropdownContent} ${styles[position]}`}>
          {heading && <div className={styles.dropdownHeading}>{heading}</div>}
          {list.map((item, index) => formatItem(index, item))}
        </div>
      )}
    </div>
  );
};

export default MDropdown;
