using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Overlays;

public partial class FlowTooltip : FlowComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public string Location { get; set; } = "top";
    [Parameter] public string Text { get; set; } = "";
    private readonly string tipId = "fui-tip-" + Guid.NewGuid().ToString("N");
    private bool visible;
    private ElementReference anchor;
    private IJSObjectReference? module;
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!visible) return;
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        await module.InvokeVoidAsync("positionTooltip", anchor, Location.ToLowerInvariant());
    }
    public async ValueTask DisposeAsync()
    {
        if (module is null) return;
        try { await module.DisposeAsync(); }
        catch (JSDisconnectedException) { }
    }

    private void Show() => visible = !string.IsNullOrWhiteSpace(Text);
    private void Hide() => visible = false;
    private void KeyDown(KeyboardEventArgs e) { if (e.Key == "Escape") visible = false; }
}
