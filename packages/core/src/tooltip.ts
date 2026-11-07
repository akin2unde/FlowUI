import type { TooltipLocation } from "./contracts";

export function resolveTooltipLocation(
  preferred: TooltipLocation,
  anchor: { top: number; right: number; bottom: number; left: number },
  tooltip: { width: number; height: number },
  viewport: { width: number; height: number },
  gap = 6,
): TooltipLocation {
  const available = {
    top: anchor.top,
    right: viewport.width - anchor.right,
    bottom: viewport.height - anchor.bottom,
    left: anchor.left,
  };
  const opposite = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  } as const;
  const required =
    preferred === "top" || preferred === "bottom"
      ? tooltip.height + gap
      : tooltip.width + gap;
  return available[preferred] < required &&
    available[opposite[preferred]] > available[preferred]
    ? opposite[preferred]
    : preferred;
}
