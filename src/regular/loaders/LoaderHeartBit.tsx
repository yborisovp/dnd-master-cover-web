import styles from "./LoaderHeartBit.module.scss";
type LoaderHeartBitProps = {
  full?: boolean;
};

const LoaderHeartBit = ({ full }: LoaderHeartBitProps) => {
  return (
    <div className={`${styles.loading} ${full && styles.full}`}>
      <svg width="64px" height="48px">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          className={styles.back}
        ></polyline>
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          className={styles.front}
        ></polyline>
      </svg>
    </div>
  );
};

export default LoaderHeartBit;
