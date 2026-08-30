import { copyFile, mkdir } from "node:fs/promises";

for (const destination of [
  "../react/dist",
  "../angular/src",
  "../angular/dist",
]) {
  await mkdir(destination, { recursive: true });
  await copyFile("dist/flowui.css", `${destination}/flowui.css`);
}
