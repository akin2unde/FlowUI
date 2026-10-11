using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Selection;
public partial class FlowRadioGroup<TItem, TValue> : FlowSelectionFieldBase<TItem, TValue>
{
    [Parameter] public FlowOrientation Orientation { get; set; } = FlowOrientation.Vertical;
    [Parameter] public string? Name { get; set; }
    private string RadioName => Name ?? GeneratedId + "-radio";
    protected override async Task OnAfterRenderAsync(bool firstRender) => await (await GetModuleAsync()).InvokeVoidAsync("protectReadOnly", InputElement, ReadOnly);
    private Task ChooseAsync(TItem item) => IsItemDisabled(item) ? Task.CompletedTask : SetValueAsync(ValueSelector(item));
}
