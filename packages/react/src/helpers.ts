import { useEffect, type CSSProperties, type RefObject } from "react";
import {
  flowClass,
  resolveFlowStyle,
  type BaseUIProps,
} from "@akin2unde/flowui-core";
import { useFlowTheme } from "./theme";

export function useFlowProps(
  base: string,
  props: BaseUIProps & Record<string, unknown>,
  ...extra: Array<string | false | undefined>
) {
  const { theme } = useFlowTheme();
  const resolution = resolveFlowStyle(props, theme);
  return {
    id: props.id,
    hidden: props.hidden,
    "data-testid": props.testId,
    className: flowClass(base, props, resolution, ...extra),
    style: resolution.style as CSSProperties,
  };
}

/** Closes a floating control when a pointer leaves it or Escape is pressed. */
export function useDismissableLayer<T extends HTMLElement>(
  ref: RefObject<T | null>,
  open: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const pointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open, onDismiss, ref]);
}
