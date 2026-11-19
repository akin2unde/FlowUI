# Control customization — 1.0.2

These additions cover React, Angular, React Native and Blazor. Platform APIs keep their usual casing and event names. Nothing here requires a separate data-loading hook or an application-specific wrapper component.

## Direct imports and button text

React exports components by name. A namespace import is optional, never required.

```tsx
import { Button, DateTime, Dropdown, Input } from "@akin2unde/flowui-react";

<Button text="Save changes" onClick={save} />;
```

React Native uses named imports from `@akin2unde/flowui-react-native` and `onPress`. Angular uses `<fui-button text="Save changes" (pressed)="save()" />`. Blazor uses `<FlowButton Text="Save changes" OnClick="SaveAsync" />`.

Children/projected content take precedence over `text`/`Text`. On web adapters, `loadingText`/`LoadingText` takes precedence while loading.

## Colours

| Purpose                         | React / Angular                                                                          | React Native                                                    | Blazor                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| Visible field background        | `backgroundColor`                                                                        | `backgroundColor`                                               | `BackgroundColor`                      |
| Visible field text              | `textColor`                                                                              | `textColor`                                                     | `TextColor`                            |
| Built-in date/select icons      | `iconColor`                                                                              | `iconColor`                                                     | `IconColor`                            |
| Placeholder                     | `placeholderColor`                                                                       | Input: `placeholderTextColor`; Select: `textStyle`              | `PlaceholderColor`                     |
| Picker surface                  | `panelBackgroundColor`                                                                   | DateTime: `panelBackgroundColor`; Select: `menuStyle`           | `PanelBackgroundColor`                 |
| Picker text                     | `panelTextColor`                                                                         | DateTime: `panelTextColor`; Select: `optionTextStyle`           | `PanelTextColor`                       |
| Option hover / selected colours | `optionHoverBackgroundColor`, `selectedOptionBackgroundColor`, `selectedOptionTextColor` | `optionStyle`, `selectedOptionStyle`, `selectedOptionTextStyle` | CSS classes / isolated theme variables |

React and Angular accept theme colour tokens or literal CSS colours, including responsive colour values. Native controls accept native colour strings. Existing `className`, `style` and the native adapter's detailed style props remain available. Custom rendered content/icons can need their own colours; FlowUI does not rewrite arbitrary user markup.

### React

```tsx
import { useState } from "react";
import { DateTime, Dropdown } from "@akin2unde/flowui-react";

export function Controls() {
  const [date, setDate] = useState("2026-10-10T09:30");
  const [department, setDepartment] = useState<string | number>();
  return (
    <>
      <DateTime
        value={date}
        onChange={setDate}
        min="2026-01-01T00:00"
        max="2026-12-31T23:59"
        backgroundColor="#faf5ff"
        textColor="#3b1760"
        iconColor="#8a16d1"
      />
      <Dropdown
        options={[{ value: "SUP", display: "Support" }]}
        value={department}
        onChange={(option) => setDepartment(option.value)}
        placeholder="Choose a department"
        backgroundColor="#faf5ff"
        textColor="#3b1760"
        iconColor="#8a16d1"
      />
    </>
  );
}
```

### Angular

Import `FlowDateTimeComponent`, `FlowDropdownComponent`, `FlowInputComponent`, and `FlowButtonComponent` directly from `@akin2unde/flowui-angular` into the consuming standalone component's `imports`.

```html
<fui-date-time
  [value]="date"
  (valueChange)="date = $event"
  min="2026-01-01T00:00"
  max="2026-12-31T23:59"
  backgroundColor="#faf5ff"
  textColor="#3b1760"
  iconColor="#8a16d1"
/>
<fui-dropdown
  [options]="departments"
  [value]="department"
  (valueChange)="department = $event"
  placeholder="Choose a department"
  backgroundColor="#faf5ff"
  textColor="#3b1760"
  iconColor="#8a16d1"
/>
```

### React Native

```tsx
import { DateTime, Select, Button } from "@akin2unde/flowui-react-native";

<DateTime value={date} onChange={setDate} mode="datetime"
  min="2026-01-01T00:00" max="2026-12-31T23:59"
  backgroundColor="#faf5ff" textColor="#3b1760" iconColor="#8a16d1" />
<Select items={departments} value={department}
  onValueChange={setDepartment} placeholder="Choose a department"
  backgroundColor="#faf5ff" textColor="#3b1760" iconColor="#8a16d1" />
<Button text="Save changes" onPress={save} />
```

`departments` contains `{ value, display }` items. `date`, `department` and their setters are the consuming component's state.

### Blazor

```razor
<FlowDateTime @bind-Value="date" Min="2026-01-01T00:00" Max="2026-12-31T23:59"
    BackgroundColor="#faf5ff" TextColor="#3b1760" IconColor="#8a16d1" />
<FlowDropdown Items="departments" ValueSelector="item => item.Code"
    TextSelector="item => item.Name" @bind-Value="department"
    BackgroundColor="#faf5ff" TextColor="#3b1760" IconColor="#8a16d1" />
<FlowButton Text="Save changes" OnClick="SaveAsync" />
```

## Minimum, maximum and text length

| Constraint                | Purpose                                                                         |
| ------------------------- | ------------------------------------------------------------------------------- |
| `min` / `max`             | Numeric range on number inputs; date/time range on date controls                |
| `step`                    | Numeric increment; React/Angular native numeric fields also check step validity |
| `minLength` / `maxLength` | Text length, including password and multiline fields                            |
| `pattern`                 | Browser text validation pattern (web adapters)                                  |

Blazor uses PascalCase parameter names. Use ISO local values for date constraints: `yyyy-MM-dd`, `HH:mm`, or `yyyy-MM-ddTHH:mm` matching the picker mode.

React:

```tsx
<Input type="number" min={1} max={100} step={1} />
<Input inputMode="money" min={0} max={1000000} step={0.01} />
<Input minLength={3} maxLength={80} pattern="[A-Za-z ]+" />
```

Angular:

```html
<fui-input type="number" [min]="1" [max]="100" [step]="1" />
<fui-input [minLength]="3" [maxLength]="80" pattern="[A-Za-z ]+" />
```

React Native:

```tsx
import { NumberInput, Input } from "@akin2unde/flowui-react-native";

<NumberInput min={1} max={100} step={1}
  onValidationChange={(valid, message) => setError(valid ? undefined : message)} />
<Input minLength={3} maxLength={80} />
```

Native `maxLength` limits entry. `minLength` and numeric limits are checked on blur; use `onValidationChange` to display an error or disable saving. Native fields do not have HTML `pattern`, form submission or browser validity APIs.

Blazor:

```razor
<FlowNumberInput TValue="int" @bind-Value="quantity" Min="1" Max="100" Step="1" />
<FlowInput Type="number" Min="1" Max="100" Step="1" />
<FlowInput MinLength="3" MaxLength="80" Pattern="[A-Za-z ]+" />
```

`FlowNumberInput` validates typed values through its existing field/EditForm integration. `FlowInput Type="number"` forwards HTML range constraints. Browser constraints are not model-level server validation. The controls do not silently clamp values; validate again in the backend. Blazor number steppers retain their existing bounded-step behaviour.

## Native attributes, events and focus

- React Input, PasswordInput, TextArea, Checkbox, RadioButton, Button, HStack, VStack and Label have typed native props/events and forwarded refs. Unknown layout/theme props stay off the DOM. Use `triggerRef` and `searchInputRef` on Dropdown. `name`, `form` and `required` participate in browser forms through an internal select.
- Angular has explicit field constraint inputs plus `[nativeAttributes]="{ 'aria-describedby': 'quantity-help', 'data-owner': 'finance' }"`. Attributes reach the primary native control. Function-valued DOM event attributes are excluded; bind Angular events normally. Component references expose `nativeElement` and `focus()`.
- Native Button, Input, PasswordInput and TextArea forward native refs; Select exposes `triggerRef`. Existing native event props remain available. React Native uses `accessibilityLabel` rather than HTML `aria-label`.
- Blazor forwards unmatched attributes using `AdditionalAttributes`, and fields expose `Element` and `FocusAsync()`.

React and Angular Dropdown support keyboard arrows, disabled-option skipping, Enter selection and Escape dismissal. React Dropdown supports `onOpenChange`; Angular exposes `open` and its existing output events. Browser Dialogs trap focus and restore it on dismissal. React adds `initialFocusRef`, `returnFocusRef`, `contentRef`, `trapFocus` and `restoreFocus`; Angular adds `initialFocus`, `trapFocus`, `restoreFocus` and accessible name/description inputs. Blazor adds `InitialFocusId` and `ReturnFocusId` alongside its native modal behaviour. Native Dialog accepts focus refs and uses native Modal semantics; it does not implement a browser DOM focus trap.

## Tables and popovers

| Feature           | React                      | Angular          | React Native          | Blazor                  |
| ----------------- | -------------------------- | ---------------- | --------------------- | ----------------------- |
| Cell UI           | column `renderCell`        | `cellTemplate`   | column `renderCell`   | column `Template`       |
| Header UI         | column `renderHeader`      | `headerTemplate` | column `renderHeader` | column `HeaderTemplate` |
| Stable identity   | `rowKey`                   | `rowKey`         | `rowKey`              | `RowKey`                |
| Selected identity | `selectedRowKey`           | `selectedRowKey` | `selectedRowKey`      | `SelectedRowKey`        |
| Row styling       | `rowClassName`, `rowProps` | `rowClassName`   | `rowStyle`            | `RowClass`              |

React/Native renderer signature: `renderCell(value, row, index)` and `renderHeader(column)`. Angular templates receive `$implicit` (the value), `row`, `column`, and `index`; headers receive the column as `$implicit`. Blazor keeps its typed templates. CSV exports continue using raw values or the adapter’s export formatter (`format` in JavaScript, `ExportValue` in Blazor), not rendered UI. Table renderers do not fetch data or add server paging automatically.

React Popover composes the existing trigger click handler, honours `preventDefault`, dismisses outside/on Escape, and returns focus on Escape. Angular projected triggers retain their original events and Escape restores focus. Existing native and Blazor popovers retain their platform-specific interaction APIs.
