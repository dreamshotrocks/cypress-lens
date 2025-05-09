import { useEffect, useState } from "react";
import styles from "./Navigation.module.scss";
import { Dispatch, SetStateAction } from "react";
import Collapse from "./Collapse";
import SnapshotItem from "./SnapshotItem";
import { Item, SelectedImage, Snapshot, Test } from "../types/ReporterTypes";
import classNames from "classnames";

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
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openCollapse, setOpenCollapse] = useState<string | null>(
    items[0].props.name
  );

  const imageClickHandler = (snapshot: Snapshot, item: Item, test: Test) => {
    console.log(window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.scrollTop = 0;
    onImageClick({ snapshot, item, test });
  };

  const getCounts = (items: any) => {
    let countFailed = 0;
    let countPass = 0;
    items.forEach((item: any) => {
      item.tests.forEach((test: any) => {
        test.snapshots.forEach((snapshot: any) => {
          snapshot.resolutions.forEach((resolution: any) => {
            if (resolution.extraData.hasOwnProperty("mismatchedPixels")) {
              countFailed++;
            } else {
              countPass++;
            }
          });
        });
      });
    });
    return { failed: countFailed, passed: countPass };
  };

  const getCollapseCounts = (tests: any) => {
    let countFailed = 0;
    let countPass = 0;
    tests.forEach((test: any) => {
      test.snapshots.forEach((snapshot: any) => {
        snapshot.resolutions.forEach((resolution: any) => {
          if (resolution.extraData.hasOwnProperty("mismatchedPixels")) {
            countFailed++;
          } else {
            countPass++;
          }
        });
      });
    });
    return { failed: countFailed, passed: countPass };
  };

  const filter = () => {
    if (activeFilter === "all") {
      setFilteredItems(items);
    } else if (activeFilter === "failed") {
      const filterTests = (tests: Test[] = []) => {
        return tests.filter((test: Test) => {
          return test.failure;
        });
      };

      items.forEach((item: any = {}) => {
        item.tests = filterTests(item.tests);
      });

      const filtered = items.map((item: any) => {
        return {
          ...item,
          tests: item.tests.map((test: any) => {
            return {
              ...test,
              snapshots: test.snapshots.map((snapshot: any) => {
                return {
                  ...snapshot,
                  resolutions: snapshot.resolutions.filter(
                    (resolution: any) => {
                      return (
                        resolution.extraData &&
                        resolution.extraData.hasOwnProperty("mismatchedPixels")
                      );
                    }
                  ),
                };
              }),
            };
          }),
        };
      });

      if (
        selectedImage &&
        selectedImage.snapshot.resolutions.some((res) =>
          res.extraData.hasOwnProperty("mismatchedPixels")
        )
      ) {
        const fallbackItem = filtered[0];
        if (fallbackItem) {
          const fallbackTest = fallbackItem.tests[0];
          const fallbackSnapshot = fallbackTest.snapshots[0];
          onImageClick({
            snapshot: fallbackSnapshot,
            item: fallbackItem,
            test: fallbackTest,
          });
        }
      }

      setFilteredItems(filtered);
    }
  };

  const isFailed = (resolutions: any) => {
    return resolutions.some((resolution: { extraData: any }) =>
      resolution.extraData.hasOwnProperty("mismatchedPixels")
    );
  };

  useEffect(() => {
    filter();
  }, [activeFilter]);

  return (
    <div className={styles["drawer-container"]}>
      <div className={styles["tabs-container"]}>
        <div className={styles["menu-container"]}>
          <div
            key={1}
            className={classNames({
              [styles.tab]: true,
              [styles.active]: activeFilter === "all",
            })}
            onClick={() => setActiveFilter("all")}
          >
            All
          </div>
          <div
            key={2}
            className={classNames({
              [styles.tab]: true,
              [styles.active]: activeFilter === "failed",
            })}
            onClick={() => setActiveFilter("failed")}
          >
            Failed: {getCounts(items).failed}
          </div>
        </div>
      </div>

      {filteredItems.length > 0 &&
        filteredItems.map((item: Item) => {
          return (
            <Collapse
              key={item?.props?.name}
              title={item?.props?.name}
              isOpen={openCollapse === item?.props?.name}
              counts={getCollapseCounts(item.tests)}
              onToggle={() => {
                setOpenCollapse((prevOpen) =>
                  prevOpen === item?.props.name ? null : item.props.name
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
                      return (
                        <SnapshotItem
                          key={snapshot.props.name}
                          image={snapshot.resolutions[0].images.base}
                          snapshotName={snapshot.props.name}
                          isActive={
                            selectedImage?.snapshot?.props?.name ===
                            snapshot?.props?.name
                          }
                          onClick={() =>
                            imageClickHandler(snapshot, item, test)
                          }
                          variant={
                            test.failure && isFailed(snapshot.resolutions)
                              ? "fail"
                              : "pass"
                          }
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
