// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  DateTime,
  Divider,
  FlowUIProvider,
  Input,
  Table,
  WorkflowStepper,
} from "./index";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

const click = (selector: string) =>
  act(async () => host.querySelector<HTMLElement>(selector)!.click());
const outsideClick = () =>
  act(async () =>
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })),
  );

it("opens only the selected date/time mode and dismisses it on an outside click", async () => {
  await act(async () =>
    root.render(
      <FlowUIProvider>
        <DateTime mode="time" value="09:30" backgroundColor="#faf5ff" />
      </FlowUIProvider>,
    ),
  );
  expect(host.querySelector('[aria-label="Choose date"]')).toBeNull();
  expect(
    host.querySelector<HTMLElement>(".fui-date-time")?.style.backgroundColor,
  ).toBe("");
  expect(
    host.querySelector<HTMLElement>(".fui-date-time-field")?.style
      .backgroundColor,
  ).toBe("rgb(250, 245, 255)");
  const trigger = host.querySelector('button[aria-label="Choose time"]');
  expect(trigger?.querySelector(".fa-chevron-down")).toBeTruthy();
  await click('button[aria-label="Choose time"]');
  expect(trigger?.querySelector(".fa-chevron-up")).toBeTruthy();
  await click('button[aria-label="Choose time"]');
  expect(host.querySelector(".fui-time-panel")).toBeNull();
  await click('button[aria-label="Choose time"]');
  expect(host.querySelector(".fui-time-panel")).not.toBeNull();
  await outsideClick();
  expect(host.querySelector(".fui-time-panel")).toBeNull();
});

it("lets a user hide and restore a table column and dismiss the picker", async () => {
  const loadMore = vi.fn();
  await act(async () =>
    root.render(
      <FlowUIProvider>
        <Table
          data={[{ name: "Rice", price: 10 }]}
          columns={[
            { field: "name", header: "Product" },
            { field: "price", header: "Price" },
          ]}
          columnsConfigurable
          totalCount={2}
          onLoadMore={loadMore}
        />
      </FlowUIProvider>,
    ),
  );
  await click('button[aria-label="Toggle options"]');
  await click('[role="option"]:nth-child(2)');
  expect(host.querySelectorAll("th")).toHaveLength(1);
  await click('[role="option"]:nth-child(2)');
  expect(host.querySelectorAll("th")).toHaveLength(2);
  await outsideClick();
  expect(host.querySelector('[role="listbox"]')).toBeNull();
  await click(".fui-table-load-more button");
  expect(loadMore).toHaveBeenCalledOnce();
});

it("renders a custom load-more footer with its own action", async () => {
  const handleClick = vi.fn();
  await act(async () =>
    root.render(
      <FlowUIProvider>
        <Table
          data={[{ name: "Rice" }]}
          columns={[{ field: "name", header: "Product" }]}
          totalCount={2}
          renderLoadMore={({ loadedCount, hasMore }) => (
            <footer>
              <span>{loadedCount} records loaded</span>
              {hasMore && <button onClick={handleClick}>Next batch</button>}
            </footer>
          )}
        />
      </FlowUIProvider>,
    ),
  );
  expect(host.querySelector("footer")?.textContent).toContain(
    "1 records loaded",
  );
  expect(host.querySelector(".fui-table-load-more")).toBeNull();
  await click("footer button");
  expect(handleClick).toHaveBeenCalledOnce();
});

it("applies layout styles to the visible control and divider color to the line", async () => {
  await act(async () =>
    root.render(
      <FlowUIProvider>
        <Input inputMode="money" width="50%" aria-label="Amount" />
        <WorkflowStepper stages={[]} width="50%" />
        <Divider backgroundColor="#e5d8f2" />
      </FlowUIProvider>,
    ),
  );

  const amount = host.querySelector<HTMLElement>(".fui-money-input");
  expect(amount?.style.width).toBe("50%");
  expect(amount?.querySelector("input")?.style.width).toBe("");
  expect(
    host.querySelector<HTMLElement>(".fui-workflow-scroll")?.style.width,
  ).toBe("50%");
  const divider = host.querySelector<HTMLElement>('[role="separator"]');
  expect(divider?.dataset.labeled).toBe("false");
  expect(divider?.style.getPropertyValue("--fui-control-background")).toBe(
    "#e5d8f2",
  );
});
