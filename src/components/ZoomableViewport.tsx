import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

const ZoomViewportContext = createContext({ scale: 1 });

export function useZoomViewportScale() {
  return useContext(ZoomViewportContext).scale;
}

interface ZoomableViewportProps {
  children: ReactNode;
  resetKey?: string;
  className?: string;
}

export default function ZoomableViewport({
  children,
  resetKey,
  className,
}: ZoomableViewportProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setDragging(false);
  }, [resetKey]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      setScale((current) => {
        const next = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, Math.round((current + direction) * 100) / 100)
        );
        if (next <= MIN_SCALE) {
          setPan({ x: 0, y: 0 });
        }
        return next;
      });
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  const zoomBy = (delta: number) => {
    setScale((current) => {
      const next = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, Math.round((current + delta) * 100) / 100)
      );
      if (next <= MIN_SCALE) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scale <= MIN_SCALE) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const overInteractive = Boolean(
      target?.closest("[data-zoom-interactive]")
    );

    // While zoomed: drag pans. Hold Alt over the slider to use the compare handle.
    const shouldPan =
      event.button === 1 ||
      (event.button === 0 && !(overInteractive && event.altKey));

    if (!shouldPan) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    setPan({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const canPan = scale > MIN_SCALE;

  return (
    <ZoomViewportContext.Provider value={{ scale }}>
      <div className={cn("flex w-full flex-col gap-2", className)}>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => zoomBy(-SCALE_STEP)}
            disabled={scale <= MIN_SCALE}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </Button>
          <Badge
            variant="muted"
            className="min-w-14 justify-center font-mono text-[11px]"
          >
            {Math.round(scale * 100)}%
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => zoomBy(SCALE_STEP)}
            disabled={scale >= MAX_SCALE}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetZoom}
            disabled={scale <= MIN_SCALE && pan.x === 0 && pan.y === 0}
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <Maximize2 className="size-3.5" />
            Reset
          </Button>
          <span className="ml-1 text-[10px] text-muted-foreground">
            Scroll to zoom · drag to pan · Alt-drag to use slider
          </span>
        </div>

        <div
          ref={viewportRef}
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-border bg-card",
            canPan ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="origin-center will-change-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transition: dragging ? undefined : "transform 80ms ease-out",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </ZoomViewportContext.Provider>
  );
}
