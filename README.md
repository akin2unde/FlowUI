# FlowUI

Current release: **0.1.1**

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

| Area       | Components                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | `HC`/`HStack`, `VC`/`VStack`, `Divider`, `Card`, `Timeline`                                                                                                                     |
| Display    | `Label`, `Badge`, `Icon`, `Image`, `Tooltip`, `Carousel`, `Breadcrumb`                                                                                                          |
| Actions    | `Button`, selectable `ButtonGroup`, `Popover`, `Notification`                                                                                                                   |
| Forms      | `Input`, `PasswordInput`, `DateTime`, `Autocomplete`, `TextArea`, `Checkbox`, `RadioButton`, `RadioGroup`, `ColorPicker`, `Slider`, `Switch`, `Rating`, `Listbox`, `FileUpload` |
| Navigation | `Menu`, `Dropdown`, `TreeDropdown`, `Tree`, `Tabs`, `Tab`, `Section`                                                                                                            |
| Data       | `Table` with sorting, alternating rows, user-selectable columns, row selection, Excel export and PDF export                                                                     |
| Overlay    | `Dialog` at center, left, right, top or bottom                                                                                                                                  |

## Styling precedence

From lowest to highest priority:

1. Component defaults
2. Component variant, size and semantic color
3. FlowUI general properties such as `padding` and `backgroundColor`
4. Application `className`
5. Application inline `style`

Read [Core walkthrough](docs/CORE-WALKTHROUGH.md) for a detailed explanation of the architecture and code.

## Dropdown data model

`Dropdown` and every node in `TreeDropdown` use one shared model:

```ts
interface DropdownModel {
  display: string | number;
  value: string | number;
  other: any;
}
```

`display` is what the user sees, `value` is the stable selection value, and
`other` carries any application-specific record or metadata. `TreeDropdown`
adds an optional `children` array containing objects with the same shape.

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

## Version 0.1.1

- Added DateTime, Autocomplete, Rating, templatable Listbox, Timeline,
  templatable Popover, FileUpload with previews, Carousel, Breadcrumb and
  positioned Notification.
- Added single selection and selected styling to ButtonGroup.
- Added optional alternating table columns and row selection events.
- Updated both example galleries with all new controls.
