import { Snapshot } from "../../types/ReporterTypes";
import styles from "./Slider.module.scss";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface SliderProps {
  snapshot: Snapshot;
}

export default function Slider({ snapshot }: SliderProps) {
  return (
    <div className={styles["container"]}>
      <ReactCompareSlider
        className={styles["image-slider"]}
        itemOne={<ReactCompareSliderImage src={snapshot.images.base} />}
        itemTwo={<ReactCompareSliderImage src={snapshot.images.new} />}
      />
    </div>
  );
}
