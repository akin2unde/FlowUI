# FlowUI 1.0.4

- Fixed width handling for web DateTime, money inputs and Workflow Stepper.
- Added direct background color support for Divider across React, Angular, React Native and Blazor.
- Added a width prop for React Native DateTime, MoneyInput and Workflow Stepper, and aligned Blazor DateTime, NumberInput and Workflow Stepper sizing with their visible containers.

# FlowUI 1.0.3

- Added the horizontal and vertical Workflow Stepper with an action picker, stage events and scroll overflow.
- Added optional tri-state tree checkboxes, node icons and table divider controls.
- Expanded chart types and refined chip spacing, phone entry and date/time and rating previews.

# FlowUI 1.0.2 — control customization

- Added button `text` / `Text` fallback while preserving children and projected content.
- Added visible field background, text, icon, placeholder and picker colour customization; retained React Native’s detailed style props.
- Added input minimum, maximum, step and text-length constraints to the adapters. React Native reports range/minimum-length validation on blur through `onValidationChange`.
- Improved native attributes/events and focus refs, dropdown form/keyboard behaviour, dialog focus handling, popover trigger composition, and table cell/header templates and stable row identities.
- Updated all four frameworks’ documentation/examples. React examples use direct named imports and self-contained state where needed.
- Aligned JavaScript packages and their FlowUI dependencies at 1.0.2. No packages have been published by this update.
- See [Control customization](docs/CONTROL-CUSTOMIZATION.md) for exact APIs and platform differences.

## Earlier notes

# FlowUI 1.0.0

- Updated the Angular adapter and example to Angular 22.2.5 and the Angular CLI and packaging tools to 22.2.6. The Angular adapter now declares Angular 22 as its peer requirement.
- Updated the browser React adapter and example to React and React DOM 19.3.1.
- Updated the npm workspace toolchain to TypeScript 6.0 and Vitest 4. The Expo sample uses its SDK-pinned React version.

- React `Input` and `PasswordInput` forward `autoComplete` to the native input.
- React `PasswordInput` puts `id` on the native input so `Label htmlFor` can target it.
  If your CSS selected the old wrapper ID, use `className` to style the wrapper.
- Angular `fui-input` and `fui-password-input` forward `autoComplete` and use the
  native field as the label target without duplicating its ID on the component host.
- React Native already forwards `autoComplete`, `textContentType`, and `nativeID`
  through both input controls.
- Aligned the npm workspace packages and the Blazor package at `1.0.0`.

## Previous release

### FlowUI 0.3.0 — development build

- Added framework-neutral code-to-label batching, in-flight deduplication, a bounded
  provider-owned cache, timeouts, invalidation and saved-result priming.
- Added AsyncLabel providers/components for React, Angular and React Native, with
  small inline loading indicators, missing-value fallback and scope isolation.
- Added searchable sidebar documentation in both browser examples, one selected
  component page, framework usage tabs and source-generated property references.
- Separated selected and hovered dropdown states and added spacing between rows.
  Verified single selection closes the menu in both browser adapters.
- Added a native AsyncLabel gallery example, validated HTTP batch and individual
  resolver examples, and a FlowORM repository integration reference.
- Retained the prior clean-build and npm tarball safeguards. Versions are aligned
  at 0.3.0; nothing has been published to npm. Blazor remains planned.

See [AsyncLabel usage](docs/ASYNC-LABEL.md) and the
[screenshot guide](docs/USAGE-IMAGE-GUIDE.md).

## Validation

Package and browser example builds, native example type checking and Expo web export, package entry
point checks, TypeScript checks, 34 unit/packaging tests and formatting pass.
Browser checks cover all 44 selected component pages in both React and Angular,
loading/resolution, batching call counts, refresh, priming, dropdown closing,
separate hover colours, framework tab usage and a 390px mobile layout.
Native component rendering is covered using mocked primitives in unit tests and
the actual Expo web build (four inline loaders, shared names, missing fallback and
refresh all pass). Physical Android/iOS devices have not been tested.

## Local setup

```bash
npm ci
npm run setup:react-native-example
npm run build
npm test
npm run dev:react
# Or: npm run dev:angular
# Or: npm run dev:react-native
```
