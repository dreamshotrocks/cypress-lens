import { useState, useEffect, useRef } from "react";
import { Check, Link2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import EmptyFailedState from "./components/EmptyFailedState";
import ImageTabs from "./components/ImageTabs";
import Navigation from "./components/Navigation";
import ReviewComplete from "./components/ReviewComplete";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { TooltipProvider } from "./components/ui/tooltip";
import { Item, SelectedImage } from "./types/ReporterTypes";
import {
  findSnapshotIndex,
  flattenSnapshots,
  resolveSelectionInList,
} from "./utils/flattenSnapshots";
import { isFailedResolution } from "./utils/failure";
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
import {
  buildSnapshotShareUrl,
  findEntryByLinkKey,
  parseSnapshotLinkKey,
  syncSnapshotQueryParam,
} from "./utils/snapshotLink";
import { cn } from "./lib/utils";

function App() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [showReviewComplete, setShowReviewComplete] = useState(false);
  const [reviewedKeys, setReviewedKeys] = useState<Set<string>>(new Set());
  const [navHidden, setNavHidden] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const reportId = getReportIdFromLocation();
  const snapshotList = flattenSnapshots(filteredItems);
  const failedEntries = items ? getFailedResolutionEntries(items) : [];
  const passedPreviews = items ? flattenSnapshots(items).slice(0, 8) : [];
  const currentIndex = findSnapshotIndex(snapshotList, selectedImage);
  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < snapshotList.length - 1;
  const selectedCanBeReviewed = selectedImage
    ? isFailedResolution(selectedImage.resolution)
    : false;
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
      syncSnapshotQueryParam(null);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTop = 0;
    setSelectedImage(entry);
    syncSnapshotQueryParam(entry);
  };

  const selectPassedPreview = (entry: SelectedImage) => {
    setActiveFilter("all");
    selectSnapshot(entry);
  };

  const shareSnapshot = async () => {
    if (!selectedImage) {
      return;
    }

    const url = buildSnapshotShareUrl(selectedImage);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      if (shareCopiedTimeoutRef.current) {
        clearTimeout(shareCopiedTimeoutRef.current);
      }
      shareCopiedTimeoutRef.current = setTimeout(() => {
        setShareCopied(false);
        shareCopiedTimeoutRef.current = null;
      }, 1500);
    } catch (error) {
      console.error("Failed to copy snapshot link", error);
    }
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
    if (!isFailedResolution(entry.resolution)) {
      return;
    }

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

    const linked = findEntryByLinkKey(items, parseSnapshotLinkKey());
    if (linked) {
      setActiveFilter("all");
      setSelectedImage(linked);
      syncSnapshotQueryParam(linked);
      return;
    }

    const first = flattenSnapshots(items)[0];
    if (first) {
      setSelectedImage(first);
      syncSnapshotQueryParam(first);
    }
  }, [items]);

  useEffect(() => {
    setSelectedImage((current) => {
      if (snapshotList.length === 0) {
        if (activeFilter === "failed") {
          syncSnapshotQueryParam(null);
          return null;
        }
        return current;
      }
      const next = resolveSelectionInList(snapshotList, current);
      syncSnapshotQueryParam(next);
      return next;
    });
  }, [filteredItems, activeFilter]);

  useEffect(() => {
    return () => {
      if (shareCopiedTimeoutRef.current) {
        clearTimeout(shareCopiedTimeoutRef.current);
      }
    };
  }, []);

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
      } else if (
        (event.key === "b" || event.key === "B") &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setNavHidden((hidden) => !hidden);
      } else if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        const {
          selectedImage: entry,
          reviewedKeys: keys,
          reportId: id,
          items: currentItems,
        } = navigationRef.current;
        if (!entry || !isFailedResolution(entry.resolution)) {
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
      <TooltipProvider delayDuration={200}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <ReviewComplete
            failedEntries={failedEntries}
            onBackToGallery={() => setShowReviewComplete(false)}
          />
        </div>
      </TooltipProvider>
    );
  }

  const navToggleButton = (
    <Button
      type="button"
      variant="outline"
      onClick={() => setNavHidden((hidden) => !hidden)}
      title={navHidden ? "Show navigation (B)" : "Hide navigation (B)"}
    >
      {navHidden ? (
        <PanelLeftOpen className="size-4" />
      ) : (
        <PanelLeftClose className="size-4" />
      )}
      {navHidden ? "Show nav" : "Hide nav"}
      <Badge variant="muted" className="ml-0.5 font-mono text-[10px]">
        B
      </Badge>
    </Button>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <aside
          className={cn(
            "flex h-full w-full max-w-[320px] shrink-0 flex-col overflow-hidden border-r border-border bg-card",
            navHidden && "hidden"
          )}
        >
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
        </aside>

        {selectedImage ? (
          <main className="flex h-screen min-w-0 flex-1 flex-col overflow-auto">
            <div className="flex items-center justify-end gap-2 px-6 pt-5 md:px-10">
              {navToggleButton}
              <Button
                type="button"
                variant="outline"
                onClick={shareSnapshot}
                title="Copy link to this snapshot"
              >
                <Link2 className="size-4" />
                {shareCopied ? "Copied" : "Share Snapshot"}
              </Button>
              {selectedCanBeReviewed && (
                <Button
                  type="button"
                  variant={selectedReviewed ? "success" : "outline"}
                  onClick={() => toggleReviewed(selectedImage)}
                  title={
                    selectedReviewed
                      ? `Unmark ${selectedImage.resolution.size ?? "resolution"} reviewed (Space)`
                      : `Mark ${selectedImage.resolution.size ?? "resolution"} reviewed (Space)`
                  }
                  className={cn(selectedReviewed && "border-success/50")}
                >
                  <Check className="size-4" />
                  {selectedReviewed ? "Reviewed" : "Mark reviewed"}
                  <Badge variant="muted" className="ml-0.5 font-mono text-[10px]">
                    Space
                  </Badge>
                </Button>
              )}
            </div>
            <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-6 md:px-10 md:pb-10">
              <ImageTabs
                test={selectedImage.test}
                snapshot={selectedImage.snapshot}
                activeResolution={selectedImage.resolution}
                reviewedKeys={reviewedKeys}
                selectedEntry={selectedImage}
                onResolutionChange={(resolution) => {
                  const next = { ...selectedImage, resolution };
                  setSelectedImage(next);
                  syncSnapshotQueryParam(next);
                }}
                currentIndex={currentIndex}
                totalCount={snapshotList.length}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                onPrevious={goToPrevious}
                onNext={goToNext}
              />
            </div>
          </main>
        ) : activeFilter === "failed" ? (
          <main className="flex h-screen min-w-0 flex-1 flex-col overflow-auto">
            <div className="flex items-center justify-end px-6 pt-5 md:px-10">
              {navToggleButton}
            </div>
            <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 md:px-12">
              <EmptyFailedState
                previews={passedPreviews}
                onSelect={selectPassedPreview}
              />
            </div>
          </main>
        ) : null}
      </div>
    </TooltipProvider>
  );
}

export default App;
