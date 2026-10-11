using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Theming;

public partial class FlowThemeProvider : FlowComponentBase
{

    [Parameter] public FlowThemeDefinition Theme { get; set; } = FlowThemeDefinition.Default;
    [Parameter] public FlowThemeMode Mode { get; set; } = FlowThemeMode.System;
    private FlowThemeContext Context => new(Theme, Mode);
    protected override FlowStyleBuilder BuildStyle()
    {
        var builder = base.BuildStyle().Add("--fui-font-family", Theme.FontFamily).Add("--fui-radius", Theme.Radius);
        builder.Add("--fui-light-color-canvas", Theme.Light.Canvas).Add("--fui-dark-color-canvas", Theme.Dark.Canvas);
        builder.Add("--fui-light-color-surface", Theme.Light.Surface).Add("--fui-dark-color-surface", Theme.Dark.Surface);
        builder.Add("--fui-light-color-surfaceRaised", Theme.Light.SurfaceRaised).Add("--fui-dark-color-surfaceRaised", Theme.Dark.SurfaceRaised);
        builder.Add("--fui-light-color-surfaceSunken", Theme.Light.SurfaceSunken).Add("--fui-dark-color-surfaceSunken", Theme.Dark.SurfaceSunken);
        builder.Add("--fui-light-color-text", Theme.Light.TextColor).Add("--fui-dark-color-text", Theme.Dark.TextColor);
        builder.Add("--fui-light-color-textMuted", Theme.Light.TextMuted).Add("--fui-dark-color-textMuted", Theme.Dark.TextMuted);
        builder.Add("--fui-light-color-border", Theme.Light.Border).Add("--fui-dark-color-border", Theme.Dark.Border);
        builder.Add("--fui-light-color-primary", Theme.Light.Primary).Add("--fui-dark-color-primary", Theme.Dark.Primary);
        builder.Add("--fui-light-color-onPrimary", Theme.Light.OnPrimary).Add("--fui-dark-color-onPrimary", Theme.Dark.OnPrimary);
        builder.Add("--fui-light-color-secondary", Theme.Light.Secondary).Add("--fui-dark-color-secondary", Theme.Dark.Secondary);
        builder.Add("--fui-light-color-onSecondary", Theme.Light.OnSecondary).Add("--fui-dark-color-onSecondary", Theme.Dark.OnSecondary);
        builder.Add("--fui-light-color-success", Theme.Light.Success).Add("--fui-dark-color-success", Theme.Dark.Success);
        builder.Add("--fui-light-color-onSuccess", Theme.Light.OnSuccess).Add("--fui-dark-color-onSuccess", Theme.Dark.OnSuccess);
        builder.Add("--fui-light-color-danger", Theme.Light.Danger).Add("--fui-dark-color-danger", Theme.Dark.Danger);
        builder.Add("--fui-light-color-onDanger", Theme.Light.OnDanger).Add("--fui-dark-color-onDanger", Theme.Dark.OnDanger);
        builder.Add("--fui-light-color-warning", Theme.Light.Warning).Add("--fui-dark-color-warning", Theme.Dark.Warning);
        builder.Add("--fui-light-color-onWarning", Theme.Light.OnWarning).Add("--fui-dark-color-onWarning", Theme.Dark.OnWarning);
        builder.Add("--fui-light-color-info", Theme.Light.Info).Add("--fui-dark-color-info", Theme.Dark.Info);
        builder.Add("--fui-light-color-onInfo", Theme.Light.OnInfo).Add("--fui-dark-color-onInfo", Theme.Dark.OnInfo);
        builder.Add("--fui-light-color-focus", Theme.Light.Focus).Add("--fui-dark-color-focus", Theme.Dark.Focus);
        return builder;
    }
}
