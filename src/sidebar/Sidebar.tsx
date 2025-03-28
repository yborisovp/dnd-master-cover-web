import { JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMoon } from "react-icons/fa";
import { FaGear, FaPlus } from "react-icons/fa6";

import EnemySearch from "../search/EnemySearch";
import MToggle from "../regular/toggle/MToggle";
import { MButton } from "../regular/button/Button";
import InitiativeList from "../initiativeList/InitiativeList";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  settingsSelector,
  toggleLightMode,
  toggleSideBar,
} from "../redux/slice/settings.slice";

import styles from "./Sidebar.module.scss";
import { Outlet, useNavigate, useLocation } from "react-router";
import CloseButton from "./CloseButton";
import { selectActiveGroupPlayers } from "../redux/slice/playerGroup.slice";

const Sidebar = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();

  // State for controlling the enemy search modal
  const [enemyModal, setEnemyModal] = useState(false);

  const dispatch = useAppDispatch();
  const settingsStore = useAppSelector(settingsSelector);
  const activeGroups = useAppSelector(selectActiveGroupPlayers);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (enemyModal) {
          setEnemyModal(false);
        } else if (location.pathname.endsWith("settings")) {
          navigate(-1);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [enemyModal, location.pathname, navigate]);

  // Reusable modal wrapper function
  const modalWrapper = (child: JSX.Element, modalAction: () => void) => (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={modalAction}
          aria-label="Close modal"
        >
          &times;
        </button>
        {child}
      </div>
    </div>
  );

  // Expanded sidebar layout
  const openSideBar = (
    <>
      <div>
        <CloseButton
          isChecked={!settingsStore.sidebarCollapsed}
          className={styles.sidebarHandle}
          onClick={() => dispatch(toggleSideBar())}
        />
        <div className={styles.playersGroup}>
          <div className={styles.title}>{activeGroups?.title}</div>
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
          onClick={() => setEnemyModal(true)}
        >
          {t("app.side-bar.add-enemy")}
        </MButton>
        <div className={styles.actionsContainer}>
          <div className={styles.settings} onClick={() => navigate("settings")}>
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

  // Collapsed sidebar layout
  const closedSidebar = (
    <>
      <div>
        <CloseButton
          isChecked={!settingsStore.sidebarCollapsed}
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
          onClick={() => setEnemyModal(true)}
        >
          <FaPlus />
        </MButton>
        <span className={styles.divider} />
        <div className={styles.actionsContainer}>
          <div className={styles.settings} onClick={() => navigate("settings")}>
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

        {/* Enemy Search Modal */}
        {enemyModal &&
          modalWrapper(
            <EnemySearch onEnemySelected={() => setEnemyModal(false)} />,
            () => setEnemyModal(false)
          )}

        {/* Settings Modal triggered by route */}
        {location.pathname.endsWith("settings") &&
          modalWrapper(<Outlet />, () => navigate(-1))}
      </div>
    </>
  );
};

export default Sidebar;
