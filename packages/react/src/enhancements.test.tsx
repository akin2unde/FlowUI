// @vitest-environment jsdom
import { act, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import {
  Button,
  Input,
  Label,
  TextArea,
  PasswordInput,
  HStack,
  FlowUIProvider,
  Dropdown,
  Dialog,
  Popover,
  Table,
} from "./index";
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement, root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
const render = async (children: React.ReactNode) =>
  act(async () => root.render(<FlowUIProvider>{children}</FlowUIProvider>));
it("forwards native attributes/events and input refs without leaking theme props", async () => {
  const ref = createRef<HTMLInputElement>(),
    onKeyDown = vi.fn(),
    onBlur = vi.fn();
  await render(
    <Input
      ref={ref}
      id="amount"
      type="number"
      defaultValue="4"
      min={2}
      max={10}
      step={2}
      aria-label="Amount"
      data-owner="finance"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      padding={12}
    />,
  );
  const input = host.querySelector("input")!;
  expect(ref.current).toBe(input);
  expect(input.value).toBe("4");
  expect(input.min).toBe("2");
  expect(input.max).toBe("10");
  expect(input.step).toBe("2");
  expect(input.getAttribute("aria-label")).toBe("Amount");
  expect(input.dataset.owner).toBe("finance");
  expect(input.hasAttribute("padding")).toBe(false);
  await act(async () =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(onKeyDown).toHaveBeenCalledOnce();
  input.focus();
  await act(async () => input.blur());
  expect(onBlur).toHaveBeenCalledOnce();
});
it("validates min/max/step for numeric modes without clamping", async () => {
  await render(
    <Input inputMode="decimal" value="11" min={2} max={10} step={2} />,
  );
  const input = host.querySelector("input")!;
  expect(input.value).toBe("11");
  expect(input.checkValidity()).toBe(false);
  await render(
    <Input inputMode="decimal" value="6" min={2} max={10} step={2} />,
  );
  expect(input.checkValidity()).toBe(true);
  await render(
    <Input inputMode="decimal" value="5" min={2} max={10} step={2} />,
  );
  expect(input.checkValidity()).toBe(false);
});
it("keeps label associations, textarea limits/defaults and password props on the actual fields", async () => {
  const area = createRef<HTMLTextAreaElement>(),
    password = createRef<HTMLInputElement>();
  await render(
    <>
      <Label htmlFor="notes">Notes</Label>
      <TextArea
        id="notes"
        ref={area}
        defaultValue="Hello"
        maxLength={12}
        minLength={3}
        spellCheck
        aria-describedby="help"
      />
      <PasswordInput
        ref={password}
        defaultValue="pass"
        minLength={4}
        aria-label="Password"
      />
    </>,
  );
  expect(host.querySelector<HTMLLabelElement>("label")!.control).toBe(
    area.current,
  );
  expect(area.current?.value).toBe("Hello");
  expect(area.current?.maxLength).toBe(12);
  expect(area.current?.getAttribute("aria-describedby")).toBe("help");
  expect(password.current?.tagName).toBe("INPUT");
  expect(password.current?.minLength).toBe(4);
  expect(password.current?.getAttribute("aria-label")).toBe("Password");
});
it("supports self-closing buttons, children precedence, native button events and stack props", async () => {
  const button = createRef<HTMLButtonElement>(),
    down = vi.fn(),
    stack = createRef<HTMLElement>();
  await render(
    <HStack ref={stack} role="group" aria-label="Actions">
      <Button
        ref={button}
        text="Hello"
        aria-expanded={true}
        onMouseDown={down}
      />
      <Button text="Fallback">Children</Button>
    </HStack>,
  );
  expect(button.current?.textContent).toBe("Hello");
  expect(button.current?.getAttribute("aria-expanded")).toBe("true");
  expect(stack.current?.getAttribute("role")).toBe("group");
  expect(host.textContent).not.toContain("Fallback");
  await act(async () =>
    button.current?.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    ),
  );
  expect(down).toHaveBeenCalledOnce();
});
it("renders dropdown form values, labels, colors and keyboard selection", async () => {
  const trigger = createRef<HTMLButtonElement>(),
    changed = vi.fn();
  await render(
    <form>
      <Label htmlFor="tenant">Tenant</Label>
      <Dropdown
        id="tenant"
        triggerRef={trigger}
        name="tenant"
        required
        options={[
          { value: "a", display: "Alpha", other: null },
          { value: "b", display: "Beta", other: null, disabled: true },
        ]}
        onChange={changed}
        backgroundColor="#123456"
        textColor="#ffffff"
        iconColor="#ff0000"
      />
    </form>,
  );
  expect(host.querySelector<HTMLLabelElement>("label")!.control).toBe(
    trigger.current,
  );
  expect(host.querySelector("form")!.checkValidity()).toBe(false);
  expect(
    host
      .querySelector<HTMLElement>(".fui-select")!
      .style.getPropertyValue("--fui-control-icon"),
  ).toBe("#ff0000");
  await act(async () =>
    trigger.current?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    ),
  );
  await act(async () =>
    trigger.current?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(changed).toHaveBeenCalledWith(expect.objectContaining({ value: "a" }));
  expect(new FormData(host.querySelector("form")!).get("tenant")).toBe("a");
  expect(host.querySelector("form")!.checkValidity()).toBe(true);
});
it("renders table templates and preserves cells by stable row key across reorder", async () => {
  const a = { Code: "A", Name: "Alpha" },
    b = { Code: "B", Name: "Beta" };
  const columns = [
    {
      field: "Name" as const,
      header: "Name",
      renderHeader: () => <strong>Custom heading</strong>,
      renderCell: (_: unknown, row: typeof a) => (
        <Input defaultValue={row.Name} />
      ),
    },
  ];
  await render(
    <Table
      data={[a, b]}
      columns={columns}
      rowKey="Code"
      selectedRowKey="A"
      selectionEnabled
      rowClassName={(row) => (row.Code === "A" ? "active" : "")}
    />,
  );
  const first = host.querySelector("tbody input");
  expect(host.querySelector('tr[data-selected="true"]')?.className).toBe(
    "active",
  );
  expect(host.textContent).toContain("Custom heading");
  await render(
    <Table
      data={[{ ...b }, { ...a }]}
      columns={columns}
      rowKey="Code"
      selectedRowKey="A"
      selectionEnabled
    />,
  );
  expect(host.querySelectorAll("tbody input")[1]).toBe(first);
  expect(host.querySelector('tr[data-selected="true"] input')).toBe(first);
});
it("composes popover trigger handlers and Escape restores focus", async () => {
  const clicked = vi.fn();
  await render(
    <Popover trigger={<Button onClick={clicked} text="Open" />}>
      <Input aria-label="Inside" />
    </Popover>,
  );
  const trigger = host.querySelector("button")!;
  await act(async () => trigger.click());
  expect(clicked).toHaveBeenCalledOnce();
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  await act(async () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(host.querySelector(".fui-popover-content")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
it("names dialogs, traps focus and restores the opener on close", async () => {
  const opener = document.createElement("button");
  document.body.append(opener);
  opener.focus();
  const input = createRef<HTMLInputElement>();
  await render(
    <Dialog
      open
      ariaLabel="Edit ticket"
      body={
        <>
          <Input ref={input} />
          <Button text="Save" />
        </>
      }
      initialFocusRef={input}
      onClose={() => {}}
    />,
  );
  const dialog = document.querySelector('[role="dialog"]')!;
  expect(dialog.getAttribute("aria-label")).toBe("Edit ticket");
  expect(document.activeElement).toBe(input.current);
  const buttons = dialog.querySelectorAll("button");
  buttons[buttons.length - 1].focus();
  await act(async () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.activeElement).toBe(buttons[0]);
  await render(<Dialog open={false} onClose={() => {}} />);
  expect(document.activeElement).toBe(opener);
  opener.remove();
});
