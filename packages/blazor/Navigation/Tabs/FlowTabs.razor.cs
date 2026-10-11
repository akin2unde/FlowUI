using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Navigation;

public partial class FlowTabs : FlowComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public IReadOnlyList<FlowTabItem> Items { get; set; } = [];
    [Parameter] public string ActiveKey { get; set; } = "";
    [Parameter] public EventCallback<string> ActiveKeyChanged { get; set; }
    [Parameter] public RenderFragment<string>? Content { get; set; }
    [Parameter] public string Label { get; set; } = "Tabs";
    private readonly string uid = "fui-tabs-" + Guid.NewGuid().ToString("N");
    private ElementReference tabList;
    private IJSObjectReference? module;
    protected override void OnParametersSet() { if (Items.Select(i => i.Key).Distinct().Count() != Items.Count) throw new ArgumentException("Tab keys must be unique."); if (!Items.Any(i => i.Key == ActiveKey && !i.Disabled)) ActiveKey = Items.FirstOrDefault(i => !i.Disabled)?.Key ?? ""; }
    private async Task Select(string key) { if (!Items.Any(i => i.Key == key && !i.Disabled)) return; ActiveKey = key; await ActiveKeyChanged.InvokeAsync(key); }
    private async Task KeyDown(KeyboardEventArgs e, string key)
    {
        var enabled = Items.Where(i => !i.Disabled).ToArray(); if (enabled.Length == 0) return;
        var index = Array.FindIndex(enabled, i => i.Key == key);
        var next = e.Key switch { "ArrowRight" => (index + 1) % enabled.Length, "ArrowLeft" => (index + enabled.Length - 1) % enabled.Length, "Home" => 0, "End" => enabled.Length - 1, _ => -1 };
        if (next >= 0) { await Select(enabled[next].Key); module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js"); await module.InvokeVoidAsync("focusId", uid + "-" + enabled[next].Key); }
    }
    protected override async Task OnAfterRenderAsync(bool firstRender) { if (firstRender) { module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js"); await module.InvokeVoidAsync("prepareNavigationKeys", tabList, "tabs"); } }
    public async ValueTask DisposeAsync() { if (module is not null) { try { await module.DisposeAsync(); } catch (JSDisconnectedException) { } } }
}
