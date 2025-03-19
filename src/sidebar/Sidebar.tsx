import { JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaMoon } from "react-icons/fa";
import { FaGear, FaPlus } from "react-icons/fa6";

import Settings from "../settings/Settings";
import EnemySearch from "../search/EnemySearch";
import MToggle from "../regular/toggle/MToggle";
import { MButton } from "../regular/button/Button";
import InitiativeList from "../initiativeList/InitiativeList";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  closeModal,
  openModal,
  settingsSelector,
  toggleLightMode,
  toggleSideBar,
} from "../redux/slice/settings.slice";

import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const { t } = useTranslation("common");

  const [showSearchModal, setShowSearchModal] = useState(false);

  const dispatch = useAppDispatch();
  const settingsStore = useAppSelector(settingsSelector);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSearchModal) {
          setShowSearchModal(false);
        } else if (settingsStore.isOpen) {
          dispatch(closeModal());
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dispatch, settingsStore.isOpen, showSearchModal]);

  const modalWrapper = (child: JSX.Element, modalAction: () => void) => {
    return (
      <>
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={modalAction}
              aria-label="Close settings"
            >
              &times;
            </button>
            {child}
          </div>
        </div>
      </>
    );
  };

  const openSideBar = (
    <>
      <div>
        <FaChevronLeft
          className={styles.sidebarHandle}
          onClick={() => dispatch(toggleSideBar())}
        />
        <div className={styles.playersGroup}>
          <div className={styles.title}>first pack</div>
          <div className={styles.selector}>{">"}</div>
        </div>
        <div className={styles.initiativeList}>
          <InitiativeList />
        </div>
      </div>
      <div className={styles.secondPartContainer}>
        <MButton
          isSuggest={true}
          className={styles.addButton}
          onClick={() => setShowSearchModal(true)}
        >
          {t("app.side-bar.add-enemy")}
        </MButton>
        <div className={styles.actionsContainer}>
          <div
            className={styles.settings}
            onClick={() => dispatch(openModal())}
          >
            <FaGear size={18} />
            <span>{t("app.side-bar.settings")}</span>
          </div>
          <div className={styles.darkMode}>
            <div className={styles.textContainer}>
              <FaMoon size={18} />
              <span>{t("app.side-bar.light-theme")}</span>
            </div>
            <MToggle
              checked={settingsStore.lightMode}
              onChange={() => dispatch(toggleLightMode())}
            />
          </div>
        </div>
      </div>
    </>
  );

  const closedSidebar = (
    <>
      <div>
        <FaChevronRight
          className={styles.sidebarHandle}
          onClick={() => dispatch(toggleSideBar())}
        />
        <div className={styles.initiativeList}>
          <InitiativeList collapsed={true} />
        </div>
      </div>
      <div className={styles.secondPartContainer}>
        <MButton
          isSuggest={true}
          className={styles.addButton}
          onClick={() => setShowSearchModal(true)}
        >
          <FaPlus />
        </MButton>
        <span className={styles.divider} />
        <div className={styles.actionsContainer}>
          <div
            className={styles.settings}
            onClick={() => dispatch(openModal())}
          >
            <FaGear size={18} />
          </div>
          <div className={styles.darkMode}>
            <div
              className={styles.textContainer}
              onClick={() => dispatch(toggleLightMode())}
            >
              <FaMoon size={18} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`${styles.container} ${
          settingsStore.sidebarCollapsed && styles.closed
        }`}
      >
        {settingsStore.sidebarCollapsed ? closedSidebar : openSideBar}

        {showSearchModal &&
          modalWrapper(
            <EnemySearch onEnemySelected={() => setShowSearchModal(false)} />,
            () => setShowSearchModal(false)
          )}

        {settingsStore.isOpen &&
          modalWrapper(<Settings />, () => dispatch(closeModal()))}
      </div>
    </>
  );
};

export default Sidebar;
