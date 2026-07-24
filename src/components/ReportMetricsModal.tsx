import { useEffect, useMemo } from "react";
import { BarChart3, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/ReporterTypes";
import {
  NamedCount,
  computeReportMetrics,
} from "@/utils/reportMetrics";
import { cn } from "@/lib/utils";

interface ReportMetricsModalProps {
  open: boolean;
  items: Item[];
  reviewedKeys: Set<string>;
  onClose: () => void;
}

type DonutSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 54;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative size-[148px] shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/40"
          />
          {total > 0 &&
            slices
              .filter((slice) => slice.value > 0)
              .map((slice) => {
                const length = (slice.value / total) * circumference;
                const circle = (
                  <circle
                    key={slice.key}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                  />
                );
                offset += length;
                return circle;
              })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-xl font-semibold tabular-nums">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            resolutions
          </div>
        </div>
      </div>

      <ul className="w-full space-y-2 text-sm">
        {slices.map((slice) => (
          <li
            key={slice.key}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-foreground/90">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              {slice.label}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {slice.value}
              {total > 0 ? ` · ${formatPercent(slice.value / total)}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarList({
  items,
  emptyLabel,
  barClassName,
}: {
  items: NamedCount[];
  emptyLabel: string;
  barClassName: string;
}) {
  const max = Math.max(...items.map((item) => item.count), 0);

  if (items.length === 0 || max === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.name} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate text-foreground/90" title={item.name}>
              {item.name}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {item.count}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", barClassName)}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

export default function ReportMetricsModal({
  open,
  items,
  reviewedKeys,
  onClose,
}: ReportMetricsModalProps) {
  const metrics = useMemo(
    () => computeReportMetrics(items, reviewedKeys),
    [items, reviewedKeys]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const statusSlices: DonutSlice[] = [
    {
      key: "passed",
      label: "Passed",
      value: metrics.passed,
      color: "#84e117",
    },
    {
      key: "reviewed",
      label: "Failed · reviewed",
      value: metrics.reviewedFailed,
      color: "#3d79fa",
    },
    {
      key: "unreviewed",
      label: "Failed · open",
      value: metrics.unreviewedFailed,
      color: "#f31d4f",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Report metrics"
    >
      <div
        className="flex h-[min(900px,92vh)] max-h-[min(900px,92vh)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  Report metrics
                </h2>
                <Badge variant="muted" className="text-[10px]">
                  Live
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Snapshot health, review progress, and where failures cluster.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close metrics"
            title="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-5 px-5 py-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatCard
                label="Pass rate"
                value={formatPercent(metrics.passRate)}
                hint={`${metrics.passed} / ${metrics.total}`}
              />
              <StatCard
                label="Failed"
                value={metrics.failed}
                hint={`${metrics.suitesWithFailures} suites`}
              />
              <StatCard
                label="Reviewed"
                value={formatPercent(metrics.reviewProgress)}
                hint={`${metrics.reviewedFailed} / ${metrics.failed || 0}`}
              />
              <StatCard
                label="Worst mismatch"
                value={metrics.worstMismatch.toLocaleString()}
                hint="pixels"
              />
            </div>

            <section className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status breakdown
              </h3>
              <DonutChart slices={statusSlices} />
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Failures by suite
                </h3>
                <BarList
                  items={metrics.bySuite}
                  emptyLabel="No failed resolutions in this report"
                  barClassName="bg-destructive"
                />
              </section>

              <section className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Failures by resolution
                </h3>
                <BarList
                  items={metrics.byResolution}
                  emptyLabel="No failed resolutions in this report"
                  barClassName="bg-primary"
                />
              </section>
            </div>

            <section className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mismatch severity
                </h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Failed resolutions grouped by mismatched pixel amount.
                </p>
              </div>
              <BarList
                items={metrics.mismatchBuckets}
                emptyLabel="No mismatched pixel data"
                barClassName="bg-success"
              />
            </section>
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-border px-5 py-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
