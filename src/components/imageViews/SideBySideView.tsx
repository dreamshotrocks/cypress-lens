import { Snapshot } from "../../types/ReporterTypes";
import styles from "./SideBySide.module.scss";
import Baseline from "./Baseline";
interface SideBySideProps {
  snapshot: Snapshot;
}

export default function SideBySide({ snapshot }: SideBySideProps) {
  return (
    <div className={styles["container"]}>
      <Baseline src={snapshot.images.base} />
      <Baseline src={snapshot.images.new} />
    </div>
  );
}
