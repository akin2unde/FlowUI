import { afterEach, expect, it, vi } from "vitest";
import { createNotificationTimer, notificationDuration } from "./notification";

afterEach(() => vi.useRealTimers());

it("uses finite per-type defaults and reserves zero for decisions", () => {
  expect(notificationDuration("success")).toBe(4000);
  expect(notificationDuration("info", 0)).toBe(5000);
  expect(notificationDuration("warning", Infinity)).toBe(7000);
  expect(notificationDuration("error", -1, 12000)).toBe(12000);
  expect(notificationDuration("success", 2000, 12000)).toBe(2000);
  expect(notificationDuration("decision", 2000)).toBe(0);
});

it("preserves the remaining time when paused and closes only once", () => {
  vi.useFakeTimers();
  const onElapsed = vi.fn();
  const timer = createNotificationTimer(4000, onElapsed);
  timer.resume();
  vi.advanceTimersByTime(3000);
  timer.pause();
  vi.advanceTimersByTime(10000);
  expect(onElapsed).not.toHaveBeenCalled();
  timer.resume();
  vi.advanceTimersByTime(999);
  expect(onElapsed).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  timer.resume();
  vi.advanceTimersByTime(10000);
  expect(onElapsed).toHaveBeenCalledTimes(1);
});

it("does not schedule decisions or disposed notifications", () => {
  vi.useFakeTimers();
  const onElapsed = vi.fn();
  createNotificationTimer(0, onElapsed).resume();
  const timer = createNotificationTimer(4000, onElapsed);
  timer.resume();
  timer.dispose();
  timer.resume();
  vi.runAllTimers();
  expect(onElapsed).not.toHaveBeenCalled();
});
