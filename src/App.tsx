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
  `[
    {
       "props":{
          "name":"Autoplay",
          "tests":1
       },
       "tests":[
          {
             "props":{
                "name":"[TLIB-1494] Does resize the scene when four pots are active during spin in a Normal Play and Anticipation...",
                "time":0
             },
             "snapshots":[
                {
                   "props":{
                      "name":"ui-autoplay-modal.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                },
                {
                   "props":{
                      "name":"ui-autoplay-modal2.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                },
                {
                   "props":{
                      "name":"ui-autoplay-modal3.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                }
             ],
             "failure":{
                "percentage":"0.862349329743",
                "message":"The 'ui-autoplay-modal' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.03639014185521161"
             }
          },
          {
             "props":{
                "name":"[TLIB-1494] Does it resize the scene when four pots are active during spin in a Normal Play and Anticipation...",
                "time":0
             },
             "snapshots":[
                {
                   "props":{
                      "name":"ui-autoplay-modal6.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                },
                {
                   "props":{
                      "name":"ui-autoplay-modal4.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                },
                {
                   "props":{
                      "name":"ui-autoplay-modal5.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                   }
                }
             ],
             "failure":{
                "percentage":"0.86",
                "message":"The 'ui-autoplay-modal' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.03639014185521161"
             }
          },
          {
            "props":{
               "name":"[TLIB-1495] Does the resize the scene when four pots are active during spin in a Normal Play and Anticipation...",
               "time":0
            },
            "snapshots":[
               {
                  "props":{
                     "name":"ui-autoplay-modal7.png"
                  },
                  "images":{
                     "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                     "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png",
                     "diff":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/diff.png"
                  }
               },
               {
                  "props":{
                     "name":"ui-autoplay-modal8.png"
                  },
                  "images":{
                     "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                     "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png"
                  }
               },
               {
                  "props":{
                     "name":"ui-autoplay-modal9.png"
                  },
                  "images":{
                     "base":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/base.png",
                     "new":"snapshots/cypress/integration/visual/autoplay.cy.ts/ui-autoplay-modal.png/new.png"
                  }
               }
            ],
            "failure":{
               "percentage":"0.86",
               "message":"The 'ui-autoplay-modal' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.03639014185521161"
            }
         }
       ]
    },
    {
       "props":{
          "name":"Help",
          "tests":1
       },
       "tests":[
          {
             "props":{
                "name":"Does help modal match baseline snapshot",
                "time":16.397
             },
             "snapshots":[
                {
                   "props":{
                      "name":"ui-help-modal.png"
                   },
                   "images":{
                      "base":"snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/base.png",
                      "new":"snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/new.png",
                      "diff":"snapshots/cypress/integration/visual/help.cy.ts/ui-help-modal.png/diff.png"
                   }
                }
             ],
             "failure":{
               "percentage":"0.86",
               "message":"The 'ui-autoplay-modal' image is different. Threshold limit exceeded! Expected: 0 Actual: 0.03639014185521161"
            }
          }
       ]
    }
 ]`
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
    if (items) {
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
