import { useState } from "react";
import TransparencySlider from "../TransparencySlider";
import ZoomableViewport from "../ZoomableViewport";
import { Resolution } from "@/types/ReporterTypes";
import { cn } from "@/lib/utils";

interface OverlayProps {
  snapshotResolution: Resolution;
  bordered?: boolean;
}

export default function Overlay({
  snapshotResolution,
  bordered = true,
}: OverlayProps) {
  const [transparent, setTransparent] = useState(0.5);
  const resetKey = [
    snapshotResolution?.images.base,
    snapshotResolution?.images.new,
    snapshotResolution?.size ?? "default",
  ].join("::");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <TransparencySlider value={transparent} onChange={setTransparent} />
      <ZoomableViewport resetKey={resetKey} className="w-full">
        <div
          className={cn(
            "relative w-full overflow-hidden bg-card p-2",
            bordered && "rounded-xl border border-border"
          )}
        >
          <div
            className="relative mx-auto"
            style={{ height: "min(70vh, 720px)" }}
          >
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
      </ZoomableViewport>
    </div>
  );
}
