using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Forms;

public partial class FlowCheckbox : FlowFieldBase<bool>
{

    [Parameter] public FlowColor Color { get; set; } = FlowColor.Primary;
    private Task ChangeAsync(ChangeEventArgs args) => SetValueAsync(args.Value is true);

    [Parameter] public bool Indeterminate { get; set; }
    private string CheckedState => Indeterminate ? "mixed" : Value.ToString().ToLowerInvariant();
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var module = await GetModuleAsync();
        await module.InvokeVoidAsync("setIndeterminate", InputElement, Indeterminate);
    }

}
