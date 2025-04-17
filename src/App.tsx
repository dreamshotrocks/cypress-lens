import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import styles from "./App.module.scss";
import ImageTabs from "./components/ImageTabs";
import { Item, SelectedImage } from "./types/ReporterTypes";

function App() {
  const [items, setItems] = useState<Item[] | null>([
    {
      props: { name: "[Scenario-1] Sanity", tests: 1 },
      tests: [
        {
          props: {
            name: '"after each" hook for "[Scenario-1] Sanity"',
            time: 0,
          },
          snapshots: [
            {
              props: {
                name: "octoplay-1-ui-autoplay-modal-none-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-none-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-1-ui-autoplay-modal-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-1-ui-autoplay-modal-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-2-ui-help-modal-none-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-375-812.png/diff.png",
                  },
                  extraData: {
                    mismatchedPixels: 78,
                    percentage: 0.01600492535027828,
                  },
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-none-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-2-ui-help-modal-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-375-812.png/diff.png",
                  },
                  extraData: {
                    mismatchedPixels: 78,
                    percentage: 0.01600492535027828,
                  },
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-2-ui-help-modal-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-3-ui-settings-modal-none-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-1568-1024.png/diff.png",
                  },

                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-none-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-3-ui-settings-modal-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-3-ui-settings-modal-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: {
                name: "octoplay-4-ui-history-modal-empty-none-resume",
              },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-none-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: { name: "octoplay-4-ui-history-modal-empty-resume" },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-4-ui-history-modal-empty-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: { name: "octoplay-5-ui-stake-modal-none-resume" },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-none-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
            {
              props: { name: "octoplay-5-ui-stake-modal-resume" },
              resolutions: [
                {
                  size: "1568-1024",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-1568-1024.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-1568-1024.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-1568-1024.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "375-812",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-375-812.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-375-812.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-375-812.png/diff.png",
                  },
                  extraData: {},
                },
                {
                  size: "768-900",
                  images: {
                    base: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-768-900.png/base.png",
                    new: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-768-900.png/new.png",
                    diff: "reporter/report/snapshots/cypress/integration/suites/visual/sanity.cy.ts/Scenario-1/octoplay-5-ui-stake-modal-resume-768-900.png/diff.png",
                  },
                  extraData: {},
                },
              ],
            },
          ],
          failure: {
            message:
              "Visual test failed: The 'octoplay-2-ui-help-modal-resume-375-812' image is different. Threshold limit exceeded! Expected: 0.01 Actual: 0.01600492535027828Because this error occurred during a `after each` hook we are skipping the remaining tests in the current suite: `[Scenario-1] Sanity`",
            percentage: "0.01600492535027828",
          },
        },
      ],
    },
  ]);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  // useEffect(() => {
  //   //@ts-ignore
  //   if (testData) {
  //     //@ts-ignore
  //     setItems(testData);
  //   } else {
  //     console.error("No test data found!");
  //   }
  // }, []);

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
        {items && (
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
