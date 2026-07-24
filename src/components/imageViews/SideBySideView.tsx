import { Resolution } from "@/types/ReporterTypes";
import Baseline from "./Baseline";

interface SideBySideProps {
  snapshotResolution: Resolution;
}

export default function SideBySide({ snapshotResolution }: SideBySideProps) {
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <Baseline src={snapshotResolution?.images.base} />
      <Baseline src={snapshotResolution?.images.new} />
    </div>
  );
}
