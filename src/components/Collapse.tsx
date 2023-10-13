import { ReactNode } from "react";
import styles from "./Collapse.module.scss";
import { CaretDown, CaretLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";

interface CollapseProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  counts?: { failed: number; passed: number };
  onToggle: () => void;
}

export default function Collapse({
  title,
  children,
  isOpen,
  counts,
  onToggle,
}: CollapseProps) {
  return (
    <div
      className={classNames({
        [styles["vertical-collapse"]]: true,
        [styles.failed]: counts && counts.failed > 0,
      })}
      style={{ marginBottom: !isOpen ? 0 : "20px" }}
    >
      <div className={styles["header-container"]} onClick={onToggle}>
        <div className={styles.header}>
          {title}
          {isOpen && <CaretDown size="16" />}
          {!isOpen && <CaretLeft size="16" />}
        </div>
        {counts && (
          <span className={styles["counts"]}>
            {counts.failed > 0 ? (
              <span className={styles["failed"]}>Failed: {counts.failed}</span>
            ) : null}
          </span>
        )}
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
