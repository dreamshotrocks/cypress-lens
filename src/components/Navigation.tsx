import { useState } from "react";
import styles from "./Navigation.module.scss";
import { Dispatch, SetStateAction } from "react";
import Collapse from "./Collapse";
import SnapshotItem from "./SnapshotItem";
import { Item, SelectedImage, Snapshot, Test } from "../types/ReporterTypes";

interface NavigationProps {
  items: Item[];
  selectedImage: SelectedImage | null;
  onImageClick: Dispatch<SetStateAction<SelectedImage | null>>;
}

export default function Navigation({
  items,
  selectedImage,
  onImageClick,
}: NavigationProps) {
  console.error("items", items);
  const [openCollapse, setOpenCollapse] = useState<string | null>(
    items[0].props.name
  );

  const imageClickHandler = (snapshot: Snapshot, item: Item, test: Test) => {
    console.log(window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.scrollTop = 0;
    onImageClick({ snapshot, item, test });
  };

  return (
    <div className={styles["drawer-container"]}>
      {items.map((item: Item) => {
        return (
          <Collapse
            key={item.props.name}
            title={item.props.name}
            isOpen={openCollapse === item.props.name}
            onToggle={() => {
              setOpenCollapse((prevOpen) =>
                prevOpen === item.props.name ? null : item.props.name
              );
            }}
          >
            {item.tests.map((test: Test) => {
              const testIndex = item.tests.indexOf(test);
              const testsLength = item.tests.length;

              const isTestLast = testIndex === testsLength - 1;

              return (
                <div
                  className={styles["collapse-container"]}
                  key={test.props.name}
                >
                  <div className={styles["collapse-name"]}>
                    {test.props.name}
                  </div>

                  {test.snapshots.map((snapshot: Snapshot) => {
                    const isSnapshotLast =
                      test.snapshots[test.snapshots.length - 1].props.name ===
                      snapshot.props.name;
                    const isSnapshotFirst =
                      test.snapshots[0].props.name === snapshot.props.name;

                    return (
                      <SnapshotItem
                        isSnapshotFirst={isSnapshotFirst}
                        isSnapshotLast={isSnapshotLast}
                        key={snapshot.props.name}
                        image={snapshot.images.base}
                        snapshotName={snapshot.props.name}
                        snapshotPercent={Number(
                          test.failure?.percentage
                        ).toFixed(2)}
                        isActive={
                          selectedImage?.snapshot.props?.name ===
                          snapshot.props?.name
                        }
                        onClick={() => imageClickHandler(snapshot, item, test)}
                      />
                    );
                  })}
                  {!isTestLast && <div className={styles["line-break"]} />}
                </div>
              );
            })}
          </Collapse>
        );
      })}
    </div>
  );
}
