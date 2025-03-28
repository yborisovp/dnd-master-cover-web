// SocialLinkButton.tsx
import React from "react";
import styles from "./SocialLinkButton.module.scss";
import { FaGithub, FaTelegramPlane } from "react-icons/fa"; // Common icons
import { SiBoosty } from "react-icons/si"; // Boosty icon from Simple Icons set

// Define the possible platforms
type Platform = "github" | "telegram" | "boosty";

interface SocialLinkButtonProps {
  /** The social platform to display */
  platform: Platform;
  /** The URL the button should link to */
  href: string;
  /** Optional additional CSS class names */
  className?: string;
  /** Accessible label for the link (defaults based on platform) */
  ariaLabel?: string;
}

// Map platform names to icons and default labels
const platformConfig = {
  github: {
    Icon: FaGithub,
    label: "GitHub Profile",
  },
  telegram: {
    Icon: FaTelegramPlane,
    label: "Telegram Profile",
  },
  boosty: {
    Icon: SiBoosty,
    label: "Boosty Profile",
  },
};

const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
  platform,
  href,
  className = "",
  ariaLabel,
}) => {
  const config = platformConfig[platform];

  // Fallback if an invalid platform is somehow passed
  if (!config) {
    console.warn(`SocialLinkButton: Invalid platform "${platform}" provided.`);
    return null;
  }

  const { Icon, label: defaultLabel } = config;
  const effectiveAriaLabel = ariaLabel || defaultLabel;

  return (
    <a
      href={href}
      target="_blank" // Open social links in a new tab
      rel="noopener noreferrer" // Security measure for new tabs
      className={`${styles.socialButton} ${className} ${styles[platform]}`}
      aria-label={effectiveAriaLabel}
      title={effectiveAriaLabel} // Add title attribute as well
    >
      <Icon className={styles.icon} />
      {/* Text removed as social links often only use icons */}
    </a>
  );
};

export default SocialLinkButton;
