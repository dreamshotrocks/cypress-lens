import { CheckCircle } from "@phosphor-icons/react";
import styles from "./EmptyFailedState.module.scss";
import { SelectedImage } from "../types/ReporterTypes";

interface EmptyFailedStateProps {
  previews: SelectedImage[];
  onSelect: (entry: SelectedImage) => void;
}

export default function EmptyFailedState({
  previews,
  onSelect,
}: EmptyFailedStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CheckCircle size={36} weight="fill" className={styles.icon} />
        <h2 className={styles.title}>No failed snapshots</h2>
        <p className={styles.subtitle}>
          All visual checks passed. Browse a few passed snapshots below, or
          switch back to All.
        </p>
      </div>

      {previews.length > 0 && (
        <div className={styles.grid}>
          {previews.map((entry) => {
            const key = `${entry.item.props.name}-${entry.test.props.name}-${entry.snapshot.props.name}-${entry.resolution.size}`;
            const image =
              entry.resolution.images.base ||
              entry.snapshot.resolutions[0]?.images.base;

            return (
              <button
                key={key}
                type="button"
                className={styles.card}
                onClick={() => onSelect(entry)}
              >
                <div className={styles.thumbnail}>
                  <img src={image} alt={entry.snapshot.props.name} />
                </div>
                <div className={styles.meta}>
                  <span className={styles.name}>{entry.snapshot.props.name}</span>
                  <span className={styles.size}>{entry.resolution.size}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
