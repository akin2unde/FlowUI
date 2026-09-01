# Component API Summary

Every visible component supports the applicable shared FlowUI properties: dimensions, margin, padding, flex behavior, position, border, radius, background, opacity and shadow. Text-bearing components additionally support text color, font family, size, weight, alignment, transformation and line clamping.

## Notable behavior

- `Button`: five variants, seven semantic colors, five sizes, loading state, left/right/center icon and badge.
- `ButtonGroup`: horizontal or vertical, attached or separated.
- `Menu`: icons, badges, disabled items and separators.
- `Dropdown`: flat options using `{ display, value, other }`; emits the complete selected object.
- `TreeDropdown`: nested `{ display, value, other, children? }` objects rendered at their depth.
- `Tabs` and `Tab`: controlled or internal selection with arbitrary content.
- `Input` and `TextArea`: native attributes and change events.
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

`DateTime` uses a FlowUI calendar instead of the browser calendar. Its Today,
Start-of-day and End-of-day actions are circular icon buttons inside the field.
The chosen calendar day uses a round highlight. Date values continue to use
local calendar parts, avoiding UTC conversion and the one-hour-behind problem.

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
}

export interface TreeModel extends DropdownModel {
  children?: TreeModel[];
}
```

React receives the selected model through `onChange`. Angular emits it through
`selected`. Keeping `other` unrestricted lets an application attach the full
domain object without changing the control's display and identity contract.
