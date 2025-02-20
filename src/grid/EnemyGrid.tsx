import React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import Enemy, { EnemyData } from '../Cards/Enemy';
import styles from './EnemyGrid.module.scss';

interface EnemyGridProps {
  enemies: EnemyData[];
  layouts: Layout[];
  enemyLink: string;
  onLayoutChange: (layout: Layout[]) => void;
}

const EnemyGrid: React.FC<EnemyGridProps> = ({ enemies, layouts, enemyLink, onLayoutChange }) => {
  return (
    <div className={styles.container}>
      <GridLayout
        className={styles.layout}
        layout={layouts}
        cols={12}
        rowHeight={40}
        width={1600}
        compactType={null}
        isDraggable={true}
        isResizable={true}
        onLayoutChange={onLayoutChange}
        draggableHandle='[class*="dragHandle"]'
      >
        {enemies.map((enemy, index) => (
          <div key={index}>
            <Enemy enemy={enemy} link={enemyLink} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default EnemyGrid;
