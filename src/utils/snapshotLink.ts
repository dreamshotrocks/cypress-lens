import { Item, SelectedImage } from "../types/ReporterTypes";
import { flattenSnapshots } from "./flattenSnapshots";
import { getResolutionReviewKey } from "./reviewedSnapshots";

export const SNAPSHOT_QUERY_PARAM = "snapshot";
const HASH_LENGTH = 7;

/** Deterministic short id from the full snapshot identity. */
export function getSnapshotLinkKey(entry: SelectedImage): string {
  return hashString(getResolutionReviewKey(entry), HASH_LENGTH);
}

function hashString(input: string, length: number): string {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  // Mix into a second 32-bit value so short ids stay well distributed
  let hash2 = 0x811c9dc5;
  for (let i = input.length - 1; i >= 0; i--) {
    hash2 ^= input.charCodeAt(i);
    hash2 = Math.imul(hash2, 0x01000193);
  }

  const combined =
    (hash >>> 0).toString(36) + (hash2 >>> 0).toString(36);

  return combined.padStart(length, "0").slice(0, length);
}

export function parseSnapshotLinkKey(
  search: string = typeof window !== "undefined" ? window.location.search : ""
): string | null {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : search ? `?${search}` : ""
  );
  const value = params.get(SNAPSHOT_QUERY_PARAM);
  return value && value.trim() ? value.trim().toLowerCase() : null;
}

export function buildSnapshotShareUrl(
  entry: SelectedImage,
  location: Pick<Location, "origin" | "pathname" | "search"> = window.location
): string {
  const url = new URL(location.pathname + location.search, location.origin);
  url.searchParams.set(SNAPSHOT_QUERY_PARAM, getSnapshotLinkKey(entry));
  return url.toString();
}

export function findEntryByLinkKey(
  items: Item[],
  key: string | null
): SelectedImage | null {
  if (!key) {
    return null;
  }

  const normalized = key.toLowerCase();
  return (
    flattenSnapshots(items).find(
      (entry) => getSnapshotLinkKey(entry) === normalized
    ) ?? null
  );
}

export function syncSnapshotQueryParam(entry: SelectedImage | null): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (!entry) {
    url.searchParams.delete(SNAPSHOT_QUERY_PARAM);
  } else {
    url.searchParams.set(SNAPSHOT_QUERY_PARAM, getSnapshotLinkKey(entry));
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(window.history.state, "", next);
  }
}
