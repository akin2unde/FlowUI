import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
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
  const fallback = countries[0];
  const selected =
    countries.find((item) => item.code === value?.countryCode) ?? fallback;
  const current: PhoneNumberValue = value ?? {
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
  const choose = (country: PhoneCountry) => {
    onChange?.({
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
          onChange?.({
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

const palette = ["#6d28d9", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

export function Chart({
  type = "bar",
  data,
  height = 260,
  showLegend = true,
  showValues = false,
  animated = true,
  ...props
}: ChartProps) {
  const flow = useFlowProps("fui-chart", props);
  const width = 640;
  const max = Math.max(1, ...data.series.flatMap((series) => series.data));
  const colors = data.series.map((series, index) =>
    series.color
      ? resolveColorValue(series.color)
      : palette[index % palette.length],
  );
  const points = (values: number[]) =>
    values.map((item, index) => {
      const x = 48 + index * ((width - 80) / Math.max(values.length - 1, 1));
      const y = height - 42 - (item / max) * (height - 80);
      return { x, y, value: item };
    });
  const pieSlices = useMemo(() => {
    const values = data.series[0]?.data ?? [];
    const total = values.reduce((sum, item) => sum + item, 0) || 1;
    let offset = 0;
    return values.map((item, index) => {
      const start = offset;
      offset += item / total;
      return {
        start,
        end: offset,
        value: item,
        color: palette[index % palette.length],
      };
    });
  }, [data]);
  const arc = (start: number, end: number) => {
    const radius = Math.min(width, height) * 0.32;
    const center = { x: width / 2, y: height / 2 };
    const point = (ratio: number) => ({
      x: center.x + radius * Math.sin(ratio * Math.PI * 2),
      y: center.y - radius * Math.cos(ratio * Math.PI * 2),
    });
    const a = point(start);
    const b = point(end);
    return `M ${center.x} ${center.y} L ${a.x} ${a.y} A ${radius} ${radius} 0 ${end - start > 0.5 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
  };
  return (
    <figure {...flow} data-animated={animated}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${type} chart`}
      >
        {type === "pie" || type === "doughnut" ? (
          <>
            {pieSlices.map((slice, index) => (
              <path
                key={index}
                d={arc(slice.start, slice.end)}
                fill={slice.color}
              />
            ))}
            {type === "doughnut" && (
              <circle
                cx={width / 2}
                cy={height / 2}
                r={Math.min(width, height) * 0.17}
                fill="white"
              />
            )}
          </>
        ) : type === "line" ? (
          data.series.map((series, seriesIndex) => {
            const seriesPoints = points(series.data);
            return (
              <g key={series.name}>
                <polyline
                  fill="none"
                  stroke={colors[seriesIndex]}
                  strokeWidth="4"
                  points={seriesPoints
                    .map((item) => `${item.x},${item.y}`)
                    .join(" ")}
                />
                {seriesPoints.map((item, index) => (
                  <g key={index}>
                    <circle
                      cx={item.x}
                      cy={item.y}
                      r="5"
                      fill={colors[seriesIndex]}
                    />
                    {showValues && (
                      <text x={item.x} y={item.y - 10}>
                        {item.value}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            );
          })
        ) : (
          data.series.flatMap((series, seriesIndex) =>
            series.data.map((item, index) => {
              const groupWidth = (width - 80) / Math.max(data.labels.length, 1);
              const barWidth = groupWidth / Math.max(data.series.length + 1, 2);
              const barHeight = (item / max) * (height - 80);
              const x = 48 + index * groupWidth + seriesIndex * barWidth;
              const y = height - 42 - barHeight;
              return (
                <g key={`${series.name}-${index}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth - 4}
                    height={barHeight}
                    rx="5"
                    fill={colors[seriesIndex]}
                  />
                  {showValues && (
                    <text x={x + barWidth / 2} y={y - 7}>
                      {item}
                    </text>
                  )}
                </g>
              );
            }),
          )
        )}
        {type !== "pie" &&
          type !== "doughnut" &&
          data.labels.map((label, index) => (
            <text
              className="fui-chart-label"
              key={label}
              x={48 + index * ((width - 80) / Math.max(data.labels.length, 1))}
              y={height - 15}
            >
              {label}
            </text>
          ))}
      </svg>
      {showLegend && (
        <figcaption>
          {data.series.map((series, index) => (
            <span key={series.name}>
              <i style={{ background: colors[index] }} />
              {series.name}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
