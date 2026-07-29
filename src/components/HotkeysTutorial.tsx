import { ReactNode, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Keyboard, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotkeysTutorialProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

type Shortcut = {
  id: string;
  keys: ReactNode[];
  description: string;
};

const SHORTCUTS: Shortcut[] = [
  {
    id: "prev",
    keys: [<ArrowLeft key="left" className="size-3" aria-hidden="true" />],
    description: "Go to the previous snapshot",
  },
  {
    id: "next",
    keys: [<ArrowRight key="right" className="size-3" aria-hidden="true" />],
    description: "Go to the next snapshot",
  },
  {
    id: "review",
    keys: ["Space"],
    description: "Mark or unmark the current failure as reviewed",
  },
  {
    id: "nav",
    keys: ["B"],
    description: "Show or hide the navigation sidebar",
  },
  {
    id: "view",
    keys: ["V"],
    description: "Cycle comparison views (baseline, side by side, diff, slider, overlay)",
  },
];

export default function HotkeysTutorial({
  open,
  onClose,
}: HotkeysTutorialProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (open) {
      setDontShowAgain(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        onClose(dontShowAgain);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, dontShowAgain]);

  if (!open) {
    return null;
  }

  const dismiss = () => onClose(dontShowAgain);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Keyboard className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Keyboard shortcuts
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Speed up your visual review with these keys.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={dismiss}
            aria-label="Close tutorial"
            title="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <ul className="space-y-1 px-5 py-4">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.id}
              className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5"
            >
              <span className="text-sm text-foreground/90">
                {shortcut.description}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key, index) => (
                  <Badge
                    key={index}
                    variant="muted"
                    className="min-w-8 justify-center font-mono text-[11px]"
                  >
                    {key}
                  </Badge>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <label
            className={cn(
              "flex cursor-pointer items-center gap-2 text-xs text-muted-foreground",
              "hover:text-foreground"
            )}
          >
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
              className="size-3.5 accent-primary"
            />
            Don&apos;t show again
          </label>
          <Button type="button" onClick={dismiss}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
