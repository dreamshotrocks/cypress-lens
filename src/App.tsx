import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import styles from "./App.module.scss";
import ImageTabs from "./components/ImageTabs";
import { Item, SelectedImage } from "./types/ReporterTypes";

//success
// const data = JSON.parse(
//   `[
//   {
//     "props": {
//       "name": "Autoplay",
//       "tests": 2
//     },
//     "tests": [
//       {
//         "props": {
//           "name": "Does autoplay modal match baseline snapshot",
//           "time": 16.52
//         },
//         "snapshots": [
//           {
//             "props": {
//               "name": "ui-autoplay-modal-2.png"
//             },
//             "images": {
//               "base": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/base.png",
//               "new": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/new.png",
//               "diff": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/diff.png"
//             }
//           },
//           {
//             "props": {
//               "name": "ui-autoplay-modal.png"
//             },
//             "images": {
//               "base": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
//               "new": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
//               "diff": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
//             }
//           }
//         ]
//       },
//       {
//         "props": {
//           "name": "Does autoplay modal match baseline snapshot 2",
//           "time": 15.75
//         },
//         "snapshots": [
//           {
//             "props": {
//               "name": "ui-autoplay-modal-2.png"
//             },
//             "images": {
//               "base": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/base.png",
//               "new": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/new.png",
//               "diff": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal-2.png/diff.png"
//             }
//           },
//           {
//             "props": {
//               "name": "ui-autoplay-modal.png"
//             },
//             "images": {
//               "base": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
//               "new": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
//               "diff": "snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "props": {
//       "name": "Help",
//       "tests": 1
//     },
//     "tests": [
//       {
//         "props": {
//           "name": "Does help modal match baseline snapshot",
//           "time": 16.196
//         },
//         "snapshots": [
//           {
//             "props": {
//               "name": "ui-help-modal.png"
//             },
//             "images": {
//               "base": "snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/base.png",
//               "new": "snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/new.png",
//               "diff": "snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/diff.png"
//             }
//           }
//         ]
//       }
//     ]
//   }
// ]`

//fail
const data = JSON.parse(
  `[{"props":{"name":"Ui Elements","tests":1},"tests":[{"props":{"name":"Does controls match baseline snapshot","time":0},"snapshots":[{"props":{"name":"ui-controls-1024-900.png","extraData":{"mismatchedPixels":378593,"percentage":0.5837426730611139}},"images":{"base":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-1024-900.png/diff.png"}},{"props":{"name":"ui-controls-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-375-812.png/diff.png"}},{"props":{"name":"ui-controls-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui-elements.cy.ts/Does-controls-match-baseline-snapshot/ui-controls-768-1024.png/diff.png"}}],"failure":{"message":"The 'ui-controls-1024-900' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.5837426730611139","percentage":"0.5837426730611139"}}]},{"props":{"name":"UI","tests":5},"tests":[{"props":{"name":"Does fast play match baseline snapshot","time":0},"snapshots":[{"props":{"name":"ui-menu-fast-play-activate-1024-900.png","extraData":{"mismatchedPixels":398213,"percentage":0.5986774077388142}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-fast-play-activate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-fast-play-activate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-activate-768-1024.png/diff.png"}},{"props":{"name":"ui-menu-fast-play-deactivate-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-fast-play-deactivate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-fast-play-deactivate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fast-play-match-baseline-snapshot/ui-menu-fast-play-deactivate-768-1024.png/diff.png"}}],"failure":{"message":"The 'ui-menu-fast-play-activate-1024-900' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.5986774077388142","percentage":"0.5986774077388142"}},{"props":{"name":"Does fullscreen match baseline snapshot","time":0},"snapshots":[{"props":{"name":"ui-menu-fullscreen-activate-1024-900.png","extraData":{"mismatchedPixels":386009,"percentage":0.5894322145433474}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-fullscreen-activate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-fullscreen-activate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-activate-768-1024.png/diff.png"}},{"props":{"name":"ui-menu-fullscreen-deactivate-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-fullscreen-deactivate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-fullscreen-deactivate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-fullscreen-match-baseline-snapshot/ui-menu-fullscreen-deactivate-768-1024.png/diff.png"}}],"failure":{"message":"The 'ui-menu-fullscreen-activate-1024-900' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.5894322145433474","percentage":"0.5894322145433474"}},{"props":{"name":"Does volume match baseline snapshot","time":37.858},"snapshots":[{"props":{"name":"ui-menu-volume-activate-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-volume-activate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-volume-activate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-activate-768-1024.png/diff.png"}},{"props":{"name":"ui-menu-volume-deactivate-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-1024-900.png/diff.png"}},{"props":{"name":"ui-menu-volume-deactivate-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-375-812.png/diff.png"}},{"props":{"name":"ui-menu-volume-deactivate-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-volume-match-baseline-snapshot/ui-menu-volume-deactivate-768-1024.png/diff.png"}}]},{"props":{"name":"Does stake match baseline snapshot","time":30.654},"snapshots":[{"props":{"name":"ui-stake-change-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-1024-900.png/diff.png"}},{"props":{"name":"ui-stake-change-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-375-812.png/diff.png"}},{"props":{"name":"ui-stake-change-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-stake-match-baseline-snapshot/ui-stake-change-768-1024.png/diff.png"}}]},{"props":{"name":"Does start screen match baseline snapshot","time":25.538},"snapshots":[{"props":{"name":"ui-start-screen-1024-900.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-1024-900.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-1024-900.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-1024-900.png/diff.png"}},{"props":{"name":"ui-start-screen-375-812.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-375-812.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-375-812.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-375-812.png/diff.png"}},{"props":{"name":"ui-start-screen-768-1024.png","extraData":{}},"images":{"base":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-768-1024.png/base.png","new":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-768-1024.png/new.png","diff":"snapshots/cypress/integration/visual/ui.cy.ts/Does-start-screen-match-baseline-snapshot/ui-start-screen-768-1024.png/diff.png"}}]}]}]`
);

function App() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  useEffect(() => {
    //@ts-ignore
    if (window.testData) {
      //@ts-ignore
      setItems(JSON.parse(window.testData));
    } else {
      console.error("No test data found! Rendering mock data.");
      setItems(data);
    }
  }, []);

  useEffect(() => {
    if (items && items[0].tests.length > 0) {
      const snapshot = items[0].tests[0].snapshots[0];
      const item = items[0];
      const test = items[0].tests[0];
      setSelectedImage({ snapshot, item, test });
    }
  }, [items]);

  return (
    <div className={styles["app"]}>
      <div className={styles.navigation}>
        {items && items.length > 0 && (
          <Navigation
            items={items}
            onImageClick={setSelectedImage}
            selectedImage={selectedImage}
          />
        )}
      </div>
      {selectedImage && (
        <div className={styles.container}>
          <div className={styles.inner}>
            <ImageTabs
              test={selectedImage.test}
              snapshot={selectedImage.snapshot}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
