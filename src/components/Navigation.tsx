import { useEffect, useState } from "react";
import { Checks, MagnifyingGlass, Trash, X } from "@phosphor-icons/react";
import classNames from "classnames";
import styles from "./Navigation.module.scss";
import Collapse from "./Collapse";
import SnapshotItem from "./SnapshotItem";
import { Item, SelectedImage, Snapshot, Test } from "../types/ReporterTypes";
import {
  isFailedResolution,
  isFailedSnapshot,
} from "../utils/failure";
import { getReportCreatedAt } from "../utils/reportCreatedAt";
import {
  areAllResolutionsReviewed,
  isResolutionReviewed,
  isSnapshotReviewed,
} from "../utils/reviewedSnapshots";

interface NavigationProps {
  items: Item[];
  selectedImage: SelectedImage | null;
  reviewedKeys: Set<string>;
  activeFilter: string;
  onActiveFilterChange: (filter: string) => void;
  onImageClick: (entry: SelectedImage) => void;
  onFilteredItemsChange: (items: Item[]) => void;
  onMarkAllReviewed: () => void;
  onClearReviewData: () => void;
}

export default function Navigation({
  items,
  selectedImage,
  reviewedKeys,
  activeFilter,
  onActiveFilterChange,
  onImageClick,
  onFilteredItemsChange,
  onMarkAllReviewed,
  onClearReviewData,
}: NavigationProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCollapse, setOpenCollapse] = useState<string | null>(
    items[0]?.props.name ?? null
  );

  const createdAt = getReportCreatedAt(items);
  const hasReviewedData = reviewedKeys.size > 0;
  const allReviewed = areAllResolutionsReviewed(items, reviewedKeys);
  const counts = getCounts(items);

  const imageClickHandler = (snapshot: Snapshot, item: Item, test: Test) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTop = 0;
    const resolution =
      snapshot.resolutions.find(isFailedResolution) || snapshot.resolutions[0];
    onImageClick({
      snapshot,
      item,
      test,
      resolution,
    });
  };

  const applySearchFilter = (itemsToFilter: Item[]): Item[] => {
    if (!searchQuery.trim()) {
      return itemsToFilter;
    }

    const query = searchQuery.toLowerCase().trim();

    return itemsToFilter
      .map((item) => {
        const itemMatches = item.props.name.toLowerCase().includes(query);

        const filteredTests = item.tests
          .map((test) => {
            const testMatches = test.props.name.toLowerCase().includes(query);
            const filteredSnapshots = test.snapshots.filter((snapshot) =>
              snapshot.props.name.toLowerCase().includes(query)
            );

            if (testMatches || filteredSnapshots.length > 0) {
              return {
                ...test,
                snapshots: testMatches ? test.snapshots : filteredSnapshots,
              };
            }
            return null;
          })
          .filter((test): test is Test => test !== null);

        if (itemMatches || filteredTests.length > 0) {
          return {
            ...item,
            tests: itemMatches ? item.tests : filteredTests,
          };
        }
        return null;
      })
      .filter((item): item is Item => item !== null);
  };

  const filter = () => {
    let baseItems = items;

    if (activeFilter === "failed") {
      baseItems = items
        .map((item) => {
          const failedTests = item.tests
            .map((test) => ({
              ...test,
              snapshots: test.snapshots
                .map((snapshot) => {
                  const validResolutions = snapshot.resolutions.filter(
                    isFailedResolution
                  );
                  return validResolutions.length > 0
                    ? { ...snapshot, resolutions: validResolutions }
                    : null;
                })
                .filter((snapshot): snapshot is Snapshot => snapshot !== null),
            }))
            .filter((test) => test.snapshots.length > 0);

          return {
            ...item,
            tests: failedTests,
          };
        })
        .filter((item) => item.tests.length > 0);
    }

    const finalFilteredItems = applySearchFilter(baseItems);
    setFilteredItems(finalFilteredItems);
    onFilteredItemsChange(finalFilteredItems);
  };

  useEffect(() => {
    filter();
  }, [activeFilter, searchQuery, items]);

  useEffect(() => {
    if (selectedImage?.item?.props?.name) {
      setOpenCollapse(selectedImage.item.props.name);
    }
  }, [selectedImage]);

  return (
    <div className={styles["drawer-container"]}>
      {createdAt && (
        <div className={styles.createdAt}>
          <span className={styles.createdAtLabel}>Report created</span>
          <span className={styles.createdAtValue}>{createdAt}</span>
        </div>
      )}

      <div className={styles["tabs-container"]}>
        <div className={styles["menu-container"]}>
          <div
            className={classNames({
              [styles.tab]: true,
              [styles.active]: activeFilter === "all",
            })}
            onClick={() => onActiveFilterChange("all")}
          >
            All
          </div>
          <div
            className={classNames({
              [styles.tab]: true,
              [styles.active]: activeFilter === "failed",
            })}
            onClick={() => onActiveFilterChange("failed")}
          >
            Failed: {counts.failed}
          </div>
        </div>
      </div>

      <div className={styles.tools}>
        <div className={styles.searchField}>
          <MagnifyingGlass
            size={15}
            weight="bold"
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Search snapshots..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={12} weight="bold" />
            </button>
          )}
        </div>

        <div className={styles.reviewActions}>
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
            <span>Mark all</span>
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
            <span>Clear</span>
          </button>
        </div>
      </div>

      {activeFilter === "failed" && filteredItems.length === 0 && (
        <div className={styles["empty-failed"]}>
          <div className={styles["empty-failed-title"]}>No failures</div>
          <div className={styles["empty-failed-subtitle"]}>
            Showing passed snapshots
          </div>
          {items.map((item) =>
            item.tests.flatMap((test) =>
              test.snapshots.slice(0, 3).map((snapshot) => (
                <button
                  key={`${item.props.name}-${snapshot.props.name}`}
                  type="button"
                  className={styles["empty-failed-item"]}
                  onClick={() => {
                    onActiveFilterChange("all");
                    imageClickHandler(snapshot, item, test);
                  }}
                >
                  <img
                    src={snapshot.resolutions[0].images.base}
                    alt={snapshot.props.name}
                  />
                  <span>{snapshot.props.name}</span>
                </button>
              ))
            )
          )}
        </div>
      )}

      {filteredItems.length > 0 &&
        filteredItems.map((item) => (
          <Collapse
            key={item.props.name}
            title={item.props.name}
            isOpen={openCollapse === item.props.name}
            counts={getCollapseCounts(item.tests)}
            onToggle={() => {
              setOpenCollapse((prevOpen) =>
                prevOpen === item.props.name ? null : item.props.name
              );
            }}
          >
            {item.tests.map((test, testIndex) => {
              const isTestLast = testIndex === item.tests.length - 1;

              return (
                <div
                  className={styles["collapse-container"]}
                  key={test.props.name}
                >
                  {test.snapshots.map((snapshot) => {
                    const failed = isFailedSnapshot(snapshot.resolutions);
                    const reviewed = isSnapshotReviewed(
                      {
                        item,
                        test,
                        snapshot,
                        resolution: snapshot.resolutions[0],
                      },
                      reviewedKeys
                    );

                    return (
                      <SnapshotItem
                        key={snapshot.props.name}
                        image={snapshot.resolutions[0].images.base}
                        snapshotName={snapshot.props.name}
                        isActive={
                          selectedImage?.snapshot?.props?.name ===
                            snapshot.props.name &&
                          selectedImage?.item?.props?.name === item.props.name
                        }
                        onClick={() => imageClickHandler(snapshot, item, test)}
                        variant={failed ? "fail" : "pass"}
                        reviewed={reviewed}
                        resolutions={snapshot.resolutions.map((resolution) => ({
                          size: resolution.size,
                          reviewed: isResolutionReviewed(
                            {
                              item,
                              test,
                              snapshot,
                              resolution,
                            },
                            reviewedKeys
                          ),
                        }))}
                      />
                    );
                  })}
                  {!isTestLast && <div className={styles["line-break"]} />}
                </div>
              );
            })}
          </Collapse>
        ))}
    </div>
  );
}

function getCounts(sourceItems: Item[]) {
  let failed = 0;
  let passed = 0;

  sourceItems.forEach((item) => {
    item.tests.forEach((test) => {
      test.snapshots.forEach((snapshot) => {
        snapshot.resolutions.forEach((resolution) => {
          if (isFailedResolution(resolution)) {
            failed += 1;
          } else {
            passed += 1;
          }
        });
      });
    });
  });

  return { failed, passed, all: failed + passed };
}

function getCollapseCounts(tests: Test[]) {
  let failed = 0;
  let passed = 0;

  tests.forEach((test) => {
    test.snapshots.forEach((snapshot) => {
      snapshot.resolutions.forEach((resolution) => {
        if (isFailedResolution(resolution)) {
          failed += 1;
        } else {
          passed += 1;
        }
      });
    });
  });

  return { failed, passed };
}
