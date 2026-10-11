namespace FlowUI.Blazor.Styling;
public enum FlowDrawerSide { Start, End }
public sealed record FlowTabItem(string Key, string Text, bool Disabled = false);
public sealed record FlowBreadcrumbItem(string Text, string? Href = null);
public sealed record FlowAccordionItem(string Key, string Title);
public sealed class FlowTableColumn<TItem>
{
    public required string Title { get; init; }
    public required Func<TItem, object?> Value { get; init; }
    public Microsoft.AspNetCore.Components.RenderFragment<TItem>? Template { get; init; }
    public bool Sortable { get; init; } = true;
}
