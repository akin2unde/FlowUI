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
