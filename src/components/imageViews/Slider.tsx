import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { ArrowLeftRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Resolution } from "@/types/ReporterTypes";
import { cn } from "@/lib/utils";
import { useZoomViewportScale } from "../ZoomableViewport";

interface SliderProps {
  snapshotResolution: Resolution;
  bordered?: boolean;
}

function CompareHandleWithTip() {
  const scale = useZoomViewportScale();
  const isZoomed = scale > 1;

  return (
    <div
      className="__rcs-handle-root"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        className="__rcs-handle-line"
        style={{
          flexGrow: 1,
          width: 2,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 0 4px rgba(0,0,0,0.45)",
        }}
      />
      <Tooltip open={isZoomed ? undefined : false}>
        <TooltipTrigger asChild>
          <div
            className="__rcs-handle-button"
            style={{
              pointerEvents: "auto",
              display: "grid",
              placeItems: "center",
              width: 42,
              height: 42,
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.95)",
              background: "rgba(18,18,18,0.75)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
              color: "#fff",
              cursor: "ew-resize",
            }}
          >
            <ArrowLeftRight className="size-4" aria-hidden="true" />
          </div>
        </TooltipTrigger>
        {isZoomed && (
          <TooltipContent side="right" sideOffset={10} className="max-w-[220px]">
            To use slider please hold alt button and drag
          </TooltipContent>
        )}
      </Tooltip>
      <div
        className="__rcs-handle-line"
        style={{
          flexGrow: 1,
          width: 2,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 0 4px rgba(0,0,0,0.45)",
        }}
      />
    </div>
  );
}

export default function Slider({
  snapshotResolution,
  bordered = true,
}: SliderProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-card p-2",
        bordered && "rounded-xl border border-border"
      )}
    >
      <div data-zoom-interactive className="w-full">
        <ReactCompareSlider
          className="w-full overflow-hidden rounded-lg"
          style={{ height: "min(70vh, 720px)" }}
          handle={<CompareHandleWithTip />}
          itemOne={
            <ReactCompareSliderImage
              src={snapshotResolution?.images.base}
              alt="Baseline"
              style={{ objectFit: "contain", background: "#121212" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={snapshotResolution?.images.new}
              alt="New"
              style={{ objectFit: "contain", background: "#121212" }}
            />
          }
        />
      </div>
    </div>
  );
}
