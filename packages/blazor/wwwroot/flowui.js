export function revealPassword(element, revealed) {
    const start = element.selectionStart, end = element.selectionEnd;
    element.type = revealed ? 'text' : 'password';
    element.focus({ preventScroll: true });
    if (start !== null) element.setSelectionRange(start, end);
}
export function autoGrow(element, rows) {
    const style = getComputedStyle(element);
    const line = parseFloat(style.lineHeight) || 20;
    const min = line * rows + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 2;
    element.style.height = 'auto';
    element.style.height = Math.max(min, element.scrollHeight + 2) + 'px';
}
export function setIndeterminate(element, mixed) { element.indeterminate = mixed; }
const menus = new WeakMap();
export function openMenu(root, trigger, panel, receiver, anchor) {
    closeMenu(root);
    function position() {
        const rect = (anchor || trigger).getBoundingClientRect(), margin = 8;
        const width = Math.min(Math.max(rect.width, 180), innerWidth - margin * 2);
        panel.style.width = width + 'px';
        panel.style.left = Math.max(margin, Math.min(rect.left, innerWidth - width - margin)) + 'px';
        const below = innerHeight - rect.bottom - margin, above = rect.top - margin;
        const upwards = below < Math.min(panel.scrollHeight, 260) && above > below;
        panel.style.maxHeight = Math.max(80, Math.min(340, upwards ? above : below)) + 'px';
        panel.style.top = upwards ? '' : (rect.bottom + 4) + 'px';
        panel.style.bottom = upwards ? (innerHeight - rect.top + 4) + 'px' : '';
    }
    const outside = event => { if (!root.contains(event.target)) receiver.invokeMethodAsync('CloseFromOutside').catch(() => {}); };
    const focus = event => { if (!root.contains(event.target)) receiver.invokeMethodAsync('CloseFromOutside').catch(() => {}); };
    const key = event => {
        if (['ArrowDown', 'ArrowUp', 'Escape'].includes(event.key) || (event.target === trigger && ['Home', 'End'].includes(event.key)) ||
            ((event.key === 'Enter' || event.key === ' ') && event.target === trigger)) event.preventDefault();
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('focusin', focus, true);
    root.addEventListener('keydown', key);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    menus.set(root, { outside, focus, key, position });
    position();
}
export function closeMenu(root) {
    const menu = menus.get(root);
    if (!menu) return;
    document.removeEventListener('pointerdown', menu.outside, true);
    document.removeEventListener('focusin', menu.focus, true);
    root.removeEventListener('keydown', menu.key);
    window.removeEventListener('resize', menu.position);
    window.removeEventListener('scroll', menu.position, true);
    menus.delete(root);
}
export function focusElement(element) { element.focus({ preventScroll: true }); }
export function scrollOption(panel, index) {
    const option = panel.querySelector('[data-index="' + index + '"]');
    option?.scrollIntoView({ block: 'nearest' });
}

const menuKeys = new WeakMap();
export function prepareMenuKeys(root, trigger) {
    if (menuKeys.has(root)) return;
    const key = event => {
        const isSearch = event.target.tagName === 'INPUT';
        if (['ArrowDown', 'ArrowUp', 'Escape'].includes(event.key) ||
            (!isSearch && ['Home', 'End'].includes(event.key)) || (isSearch && event.key === 'Enter')) event.preventDefault();
    };
    root.addEventListener('keydown', key);
    menuKeys.set(root, key);
}
export function disposeMenu(root) {
    closeMenu(root);
    const key = menuKeys.get(root);
    if (key) root.removeEventListener('keydown', key);
    menuKeys.delete(root);
}

const readonlyFields = new WeakMap();
export function protectReadOnly(root, readonly) {
    const previous = readonlyFields.get(root);
    if (previous) root.removeEventListener('keydown', previous);
    readonlyFields.delete(root);
    if (readonly) {
        const key = event => { if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault(); };
        root.addEventListener('keydown', key); readonlyFields.set(root, key);
    }
}
