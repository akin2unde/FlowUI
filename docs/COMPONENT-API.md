# Component API Summary

This reference covers the browser packages. Start with the framework-specific
setup guide for [React](./REACT.md), [Angular](./ANGULAR.md), or
[React Native, Expo and web](./REACT-NATIVE.md).

Every visible component supports the applicable shared FlowUI properties: dimensions, margin, padding, flex behavior, position, border, radius, background, opacity and shadow. Text-bearing components additionally support text color, font family, size, weight, alignment, transformation and line clamping.

## Notable behavior

- `Button`: five variants, seven semantic colors, five sizes, loading state, left/right/center icon and badge.
- `ButtonGroup`: horizontal or vertical segmented selection with a raised selected state.
- `Menu`: icons, badges, disabled items and separators.
- `Dropdown`: styled single selection with optional search, grouping, templates and load-more.
- `MultiSelect`: checkbox selection with removable chips and option/chip templates.
- `TreeDropdown`: searchable single selection from nested models without chips.
- `TreeMultiSelect`: nested checkbox selection with search, cascading, indeterminate parents, templates and lazy children.
- `Tabs` and `Tab`: controlled or internal selection with arbitrary content.
- `Input`: text by default, with integer, decimal, money and alphabet-only filtering modes.
- `TextArea`: native multiline attributes and change events.
- `PasswordInput`: password entry with an optional show/hide button and controlled or internal visibility.
- `Checkbox`, `RadioButton`, `RadioGroup`: accessible native controls.
- `ColorPicker`: native color input using FlowUI dimensions and border.
- `Slider`: native range behavior with minimum, maximum, step and optional value display.
- `Switch`: accessible checkbox semantics exposed visually as an on/off switch.
- `Section`: controlled or uncontrolled accordion.
- `Table`: caller-owned sort state cycling `null → asc → desc → null`; this supports either client-side sorting or a Web API request.
- `Dialog`: center, left, right, top and bottom positions; optional header/footer; scrollable body; open and close events.
- `Divider`: horizontal with optional label or vertical.
- `HC`/`VC`: responsive horizontal and vertical flex layouts.
- `Badge`: semantic variant with optional left or right icon.
- `Icon`: Font Awesome class wrapper with accessible label and spin support.
- `Image`: object-fit, lazy loading and fallback source.
- `Card`: outline, elevated and filled variants with optional header and footer content.
- `Tree`: expandable hierarchical navigation with selection events.
- `Tooltip`: text positioned at the top, right, bottom or left, with a configurable delay.
- `DateTime`: local date, time or combined input; combined mode can select the start or end of day without UTC conversion.
- `Autocomplete`: filters `{ display, value, other }` options and emits the complete selected object.
- `Rating`: configurable maximum, whole or half-step precision, disabled and read-only modes.
- `Listbox`: single or multiple selection with a render function in React and `TemplateRef` in Angular.
- `Timeline`: horizontal or vertical events with icons/images and templatable item content.
- `Popover`: controlled or internal open state, four placements and templatable content.
- `FileUpload`: accept, multiple, maximum-size and image/file preview support.
- `Carousel`: controlled or internal slide index, looping, controls and indicators.
- `Breadcrumb`: image, icon and text items with an optional custom item template.
- `Notification`: top/bottom and left/center/right placement with success, error, warning and info types.
- `Knob`: circular range input with min, max, step, colour and value suffix.
- `OTPInput`: separate cells with auto-advance, backspace navigation, paste, masking and completion events.
- `PhoneInput`: searchable country/dial-code selector plus a bound subscriber number.
- `Chart`: data-driven bar, line, pie and doughnut SVG charts with legends and optional values.

`DateTime` uses a FlowUI calendar instead of the browser calendar. Its Today,
Start-of-day and End-of-day actions are circular icon buttons inside the field.
The chosen calendar day uses a round highlight. Date values continue to use
local calendar parts, avoiding UTC conversion and the one-hour-behind problem.
The calendar and every dropdown-style floating panel close on outside click;
keyboard-capable panels also close when Escape is pressed.

## Selection enhancements

`ButtonGroup` accepts `selectable`, `value`, and a change callback/event. Each
child button supplies a `value`; the matching button exposes `aria-pressed` and
uses the selected visual state.

`Table` uses alternating rows by default. Set `alternateRows={false}` in React
or `[alternateRows]="false"` in Angular to disable it. It also accepts
`selectionEnabled` and `selectedRow`. React emits `onSelectionChange`; Angular
emits `selectionChange`. Selectable rows also respond to Enter and Space.

Set `columnsConfigurable` to display the column picker. The controlled
`visibleColumnFields` array contains the selected field names and can be saved
as a per-user preference. React emits `onVisibleColumnsChange`; Angular supports
`[(visibleColumnFields)]`. A column with `defaultVisible: false` starts hidden
when no saved preference has been supplied.

Set `exportable` to display Excel and PDF buttons. `exportFileName` controls the
download filename. Both exports contain the current data and only the currently
visible columns.

## Angular prefix

Every Angular selector starts with `fui-`. For example:

```html
<fui-vc gap="4">
  <fui-password-input [(value)]="password" placeholder="Password" />

  <fui-tooltip text="Saved securely" location="right">
    <fui-button>Save</fui-button>
  </fui-tooltip>
</fui-vc>
```

## Dropdown model

```ts
export interface DropdownModel {
  display: string | number;
  value: string | number;
  other: any;
  disabled?: boolean;
  group?: string | number;
}

export interface TreeModel extends DropdownModel {
  children?: TreeModel[];
  selectable?: boolean;
  hasChildren?: boolean;
}
```

React receives the selected model through `onChange`. Angular emits it through
`selected`. Keeping `other` unrestricted lets an application attach the full
domain object without changing the control's display and identity contract.

`MultiSelect` and `TreeMultiSelect` bind to `Array<string | number>`. Their
change APIs also return the corresponding full models. Removing a chip removes
its exact value and emits the updated selection. Chip text, background, and
close-icon colours accept FlowUI theme colours or CSS colours.

`searchable` enables local display-text filtering and emits search changes for
server filtering. `hasMore` displays a load-more action; loading and pagination
remain controlled by the application. `grouped` reads the optional `group`
field on flat dropdown options.

With `cascadeSelection`, selecting a tree parent selects its enabled,
selectable leaf descendants. Parent checked and indeterminate states are
derived from the bound values. `hasChildren` and `loadChildren` support lazy
branches without changing the node model.

## AsyncLabel

See [AsyncLabel usage and backend integration](./ASYNC-LABEL.md) for shared batching, inline loading indicators, provider setup and cache controls.

## Workflow Stepper

Pass an ordered list of stages using `FlowStage`. `Id` identifies the stage, `Label` supplies its initial text, and `IsCompleted` or `IsCurrent` determines the marker. `IsDisabled` disables the whole stage. Supply `Actions` as `FlowAction` objects with a `Label`, optional `Icon`, and optional `IsReadonly`. Read-only actions remain visible in the picker.

```tsx
import { WorkflowStepper, type FlowStage } from "@akin2unde/flowui-react";

const stages: FlowStage[] = [
  { Id: "oil", Label: "Oil checked", IsCompleted: true },
  { Id: "repair", Label: "Repair", IsCurrent: true, Actions: [
    { Label: "Start repair" }, { Label: "Send for inspection" },
    { Label: "Request cancellation", IsReadonly: true },
  ] },
];

<WorkflowStepper
  stages={stages}
  direction="horizontal"
  onStageClick={(stage) => openStageForm(stage.Id)}
  onActionChange={(stage, action) => recordSelection(stage.Id, action)}
  stageTextStyle={{ fontSize: 14, fontWeight: "600" }}
  actionMenuStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
  actionItemStyle={{ selected: { backgroundColor: "#fff0ca" } }}
/>
```

- Horizontal stages scroll within the stepper when they exceed its width. Use `direction="vertical"` to stack them.
- The current-stage chevron opens the built-in menu when multiple choices exist. Selecting an item changes the label and marks that item when the menu reopens. Provide `SelectedAction` on the stage to control the selected value from the app.
- Clicking the stage itself emits a separate event. The app can open a form or dialog and controls when the workflow advances.
- Use `completedStyle`, `currentStyle`, `disabledStyle`, `stageTextStyle`, `lineColor`, and `labelPosition` to style stages. Use `actionMenuStyle`, `actionItemStyle`, `checkmarkStyle`, and `chevronStyle` to style the picker. Each stage supports `TextStyle`. Each action supports `TextStyle` and `IconStyle`.
- Angular uses `FlowWorkflowStepperComponent`, `(stageClick)` and `(actionChange)`. React Native uses `WorkflowStepper` and accepts `renderIcon` for the app’s icon set. Blazor uses `FlowWorkflowStepper`, `Stages`, `OnStageClick`, and `OnActionChange`.

## Tree, table and chart options in 1.0.3

- Enable `showCheckboxes` on Tree to show checked, unchecked and mixed states. Checking a parent selects its eligible leaf nodes. Use `checkedValues` to control checked values. Node `icon` is optional. Blazor uses `ShowCheckboxes`, `CheckedValues` and `IconSelector`.
- Use `showRowDividers={false}` on Table to hide row dividers. In Blazor, use `ShowRowDividers="false"`.
- Chart types include `column`, `horizontal-bar`, `line`, `pie`, `doughnut`, `area` and `combo`. Existing `bar` charts retain their vertical orientation. In combo charts, specify a series type of `column` or `line` to control its rendering.
- For React Native Chart, install a compatible `react-native-svg` version. With Expo, run `npx expo install react-native-svg`.
