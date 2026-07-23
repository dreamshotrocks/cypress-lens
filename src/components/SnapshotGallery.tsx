import { useEffect, useState } from "react";
import {
  CaretDown,
  CaretRight,
  Check,
  CheckCircle,
  Checks,
  Trash,
  Warning,
} from "@phosphor-icons/react";
import classNames from "classnames";
import styles from "./SnapshotGallery.module.scss";
import { Item, SelectedImage } from "../types/ReporterTypes";
import { isFailedSnapshot } from "../utils/failure";
import {
  SpecGroup,
  StatusFilter,
  getStatusCounts,
} from "../utils/filterSnapshots";
import { getReportCreatedAt } from "../utils/reportCreatedAt";
import {
  areAllResolutionsReviewed,
  isResolutionReviewed,
  isSnapshotReviewed,
} from "../utils/reviewedSnapshots";

interface SnapshotGalleryProps {
  items: Item[];
  groups: SpecGroup[];
  statusFilter: StatusFilter;
  searchQuery: string;
  reviewedKeys: Set<string>;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onSearchQueryChange: (query: string) => void;
  onSelect: (entry: SelectedImage) => void;
  onMarkAllReviewed: () => void;
  onClearReviewData: () => void;
}

export default function SnapshotGallery({
  items,
  groups,
  statusFilter,
  searchQuery,
  reviewedKeys,
  onStatusFilterChange,
  onSearchQueryChange,
  onSelect,
  onMarkAllReviewed,
  onClearReviewData,
}: SnapshotGalleryProps) {
  const counts = getStatusCounts(items);
  const createdAt = getReportCreatedAt(items);
  const totalCards = groups.reduce((sum, group) => sum + group.cards.length, 0);
  const hasReviewedData = reviewedKeys.size > 0;
  const allReviewed = areAllResolutionsReviewed(items, reviewedKeys);
  const [collapsedSpecs, setCollapsedSpecs] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setCollapsedSpecs((current) => {
      const next: Record<string, boolean> = {};
      groups.forEach((group) => {
        next[group.specName] = current[group.specName] ?? false;
      });
      return next;
    });
  }, [groups]);

  const toggleSpec = (specName: string) => {
    setCollapsedSpecs((current) => ({
      ...current,
      [specName]: !current[specName],
    }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {createdAt && (
            <div className={styles.createdAt}>
              <span className={styles.createdAtLabel}>Report created</span>
              <span className={styles.createdAtValue}>{createdAt}</span>
            </div>
          )}
          <div className={styles.filters}>
            {(
              [
                ["all", `All: ${counts.all}`],
                ["failed", `Failed: ${counts.failed}`],
                ["passed", `Passed: ${counts.passed}`],
              ] as const
            ).map(([filter, label]) => (
              <button
                key={filter}
                type="button"
                className={classNames(styles.filterTab, {
                  [styles.active]: statusFilter === filter,
                })}
                onClick={() => onStatusFilterChange(filter)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.markAllReviewedButton}
            onClick={onMarkAllReviewed}
            disabled={allReviewed || counts.all === 0}
            title={
              allReviewed
                ? "All resolutions are already reviewed"
                : "Mark every resolution in this report as reviewed"
            }
          >
            <Checks size={15} weight="bold" />
            Mark all reviewed
          </button>

          <button
            type="button"
            className={styles.clearReviewButton}
            onClick={onClearReviewData}
            disabled={!hasReviewedData}
            title={
              hasReviewedData
                ? "Clear review progress for this report"
                : "No review data saved for this report"
            }
          >
            <Trash size={15} weight="bold" />
            Clear review data
          </button>
        </div>

        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 10.5L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search snapshots, specs..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.content}>
        {totalCards === 0 ? (
          <div className={styles.empty}>
            <h2>No snapshots found</h2>
            <p>Try another filter or clear your search.</p>
          </div>
        ) : (
          <div className={styles.groups}>
            {groups.map((group) => {
              const isCollapsed = Boolean(collapsedSpecs[group.specName]);

              return (
                <section key={group.specName} className={styles.group}>
                  <button
                    type="button"
                    className={styles.groupHeader}
                    onClick={() => toggleSpec(group.specName)}
                    aria-expanded={!isCollapsed}
                  >
                    <div className={styles.groupTitleRow}>
                      {isCollapsed ? (
                        <CaretRight size={16} className={styles.caret} />
                      ) : (
                        <CaretDown size={16} className={styles.caret} />
                      )}
                      <h2 className={styles.groupTitle}>{group.specName}</h2>
                      <span className={styles.specTag}>spec</span>
                    </div>
                    <div className={styles.groupCounts}>
                      {group.failedCount > 0 && (
                        <span className={styles.failedCount}>
                          Failed: {group.failedCount}
                        </span>
                      )}
                      {group.passedCount > 0 && (
                        <span className={styles.passedCount}>
                          Passed: {group.passedCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div className={styles.grid}>
                      {group.cards.map((entry) => {
                        const failed = isFailedSnapshot(
                          entry.snapshot.resolutions
                        );
                        const reviewed = isSnapshotReviewed(entry, reviewedKeys);
                        const key = `${entry.item.props.name}-${entry.test.props.name}-${entry.snapshot.props.name}`;

                        return (
                          <button
                            key={key}
                            type="button"
                            className={classNames(styles.card, {
                              [styles.cardFailed]: failed,
                              [styles.cardReviewed]: reviewed,
                            })}
                            onClick={() => onSelect(entry)}
                          >
                            <div className={styles.thumbnail}>
                              <img
                                src={entry.resolution.images.base}
                                alt={entry.snapshot.props.name}
                              />
                            </div>
                            <div className={styles.meta}>
                              <span className={styles.name}>
                                {entry.snapshot.props.name}
                              </span>
                              <div className={styles.cardFooter}>
                                <span
                                  className={classNames(styles.status, {
                                    [styles.statusFailed]: failed && !reviewed,
                                    [styles.statusPassed]:
                                      !failed && !reviewed,
                                    [styles.statusReviewed]: reviewed,
                                  })}
                                >
                                  {reviewed ? (
                                    <CheckCircle size={14} weight="fill" />
                                  ) : failed ? (
                                    <Warning size={14} />
                                  ) : (
                                    <Check size={14} />
                                  )}
                                  {reviewed
                                    ? "REVIEWED"
                                    : failed
                                      ? "FAILED"
                                      : "PASS"}
                                </span>
                                <span className={styles.resolutions}>
                                  {entry.snapshot.resolutions
                                    .filter((resolution) => resolution.size)
                                    .map((resolution, index, list) => {
                                      const resolutionReviewed =
                                        isResolutionReviewed(
                                          { ...entry, resolution },
                                          reviewedKeys
                                        );

                                      return (
                                        <span key={resolution.size}>
                                          <span
                                            className={classNames({
                                              [styles.resolutionReviewed]:
                                                resolutionReviewed,
                                            })}
                                          >
                                            {resolution.size}
                                          </span>
                                          {index < list.length - 1 && (
                                            <span className={styles.resolutionSep}>
                                              {" · "}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
