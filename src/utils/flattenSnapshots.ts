import { Item, SelectedImage } from "../types/ReporterTypes";

export function flattenSnapshots(items: Item[]): SelectedImage[] {
  const entries: SelectedImage[] = [];

  items.forEach((item) => {
    item.tests.forEach((test) => {
      test.snapshots.forEach((snapshot) => {
        snapshot.resolutions.forEach((resolution) => {
          entries.push({ snapshot, item, test, resolution });
        });
      });
    });
  });

  return entries;
}

export function findSnapshotIndex(
  snapshots: SelectedImage[],
  selected: SelectedImage | null
): number {
  if (!selected) {
    return -1;
  }

  return snapshots.findIndex(
    (entry) =>
      entry.snapshot.props.name === selected.snapshot.props.name &&
      entry.test.props.name === selected.test.props.name &&
      entry.item.props.name === selected.item.props.name &&
      entry.resolution.size === selected.resolution.size
  );
}

/** Keep selection inside the visible All/Failed/search list. */
export function resolveSelectionInList(
  snapshots: SelectedImage[],
  selected: SelectedImage | null
): SelectedImage | null {
  if (snapshots.length === 0) {
    return null;
  }

  if (!selected) {
    return snapshots[0];
  }

  const exactIndex = findSnapshotIndex(snapshots, selected);
  if (exactIndex >= 0) {
    return snapshots[exactIndex];
  }

  const sameSnapshot = snapshots.find(
    (entry) =>
      entry.snapshot.props.name === selected.snapshot.props.name &&
      entry.test.props.name === selected.test.props.name &&
      entry.item.props.name === selected.item.props.name
  );

  return sameSnapshot ?? snapshots[0];
}
