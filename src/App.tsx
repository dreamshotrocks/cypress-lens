import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import styles from "./App.module.scss";
import ImageTabs from "./components/ImageTabs";
import { Item, SelectedImage } from "./types/ReporterTypes";

function App() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  useEffect(() => {
    //@ts-ignore
    if (testData) {
      //@ts-ignore
      setItems(testData);
    } else {
      console.error("No test data found!");
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
