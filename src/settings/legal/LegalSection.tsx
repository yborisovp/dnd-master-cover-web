import { useTranslation } from "react-i18next";

const LegalSection = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <h3>{t("app.settings.legal.header")}</h3>
      <p>{t("app.settings.legal.terms")}</p>
    </>
  );
};

export default LegalSection;
