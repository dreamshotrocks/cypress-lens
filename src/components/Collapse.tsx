import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div className="mb-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/50",
          counts && counts.failed > 0 && "text-foreground"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          {isOpen ? (
            <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          )}
          <span
            className="min-w-0 flex-1 break-words text-sm font-medium leading-snug"
            title={title}
          >
            {title}
          </span>
          <Badge
            variant="outline"
            className="mt-0.5 h-5 shrink-0 px-1.5 text-[10px] uppercase tracking-wide"
          >
            spec
          </Badge>
        </div>
        {counts && counts.failed > 0 ? (
          <Badge
            variant="destructive"
            className="mt-0.5 h-5 shrink-0 px-2 text-[10px]"
          >
            Failed: {counts.failed}
          </Badge>
        ) : null}
      </button>
      {isOpen && <div className="pb-3 pt-1">{children}</div>}
    </div>
  );
}
