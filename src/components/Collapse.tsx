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
          "flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/50",
          counts && counts.failed > 0 && "text-foreground"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {isOpen ? (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate text-sm font-medium leading-none">
            {title}
          </span>
          <Badge
            variant="outline"
            className="h-5 shrink-0 px-1.5 text-[10px] uppercase tracking-wide"
          >
            spec
          </Badge>
        </div>
        {counts && counts.failed > 0 ? (
          <Badge
            variant="destructive"
            className="h-5 shrink-0 px-2 text-[10px]"
          >
            Failed: {counts.failed}
          </Badge>
        ) : null}
      </button>
      {isOpen && <div className="pb-3 pt-1">{children}</div>}
    </div>
  );
}
