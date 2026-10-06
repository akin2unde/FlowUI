import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const packageName = process.argv[2];
if (!["core", "react", "angular", "react-native"].includes(packageName)) {
  throw new Error(`Unknown FlowUI package: ${packageName}`);
}
// npm runs this hook for both pack and publish, including workspace publishes.
execFileSync(npm, ["run", `build:${packageName}`], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(
  process.execPath,
  [fileURLToPath(new URL("check-package.mjs", import.meta.url)), packageName],
  { cwd: root, stdio: "inherit" },
);
