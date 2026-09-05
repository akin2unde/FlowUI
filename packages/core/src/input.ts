import type { InputProps } from "./contracts";

export type FlowInputMode = NonNullable<InputProps["inputMode"]>;

/** Keeps only characters allowed by the selected FlowUI input mode. */
export function sanitizeInputValue(
  value: string,
  mode: FlowInputMode = "text",
): string {
  if (mode === "integer") return value.replace(/[^0-9-]/g, "");
  if (mode === "decimal" || mode === "money") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const [whole, ...decimals] = cleaned.split(".");
    return decimals.length ? `${whole}.${decimals.join("")}` : whole;
  }
  if (mode === "alphabet") return value.replace(/[^a-zA-Z\s'-]/g, "");
  return value;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
