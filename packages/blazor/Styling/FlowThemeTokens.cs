namespace FlowUI.Blazor.Styling;

/// <summary>One semantic palette. Use record copies to create tenant-specific palettes.</summary>
public sealed record FlowThemeTokens
{
    public string Canvas { get; init; } = "#f8fafc";
    public string Surface { get; init; } = "#ffffff";
    public string SurfaceRaised { get; init; } = "#ffffff";
    public string SurfaceSunken { get; init; } = "#f1f5f9";
    public string TextColor { get; init; } = "#0f172a";
    public string TextMuted { get; init; } = "#64748b";
    public string Border { get; init; } = "#e2e8f0";
    public string Primary { get; init; } = "#2563eb";
    public string OnPrimary { get; init; } = "#ffffff";
    public string Secondary { get; init; } = "#475569";
    public string OnSecondary { get; init; } = "#ffffff";
    public string Success { get; init; } = "#15803d";
    public string OnSuccess { get; init; } = "#ffffff";
    public string Danger { get; init; } = "#dc2626";
    public string OnDanger { get; init; } = "#ffffff";
    public string Warning { get; init; } = "#fbbf24";
    public string OnWarning { get; init; } = "#422006";
    public string Info { get; init; } = "#0e7490";
    public string OnInfo { get; init; } = "#ffffff";
    public string Focus { get; init; } = "#2563eb";
}

/// <summary>Defines both palettes independently of a user's Light/Dark/System preference.</summary>
public sealed record FlowThemeDefinition
{
    public string Name { get; init; } = "FlowUI";
    public FlowThemeTokens Light { get; init; } = new();
    public FlowThemeTokens Dark { get; init; } = new()
    {
        Canvas = "#020617", Surface = "#0f172a", SurfaceRaised = "#1e293b",
        SurfaceSunken = "#020617", TextColor = "#f8fafc", TextMuted = "#94a3b8",
        Border = "#334155", Primary = "#60a5fa", OnPrimary = "#0f172a",
        Secondary = "#cbd5e1", OnSecondary = "#0f172a",
        Success = "#4ade80", OnSuccess = "#052e16",
        Danger = "#f87171", OnDanger = "#450a0a",
        Info = "#67e8f9", OnInfo = "#083344", Focus = "#60a5fa"
    };
    public string FontFamily { get; init; } = "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";
    public string Radius { get; init; } = ".75rem";
    public static FlowThemeDefinition Default { get; } = new();
}

/// <summary>Requested mode and theme. System is resolved by browser CSS, not server time or settings.</summary>
public sealed record FlowThemeContext(FlowThemeDefinition Theme, FlowThemeMode Mode);
