import React from 'react';
import GridLayout, { Layout } from "react-grid-layout";
import styles from "./EnemyGrid.module.scss";
import { EnemyData } from "../models/enemy";
import Enemy from "../enemy/Enemy";

interface EnemyGridProps {
  enemies: { enemy: EnemyData; enemyLink: string }[];
  layouts: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
}

const EnemyGrid: React.FC<EnemyGridProps> = ({
  enemies,
  layouts,
  onLayoutChange,
}) => {
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
            <Enemy enemy={enemy.enemy} link={enemy.enemyLink} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default EnemyGrid;
