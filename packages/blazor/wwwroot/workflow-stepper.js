const dismissals = new WeakMap();

export function positionMenu(root, callback) {
  closeMenu(root);
  const menu = root.querySelector(".fui-workflow-menu");
  const trigger = root.querySelector("[aria-expanded=true].fui-workflow-chevron");
  if (!menu || !trigger) return;
  const bounds = trigger.parentElement.getBoundingClientRect();
  const width = menu.offsetWidth;
  const height = menu.offsetHeight;
  menu.style.left = `${Math.max(8, Math.min(bounds.right - width, window.innerWidth - width - 8))}px`;
  menu.style.right = "auto";
  menu.style.top = `${Math.max(8, bounds.bottom + 4 + height <= window.innerHeight
    ? bounds.bottom + 4 : bounds.top - height - 4)}px`;
  (menu.querySelector('[aria-pressed=true]:not(:disabled)') ?? menu.querySelector('button:not(:disabled)'))?.focus();
  const token = new AbortController();
  dismissals.set(root, token);
  const dismiss = (focus = false) => {
    closeMenu(root);
    if (focus) trigger.focus();
    void callback.invokeMethodAsync("DismissActionMenu");
  };
  document.addEventListener("pointerdown", (event) => {
    if (!trigger.parentElement.contains(event.target)) dismiss();
  }, { signal: token.signal });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dismiss(true);
  }, { signal: token.signal });
  window.addEventListener("resize", () => dismiss(), { signal: token.signal });
}

export function closeMenu(root) {
  dismissals.get(root)?.abort();
  dismissals.delete(root);
}
