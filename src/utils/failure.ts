import { Resolution } from "../types/ReporterTypes";

export function isFailedResolution(resolution?: Resolution | null): boolean {
  return Boolean(
    resolution?.extraData &&
      Object.prototype.hasOwnProperty.call(
        resolution.extraData,
        "mismatchedPixels"
      )
  );
}

export function isFailedSnapshot(resolutions: Resolution[] = []): boolean {
  return resolutions.some(isFailedResolution);
}
