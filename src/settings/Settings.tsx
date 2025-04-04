import { useState } from "react";
import styles from "./Settings.module.scss";
import GeneralSection from "./general/GeneralSection";
import LegalSection from "./legal/LegalSection";
import FeedbackSection from "./feedback/FeedbackSection";
import { MButton } from "../regular/button/Button";
import { useTranslation } from "react-i18next";
import SocialLinkButton from "./SocialButton/SocialLinkButton";

const Settings = () => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState<
    "general" | "feedback" | "legal" | "game"
  >("general");

  return (
    <div className={styles.modal}>
      <div className={styles.navigationWrapper}>
        <nav className={styles.nav}>
          <MButton
            isActive={activeTab === "general"}
            className={`${styles.navItem}`}
            onClick={() => setActiveTab("general")}
          >
            {t("app.settings.general-button")}
          </MButton>
          <MButton
            isActive={activeTab === "game"}
            className={`${styles.navItem}`}
            onClick={() => setActiveTab("game")}
          >
            {t("app.settings.game-button")}
          </MButton>
          <MButton
            isActive={activeTab === "feedback"}
            className={`${styles.navItem}`}
            onClick={() => setActiveTab("feedback")}
          >
            {t("app.settings.feedback-button")}
          </MButton>
          <MButton
            isActive={activeTab === "legal"}
            className={`${styles.navItem}`}
            onClick={() => setActiveTab("legal")}
          >
            {t("app.settings.legal-button")}
          </MButton>
        </nav>
        <div className={styles.social}>
          <SocialLinkButton
            platform="github"
            href="https://github.com/yborisovp"
          />
          <SocialLinkButton platform="telegram" href="https://t.me/yborisovp" />
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "general" && (
          <>
            <h2 className={styles.title}>{t("app.settings.general-button")}</h2>
            <div className={styles.section}>
              <GeneralSection />
            </div>
          </>
        )}

        {activeTab === "feedback" && (
          <>
            <h2 className={styles.title}>
              {t("app.settings.feedback-button")}
            </h2>
            <div className={styles.section}>
              <FeedbackSection />
            </div>
          </>
        )}

        {activeTab === "legal" && (
          <>
            <h2 className={styles.title}>{t("app.settings.legal-button")}</h2>
            <div className={styles.section}>
              <LegalSection />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
