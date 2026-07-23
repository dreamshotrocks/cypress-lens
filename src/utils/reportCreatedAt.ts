import { Item } from "../types/ReporterTypes";

declare global {
  // Injected by the Cypress Lens reporter into data.js
  // eslint-disable-next-line no-var
  var reportCreatedAt: string | undefined;
}

function parseReportDate(value: string): number {
  // Expected format: "23/7/2026 15:28"
  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/
  );
  if (!match) {
    return Number.NaN;
  }

  const [, day, month, year, hours, minutes] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  ).getTime();
}

function latestSnapshotDate(items: Item[]): string | null {
  let latestValue: string | null = null;
  let latestTime = Number.NEGATIVE_INFINITY;

  items.forEach((item) => {
    item.tests.forEach((test) => {
      test.snapshots.forEach((snapshot) => {
        snapshot.resolutions.forEach((resolution) => {
          const date = resolution.extraData?.date;
          if (typeof date !== "string") {
            return;
          }

          const time = parseReportDate(date);
          if (!Number.isNaN(time) && time >= latestTime) {
            latestTime = time;
            latestValue = date;
          }
        });
      });
    });
  });

  return latestValue;
}

export function getReportCreatedAt(items: Item[]): string | null {
  if (typeof reportCreatedAt === "string" && reportCreatedAt.trim()) {
    return reportCreatedAt;
  }

  return latestSnapshotDate(items);
}
