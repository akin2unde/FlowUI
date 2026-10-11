using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Presentation;

public partial class FlowLabel : FlowComponentBase
{

    [Parameter] public string? HtmlFor { get; set; }
    [Parameter] public bool Required { get; set; }

}
