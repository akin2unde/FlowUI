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

/** Validate numeric bounds without silently clamping user-entered text. */
export function numericInputError(
  value: string | number,
  min?: string | number,
  max?: string | number,
  step?: string | number,
): string | undefined {
  if (String(value).trim() === "") return;
  const number = Number(value);
  if (!Number.isFinite(number)) return "Enter a valid number.";
  if (min !== undefined && number < Number(min))
    return `Enter a value of at least ${min}.`;
  if (max !== undefined && number > Number(max))
    return `Enter a value no greater than ${max}.`;
  if (step !== undefined && step !== "any" && Number(step) > 0) {
    const count = (number - Number(min ?? 0)) / Number(step);
    if (Math.abs(count - Math.round(count)) > 1e-8)
      return `Use increments of ${step}.`;
  }
}
