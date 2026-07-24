import { cn } from "@/lib/utils";

interface BaselineProps {
  src: string;
  bordered?: boolean;
}

export default function Baseline({ src, bordered = true }: BaselineProps) {
  return (
    <div
      className={cn(
        "flex w-full justify-center overflow-hidden bg-card p-2",
        bordered && "rounded-xl border border-border"
      )}
    >
      <div
        className="min-h-[240px] w-full max-w-full bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${src}")`,
          aspectRatio: "auto",
          height: "min(70vh, 720px)",
        }}
      />
    </div>
  );
}
