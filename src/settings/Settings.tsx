import { useState } from "react";
import styles from "./Settings.module.scss";
import GeneralSection from "./general/GeneralSection";
import LegalSection from "./legal/LegalSection";
import FeedbackSection from "./feedback/FeedbackSection";
import { MButton } from "../regular/button/Button";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"general" | "feedback" | "legal">(
    "general"
  );

  return (
    <div className={styles.modal}>
      <nav className={styles.nav}>
        <MButton
          isActive={activeTab === "general"}
          className={`${styles.navItem}`}
          onClick={() => setActiveTab("general")}
        >
          General
        </MButton>
        <MButton
          isActive={activeTab === "feedback"}
          className={`${styles.navItem}`}
          onClick={() => setActiveTab("feedback")}
        >
          Feedback
        </MButton>
        <MButton
          isActive={activeTab === "legal"}
          className={`${styles.navItem}`}
          onClick={() => setActiveTab("legal")}
        >
          Legal
        </MButton>
      </nav>

      <div className={styles.content}>
        <h2 className={styles.title}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>

        {activeTab === "general" && (
          <div className={styles.section}>
            <GeneralSection />
          </div>
        )}

        {activeTab === "feedback" && <FeedbackSection />}

        {activeTab === "legal" && (
          <div className={styles.section}>
            <LegalSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
