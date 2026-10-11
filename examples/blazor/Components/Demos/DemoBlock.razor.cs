using Microsoft.AspNetCore.Components;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class DemoBlock
{
    [Parameter] public string Title { get; set; } = "";
    [Parameter] public string Markup { get; set; } = "";
    [Parameter] public string? Code { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
}
