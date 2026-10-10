import { signal } from "@angular/core";
import type { LabelLookup } from "@akin2unde/flowui-core";
export const demoStats = signal({ calls: 0, codes: [] as string[] });
export const demoLookups: Record<string, LabelLookup> = {
  customerName: {
    resolve: async (codes, { signal }) => {
      demoStats.update((previous) => ({
        calls: previous.calls + 1,
        codes: [...codes],
      }));
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 650);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(signal.reason);
          },
          { once: true },
        );
      });
      const names: Record<string, string> = {
        CUS001: "Akintunde",
        CUS002: "Mary",
      };
      return Object.fromEntries(
        codes.map((code) => [code, names[code] ?? null]),
      );
    },
  },
};
