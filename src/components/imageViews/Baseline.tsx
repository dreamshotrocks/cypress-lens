interface BaselineProps {
  src: string;
}

export default function Baseline({ src }: BaselineProps) {
  return (
    <div className="flex w-full justify-center overflow-hidden rounded-xl border border-border bg-card p-2">
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
