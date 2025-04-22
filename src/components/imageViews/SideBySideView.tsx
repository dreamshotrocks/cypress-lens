import { Resolution } from "../../types/ReporterTypes";
import styles from "./SideBySide.module.scss";
import Baseline from "./Baseline";
interface SideBySideProps {
  snapshotResolution: Resolution;
}

export default function SideBySide({ snapshotResolution }: SideBySideProps) {
  return (
    <div className={styles["container"]}>
      <Baseline src={snapshotResolution?.images.base} />
      <Baseline src={snapshotResolution?.images.new} />
    </div>
  );
}
