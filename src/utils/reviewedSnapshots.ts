import { Item, SelectedImage } from "../types/ReporterTypes";
import { isFailedResolution } from "./failure";
import { flattenSnapshots } from "./flattenSnapshots";

const STORAGE_PREFIX = "cypress-lens:reviewed:";

export function getResolutionReviewKey(entry: SelectedImage): string {
  return [
    entry.item.props.name,
    entry.test.props.name,
    entry.snapshot.props.name,
    entry.resolution.size ?? "default",
  ].join("::");
}

export function getReportStorageKey(reportId: string | null): string {
  return `${STORAGE_PREFIX}${reportId || "default"}`;
}

export function loadReviewedKeys(reportId: string | null): Set<string> {
  try {
    const raw = localStorage.getItem(getReportStorageKey(reportId));
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((value) => typeof value === "string"));
  } catch {
    return new Set();
  }
}

export function saveReviewedKeys(
  reportId: string | null,
  keys: Set<string>
): void {
  localStorage.setItem(
    getReportStorageKey(reportId),
    JSON.stringify(Array.from(keys))
  );
}

export function clearReviewedKeys(reportId: string | null): Set<string> {
  localStorage.removeItem(getReportStorageKey(reportId));
  return new Set();
}

export function markResolutionReviewed(
  reportId: string | null,
  entry: SelectedImage,
  reviewed: boolean
): Set<string> {
  const keys = loadReviewedKeys(reportId);
  const key = getResolutionReviewKey(entry);

  if (reviewed) {
    keys.add(key);
  } else {
    keys.delete(key);
  }

  saveReviewedKeys(reportId, keys);
  return keys;
}

export function markAllResolutionsReviewed(
  reportId: string | null,
  items: Item[]
): Set<string> {
  const keys = new Set(
    flattenSnapshots(items).map((entry) => getResolutionReviewKey(entry))
  );
  saveReviewedKeys(reportId, keys);
  return keys;
}

export function areAllResolutionsReviewed(
  items: Item[],
  reviewedKeys: Set<string>
): boolean {
  const entries = flattenSnapshots(items);
  if (entries.length === 0) {
    return false;
  }

  return entries.every((entry) =>
    reviewedKeys.has(getResolutionReviewKey(entry))
  );
}

export function getFailedResolutionEntries(items: Item[]): SelectedImage[] {
  return flattenSnapshots(items).filter((entry) =>
    isFailedResolution(entry.resolution)
  );
}

export function areAllFailedResolutionsReviewed(
  items: Item[],
  reviewedKeys: Set<string>
): boolean {
  const failedEntries = getFailedResolutionEntries(items);
  if (failedEntries.length === 0) {
    return false;
  }

  return failedEntries.every((entry) =>
    reviewedKeys.has(getResolutionReviewKey(entry))
  );
}

export function isResolutionReviewed(
  entry: SelectedImage,
  reviewedKeys: Set<string>
): boolean {
  return reviewedKeys.has(getResolutionReviewKey(entry));
}

/** Snapshot is reviewed only when every resolution has been reviewed. */
export function isSnapshotReviewed(
  entry: SelectedImage,
  reviewedKeys: Set<string>
): boolean {
  const resolutions = entry.snapshot.resolutions;
  if (resolutions.length === 0) {
    return false;
  }

  return resolutions.every((resolution) =>
    reviewedKeys.has(
      getResolutionReviewKey({
        ...entry,
        resolution,
      })
    )
  );
}
