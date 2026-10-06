import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), "flowui-pack-test-"));
  mkdirSync(join(directory, "dist"));
  const manifest = {
    name: "flowui-pack-fixture",
    version: "1.0.0",
    files: ["dist"],
    exports: { ".": "./dist/index.js", "./styles.css": "./dist/styles.css" },
  };
  writeFileSync(join(directory, "dist/index.js"), "export const value = 1;\n");
  writeFileSync(
    join(directory, "dist/styles.css"),
    ".control { display: block; }\n",
  );
  try {
    run(directory, manifest, () => {
      writeFileSync(join(directory, "package.json"), JSON.stringify(manifest));
      return execFileSync(
        process.execPath,
        [
          fileURLToPath(new URL("check-package.mjs", import.meta.url)),
          directory,
        ],
        { encoding: "utf8", stdio: "pipe" },
      );
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("accepts a tarball with JS and CSS exports", () => {
  fixture((directory, manifest, check) => {
    assert.match(check(), /2 entry points verified/);
  });
});

test("rejects a manifest whose CSS file does not exist", () => {
  fixture((directory, manifest, check) => {
    rmSync(join(directory, "dist/styles.css"));
    assert.throws(check, /missing declared entry point dist\/styles\.css/);
  });
});

test("rejects JS present on disk but excluded from the npm tarball", () => {
  fixture((directory, manifest, check) => {
    manifest.files = ["dist/styles.css"];
    assert.throws(check, /missing declared entry point dist\/index\.js/);
  });
});

test("rejects an empty entry point", () => {
  fixture((directory, manifest, check) => {
    writeFileSync(join(directory, "dist/index.js"), "");
    assert.throws(check, /entry point dist\/index\.js is empty/);
  });
});
