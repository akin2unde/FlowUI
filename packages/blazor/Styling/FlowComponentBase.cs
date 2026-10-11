using Microsoft.AspNetCore.Components;

namespace FlowUI.Blazor.Styling;

/// <summary>Common HTML attributes and optional CSS overrides for all foundation components.</summary>
public abstract class FlowComponentBase : ComponentBase
{
    [Parameter] public string? Id { get; set; }
    [Parameter] public string? Class { get; set; }
    [Parameter] public string? Style { get; set; }
    [Parameter] public string? Width { get; set; }
    [Parameter] public string? Height { get; set; }
    [Parameter] public string? MaxWidth { get; set; }
    [Parameter] public string? Padding { get; set; }
    [Parameter] public string? Margin { get; set; }
    [Parameter] public string? BackgroundColor { get; set; }
    [Parameter] public string? TextColor { get; set; }
    [Parameter] public string? CornerRadius { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    protected string Classes(string componentClass) => $"{componentClass} {Class}".Trim();
    protected virtual FlowStyleBuilder BuildStyle() => new FlowStyleBuilder()
        .Add("width", Width).Add("height", Height).Add("max-width", MaxWidth)
        .Add("padding", Padding).Add("margin", Margin).Add("background-color", BackgroundColor)
        .Add("color", TextColor).Add("border-radius", CornerRadius);
    protected string Styles => BuildStyle().Append(Style).ToString();
}
