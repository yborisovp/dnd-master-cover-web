import { JSX, useEffect, useState } from "react";

import { Layout } from "react-grid-layout";

import styles from "./App.module.scss";
import EnemyGrid from "./grid/EnemyGrid";
import { EnemyData } from "./models/enemy";
import EnemySearch from "./search/EnemySearch";
import InitiativeList from "./initiativeList/InitiativeList";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  closeModal,
  openModal,
  settingsSelector,
} from "./redux/slice/settings.slice";
import { FaGear } from "react-icons/fa6";
import Settings from "./settings/Settings";
import { MButton } from "./regular/button/Button";

function App() {
  const [enemies, setEnemies] = useState<
    { enemy: EnemyData; enemyLink: string }[]
  >([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
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

  // Callback from EnemySearch to add a new enemy.
  const addEnemyFromSearch = (newEnemy: EnemyData, enemyLink: string) => {
    const newIndex = enemies.length;
    const resEnemy = { enemy: newEnemy, enemyLink: enemyLink };

    setEnemies([...enemies, resEnemy]);
    setLayouts([
      ...layouts,
      {
        i: `${newIndex}`,
        x: (newIndex * 2) % 12,
        y: 0,
        w: 3,
        h: 5,
      },
    ]);
    setShowSearchModal(false); // Close the modal after selection
  };

  const onLayoutChange = (layout: Layout[]) => {
    setLayouts(layout);
  };

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
  return (
    <div className={`${settingsStore.lightMode && "light-mode"} ${styles.app}`}>
      <div className={styles.container}>
        <div className={styles.actionsContainer}>
          <div
            className={styles.settings}
            onClick={() => dispatch(openModal())}
          >
            <FaGear size={20} />
          </div>
          <MButton
            isSuggest={true}
            className={styles.addButton}
            onClick={() => setShowSearchModal(true)}
          >
            Add Enemy
          </MButton>
        </div>
        <InitiativeList />

        {showSearchModal &&
          modalWrapper(<EnemySearch onAddEnemy={addEnemyFromSearch} />, () =>
            setShowSearchModal(false)
          )}

        {settingsStore.isOpen &&
          modalWrapper(<Settings />, () => dispatch(closeModal()))}
      </div>
      <EnemyGrid
        enemies={enemies}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
      />
    </div>
  );
}

export default App;
