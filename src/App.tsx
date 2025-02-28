import { useState } from "react";

import { Layout } from "react-grid-layout";

import styles from "./App.module.scss";
import EnemyGrid from "./grid/EnemyGrid";
import { EnemyData } from "./models/enemy";
import EnemySearch from "./search/EnemySearch";
import InitiativeList from "./initiativeList/InitiativeList";

function App() {
  const [enemies, setEnemies] = useState<
    { enemy: EnemyData; enemyLink: string }[]
  >([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

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
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <button
          className={styles.addButton}
          onClick={() => setShowSearchModal(true)}
        >
          Add Enemy
        </button>
        <InitiativeList />

        {showSearchModal && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <button
                className={styles.closeButton}
                onClick={() => setShowSearchModal(false)}
              >
                ×
              </button>
              <EnemySearch onAddEnemy={addEnemyFromSearch} />
            </div>
          </div>
        )}
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
