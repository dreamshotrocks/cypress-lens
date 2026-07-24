import { AlertTriangle, Check, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SnapshotItemProps {
  image: string;
  isActive: boolean;
  snapshotName: string;
  onClick: () => void;
  variant?: string;
  reviewed?: boolean;
  resolutions?: Array<{
    size: string | null;
    failed: boolean;
    reviewed: boolean;
  }>;
}

export default function SnapshotItem({
  onClick,
  image,
  isActive,
  snapshotName,
  variant,
  reviewed = false,
  resolutions = [],
}: SnapshotItemProps) {
  const statusLabel = reviewed
    ? "REVIEWED"
    : variant === "fail"
      ? "FAILED"
      : "PASS";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-3 mb-2.5 flex w-[calc(100%-1.5rem)] items-start gap-3 rounded-xl border border-border bg-background/60 p-3 text-left transition-colors hover:bg-accent/40",
        isActive &&
          !reviewed &&
          variant !== "fail" &&
          "border-primary bg-primary/15",
        isActive &&
          !reviewed &&
          variant === "fail" &&
          "border-destructive bg-destructive/15",
        isActive && reviewed && "border-success bg-success/10",
        !reviewed && variant === "fail" && !isActive && "border-destructive/40",
        reviewed && !isActive && "border-success/40"
      )}
    >
      <div
        className={cn(
          "h-14 w-[76px] shrink-0 overflow-hidden rounded-md bg-muted",
          !reviewed &&
            variant === "fail" &&
            "ring-2 ring-destructive/70 ring-inset",
          reviewed && "ring-2 ring-success/70 ring-inset"
        )}
      >
        <img src={image} alt="" className="size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div
          className="line-clamp-2 break-words text-[11px] font-medium leading-relaxed text-foreground"
          title={snapshotName}
        >
          {snapshotName}
        </div>

        <div className="flex flex-col items-start gap-2">
          <Badge
            variant={
              reviewed
                ? "success"
                : variant === "fail"
                  ? "destructive"
                  : "success"
            }
            className="h-5 gap-1 px-2 text-[10px] tracking-wide"
          >
            {reviewed ? (
              <CheckCircle2 className="size-3" />
            ) : variant === "fail" ? (
              <AlertTriangle className="size-3" />
            ) : (
              <Check className="size-3" />
            )}
            {statusLabel}
          </Badge>

          {resolutions.some((resolution) => resolution.size) && (
            <div className="flex flex-wrap gap-1.5">
              {resolutions
                .filter((resolution) => resolution.size)
                .map((resolution) => (
                  <Badge
                    key={resolution.size}
                    variant={
                      resolution.reviewed || !resolution.failed
                        ? "success"
                        : "destructive"
                    }
                    className="h-5 px-1.5 font-mono text-[10px]"
                  >
                    {resolution.size}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
