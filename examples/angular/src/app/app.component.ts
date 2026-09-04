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
  type BreadcrumbItem,
  type DialogPosition,
  type DropdownModel,
  type MenuItem,
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
