// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { WorkflowStepper, type FlowStage } from "./index";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

it("keeps stage clicks separate from selection and marks the selected action when reopened", async () => {
  const rootElement = document.createElement("div");
  document.body.append(rootElement);
  const root = createRoot(rootElement);
  const onStageClick = vi.fn();
  const onActionChange = vi.fn();
  const stages: FlowStage[] = [
    { Id: "oil", Label: "Oil checked", IsCompleted: true },
    {
      Id: "repair",
      Label: "Repair",
      IsCurrent: true,
      Actions: [
        { Label: "Start repair" },
        { Label: "Send for inspection" },
        { Label: "Cancel", IsReadonly: true },
      ],
    },
  ];

  try {
    await act(async () =>
      root.render(
        <WorkflowStepper
          stages={stages}
          onStageClick={onStageClick}
          onActionChange={onActionChange}
        />,
      ),
    );
    const click = async (selector: string) =>
      act(async () =>
        rootElement.querySelector<HTMLButtonElement>(selector)!.click(),
      );
    await click(".fui-workflow-main");
    expect(onStageClick).toHaveBeenCalledWith(stages[0]);

    await click(".fui-workflow-chevron");
    expect(onStageClick).toHaveBeenCalledTimes(1);
    await click(".fui-workflow-option:disabled");
    expect(onActionChange).not.toHaveBeenCalled();
    await click(".fui-workflow-option:nth-child(2)");
    expect(onActionChange).toHaveBeenCalledWith(
      stages[1],
      stages[1].Actions?.[1],
    );
    expect(
      rootElement.querySelector('[aria-current="step"] .fui-workflow-label')
        ?.textContent,
    ).toBe("Send for inspection");

    await click(".fui-workflow-chevron");
    expect(
      rootElement.querySelector('[aria-pressed="true"]')?.textContent,
    ).toContain("Send for inspection");
    expect(
      rootElement.querySelector('[aria-pressed="true"] .fui-workflow-check'),
    ).toBeTruthy();
  } finally {
    await act(async () => root.unmount());
    rootElement.remove();
  }
});
