import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FlowBadgeComponent,
  FlowButtonComponent,
  FlowButtonGroupComponent,
  FlowCardComponent,
  FlowCheckboxComponent,
  FlowColorPickerComponent,
  FlowDialogComponent,
  FlowDividerComponent,
  FlowDropdownComponent,
  FlowHStackComponent,
  FlowIconComponent,
  FlowImageComponent,
  FlowInputComponent,
  FlowLabelComponent,
  FlowMenuComponent,
  FlowPasswordInputComponent,
  FlowRadioGroupComponent,
  FlowSectionComponent,
  FlowSliderComponent,
  FlowSwitchComponent,
  FlowTabComponent,
  FlowTableComponent,
  FlowTabsComponent,
  FlowTextAreaComponent,
  FlowTooltipComponent,
  FlowTreeComponent,
  FlowTreeDropdownComponent,
  FlowVStackComponent,
  type DialogPosition,
  type DropdownModel,
  type MenuItem,
  type SortState,
  type TableColumn,
  type TreeModel,
} from "@akin2unde/flowui-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FlowBadgeComponent,
    FlowButtonComponent,
    FlowButtonGroupComponent,
    FlowCardComponent,
    FlowCheckboxComponent,
    FlowColorPickerComponent,
    FlowDialogComponent,
    FlowDividerComponent,
    FlowDropdownComponent,
    FlowHStackComponent,
    FlowIconComponent,
    FlowImageComponent,
    FlowInputComponent,
    FlowLabelComponent,
    FlowMenuComponent,
    FlowPasswordInputComponent,
    FlowRadioGroupComponent,
    FlowSectionComponent,
    FlowSliderComponent,
    FlowSwitchComponent,
    FlowTabComponent,
    FlowTableComponent,
    FlowTabsComponent,
    FlowTextAreaComponent,
    FlowTooltipComponent,
    FlowTreeComponent,
    FlowTreeDropdownComponent,
    FlowVStackComponent,
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
  treeValue: string | number = "lagos";
  dialog: DialogPosition | null = null;

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
    },
    {
      display: "United Kingdom",
      value: "uk",
      other: { phoneCode: "+44" },
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

  selectCountry(model: DropdownModel): void {
    this.country = model.value;
  }

  selectLocation(model: TreeModel): void {
    this.location = model.value;
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
