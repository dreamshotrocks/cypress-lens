import { ReactNode } from "react";
import styles from "./Collapse.module.scss";
import { CaretDown, CaretLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

interface CollapseProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Collapse({
  title,
  children,
  isOpen,
  onToggle,
}: CollapseProps) {
  return (
    <div
      className={styles["vertical-collapse"]}
      style={{ marginBottom: !isOpen ? 0 : "20px" }}
    >
      <div className={styles["header-container"]} onClick={onToggle}>
        <div className={styles.header}>
          {title}
          {isOpen && <CaretDown size="16" />}
          {!isOpen && <CaretLeft size="16" />}
        </div>
      </div>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ y: "50%" }}
            animate={{ y: "0%" }}
            transition={{
              type: "spring",
              stiffness: 656,
              damping: 54,
              mass: 1.6,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
