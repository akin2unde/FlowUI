import type { DateTimeMode } from "./contracts";

const pad = (value: number): string => String(value).padStart(2, "0");

/** Formats a Date for native date/time controls without converting it to UTC. */
export function formatLocalDateTime(
  value: Date,
  mode: DateTimeMode = "datetime",
): string {
  const date = `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  const time = `${pad(value.getHours())}:${pad(value.getMinutes())}`;

  if (mode === "date") return date;
  if (mode === "time") return time;
  return `${date}T${time}`;
}

export function setLocalDayBoundary(
  value: string | undefined,
  boundary: "start" | "end",
): string {
  const datePart =
    value?.split("T")[0] || formatLocalDateTime(new Date(), "date");
  return `${datePart}T${boundary === "start" ? "00:00" : "23:59"}`;
}
