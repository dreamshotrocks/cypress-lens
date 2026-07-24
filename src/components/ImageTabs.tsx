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
import ZoomableViewport from "./ZoomableViewport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
}

const VIEW_TABS = [
  { id: "tab1", tabText: "Baseline", shortText: "Baseline", Icon: ImageIcon },
  { id: "tab2", tabText: "Side By Side", shortText: "Side by side", Icon: Columns2 },
  { id: "tab3", tabText: "Difference", shortText: "Diff", Icon: Diff },
  { id: "tab4", tabText: "Slider", shortText: "Slider", Icon: SlidersHorizontal },
  { id: "tab5", tabText: "Overlay", shortText: "Overlay", Icon: Layers },
] as const;

export default function ImageTabs({
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

  useEffect(() => {
    if (!snapshotHasFailure) {
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
  }, [snapshotHasFailure]);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-wrap items-end justify-center gap-4">
          {snapshotHasFailure && (
            <div className="flex min-w-0 flex-col gap-2">
              <span className="flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                View
                <Badge variant="muted" className="font-mono text-[10px] normal-case tracking-normal">
                  V
                </Badge>
              </span>
              <ToggleGroup
                type="single"
                value={activeTabId}
                onValueChange={(value) => {
                  if (value) setActiveTabId(value);
                }}
                variant="outline"
                size="sm"
                className="flex flex-wrap justify-start rounded-xl border border-border bg-card p-1"
              >
                {VIEW_TABS.map((tab) => (
                  <ToggleGroupItem
                    key={tab.id}
                    value={tab.id}
                    title={tab.tabText}
                    className={cn(
                      "gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
            <div className="flex min-w-0 flex-col gap-2">
              <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Resolution
              </span>
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-card p-1.5">
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
                        "h-8 gap-1 font-mono text-xs",
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

        {activeView === "Overlay" ? (
          <Overlay
            snapshotResolution={activeResolution}
            bordered={false}
          />
        ) : activeView === "Side By Side" ? (
          <SideBySide snapshotResolution={activeResolution} />
        ) : (
          <ZoomableViewport
            resetKey={[
              snapshot.props.name,
              activeResolution.size ?? "default",
              activeView,
            ].join("::")}
          >
            {activeView === "Baseline" && (
              <Baseline src={activeResolution.images.base} bordered={false} />
            )}
            {activeView === "Difference" && (
              <Baseline src={activeResolution.images.diff} bordered={false} />
            )}
            {activeView === "Slider" && (
              <Slider
                snapshotResolution={activeResolution}
                bordered={false}
              />
            )}
          </ZoomableViewport>
        )}
      </div>

      {showNavigation && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious}
            title="Previous snapshot"
            aria-label="Previous snapshot"
            className="min-w-[132px]"
          >
            <ArrowLeft className="size-4" />
            Previous
            <Badge variant="muted" className="font-mono text-[10px]">
              <ArrowLeft className="size-3" aria-hidden="true" />
            </Badge>
          </Button>

          <Card className="min-w-[240px] px-5 py-3 text-center shadow-none">
            <div className="px-1 text-xs leading-relaxed text-foreground/80">
              {snapshot?.props.name} - {activeResolution.extraData.date}
            </div>
            {totalCount > 0 && currentIndex >= 0 && (
              <div className="mt-1.5 text-[11px] text-muted-foreground">
                {currentIndex + 1} / {totalCount}
                {activeResolution.size ? ` · ${activeResolution.size}` : ""}
              </div>
            )}
          </Card>

          <Button
            type="button"
            variant="outline"
            onClick={onNext}
            disabled={!hasNext}
            title="Next snapshot"
            aria-label="Next snapshot"
            className="min-w-[132px]"
          >
            Next
            <ArrowRight className="size-4" />
            <Badge variant="muted" className="font-mono text-[10px]">
              <ArrowRight className="size-3" aria-hidden="true" />
            </Badge>
          </Button>
        </div>
      )}
    </>
  );
}
