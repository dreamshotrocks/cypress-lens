import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectedImage } from "@/types/ReporterTypes";

interface EmptyFailedStateProps {
  previews: SelectedImage[];
  onSelect: (entry: SelectedImage) => void;
}

export default function EmptyFailedState({
  previews,
  onSelect,
}: EmptyFailedStateProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-7 py-5">
      <Card className="w-full max-w-md border-success/25 bg-gradient-to-b from-card to-background text-center shadow-none">
        <CardHeader className="items-center gap-2">
          <CheckCircle2 className="size-9 text-success" />
          <CardTitle className="text-xl">No failed snapshots</CardTitle>
          <CardDescription>
            All visual checks passed. Browse a few passed snapshots below, or
            switch back to All.
          </CardDescription>
        </CardHeader>
      </Card>

      {previews.length > 0 && (
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5">
          {previews.map((entry) => {
            const key = `${entry.item.props.name}-${entry.test.props.name}-${entry.snapshot.props.name}-${entry.resolution.size}`;
            const image =
              entry.resolution.images.base ||
              entry.snapshot.resolutions[0]?.images.base;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(entry)}
                className="text-left"
              >
                <Card className="overflow-hidden transition-colors hover:border-primary">
                  <CardContent className="space-y-2.5 p-2.5">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                      <img
                        src={image}
                        alt={entry.snapshot.props.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="truncate text-xs font-medium">
                        {entry.snapshot.props.name}
                      </div>
                      <div className="font-mono text-[11px] text-success">
                        {entry.resolution.size}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
