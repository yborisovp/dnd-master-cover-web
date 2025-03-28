import EnemyGrid from "./grid/EnemyGrid";
import { useAppSelector } from "./redux/hooks";
import { settingsSelector } from "./redux/slice/settings.slice";
import DiceComponent from "./dice/DiceComponent";

import styles from "./App.module.scss";
import Sidebar from "./sidebar/Sidebar";

function App() {
  const settingsStore = useAppSelector(settingsSelector);

  return (
    <div
      className={`${settingsStore.lightMode && "light-mode"} ${styles.app} ${
        settingsStore.panelAtRight && styles.rightAlign
      }`}
    >
      <Sidebar />
      <EnemyGrid />
      <DiceComponent />
    </div>
  );
}

export default App;
