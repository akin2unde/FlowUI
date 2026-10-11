using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Buttons;

public partial class FlowButton : FlowComponentBase
{

    [Parameter] public FlowColor Color { get; set; } = FlowColor.Primary;
    [Parameter] public FlowVariant Variant { get; set; } = FlowVariant.Solid;
    [Parameter] public FlowSize Size { get; set; } = FlowSize.Md;
    [Parameter] public string Type { get; set; } = "button";
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool Loading { get; set; }
    [Parameter] public string LoadingText { get; set; } = "Loading";
    [Parameter] public bool? Selected { get; set; }
    [Parameter] public string? AriaLabel { get; set; }
    [Parameter] public EventCallback<MouseEventArgs> OnClick { get; set; }
    private string? Pressed => Selected?.ToString().ToLowerInvariant();
    private Task HandleClickAsync(MouseEventArgs args) => Disabled || Loading ? Task.CompletedTask : OnClick.InvokeAsync(args);

}
