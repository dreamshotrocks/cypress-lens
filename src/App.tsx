import { useState, useEffect, useRef } from "react";
import { Check } from "@phosphor-icons/react";
import classNames from "classnames";
import styles from "./App.module.scss";
import ImageTabs from "./components/ImageTabs";
import Navigation from "./components/Navigation";
import ReviewComplete from "./components/ReviewComplete";
import { Item, SelectedImage } from "./types/ReporterTypes";
import {
  findSnapshotIndex,
  flattenSnapshots,
  resolveSelectionInList,
} from "./utils/flattenSnapshots";
import { getReportIdFromLocation } from "./utils/reportId";
import {
  areAllFailedResolutionsReviewed,
  clearReviewedKeys,
  getFailedResolutionEntries,
  isResolutionReviewed,
  loadReviewedKeys,
  markAllResolutionsReviewed,
  markResolutionReviewed,
} from "./utils/reviewedSnapshots";

function App() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [showReviewComplete, setShowReviewComplete] = useState(false);
  const [reviewedKeys, setReviewedKeys] = useState<Set<string>>(new Set());

  // e.g. 235346 from /reports/.../235346/visual-report/
  const reportId = getReportIdFromLocation();
  const snapshotList = flattenSnapshots(filteredItems);
  const failedEntries = items ? getFailedResolutionEntries(items) : [];
  const currentIndex = findSnapshotIndex(snapshotList, selectedImage);
  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < snapshotList.length - 1;
  const selectedReviewed = selectedImage
    ? isResolutionReviewed(selectedImage, reviewedKeys)
    : false;

  const navigationRef = useRef({
    snapshotList,
    currentIndex,
    selectedImage,
    reviewedKeys,
    reportId,
    items,
  });
  navigationRef.current = {
    snapshotList,
    currentIndex,
    selectedImage,
    reviewedKeys,
    reportId,
    items,
  };

  const maybeShowReviewComplete = (
    nextKeys: Set<string>,
    markedAsReviewed: boolean
  ) => {
    const currentItems = navigationRef.current.items;
    if (
      markedAsReviewed &&
      currentItems &&
      areAllFailedResolutionsReviewed(currentItems, nextKeys)
    ) {
      setShowReviewComplete(true);
    }
  };

  const selectSnapshot = (entry: SelectedImage | null) => {
    if (!entry) {
      setSelectedImage(null);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTop = 0;
    setSelectedImage(entry);
  };

  const goToPrevious = () => {
    const { snapshotList: list, currentIndex: index } = navigationRef.current;
    if (index > 0) {
      selectSnapshot(list[index - 1]);
    }
  };

  const goToNext = () => {
    const { snapshotList: list, currentIndex: index } = navigationRef.current;
    if (index >= 0 && index < list.length - 1) {
      selectSnapshot(list[index + 1]);
    }
  };

  const clearReportReviewData = () => {
    setReviewedKeys(clearReviewedKeys(reportId));
    setShowReviewComplete(false);
  };

  const markAllReviewed = () => {
    if (!items) {
      return;
    }
    const nextKeys = markAllResolutionsReviewed(reportId, items);
    setReviewedKeys(nextKeys);
    maybeShowReviewComplete(nextKeys, true);
  };

  const toggleReviewed = (entry: SelectedImage) => {
    const currentlyReviewed = isResolutionReviewed(entry, reviewedKeys);
    const nextKeys = markResolutionReviewed(
      reportId,
      entry,
      !currentlyReviewed
    );
    setReviewedKeys(new Set(nextKeys));
    maybeShowReviewComplete(nextKeys, !currentlyReviewed);
  };

  useEffect(() => {
    //@ts-ignore
    if (testData) {
      //@ts-ignore
      setItems(testData);
    } else {
      console.error("No test data found!");
    }
  }, []);

  useEffect(() => {
    setReviewedKeys(loadReviewedKeys(reportId));
  }, [reportId]);

  useEffect(() => {
    if (!items) {
      return;
    }

    const first = flattenSnapshots(items)[0];
    if (first) {
      setSelectedImage(first);
    }
  }, [items]);

  useEffect(() => {
    setSelectedImage((current) => {
      if (snapshotList.length === 0) {
        return activeFilter === "failed" ? null : current;
      }
      return resolveSelectionInList(snapshotList, current);
    });
  }, [filteredItems, activeFilter]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showReviewComplete) {
        if (event.key === "Escape") {
          event.preventDefault();
          setShowReviewComplete(false);
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        const {
          selectedImage: entry,
          reviewedKeys: keys,
          reportId: id,
          items: currentItems,
        } = navigationRef.current;
        if (!entry) {
          return;
        }
        const currentlyReviewed = isResolutionReviewed(entry, keys);
        const nextKeys = markResolutionReviewed(id, entry, !currentlyReviewed);
        setReviewedKeys(new Set(nextKeys));
        if (
          !currentlyReviewed &&
          currentItems &&
          areAllFailedResolutionsReviewed(currentItems, nextKeys)
        ) {
          setShowReviewComplete(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showReviewComplete]);

  if (!items) {
    return null;
  }

  if (showReviewComplete) {
    return (
      <div className={styles.app}>
        <ReviewComplete
          failedEntries={failedEntries}
          onBackToGallery={() => setShowReviewComplete(false)}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.navigation}>
        <Navigation
          items={items}
          selectedImage={selectedImage}
          reviewedKeys={reviewedKeys}
          activeFilter={activeFilter}
          onActiveFilterChange={setActiveFilter}
          onImageClick={selectSnapshot}
          onFilteredItemsChange={setFilteredItems}
          onMarkAllReviewed={markAllReviewed}
          onClearReviewData={clearReportReviewData}
        />
      </div>

      {selectedImage && (
        <div className={styles.container}>
          <div className={styles.detailTop}>
            <button
              type="button"
              className={classNames(styles.reviewedButton, {
                [styles.reviewedActive]: selectedReviewed,
              })}
              onClick={() => toggleReviewed(selectedImage)}
              title={
                selectedReviewed
                  ? `Unmark ${selectedImage.resolution.size ?? "resolution"} reviewed (Space)`
                  : `Mark ${selectedImage.resolution.size ?? "resolution"} reviewed (Space)`
              }
            >
              <Check size={16} weight="bold" />
              {selectedReviewed ? "Reviewed" : "Mark reviewed"}
              <span className={styles.shortcutHint}>Space</span>
            </button>
          </div>
          <div className={styles.inner}>
            <ImageTabs
              test={selectedImage.test}
              snapshot={selectedImage.snapshot}
              activeResolution={selectedImage.resolution}
              reviewedKeys={reviewedKeys}
              selectedEntry={selectedImage}
              onResolutionChange={(resolution) =>
                setSelectedImage({ ...selectedImage, resolution })
              }
              currentIndex={currentIndex}
              totalCount={snapshotList.length}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              onPrevious={goToPrevious}
              onNext={goToNext}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
