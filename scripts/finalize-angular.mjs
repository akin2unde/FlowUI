import { readFile, writeFile } from "node:fs/promises";

// ng-packagr relocates JS and type entry points to the dist root. Custom
// exports and the source files allowlist must be relocated too.
const path = new URL("../packages/angular/dist/package.json", import.meta.url);
const manifest = JSON.parse(await readFile(path, "utf8"));
manifest.exports["./styles.css"] = "./flowui.css";
delete manifest.files;
await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
