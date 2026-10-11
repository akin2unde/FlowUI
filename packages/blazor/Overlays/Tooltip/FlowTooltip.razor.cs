using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Overlays;

public partial class FlowTooltip : FlowComponentBase
{
    [Parameter] public string Text { get; set; } = "";
    private readonly string tipId = "fui-tip-" + Guid.NewGuid().ToString("N");
    private bool visible;
    private void Show() => visible = !string.IsNullOrWhiteSpace(Text);
    private void Hide() => visible = false;
    private void KeyDown(KeyboardEventArgs e) { if (e.Key == "Escape") visible = false; }
}
