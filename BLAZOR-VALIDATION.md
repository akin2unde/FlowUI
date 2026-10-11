# Blazor validation

Validated with .NET SDK 10.0.100 / runtime 10.0.0.

- Solution Debug build passed: zero warnings, zero errors.
- Release NuGet packaging passed for FlowUI.Blazor 0.3.0, including static JS
  and scoped styles. No package was published.
- Sample started successfully under ASP.NET Core Development hosting.
- Chromium checks passed for all twelve sidebar sections, live button callbacks,
  disabled/loading and selected states, palette switching retaining mode,
  runtime accent edit/reset, nested theme isolation, System appearance changing
  with emulated OS preference, image fallback, and mobile horizontal overflow.
- Form checks passed for live/change string binding, password reveal/hide,
  textarea autogrow/shrink and count, nullable decimal clear/step/bounds,
  non-nullable integer clear errors, mixed checkbox, switch and read-only state,
  and successful/failed EditForm DataAnnotations validation.
- Selection checks passed for search, arrow/Enter selection, outside dismissal,
  loading/missing values, clear, multi-select chips/removal/filtered bulk action,
  maximum selection limits, and separate/read-only native radio groups.
- Exact FlowHC third-item and FlowVC second-row snippets were verified, along
  with actual displayed form usage markup.
- No browser page errors or unhandled server exceptions occurred.
- Desktop Forms/Selection and 390px mobile screenshots were inspected; popup
  bounds and mobile overflow were checked.
- Existing npm package entry-point/tarball checks passed for core, React,
  Angular, and React Native. Their source implementation was not changed.

The build used `-m:1 -p:UseSharedCompilation=false` because this environment
restricts MSBuild/compiler-server IPC. These flags are not required on a
normal development machine.

The VS Code configuration was supplied and its paths checked, but an actual
VS Code F5 session/IntelliSense was not exercised. WebAssembly consumption
was not run; the supplied example uses Interactive Server. Existing JavaScript
application test suites were not rerun because their implementation was unchanged.

All 30 Blazor controls have their own folder with exactly `.razor`, `.razor.cs`,
and `.razor.css`, under Foundation, Forms, Selection, Overlays, Navigation, or DataDisplay. Their namespaces remain
explicitly declared. Shared utilities live under Styling.

## Selection refinement and login

- All selection and toolbar examples compile without explicit TItem/TValue.
- Dropdown clear actions and multi-select chips fit inside the field outlines.
- Chip removal does not open the menu. Search and popup keyboard checks pass.
- Login required/email/password validation, Remember me, loading/disabled submit,
  success feedback and password clearing pass in the browser.
- The `/preview` route provides an interactive selection/login UI sample.

## Overlays, navigation, table and tree

- Eleven added controls built with zero warnings/errors.
- Browser checks passed for dialog submit/Escape/backdrop, focus confinement and
  focus return, drawer, outside-dismiss popover, keyboard tooltip, manual/automatic
  toast dismissal, tabs with disabled/keyboard choices, breadcrumbs and pagination.
- Table numeric sorting in both directions, paging, tree expansion/selection,
  keyboard focus movement and collapse, and mobile overflow checks passed.
- Release NuGet pack and gallery publish succeeded with .NET 10.
- Documentation JSON validates 30 unique control records with usage and parameter
  references. Static JavaScript syntax checks pass. Documentation browser QA was
  unavailable under the Sites managed preview policy; no browser test was claimed.
- Dockerfile and GitHub Actions workflows are supplied but were not executed.
- NuGet publication is pending because no account API key is available.
