using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.DataDisplay;

public partial class FlowTree<TNode, TValue> : FlowComponentBase, IAsyncDisposable where TValue : notnull
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter, EditorRequired] public IEnumerable<TNode> Items { get; set; } = [];
    [Parameter, EditorRequired] public Func<TNode, TValue> ValueSelector { get; set; } = default!;
    [Parameter, EditorRequired] public Func<TNode, string> TextSelector { get; set; } = default!;
    [Parameter, EditorRequired] public Func<TNode, IEnumerable<TNode>> ChildrenSelector { get; set; } = default!;
    [Parameter] public TValue? Value { get; set; }
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }
    [Parameter] public IReadOnlyList<TValue> ExpandedValues { get; set; } = [];
    [Parameter] public EventCallback<IReadOnlyList<TValue>> ExpandedValuesChanged { get; set; }
    [Parameter] public RenderFragment<TNode>? ItemTemplate { get; set; }
    [Parameter] public string Label { get; set; } = "Tree";
    [Parameter] public string EmptyText { get; set; } = "No nodes available";
    private sealed record Row(TNode Item, TValue Value, int Level, int Position, int SiblingCount, Row? Parent, List<Row> Children);
    private List<Row> roots = [], visible = [];
    private ElementReference root;
    private IJSObjectReference? module;
    private int active;
    protected override void OnParametersSet()
    {
        if (ValueSelector is null || TextSelector is null || ChildrenSelector is null) throw new ArgumentException("Tree selectors are required.");
        var keys = new HashSet<TValue>();
        List<Row> Build(IEnumerable<TNode> nodes, int depth, Row? parent)
        {
            if (depth > 100) throw new ArgumentException("Tree depth is limited to 100 levels.");
            var list = nodes.ToList(); var result = new List<Row>();
            for (int i = 0; i < list.Count; i++) { var node = list[i]; var key = ValueSelector(node); if (key is null || !keys.Add(key)) throw new ArgumentException("Tree node values must be unique; cyclic trees are not supported."); var row = new Row(node, key, depth, i + 1, list.Count, parent, []); row.Children.AddRange(Build(ChildrenSelector(node) ?? [], depth + 1, row)); result.Add(row); }
            return result;
        }
        roots = Build(Items ?? [], 1, null); Flatten();
    }
    private void Flatten() { visible = []; void Add(Row row) { visible.Add(row); if (ExpandedValues.Contains(row.Value)) foreach (var child in row.Children) Add(child); } foreach (var row in roots) Add(row); active = Math.Clamp(active, 0, Math.Max(0, visible.Count - 1)); }
    private async Task Toggle(Row row) { ExpandedValues = ExpandedValues.Contains(row.Value) ? ExpandedValues.Where(v => !EqualityComparer<TValue>.Default.Equals(v, row.Value)).ToArray() : ExpandedValues.Append(row.Value).ToArray(); Flatten(); await ExpandedValuesChanged.InvokeAsync(ExpandedValues); }
    private async Task Select(Row row, int index) { active = index; Value = row.Value; await ValueChanged.InvokeAsync(row.Value); }
    private async Task KeyDown(KeyboardEventArgs e, int index)
    {
        var row = visible[index]; active = index;
        switch (e.Key)
        {
            case "ArrowDown": active = Math.Min(index + 1, visible.Count - 1); break;
            case "ArrowUp": active = Math.Max(0, index - 1); break;
            case "Home": active = 0; break;
            case "End": active = visible.Count - 1; break;
            case "ArrowRight": if (row.Children.Count > 0) { if (!ExpandedValues.Contains(row.Value)) await Toggle(row); else active = Math.Min(index + 1, visible.Count - 1); } break;
            case "ArrowLeft": if (row.Children.Count > 0 && ExpandedValues.Contains(row.Value)) await Toggle(row); else if (row.Parent is not null) active = visible.IndexOf(row.Parent); break;
            case "Enter": case " ": await Select(row, index); break;
            default: return;
        }
        await InvokeAsync(StateHasChanged); module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js"); await module.InvokeVoidAsync("focusTreeItem", root, active);
    }
    protected override async Task OnAfterRenderAsync(bool firstRender) { if (firstRender) { module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js"); await module.InvokeVoidAsync("prepareNavigationKeys", root, "tree"); } }
    public async ValueTask DisposeAsync() { if (module is not null) { try { await module.DisposeAsync(); } catch (JSDisconnectedException) { } } }
}
