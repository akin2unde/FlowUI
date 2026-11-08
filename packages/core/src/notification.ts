import type { NotificationType } from "./contracts";

const defaultDurations = {
  success: 4000,
  info: 5000,
  warning: 7000,
  error: 8000,
};

export function notificationDuration(
  type: NotificationType,
  duration?: number,
  defaultDuration?: number,
): number {
  if (type === "decision") return 0;
  if (!(
    typeof duration === "number" &&
    Number.isFinite(duration) &&
    duration > 0
  ))
    duration = defaultDuration;
  return typeof duration === "number" &&
    Number.isFinite(duration) &&
    duration > 0
    ? Math.min(duration, 2_147_483_647)
    : defaultDurations[type];
}

export function createNotificationTimer(
  duration: number,
  onElapsed: () => void,
) {
  let remaining = duration;
  let started = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let done = false;

  return {
    resume() {
      if (done || timer !== undefined || duration === 0) return;
      started = Date.now();
      timer = setTimeout(() => {
        timer = undefined;
        done = true;
        onElapsed();
      }, remaining);
    },
    pause() {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, remaining - (Date.now() - started));
    },
    dispose() {
      done = true;
      clearTimeout(timer);
      timer = undefined;
    },
  };
}

export interface NotificationAction {
  label: string;
  onClick: () => void | Promise<void>;
}
