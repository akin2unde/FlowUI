import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from "react";
import type {
  AutocompleteProps as CoreAutocompleteProps,
  BreadcrumbItem,
  BreadcrumbProps as CoreBreadcrumbProps,
  CarouselProps as CoreCarouselProps,
  DateTimeProps as CoreDateTimeProps,
  DropdownModel,
  FileUploadProps as CoreFileUploadProps,
  ListboxProps as CoreListboxProps,
  NotificationProps as CoreNotificationProps,
  PopoverProps as CorePopoverProps,
  RatingProps as CoreRatingProps,
  TimelineItem,
  TimelineProps as CoreTimelineProps,
} from "@akin2unde/flowui-core";
import { setLocalDayBoundary } from "@akin2unde/flowui-core";
import { useFlowProps } from "./helpers";
import { Icon } from "./primitives";

export interface DateTimeProps extends CoreDateTimeProps {
  onChange?: (value: string) => void;
}

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const calendarDays = (month: Date) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

export function DateTime({
  value,
  mode = "datetime",
  name,
  min,
  max,
  disabled,
  showDayBoundaryButtons = true,
  onChange,
  ...props
}: DateTimeProps) {
  const flow = useFlowProps("fui-date-time", props);
  const selectedDate = value?.split("T")[0] ?? "";
  const selectedTime = value?.includes("T") ? value.split("T")[1] : "00:00";
  const parsed = selectedDate ? new Date(`${selectedDate}T12:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(
    new Date(parsed.getFullYear(), parsed.getMonth(), 1),
  );
  const selectDate = (key: string) => {
    onChange?.(mode === "date" ? key : `${key}T${selectedTime || "00:00"}`);
    setOpen(false);
  };
  const selectToday = () => {
    const today = dateKey(new Date());
    selectDate(today);
    setMonth(new Date());
  };

  if (mode === "time") {
    return (
      <div {...flow}>
        <input
          className="fui-control"
          type="time"
          value={value ?? ""}
          name={name}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div {...flow}>
      <input type="hidden" name={name} value={value ?? ""} />
      <div className="fui-date-time-field">
        <button
          className="fui-date-display"
          type="button"
          disabled={disabled}
          onClick={() => {
            setMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
            setOpen((current) => !current);
          }}
        >
          <Icon icon="fa-regular fa-calendar" />
          <span>{selectedDate || "Select date"}</span>
        </button>
        {mode === "datetime" && (
          <input
            className="fui-date-time-clock"
            type="time"
            value={selectedTime}
            disabled={disabled}
            onChange={(event) =>
              onChange?.(
                `${selectedDate || dateKey(new Date())}T${event.target.value}`,
              )
            }
          />
        )}
        <div className="fui-date-time-actions">
          <button
            type="button"
            title="Today"
            disabled={disabled}
            onClick={selectToday}
          >
            <Icon icon="fa-solid fa-calendar-day" />
          </button>
          {mode === "datetime" && showDayBoundaryButtons && (
            <>
              <button
                type="button"
                title="Start of day"
                disabled={disabled}
                onClick={() => onChange?.(setLocalDayBoundary(value, "start"))}
              >
                <Icon icon="fa-solid fa-sun" />
              </button>
              <button
                type="button"
                title="End of day"
                disabled={disabled}
                onClick={() => onChange?.(setLocalDayBoundary(value, "end"))}
              >
                <Icon icon="fa-solid fa-moon" />
              </button>
            </>
          )}
        </div>
      </div>
      {open && (
        <div className="fui-calendar" role="dialog" aria-label="Choose date">
          <div className="fui-calendar-header">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              <Icon icon="fa-solid fa-chevron-left" />
            </button>
            <strong>
              {month.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              <Icon icon="fa-solid fa-chevron-right" />
            </button>
          </div>
          <div className="fui-calendar-grid fui-calendar-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="fui-calendar-grid">
            {calendarDays(month).map((day) => {
              const key = dateKey(day);
              return (
                <button
                  key={key}
                  type="button"
                  data-outside={day.getMonth() !== month.getMonth()}
                  data-selected={key === selectedDate}
                  data-today={key === dateKey(new Date())}
                  disabled={Boolean(
                    (min && key < min.split("T")[0]) ||
                    (max && key > max.split("T")[0]),
                  )}
                  onClick={() => selectDate(key)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export interface AutocompleteProps extends CoreAutocompleteProps {
  onChange?: (option: DropdownModel) => void;
}

export function Autocomplete({
  options,
  value,
  placeholder,
  minCharacters = 1,
  disabled,
  onChange,
  ...props
}: AutocompleteProps) {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected ? String(selected.display) : "");
  const [open, setOpen] = useState(false);
  const flow = useFlowProps("fui-autocomplete", props);
  const matches = options.filter((option) =>
    String(option.display).toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (selected) setQuery(String(selected.display));
  }, [selected?.value]);

  return (
    <div {...flow}>
      <input
        className="fui-control"
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
      />
      {open && query.length >= minCharacters && (
        <div className="fui-autocomplete-menu" role="listbox">
          {matches.length ? (
            matches.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery(String(option.display));
                  setOpen(false);
                  onChange?.(option);
                }}
              >
                {option.display}
              </button>
            ))
          ) : (
            <span className="fui-empty">No matches</span>
          )}
        </div>
      )}
    </div>
  );
}

export interface RatingProps extends CoreRatingProps {
  onChange?: (value: number) => void;
}

export function Rating({
  value = 0,
  maximum = 5,
  precision = 1,
  readOnly,
  disabled,
  onChange,
  ...props
}: RatingProps) {
  const flow = useFlowProps("fui-rating", props);
  const points = Array.from(
    { length: maximum / precision },
    (_, index) => (index + 1) * precision,
  );

  return (
    <div {...flow} role="radiogroup" aria-label="Rating">
      {points.map((point) => (
        <button
          key={point}
          className={point <= value ? "fui-rating-active" : ""}
          type="button"
          role="radio"
          aria-checked={point === value}
          aria-label={`${point} out of ${maximum}`}
          disabled={disabled || readOnly}
          onClick={() => onChange?.(point)}
        >
          <Icon icon="fa-solid fa-star" />
        </button>
      ))}
    </div>
  );
}

export interface ListboxProps extends CoreListboxProps {
  values?: Array<string | number>;
  renderOption?: (option: DropdownModel, selected: boolean) => ReactNode;
  onChange?: (option: DropdownModel) => void;
  onValuesChange?: (options: DropdownModel[]) => void;
}

export function Listbox({
  options,
  value,
  values = [],
  multiple,
  disabled,
  renderOption,
  onChange,
  onValuesChange,
  ...props
}: ListboxProps) {
  const flow = useFlowProps("fui-listbox", props);
  const selectedValues = multiple ? values : value === undefined ? [] : [value];

  const select = (option: DropdownModel) => {
    if (!multiple) return onChange?.(option);
    const next = selectedValues.includes(option.value)
      ? selectedValues.filter((item) => item !== option.value)
      : [...selectedValues, option.value];
    onValuesChange?.(options.filter((item) => next.includes(item.value)));
  };

  return (
    <div {...flow} role="listbox" aria-multiselectable={multiple}>
      {options.map((option) => {
        const selectedOption = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={selectedOption}
            disabled={disabled}
            onClick={() => select(option)}
          >
            {renderOption?.(option, selectedOption) ?? option.display}
          </button>
        );
      })}
    </div>
  );
}

export interface TimelineProps extends CoreTimelineProps {
  renderItem?: (item: TimelineItem) => ReactNode;
}

export function Timeline({
  items,
  orientation = "vertical",
  renderItem,
  ...props
}: TimelineProps) {
  const flow = useFlowProps("fui-timeline", props);
  return (
    <ol {...flow} data-orientation={orientation}>
      {items.map((item) => (
        <li key={item.id} className="fui-timeline-item">
          <span className="fui-timeline-marker">
            {item.image ? (
              <img src={item.image} alt="" />
            ) : (
              <Icon icon={item.icon ?? "fa-solid fa-circle"} />
            )}
          </span>
          <div className="fui-timeline-content">
            {renderItem?.(item) ?? (
              <>
                <strong>{item.title}</strong>
                {item.description && <p>{item.description}</p>}
                {item.date && <time>{item.date}</time>}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface PopoverProps extends PropsWithChildren<CorePopoverProps> {
  trigger: ReactElement;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  children,
  open,
  placement = "bottom",
  closeOnOutsideClick = true,
  onOpenChange,
  ...props
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const shown = open ?? internalOpen;
  const root = useRef<HTMLSpanElement>(null);
  const flow = useFlowProps("fui-popover", props);
  const setShown = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!shown || !closeOnOutsideClick) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setShown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [shown, closeOnOutsideClick]);

  return (
    <span {...flow} ref={root} data-placement={placement}>
      {cloneElement(trigger, {
        onClick: () => setShown(!shown),
        "aria-expanded": shown,
      } as Record<string, unknown>)}
      {shown && <div className="fui-popover-content">{children}</div>}
    </span>
  );
}

export interface FilePreview {
  file: File;
  url?: string;
}
export interface FileUploadProps extends CoreFileUploadProps {
  onChange?: (files: File[]) => void;
}

export function FileUpload({
  accept,
  multiple,
  preview = true,
  maxSize,
  disabled,
  onChange,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const flow = useFlowProps("fui-file-upload", props);

  useEffect(
    () => () =>
      files.forEach((item) => item.url && URL.revokeObjectURL(item.url)),
    [files],
  );

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const accepted = Array.from(event.target.files ?? []).filter(
      (file) => !maxSize || file.size <= maxSize,
    );
    setFiles(
      accepted.map((file) => ({
        file,
        url:
          preview && file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
      })),
    );
    onChange?.(accepted);
  };

  return (
    <div {...flow}>
      <label className="fui-file-drop">
        <Icon icon="fa-solid fa-cloud-arrow-up" />
        <span>Choose file{multiple ? "s" : ""}</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={choose}
        />
      </label>
      {preview && files.length > 0 && (
        <div className="fui-file-previews">
          {files.map(({ file, url }) => (
            <div key={`${file.name}-${file.lastModified}`}>
              {url ? (
                <img src={url} alt={file.name} />
              ) : (
                <Icon icon="fa-solid fa-file" />
              )}
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface CarouselProps extends PropsWithChildren<CoreCarouselProps> {
  onChange?: (index: number) => void;
}

export function Carousel({
  children,
  activeIndex,
  loop = true,
  showIndicators = true,
  showControls = true,
  onChange,
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children);
  const [internalIndex, setInternalIndex] = useState(0);
  const index = activeIndex ?? internalIndex;
  const flow = useFlowProps("fui-carousel", props);
  const select = (next: number) => {
    const resolved = loop
      ? (next + slides.length) % slides.length
      : Math.max(0, Math.min(next, slides.length - 1));
    if (activeIndex === undefined) setInternalIndex(resolved);
    onChange?.(resolved);
  };

  return (
    <div {...flow}>
      <div className="fui-carousel-slide">{slides[index]}</div>
      {showControls && slides.length > 1 && (
        <>
          <button
            className="fui-carousel-prev"
            type="button"
            onClick={() => select(index - 1)}
            aria-label="Previous slide"
          >
            <Icon icon="fa-solid fa-chevron-left" />
          </button>
          <button
            className="fui-carousel-next"
            type="button"
            onClick={() => select(index + 1)}
            aria-label="Next slide"
          >
            <Icon icon="fa-solid fa-chevron-right" />
          </button>
        </>
      )}
      {showIndicators && (
        <div className="fui-carousel-indicators">
          {slides.map((_, itemIndex) => (
            <button
              key={itemIndex}
              type="button"
              aria-label={`Slide ${itemIndex + 1}`}
              aria-current={itemIndex === index}
              onClick={() => select(itemIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface BreadcrumbProps extends CoreBreadcrumbProps {
  renderItem?: (item: BreadcrumbItem) => ReactNode;
  onSelect?: (item: BreadcrumbItem) => void;
}

export function Breadcrumb({
  items,
  separatorIcon = "fa-solid fa-chevron-right",
  renderItem,
  onSelect,
  ...props
}: BreadcrumbProps) {
  const flow = useFlowProps("fui-breadcrumb", props);
  return (
    <nav {...flow} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <Icon icon={separatorIcon} />}
            <a
              href={item.href}
              aria-current={index === items.length - 1 ? "page" : undefined}
              onClick={(event) => {
                if (!item.href) event.preventDefault();
                onSelect?.(item);
              }}
            >
              {renderItem?.(item) ?? (
                <>
                  {item.image && <img src={item.image} alt="" />}
                  {item.icon && <Icon icon={item.icon} />}
                  {item.text && <span>{item.text}</span>}
                </>
              )}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface NotificationProps extends PropsWithChildren<CoreNotificationProps> {
  title?: string;
  onClose?: () => void;
}

export function Notification({
  children,
  title,
  open = true,
  type = "info",
  horizontal = "right",
  vertical = "top",
  duration = 0,
  dismissible = true,
  onClose,
  ...props
}: NotificationProps) {
  const flow = useFlowProps("fui-notification", props);
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(() => onClose?.(), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);
  if (!open) return null;
  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
  };
  return (
    <aside
      {...flow}
      data-type={type}
      data-horizontal={horizontal}
      data-vertical={vertical}
      role={type === "error" ? "alert" : "status"}
    >
      <Icon icon={`fa-solid ${icons[type]}`} />
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
      {dismissible && (
        <button type="button" aria-label="Close notification" onClick={onClose}>
          <Icon icon="fa-solid fa-xmark" />
        </button>
      )}
    </aside>
  );
}
