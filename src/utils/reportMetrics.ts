import { Item } from "../types/ReporterTypes";
import { isFailedResolution } from "./failure";
import { flattenSnapshots } from "./flattenSnapshots";
import {
  MISMATCH_SEVERITY_BUCKETS,
  getMismatchedPixels,
  getMismatchSeverityId,
} from "./mismatchSeverity";
import { isResolutionReviewed } from "./reviewedSnapshots";

export type NamedCount = {
  name: string;
  count: number;
};

export type ReportMetrics = {
  total: number;
  passed: number;
  failed: number;
  reviewedFailed: number;
  unreviewedFailed: number;
  reviewProgress: number;
  passRate: number;
  worstMismatch: number;
  suitesWithFailures: number;
  bySuite: NamedCount[];
  byResolution: NamedCount[];
  mismatchBuckets: NamedCount[];
};

export function computeReportMetrics(
  items: Item[],
  reviewedKeys: Set<string>
): ReportMetrics {
  const entries = flattenSnapshots(items);
  let passed = 0;
  let failed = 0;
  let reviewedFailed = 0;
  let worstMismatch = 0;

  const suiteFailed = new Map<string, number>();
  const resolutionFailed = new Map<string, number>();
  const bucketCounts = Object.fromEntries(
    MISMATCH_SEVERITY_BUCKETS.map((bucket) => [bucket.id, 0])
  ) as Record<string, number>;

  entries.forEach((entry) => {
    const suiteName = entry.item.props.name;
    const resolutionName = entry.resolution.size ?? "default";

    if (!isFailedResolution(entry.resolution)) {
      passed += 1;
      return;
    }

    failed += 1;
    suiteFailed.set(suiteName, (suiteFailed.get(suiteName) ?? 0) + 1);
    resolutionFailed.set(
      resolutionName,
      (resolutionFailed.get(resolutionName) ?? 0) + 1
    );

    if (isResolutionReviewed(entry, reviewedKeys)) {
      reviewedFailed += 1;
    }

    const mismatched = getMismatchedPixels(entry.resolution);
    if (mismatched > worstMismatch) {
      worstMismatch = mismatched;
    }

    const severityId = getMismatchSeverityId(entry.resolution);
    if (severityId) {
      bucketCounts[severityId] += 1;
    }
  });

  const total = passed + failed;
  const unreviewedFailed = Math.max(0, failed - reviewedFailed);

  const bySuite = Array.from(suiteFailed.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byResolution = Array.from(resolutionFailed.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const mismatchBuckets = MISMATCH_SEVERITY_BUCKETS.map((bucket) => ({
    name: bucket.label,
    count: bucketCounts[bucket.id],
  }));

  return {
    total,
    passed,
    failed,
    reviewedFailed,
    unreviewedFailed,
    reviewProgress: failed > 0 ? reviewedFailed / failed : 0,
    passRate: total > 0 ? passed / total : 0,
    worstMismatch,
    suitesWithFailures: bySuite.length,
    bySuite,
    byResolution,
    mismatchBuckets,
  };
}
