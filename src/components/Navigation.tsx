import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCheck,
  ExternalLink,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Collapse from "./Collapse";
import ReportMetricsModal from "./ReportMetricsModal";
import SnapshotItem from "./SnapshotItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item, SelectedImage, Snapshot, Test } from "@/types/ReporterTypes";
import { isFailedResolution, isFailedSnapshot } from "@/utils/failure";
import {
  MISMATCH_SEVERITY_BUCKETS,
  MismatchSeverityId,
  resolutionMatchesSeverity,
} from "@/utils/mismatchSeverity";
import { getReportCreatedAt } from "@/utils/reportCreatedAt";
import { computeReportMetrics } from "@/utils/reportMetrics";
import {
  areAllFailedResolutionsReviewed,
  getFailedResolutionEntries,
  isResolutionReviewed,
  isSnapshotReviewed,
} from "@/utils/reviewedSnapshots";
import { cn } from "@/lib/utils";

const ALL_REPORTS_URL = "https://portal.octoplay.com/automation";

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
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [severityFilters, setSeverityFilters] = useState<
    Set<MismatchSeverityId>
  >(() => new Set());

  const createdAt = getReportCreatedAt(items);
  const hasReviewedData = reviewedKeys.size > 0;
  const failedCount = getFailedResolutionEntries(items).length;
  const allFailedReviewed = areAllFailedResolutionsReviewed(
    items,
    reviewedKeys
  );
  const counts = getCounts(items);
  const severityCounts = useMemo(() => {
    const metrics = computeReportMetrics(items, reviewedKeys);
    return Object.fromEntries(
      MISMATCH_SEVERITY_BUCKETS.map((bucket, index) => [
        bucket.id,
        metrics.mismatchBuckets[index]?.count ?? 0,
      ])
    ) as Record<MismatchSeverityId, number>;
  }, [items, reviewedKeys]);
  const hasSeverityFilter = severityFilters.size > 0;

  const toggleSeverityFilter = (id: MismatchSeverityId) => {
    setSeverityFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const imageClickHandler = (snapshot: Snapshot, item: Item, test: Test) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTop = 0;
    const resolution =
      snapshot.resolutions.find(
        (itemResolution) =>
          isFailedResolution(itemResolution) &&
          resolutionMatchesSeverity(itemResolution, severityFilters)
      ) ||
      snapshot.resolutions.find(isFailedResolution) ||
      snapshot.resolutions[0];
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

    if (activeFilter === "failed" || hasSeverityFilter) {
      baseItems = items
        .map((item) => {
          const failedTests = item.tests
            .map((test) => ({
              ...test,
              snapshots: test.snapshots
                .map((snapshot) => {
                  const validResolutions = snapshot.resolutions.filter(
                    (resolution) => {
                      if (!isFailedResolution(resolution)) {
                        return false;
                      }
                      return resolutionMatchesSeverity(
                        resolution,
                        severityFilters
                      );
                    }
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
  }, [activeFilter, searchQuery, items, severityFilters]);

  useEffect(() => {
    if (selectedImage?.item?.props?.name) {
      setOpenCollapse(selectedImage.item.props.name);
    }
  }, [selectedImage]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3.5 p-3.5 pb-3">
        <div className="flex items-start justify-between gap-2 px-0.5">
          {createdAt ? (
            <div className="min-w-0 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Report created
              </div>
              <div className="text-xs text-foreground/80">{createdAt}</div>
            </div>
          ) : (
            <div />
          )}
          <div className="flex shrink-0 flex-col gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <a
                href={ALL_REPORTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Open all automation reports"
              >
                <ArrowLeft className="size-3.5" />
                All reports
                <ExternalLink className="size-3 opacity-70" />
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMetricsOpen(true)}
              title="Open report metrics"
              className="text-xs"
            >
              <BarChart3 className="size-3.5" />
              Metrics
            </Button>
          </div>
        </div>

        <Tabs
          value={activeFilter}
          onValueChange={onActiveFilterChange}
          className="w-full"
        >
          <TabsList className="grid h-10 w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="failed">Failed: {counts.failed}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2 rounded-xl border border-border bg-background/50 p-3">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mismatch severity
            </div>
            {hasSeverityFilter && (
              <button
                type="button"
                onClick={() => setSeverityFilters(new Set())}
                className="text-[10px] font-medium text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {MISMATCH_SEVERITY_BUCKETS.map((bucket) => {
              const selected = severityFilters.has(bucket.id);
              const count = severityCounts[bucket.id] ?? 0;

              return (
                <Button
                  key={bucket.id}
                  type="button"
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  disabled={count === 0 && !selected}
                  onClick={() => toggleSeverityFilter(bucket.id)}
                  title={`Filter failed resolutions with ${bucket.label}`}
                  className={cn(
                    "h-8 justify-between px-2 text-[11px]",
                    selected && "border-primary"
                  )}
                >
                  <span>{bucket.shortLabel}</span>
                  <span
                    className={cn(
                      "tabular-nums",
                      selected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
          <p className="px-0.5 text-[10px] leading-relaxed text-muted-foreground">
            Filter by mismatched pixel amount.
          </p>
        </div>

        <div className="space-y-2.5 rounded-xl border border-border bg-background/50 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search snapshots..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9 bg-background pl-8 pr-8 text-xs"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={onMarkAllReviewed}
              disabled={failedCount === 0 || allFailedReviewed}
              title={
                failedCount === 0
                  ? "No failed resolutions to review"
                  : allFailedReviewed
                    ? "All failed resolutions are already reviewed"
                    : "Mark every failed resolution as reviewed"
              }
              className="text-xs"
            >
              <CheckCheck className="size-3.5" />
              Mark all
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearReviewData}
              disabled={!hasReviewedData}
              title={
                hasReviewedData
                  ? "Clear review progress for this report"
                  : "No review data saved for this report"
              }
              className="text-xs hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <Separator className="shrink-0" />

      <ReportMetricsModal
        open={metricsOpen}
        items={items}
        reviewedKeys={reviewedKeys}
        onClose={() => setMetricsOpen(false)}
      />

      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <div className="py-2">
          {(activeFilter === "failed" || hasSeverityFilter) &&
            filteredItems.length === 0 && (
            <div className="space-y-1 px-4 py-3">
              <div className="text-sm font-semibold">
                {hasSeverityFilter ? "No matches" : "No failures"}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasSeverityFilter
                  ? "No failed resolutions in the selected severity ranges"
                  : "Passed snapshot previews are shown on the right"}
              </div>
            </div>
          )}

          {filteredItems.map((item) => (
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
                  <div key={test.props.name} className="pb-1">
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
                          onClick={() =>
                            imageClickHandler(snapshot, item, test)
                          }
                          variant={failed ? "fail" : "pass"}
                          reviewed={reviewed}
                          resolutions={snapshot.resolutions.map(
                            (resolution) => ({
                              size: resolution.size,
                              failed: isFailedResolution(resolution),
                              reviewed: isResolutionReviewed(
                                {
                                  item,
                                  test,
                                  snapshot,
                                  resolution,
                                },
                                reviewedKeys
                              ),
                            })
                          )}
                        />
                      );
                    })}
                    {!isTestLast && <Separator className="mx-3 my-3 w-auto" />}
                  </div>
                );
              })}
            </Collapse>
          ))}
        </div>
      </ScrollArea>
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
