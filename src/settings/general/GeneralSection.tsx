import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changeLocalLanguage,
  LanguageEnum,
  settingsSelector,
  toggleLightMode,
  toggleViewAlign,
} from "../../redux/slice/settings.slice";
import MToggle from "../../regular/toggle/MToggle";
import styles from "./GeneralSection.module.scss";
import usa from "../../resources/flags/usa.svg";
import russia from "../../resources/flags/russia.svg";
import MDropdown, { DropDownListItem } from "../../regular/dropdown/Dropdown";

const GeneralSection = () => {
  const { t, i18n } = useTranslation("common");
  const settingsState = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();

  const dropdownItems: DropDownListItem[] = [
    {
      leftIcon: <img src={usa} alt="usa flag" />,
      text: t("app.settings.general.language.english"),
      onClick: () => {
        dispatch(changeLocalLanguage(LanguageEnum.en));
        i18n.changeLanguage("en");
      },
      selected: settingsState.language === LanguageEnum.en,
    },
    {
      leftIcon: <img src={russia} alt="russia flag" />,
      text: t("app.settings.general.language.russian"),
      onClick: () => {
        dispatch(changeLocalLanguage(LanguageEnum.ru));
        i18n.changeLanguage("ru");
      },
      selected: settingsState.language === LanguageEnum.ru,
    },
  ];
  console.log(dropdownItems.find((s) => s.selected === true));
  return (
    <div className={styles.general}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h3>{t("app.settings.general.lgiht-mode-title")}</h3>
          <p>{t("app.settings.general.lgiht-mode-description")}</p>
        </div>
        <MToggle
          checked={settingsState.lightMode}
          onChange={() => dispatch(toggleLightMode())}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h3>{t("app.settings.general.panel-title")}</h3>
          <p>{t("app.settings.general.panel-description")}</p>
        </div>
        <MToggle
          checked={settingsState.panelAtRight}
          onChange={() => dispatch(toggleViewAlign())}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h3>{t("app.settings.general.language-text")}</h3>
        </div>
        <MDropdown
          list={dropdownItems}
          position="bottom-right"
          selectedItemPreview
        />
      </div>
    </div>
  );
};

export default GeneralSection;
