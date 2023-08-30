import styles from "./SnapshotItem.module.scss";

interface SnapshotItemProps {
  image: string;
  isActive: boolean;
  snapshotName: string;
  snapshotPercent: string;
  isSnapshotLast: boolean;
  isSnapshotFirst: boolean;
  onClick: () => void;
}

export default function SnapshotItem({
  onClick,
  image,
  isActive,
  snapshotName,
  snapshotPercent,
  isSnapshotLast,
  isSnapshotFirst,
}: SnapshotItemProps) {
  return (
    <div
      className={styles[isActive ? "active-container" : "container"]}
      onClick={onClick}
      style={{
        borderTopLeftRadius: isSnapshotFirst ? "10px" : 0,
        borderTopRightRadius: isSnapshotFirst ? "10px" : 0,
        borderBottomLeftRadius: isSnapshotLast ? "10px" : 0,
        borderBottomRightRadius: isSnapshotLast ? "10px" : 0,
      }}
    >
      <div
        className={
          styles[isActive ? "active-image-container" : "image-container"]
        }
      >
        <img className={styles["image"]} src={image} alt="base" />
      </div>
      <div className={styles["information-container"]}>
        <div className={styles["image-name-text"]}>{snapshotName}</div>
        <div className={styles["image-percent-text"]}>
          {snapshotPercent && `${snapshotPercent}%`}
        </div>
      </div>
    </div>
  );
}
