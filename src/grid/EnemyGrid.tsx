import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import Enemy, { EnemyData } from '../Cards/Enemy';
import styles from './EnemyGrid.module.scss';
import EnemySearch from '../search/EnemySearch';
import { link } from 'fs';

const EnemyGrid: React.FC = () => {
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [enemyLink, setEnemyLink] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Add a new enemy and corresponding layout item
  const addEnemyFromSearch = (newEnemy: EnemyData, enemyLink: string) => {
    const newIndex = enemies.length;
    setEnemyLink(enemyLink);
    setEnemies([...enemies, newEnemy]);
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
    <div className={styles.container}>
      <button className={styles.addButton}onClick={() => setShowSearchModal(true)}>
        Add Enemy
      </button>

      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={40}
        width={1600}           // Increase as needed for more horizontal space
        compactType={null}    // No auto-compacting
        isDraggable={true}
        isResizable={true}
        onLayoutChange={onLayoutChange}
        draggableHandle='[class*="dragHandle"]'
      >
        {enemies.map((enemy, index) => (
          <div key={index}>
            <Enemy enemy={enemy} link={enemyLink}/>
          </div>
        ))}
      </GridLayout>
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
  );
};

export default EnemyGrid;
