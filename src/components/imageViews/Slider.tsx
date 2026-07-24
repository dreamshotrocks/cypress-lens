import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { Resolution } from "@/types/ReporterTypes";

interface SliderProps {
  snapshotResolution: Resolution;
}

export default function Slider({ snapshotResolution }: SliderProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card p-2">
      <ReactCompareSlider
        className="w-full overflow-hidden rounded-lg"
        style={{ height: "min(70vh, 720px)" }}
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
  );
}
