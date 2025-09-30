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
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const applySearchFilter = (itemsToFilter: Item[]): Item[] => {
    if (!searchQuery.trim()) {
      return itemsToFilter;
    }

    const query = searchQuery.toLowerCase().trim();

    return itemsToFilter
      .map((item) => {
        // Check if item name matches
        const itemMatches = item.props.name.toLowerCase().includes(query);

        // Filter tests and snapshots
        const filteredTests = item.tests
          .map((test) => {
            // Check if test name matches
            const testMatches = test.props.name.toLowerCase().includes(query);

            // Filter snapshots
            const filteredSnapshots = test.snapshots.filter((snapshot) =>
              snapshot.props.name.toLowerCase().includes(query)
            );

            // Include test if it matches or has matching snapshots
            if (testMatches || filteredSnapshots.length > 0) {
              return {
                ...test,
                snapshots: testMatches ? test.snapshots : filteredSnapshots,
              };
            }
            return null;
          })
          .filter((test) => test !== null) as Test[];

        // Include item if it matches or has matching tests
        if (itemMatches || filteredTests.length > 0) {
          return {
            ...item,
            tests: itemMatches ? item.tests : filteredTests,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as Item[];
  };

  const filter = () => {
    let baseItems = items;

    if (activeFilter === "failed") {
      const filterTests = (tests: Test[] = []) => {
        return tests.filter((test: Test) => {
          return test.failure;
        });
      };

      items.forEach((item: any = {}) => {
        item.tests = filterTests(item.tests);
      });

      baseItems = items.map((item: any) => {
        return {
          ...item,
          tests: item.tests.map((test: any) => {
            return {
              ...test,
              snapshots: test.snapshots
                .map((snapshot: any) => {
                  const validResolutions = snapshot.resolutions.filter(
                    (resolution: any) =>
                      resolution.extraData &&
                      resolution.extraData.hasOwnProperty("mismatchedPixels")
                  );
                  return validResolutions.length > 0
                    ? { ...snapshot, resolutions: validResolutions }
                    : null;
                })
                .filter((snapshot: any) => snapshot !== null),
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
        const fallbackItem = baseItems[0];
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
    }

    // Apply search filter to the base items
    const finalFilteredItems = applySearchFilter(baseItems);
    setFilteredItems(finalFilteredItems);
  };

  const isFailed = (resolutions: any) => {
    return resolutions.some((resolution: { extraData: any }) =>
      resolution.extraData.hasOwnProperty("mismatchedPixels")
    );
  };

  useEffect(() => {
    filter();
  }, [activeFilter, searchQuery]);

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

      {/* Search Bar */}
      <div className={styles["search-container"]}>
        <div className={styles["search-input-wrapper"]}>
          <span className={styles["search-icon"]}>🔍</span>
          <input
            type="text"
            placeholder="Search for snapshots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles["search-input"]}
          />
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
