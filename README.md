# FlowUI

Development version: **0.3.0** across all adapters (not yet published).

FlowUI is a component library for React, Angular, React Native, and Blazor. The JavaScript adapters share a framework-independent TypeScript core. FlowUI.Blazor is a .NET 10 Razor Class Library with its own C# implementation and isolated CSS.

## Packages

- `@akin2unde/flowui-core` — contracts, themes, responsive values and style resolution. It imports neither React nor Angular.
- `@akin2unde/flowui-react` — React functional components.
- `@akin2unde/flowui-angular` — standalone Angular components.
- `@akin2unde/flowui-react-native` — lightweight React Native, Expo and React Native Web controls with NativeWind `className` support.
- `FlowUI.Blazor` — .NET 10 Razor components with separate markup, C# code-behind, isolated styles, and custom light/dark themes.
- `@flowui/internal-styles` — private Tailwind build used by the browser React and Angular adapters.

React and Angular applications do **not** need Tailwind to use FlowUI because their packages ship compiled CSS. React Native applications install NativeWind when they want Tailwind `className` styling.

## Framework guides

- [Blazor setup, component APIs, themes, and debugging](packages/blazor/README.md)
- [Blazor sample application](examples/blazor/README.md)
- [Blazor control inventory](BLAZOR-CONTROLS.md)

- [Screenshot usage guide](docs/USAGE-IMAGE-GUIDE.md)
- [AsyncLabel: resolvers, batching, cache and backend examples](docs/ASYNC-LABEL.md)
- [React setup and first screen](docs/REACT.md)
- [Angular setup and first screen](docs/ANGULAR.md)
- [React Native, Expo and web setup](docs/REACT-NATIVE.md)

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
npm ci
npm run setup:react-native-example
npm run build
npm test
```

Run the sidebar documentation sites or native gallery:

```bash
npm run dev:react
npm run dev:angular
npm run dev:react-native
npm run dev:react-native:web
```

Both React Native development commands build the local package before starting
Expo, so its `dist` entry points are always available.

Framework packages can also be built independently from a clean checkout.
`npm run build:react` and `npm run build:angular` automatically build their
core and stylesheet dependencies first.

## Packaging and publishing

The 0.2.1 packaging fix builds packages before `npm pack` or `npm publish`.
This prevents a clean checkout from publishing a manifest without its declared
JavaScript, TypeScript declarations or stylesheet files. React Native includes
these release safeguards in 0.2.4. Component APIs are unchanged.

From the workspace root:

```bash
npm ci
npm run build:packages
npm run check:packages
npm run typecheck
npm test
npm run publish:packages
```

`check:packages` checks the file list produced by `npm pack --dry-run`, including
all declared entry points and stylesheet exports. It fails if a file is missing
or empty. It also checks Angular's generated `dist` package, whose CSS export
must be relative to that directory. `publish:packages` builds and checks every
package before publishing core, React, Angular and React Native in that order.

To publish only React and its updated core dependency:

```bash
npm publish -w @akin2unde/flowui-core --access public
npm publish -w @akin2unde/flowui-react --access public
```

Each package's `prepack` hook builds its dependencies and checks its tarball
before npm publishes it. Run these commands from this source workspace; do not
use `--ignore-scripts` for publishing. npm versions cannot be overwritten, so
publish the new patch versions and then update the consuming application:

```bash
npm install @akin2unde/flowui-react@0.2.1
```

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

## Blazor setup

FlowUI.Blazor targets **.NET 10**. Install the .NET 10 SDK to build and run
it. No npm install, Tailwind setup, or JavaScript package build is required
for the Blazor sample.

### Run the included sample

From the repository root:

```bash
dotnet restore FlowUI.Blazor.slnx
dotnet build FlowUI.Blazor.slnx
dotnet run --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

Open **http://localhost:5180**. For development with change watching:

```bash
dotnet watch --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

The sample uses Interactive Server and references the local library. The
library does not force a render mode; consuming apps choose their own host.
Interactive rendering is required for C# click handlers and other events.

### Reference the library

For an application in this repository, add a project reference (adjust the
application path):

```bash
dotnet add path/to/MyApp.csproj reference packages/blazor/FlowUI.Blazor.csproj
```

Once version 0.3.0 is published to NuGet, consumers can install it with:

```bash
dotnet add package FlowUI.Blazor --version 0.3.0
```

The archive includes the package source; that alone does not publish it to
NuGet. See [the release guide](BLAZOR-RELEASE.md) for packaging instructions.

Add common namespaces to the app's `Components/_Imports.razor` (or import
only those needed directly in a page):

```razor
@using FlowUI.Blazor.Layout
@using FlowUI.Blazor.Presentation
@using FlowUI.Blazor.Buttons
@using FlowUI.Blazor.Forms
@using FlowUI.Blazor.Selection
@using FlowUI.Blazor.Overlays
@using FlowUI.Blazor.Navigation
@using FlowUI.Blazor.DataDisplay
@using FlowUI.Blazor.Theming
@using FlowUI.Blazor.Styling
```

Include the host's generated isolated stylesheet in `Components/App.razor`:

```html
<link rel="stylesheet" href="MyApp.styles.css" />
```

Replace `MyApp` with your application's assembly name. The stylesheet
includes the referenced library's isolated CSS; do not link individual
`.razor.css` files or use the React/Angular stylesheet for Blazor.

### First component

```razor
<FlowThemeProvider Mode="FlowThemeMode.System">
    <FlowCard>
        <FlowVC Gap="1rem">
            <FlowLabel>Welcome to FlowUI Blazor</FlowLabel>
            <FlowButton OnClick="SaveAsync">Save</FlowButton>
        </FlowVC>
    </FlowCard>
</FlowThemeProvider>

@code {
    private async Task SaveAsync()
    {
        // Demonstration only: replace with your application service call.
        await Task.Delay(1000);
    }
}
```

### Custom and tenant themes

Supply a theme independently of Light/Dark/System mode:

```csharp
private FlowThemeDefinition tenantTheme = FlowThemeDefinition.Default with
{
    Name = "Company",
    Light = FlowThemeDefinition.Default.Light with
    {
        Primary = "#047857",
        OnPrimary = "#ffffff",
        TextColor = "#172554"
    },
    Dark = FlowThemeDefinition.Default.Dark with
    {
        Primary = "#34d399",
        OnPrimary = "#052e16",
        TextColor = "#f8fafc"
    }
};
```

```razor
<FlowThemeProvider Theme="tenantTheme" Mode="FlowThemeMode.System">
    @ChildContent
</FlowThemeProvider>
```

Replace the definition when switching tenants; keep the user's preferred
mode separately. System mode selects the custom light or dark palette using
the device preference. Do not store mutable active-tenant state globally.

### Blazor controls and documentation

The preview includes 30 controls across Foundation, Forms, Selection,
Overlays, Navigation, and Data Display, including table and tree controls.
The existing JavaScript component list below is not a Blazor parity claim.
**Blazor AsyncLabel is not implemented in this preview.**

- [Complete Blazor component inventory](BLAZOR-CONTROLS.md)
- [Detailed setup, APIs, custom themes, and VS Code debugging](packages/blazor/README.md)
- [Sample application guide](examples/blazor/README.md)
- [Validation results and limitations](BLAZOR-VALIDATION.md)

## Included JavaScript components

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

## Version 0.2.0

- Added the lightweight `@akin2unde/flowui-react-native` package for native,
  Expo and React Native Web applications.
- Added light, dark and system themes with fully typed custom theme tokens.
- Added NativeWind `className` support alongside React Native `style` props.
- Wrapped compiled React Native primitives with NativeWind `cssInterop` so
  internal layout and typography utilities also work on React Native Web.
- Added layout, action, form, selection, overlay and feedback controls,
  including `FormGroup` and `FormField`.
- Added a complete Expo example containing a named usage card for every native
  control and an average Tailwind-styled form.
- Split setup and first-screen documentation into dedicated React, Angular and
  React Native guides.

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

## Async labels and documentation

`AsyncLabel` is available in React, Angular and React Native. One provider collects
unique codes per named lookup, shares in-flight work, and caches completed results
in a bounded in-memory cache. Applications own the backend calls; controls show a
small loader until the name resolves. Dropdowns continue to use their datasource.
See [the full AsyncLabel guide](docs/ASYNC-LABEL.md).

The React and Angular examples now have searchable sidebar navigation, a selected
component preview, framework tabs, usage snippets and generated property tables.
The original full galleries remain linked in the sidebar. Blazor has a separate
runnable showcase at `examples/blazor`.
Run `npm run docs:data` after changing component contracts or gallery snippets.

## Blazor components (.NET 10)

FlowUI now includes a Razor Class Library at `packages/blazor` and an Interactive
Server showcase at `examples/blazor`. It contains 30 controls across Foundation,
Forms, Selection, Overlays, Navigation and Data Display: layout, presentation, buttons, form fields, dropdowns,
multi-select, radio groups, and custom Light/Dark/System themes.

```bash
dotnet build FlowUI.Blazor.slnx
dotnet run --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

Open **http://localhost:5180**, or use the included **FlowUI Blazor Sample** F5
configuration in VS Code. See [the Blazor guide](packages/blazor/README.md) for
setup, file structure, debugging, component examples and local NuGet packaging.
Existing npm builds/releases stay independent; explicit shortcuts are
`npm run build:blazor`, `npm run dev:blazor`, and `npm run pack:blazor`.

Blazor documentation: https://flowui-blazor-docs.tealwolf.chatgpt.site
See `BLAZOR-RELEASE.md` for packaging, publishing and hosting.
