import { Item } from "../types/ReporterTypes";

/** Report created time = date of the first snapshot resolution in the data. */
export function getReportCreatedAt(items: Item[]): string | null {
  for (const item of items) {
    for (const test of item.tests) {
      for (const snapshot of test.snapshots) {
        for (const resolution of snapshot.resolutions) {
          const date = resolution.extraData?.date;
          if (typeof date === "string" && date.trim()) {
            return date;
          }
        }
      }
    }
  }

  return null;
}
