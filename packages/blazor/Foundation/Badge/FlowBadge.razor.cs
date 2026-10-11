using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Presentation;

public partial class FlowBadge : FlowComponentBase
{

    [Parameter] public FlowColor Color { get; set; } = FlowColor.Primary;
    [Parameter] public FlowVariant Variant { get; set; } = FlowVariant.Soft;
    [Parameter] public FlowSize Size { get; set; } = FlowSize.Sm;

}
