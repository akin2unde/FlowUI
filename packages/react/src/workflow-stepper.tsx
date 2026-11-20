import type {
  FlowAction,
  FlowStage,
  WorkflowStepperProps as CoreProps,
} from "@akin2unde/flowui-core";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useDismissableLayer, useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface WorkflowStepperProps extends CoreProps {
  onStageClick?: (stage: FlowStage) => void;
  onActionChange?: (stage: FlowStage, action: FlowAction) => void;
}

export const WorkflowStepper = ({
  stages,
  direction = "horizontal",
  labelPosition = "below",
  lineColor,
  stageTextStyle,
  completedStyle,
  currentStyle,
  disabledStyle,
  actionMenuStyle,
  actionItemStyle,
  checkmarkStyle,
  chevronStyle,
  onStageClick,
  onActionChange,
  ...props
}: WorkflowStepperProps) => {
  const root = useRef<HTMLOListElement>(null);
  const menuId = useId();
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  }>();
  const [openId, setOpenId] = useState<string>();
  const [selections, setSelections] = useState<Record<string, FlowAction>>({});
  const [hovered, setHovered] = useState<number>();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openId !== undefined)
      (
        popup.current?.querySelector<HTMLButtonElement>(
          "button[aria-pressed=true]:not(:disabled)",
        ) ??
        popup.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      )?.focus();
  }, [openId]);
  const flow = useFlowProps("fui-workflow", props);
  useDismissableLayer(root, openId !== undefined, () => setOpenId(undefined));

  return (
    <div
      className="fui-workflow-scroll"
      data-direction={direction}
      onScroll={() => setOpenId(undefined)}
    >
      <ol
        {...flow}
        ref={root}
        data-direction={direction}
        data-label-position={labelPosition}
        onKeyDown={(event) => {
          if (event.key === "Escape" && openId !== undefined) {
            setOpenId(undefined);
            trigger.current?.focus();
          }
        }}
      >
        {stages.map((stage, index) => {
          const actions = stage.Actions ?? [];
          const selection = stage.SelectedAction ?? selections[stage.Id];
          const selected = actions.find(
            (item) => item === selection || item.Label === selection?.Label,
          );
          const canPick =
            stage.IsCurrent && !stage.IsDisabled && actions.length > 1;
          const open = canPick && openId === stage.Id;
          const stateStyle = stage.IsCurrent
            ? currentStyle
            : stage.IsCompleted
              ? completedStyle
              : undefined;
          const appearance = {
            ...stateStyle,
            ...(stage.IsDisabled ? disabledStyle : undefined),
          };
          const textStyle = {
            ...stageTextStyle,
            ...stateStyle?.textStyle,
            ...(stage.IsDisabled ? disabledStyle?.textStyle : undefined),
            ...stage.TextStyle,
          };
          const label = stage.IsCurrent
            ? (selected?.Label ?? stage.Label)
            : stage.Label;
          const icon =
            appearance.icon ??
            (stage.IsCompleted && !stage.IsCurrent
              ? "fa-solid fa-check"
              : undefined);
          const contents = (
            <>
              {icon && (
                <Icon
                  icon={icon}
                  style={{
                    color: appearance.iconStyle?.color,
                    fontSize: appearance.iconStyle?.size,
                  }}
                />
              )}
              <span className="fui-workflow-label" style={textStyle}>
                {label}
              </span>
            </>
          );

          return (
            <li
              key={stage.Id}
              className="fui-workflow-stage"
              data-current={stage.IsCurrent}
              data-completed={stage.IsCompleted}
              data-disabled={stage.IsDisabled}
              aria-current={stage.IsCurrent ? "step" : undefined}
            >
              {index < stages.length - 1 && (
                <span
                  className="fui-workflow-line"
                  style={{ backgroundColor: lineColor }}
                  aria-hidden="true"
                />
              )}
              <div
                className="fui-workflow-box"
                style={
                  stage.IsCurrent
                    ? { backgroundColor: appearance.backgroundColor }
                    : ({
                        "--fui-workflow-marker-bg": appearance.backgroundColor,
                      } as CSSProperties)
                }
              >
                {onStageClick && !stage.IsDisabled ? (
                  <button
                    className="fui-workflow-main"
                    type="button"
                    onClick={() => {
                      setOpenId(undefined);
                      onStageClick(stage);
                    }}
                  >
                    {contents}
                  </button>
                ) : (
                  <span className="fui-workflow-main">{contents}</span>
                )}
                {canPick && (
                  <button
                    type="button"
                    className="fui-workflow-chevron"
                    aria-label={`Actions for ${stage.Label}`}
                    aria-expanded={open}
                    aria-controls={open ? menuId : undefined}
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      const box =
                        event.currentTarget.parentElement!.getBoundingClientRect();
                      setMenuPosition({
                        top: box.bottom + 4,
                        right: Math.max(
                          8,
                          window.innerWidth - Math.max(box.right, 208),
                        ),
                      });
                      setHovered(undefined);
                      setOpenId(open ? undefined : stage.Id);
                    }}
                  >
                    <Icon
                      icon="fa-solid fa-chevron-down"
                      style={{
                        color: chevronStyle?.color,
                        fontSize: chevronStyle?.size,
                      }}
                    />
                  </button>
                )}
                {open && (
                  <div
                    ref={popup}
                    className="fui-workflow-menu"
                    id={menuId}
                    role="group"
                    aria-label={`Actions for ${stage.Label}`}
                    style={{
                      ...actionMenuStyle,
                      ...menuPosition,
                      position: "fixed",
                      minWidth: "12rem",
                    }}
                  >
                    {actions.map((action, actionIndex) => {
                      const active = action === selected;
                      const row = action.IsReadonly
                        ? actionItemStyle?.readonly
                        : hovered === actionIndex
                          ? actionItemStyle?.hover
                          : undefined;
                      const selectedStyle = active
                        ? actionItemStyle?.selected
                        : undefined;
                      const iconStyle = {
                        ...actionItemStyle?.iconStyle,
                        ...selectedStyle?.iconStyle,
                        ...row?.iconStyle,
                        ...action.IconStyle,
                      };
                      return (
                        <button
                          key={actionIndex}
                          type="button"
                          disabled={action.IsReadonly}
                          aria-pressed={active}
                          className="fui-workflow-option"
                          style={{
                            backgroundColor:
                              row?.backgroundColor ??
                              selectedStyle?.backgroundColor ??
                              actionItemStyle?.backgroundColor,
                            ...actionItemStyle?.textStyle,
                            ...selectedStyle?.textStyle,
                            ...row?.textStyle,
                            ...action.TextStyle,
                          }}
                          onMouseEnter={() => setHovered(actionIndex)}
                          onMouseLeave={() => setHovered(undefined)}
                          onClick={() => {
                            if (stage.SelectedAction === undefined)
                              setSelections((current) => ({
                                ...current,
                                [stage.Id]: action,
                              }));
                            setOpenId(undefined);
                            trigger.current?.focus();
                            onActionChange?.(stage, action);
                          }}
                        >
                          {(action.Icon || action.IsReadonly) && (
                            <Icon
                              icon={action.Icon ?? "fa-solid fa-lock"}
                              style={{
                                color: iconStyle.color,
                                fontSize: iconStyle.size,
                              }}
                            />
                          )}
                          <span>{action.Label}</span>
                          {active && (
                            <Icon
                              icon="fa-solid fa-check"
                              className="fui-workflow-check"
                              style={{
                                color: checkmarkStyle?.color,
                                fontSize: checkmarkStyle?.size,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
