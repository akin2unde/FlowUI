import React, { type PropsWithChildren, type ReactNode, useState } from "react";
import {
  Switch as RNSwitch,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { Pressable, Text as RNText, TextInput, View } from "./nativewind";
import { useFlowUITheme } from "./theme";
import { HStack, Text, VStack } from "./primitives";

type ClassName = { className?: string };

export interface FormGroupProps
  extends PropsWithChildren, ViewProps, ClassName {
  title?: string;
  description?: string;
  error?: string;
}

export function FormGroup({
  title,
  description,
  error,
  children,
  className,
  style,
  ...props
}: FormGroupProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <View
      accessibilityRole="summary"
      className={`gap-4 border p-4 ${className ?? ""}`}
      style={[
        {
          borderColor: error ? colors.danger : colors.border,
          borderRadius: theme.radius.lg,
          backgroundColor: colors.surface,
        },
        style,
      ]}
      {...props}
    >
      {title || description ? (
        <VStack className="gap-1">
          {title ? <Text className="text-lg font-bold">{title}</Text> : null}
          {description ? <Text muted>{description}</Text> : null}
        </VStack>
      ) : null}
      {children}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
    </View>
  );
}

export interface FormFieldProps extends PropsWithChildren {
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  helpText,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const { colors } = useFlowUITheme();
  return (
    <VStack className={`gap-1.5 ${className ?? ""}`}>
      {label ? (
        <RNText style={{ color: colors.text, fontWeight: "600" }}>
          {label}
          {required ? (
            <RNText style={{ color: colors.danger }}> *</RNText>
          ) : null}
        </RNText>
      ) : null}
      {children}
      {error ? (
        <RNText style={{ color: colors.danger, fontSize: 12 }}>{error}</RNText>
      ) : helpText ? (
        <RNText style={{ color: colors.textMuted, fontSize: 12 }}>
          {helpText}
        </RNText>
      ) : null}
    </VStack>
  );
}

export interface InputProps extends TextInputProps, ClassName {
  invalid?: boolean;
}

export function Input({ className, invalid, style, ...props }: InputProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <TextInput
      className={`border px-3 ${className ?? ""}`}
      placeholderTextColor={colors.textMuted}
      style={[
        {
          minHeight: theme.components.inputHeight,
          borderColor: invalid ? colors.danger : colors.border,
          borderRadius: theme.components.controlRadius,
          backgroundColor: colors.surface,
          color: colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface PasswordInputProps extends InputProps {
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  showLabel = "Show",
  hideLabel = "Hide",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useFlowUITheme();
  return (
    <View className="relative justify-center">
      <Input secureTextEntry={!visible} className="pr-16" {...props} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? hideLabel : showLabel}
        className="absolute right-3 p-2"
        onPress={() => setVisible((current) => !current)}
      >
        <RNText style={{ color: colors.primary, fontWeight: "600" }}>
          {visible ? hideLabel : showLabel}
        </RNText>
      </Pressable>
    </View>
  );
}

export function SearchInput(props: InputProps) {
  return <Input accessibilityRole="search" returnKeyType="search" {...props} />;
}

export function TextArea({ style, ...props }: InputProps) {
  return (
    <Input
      multiline
      textAlignVertical="top"
      style={[{ minHeight: 110, paddingTop: 12 }, style]}
      {...props}
    />
  );
}

export interface RestrictedInputProps extends InputProps {
  onValueChange?: (value: string) => void;
}

export function NumberInput({
  onValueChange,
  onChangeText,
  ...props
}: RestrictedInputProps) {
  return (
    <Input
      keyboardType="decimal-pad"
      onChangeText={(value) => {
        const next = value.replace(/[^0-9.-]/g, "");
        onChangeText?.(next);
        onValueChange?.(next);
      }}
      {...props}
    />
  );
}

export function MoneyInput({
  onValueChange,
  onChangeText,
  ...props
}: RestrictedInputProps) {
  return (
    <Input
      keyboardType="decimal-pad"
      onChangeText={(value) => {
        const cleaned = value.replace(/[^0-9.]/g, "");
        const [whole = "", ...decimal] = cleaned.split(".");
        const next =
          decimal.length > 0
            ? `${whole}.${decimal.join("").slice(0, 2)}`
            : whole;
        onChangeText?.(next);
        onValueChange?.(next);
      }}
      {...props}
    />
  );
}

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
}: CheckboxProps) {
  const { colors, theme } = useFlowUITheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      className={`flex-row items-center gap-3 ${className ?? ""}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
        className="h-6 w-6 items-center justify-center border"
        style={{
          borderRadius: theme.radius.sm,
          borderColor: checked ? colors.primary : colors.border,
          backgroundColor: checked ? colors.primary : "transparent",
        }}
      >
        {checked ? (
          <RNText style={{ color: colors.primaryText }}>✓</RNText>
        ) : null}
      </View>
      {typeof label === "string" || typeof label === "number" ? (
        <Text>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
}

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  horizontal?: boolean;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  horizontal,
  className,
}: RadioGroupProps) {
  const { colors, theme } = useFlowUITheme();
  const Container = horizontal ? HStack : VStack;
  return (
    <Container
      accessibilityRole="radiogroup"
      className={`gap-3 ${className ?? ""}`}
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked, disabled: option.disabled }}
            disabled={option.disabled}
            onPress={() => onValueChange?.(option.value)}
            className="flex-row items-center gap-2"
            style={{ opacity: option.disabled ? 0.5 : 1 }}
          >
            <View
              className="h-6 w-6 items-center justify-center border"
              style={{
                borderRadius: theme.radius.full,
                borderColor: colors.primary,
              }}
            >
              {checked ? (
                <View
                  className="h-3 w-3"
                  style={{
                    borderRadius: theme.radius.full,
                    backgroundColor: colors.primary,
                  }}
                />
              ) : null}
            </View>
            <Text>{option.label}</Text>
          </Pressable>
        );
      })}
    </Container>
  );
}

export interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  value,
  onValueChange,
  label,
  disabled,
  className,
}: SwitchProps) {
  const { colors } = useFlowUITheme();
  return (
    <HStack className={`items-center justify-between gap-3 ${className ?? ""}`}>
      {label ? <Text>{label}</Text> : null}
      <RNSwitch
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </HStack>
  );
}

export interface OTPInputProps extends Omit<
  InputProps,
  "value" | "onChangeText"
> {
  value: string;
  length?: number;
  onValueChange?: (value: string) => void;
}

export function OTPInput({
  value,
  length = 6,
  onValueChange,
  style,
  ...props
}: OTPInputProps) {
  return (
    <Input
      value={value}
      maxLength={length}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="sms-otp"
      onChangeText={(next) => onValueChange?.(next.replace(/\D/g, ""))}
      style={[{ letterSpacing: 14, textAlign: "center", fontSize: 20 }, style]}
      {...props}
    />
  );
}

export interface PhoneInputProps {
  countryCode: string;
  number: string;
  onCountryCodeChange?: (value: string) => void;
  onNumberChange?: (value: string) => void;
  className?: string;
}

export function PhoneInput({
  countryCode,
  number,
  onCountryCodeChange,
  onNumberChange,
  className,
}: PhoneInputProps) {
  return (
    <HStack className={`gap-2 ${className ?? ""}`}>
      <Input
        accessibilityLabel="Country calling code"
        value={countryCode}
        onChangeText={onCountryCodeChange}
        keyboardType="phone-pad"
        className="w-24"
      />
      <Input
        accessibilityLabel="Phone number"
        value={number}
        onChangeText={onNumberChange}
        keyboardType="phone-pad"
        className="flex-1"
      />
    </HStack>
  );
}
