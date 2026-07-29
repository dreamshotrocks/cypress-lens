import { CheckCircle2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedImage } from "@/types/ReporterTypes";

interface ReviewCompleteProps {
  failedEntries: SelectedImage[];
  onBackToGallery: () => void;
}

export default function ReviewComplete({
  failedEntries,
  onBackToGallery,
}: ReviewCompleteProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_20%,rgba(132,225,23,0.12),transparent_55%)] p-8">
      <Card className="w-full max-w-xl border-success/25 py-0 shadow-none ring-success/20">
        <div className="flex flex-col items-center gap-6 px-8 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="size-10" />
          </div>

          <div className="flex max-w-md flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Thanks for reviewing
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You've reviewed all failed snapshots
              {failedEntries.length > 0 ? ` (${failedEntries.length})` : ""}.
            </p>
          </div>

          <Button type="button" variant="success" onClick={onBackToGallery}>
            <LayoutGrid className="size-4" />
            Back to report
          </Button>
        </div>
      </Card>
    </div>
  );
}
