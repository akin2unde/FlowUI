using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Presentation;

public partial class FlowLoader : FlowComponentBase
{

    [Parameter] public string Label { get; set; } = "Loading";
    [Parameter] public FlowSize Size { get; set; } = FlowSize.Md;
    [Parameter] public bool ShowLabel { get; set; }

}
