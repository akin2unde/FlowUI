using Microsoft.AspNetCore.Components;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Sample.Components.Pages;

public partial class Home
{
    private static readonly string[] Sections = ["Overview", "Layout", "Presentation", "Buttons", "Forms", "Selection", "Login", "Overlays", "Navigation", "Data Display", "Theming", "Setup"];
    private sealed record PaletteOption(string Id, string Name);
    private static readonly PaletteOption[] PaletteOptions = [new("default", "FlowUI default"), new("pantry", "Pantry · emerald"), new("studio", "Studio · violet")];
    private string selectedSection = "Overview";
    private FlowThemeMode mode = FlowThemeMode.System;
    private string tenant = "default";
    private int clicks;
    private bool saving;
    private bool selected;
    private string status = "Ready";
    private string productName = "";

    private static readonly FlowThemeDefinition PantryTheme = FlowThemeDefinition.Default with
    {
        Name = "Pantry", Light = FlowThemeDefinition.Default.Light with { Primary = "#047857", OnPrimary = "#ffffff", Focus = "#047857" },
        Dark = FlowThemeDefinition.Default.Dark with { Primary = "#34d399", OnPrimary = "#052e16", Focus = "#34d399" }
    };
    private static readonly FlowThemeDefinition StudioTheme = FlowThemeDefinition.Default with
    {
        Name = "Studio", Light = FlowThemeDefinition.Default.Light with { Primary = "#7c3aed", OnPrimary = "#ffffff", Focus = "#7c3aed" },
        Dark = FlowThemeDefinition.Default.Dark with { Primary = "#c4b5fd", OnPrimary = "#2e1065", Focus = "#c4b5fd" }
    };
    // These are component-local state: no singleton shares themes between users.
    private readonly Dictionary<string, FlowThemeDefinition> themes = new()
    {
        ["default"] = FlowThemeDefinition.Default, ["pantry"] = PantryTheme, ["studio"] = StudioTheme
    };
    private FlowThemeDefinition ActiveTheme => themes[tenant];
    private string CurrentPrimary => mode == FlowThemeMode.Dark ? ActiveTheme.Dark.Primary : ActiveTheme.Light.Primary;
    private void SelectSection(string section) => selectedSection = section;
    private void OpenButtons() => SelectSection("Buttons");
    private void Increment() { clicks++; } // Set a VS Code breakpoint here.
    private void ToggleSelected() => selected = !selected;
    private async Task SaveAsync()
    {
        if (saving) return;
        saving = true; status = "Saving sample";
        try { await Task.Delay(1200); status = "Sample saved (demo only)"; }
        finally { saving = false; }
    }
    private void ChangeAccent(ChangeEventArgs args)
    {
        var color = args.Value?.ToString();
        if (color is null || !System.Text.RegularExpressions.Regex.IsMatch(color, "^#[0-9a-fA-F]{6}$")) return;
        // Change both palettes while retaining mode and other tenants' definitions.
        themes[tenant] = ActiveTheme with
        {
            Light = ActiveTheme.Light with { Primary = color, OnPrimary = ContrastColor(color), Focus = color },
            Dark = ActiveTheme.Dark with { Primary = color, OnPrimary = ContrastColor(color), Focus = color }
        };
    }
    private static string ContrastColor(string hex)
    {
        static double Linear(int channel) { var value = channel / 255d; return value <= .04045 ? value / 12.92 : Math.Pow((value + .055) / 1.055, 2.4); }
        var red = Convert.ToInt32(hex.Substring(1, 2), 16);
        var green = Convert.ToInt32(hex.Substring(3, 2), 16);
        var blue = Convert.ToInt32(hex.Substring(5, 2), 16);
        var luminance = .2126 * Linear(red) + .7152 * Linear(green) + .0722 * Linear(blue);
        return luminance > .179 ? "#000000" : "#ffffff";
    }
    private void ResetTenant() => themes[tenant] = tenant switch { "pantry" => PantryTheme, "studio" => StudioTheme, _ => FlowThemeDefinition.Default };

    private const string LayoutCode = """
        <FlowVC Gap="1.25rem">
            <FlowCard><Header><h2>Horizontal container · FlowHC</h2></Header><ChildContent><FlowHC Wrap="true" Align="FlowAlign.Center" Justify="FlowJustify.SpaceBetween"><FlowBadge>First item</FlowBadge><FlowBadge Color="FlowColor.Success">Second item</FlowBadge><FlowButton Size="FlowSize.Sm">Third item</FlowButton></FlowHC></ChildContent></FlowCard>
            <FlowCard><Header><h2>Vertical container · FlowVC</h2></Header><ChildContent><FlowVC><FlowLabel>First row</FlowLabel><FlowDivider Label="Separated content" /><FlowLabel>Second row</FlowLabel></FlowVC></ChildContent><Footer><p class="muted">FlowCard accepts Header, ChildContent, and Footer fragments.</p></Footer></FlowCard>
        </FlowVC>
        """;
    private const string PresentationCode = """
        <FlowVC Gap="1.25rem">
            <FlowCard><Header><h2>Labels and badges</h2></Header><ChildContent><FlowVC><FlowLabel HtmlFor="sample-name" Required="true">Product name</FlowLabel><input id="sample-name" @bind="productName" placeholder="Enter a product name" required /><FlowHC Wrap="true">@foreach (var color in Enum.GetValues<FlowColor>()) { <FlowBadge Color="color">@color</FlowBadge> }</FlowHC></FlowVC></ChildContent></FlowCard>
            <FlowCard><Header><h2>Loading feedback</h2></Header><ChildContent><FlowHC Wrap="true" Align="FlowAlign.Center"><FlowLoader Size="FlowSize.Sm" /><FlowLoader ShowLabel="true" Label="Loading products" /><FlowLoader Size="FlowSize.Lg" /></FlowHC></ChildContent></FlowCard>
            <FlowCard><Header><h2>Image with fallback</h2></Header><ChildContent><FlowImage Src="missing-image.svg" FallbackSrc="showcase.svg" Alt="FlowUI illustration loaded as the fallback" MaxWidth="30rem" /></ChildContent></FlowCard>
        </FlowVC>
        
        // Code-behind
        private string productName = "";
        """;
    private const string ButtonCode = """
        <FlowVC Gap="1.25rem">
            <FlowCard><Header><h2>Variants</h2></Header><ChildContent><FlowHC Wrap="true">@foreach (var variant in Enum.GetValues<FlowVariant>()) { <FlowButton Variant="variant" OnClick="Increment">@variant</FlowButton> }</FlowHC></ChildContent></FlowCard>
            <FlowCard><Header><h2>Semantic colors</h2></Header><ChildContent><FlowHC Wrap="true">@foreach (var color in Enum.GetValues<FlowColor>()) { <FlowButton Color="color" OnClick="Increment">@color</FlowButton> }</FlowHC></ChildContent></FlowCard>
            <FlowCard><Header><h2>Sizes and states</h2></Header><ChildContent><FlowVC><FlowHC Wrap="true" Align="FlowAlign.Center">@foreach (var size in Enum.GetValues<FlowSize>()) { <FlowButton Size="size" OnClick="Increment">@size</FlowButton> }<FlowButton Disabled="true">Disabled</FlowButton></FlowHC><FlowHC Wrap="true" Align="FlowAlign.Center"><FlowButton Loading="saving" LoadingText="Saving…" OnClick="SaveAsync">Save sample</FlowButton><FlowButton Variant="FlowVariant.Outline" Selected="selected" OnClick="ToggleSelected">Toggle selected</FlowButton><span role="status">@status · Clicks: @clicks</span></FlowHC></FlowVC></ChildContent></FlowCard>
        </FlowVC>
        
        // Code-behind
        private int clicks;
            private bool saving;
            private bool selected;
            private string status = "Ready";
        private void Increment() { clicks++; } // Set a VS Code breakpoint here.
            private void ToggleSelected() => selected = !selected;
            private async Task SaveAsync()
            {
                if (saving) return;
                saving = true; status = "Saving sample";
                try { await Task.Delay(1200); status = "Sample saved (demo only)"; }
                finally { saving = false; }
            }
        """;
    private const string ThemeCode = """
        var theme = FlowThemeDefinition.Default with
        {
            Name = "Sample Palette",
            Light = FlowThemeDefinition.Default.Light with
            { Primary = "#047857", TextColor = "#172554" },
            Dark = FlowThemeDefinition.Default.Dark with
            { Primary = "#34d399", TextColor = "#f8fafc" }
        };

        <FlowThemeProvider Theme="theme" Mode="FlowThemeMode.System">
            <FlowButton>Uses this sample palette</FlowButton>
        </FlowThemeProvider>
        """;
    private const string SetupCode = """
        # From the FlowUI repository root:
        dotnet restore FlowUI.Blazor.slnx
        dotnet build FlowUI.Blazor.slnx
        dotnet run --project examples/blazor/FlowUI.Blazor.Sample.csproj

        # VS Code: select 'FlowUI Blazor Sample' and press F5.
        # Sample address: http://localhost:5180
        """;
}
