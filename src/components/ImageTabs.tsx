import {
  ArrowsInLineVertical,
  ExcludeSquare,
  Image,
  SelectionInverse,
  SquareHalf,
} from "@phosphor-icons/react";
import styles from "./ImageTabs.module.scss";
import { useState } from "react";
import Baseline from "./imageViews/Baseline";
import SideBySide from "./imageViews/SideBySideView";
import Slider from "./imageViews/Slider";
import Overlay from "./imageViews/Overlay";
import { Snapshot, Test } from "../types/ReporterTypes";
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

  return (
    <>
      {test.failure || snapshot.images.diff ? (
        <div className={styles["tabs-container"]}>
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
          <div className={styles["tabs"]}>
            {activeTab.tabText === "Baseline" && (
              <Baseline src={snapshot.images.base} />
            )}
            {activeTab.tabText === "Side By Side" && (
              <SideBySide snapshot={snapshot} />
            )}
            {activeTab.tabText === "Difference" && (
              <Baseline src={snapshot.images.diff} />
            )}
            {activeTab.tabText === "Slider" && <Slider snapshot={snapshot} />}
            {activeTab.tabText === "Overlay" && <Overlay snapshot={snapshot} />}
          </div>
        </div>
      ) : (
        <Baseline src={snapshot.images.base} />
      )}
      <div className={styles["badge-container"]}>
        <div className={styles.text}>{snapshot.props.name}</div>
      </div>
    </>
  );
}
