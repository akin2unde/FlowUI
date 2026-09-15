import { describe, expect, it } from "vitest";
import { createNativeTheme, defaultNativeTheme } from "./theme";

describe("createNativeTheme", () => {
  it("merges native theme overrides without changing the default theme", () => {
    const theme = createNativeTheme({
      schemes: {
        light: { primary: "#7c3aed" },
      },
      components: {
        inputHeight: 56,
      },
    });

    expect(theme.schemes.light.primary).toBe("#7c3aed");
    expect(theme.schemes.light.text).toBe(
      defaultNativeTheme.schemes.light.text,
    );
    expect(theme.components.inputHeight).toBe(56);
    expect(defaultNativeTheme.components.inputHeight).toBe(50);
  });
});
