import { CheckCircle, SquaresFour } from "@phosphor-icons/react";
import styles from "./ReviewComplete.module.scss";
import { SelectedImage } from "../types/ReporterTypes";

interface ReviewCompleteProps {
  failedEntries: SelectedImage[];
  onBackToGallery: () => void;
}

export default function ReviewComplete({
  failedEntries,
  onBackToGallery,
}: ReviewCompleteProps) {
  const previews = failedEntries.slice(0, 8);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <CheckCircle size={48} weight="fill" />
        </div>

        <h1 className={styles.title}>Thanks for reviewing</h1>
        <p className={styles.subtitle}>
          You've reviewed all failed snapshots
          {failedEntries.length > 0 ? ` (${failedEntries.length})` : ""}.
        </p>

        {previews.length > 0 && (
          <div className={styles.previews}>
            {previews.map((entry) => {
              const key = [
                entry.item.props.name,
                entry.test.props.name,
                entry.snapshot.props.name,
                entry.resolution.size ?? "default",
              ].join("::");

              return (
                <div key={key} className={styles.preview}>
                  <img
                    src={entry.resolution.images.base}
                    alt={entry.snapshot.props.name}
                  />
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToGallery}
        >
          <SquaresFour size={16} weight="bold" />
          Back to report
        </button>
      </div>
    </div>
  );
}
