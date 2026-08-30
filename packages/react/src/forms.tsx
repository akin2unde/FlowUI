import {
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
import { useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface InputProps
  extends
    CoreInputProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof CoreInputProps | "size"
    > {}
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
  onChange,
  ...props
}: InputProps) {
  const flow = useFlowProps("fui-control", props);
  return (
    <input
      {...flow}
      type={type}
      value={value}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      onChange={onChange}
    />
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
        value={value}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        onChange={onChange}
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
  return (
    <textarea
      {...flow}
      value={value}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      onChange={onChange}
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
  return (
    <label {...flow}>
      <input
        className="fui-check"
        type="checkbox"
        checked={checked}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
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
  return (
    <label {...flow}>
      <input
        className="fui-check"
        type="radio"
        checked={checked}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
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
  return (
    <input
      {...flow}
      type="color"
      value={value}
      name={name}
      disabled={disabled}
      onChange={onChange}
    />
  );
}
