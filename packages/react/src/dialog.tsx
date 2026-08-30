import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { BaseUIProps, DialogPosition } from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Button } from "./actions";

export interface DialogProps extends BaseUIProps {
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
  const flow = useFlowProps("fui-dialog", props);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    onOpenRef.current?.();
    const handler = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeOnEscape]);
  if (!open) return null;
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
