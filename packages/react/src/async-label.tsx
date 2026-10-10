import type { BaseUIProps, AsyncLabelCode } from "@akin2unde/flowui-core";
import { useAsyncLabel } from "./async-label-store";
import { useFlowProps } from "./helpers";
export * from "./async-label-store";
export interface AsyncLabelProps extends BaseUIProps {
  lookup: string;
  code?: AsyncLabelCode;
  fallback?: string;
  loadingText?: string;
  showLoader?: boolean;
}
/** Read-only code-to-text display; fetching belongs to the registered app resolver. */
export function AsyncLabel({
  lookup,
  code,
  fallback,
  loadingText = "Resolving…",
  showLoader = true,
  ...props
}: AsyncLabelProps) {
  const state = useAsyncLabel(lookup, code);
  const busy =
    state.status === "loading" ||
    (state.status === "idle" &&
      code !== null &&
      code !== undefined &&
      String(code).trim() !== "");
  const text =
    state.status === "ready"
      ? state.label
      : busy
        ? loadingText
        : (fallback ?? String(code ?? ""));
  const flow = useFlowProps("fui-async-label", props);
  return (
    <span {...flow} aria-busy={busy} data-state={state.status}>
      {busy && showLoader && (
        <span className="fui-async-label-spinner" aria-hidden="true" />
      )}
      <span>{text}</span>
    </span>
  );
}
