import styles from "./SnapshotItem.module.scss";
import classNames from "classnames";
import { Warning, Check } from "@phosphor-icons/react";

interface SnapshotItemProps {
  image: string;
  isActive: boolean;
  snapshotName: string;
  snapshotPercent: string;
  onClick: () => void;
  variant?: string;
}

export default function SnapshotItem({
  onClick,
  image,
  isActive,
  snapshotName,
  snapshotPercent,
  variant,
}: SnapshotItemProps) {
  return (
    <div
      className={classNames({
        [styles["container"]]: true,
        [styles["active"]]: isActive && variant != "fail",
        [styles["active-fail"]]: isActive && variant === "fail",
        [styles["fail"]]: variant === "fail",
      })}
      onClick={onClick}
    >
      <div
        className={classNames({
          [styles["image-container"]]: true,
          [styles["active"]]: isActive,
        })}
      >
        <img className={styles["image"]} src={image} alt="base" />
      </div>
      <div className={styles["information-container"]}>
        <div className={styles["image-name-text"]}>{snapshotName}</div>
        <div className={styles["image-percent-text"]}>
          {variant === "fail" ? <Warning size={16} /> : <Check size={16} />}
          {snapshotPercent}
        </div>
      </div>
    </div>
  );
}
