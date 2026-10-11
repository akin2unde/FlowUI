using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Layout;

public partial class FlowCard : FlowComponentBase
{

    [Parameter] public RenderFragment? Header { get; set; }
    [Parameter] public RenderFragment? Footer { get; set; }

}
