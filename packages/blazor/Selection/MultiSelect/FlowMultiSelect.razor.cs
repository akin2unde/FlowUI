using System.Linq.Expressions;
using Microsoft.AspNetCore.Components;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Selection;
public partial class FlowMultiSelect<TItem, TValue> : FlowPopupFieldBase<TItem, IReadOnlyList<TValue>>
{
    [Parameter, EditorRequired] public Func<TItem, TValue> ValueSelector { get; set; } = default!;
    [Parameter] public IReadOnlyList<TValue> Values { get; set; } = [];
    [Parameter] public EventCallback<IReadOnlyList<TValue>> ValuesChanged { get; set; }
    [Parameter] public Expression<Func<IReadOnlyList<TValue>>>? ValuesExpression { get; set; }
    [Parameter] public int MaxVisibleTags { get; set; } = 3;
    [Parameter] public int? MaxSelections { get; set; }
    [Parameter] public bool ShowSelectAll { get; set; }
    [Parameter] public bool CloseOnSelect { get; set; }
    private bool IsSelected(TItem item) => Values.Contains(ValueSelector(item));
    private bool HasSelection => Values.Count > 0;
    private string SelectedText => HasSelection ? $"{Values.Count} selected" : Placeholder;
    private bool CanClear => Values.Any(value => !IsValueDisabled(value));
    private List<TItem> Eligible => Visible.Where(i => !IsItemDisabled(i)).ToList();
    private bool AllVisibleSelected => Eligible.Count > 0 && Eligible.All(IsSelected);
    private bool SomeVisibleSelected => Eligible.Any(IsSelected);
    private bool CanBulk => AllVisibleSelected || MaxSelections is null || Values.Union(Eligible.Select(ValueSelector)).Count() <= MaxSelections;
    private string TagText(TValue value) => Source.FindIndex(i => EqualityComparer<TValue>.Default.Equals(ValueSelector(i), value)) is var index && index >= 0 ? TextSelector(Source[index]) : $"Unavailable ({value})";
    private bool IsValueDisabled(TValue value) => Source.Any(i => EqualityComparer<TValue>.Default.Equals(ValueSelector(i), value) && IsItemDisabled(i));
    protected override bool CanChoose(TItem item) => base.CanChoose(item) && (IsSelected(item) || MaxSelections is null || Values.Count < MaxSelections);
    protected override void OnParametersSet()
    {
        Values ??= [];
        Value = Values; ValueExpression = ValuesExpression; ValueChanged = ValuesChanged;
        base.OnParametersSet();
        if (ValueSelector is null) throw new InvalidOperationException("ValueSelector is required.");
        if (Source.Select(ValueSelector).Distinct().Count() != Source.Count || Values.Distinct().Count() != Values.Count)
            throw new InvalidOperationException("MultiSelect items and selected values must be unique.");
        if (MaxVisibleTags < 0 || MaxSelections < 1) throw new ArgumentException("MaxVisibleTags must be nonnegative and MaxSelections positive.");
    }
    private async Task ReplaceAsync(IEnumerable<TValue> next)
    {
        if (Disabled || ReadOnly) return;
        Values = next.Distinct().ToArray();
        await SetValueAsync(Values);
    }
    protected override async Task ChooseAsync(TItem item)
    {
        if (Disabled || ReadOnly || !CanChoose(item)) return;
        var value = ValueSelector(item);
        await ReplaceAsync(IsSelected(item) ? Values.Where(v => !EqualityComparer<TValue>.Default.Equals(v, value)) : Values.Append(value));
        if (CloseOnSelect) await CloseAsync(true);
    }
    private Task RemoveAsync(TValue value) => IsValueDisabled(value) ? Task.CompletedTask : ReplaceAsync(Values.Where(v => !EqualityComparer<TValue>.Default.Equals(v, value)));
    private Task ClearAsync() => ReplaceAsync(Values.Where(IsValueDisabled));
    private Task BulkAsync()
    {
        if (!CanBulk || Loading) return Task.CompletedTask;
        var visibleValues = Eligible.Select(ValueSelector).ToHashSet();
        return ReplaceAsync(AllVisibleSelected ? Values.Where(v => !visibleValues.Contains(v)) : Values.Union(visibleValues));
    }
}
