import {
  ArrowLeft,
  ArrowRight,
  ArrowsInLineVertical,
  Check,
  ExcludeSquare,
  Image,
  SelectionInverse,
  SquareHalf,
} from "@phosphor-icons/react";
import styles from "./ImageTabs.module.scss";
import { useState } from "react";
import Baseline from "./imageViews/Baseline";
import SideBySide from "./imageViews/SideBySideView";
import Slider from "./imageViews/Slider";
import Overlay from "./imageViews/Overlay";
import {
  Resolution,
  SelectedImage,
  Snapshot,
  Test,
} from "../types/ReporterTypes";
import classNames from "classnames";
import {
  isFailedResolution,
  isFailedSnapshot,
} from "../utils/failure";
import { isResolutionReviewed } from "../utils/reviewedSnapshots";

interface ImageTabsProps {
  test: Test;
  snapshot: Snapshot;
  activeResolution: Resolution;
  reviewedKeys?: Set<string>;
  selectedEntry?: SelectedImage;
  onResolutionChange: (resolution: Resolution) => void;
  currentIndex: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  showNavigation?: boolean;
}

const VIEW_TABS = [
  {
    tabIcon: Image,
    tabText: "Baseline",
    shortText: "Baseline",
    id: "tab1",
  },
  {
    tabIcon: SquareHalf,
    tabText: "Side By Side",
    shortText: "Side by side",
    id: "tab2",
  },
  {
    tabIcon: ExcludeSquare,
    tabText: "Difference",
    shortText: "Diff",
    id: "tab3",
  },
  {
    tabIcon: ArrowsInLineVertical,
    tabText: "Slider",
    shortText: "Slider",
    id: "tab4",
  },
  {
    tabIcon: SelectionInverse,
    tabText: "Overlay",
    shortText: "Overlay",
    id: "tab5",
  },
] as const;

export default function ImageTabs({
  test,
  snapshot,
  activeResolution,
  reviewedKeys,
  selectedEntry,
  onResolutionChange,
  currentIndex,
  totalCount,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  showNavigation = true,
}: ImageTabsProps) {
  const snapshotHasFailure = isFailedSnapshot(snapshot.resolutions);
  const [activeTabId, setActiveTabId] = useState<string>(VIEW_TABS[0].id);
  const activeTab =
    VIEW_TABS.find((tab) => tab.id === activeTabId) ?? VIEW_TABS[0];
  const activeView = snapshotHasFailure ? activeTab.tabText : "Baseline";

  return (
    <>
      <div className={styles["tabs-container"]}>
        <div className={styles.toolbar}>
          {snapshotHasFailure && (
            <div className={styles.toolbarGroup}>
              <span className={styles.groupLabel}>View</span>
              <div className={styles.viewTabs} role="tablist">
                {VIEW_TABS.map((tab) => {
                  const Icon = tab.tabIcon;
                  const isActive = activeTabId === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={classNames(styles.viewTab, {
                        [styles.viewTabActive]: isActive,
                      })}
                      onClick={() => setActiveTabId(tab.id)}
                      title={tab.tabText}
                    >
                      <Icon size={15} weight={isActive ? "fill" : "regular"} />
                      <span>{tab.shortText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeResolution.size && (
            <div className={styles.toolbarGroup}>
              <span className={styles.groupLabel}>Resolution</span>
              <div className={styles.resolutionTabs}>
                {snapshot?.resolutions.map((resolution, index) => {
                  const resolutionFailed = isFailedResolution(resolution);
                  const resolutionReviewed =
                    selectedEntry && reviewedKeys
                      ? isResolutionReviewed(
                          { ...selectedEntry, resolution },
                          reviewedKeys
                        )
                      : false;
                  const isActive = activeResolution.size === resolution.size;

                  return (
                    <button
                      key={index}
                      type="button"
                      className={classNames(styles.resolutionTab, {
                        [styles.resolutionActive]: isActive,
                        [styles.resolutionFailed]: resolutionFailed,
                        [styles.resolutionPassed]: !resolutionFailed,
                        [styles.resolutionReviewed]: resolutionReviewed,
                      })}
                      onClick={() => onResolutionChange(resolution)}
                      title={
                        resolutionReviewed
                          ? `${resolution.size} · reviewed`
                          : resolutionFailed
                            ? `${resolution.size} · failed`
                            : `${resolution.size} · passed`
                      }
                    >
                      {resolutionReviewed ? (
                        <Check size={12} weight="bold" />
                      ) : null}
                      <span>{resolution.size}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={styles["tabs"]}>
          {activeView === "Baseline" && (
            <Baseline src={activeResolution.images.base} />
          )}
          {activeView === "Side By Side" && (
            <SideBySide snapshotResolution={activeResolution} />
          )}
          {activeView === "Difference" && (
            <Baseline src={activeResolution.images.diff} />
          )}
          {activeView === "Slider" && (
            <Slider snapshotResolution={activeResolution} />
          )}
          {activeView === "Overlay" && (
            <Overlay snapshotResolution={activeResolution} />
          )}
        </div>
      </div>
      {showNavigation && (
        <div className={styles["navigation-controls"]}>
          <button
            type="button"
            className={styles["nav-button"]}
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous snapshot"
            title="Previous snapshot (←)"
          >
            <ArrowLeft size={16} weight="bold" />
            Previous
            <span className={styles["shortcut-hint"]}>←</span>
          </button>

          <div className={styles["badge-container"]}>
            <div className={styles.text}>
              {snapshot?.props.name} - {activeResolution.extraData.date}
            </div>
            {totalCount > 0 && currentIndex >= 0 && (
              <div className={styles.counter}>
                {currentIndex + 1} / {totalCount}
                {activeResolution.size ? ` · ${activeResolution.size}` : ""}
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles["nav-button"]}
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next snapshot"
            title="Next snapshot (→)"
          >
            Next
            <ArrowRight size={16} weight="bold" />
            <span className={styles["shortcut-hint"]}>→</span>
          </button>
        </div>
      )}
    </>
  );
}
