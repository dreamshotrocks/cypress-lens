import styles from "./Baseline.module.scss";

interface BaselineProps {
  src: string;
}

export default function Baseline({ src }: BaselineProps) {
  return (
    <div className={styles["container"]}>
      <div
        className={styles["image"]}
        style={{ backgroundImage: `url("${src}")` }}
      ></div>
    </div>
  );
}
