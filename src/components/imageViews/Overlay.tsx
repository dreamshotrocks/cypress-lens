import { useState } from "react";
import TransparencySlider from "../TransparencySlider";
import { Resolution } from "@/types/ReporterTypes";

interface OverlayProps {
  snapshotResolution: Resolution;
}

export default function Overlay({ snapshotResolution }: OverlayProps) {
  const [transparent, setTransparent] = useState(0.5);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <TransparencySlider
        value={transparent}
        onChange={setTransparent}
      />
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card p-2">
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
    </div>
  );
}
