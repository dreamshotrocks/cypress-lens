import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns2,
  Diff,
  Image as ImageIcon,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import Baseline from "./imageViews/Baseline";
import SideBySide from "./imageViews/SideBySideView";
import Slider from "./imageViews/Slider";
import Overlay from "./imageViews/Overlay";
import { ZoomProvider, ZoomViewport } from "./ZoomableViewport";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Resolution,
  SelectedImage,
  Snapshot,
  Test,
} from "@/types/ReporterTypes";
import { isFailedResolution, isFailedSnapshot } from "@/utils/failure";
import { isResolutionReviewed } from "@/utils/reviewedSnapshots";
import { cn } from "@/lib/utils";

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
  keyboardEnabled?: boolean;
}

const TOOLBAR_LABEL_CLASS =
  "flex h-4 items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground";

const TOOLBAR_CONTROL_CLASS =
  "flex h-9 items-center rounded-xl border border-border bg-card p-1";

const VIEW_TABS = [
  { id: "tab1", tabText: "Baseline", shortText: "Baseline", Icon: ImageIcon },
  { id: "tab2", tabText: "Side By Side", shortText: "Side by side", Icon: Columns2 },
  { id: "tab3", tabText: "Difference", shortText: "Diff", Icon: Diff },
  { id: "tab4", tabText: "Slider", shortText: "Slider", Icon: SlidersHorizontal },
  { id: "tab5", tabText: "Overlay", shortText: "Overlay", Icon: Layers },
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
  keyboardEnabled = true,
}: ImageTabsProps) {
  const snapshotHasFailure = isFailedSnapshot(snapshot.resolutions);
  const [activeTabId, setActiveTabId] = useState<string>(VIEW_TABS[0].id);
  const activeTab =
    VIEW_TABS.find((tab) => tab.id === activeTabId) ?? VIEW_TABS[0];
  const activeView = snapshotHasFailure ? activeTab.tabText : "Baseline";
  const showZoomControls = activeView !== "Side By Side";
  const zoomResetKey = [
    snapshot.props.name,
    activeResolution.size ?? "default",
    activeView,
  ].join("::");

  useEffect(() => {
    if (!snapshotHasFailure || !keyboardEnabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "v" && event.key !== "V") {
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

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      event.preventDefault();
      setActiveTabId((currentId) => {
        const index = VIEW_TABS.findIndex((tab) => tab.id === currentId);
        const nextIndex = index < 0 ? 0 : (index + 1) % VIEW_TABS.length;
        return VIEW_TABS[nextIndex].id;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [snapshotHasFailure, keyboardEnabled]);

  const tlibId = snapshot.props.name?.trim() ?? "";
  const tlibTitle = test.props.name?.trim() ?? "";

  const toolbar = (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      {snapshotHasFailure && (
        <div className="flex min-w-0 flex-col gap-2">
          <span className={TOOLBAR_LABEL_CLASS}>View</span>
          <ToggleGroup
            type="single"
            value={activeTabId}
            onValueChange={(value) => {
              if (value) setActiveTabId(value);
            }}
            variant="outline"
            size="sm"
            className={cn(TOOLBAR_CONTROL_CLASS, "flex-wrap justify-start")}
          >
            {VIEW_TABS.map((tab) => (
              <ToggleGroupItem
                key={tab.id}
                value={tab.id}
                title={tab.tabText}
                className={cn(
                  "h-7 gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                )}
              >
                <tab.Icon className="size-3.5" />
                <span className="hidden sm:inline">{tab.shortText}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {activeResolution.size && (
        <div className="flex min-w-0 max-w-3xl flex-col items-center gap-2">
          {(tlibId || tlibTitle) && (
            <div className="flex flex-col items-center gap-1 px-1 text-center">
              {tlibId ? (
                <span className="font-mono text-xs font-semibold tracking-wide text-foreground">
                  {tlibId}
                </span>
              ) : null}
              {tlibTitle && tlibTitle !== tlibId ? (
                <p className="text-sm leading-snug text-foreground">
                  {tlibTitle}
                </p>
              ) : null}
            </div>
          )}
          <span className={TOOLBAR_LABEL_CLASS}>Resolution</span>
          <div className={cn(TOOLBAR_CONTROL_CLASS, "flex-wrap gap-1")}>
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
                <Button
                  key={index}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onResolutionChange(resolution)}
                  title={
                    resolutionReviewed
                      ? `${resolution.size} · reviewed`
                      : resolutionFailed
                        ? `${resolution.size} · failed`
                        : `${resolution.size} · passed`
                  }
                  className={cn(
                    "h-7 gap-1 font-mono text-xs",
                    !isActive &&
                      resolutionFailed &&
                      !resolutionReviewed &&
                      "text-destructive hover:text-destructive",
                    !isActive &&
                      (!resolutionFailed || resolutionReviewed) &&
                      "text-success hover:text-success",
                    isActive &&
                      resolutionFailed &&
                      !resolutionReviewed &&
                      "bg-destructive/80 hover:bg-destructive",
                    isActive &&
                      (!resolutionFailed || resolutionReviewed) &&
                      "bg-success text-success-foreground hover:bg-success/90"
                  )}
                >
                  {resolutionReviewed && <Check className="size-3" />}
                  {resolution.size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );

  const viewer =
    activeView === "Overlay" ? (
      <Overlay
        snapshotResolution={activeResolution}
        bordered={false}
        useExternalZoom
      />
    ) : activeView === "Side By Side" ? (
      <SideBySide snapshotResolution={activeResolution} />
    ) : (
      <ZoomViewport className="w-full" overlayControls>
        {activeView === "Baseline" && (
          <Baseline src={activeResolution.images.base} bordered={false} />
        )}
        {activeView === "Difference" && (
          <Baseline src={activeResolution.images.diff} bordered={false} />
        )}
        {activeView === "Slider" && (
          <Slider snapshotResolution={activeResolution} bordered={false} />
        )}
      </ZoomViewport>
    );

  return (
    <>
      {showZoomControls ? (
        <ZoomProvider resetKey={zoomResetKey}>
          <div className="flex w-full flex-col items-center gap-5">
            {toolbar}
            {viewer}
          </div>
        </ZoomProvider>
      ) : (
        <div className="flex w-full flex-col items-center gap-5">
          {toolbar}
          {viewer}
        </div>
      )}

      {showNavigation && (
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            title="Previous snapshot"
            aria-label="Previous snapshot"
            className="h-9 w-28 justify-center px-3"
          >
            <ArrowLeft className="size-4" />
            Previous
          </Button>
          {totalCount > 0 && currentIndex >= 0 ? (
            <div className="min-w-14 px-1 text-center font-mono text-sm tabular-nums text-muted-foreground">
              {currentIndex + 1} / {totalCount}
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            title="Next snapshot"
            aria-label="Next snapshot"
            className="h-9 w-28 justify-center px-3"
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}
