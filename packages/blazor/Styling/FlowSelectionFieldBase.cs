using Microsoft.AspNetCore.Components;
namespace FlowUI.Blazor.Styling;
/// <summary>Shared item projection and unique-value checks for selection controls.</summary>
public abstract class FlowSelectionFieldBase<TItem, TValue> : FlowFieldBase<TValue>
{
    [Parameter, EditorRequired] public IEnumerable<TItem> Items { get; set; } = [];
    [Parameter, EditorRequired] public Func<TItem, TValue> ValueSelector { get; set; } = default!;
    [Parameter, EditorRequired] public Func<TItem, string> TextSelector { get; set; } = default!;
    [Parameter] public Func<TItem, bool>? DisabledSelector { get; set; }
    [Parameter] public RenderFragment<TItem>? ItemTemplate { get; set; }
    protected List<TItem> Source = [];
    protected bool IsItemDisabled(TItem item) => DisabledSelector?.Invoke(item) == true;
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (ValueSelector is null || TextSelector is null) throw new InvalidOperationException("ValueSelector and TextSelector are required.");
        Source = Items?.ToList() ?? [];
        var values = new HashSet<TValue>();
        foreach (var item in Source)
            if (!values.Add(ValueSelector(item))) throw new InvalidOperationException("Selection item values must be unique.");
    }
}
