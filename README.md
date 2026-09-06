# FlowUI

Current release: **0.1.6**

FlowUI is a Tailwind-styled component library with native React and Angular adapters over one framework-independent TypeScript core.

## Packages

- `@akin2unde/flowui-core` — contracts, themes, responsive values and style resolution. It imports neither React nor Angular.
- `@akin2unde/flowui-react` — React functional components.
- `@akin2unde/flowui-angular` — standalone Angular components.
- `@flowui/internal-styles` — private Tailwind build used to create the CSS shipped inside both adapters.

An application does **not** need Tailwind to use FlowUI. It may install Tailwind for its own application styling without affecting FlowUI.

## Responsive values

`default` is the value for all screen sizes. A breakpoint overrides it from that width upward:

```tsx
<HC
  direction={{ default: "column", md: "row" }}
  width={{ default: "full", lg: 900 }}
/>
```

```html
<fui-hc
  [direction]="{ default: 'column', md: 'row' }"
  [width]="{ default: 'full', lg: 900 }"
>
</fui-hc>
```

The word `base` is deliberately not part of the public API.

## Install and build the workspace

```bash
npm install
npm run build
npm test
```

Run the galleries:

```bash
npm run dev:react
npm run dev:angular
```

Framework packages can also be built independently from a clean checkout.
`npm run build:react` and `npm run build:angular` automatically build their
core and stylesheet dependencies first.

## React setup

```bash
npm install @akin2unde/flowui-react @fortawesome/fontawesome-free
```

```tsx
import "@akin2unde/flowui-react/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FlowUIProvider } from "@akin2unde/flowui-react";

root.render(
  <FlowUIProvider mode="system">
    <App />
  </FlowUIProvider>,
);
```

## Angular setup

```bash
npm install @akin2unde/flowui-angular @fortawesome/fontawesome-free
```

Add the CSS files to `angular.json`:

```json
{
  "styles": [
    "@fortawesome/fontawesome-free/css/all.min.css",
    "@akin2unde/flowui-angular/styles.css",
    "src/styles.css"
  ]
}
```

Register the theme:

```ts
bootstrapApplication(AppComponent, {
  providers: [provideFlowUI({ mode: "system" })],
});
```

All Angular components are standalone and are imported only where they are used.

## Included components

| Area       | Components                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | `HC`/`HStack`, `VC`/`VStack`, `Divider`, `Card`, `Timeline`                                                                                                                                                       |
| Display    | `Label`, `Badge`, `Icon`, `Image`, `Tooltip`, `Carousel`, `Breadcrumb`, `Chart`                                                                                                                                   |
| Actions    | `Button`, selectable `ButtonGroup`, `Popover`, `Notification`                                                                                                                                                     |
| Forms      | `Input`, `PasswordInput`, `OTPInput`, `PhoneInput`, `Knob`, `DateTime`, `Autocomplete`, `TextArea`, `Checkbox`, `RadioButton`, `RadioGroup`, `ColorPicker`, `Slider`, `Switch`, `Rating`, `Listbox`, `FileUpload` |
| Navigation | `Menu`, searchable/grouped `Dropdown`, `MultiSelect`, `TreeDropdown`, `TreeMultiSelect`, `Tree`, `Tabs`, `Tab`, `Section`                                                                                         |
| Data       | `Table` with sorting, alternating rows, user-selectable columns, row selection, Excel export and PDF export                                                                                                       |
| Overlay    | `Dialog` at center, left, right, top or bottom                                                                                                                                                                    |

## Styling precedence

From lowest to highest priority:

1. Component defaults
2. Component variant, size and semantic color
3. FlowUI general properties such as `padding` and `backgroundColor`
4. Application `className`
5. Application inline `style`

Read [Core walkthrough](docs/CORE-WALKTHROUGH.md) for a detailed explanation of the architecture and code.

## Dropdown data model

All dropdowns use the same base model:

```ts
interface DropdownModel {
  display: string | number;
  value: string | number;
  other: any;
  disabled?: boolean;
  group?: string | number;
}
```

`display` is what the user sees, `value` is the stable selection value, and
`other` carries application-specific metadata. `disabled` prevents selection,
while `group` is used only when grouped display is enabled. Tree dropdowns add
`children`, `selectable`, and `hasChildren` for nesting and lazy loading.

## Dropdown examples

### React

```tsx
<Dropdown
  options={countries}
  value={country}
  searchable
  grouped
  hasMore
  onChange={(option) => setCountry(option.value)}
  onLoadMore={loadNextCountryPage}
/>

<MultiSelect
  options={countries}
  value={selectedCountries}
  searchable
  chipTextColor="primary.700"
  chipBackgroundColor="primary.100"
  chipCloseIconColor="textInverse"
  onChange={(values, models) => setSelectedCountries(values)}
  renderOption={(option) => (
    <CountryOption country={option.other} />
  )}
/>

<TreeDropdown
  options={categoryTree}
  value={category}
  searchable
  onChange={(node) => setCategory(node.value)}
/>

<TreeMultiSelect
  nodes={categoryTree}
  value={selectedCategories}
  expandedValues={expandedCategories}
  searchable
  cascadeSelection
  onChange={(values, nodes) => setSelectedCategories(values)}
  onExpandedValuesChange={setExpandedCategories}
  onLoadChildren={loadCategoryChildren}
/>
```

The close button on a `MultiSelect` or `TreeMultiSelect` chip removes that
value and emits the updated value and model arrays.

### Angular

```html
<fui-dropdown
  [options]="countries"
  [(value)]="country"
  [searchable]="true"
  [grouped]="true"
  [hasMore]="true"
  (loadMore)="loadNextCountryPage()"
/>

<fui-multi-select
  [options]="countries"
  [(value)]="selectedCountries"
  [searchable]="true"
  chipTextColor="primary.700"
  chipBackgroundColor="primary.100"
  chipCloseIconColor="textInverse"
  [optionTemplate]="countryOption"
/>

<ng-template #countryOption let-option let-selected="selected">
  <app-country-option [country]="option.other" />
</ng-template>

<fui-tree-dropdown
  [options]="categoryTree"
  [value]="category"
  [searchable]="true"
  (selected)="category = $event.value"
/>

<fui-tree-multi-select
  [nodes]="categoryTree"
  [(value)]="selectedCategories"
  [(expandedValues)]="expandedCategories"
  [searchable]="true"
  [cascadeSelection]="true"
  (loadChildren)="loadCategoryChildren($event)"
/>
```

## Naming convention

Angular element selectors and generated CSS classes use the short `fui-`
prefix, for example `<fui-vc>`, `<fui-card>` and `.fui-control`. TypeScript
package and provider names keep the full FlowUI product name.

## Date and time values

`DateTime` supports `date`, `time`, and `datetime` modes. Combined mode also
provides **Start of day** and **End of day** buttons. Values stay in native local
formats (`YYYY-MM-DD`, `HH:mm`, or `YYYY-MM-DDTHH:mm`) and are never passed
through `Date.prototype.toISOString()`. This prevents the common one-hour UTC
shift.

The calendar closes after a date is selected, when Escape is pressed, or when
the user clicks outside it. Dropdown, MultiSelect, TreeDropdown,
TreeMultiSelect, Autocomplete, PhoneInput, and Popover use the same outside-click
dismissal rule.

## Validated inputs and new controls

`Input` defaults to normal text and accepts both letters and numbers. Set
`inputMode` to `integer`, `decimal`, `money`, or `alphabet` when the field must
filter its value. Money mode accepts decimals and displays `currencySymbol`.

```tsx
<Input inputMode="integer" onValueChange={setQuantity} />
<Input inputMode="decimal" onValueChange={setWeight} />
<Input inputMode="money" currencySymbol="₦" onValueChange={setPrice} />
<Input inputMode="alphabet" onValueChange={setCustomerName} />

<Knob value={capacity} valueSuffix="%" onChange={setCapacity} />
<OTPInput value={otp} length={6} onChange={setOtp} onComplete={verifyOtp} />
<PhoneInput countries={countries} value={phone} onChange={setPhone} />
<Chart type="bar" data={salesChart} showValues />
```

```html
<fui-input inputMode="integer" [(value)]="quantity" />
<fui-input inputMode="money" currencySymbol="₦" [(value)]="price" />
<fui-knob [(value)]="capacity" valueSuffix="%" />
<fui-otp-input [(value)]="otp" [length]="6" (completed)="verifyOtp($event)" />
<fui-phone-input [countries]="countries" [(value)]="phone" />
<fui-chart type="bar" [data]="salesChart" [showValues]="true" />
```

`PhoneInput` binds one object containing `countryCode`, `dialCode`, and
`number`. `Chart` accepts `labels` and one or more named numeric series and can
paint `bar`, `line`, `pie`, or `doughnut` views.

## Version 0.1.6

- Redesigned Dropdown with optional search, grouping, templates and load-more.
- Added checkbox MultiSelect with removable and colour-configurable chips.
- Added nested TreeMultiSelect with search, cascading and indeterminate
  selection, templates, controlled expansion and lazy child loading.
- Added searchable single-selection TreeDropdown without chips.
- Added outside-click and Escape dismissal to floating controls.
- Improved chip close-button padding, checkbox alignment, DateTime time field,
  Listbox selection, and selectable ButtonGroup styling.
- Added validated integer, decimal, money and alphabet Input modes.
- Added Knob, OTPInput, country-code PhoneInput, and data-driven Chart.
- Added named usage cards and short code samples to both galleries.

## Version 0.1.1

- Added DateTime, Autocomplete, Rating, templatable Listbox, Timeline,
  templatable Popover, FileUpload with previews, Carousel, Breadcrumb and
  positioned Notification.
- Added single selection and selected styling to ButtonGroup.
- Added optional alternating table rows and row selection events.
- Updated both example galleries with all new controls.
