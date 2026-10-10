# FlowUI 0.3.0 — development build

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
