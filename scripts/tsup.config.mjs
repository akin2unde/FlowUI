import { createRequire } from "node:module";
import { resolve } from "node:path";

const fromWorkspace = createRequire(resolve("package.json"));
const fromTsup = createRequire(fromWorkspace.resolve("tsup"));
const { versionMajorMinor } = fromTsup("typescript");

// tsup 8 injects baseUrl while bundling declarations. Only TypeScript 6
// accepts the suppression for that deprecation.
export default {
  dts: {
    compilerOptions: versionMajorMinor.startsWith("6.")
      ? { ignoreDeprecations: "6.0" }
      : {},
  },
};
