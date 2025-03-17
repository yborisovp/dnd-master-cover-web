import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  settingsSelector,
  toggleLightMode,
} from "../../redux/slice/settings.slice";
import MToggle from "../../regular/toggle/MToggle";
import styles from "./GeneralSection.module.scss";

const GeneralSection = () => {
  const settingsState = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Light Mode</h3>
        <p>Enable light mode for the site.</p>
      </div>
      <MToggle
        checked={settingsState.lightMode}
        onChange={() => dispatch(toggleLightMode())}
      />
    </div>
  );
};

export default GeneralSection;
