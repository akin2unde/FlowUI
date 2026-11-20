import { buildChart } from "@akin2unde/flowui-core";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  clampNumber,
  resolveColorValue,
  type ChartProps as CoreChartProps,
  type KnobProps as CoreKnobProps,
  type OTPInputProps as CoreOTPInputProps,
  type PhoneCountry,
  type PhoneInputProps as CorePhoneInputProps,
  type PhoneNumberValue,
} from "@akin2unde/flowui-core";
import { useDismissableLayer, useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface KnobProps extends CoreKnobProps {
  onChange?: (value: number) => void;
}

export function Knob({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  valueSuffix = "",
  color = "primary",
  trackColor = "border",
  disabled,
  onChange,
  ...props
}: KnobProps) {
  const flow = useFlowProps("fui-knob", props);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = (clampNumber(value, min, max) - min) / (max - min || 1);
  return (
    <label {...flow} style={{ ...flow.style, width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="fui-knob-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolveColorValue(trackColor)}
          strokeWidth={strokeWidth}
        />
        <circle
          className="fui-knob-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolveColorValue(color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent)}
        />
      </svg>
      {showValue && (
        <output>
          {value}
          {valueSuffix}
        </output>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label="Knob value"
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
    </label>
  );
}

export interface OTPInputProps extends CoreOTPInputProps {
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPInput({
  value = "",
  length = 6,
  numericOnly = true,
  masked = false,
  disabled,
  name,
  onChange,
  onComplete,
  ...props
}: OTPInputProps) {
  const flow = useFlowProps("fui-otp", props);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length }, (_, index) => value[index] ?? "");
  const update = (index: number, raw: string) => {
    const accepted = (numericOnly ? raw.replace(/\D/g, "") : raw).slice(-1);
    const next = [...chars];
    next[index] = accepted;
    const joined = next.join("");
    onChange?.(joined);
    if (accepted && index < length - 1) inputs.current[index + 1]?.focus();
    if (joined.length === length) onComplete?.(joined);
  };
  return (
    <div {...flow}>
      <input type="hidden" name={name} value={value} />
      {chars.map((char, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          type={masked ? "password" : "text"}
          inputMode={numericOnly ? "numeric" : "text"}
          maxLength={1}
          value={char}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => update(index, event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Backspace" && !char && index > 0) {
              inputs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData
              .getData("text")
              .replace(numericOnly ? /\D/g : /$^/, "")
              .slice(0, length);
            onChange?.(pasted);
            if (pasted.length === length) onComplete?.(pasted);
            inputs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}

export interface PhoneInputProps extends CorePhoneInputProps {
  onChange?: (value: PhoneNumberValue) => void;
}

export function PhoneInput({
  value,
  countries,
  searchable = true,
  placeholder = "Phone number",
  disabled,
  name,
  onChange,
  ...props
}: PhoneInputProps) {
  const [draft, setDraft] = useState<PhoneNumberValue>();
  const phone = value ?? draft;
  const fallback = countries[0];
  const selected =
    countries.find((item) => item.code === phone?.countryCode) ?? fallback;
  const current: PhoneNumberValue = phone ?? {
    countryCode: selected?.code ?? "",
    dialCode: selected?.dialCode ?? "",
    number: "",
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useDismissableLayer(root, open, () => setOpen(false));
  const flow = useFlowProps("fui-phone", props);
  const matches = countries.filter((country) =>
    `${country.name} ${country.code} ${country.dialCode}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const update = (next: PhoneNumberValue) => {
    if (value === undefined) setDraft(next);
    onChange?.(next);
  };
  const choose = (country: PhoneCountry) => {
    update({
      ...current,
      countryCode: country.code,
      dialCode: country.dialCode,
    });
    setOpen(false);
    setQuery("");
  };
  return (
    <div {...flow} ref={root}>
      <button
        className="fui-phone-country"
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((shown) => !shown)}
      >
        <span>{selected?.flag ?? selected?.code}</span>
        <span>{selected?.dialCode}</span>
        <Icon icon="fa-solid fa-chevron-down" />
      </button>
      <input
        className="fui-phone-number"
        type="tel"
        inputMode="tel"
        name={name}
        value={current.number}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          update({
            ...current,
            number: event.target.value.replace(/[^0-9\s()-]/g, ""),
          })
        }
      />
      {open && (
        <div className="fui-phone-menu fui-select-menu">
          {searchable && (
            <label className="fui-select-search">
              <Icon icon="fa-solid fa-magnifying-glass" />
              <input
                value={query}
                autoFocus
                placeholder="Search country…"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          )}
          <div className="fui-select-options">
            {matches.map((country) => (
              <button
                className="fui-select-option"
                type="button"
                key={country.code}
                onClick={() => choose(country)}
              >
                <span>
                  {country.flag} {country.name}
                </span>
                <span>{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface ChartProps extends CoreChartProps {}

export const Chart = ({
  type = "bar",
  data,
  height = 260,
  showLegend = true,
  showValues = false,
  animated = true,
  ...props
}: ChartProps) => {
  const flow = useFlowProps("fui-chart", props);
  const chart = buildChart(data, type, height, showValues);
  return (
    <figure {...flow} data-animated={animated}>
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label={`${type} chart`}
      >
        {chart.marks.map((mark, index) =>
          mark.path ? (
            <path
              key={index}
              d={mark.path}
              fill={mark.fill}
              fillOpacity={mark.opacity}
              stroke={mark.stroke}
              strokeWidth="2.5"
            />
          ) : (
            <rect
              key={index}
              x={mark.x}
              y={mark.y}
              width={mark.width}
              height={mark.height}
              rx="3"
              fill={mark.fill}
            />
          ),
        )}
        {chart.labels.map((label, index) => (
          <text key={index} x={label.x} y={label.y} textAnchor={label.anchor}>
            {label.text}
          </text>
        ))}
      </svg>
      {showLegend && (
        <figcaption>
          {chart.legend.map((item, index) => (
            <span key={index}>
              <i style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
};
