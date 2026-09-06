import {
  useEffect,
  useState,
  type ChangeEventHandler,
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
import { sanitizeInputValue } from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
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
  onValueChange?: (value: string) => void;
}
export function Input({
  type = "text",
  value,
  name,
  placeholder,
  disabled,
  readOnly,
  required,
  autoFocus,
  tabIndex,
  inputMode = "text",
  currencySymbol = "₦",
  onValueChange,
  onChange,
  ...props
}: InputProps) {
  const flow = useFlowProps("fui-control", props);
  const [currentValue, setCurrentValue] = useControllableValue<string | number>(
    value,
    "",
  );
  const control = (
    <input
      {...flow}
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
      tabIndex={tabIndex}
      onChange={(event) => {
        const next = sanitizeInputValue(event.target.value, inputMode);
        event.target.value = next;
        setCurrentValue(next);
        onValueChange?.(next);
        onChange?.(event);
      }}
    />
  );
  if (inputMode !== "money") return control;
  return (
    <span className="fui-money-input">
      <span className="fui-money-symbol">{currencySymbol}</span>
      {control}
    </span>
  );
}

export interface PasswordInputProps
  extends
    CorePasswordInputProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof CorePasswordInputProps | "type" | "size"
    > {
  onVisibilityChange?: (visible: boolean) => void;
}

export function PasswordInput({
  value,
  name,
  placeholder,
  disabled,
  readOnly,
  required,
  autoFocus,
  tabIndex,
  showToggle = true,
  visible,
  onVisibilityChange,
  onChange,
  ...props
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [currentValue, setCurrentValue] = useControllableValue(value, "");
  const isVisible = visible ?? internalVisible;
  const flow = useFlowProps("fui-password", props);

  const toggle = () => {
    const next = !isVisible;
    if (visible === undefined) setInternalVisible(next);
    onVisibilityChange?.(next);
  };

  return (
    <div {...flow}>
      <input
        className="fui-control fui-password-control"
        type={isVisible ? "text" : "password"}
        value={currentValue}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
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
}

export interface TextAreaProps
  extends
    BaseUIProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseUIProps> {}
export function TextArea({
  value,
  name,
  placeholder,
  disabled,
  readOnly,
  required,
  rows = 4,
  onChange,
  ...props
}: TextAreaProps) {
  const flow = useFlowProps("fui-control fui-textarea", props);
  const [currentValue, setCurrentValue] = useControllableValue(value, "");
  return (
    <textarea
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
}

export interface CheckboxProps extends BaseUIProps {
  checked?: boolean;
  label?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
export function Checkbox({
  checked,
  label,
  name,
  value,
  disabled,
  onChange,
  ...props
}: CheckboxProps) {
  const flow = useFlowProps("fui-check-label", props);
  const [currentChecked, setCurrentChecked] = useControllableValue(
    checked,
    false,
  );
  return (
    <label {...flow}>
      <input
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
}

export interface RadioButtonProps extends CheckboxProps {}
export function RadioButton({
  checked,
  label,
  name,
  value,
  disabled,
  onChange,
  ...props
}: RadioButtonProps) {
  const flow = useFlowProps("fui-check-label", props);
  const [currentChecked, setCurrentChecked] = useControllableValue(
    checked,
    false,
  );
  return (
    <label {...flow}>
      <input
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
}

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
