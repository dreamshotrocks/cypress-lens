import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ZOOM_TIP = "Scroll to zoom · drag to pan · Alt-drag to use slider";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

interface ZoomControlsContextValue {
  scale: number;
  pan: { x: number; y: number };
  zoomBy: (delta: number) => void;
  resetZoom: () => void;
  setPan: (pan: { x: number; y: number }) => void;
  setScale: (updater: (current: number) => number) => void;
}

const ZoomScaleContext = createContext(1);
const ZoomControlsContext = createContext<ZoomControlsContextValue | null>(
  null
);

export function useZoomViewportScale() {
  return useContext(ZoomScaleContext);
}

function useZoomControls() {
  return useContext(ZoomControlsContext);
}

interface ZoomProviderProps {
  children: ReactNode;
  resetKey?: string;
}

export function ZoomProvider({ children, resetKey }: ZoomProviderProps) {
  const [scale, setScaleState] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setScaleState(1);
    setPan({ x: 0, y: 0 });
  }, [resetKey]);

  const zoomBy = useCallback((delta: number) => {
    setScaleState((current) => {
      const next = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, Math.round((current + delta) * 100) / 100)
      );
      if (next <= MIN_SCALE) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScaleState(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const setScale = useCallback((updater: (current: number) => number) => {
    setScaleState((current) => {
      const next = updater(current);
      if (next <= MIN_SCALE) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const controls = useMemo(
    () => ({
      scale,
      pan,
      zoomBy,
      resetZoom,
      setPan,
      setScale,
    }),
    [scale, pan, zoomBy, resetZoom, setScale]
  );

  return (
    <ZoomControlsContext.Provider value={controls}>
      <ZoomScaleContext.Provider value={scale}>
        {children}
      </ZoomScaleContext.Provider>
    </ZoomControlsContext.Provider>
  );
}

interface ZoomToolbarProps {
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  /** Compact floating control bar for image overlays. */
  floating?: boolean;
  /** Show usage tip as a tooltip on the control group. */
  tipAsTooltip?: boolean;
}

export function ZoomToolbar({
  className,
  labelClassName,
  controlClassName,
  floating = false,
  tipAsTooltip = false,
}: ZoomToolbarProps) {
  const controls = useZoomControls();
  if (!controls) {
    return null;
  }

  const { scale, pan, zoomBy, resetZoom } = controls;
  const toolbar = (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1",
        floating &&
          "rounded-lg border border-border bg-secondary/95 p-1 shadow-md backdrop-blur-sm",
        controlClassName
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => zoomBy(-SCALE_STEP)}
        disabled={scale <= MIN_SCALE}
        title="Zoom out"
        aria-label="Zoom out"
        className="h-7 px-2"
      >
        <ZoomOut className="size-3.5" />
      </Button>
      <Badge
        variant="muted"
        className="min-w-12 justify-center font-mono text-[11px]"
      >
        {Math.round(scale * 100)}%
      </Badge>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => zoomBy(SCALE_STEP)}
        disabled={scale >= MAX_SCALE}
        title="Zoom in"
        aria-label="Zoom in"
        className="h-7 px-2"
      >
        <ZoomIn className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={resetZoom}
        disabled={scale <= MIN_SCALE && pan.x === 0 && pan.y === 0}
        title="Reset zoom"
        aria-label="Reset zoom"
        className="h-7 gap-1 px-2"
      >
        <Maximize2 className="size-3.5" />
        Reset
      </Button>
    </div>
  );

  const withTip = tipAsTooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">{toolbar}</div>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {ZOOM_TIP}
      </TooltipContent>
    </Tooltip>
  ) : (
    toolbar
  );

  if (!labelClassName) {
    return <div className={className}>{withTip}</div>;
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className={labelClassName}>Zoom</span>
      {withTip}
    </div>
  );
}

type OverlayPosition = "top-right" | "bottom-right";

interface ZoomViewportProps {
  children: ReactNode;
  className?: string;
  /** Floating zoom controls over the image corner. */
  overlayControls?: boolean;
  overlayPosition?: OverlayPosition;
}

export function ZoomViewport({
  children,
  className,
  overlayControls = false,
  overlayPosition = "top-right",
}: ZoomViewportProps) {
  const controls = useZoomControls();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  if (!controls) {
    throw new Error("ZoomViewport must be used within ZoomProvider");
  }

  const { scale, pan, setPan, setScale } = controls;

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      setScale((current) =>
        Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, Math.round((current + direction) * 100) / 100)
        )
      );
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [setScale]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scale <= MIN_SCALE) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const overInteractive = Boolean(
      target?.closest("[data-zoom-interactive]")
    );

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
    <div className={cn("group/zoom relative w-full", className)}>
      {overlayControls && (
        <div
          className={cn(
            "absolute z-20 opacity-0 pointer-events-none transition-opacity duration-150",
            "group-hover/zoom:pointer-events-auto group-hover/zoom:opacity-100",
            "group-focus-within/zoom:pointer-events-auto group-focus-within/zoom:opacity-100",
            overlayPosition === "bottom-right"
              ? "bottom-2 right-2"
              : "top-2 right-2"
          )}
        >
          <ZoomToolbar floating tipAsTooltip />
        </div>
      )}
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
  );
}

interface ZoomableViewportProps {
  children: ReactNode;
  resetKey?: string;
  className?: string;
  showToolbar?: boolean;
  overlayPosition?: OverlayPosition;
}

export default function ZoomableViewport({
  children,
  resetKey,
  className,
  showToolbar = true,
  overlayPosition = "top-right",
}: ZoomableViewportProps) {
  return (
    <ZoomProvider resetKey={resetKey}>
      <ZoomViewport
        className={className}
        overlayControls={showToolbar}
        overlayPosition={overlayPosition}
      >
        {children}
      </ZoomViewport>
    </ZoomProvider>
  );
}
