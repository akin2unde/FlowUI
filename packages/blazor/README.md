# FlowUI.Blazor — component preview 0.3.0

A .NET 10 Razor Class Library added alongside the existing FlowUI npm packages.
The library has no application render mode, database dependency, or JavaScript
runtime dependency for theming. The included demo uses **Interactive Server**.
This preview contains 30 Blazor controls across Foundation, Forms, Selection, Overlays,
Navigation, and Data Display. AsyncLabel is not implemented in this preview. Existing React, Angular, and React Native sources are retained.
See the root `BLAZOR-CONTROLS.md` for the complete Blazor inventory.

## Run the included sample

Install the **.NET 10 SDK** and Microsoft's **C# Dev Kit** VS Code extension.
Open the repository root in VS Code. No npm install or npm build is needed to
run the Blazor sample.

```bash
dotnet --list-sdks
dotnet restore FlowUI.Blazor.slnx
dotnet build FlowUI.Blazor.slnx
dotnet run --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

Open **http://localhost:5180**. Keep the process running while you test.
For edit/reload development:

```bash
dotnet watch --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

You can also use `npm run build:blazor` / `npm run dev:blazor` as shortcuts;
these invoke dotnet, independently of the JavaScript build pipeline.
If port 5180 is busy, stop the old sample process, or run with `-- --urls
http://localhost:5181` and use that address.

## Debug in VS Code

1. Open the repository root, not just the library folder.
2. Accept the recommended C# Dev Kit extension and let the solution load.
3. In Run and Debug, choose **FlowUI Blazor Sample**, then press **F5**.
4. Set a breakpoint in `examples/blazor/Components/Pages/Home.razor.cs` in
   `Increment()` or `SaveAsync()`.
5. Open the Buttons section and click an enabled button.
6. You can also break in `packages/blazor/Foundation/Button/FlowButton.razor.cs` →
   `HandleClickAsync()` to step from the library into your app callback.

The supplied `launch.json` builds the solution and runs the sample DLL with
Development environment and port 5180. Do not run `dotnet watch` on the same
port at the same time as F5. Terminal execution alone does not attach a debugger.
When Razor IntelliSense is missing, check that the project restores/builds,
that C# Dev Kit loaded the solution, and reload the VS Code window.

## Projects and files

| Location                                      | Responsibility                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `packages/blazor/FlowUI.Blazor.csproj`        | Reusable Razor Class Library, future NuGet package                                  |
| `examples/blazor/FlowUI.Blazor.Sample.csproj` | Runnable ASP.NET Core demonstration host                                            |
| `FlowUI.Blazor.slnx`                          | Solution containing both projects                                                   |
| `.vscode/`                                    | Extension recommendations, build task, F5 launch configuration                      |
| Sample `Program.cs`                           | Registers Razor components, enables server interactivity, maps routes/static assets |
| Sample `Components/App.razor`                 | HTML document, styles, Routes and Blazor startup script                             |
| Sample `Components/Routes.razor`              | Routes URLs to pages and applies MainLayout                                         |
| Sample `Components/Layout/MainLayout.razor`   | Shared host layout and error UI                                                     |
| Sample `Components/Pages/Home.razor`          | Showcase markup with sidebar and demos                                              |
| Sample `Home.razor.cs`                        | Demo UI state and event handlers                                                    |
| Sample `Home.razor.css`                       | Isolated showcase styling                                                           |
| `_Imports.razor`                              | Common Razor `@using` directives for its folder and descendants                     |

`_Imports.razor` is a convenience, not a registration system: you can put
`@using` directly in one Razor file. It does not apply to `.cs` files, which
use normal C# `using` statements. Dependency injection registrations belong
in `Program.cs`; namespace imports do not register services.

## Component groups

| Namespace                    | Components / types                                                             |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `FlowUI.Blazor.Layout`       | `FlowHC`, `FlowVC`, `FlowCard`, `FlowDivider`                                  |
| `FlowUI.Blazor.Presentation` | `FlowLabel`, `FlowImage`, `FlowBadge`, `FlowLoader`                            |
| `FlowUI.Blazor.Buttons`      | `FlowButton`                                                                   |
| `FlowUI.Blazor.Forms` | `FlowInput`, `FlowPasswordInput`, `FlowTextArea`, `FlowNumberInput`, `FlowCheckbox`, `FlowSwitch` |
| `FlowUI.Blazor.Selection` | `FlowDropdown`, `FlowMultiSelect`, `FlowRadioGroup` |
| `FlowUI.Blazor.Theming`      | `FlowThemeProvider`                                                            |
| `FlowUI.Blazor.Styling`      | Theme definitions/tokens, typed enums, common component base and style builder |

Foundation controls live under `Foundation`, with one folder per control:

| Folder | Files |
| --- | --- |
| `Foundation/Button/` | `FlowButton.razor`, `FlowButton.razor.cs`, `FlowButton.razor.css` |
| `Foundation/HC/` | The three `FlowHC` files |
| `Foundation/VC/` | The three `FlowVC` files |
| `Foundation/Card/` | The three `FlowCard` files |
| `Foundation/Divider/` | The three `FlowDivider` files |
| `Foundation/Label/` | The three `FlowLabel` files |
| `Foundation/Image/` | The three `FlowImage` files |
| `Foundation/Badge/` | The three `FlowBadge` files |
| `Foundation/Loader/` | The three `FlowLoader` files |
| `Foundation/ThemeProvider/` | The three `FlowThemeProvider` files |

The six form controls use `Forms/<Control>/`; the three selection controls use
`Selection/<Control>/`. Each also has its own `.razor`, `.razor.cs`, and `.razor.css`.
Browser helpers are served automatically as `_content/FlowUI.Blazor/flowui.js`
and imported by the controls that need them. There is no external JS framework.

Shared enums, theme records, component base, and style builder remain in
`Styling/`. Explicit Razor namespaces preserve the public namespace groups
listed above, independently of the physical folder organization.

Every visual component has `.razor` markup, `.razor.cs` behavior, and
`.razor.css` isolated styling. This makes it easy to inspect and debug each
responsibility. Class names and CSS variables use FlowUI conventions; the
Blazor implementation is independent of the TypeScript runtime.

## Use the library in an app

During development, add a project reference to `packages/blazor/FlowUI.Blazor.csproj`.
After publishing, consumers can install `dotnet add package FlowUI.Blazor`.
This archive does not publish anything to NuGet.

Add these imports to your application's `_Imports.razor`:

```razor
@using FlowUI.Blazor.Layout
@using FlowUI.Blazor.Presentation
@using FlowUI.Blazor.Buttons
@using FlowUI.Blazor.Theming
@using FlowUI.Blazor.Forms
@using FlowUI.Blazor.Selection
@using FlowUI.Blazor.Styling
```

Include your host application's generated isolated stylesheet. For the sample:

```razor
<link rel="stylesheet" href="@Assets["FlowUI.Blazor.Sample.styles.css"]" />
```

For a standalone WebAssembly host, add the app's generated stylesheet to
`wwwroot/index.html` (replace `MyApp` with its assembly name):

```html
<link rel="stylesheet" href="MyApp.styles.css" />
```

The generated app stylesheet imports the referenced Razor library's scoped
CSS automatically. Do not link individual `.razor.css` source files and do
not load the React/Angular stylesheet merely to style these Blazor controls.

```razor
<FlowThemeProvider Mode="FlowThemeMode.System">
    <FlowCard>
        <FlowVC Gap="1rem">
            <FlowLabel>Welcome</FlowLabel>
            <FlowButton OnClick="SaveAsync">Save</FlowButton>
        </FlowVC>
    </FlowCard>
</FlowThemeProvider>
```

A host must enable an interactive render mode for C# event handlers. The
sample sets `InteractiveServer` on `Routes` and `HeadOutlet`; the library
itself does not force this. For WebAssembly, reference the library in the
browser/client project and use that host's WebAssembly setup. This archive
includes only an Interactive Server example; it is not a WebAssembly example.

## Common style and HTML parameters

All foundation components expose `Class`, `Style`, `Id`, `Width`, `Height`,
`MaxWidth`, `Padding`, `Margin`, `BackgroundColor`, `TextColor`, `CornerRadius`,
and unmatched HTML attributes such as `title`, `aria-label`, and `data-*`.
Lengths are CSS strings (`"1rem"`, `"100%"`, `"240px"`). `Style` is appended
last, so it can override computed component styles. Do not supply duplicate
class/style via unmatched attributes; use the explicit `Class` / `Style` parameters.
CSS isolation means styles in the app's `.razor.css` do not automatically
reach inside a child component. Use the component's parameters, an appropriate
`::deep` selector anchored to host markup, or global application CSS.

## Layout

```razor
<FlowHC Gap=".75rem" Wrap="true" Align="FlowAlign.Center"
        Justify="FlowJustify.SpaceBetween">
    <FlowBadge>First</FlowBadge>
    <FlowButton>Second</FlowButton>
</FlowHC>

<FlowCard>
    <Header><h2>Product information</h2></Header>
    <ChildContent>
        <FlowVC Gap="1rem">
            <FlowLabel>Details</FlowLabel>
            <FlowDivider Label="Pricing" />
        </FlowVC>
    </ChildContent>
    <Footer>Last updated today</Footer>
</FlowCard>
```

`FlowHC` is a horizontal container; `FlowVC` is vertical. Both support gap,
wrapping, alignment, and justification. Divider supports Horizontal/Vertical;
a vertical divider needs a parent with meaningful height.

## Presentation and buttons

```razor
<FlowLabel HtmlFor="product-name" Required="true">Product name</FlowLabel>
<input id="product-name" required />
<FlowBadge Color="FlowColor.Success" Variant="FlowVariant.Soft">Active</FlowBadge>
<FlowLoader Size="FlowSize.Sm" ShowLabel="true" Label="Loading products" />
<FlowImage Src="photo.png" Alt="Product photo" FallbackSrc="fallback.png" />
<FlowButton Loading="saving" LoadingText="Saving…" OnClick="SaveAsync"
            Variant="FlowVariant.Solid" Color="FlowColor.Primary">Save</FlowButton>
```

`FlowLabel.Required` adds a visual indicator; it does not validate the input.
FlowImage resets to a new `Src` when parameters change and falls back once on
load failure. Provide meaningful Alt text, or empty Alt for decorative images.
FlowLoader exposes a status role and label and respects reduced-motion settings.
Button `OnClick` is `EventCallback<MouseEventArgs>`; a parameterless Task handler
also works. `Loading` or `Disabled` prevents clicks. Button's default Type is
`button`; set Type to `submit` explicitly when using forms. `Selected` supplies
`aria-pressed`; this is optional and is not imposed on ordinary action buttons.

Colors: Primary, Secondary, Success, Danger, Warning, Info.
Variants: Solid, Outline, Soft, Ghost. Sizes: Xs, Sm, Md, Lg.

## Forms and validation

`FlowInput`, `FlowPasswordInput`, and `FlowTextArea` bind nullable strings with
`@bind-Value`. `FlowNumberInput<TValue>` supports int, long, short, decimal,
double, float, and their nullable forms. Use `decimal` for currency. `Min` and
`Max` reject typed out-of-range values; they do not silently clamp them. Steppers
respect bounds. `DecimalPlaces` formats the display without rounding the model.
`AllowMouseWheel` defaults to false. A blank nullable number becomes null;
clearing a non-nullable number reports a parsing error and retains the model.

Text fields default to `UpdateOn="FlowUpdateOn.Input"`; use `Change` to commit
when the browser raises change, usually on blur. Passwords start hidden and
support `AllowReveal`, `ShowLabel`, `HideLabel`, and `AutoComplete`. Text areas
support `Rows`, `Resize`, `AutoGrow`, `MaxHeight`, and `ShowCharacterCount`.
`AutoGrow` controls the height automatically and disables manual resizing.

Fields work standalone and inside `EditForm`. Use `@bind-Value` inside a form
so the control receives `ValueExpression`. Include `DataAnnotationsValidator`
and model validation attributes. Errors replace helper text and update
`aria-invalid`. `Required` is a visual/accessibility indication; it does not
invent a model validation rule. `[Required]` does not require a bool to be true;
use an explicit rule for acceptance. The sample demonstrates one.

`FlowCheckbox` and `FlowSwitch` bind bools. Checkbox exposes separate
`Indeterminate` state, which the application must clear when appropriate.
Switch uses a native checkbox with `role="switch"`. Disabled/read-only controls
block edits. Helpers and focus/blur callbacks are supported.

## Selection

Selection components receive `Items`, `ValueSelector`, and `TextSelector`.
`DisabledSelector` is optional. Item values must be unique. `ItemTemplate`
customizes option content; retain meaningful `TextSelector` text for search
and accessibility. Item templates should contain presentation, not nested
interactive controls.

`FlowDropdown<TItem,TValue>` binds `Value`, supports local `Searchable`,
`Clearable`, `Loading`, `EmptyText`, and `NoResultsText`. Clearing requires a
nullable/reference TValue. Missing selected values remain in the model and
show an unavailable label. Search is local filtering, not remote data fetching.

`FlowMultiSelect<TItem,TValue>` binds `Values` as `IReadOnlyList<TValue>` through
`@bind-Values`. Updates replace the list rather than mutating it. Selected chips and clear actions appear inside the field outline. `MaxVisibleTags`
limits visible chips; `MaxSelections` limits new choices. Disabled selections
cannot be removed. `ShowSelectAll` with `Searchable` operates on enabled filtered
options and preserves other selected values. Bulk selection is disabled if the
whole result would exceed the maximum. `CloseOnSelect` defaults to false.
Inside `EditForm`, `@bind-Values` supplies `ValuesExpression`; validate empty
collections with an appropriate model rule.

Dropdowns use themed popups, keyboard navigation, focus management, outside
click dismissal, and viewport placement. Arrow keys navigate enabled options;
Home/End navigate on the trigger, Enter selects, Escape closes, and Tab exits.
In a search input Home/End retain native caret movement.

`FlowRadioGroup<TItem,TValue>` uses native radios with unique group names,
`Orientation` (vertical by default), optional `ItemTemplate`, and single-value
binding. Missing values do not select the first item. Read-only groups prevent
changes while retaining keyboard focus. `Name` can override the generated name;
keep names distinct between groups.

The sample's Forms and Selection sections show exact preview markup and full
code-behind, including an EditForm validation example.

## Custom palettes

Mode is **Light / Dark / System**. There is no Custom mode: custom palettes
are supplied by `Theme` independently of the user's appearance preference.
Tokens use **TextColor**, which maps to **`--fui-color-text`**.

```csharp
private FlowThemeMode selectedMode = FlowThemeMode.System;
private FlowThemeDefinition tenantTheme = FlowThemeDefinition.Default with
{
    Name = "Sample Palette",
    Light = FlowThemeDefinition.Default.Light with
    {
        Primary = "#047857", OnPrimary = "#ffffff",
        TextColor = "#172554", Focus = "#047857"
    },
    Dark = FlowThemeDefinition.Default.Dark with
    {
        Primary = "#34d399", OnPrimary = "#052e16",
        TextColor = "#f8fafc", Focus = "#34d399"
    }
};
```

```razor
<FlowThemeProvider Theme="tenantTheme" Mode="selectedMode">
    @ChildContent
</FlowThemeProvider>
```

Replace `tenantTheme` when switching tenant; do not reset `selectedMode`.
Records encourage replacement rather than mutating shared global palettes.
The built-in Default definition is immutable. System mode uses the browser's
`prefers-color-scheme` media query, including when the OS preference changes.
Both palettes are declared on each provider; a nested provider defines its
own palette/mode without modifying its parent or other users.
`FlowThemeContext` is cascaded for consumers that need the definition/requested
mode. It does not claim to know the resolved OS appearance when Mode is System.
The sample stores choices only in component memory: refresh resets them.
Persisting appearance or tenant selection is an application responsibility.

Treat theme CSS values as trusted configuration and validate server-provided
values before passing them to a provider. Custom OnPrimary/OnSuccess/etc.
should have sufficient contrast with their corresponding background colors.

## Package locally (no publication)

```bash
dotnet pack packages/blazor/FlowUI.Blazor.csproj -c Release -o artifacts/blazor
```

Produces a `FlowUI.Blazor.0.3.0.nupkg` with compiled components, static/scoped
styles and this README. The .NET package has its own initial version and does
not change the version of any existing npm package.

## Suggested manual test

- Open each sidebar section at desktop and mobile widths.
- Click variants/colors/sizes and verify the counter increments.
- Save and verify loading appears, repeat clicks are blocked, then status updates.
- Confirm Disabled does nothing and selected toggles aria-pressed.
- Choose Light, Dark, System; change the OS theme while using System.
- Switch all sample palettes and verify mode is retained; edit/reset their primary color.
- Verify the nested Studio dark preview stays dark under a light parent.
- In Presentation, confirm the missing image falls back to the included SVG.
- Use Tab/Enter/Space to navigate and activate controls.
- Press F5 and verify a breakpoint in Home/FlowButton code-behind is hit.

See `BLAZOR-VALIDATION.md` at the repository root for checks actually completed
in the generation environment.

## Inferred selection types

Blazor infers `TItem` and `TValue` from typed `Items`, selector delegates, and
bound values when enough information is available. All Selection and toolbar
examples in this sample omit explicit type arguments and compile successfully.
Use explicit types if an expression is ambiguous, such as an untyped null.

```razor
<FlowDropdown Items="departments"
              ValueSelector="i => i.Id"
              TextSelector="i => i.Name"
              @bind-Value="department" Label="Department"
              Searchable="true" Clearable="true" />
```

The Login section combines FlowInput, FlowPasswordInput, FlowCheckbox, and
FlowButton in a validated EditForm. Its delay and success message are a demo;
it does not authenticate, persist sessions, or save passwords.

## Overlays

`FlowDialog` and `FlowDrawer` bind `Open` and accept `Title`, `Header`,
`ChildContent`, and `Footer`. `Size` uses Xs/Sm/Md/Lg. `CloseOnEscape`,
`CloseOnBackdrop`, and `ShowCloseButton` default to true. `OnClose` reports
button/escape/backdrop dismissals; programmatic closing sets Open to false.
Drawer `Side` defaults to End. These use native modal dialogs: background
interaction is blocked, focus is confined, and focus returns when closed.
Browser helpers manage scroll locking and disposal. Keep a meaningful title,
including when supplying a custom Header.

`FlowPopover` binds Open, with Text or a Trigger fragment rendered inside a
button. ChildContent may contain controls. Avoid a nested button in Trigger.
It dismisses on Escape, outside click, or focus leaving. `FlowTooltip` is a
short noninteractive hint with Text and ChildContent, shown on hover/focus and
hidden with Escape. Put hints close to the element they describe.

`FlowToast` binds Open and accepts Title, Color, ChildContent and Duration
(milliseconds; default 5000, zero stays open). Automatic dismissal pauses
while hovered or focused and restarts afterward. A close button always remains
available. It is one notification component, not a shared toast queue/service.

## Navigation and data display

`FlowTabs` receives FlowTabItem records (Key, Text, Disabled), binds ActiveKey,
and renders Content(key). Enabled tabs use arrow/Home/End keyboard navigation.
`FlowBreadcrumbs` receives FlowBreadcrumbItem records (Text, optional Href),
with the last entry marked as the current page.
`FlowPagination` binds Page, receives PageCount (minimum 1), and defaults to
five visible numbered buttons. The application owns data loading.

`FlowAccordion` receives keyed FlowAccordionItem records, binds OpenKeys as
IReadOnlyList<string>, and renders Content(key). Multiple defaults to false.

`FlowTable<TItem>` receives Items and typed FlowTableColumn<TItem> definitions.
Each column has Title, Value selector, optional Template, and Sortable (true by
default). Values preserve numeric sorting; formatting into strings can change
sort order. Provide a stable unique RowKey for mutable/reordered rows. PageSize
defaults to 10; zero shows all rows. Page can be bound. Caption provides the
accessible table name. Loading and EmptyText display full-width feedback.
Sorting and paging are in-memory; this preview has no server-query contract,
virtualization, selection, or editable cells.

`FlowTree<TNode,TValue>` receives Items, ValueSelector, TextSelector, and
ChildrenSelector. Bind Value for single selection and ExpandedValues for
expansion. Node values must be unique and non-null; cycles and depth over 100
are rejected. ItemTemplate may customize display. Arrow keys move/expand/
collapse, Home/End move focus, and Enter/Space select. It does not implement
lazy loading, drag-and-drop, virtualized nodes, or multi-selection.

## Documentation and release

Reference: https://flowui-blazor-docs.tealwolf.chatgpt.site

Static documentation source is `docs/blazor`; regenerate with
`python3 scripts/build-blazor-docs.py`. See root `BLAZOR-RELEASE.md` for NuGet,
GitHub Actions, documentation hosting and deployment of the interactive gallery.
