import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type Ref,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type {
  BaseUIProps,
  FlexContainerProps,
  InputProps as CoreInputProps,
  PasswordInputProps as CorePasswordInputProps,
  SelectOption,
} from "@akin2unde/flowui-core";
import { sanitizeInputValue, numericInputError } from "@akin2unde/flowui-core";
import { nativeProps, useFlowProps } from "./helpers";
import { Icon } from "./primitives";

function useControllableValue<T>(value: T | undefined, fallback: T) {
  const [current, setCurrent] = useState(value ?? fallback);
  useEffect(() => {
    if (value !== undefined) setCurrent(value);
  }, [value]);
  return [current, setCurrent] as const;
}

export interface InputProps
  extends
    CoreInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof CoreInputProps | "size"> {
  ref?: Ref<HTMLInputElement>;
  onValueChange?: (value: string) => void;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    value,
    defaultValue,
    name,
    placeholder,
    disabled,
    readOnly,
    required,
    autoFocus,
    autoComplete,
    tabIndex,
    inputMode = "text",
    currencySymbol = "₦",
    onValueChange,
    onChange,
    ...props
  }: InputProps,
  forwardedRef,
) {
  const actualInput = useRef<HTMLInputElement>(null);
  const isMoney = inputMode === "money";
  const flow = useFlowProps(isMoney ? "fui-money-input" : "fui-control", props);
  const { className, style, hidden, ...inputAttributes } = flow;
  const [currentValue, setCurrentValue] = useControllableValue<string | number>(
    value,
    Array.isArray(defaultValue)
      ? defaultValue.join(",")
      : ((defaultValue as string | number | undefined) ?? ""),
  );
  const validate = (next: string | number) => {
    const numeric =
      type === "number" || ["integer", "decimal", "money"].includes(inputMode);
    actualInput.current?.setCustomValidity(
      numeric
        ? (numericInputError(next, props.min, props.max, props.step) ?? "")
        : "",
    );
  };
  useEffect(() => {
    validate(currentValue);
  }, [currentValue, props.min, props.max, props.step, type, inputMode]);
  const control = (
    <input
      ref={(node) => {
        actualInput.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      {...inputAttributes}
      className={isMoney ? "fui-control" : className}
      style={isMoney ? undefined : style}
      hidden={isMoney ? undefined : hidden}
      type={inputMode === "text" ? type : "text"}
      inputMode={
        inputMode === "integer"
          ? "numeric"
          : inputMode === "decimal" || inputMode === "money"
            ? "decimal"
            : undefined
      }
      value={currentValue}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      tabIndex={tabIndex}
      onChange={(event) => {
        const next = sanitizeInputValue(event.target.value, inputMode);
        event.target.value = next;
        setCurrentValue(next);
        validate(next);
        onValueChange?.(next);
        onChange?.(event);
      }}
    />
  );
  if (!isMoney) return control;
  return (
    <span className={className} style={style} hidden={hidden}>
      <span className="fui-money-symbol">{currencySymbol}</span>
      {control}
    </span>
  );
});

export interface PasswordInputProps
  extends
    CorePasswordInputProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof CorePasswordInputProps | "type" | "size"
    > {
  ref?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
  onVisibilityChange?: (visible: boolean) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      id,
      value,
      defaultValue,
      ref,
      wrapperClassName,
      name,
      placeholder,
      disabled,
      readOnly,
      required,
      autoFocus,
      autoComplete,
      tabIndex,
      showToggle = true,
      visible,
      onVisibilityChange,
      onChange,
      ...props
    }: PasswordInputProps,
    forwardedRef,
  ) {
    const [internalVisible, setInternalVisible] = useState(false);
    const [currentValue, setCurrentValue] = useControllableValue(
      value,
      Array.isArray(defaultValue)
        ? defaultValue.join(",")
        : (defaultValue ?? ""),
    );
    const isVisible = visible ?? internalVisible;
    const flow = useFlowProps("fui-password", props);

    const toggle = () => {
      const next = !isVisible;
      if (visible === undefined) setInternalVisible(next);
      onVisibilityChange?.(next);
    };

    return (
      <div
        className={[flow.className, wrapperClassName].filter(Boolean).join(" ")}
        style={flow.style}
      >
        <input
          {...nativeProps(props)}
          ref={forwardedRef}
          className="fui-control fui-password-control"
          id={id}
          type={isVisible ? "text" : "password"}
          value={currentValue}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          tabIndex={tabIndex}
          onChange={(event) => {
            setCurrentValue(event.target.value);
            onChange?.(event);
          }}
        />
        {showToggle && (
          <button
            className="fui-password-toggle"
            type="button"
            disabled={disabled}
            aria-label={isVisible ? "Hide password" : "Show password"}
            onClick={toggle}
          >
            <Icon icon={`fa-solid fa-eye${isVisible ? "-slash" : ""}`} />
          </button>
        )}
      </div>
    );
  },
);

export interface TextAreaProps
  extends
    BaseUIProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseUIProps> {
  ref?: Ref<HTMLTextAreaElement>;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      value,
      defaultValue,
      name,
      placeholder,
      disabled,
      readOnly,
      required,
      rows = 4,
      onChange,
      ...props
    }: TextAreaProps,
    forwardedRef,
  ) {
    const flow = useFlowProps("fui-control fui-textarea", props);
    const [currentValue, setCurrentValue] = useControllableValue(
      value,
      Array.isArray(defaultValue)
        ? defaultValue.join(",")
        : (defaultValue ?? ""),
    );
    return (
      <textarea
        ref={forwardedRef}
        {...flow}
        value={currentValue}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        onChange={(event) => {
          setCurrentValue(event.target.value);
          onChange?.(event);
        }}
      />
    );
  },
);

export interface CheckboxProps
  extends
    BaseUIProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof BaseUIProps | "type" | "size" | "value"
    > {
  ref?: Ref<HTMLInputElement>;
  checked?: boolean;
  label?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked,
      ref,
      label,
      name,
      value,
      disabled,
      onChange,
      ...props
    }: CheckboxProps,
    forwardedRef,
  ) {
    const flow = useFlowProps("fui-check-label", props);
    const [currentChecked, setCurrentChecked] = useControllableValue(
      checked,
      defaultChecked ?? false,
    );
    return (
      <label className={flow.className} style={flow.style}>
        <input
          {...nativeProps(props)}
          id={props.id}
          ref={forwardedRef}
          className="fui-check"
          type="checkbox"
          checked={currentChecked}
          name={name}
          value={value ?? ""}
          disabled={disabled}
          onChange={(event) => {
            setCurrentChecked(event.target.checked);
            onChange?.(event);
          }}
        />
        <span>{label}</span>
      </label>
    );
  },
);

export interface RadioButtonProps extends CheckboxProps {}
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  function RadioButton(
    {
      checked,
      defaultChecked,
      ref,
      label,
      name,
      value,
      disabled,
      onChange,
      ...props
    }: RadioButtonProps,
    forwardedRef,
  ) {
    const flow = useFlowProps("fui-check-label", props);
    const [currentChecked, setCurrentChecked] = useControllableValue(
      checked,
      defaultChecked ?? false,
    );
    return (
      <label className={flow.className} style={flow.style}>
        <input
          {...nativeProps(props)}
          id={props.id}
          ref={forwardedRef}
          className="fui-check"
          type="radio"
          checked={currentChecked}
          name={name}
          value={value ?? ""}
          disabled={disabled}
          onChange={(event) => {
            setCurrentChecked(event.target.checked);
            onChange?.(event);
          }}
        />
        <span>{label}</span>
      </label>
    );
  },
);

export interface RadioGroupProps extends BaseUIProps, FlexContainerProps {
  name: string;
  value?: string;
  options: SelectOption[];
  orientation?: "horizontal" | "vertical";
  onChange?: (value: string) => void;
}
export function RadioGroup({
  name,
  value,
  options,
  orientation = "vertical",
  onChange,
  ...props
}: RadioGroupProps) {
  const flow = useFlowProps(
    orientation === "horizontal" ? "fui-h-stack" : "fui-v-stack",
    { ...props, gap: props.gap ?? "sm" },
  );
  return (
    <div {...flow} role="radiogroup">
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          disabled={option.disabled}
          onChange={() => onChange?.(option.value)}
        />
      ))}
    </div>
  );
}

export interface ColorPickerProps extends BaseUIProps {
  value?: string;
  name?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
export function ColorPicker({
  value,
  name,
  disabled,
  onChange,
  ...props
}: ColorPickerProps) {
  const flow = useFlowProps("fui-color", props);
  const [currentValue, setCurrentValue] = useControllableValue(
    value,
    "#000000",
  );
  return (
    <input
      {...flow}
      type="color"
      value={currentValue}
      name={name}
      disabled={disabled}
      onChange={(event) => {
        setCurrentValue(event.target.value);
        onChange?.(event);
      }}
    />
  );
}
