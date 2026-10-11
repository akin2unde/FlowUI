using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Navigation;

public partial class FlowBreadcrumbs : FlowComponentBase
{
    [Parameter] public IReadOnlyList<FlowBreadcrumbItem> Items { get; set; } = [];
    [Parameter] public string Label { get; set; } = "Breadcrumb";
}
