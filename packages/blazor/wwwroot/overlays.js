const modals = new WeakMap(), opened = new Set();
let previousOverflow;
function lock(dialog) { if (!opened.size) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; } opened.add(dialog); }
function unlock(dialog) { opened.delete(dialog); if (!opened.size) document.body.style.overflow = previousOverflow ?? ''; }
export function syncModal(dialog, open, escape, backdrop, receiver) {
    let state = modals.get(dialog);
    if (!state) {
        state = { receiver, escape, backdrop, outside: false };
        state.cancel = event => { event.preventDefault(); if (state.escape) state.receiver.invokeMethodAsync('RequestClose', 'escape').catch(() => {}); };
        const outside = event => { const r = dialog.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
        state.down = event => { state.outside = event.target === dialog && outside(event); };
        state.click = event => { if (state.outside && event.target === dialog && outside(event) && state.backdrop) state.receiver.invokeMethodAsync('RequestClose', 'backdrop').catch(() => {}); state.outside = false; };
        dialog.addEventListener('cancel', state.cancel); dialog.addEventListener('pointerdown', state.down); dialog.addEventListener('click', state.click); modals.set(dialog, state);
    }
    Object.assign(state, {receiver, escape, backdrop});
    if (open && !dialog.open) { dialog.showModal(); lock(dialog); }
    if (!open && dialog.open) { dialog.close(); unlock(dialog); }
}
export function disposeModal(dialog) { const state = modals.get(dialog); if (state) { dialog.removeEventListener('cancel', state.cancel); dialog.removeEventListener('pointerdown', state.down); dialog.removeEventListener('click', state.click); modals.delete(dialog); } if (dialog.open) dialog.close(); if (opened.has(dialog)) unlock(dialog); }
const popovers = new WeakMap();
export function openPopover(root, trigger, panel, receiver) {
    closePopover(root);
    const position = () => { const r = trigger.getBoundingClientRect(); const width = Math.min(320, innerWidth - 16); panel.style.width = width + 'px'; panel.style.left = Math.max(8, Math.min(r.left, innerWidth - width - 8)) + 'px'; const up = innerHeight - r.bottom < panel.offsetHeight + 12 && r.top > panel.offsetHeight; panel.style.top = (up ? r.top - panel.offsetHeight - 6 : r.bottom + 6) + 'px'; panel.style.maxHeight = Math.max(80, innerHeight - 24) + 'px'; };
    const outside = e => { if (!root.contains(e.target)) receiver.invokeMethodAsync('CloseFromOutside').catch(() => {}); };
    document.addEventListener('pointerdown', outside, true); document.addEventListener('focusin', outside, true); window.addEventListener('resize', position); window.addEventListener('scroll', position, true); popovers.set(root, {position, outside}); position();
}
export function closePopover(root) { const state = popovers.get(root); if (!state) return; document.removeEventListener('pointerdown', state.outside, true); document.removeEventListener('focusin', state.outside, true); window.removeEventListener('resize', state.position); window.removeEventListener('scroll', state.position, true); popovers.delete(root); }
export function focusId(id) { document.getElementById(id)?.focus(); }
export function focusTreeItem(root, index) { requestAnimationFrame(() => root.querySelector('[data-index="' + index + '"]')?.focus()); }
export function prepareNavigationKeys(root, kind) { if (root.dataset.fuiKeys) return; root.dataset.fuiKeys = kind; root.addEventListener('keydown', e => { const keys = kind === 'tree' ? ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End',' '] : ['ArrowLeft','ArrowRight','Home','End']; if (keys.includes(e.key)) e.preventDefault(); }); }
