const STORAGE_KEY = "cypress-lens:hotkeys-tutorial-seen";

export function hasSeenHotkeysTutorial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markHotkeysTutorialSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Ignore storage failures; the tutorial will simply not persist.
  }
}
