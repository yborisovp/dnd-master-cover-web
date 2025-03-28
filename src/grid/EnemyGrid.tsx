import GridLayout from "react-grid-layout";
import styles from "./EnemyGrid.module.scss";
import Enemy from "../enemy/Enemy";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  onLayoutChange,
  selectActiveEnemies,
  selectLayout,
} from "../redux/slice/enemies.slice";

export const GridColsNumber = 12;
const EnemyGrid = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);
  const enemies = useAppSelector(selectActiveEnemies);

  return (
    <div className={styles.container}>
      <GridLayout
        className={styles.layout}
        layout={layout}
        cols={GridColsNumber}
        rowHeight={40}
        width={1600}
        compactType={null}
        isDraggable={true}
        isResizable={true}
        onLayoutChange={(layout) => dispatch(onLayoutChange(layout))}
        draggableHandle='[class*="dragHandle"]'
      >
        {enemies?.map((enemy, index) => (
          <div key={index}>
            <Enemy localId={enemy.id} enemy={enemy.enemy} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default EnemyGrid;
