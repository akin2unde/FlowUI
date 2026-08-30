import type { CSSProperties } from "react";
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
