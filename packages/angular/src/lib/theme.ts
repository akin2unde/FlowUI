import {
  Injectable,
  Inject,
  InjectionToken,
  Optional,
  type Provider,
} from "@angular/core";
import {
  createTheme,
  themeToCSS,
  type DeepPartial,
  type FlowUITheme,
  type ThemeMode,
} from "@akin2unde/flowui-core";

export interface FlowUIConfig {
  theme?: DeepPartial<FlowUITheme>;
  mode?: ThemeMode;
}
export const FLOWUI_CONFIG = new InjectionToken<FlowUIConfig>("FLOWUI_CONFIG");

@Injectable({ providedIn: "root" })
export class FlowUIThemeService {
  readonly theme: FlowUITheme;
  readonly mode: ThemeMode;

  constructor(
    @Optional()
    @Inject(FLOWUI_CONFIG)
    config?: FlowUIConfig,
  ) {
    this.theme = createTheme(config?.theme);
    this.mode = config?.mode ?? "system";
    if (typeof document !== "undefined") {
      let style = document.getElementById(
        "flowui-runtime-theme",
      ) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = "flowui-runtime-theme";
        document.head.appendChild(style);
      }
      style.textContent = themeToCSS(this.theme, this.mode);
      document.documentElement.dataset["fuiTheme"] = this.mode;
    }
  }
}

export function provideFlowUI(config: FlowUIConfig = {}): Provider[] {
  return [{ provide: FLOWUI_CONFIG, useValue: config }, FlowUIThemeService];
}
