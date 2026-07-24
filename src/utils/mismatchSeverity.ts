import { Resolution } from "../types/ReporterTypes";
import { isFailedResolution } from "./failure";

export type MismatchSeverityId = "s" | "m" | "l" | "xl";

export type MismatchSeverityBucket = {
  id: MismatchSeverityId;
  label: string;
  shortLabel: string;
  min: number;
  max: number;
};

export const MISMATCH_SEVERITY_BUCKETS: readonly MismatchSeverityBucket[] = [
  {
    id: "s",
    label: "1 – 1k px",
    shortLabel: "1–1k",
    min: 1,
    max: 1_000,
  },
  {
    id: "m",
    label: "1k – 10k px",
    shortLabel: "1k–10k",
    min: 1_000,
    max: 10_000,
  },
  {
    id: "l",
    label: "10k – 100k px",
    shortLabel: "10k–100k",
    min: 10_000,
    max: 100_000,
  },
  {
    id: "xl",
    label: "100k+ px",
    shortLabel: "100k+",
    min: 100_000,
    max: Number.POSITIVE_INFINITY,
  },
] as const;

export function getMismatchedPixels(resolution?: Resolution | null): number {
  const value = Number(resolution?.extraData?.mismatchedPixels ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function getMismatchSeverityId(
  resolution?: Resolution | null
): MismatchSeverityId | null {
  if (!isFailedResolution(resolution)) {
    return null;
  }

  const mismatched = getMismatchedPixels(resolution);
  if (mismatched <= 0) {
    return null;
  }

  const bucket = MISMATCH_SEVERITY_BUCKETS.find(
    (item) => mismatched >= item.min && mismatched < item.max
  );
  return bucket?.id ?? null;
}

export function resolutionMatchesSeverity(
  resolution: Resolution,
  selected: ReadonlySet<MismatchSeverityId>
): boolean {
  if (selected.size === 0) {
    return true;
  }

  const severityId = getMismatchSeverityId(resolution);
  return severityId !== null && selected.has(severityId);
}
