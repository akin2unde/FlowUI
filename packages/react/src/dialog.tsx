import {
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import type { BaseUIProps, DialogPosition } from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Button } from "./actions";

export interface DialogProps
  extends BaseUIProps, Omit<HTMLAttributes<HTMLElement>, keyof BaseUIProps> {
  contentRef?: Ref<HTMLElement>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  ariaLabel?: string;

  open: boolean;
  position?: DialogPosition;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  scrollableBody?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  onOpen?: () => void;
  onClose: () => void;
}
export function Dialog({
  open,
  contentRef,
  initialFocusRef,
  returnFocusRef,
  trapFocus = true,
  restoreFocus = true,
  ariaLabel,
  position = "center",
  header,
  body,
  footer,
  scrollableBody = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  onOpen,
  onClose,
  ...props
}: DialogProps) {
  const panel = useRef<HTMLElement>(null);
  const flow = useFlowProps("fui-dialog", props);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const element = panel.current;
    const focusables = () =>
      Array.from(
        element?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(
        (node) => !node.hidden && node.getAttribute("aria-hidden") !== "true",
      );
    onOpenRef.current?.();
    if (initialFocusRef?.current) initialFocusRef.current.focus();
    else if (!element?.contains(document.activeElement))
      (focusables()[0] ?? element)?.focus();
    const handler = (event: KeyboardEvent) => {
      if (
        Array.from(
          document.querySelectorAll('[role="dialog"][aria-modal="true"]'),
        ).at(-1) !== element
      )
        return;
      if (closeOnEscape && event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        onCloseRef.current();
      }
      if (trapFocus && event.key === "Tab") {
        const targets = focusables();
        const first = targets[0];
        const last = targets.at(-1);
        if (!first) {
          event.preventDefault();
          element?.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first ||
            !element?.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !element?.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      if (restoreFocus) (returnFocusRef?.current ?? previous)?.focus();
    };
  }, [
    open,
    closeOnEscape,
    trapFocus,
    restoreFocus,
    initialFocusRef,
    returnFocusRef,
  ]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fui-dialog-overlay"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget)
          onClose();
      }}
    >
      <section
        {...flow}
        ref={(element) => {
          panel.current = element;
          if (typeof contentRef === "function") contentRef(element);
          else if (contentRef) contentRef.current = element;
        }}
        tabIndex={-1}
        aria-label={ariaLabel ?? props["aria-label"]}
        data-position={position}
        role="dialog"
        aria-modal="true"
      >
        <header className="fui-dialog-header">
          <div>{header}</div>
          {showCloseButton && (
            <Button
              variant="ghost"
              icon="fa-solid fa-xmark"
              iconPosition="center"
              ariaLabel="Close dialog"
              onClick={onClose}
            />
          )}
        </header>
        <div
          className={`fui-dialog-body${scrollableBody ? " fui-dialog-body-scroll" : ""}`}
        >
          {body}
        </div>
        {footer && <footer className="fui-dialog-footer">{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
}
