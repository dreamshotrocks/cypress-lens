import { Resolution } from "../../types/ReporterTypes";
import styles from "./Slider.module.scss";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface SliderProps {
  snapshotResolution: Resolution;
}

export default function Slider({ snapshotResolution }: SliderProps) {
  return (
    <div className={styles["container"]}>
      <ReactCompareSlider
        className={styles["image-slider"]}
        itemOne={
          <ReactCompareSliderImage
            src={snapshotResolution?.images.base}
            className={styles["image"]}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={snapshotResolution?.images.new}
            className={styles["image"]}
          />
        }
      />
    </div>
  );
}
