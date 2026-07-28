import { Resolution } from "@/types/ReporterTypes";
import Baseline from "./Baseline";

interface SideBySideProps {
  snapshotResolution: Resolution;
}

function LabeledSnapshot({
  label,
  src,
}: {
  label: string;
  src: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Baseline src={src} />
    </div>
  );
}

export default function SideBySide({ snapshotResolution }: SideBySideProps) {
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <LabeledSnapshot
        label="base"
        src={snapshotResolution?.images.base}
      />
      <LabeledSnapshot
        label="actual"
        src={snapshotResolution?.images.new}
      />
    </div>
  );
}
