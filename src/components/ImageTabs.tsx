import {
  ArrowsInLineVertical,
  ExcludeSquare,
  Image,
  SelectionInverse,
  SquareHalf,
} from "@phosphor-icons/react";
import styles from "./ImageTabs.module.scss";
import { useEffect, useState } from "react";
import Baseline from "./imageViews/Baseline";
import SideBySide from "./imageViews/SideBySideView";
import Slider from "./imageViews/Slider";
import Overlay from "./imageViews/Overlay";
import { Resolution, Snapshot, Test } from "../types/ReporterTypes";
import classNames from "classnames";
interface ImageTabsProps {
  test: Test;
  snapshot: Snapshot;
}

export default function ImageTabs({ test, snapshot }: ImageTabsProps) {
  const tabs = [
    {
      tabIcon: <Image size={17} />,
      tabText: "Baseline",
      id: "tab1",
    },
    {
      tabIcon: <SquareHalf size={17} />,
      tabText: "Side By Side",
      id: "tab2",
    },
    {
      tabIcon: <ExcludeSquare size={17} />,
      tabText: "Difference",
      id: "tab3",
    },
    {
      tabIcon: <ArrowsInLineVertical size={17} />,
      tabText: "Slider",
      id: "tab4",
    },
    {
      tabIcon: <SelectionInverse size={17} />,
      tabText: "Overlay",
      id: "tab5",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeResolution, setActiveResolution] = useState<Resolution>();

  useEffect(() => {
    setActiveResolution(snapshot.resolutions[0]);
  }, [snapshot]);

  return (
    activeResolution && (
      <>
        {test.failure ? (
          <div className={styles["tabs-container"]}>
            <div className={styles["menu-wrapper"]}>
              <div className={styles["menu-container"]}>
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={classNames({
                      [styles.tab]: true,
                      [styles.active]: activeTab.id === tab.id,
                    })}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.tabIcon}
                    {tab.tabText}
                  </div>
                ))}
              </div>
              <div className={styles["menu-container"]}>
                {snapshot?.resolutions.map((resolution, index) => (
                  <div
                    key={index}
                    className={classNames({
                      [styles.tab]: true,
                      [styles.active]:
                        activeResolution.size === resolution.size,
                    })}
                    onClick={() => setActiveResolution(resolution)}
                  >
                    {resolution.size}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles["tabs"]}>
              {activeTab.tabText === "Baseline" && (
                <Baseline src={activeResolution.images.base} />
              )}
              {activeTab.tabText === "Side By Side" && (
                <SideBySide snapshot={snapshot} />
              )}
              {activeTab.tabText === "Difference" && (
                <Baseline src={snapshot?.resolutions[0].images.diff} />
              )}
              {activeTab.tabText === "Slider" && <Slider snapshot={snapshot} />}
              {activeTab.tabText === "Overlay" && (
                <Overlay snapshot={snapshot} />
              )}
            </div>
          </div>
        ) : (
          <Baseline src={activeResolution.images.base} />
        )}
        <div className={styles["badge-container"]}>
          <div className={styles.text}>{snapshot?.props.name}</div>
        </div>
      </>
    )
  );
}
