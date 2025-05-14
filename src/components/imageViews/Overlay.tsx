import styles from "./Overlay.module.scss";
import classNames from "classnames";
import { useState } from "react";
import TransparencySlider from "../TransparencySlider";
import { Resolution } from "../../types/ReporterTypes";

interface OverlayProps {
  snapshotResolution: Resolution;
}

export default function Overlay({ snapshotResolution }: OverlayProps) {
  const [transparent, setTransparent] = useState(0.5);

  const handleAppSliderChange = (newValue: number) => {
    setTransparent(newValue);
  };

  return (
    <div className={styles["container"]}>
      <TransparencySlider
        value={transparent}
        onChange={handleAppSliderChange}
      />
      <div className={styles["image-container"]}>
        <div
          className={styles["image"]}
          style={{
            backgroundImage: `url("${snapshotResolution?.images.base}")`,
          }}
        ></div>
        <div
          className={classNames(styles["image"], styles["new-image"])}
          style={{
            backgroundImage: `url("${snapshotResolution?.images.new}")`,
            opacity: `${transparent}`,
          }}
        ></div>
      </div>
    </div>
  );
}
