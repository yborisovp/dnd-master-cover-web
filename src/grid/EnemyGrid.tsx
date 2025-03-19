import React, { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import styles from "./EnemyGrid.module.scss";
import Enemy from "../enemy/Enemy";
import { useAppSelector } from "../redux/hooks";
import { selectActiveEnemies } from "../redux/slice/enemies.slice";

const EnemyGrid = () => {
  const enemies = useAppSelector(selectActiveEnemies);
  const [layouts, setLayouts] = useState<Layout[]>([]);

  const onLayoutChange = (layout: Layout[]) => {
    setLayouts(layout);
  };

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
            <Enemy enemy={enemy} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default EnemyGrid;
