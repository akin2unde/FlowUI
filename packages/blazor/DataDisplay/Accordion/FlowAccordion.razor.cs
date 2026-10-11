using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.DataDisplay;

public partial class FlowAccordion : FlowComponentBase
{
    [Parameter] public IReadOnlyList<FlowAccordionItem> Items { get; set; } = [];
    [Parameter] public IReadOnlyList<string> OpenKeys { get; set; } = [];
    [Parameter] public EventCallback<IReadOnlyList<string>> OpenKeysChanged { get; set; }
    [Parameter] public bool Multiple { get; set; }
    [Parameter] public RenderFragment<string>? Content { get; set; }
    private readonly string uid = "fui-accordion-" + Guid.NewGuid().ToString("N");
    protected override void OnParametersSet() { if (Items.Select(i => i.Key).Distinct().Count() != Items.Count) throw new ArgumentException("Accordion keys must be unique."); }
    private async Task Toggle(string key) { OpenKeys = OpenKeys.Contains(key) ? OpenKeys.Where(k => k != key).ToArray() : Multiple ? OpenKeys.Append(key).ToArray() : [key]; await OpenKeysChanged.InvokeAsync(OpenKeys); }
}
