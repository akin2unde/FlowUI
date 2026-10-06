import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

// Check npm's actual file list, not just files present in the working tree.
// ignore-scripts prevents recursion into the package's prepack hook.
for (const directory of process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["core", "react", "angular", "react-native"]) {
  const cwd = resolve(root, "packages", directory);
  const manifest = JSON.parse(
    readFileSync(resolve(cwd, "package.json"), "utf8"),
  );
  const targets = new Set();
  function collect(value) {
    if (typeof value === "string") targets.add(value.replace(/^\.\//, ""));
    else if (value && typeof value === "object")
      Object.values(value).forEach(collect);
  }
  for (const field of ["main", "module", "types", "typings", "exports"]) {
    collect(manifest[field]);
  }
  if (!targets.size)
    throw new Error(`${manifest.name}: no public entry points declared`);
  const [pack] = JSON.parse(
    execFileSync(npm, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    }),
  );
  const files = new Set(pack.files.map((file) => file.path));
  for (const target of targets) {
    if (!files.has(target)) {
      throw new Error(
        `${manifest.name}: npm tarball is missing declared entry point ${target}`,
      );
    }
    if (!statSync(resolve(cwd, target)).size) {
      throw new Error(
        `${manifest.name}: declared entry point ${target} is empty`,
      );
    }
  }
  console.log(
    `${manifest.name}@${manifest.version}: ${targets.size} entry points verified in npm tarball`,
  );
}
