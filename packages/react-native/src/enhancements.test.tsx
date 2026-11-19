// @vitest-environment jsdom
import React, { act, createRef, forwardRef } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { Button } from "./actions";
import { Input, PasswordInput, TextArea } from "./forms";

vi.mock("react-native", () => ({
  Platform: { OS: "web" },
  Switch: () => null,
  ActivityIndicator: () => null,
}));
vi.mock("./theme", () => ({
  useFlowUITheme: () => ({
    colors: {
      primary: "purple",
      primaryText: "white",
      text: "black",
      textMuted: "gray",
      surface: "white",
      border: "gray",
    },
    theme: {
      components: { inputHeight: 40, buttonHeight: 40, controlRadius: 6 },
      radius: { lg: 8 },
    },
  }),
}));
vi.mock("./primitives", () => ({ HStack: "div", VStack: "div", Text: "span" }));
vi.mock("./nativewind", () => {
  function styles(value: any): any {
    return Array.isArray(value)
      ? Object.assign({}, ...value.map(styles))
      : value;
  }
  return {
    View: "div",
    Text: ({ children, style }: any) => (
      <span style={styles(style)}>{children}</span>
    ),
    Pressable: forwardRef<HTMLButtonElement, any>(
      ({ children, style, onPress, ...props }, ref) => (
        <button
          ref={ref}
          onClick={onPress}
          style={styles(
            typeof style === "function" ? style({ pressed: false }) : style,
          )}
        >
          {children}
        </button>
      ),
    ),
    TextInput: forwardRef<HTMLInputElement, any>(
      (
        {
          onChangeText,
          onBlur,
          onFocus,
          value,
          defaultValue,
          maxLength,
          style,
          secureTextEntry,
        },
        ref,
      ) => (
        <input
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          type={secureTextEntry ? "password" : "text"}
          style={styles(style)}
          onInput={(event) => onChangeText?.(event.currentTarget.value)}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      ),
    ),
  };
});
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const mounted: ReturnType<typeof createRoot>[] = [];
afterEach(async () => {
  for (const root of mounted.splice(0)) await act(async () => root.unmount());
  document.body.innerHTML = "";
});
async function render(content: React.ReactNode) {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  mounted.push(root);
  await act(async () => root.render(content));
  return host;
}

it("renders native button text, children precedence, colours and its ref", async () => {
  const ref = createRef<any>();
  const host = await render(
    <>
      <Button ref={ref} text="Save" backgroundColor="red" textColor="blue" />
      <Button text="Fallback">Content</Button>
    </>,
  );
  expect(host.textContent).toBe("SaveContent");
  expect(ref.current).toBe(host.querySelector("button"));
  expect(ref.current.style.backgroundColor).toBe("red");
  expect(host.querySelector("span")?.style.color).toBe("blue");
});

it("validates native numeric limits on blur without changing the entered value", async () => {
  const changed = vi.fn();
  const ref = createRef<any>();
  const host = await render(
    <Input ref={ref} min={1} max={5} step={2} onValidationChange={changed} />,
  );
  const input = host.querySelector("input")!;
  await act(async () => {
    input.value = "6";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  });
  expect(changed).toHaveBeenLastCalledWith(false, expect.any(String));
  expect(input.value).toBe("6");
  expect(ref.current).toBe(input);
  await act(async () => {
    input.value = "3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  });
  expect(changed).toHaveBeenLastCalledWith(true, undefined);
});

it("forwards password and textarea refs to their native text inputs", async () => {
  const password = createRef<any>();
  const textarea = createRef<any>();
  const host = await render(
    <>
      <PasswordInput ref={password} maxLength={12} />
      <TextArea ref={textarea} maxLength={50} />
    </>,
  );
  const fields = host.querySelectorAll("input");
  expect(password.current).toBe(fields[0]);
  expect(textarea.current).toBe(fields[1]);
  expect(fields[0].maxLength).toBe(12);
  expect(fields[1].maxLength).toBe(50);
});
