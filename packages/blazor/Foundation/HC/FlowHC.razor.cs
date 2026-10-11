using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Layout;

public partial class FlowHC : FlowComponentBase
{

    [Parameter] public string Gap { get; set; } = "1rem";
    [Parameter] public FlowAlign Align { get; set; } = FlowAlign.Stretch;
    [Parameter] public FlowJustify Justify { get; set; } = FlowJustify.Start;
    [Parameter] public bool Wrap { get; set; }
    protected override FlowStyleBuilder BuildStyle() => base.BuildStyle()
        .Add("gap", Gap).Add("align-items", FlowStyleBuilder.Align(Align))
        .Add("justify-content", FlowStyleBuilder.Justify(Justify)).Add("flex-wrap", Wrap ? "wrap" : "nowrap");

}
