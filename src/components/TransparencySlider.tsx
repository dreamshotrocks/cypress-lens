import { ChangeEvent, CSSProperties } from "react";

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
    onChange(Number(event.target.value));
  };

  return (
    <div
      className="flex w-full max-w-md items-center gap-3 rounded-xl border border-border bg-card px-4 py-2"
      style={style}
    >
      <span className="text-xs text-muted-foreground">Opacity</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={handleSliderChange}
        className="h-1.5 w-full cursor-pointer accent-primary"
      />
      <span className="w-8 text-right font-mono text-xs text-muted-foreground">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
