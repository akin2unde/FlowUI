import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FlowAutocompleteComponent,
  FlowBadgeComponent,
  FlowBreadcrumbComponent,
  FlowButtonComponent,
  FlowButtonGroupComponent,
  FlowCardComponent,
  FlowCarouselComponent,
  FlowChartComponent,
  FlowCheckboxComponent,
  FlowColorPickerComponent,
  FlowDateTimeComponent,
  FlowDialogComponent,
  FlowDividerComponent,
  FlowDropdownComponent,
  FlowHStackComponent,
  FlowIconComponent,
  FlowImageComponent,
  FlowInputComponent,
  FlowLabelComponent,
  FlowListboxComponent,
  FlowKnobComponent,
  FlowMenuComponent,
  FlowMultiSelectComponent,
  FlowPasswordInputComponent,
  FlowPopoverComponent,
  FlowRadioGroupComponent,
  FlowRatingComponent,
  FlowSectionComponent,
  FlowSliderComponent,
  FlowSwitchComponent,
  FlowTabComponent,
  FlowTableComponent,
  FlowTabsComponent,
  FlowTextAreaComponent,
  FlowTimelineComponent,
  FlowTooltipComponent,
  FlowTreeComponent,
  FlowTreeDropdownComponent,
  FlowTreeMultiSelectComponent,
  FlowVStackComponent,
  FlowFileUploadComponent,
  FlowNotificationComponent,
  FlowOTPInputComponent,
  FlowPhoneInputComponent,
  type BreadcrumbItem,
  type DialogPosition,
  type DropdownModel,
  type MenuItem,
  type PhoneCountry,
  type PhoneNumberValue,
  type SortState,
  type TableColumn,
  type TimelineItem,
  type TreeModel,
} from "@akin2unde/flowui-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FlowAutocompleteComponent,
    FlowBadgeComponent,
    FlowBreadcrumbComponent,
    FlowButtonComponent,
    FlowButtonGroupComponent,
    FlowCardComponent,
    FlowCarouselComponent,
    FlowChartComponent,
    FlowCheckboxComponent,
    FlowColorPickerComponent,
    FlowDateTimeComponent,
    FlowDialogComponent,
    FlowDividerComponent,
    FlowDropdownComponent,
    FlowHStackComponent,
    FlowIconComponent,
    FlowImageComponent,
    FlowInputComponent,
    FlowLabelComponent,
    FlowListboxComponent,
    FlowKnobComponent,
    FlowMenuComponent,
    FlowMultiSelectComponent,
    FlowPasswordInputComponent,
    FlowPopoverComponent,
    FlowRadioGroupComponent,
    FlowRatingComponent,
    FlowSectionComponent,
    FlowSliderComponent,
    FlowSwitchComponent,
    FlowTabComponent,
    FlowTableComponent,
    FlowTabsComponent,
    FlowTextAreaComponent,
    FlowTimelineComponent,
    FlowTooltipComponent,
    FlowTreeComponent,
    FlowTreeDropdownComponent,
    FlowTreeMultiSelectComponent,
    FlowVStackComponent,
    FlowFileUploadComponent,
    FlowNotificationComponent,
    FlowOTPInputComponent,
    FlowPhoneInputComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  name = "";
  password = "";
  notes = "";
  checked = true;
  notifications = true;
  volume = 40;
  status = "active";
  color = "#6d28d9";
  country: string | number = "ng";
  location: string | number = "lagos";
  selectedCountries: Array<string | number> = ["ng", "gh"];
  selectedTreeValues: Array<string | number> = ["lagos", "london"];
  expandedTreeValues: Array<string | number> = ["ng", "uk"];
  treeValue: string | number = "lagos";
  dialog: DialogPosition | null = null;
  period: string | number = "week";
  dateTime = "2026-09-01T09:30";
  autocomplete: string | number = "ng";
  rating = 4;
  listboxValues: Array<string | number> = [];
  selectedProduct?: Record<string, unknown>;
  // Persist this value per user and restore it when the screen opens.
  visibleProductColumns = ["name", "price"];
  noticeOpen = false;
  knob = 68;
  otp = "";
  phone: PhoneNumberValue = {
    countryCode: "NG",
    dialCode: "+234",
    number: "",
  };
  readonly phoneCountries: PhoneCountry[] = [
    { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
    { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  ];
  readonly salesChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    series: [
      {
        name: "Sales",
        data: [18, 32, 27, 46, 39],
        color: "primary.600" as const,
      },
      {
        name: "Orders",
        data: [12, 20, 16, 30, 25],
        color: "info.500" as const,
      },
    ],
  };
  readonly componentCatalog = [
    [
      "Layout",
      "HC",
      "Arranges children horizontally.",
      `<fui-hc gap="sm">...</fui-hc>`,
    ],
    [
      "Layout",
      "VC",
      "Arranges children vertically.",
      `<fui-vc gap="sm">...</fui-vc>`,
    ],
    [
      "Layout",
      "Divider",
      "Separates content horizontally or vertically.",
      `<fui-divider />`,
    ],
    [
      "Layout",
      "Card",
      "Groups content with optional header and footer.",
      `<fui-card>...</fui-card>`,
    ],
    [
      "Display",
      "Label",
      "Displays styled or form-associated text.",
      `<fui-label>Name</fui-label>`,
    ],
    [
      "Display",
      "Badge",
      "Shows compact status or count information.",
      `<fui-badge>Ready</fui-badge>`,
    ],
    [
      "Display",
      "Icon",
      "Renders a Font Awesome icon.",
      `<fui-icon icon="fa-solid fa-check" />`,
    ],
    [
      "Display",
      "Image",
      "Displays an image with fit and fallback.",
      `<fui-image [src]="url" alt="Product" />`,
    ],
    [
      "Display",
      "Tooltip",
      "Shows short guidance around a trigger.",
      `<fui-tooltip text="Save">...</fui-tooltip>`,
    ],
    [
      "Display",
      "Carousel",
      "Moves through templated slides.",
      `<fui-carousel>...</fui-carousel>`,
    ],
    [
      "Display",
      "Breadcrumb",
      "Shows image, icon, or text ancestry.",
      `<fui-breadcrumb [items]="items" />`,
    ],
    [
      "Display",
      "Chart",
      "Paints bar, line, pie, or doughnut series.",
      `<fui-chart type="bar" [data]="data" />`,
    ],
    [
      "Actions",
      "Button",
      "Triggers an action with variants and icons.",
      `<fui-button>Save</fui-button>`,
    ],
    [
      "Actions",
      "ButtonGroup",
      "Provides segmented single selection.",
      `<fui-button-group [selectable]="true">...</fui-button-group>`,
    ],
    [
      "Actions",
      "Popover",
      "Shows templated floating content.",
      `<fui-popover [content]="content">...</fui-popover>`,
    ],
    [
      "Actions",
      "Notification",
      "Shows positioned status feedback.",
      `<fui-notification type="success">Saved</fui-notification>`,
    ],
    [
      "Forms",
      "Input",
      "Accepts text, integer, decimal, money, or alphabet values.",
      `<fui-input inputMode="money" currencySymbol="₦" />`,
    ],
    [
      "Forms",
      "PasswordInput",
      "Accepts passwords with visibility toggle.",
      `<fui-password-input [(value)]="password" />`,
    ],
    [
      "Forms",
      "OTPInput",
      "Captures an OTP using auto-advancing cells.",
      `<fui-otp-input [(value)]="otp" />`,
    ],
    [
      "Forms",
      "PhoneInput",
      "Captures country code and phone number.",
      `<fui-phone-input [countries]="countries" />`,
    ],
    [
      "Forms",
      "DateTime",
      "Captures local date/time without UTC shifting.",
      `<fui-date-time mode="datetime" [(value)]="date" />`,
    ],
    [
      "Forms",
      "Autocomplete",
      "Searches options while typing.",
      `<fui-autocomplete [options]="options" />`,
    ],
    [
      "Forms",
      "TextArea",
      "Captures multiline text.",
      `<fui-textarea [rows]="4" />`,
    ],
    [
      "Forms",
      "Checkbox",
      "Toggles an independent boolean value.",
      `<fui-checkbox label="Active" />`,
    ],
    [
      "Forms",
      "RadioButton",
      "Selects one native radio choice.",
      `<fui-radio name="status" />`,
    ],
    [
      "Forms",
      "RadioGroup",
      "Selects one radio option.",
      `<fui-radio-group [options]="options" />`,
    ],
    [
      "Forms",
      "ColorPicker",
      "Selects a colour.",
      `<fui-color-picker [(value)]="color" />`,
    ],
    [
      "Forms",
      "Slider",
      "Selects a numeric linear range value.",
      `<fui-slider [(value)]="volume" />`,
    ],
    [
      "Forms",
      "Switch",
      "Toggles a boolean setting.",
      `<fui-switch label="Enabled" />`,
    ],
    [
      "Forms",
      "Knob",
      "Selects a circular range value.",
      `<fui-knob [(value)]="capacity" />`,
    ],
    [
      "Forms",
      "Rating",
      "Captures whole or half-step ratings.",
      `<fui-rating [(value)]="rating" />`,
    ],
    [
      "Forms",
      "Listbox",
      "Shows a templatable selection list.",
      `<fui-listbox [options]="options" />`,
    ],
    [
      "Forms",
      "FileUpload",
      "Selects and previews files.",
      `<fui-file-upload [preview]="true" />`,
    ],
    [
      "Navigation",
      "Menu",
      "Shows actions with icons and badges.",
      `<fui-menu [items]="items" />`,
    ],
    [
      "Navigation",
      "Dropdown",
      "Provides searchable grouped selection.",
      `<fui-dropdown [options]="options" />`,
    ],
    [
      "Navigation",
      "MultiSelect",
      "Selects options using checkboxes and chips.",
      `<fui-multi-select [options]="options" />`,
    ],
    [
      "Navigation",
      "TreeDropdown",
      "Selects one nested value without chips.",
      `<fui-tree-dropdown [options]="tree" />`,
    ],
    [
      "Navigation",
      "TreeMultiSelect",
      "Selects nested values with checkboxes.",
      `<fui-tree-multi-select [nodes]="tree" />`,
    ],
    [
      "Navigation",
      "Tree",
      "Displays expandable hierarchical content.",
      `<fui-tree [nodes]="tree" />`,
    ],
    [
      "Navigation",
      "Tabs / Tab",
      "Switches between content panels.",
      `<fui-tabs><fui-tab id="one">...</fui-tab></fui-tabs>`,
    ],
    [
      "Navigation",
      "Section",
      "Expands accordion content.",
      `<fui-section title="Settings">...</fui-section>`,
    ],
    [
      "Data",
      "Table",
      "Sorts, selects, configures, and exports rows.",
      `<fui-table [data]="rows" [columns]="columns" />`,
    ],
    [
      "Overlay",
      "Dialog",
      "Shows a positioned modal.",
      `<fui-dialog [open]="open" position="right" />`,
    ],
  ] as const;

  readonly menuItems: MenuItem[] = [
    {
      id: "new",
      label: "New product",
      icon: "fa-solid fa-plus",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "fa-solid fa-envelope",
      badge: 4,
    },
    {
      id: "separator",
      label: "",
      separator: true,
    },
    {
      id: "delete",
      label: "Delete",
      icon: "fa-solid fa-trash",
    },
  ];

  readonly countries: DropdownModel[] = [
    {
      display: "Nigeria",
      value: "ng",
      other: { phoneCode: "+234" },
      group: "Africa",
    },
    {
      display: "United Kingdom",
      value: "uk",
      other: { phoneCode: "+44" },
      group: "Europe",
    },
    {
      display: "Ghana",
      value: "gh",
      other: { phoneCode: "+233" },
      group: "Africa",
    },
    {
      display: "South Africa",
      value: "za",
      other: { phoneCode: "+27" },
      group: "Africa",
      disabled: true,
    },
  ];

  readonly tree: TreeModel[] = [
    {
      display: "Nigeria",
      value: "ng",
      other: { type: "country" },
      children: [
        {
          display: "Lagos",
          value: "lagos",
          other: { type: "state" },
        },
        {
          display: "Abuja",
          value: "abuja",
          other: { type: "city" },
        },
      ],
    },
    {
      display: "United Kingdom",
      value: "uk",
      other: { type: "country" },
      children: [
        {
          display: "London",
          value: "london",
          other: { type: "city" },
        },
      ],
    },
  ];

  data: Record<string, unknown>[] = [
    { name: "Rice", category: "Food", price: 42000 },
    { name: "Vegetable oil", category: "Food", price: 18500 },
    { name: "Detergent", category: "Home", price: 9300 },
  ];

  readonly columns: TableColumn<Record<string, unknown>>[] = [
    {
      field: "name",
      header: "Product",
      sortable: true,
    },
    {
      field: "category",
      header: "Category",
      sortable: true,
      defaultVisible: false,
    },
    {
      field: "price",
      header: "Price",
      sortable: true,
      align: "right",
      format: (value) => `₦${Number(value).toLocaleString()}`,
    },
  ];

  sort: SortState = {
    field: "name",
    direction: "asc",
  };

  readonly positions: DialogPosition[] = [
    "center",
    "left",
    "top",
    "bottom",
    "right",
  ];

  readonly timelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Order created",
      description: "The customer placed an order.",
      date: "09:00",
      icon: "fa-solid fa-cart-plus",
    },
    {
      id: 2,
      title: "Payment confirmed",
      description: "Payment was received successfully.",
      date: "09:10",
      icon: "fa-solid fa-credit-card",
    },
    {
      id: 3,
      title: "Ready to dispatch",
      date: "10:15",
      icon: "fa-solid fa-truck",
    },
  ];

  readonly breadcrumbs: BreadcrumbItem[] = [
    { id: 1, text: "Home", icon: "fa-solid fa-house" },
    {
      id: 2,
      text: "Products",
      image: "https://picsum.photos/40/40?category",
    },
    { id: 3, text: "Rice" },
  ];

  selectCountry(model: DropdownModel): void {
    this.country = model.value;
  }

  selectLocation(model: TreeModel): void {
    this.location = model.value;
  }

  listboxChanged(options: DropdownModel[]): void {
    this.listboxValues = options.map((option) => option.value);
  }

  sortChanged(next: SortState): void {
    this.sort = next;
    this.data = [...this.data].sort((first, second) => {
      if (!next.direction) return 0;

      const result = String(first[next.field]).localeCompare(
        String(second[next.field]),
        undefined,
        { numeric: true },
      );

      return next.direction === "asc" ? result : -result;
    });
  }

  dialogOpened(): void {
    console.log("Dialog opened");
  }
}
