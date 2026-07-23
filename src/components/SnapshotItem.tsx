import styles from "./SnapshotItem.module.scss";
import classNames from "classnames";
import { Warning, Check, CheckCircle } from "@phosphor-icons/react";

interface SnapshotItemProps {
  image: string;
  isActive: boolean;
  snapshotName: string;
  onClick: () => void;
  variant?: string;
  reviewed?: boolean;
  resolutions?: Array<{ size: string | null; reviewed: boolean }>;
}

export default function SnapshotItem({
  onClick,
  image,
  isActive,
  snapshotName,
  variant,
  reviewed = false,
  resolutions = [],
}: SnapshotItemProps) {
  const statusLabel = reviewed
    ? "REVIEWED"
    : variant === "fail"
      ? "FAILED"
      : "PASS";

  return (
    <button
      type="button"
      className={classNames(styles.card, {
        [styles.active]: isActive && !reviewed && variant !== "fail",
        [styles.activeFail]: isActive && !reviewed && variant === "fail",
        [styles.activeReviewed]: isActive && reviewed,
        [styles.fail]: !reviewed && variant === "fail",
        [styles.reviewed]: reviewed,
      })}
      onClick={onClick}
    >
      <div className={styles.thumbnail}>
        <img src={image} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.name} title={snapshotName}>
          {snapshotName}
        </div>

        <div className={styles.meta}>
          <span
            className={classNames(styles.status, {
              [styles.statusFail]: !reviewed && variant === "fail",
              [styles.statusPass]: !reviewed && variant !== "fail",
              [styles.statusReviewed]: reviewed,
            })}
          >
            {reviewed ? (
              <CheckCircle size={12} weight="fill" />
            ) : variant === "fail" ? (
              <Warning size={12} />
            ) : (
              <Check size={12} />
            )}
            {statusLabel}
          </span>

          {resolutions.some((resolution) => resolution.size) && (
            <div className={styles.resolutions}>
              {resolutions
                .filter((resolution) => resolution.size)
                .map((resolution) => (
                  <span
                    key={resolution.size}
                    className={classNames(styles.resolutionChip, {
                      [styles.resolutionReviewed]: resolution.reviewed,
                    })}
                  >
                    {resolution.size}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
