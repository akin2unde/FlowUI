using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.DataDisplay;

public partial class FlowTable<TItem> : FlowComponentBase
{
    [Parameter] public IEnumerable<TItem> Items { get; set; } = [];
    [Parameter] public IReadOnlyList<FlowTableColumn<TItem>> Columns { get; set; } = [];
    [Parameter] public Func<TItem, object>? RowKey { get; set; }
    [Parameter] public string Caption { get; set; } = "Data";
    [Parameter] public string EmptyText { get; set; } = "No rows available";
    [Parameter] public bool Loading { get; set; }
    [Parameter] public int PageSize { get; set; } = 10;
    [Parameter] public int Page { get; set; } = 1;
    [Parameter] public EventCallback<int> PageChanged { get; set; }
    private FlowTableColumn<TItem>? sortColumn;
    private bool descending;
    private List<TItem> source = [];
    private int PageCount => PageSize <= 0 ? 1 : Math.Max(1, (int)Math.Ceiling(source.Count / (double)PageSize));
    private List<TItem> Rows { get { IEnumerable<TItem> rows = source; if (sortColumn is not null) rows = descending ? rows.OrderByDescending(sortColumn.Value, Comparer<object?>.Create(Compare)) : rows.OrderBy(sortColumn.Value, Comparer<object?>.Create(Compare)); return (PageSize <= 0 ? rows : rows.Skip((Page - 1) * PageSize).Take(PageSize)).ToList(); } }
    private static int Compare(object? a, object? b) { if (a is null) return b is null ? 0 : -1; if (b is null) return 1; if (a.GetType() == b.GetType() && a is IComparable value) return value.CompareTo(b); return StringComparer.CurrentCultureIgnoreCase.Compare(a.ToString(), b.ToString()); }
    protected override void OnParametersSet() { if (PageSize < 0) throw new ArgumentException("PageSize must be nonnegative; zero displays all rows."); source = Items?.ToList() ?? []; Page = Math.Clamp(Page, 1, PageCount); if (sortColumn is not null && !Columns.Contains(sortColumn)) sortColumn = null; }
    private async Task Sort(FlowTableColumn<TItem> column) { descending = sortColumn == column && !descending; sortColumn = column; await ChangePage(1); }
    private async Task ChangePage(int page) { Page = Math.Clamp(page, 1, PageCount); await PageChanged.InvokeAsync(Page); }
}
