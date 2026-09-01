import type {
  AlignValue,
  BaseUIProps,
  ComponentSize,
  ComponentVariant,
  DisableableProps,
  FlexContainerProps,
  FocusableProps,
  LoadingProps,
  Orientation,
  PaletteColor,
  ReadOnlyProps,
  RequiredProps,
  TypographyProps,
} from "./types";

export interface StackProps extends BaseUIProps, FlexContainerProps {
  as?:
    | "div"
    | "section"
    | "article"
    | "nav"
    | "header"
    | "footer"
    | "main"
    | "aside"
    | "form";
  inline?: boolean;
}
export interface HStackProps extends StackProps {}
export interface VStackProps extends StackProps {}
export interface IconProps extends BaseUIProps, TypographyProps {
  icon: string;
  label?: string;
  spin?: boolean;
}
export interface LabelProps extends BaseUIProps, TypographyProps {
  htmlFor?: string;
  required?: boolean;
}
export interface BadgeProps extends BaseUIProps, TypographyProps {
  color?: PaletteColor;
  variant?: Exclude<ComponentVariant, "link">;
  size?: ComponentSize;
  icon?: string;
  iconPosition?: "left" | "right";
}
export interface ButtonProps
  extends
    BaseUIProps,
    TypographyProps,
    DisableableProps,
    LoadingProps,
    FocusableProps {
  type?: "button" | "submit" | "reset";
  variant?: ComponentVariant;
  color?: PaletteColor;
  size?: ComponentSize;
  icon?: string;
  iconPosition?: "left" | "right" | "center";
  badge?: string | number;
  ariaLabel?: string;
}
export interface ButtonGroupProps extends BaseUIProps {
  orientation?: Orientation;
  attached?: boolean;
  align?: AlignValue;
  selectable?: boolean;
  value?: string | number;
}
export interface InputProps
  extends
    BaseUIProps,
    TypographyProps,
    DisableableProps,
    ReadOnlyProps,
    RequiredProps,
    FocusableProps {
  name?: string;
  value?: string | number;
  placeholder?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "url"
    | "date"
    | "time";
}
export interface DividerProps extends BaseUIProps {
  orientation?: Orientation;
  label?: string;
}
export interface ImageProps extends BaseUIProps {
  src: string;
  alt: string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  loading?: "eager" | "lazy";
  fallbackSrc?: string;
}
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  separator?: boolean;
  children?: MenuItem[];
}
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface DropdownModel {
  display: string | number;
  value: string | number;
  other: any;
}
export interface TreeModel extends DropdownModel {
  children?: TreeModel[];
}
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}
export type SortDirection = "asc" | "desc" | null;
export interface SortState {
  field: string;
  direction: SortDirection;
}
export interface TableColumn<T> {
  field: keyof T & string;
  header: string;
  /** False hides this column until the user selects it. */
  defaultVisible?: boolean;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  format?: (value: unknown, row: T) => string | number;
}
export type DialogPosition = "center" | "left" | "right" | "top" | "bottom";
export type TooltipLocation = "top" | "right" | "bottom" | "left";
export interface CardProps extends BaseUIProps {
  variant?: "outline" | "elevated" | "filled";
}
export interface SliderProps extends BaseUIProps, DisableableProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  name?: string;
}
export interface SwitchProps extends BaseUIProps, DisableableProps {
  checked?: boolean;
  label?: string;
  name?: string;
}
export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showToggle?: boolean;
  visible?: boolean;
}
export interface TreeProps extends BaseUIProps {
  nodes: TreeModel[];
  value?: string | number;
  defaultExpanded?: boolean;
}
export interface TooltipProps extends BaseUIProps {
  text: string;
  location?: TooltipLocation;
  delay?: number;
}

export type DateTimeMode = "date" | "time" | "datetime";
export interface DateTimeProps extends BaseUIProps, DisableableProps {
  value?: string;
  mode?: DateTimeMode;
  name?: string;
  min?: string;
  max?: string;
  showDayBoundaryButtons?: boolean;
}
export interface AutocompleteProps extends BaseUIProps, DisableableProps {
  options: DropdownModel[];
  value?: string | number;
  placeholder?: string;
  minCharacters?: number;
}
export interface RatingProps extends BaseUIProps, DisableableProps {
  value?: number;
  maximum?: number;
  precision?: 1 | 0.5;
  readOnly?: boolean;
}
export interface ListboxProps extends BaseUIProps, DisableableProps {
  options: DropdownModel[];
  value?: string | number;
  multiple?: boolean;
}
export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  icon?: string;
  image?: string;
  other?: any;
}
export interface TimelineProps extends BaseUIProps {
  items: TimelineItem[];
  orientation?: Orientation;
}
export interface PopoverProps extends BaseUIProps {
  open?: boolean;
  placement?: TooltipLocation;
  closeOnOutsideClick?: boolean;
}
export interface FileUploadProps extends BaseUIProps, DisableableProps {
  accept?: string;
  multiple?: boolean;
  preview?: boolean;
  maxSize?: number;
}
export interface CarouselProps extends BaseUIProps {
  activeIndex?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showControls?: boolean;
}
export interface BreadcrumbItem {
  id: string | number;
  text?: string;
  image?: string;
  icon?: string;
  href?: string;
  disabled?: boolean;
  other?: any;
}
export interface BreadcrumbProps extends BaseUIProps {
  items: BreadcrumbItem[];
  separatorIcon?: string;
}
export type NotificationType = "success" | "error" | "warning" | "info";
export type NotificationHorizontal = "left" | "center" | "right";
export type NotificationVertical = "top" | "bottom";
export interface NotificationProps extends BaseUIProps {
  open?: boolean;
  type?: NotificationType;
  horizontal?: NotificationHorizontal;
  vertical?: NotificationVertical;
  duration?: number;
  dismissible?: boolean;
}
