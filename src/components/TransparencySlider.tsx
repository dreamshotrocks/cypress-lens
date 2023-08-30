import { CSSProperties, ChangeEvent } from "react";
import styles from "./TransparencySlider.module.scss";

interface TransparencySliderProps {
  style?: CSSProperties;
  value: number;
  onChange: (value: number) => void;
}

export default function TransparencySlider({
  value,
  onChange,
  style,
}: TransparencySliderProps) {
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div className={styles["transparency-slider-container"]} style={style}>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={handleSliderChange}
        className={styles["transparency-slider-input"]}
      />
    </div>
  );
}
