declare module "nativewind" {
  import type { ComponentType } from "react";

  export function cssInterop(
    component: ComponentType<unknown> | object,
    mapping: Record<string, string>,
  ): ComponentType<any>;
}
