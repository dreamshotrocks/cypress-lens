/**
 * Report run id from URLs like:
 * /reports/automation-apps-penguin/235346/visual-report/
 */
export function getReportIdFromLocation(
  pathname: string = typeof window !== "undefined" ? window.location.pathname : ""
): string | null {
  const visualReportMatch = pathname.match(
    /\/reports\/[^/]+\/([^/]+)\/visual-report\/?/i
  );
  if (visualReportMatch?.[1]) {
    return decodeURIComponent(visualReportMatch[1]);
  }

  // Fallback: /.../<numeric-id>/...
  const numericMatch = pathname.match(/\/(\d{3,})(?:\/|$)/);
  if (numericMatch?.[1]) {
    return numericMatch[1];
  }

  return null;
}
