import type { ChartData, ChartType } from "./contracts";
import { resolveColorValue } from "./style";

type Mark = {
  fill: string;
  path?: string;
  stroke?: string;
  opacity?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const palette = ["#3b82c4", "#f59429", "#8cba39", "#ed74a7", "#8762c8"];

export function buildChart(
  data: ChartData,
  type: ChartType,
  height: number,
  showValues: boolean,
) {
  const width = 640;
  const marks: Mark[] = [];
  const labels: {
    x: number;
    y: number;
    text: string;
    anchor: "middle" | "end" | "start";
  }[] = [];
  const label = (
    x: number,
    y: number,
    text: string | number,
    anchor: "middle" | "end" | "start" = "middle",
  ) => labels.push({ x, y, text: String(text), anchor });
  const legend = data.series.map((series, index) => ({
    label: series.name,
    color: series.color
      ? resolveColorValue(series.color)
      : palette[index % palette.length],
  }));
  const colorAt = (index: number) => palette[index % palette.length];
  const path = (d: string, fill = "none", stroke?: string, opacity?: number) =>
    marks.push({ path: d, fill, stroke, opacity });

  if (type === "pie" || type === "doughnut") {
    const values = (data.series[0]?.data ?? []).map((value) =>
      Math.max(0, value),
    );
    const total = values.reduce((sum, value) => sum + value, 0);
    const radius = height * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;
    const point = (r: number, angle: number) => [
      centerX + r * Math.cos(angle),
      centerY + r * Math.sin(angle),
    ];
    let start = -Math.PI / 2;
    values.forEach((value, index) => {
      if (!value || !total) return;
      const sweep = (2 * Math.PI * value) / total;
      const end = start + Math.min(sweep, 2 * Math.PI - 0.0001);
      const inner = type === "doughnut" ? radius * 0.55 : 0;
      const large = sweep > Math.PI ? 1 : 0;
      const tail = inner
        ? `L ${point(inner, end)} A ${inner},${inner} 0 ${large} 0 ${point(inner, start)}`
        : `L ${centerX},${centerY}`;
      path(
        `M ${point(radius, start)} A ${radius},${radius} 0 ${large} 1 ${point(radius, end)} ${tail} Z`,
        colorAt(index),
        "white",
      );
      if (showValues) {
        const [x, y] = point(radius * 0.75, (start + end) / 2);
        label(x, y, value);
      }
      start += sweep;
    });
    return {
      marks,
      labels,
      legend: values.map((_, index) => ({
        label: data.labels[index] ?? String(index + 1),
        color: colorAt(index),
      })),
      width,
      height,
    };
  }

  const left = type === "horizontal-bar" ? 120 : 48;
  const right = width - 28;
  const top = 24;
  const bottom = height - 34;
  const values = data.series.flatMap((series) => series.data);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const groupCount = Math.max(
    1,
    data.labels.length,
    ...data.series.map((series) => series.data.length),
  );
  const groupWidth = (right - left) / groupCount;
  const groupHeight = (bottom - top) / groupCount;
  const x = (index: number) => left + groupWidth * (index + 0.5);
  const y = (value: number) =>
    bottom - ((value - min) / (max - min)) * (bottom - top);
  const scaleX = (value: number) =>
    left + ((value - min) / (max - min)) * (right - left);
  const horizontal = type === "horizontal-bar";
  path(
    horizontal
      ? `M ${left} ${top} V ${bottom} H ${right} M ${scaleX(0)} ${top} V ${bottom}`
      : `M ${left} ${top} V ${y(0)} H ${right}`,
    "none",
    "#cbd5e1",
  );
  data.labels.forEach((item, index) =>
    horizontal
      ? label(left - 10, top + groupHeight * (index + 0.5) + 4, item, "end")
      : label(x(index), height - 10, item),
  );
  const isLine = (index: number) =>
    type === "line" ||
    type === "area" ||
    (type === "combo" &&
      (data.series[index].type ??
        (index === data.series.length - 1 ? "line" : "column")) === "line");
  const columns = data.series.filter((_, index) => !isLine(index));
  data.series.forEach((series, index) => {
    if (isLine(index)) return;
    const columnIndex = columns.indexOf(series);
    const size =
      ((horizontal ? groupHeight : groupWidth) * 0.68) / columns.length;
    series.data.forEach((value, valueIndex) => {
      const fill =
        type === "bar" || series.color || columns.length > 1
          ? legend[index].color
          : colorAt(valueIndex);
      if (horizontal) {
        const rowY =
          top +
          groupHeight * (valueIndex + 0.5) +
          (columnIndex - columns.length / 2) * size;
        marks.push({
          x: Math.min(scaleX(0), scaleX(value)),
          y: rowY,
          width: Math.abs(scaleX(value) - scaleX(0)),
          height: Math.max(1, size - 3),
          fill,
        });
        if (showValues)
          label(
            scaleX(value) + (value < 0 ? -4 : 4),
            rowY + size / 2 + 4,
            value,
            value < 0 ? "end" : "start",
          );
      } else {
        const columnX =
          x(valueIndex) + (columnIndex - columns.length / 2) * size;
        marks.push({
          x: columnX,
          y: Math.min(y(0), y(value)),
          width: Math.max(1, size - 3),
          height: Math.abs(y(0) - y(value)),
          fill,
        });
        if (showValues) label(columnX + size / 2, y(value) - 6, value);
      }
    });
  });
  data.series.forEach((series, index) => {
    if (!isLine(index) || !series.data.length) return;
    const coordinates = series.data.map(
      (value, valueIndex) => `${x(valueIndex)},${y(value)}`,
    );
    const trace = `M ${coordinates.join(" L ")}`;
    if (type === "area") {
      path(
        `${trace} L ${x(coordinates.length - 1)},${y(0)} L ${x(0)},${y(0)} Z`,
        legend[index].color,
        undefined,
        0.28,
      );
    }
    path(trace, "none", legend[index].color);
    if (showValues)
      series.data.forEach((value, valueIndex) =>
        label(x(valueIndex), y(value) - 8, value),
      );
  });
  return { marks, labels, legend, width, height };
}
