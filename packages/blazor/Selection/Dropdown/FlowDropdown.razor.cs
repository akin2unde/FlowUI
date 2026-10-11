using Microsoft.AspNetCore.Components;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Selection;
public partial class FlowDropdown<TItem, TValue> : FlowPopupFieldBase<TItem, TValue>
{
    [Parameter, EditorRequired] public Func<TItem, TValue> ValueSelector { get; set; } = default!;
    private bool IsSelected(TItem item) => EqualityComparer<TValue>.Default.Equals(ValueSelector(item), Value);
    private bool HasSelection => Value is not null && (!EqualityComparer<TValue>.Default.Equals(Value, default!) || Source.Any(IsSelected));
    private string SelectedText => Source.FirstOrDefault(IsSelected) is { } item && Source.Any(IsSelected) ? TextSelector(item) : HasSelection ? "Unavailable selection" : Placeholder;
    private bool CanClear => HasSelection && (!typeof(TValue).IsValueType || Nullable.GetUnderlyingType(typeof(TValue)) is not null);
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (ValueSelector is null) throw new InvalidOperationException("ValueSelector is required.");
        if (Source.Select(ValueSelector).Distinct().Count() != Source.Count) throw new InvalidOperationException("Dropdown item values must be unique.");
    }
    protected override async Task ChooseAsync(TItem item)
    {
        if (Disabled || ReadOnly || !CanChoose(item)) return;
        await SetValueAsync(ValueSelector(item));
        await CloseAsync(true);
    }
    private async Task ClearAsync() { if (CanClear) await SetValueAsync(default!); }
}
