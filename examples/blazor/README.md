# FlowUI Blazor sample

Interactive Server showcase using the local FlowUI.Blazor library.

From the repository root:

```bash
dotnet run --project examples/blazor/FlowUI.Blazor.Sample.csproj
```

Open http://localhost:5180. To debug, select **FlowUI Blazor Sample** in VS Code
Run and Debug and press F5. Put a breakpoint in `Components/Pages/Home.razor.cs`
inside `Increment()` and click a button on the Buttons page.

The sidebar demonstrates Layout, Presentation, Buttons, Forms, Selection,
Login, Theming, and Setup. Sample palettes and Light/Dark/System can be changed independently. Nested
provider and runtime color editing examples are included. No backend API is
required; Save simulates an operation and does not persist data.

For full project structure, component API, theme customization, WebAssembly
consumption, and NuGet packaging instructions, see
[the library guide](../../packages/blazor/README.md).

Forms and Selection previews include complete Razor markup and expandable
code-behind. The Forms section includes live DataAnnotations validation.

The Login section shows a validated sample with email/password fields, Remember
me, and a loading submit button. It does not call a backend authentication API.
