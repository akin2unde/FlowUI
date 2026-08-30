# FlowUI Core Walkthrough

## Why the core exists

React and Angular render components differently, but spacing, theme colors, responsive values and component contracts should not be implemented twice. `@akin2unde/flowui-core` is the shared source of truth.

It contains no framework content type. React adds `ReactNode`; Angular uses content projection and `TemplateRef`.

## `types.ts`

`ResponsiveValue<T>` accepts either one value or an object:

```ts
export interface ResponsiveObject<T> {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export type ResponsiveValue<T> = T | ResponsiveObject<T>;
```

`default` applies at every width until a breakpoint overrides it. This is mobile-first behavior with a name that describes its purpose.

Property contracts are capability-based. `BaseUIProps` contains visual and layout capabilities, while `DisableableProps`, `ReadOnlyProps`, and `RequiredProps` are added only to controls where they make sense.

`FlowUIStyle` comes from `csstype`, not React, so Angular users do not acquire a React dependency merely to obtain typed CSS properties.

## `theme.ts`

The theme separates palettes from schemes:

- A palette is a range such as `primary.50` through `primary.950`.
- A scheme assigns meaning such as `surface`, `text`, `border` and `overlay`.

This separation allows light and dark modes to change surfaces and text without changing component code.

`createTheme` performs a deep merge. An application can override one shade while retaining every default value:

```ts
createTheme({
  palette: {
    primary: {
      600: "#6d28d9",
    },
  },
});
```

`themeToCSS` turns the complete theme into CSS variables. Both adapters place the result into one runtime style element and set `data-fui-theme` on the root document.

## `style.ts`

Simple general properties become inline styles:

```ts
width={300}
```

becomes `width: 300px`.

Responsive properties become stable class names plus CSS variables:

```ts
width={{ default: "full", md: 600 }}
```

becomes conceptually:

```html
class="fui-r-width-default fui-r-width-md"
style="--fui-width-default:100%;--fui-width-md:600px"
```

The responsive stylesheet contains the media queries. This avoids runtime Tailwind class construction, which Tailwind cannot reliably discover during compilation.

## `contracts.ts`

Contracts define component data without defining component content. For example, `ButtonProps` knows about its icon position, badge, size and semantic color, but React and Angular decide how children are passed.

The adapters expose the same names and values wherever their framework conventions permit it:

- React uses callbacks such as `onChange`.
- Angular uses outputs such as `valueChange`.
- React dialog sections accept `ReactNode`.
- Angular dialog sections accept `TemplateRef`.

## Internal Tailwind package

`@flowui/internal-styles` is private. Tailwind compiles its source into `styles.css`, and that built file is copied into both public adapters.

Consequences:

- A host application can use FlowUI without installing Tailwind.
- A host application can separately use Tailwind.
- React and Angular receive the same component styles.
- FlowUI source files do not need to be added to the host application's Tailwind content scan.

## Font Awesome

`Icon` accepts normal Font Awesome class names:

```tsx
<Icon icon="fa-solid fa-floppy-disk" />
```

```html
<fui-icon icon="fa-solid fa-floppy-disk" />
```

Font Awesome is a peer dependency because applications may already use it and should control its version. Both sample applications demonstrate the required stylesheet import.
