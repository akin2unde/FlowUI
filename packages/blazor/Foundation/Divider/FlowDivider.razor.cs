using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Layout;

public partial class FlowDivider : FlowComponentBase
{

    [Parameter] public FlowOrientation Orientation { get; set; }
    [Parameter] public string? Label { get; set; }

}
