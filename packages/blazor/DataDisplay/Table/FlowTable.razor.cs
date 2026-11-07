using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.DataDisplay;

public partial class FlowTable<TItem> : FlowComponentBase, IAsyncDisposable
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
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public bool ColumnsConfigurable { get; set; }
    [Parameter] public bool Exportable { get; set; }
    [Parameter] public string ExportFileName { get; set; } = "table";
    [Parameter] public IReadOnlyList<string>? VisibleColumnKeys { get; set; }
    [Parameter] public EventCallback<IReadOnlyList<string>> VisibleColumnKeysChanged { get; set; }
    [Parameter] public int? TotalCount { get; set; }
    [Parameter] public bool? HasMore { get; set; }
    [Parameter] public bool LoadingMore { get; set; }
    [Parameter] public EventCallback OnLoadMore { get; set; }
    [Parameter] public RenderFragment<FlowTableLoadMoreContext>? LoadMoreTemplate { get; set; }

    private IReadOnlyList<string>? internalColumns;
    private IJSObjectReference? module;
    private string ColumnKey(FlowTableColumn<TItem> column) => column.Key ?? Columns.ToList().IndexOf(column).ToString(System.Globalization.CultureInfo.InvariantCulture);
    private IReadOnlyList<string> SelectedColumns => VisibleColumnKeys ?? internalColumns ??
        Columns.Where(column => column.DefaultVisible).Select(ColumnKey).ToArray();
    private List<FlowTableColumn<TItem>> VisibleColumns => Columns.Where(column => SelectedColumns.Contains(ColumnKey(column))).ToList();
    private FlowTableLoadMoreContext LoadContext => new(source.Count, TotalCount, Loading || LoadingMore,
        HasMore ?? (TotalCount is int total && source.Count < total), RequestMore);
    private Task RequestMore() => LoadContext.HasMore && !LoadContext.Loading ? OnLoadMore.InvokeAsync() : Task.CompletedTask;
    private async Task ChangeColumns(IReadOnlyList<string> fields)
    {
        if (VisibleColumnKeys is null) internalColumns = fields;
        await VisibleColumnKeysChanged.InvokeAsync(fields);
    }
    private async Task ExportCsv()
    {
        var columns = VisibleColumns;
        if (columns.Count == 0) return;
        static string Quote(object? value) => "\"" + (value?.ToString() ?? "").Replace("\"", "\"\"") + "\"";
        var header = string.Join(",", columns.Select(column => Quote(column.Title)));
        var rows = SortedRows.Select(row => string.Join(",", columns.Select(column => Quote((column.ExportValue ?? column.Value)(row)))));
        var csv = string.Join("\r\n", rows.Prepend(header));
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        await module.InvokeVoidAsync("downloadCsv", csv, ExportFileName);
    }
    public async ValueTask DisposeAsync()
    {
        if (module is not null) { try { await module.DisposeAsync(); } catch (JSDisconnectedException) { } }
    }
    private FlowTableColumn<TItem>? sortColumn;
    private bool descending;
    private List<TItem> source = [];
    private int PageCount => PageSize <= 0 ? 1 : Math.Max(1, (int)Math.Ceiling(source.Count / (double)PageSize));
    private IEnumerable<TItem> SortedRows => sortColumn is null ? source
        : descending ? source.OrderByDescending(sortColumn.Value, Comparer<object?>.Create(Compare))
        : source.OrderBy(sortColumn.Value, Comparer<object?>.Create(Compare));
    private List<TItem> Rows => (PageSize <= 0 ? SortedRows : SortedRows.Skip((Page - 1) * PageSize).Take(PageSize)).ToList();
    private static int Compare(object? a, object? b) { if (a is null) return b is null ? 0 : -1; if (b is null) return 1; if (a.GetType() == b.GetType() && a is IComparable value) return value.CompareTo(b); return StringComparer.CurrentCultureIgnoreCase.Compare(a.ToString(), b.ToString()); }
    protected override void OnParametersSet() { if (PageSize < 0) throw new ArgumentException("PageSize must be nonnegative; zero displays all rows."); source = Items?.ToList() ?? []; Page = Math.Clamp(Page, 1, PageCount); if (sortColumn is not null && !Columns.Contains(sortColumn)) sortColumn = null; }
    private async Task Sort(FlowTableColumn<TItem> column) { descending = sortColumn == column && !descending; sortColumn = column; await ChangePage(1); }
    private async Task ChangePage(int page) { Page = Math.Clamp(page, 1, PageCount); await PageChanged.InvokeAsync(Page); }
}
