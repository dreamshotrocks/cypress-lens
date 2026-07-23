import { Item, SelectedImage } from "../types/ReporterTypes";
import { flattenSnapshots } from "./flattenSnapshots";
import { isFailedResolution, isFailedSnapshot } from "./failure";

export type StatusFilter = "all" | "failed" | "passed";

export function filterSnapshotEntries(
  items: Item[],
  statusFilter: StatusFilter,
  searchQuery: string
): SelectedImage[] {
  let entries = flattenSnapshots(items);

  if (statusFilter === "failed") {
    entries = entries.filter((entry) => isFailedResolution(entry.resolution));
  } else if (statusFilter === "passed") {
    entries = entries.filter((entry) => !isFailedResolution(entry.resolution));
  }

  const query = searchQuery.toLowerCase().trim();
  if (query) {
    entries = entries.filter(
      (entry) =>
        entry.snapshot.props.name.toLowerCase().includes(query) ||
        entry.item.props.name.toLowerCase().includes(query) ||
        entry.test.props.name.toLowerCase().includes(query) ||
        (entry.resolution.size || "").toLowerCase().includes(query)
    );
  }

  return entries;
}

/** One gallery card per snapshot (not per resolution). */
export function toGalleryCards(entries: SelectedImage[]): SelectedImage[] {
  const cardsByKey = new Map<string, SelectedImage>();

  entries.forEach((entry) => {
    const key = `${entry.item.props.name}::${entry.test.props.name}::${entry.snapshot.props.name}`;
    const existing = cardsByKey.get(key);

    if (!existing) {
      cardsByKey.set(key, {
        ...entry,
        snapshot: {
          ...entry.snapshot,
          resolutions: [entry.resolution],
        },
      });
      return;
    }

    const resolutions = [...existing.snapshot.resolutions];
    if (!resolutions.some((resolution) => resolution.size === entry.resolution.size)) {
      resolutions.push(entry.resolution);
    }

    const preferredResolution =
      resolutions.find(isFailedResolution) || resolutions[0];

    cardsByKey.set(key, {
      ...existing,
      resolution: preferredResolution,
      snapshot: {
        ...existing.snapshot,
        resolutions,
      },
    });
  });

  return Array.from(cardsByKey.values());
}

export interface SpecGroup {
  specName: string;
  cards: SelectedImage[];
  failedCount: number;
  passedCount: number;
}

export function groupCardsBySpec(cards: SelectedImage[]): SpecGroup[] {
  const groups: SpecGroup[] = [];

  cards.forEach((card) => {
    let group = groups.find((entry) => entry.specName === card.item.props.name);
    if (!group) {
      group = {
        specName: card.item.props.name,
        cards: [],
        failedCount: 0,
        passedCount: 0,
      };
      groups.push(group);
    }

    group.cards.push(card);
    if (isFailedSnapshot(card.snapshot.resolutions)) {
      group.failedCount += 1;
    } else {
      group.passedCount += 1;
    }
  });

  return groups;
}

export function getStatusCounts(items: Item[]) {
  const entries = flattenSnapshots(items);
  return {
    all: entries.length,
    failed: entries.filter((entry) => isFailedResolution(entry.resolution))
      .length,
    passed: entries.filter((entry) => !isFailedResolution(entry.resolution))
      .length,
  };
}
