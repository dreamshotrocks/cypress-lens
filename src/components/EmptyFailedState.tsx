import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmptyFailedState() {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-7 py-5">
      <Card className="w-full max-w-md border-success/25 bg-gradient-to-b from-card to-background text-center shadow-none">
        <CardHeader className="items-center gap-2">
          <CheckCircle2 className="size-9 text-success" />
          <CardTitle className="text-xl">No failed snapshots</CardTitle>
          <CardDescription>
            All visual checks passed. Switch back to All to browse snapshots.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
