using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Navigation;

public partial class FlowPagination : FlowComponentBase
{
    [Parameter] public int Page { get; set; } = 1;
    [Parameter] public EventCallback<int> PageChanged { get; set; }
    [Parameter] public int PageCount { get; set; } = 1;
    [Parameter] public int MaxVisiblePages { get; set; } = 5;
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public string Label { get; set; } = "Pagination";
    private IEnumerable<int> PageNumbers { get { var start = Math.Max(1, Math.Min(Page - MaxVisiblePages / 2, PageCount - MaxVisiblePages + 1)); return Enumerable.Range(start, Math.Min(PageCount, MaxVisiblePages)); } }
    protected override void OnParametersSet() { if (PageCount < 1 || MaxVisiblePages < 1) throw new ArgumentException("PageCount and MaxVisiblePages must be positive."); Page = Math.Clamp(Page, 1, PageCount); }
    private async Task Change(int next) { if (Disabled) return; Page = Math.Clamp(next, 1, PageCount); await PageChanged.InvokeAsync(Page); }
}
