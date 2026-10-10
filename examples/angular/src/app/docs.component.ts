import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  inject,
  signal,
  computed,
} from "@angular/core";
import {
  FlowAsyncLabelComponent,
  AsyncLabelService,
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
  FlowRadioButtonComponent,
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

import { AppComponent } from "./app.component";
import { componentDocs, type Framework } from "../../../shared/docs-data";
import { asyncLabelSetup, themeSetup } from "../../../shared/docs-setup";
import { demoStats } from "./lookup-demo";
import { createTheme, themeToCSS } from "@akin2unde/flowui-core";
@Component({
  selector: "app-docs",
  standalone: true,
  imports: [
    AppComponent,
    FlowAsyncLabelComponent,
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
    FlowRadioButtonComponent,
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
  templateUrl: "./docs.component.html",
})
export class DocsComponent extends AppComponent {
  readonly labels = inject(AsyncLabelService);
  readonly stats = demoStats;
  readonly docs = componentDocs;
  readonly groups = [...new Set(componentDocs.map((doc) => doc.group))];
  readonly frameworks: Framework[] = ["react", "angular", "native"];
  readonly names = {
    react: "React",
    angular: "Angular",
    native: "React Native",
  };
  readonly page = signal(this.readRoute());
  readonly selectedDoc = computed(() =>
    componentDocs.find((doc) => doc.name === this.page().selected),
  );
  search = "";
  menu = false;
  dark = false;
  copied = "";
  readonly rows = [
    ["SAL001", "CUS001", "₦24,500"],
    ["SAL002", "CUS001", "₦18,000"],
    ["SAL003", "CUS002", "₦9,500"],
    ["SAL004", "CUS003", "₦12,000"],
  ];
  readonly statuses = [
    { value: "active", display: "Active", other: null },
    { value: "low", display: "Low Stock", other: null },
    { value: "out", display: "Out Of Stock", other: null },
  ];
  readonly sampleResults =
    '{ "CUS001": "Akintunde", "CUS002": "Mary", "CUS003": null }';
  readonly setup = asyncLabelSetup;
  readonly themeSetup = themeSetup;
  private readRoute() {
    const parts = location.hash.slice(2).split("/");
    return {
      framework: (["react", "angular", "native"].includes(parts[0])
        ? parts[0]
        : "angular") as Framework,
      selected: parts[1] ? decodeURIComponent(parts[1]) : "AsyncLabel",
    };
  }
  @HostListener("window:hashchange") routeChanged() {
    this.page.set(this.readRoute());
    this.menu = false;
    this.copied = "";
    window.scrollTo(0, 0);
  }
  @HostListener("window:keydown", ["$event"]) keyboard(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      document.getElementById("docs-search")?.focus();
    }
    if (event.key === "Escape") this.menu = false;
  }
  link(name: string, framework = this.page().framework) {
    return `#/${framework}/${encodeURIComponent(name)}`;
  }
  matches(name: string) {
    return name.toLowerCase().includes(this.search.toLowerCase());
  }
  groupDocs(group: string) {
    return componentDocs.filter(
      (doc) =>
        doc.group === group && this.matches(doc.name + " " + doc.description),
    );
  }
  toggleTheme() {
    this.dark = !this.dark;
    let style = document.getElementById("docs-theme");
    if (!style) {
      style = document.createElement("style");
      style.id = "docs-theme";
      document.head.append(style);
    }
    style.textContent = themeToCSS(createTheme(), this.dark ? "dark" : "light");
  }
  async copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      this.copied = "Copied";
    } catch {
      this.copied = "Select code to copy";
    }
  }
  scroll(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
  skip(event: Event) {
    event.preventDefault();
    document.getElementById("docs-content")?.focus();
  }
}
