import { useState } from "react";
import TransparencySlider from "../TransparencySlider";
import ZoomableViewport, { ZoomViewport } from "../ZoomableViewport";
import { Resolution } from "@/types/ReporterTypes";
import { cn } from "@/lib/utils";

interface OverlayProps {
  snapshotResolution: Resolution;
  bordered?: boolean;
  /** Use when a parent already provides ZoomProvider + toolbar. */
  useExternalZoom?: boolean;
}

export default function Overlay({
  snapshotResolution,
  bordered = true,
  useExternalZoom = false,
}: OverlayProps) {
  const [transparent, setTransparent] = useState(0.5);
  const resetKey = [
    snapshotResolution?.images.base,
    snapshotResolution?.images.new,
    snapshotResolution?.size ?? "default",
  ].join("::");

  const frame = (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-card p-2",
        bordered && "rounded-xl border border-border"
      )}
    >
      <div className="relative mx-auto" style={{ height: "min(70vh, 720px)" }}>
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${snapshotResolution?.images.base}")`,
          }}
        />
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${snapshotResolution?.images.new}")`,
            opacity: transparent,
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <TransparencySlider value={transparent} onChange={setTransparent} />
      {useExternalZoom ? (
        <ZoomViewport className="w-full" overlayControls>
          {frame}
        </ZoomViewport>
      ) : (
        <ZoomableViewport resetKey={resetKey} className="w-full">
          {frame}
        </ZoomableViewport>
      )}
    </div>
  );
}
