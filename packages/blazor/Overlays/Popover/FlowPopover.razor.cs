using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Overlays;

public partial class FlowPopover : FlowComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public bool Open { get; set; }
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }
    [Parameter] public RenderFragment? Trigger { get; set; }
    [Parameter] public string Text { get; set; } = "Open popover";
    [Parameter] public string Label { get; set; } = "More information";
    private readonly string panelId = "fui-popover-" + Guid.NewGuid().ToString("N");
    private ElementReference root, trigger, panel;
    private IJSObjectReference? module;
    private DotNetObjectReference<FlowPopover>? receiver;
    private bool attached;
    private async Task Toggle() { Open = !Open; await OpenChanged.InvokeAsync(Open); }
    private Task KeyDown(KeyboardEventArgs e) => e.Key == "Escape" ? CloseFromOutside() : Task.CompletedTask;
    [JSInvokable] public async Task CloseFromOutside() { Open = false; await OpenChanged.InvokeAsync(false); await InvokeAsync(StateHasChanged); }
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        receiver ??= DotNetObjectReference.Create(this);
        if (Open && !attached) { await module.InvokeVoidAsync("openPopover", root, trigger, panel, receiver); attached = true; }
        if (!Open && attached) { await module.InvokeVoidAsync("closePopover", root); attached = false; }
    }
    public async ValueTask DisposeAsync() { if (module is not null) { try { await module.InvokeVoidAsync("closePopover", root); await module.DisposeAsync(); } catch (JSDisconnectedException) { } } receiver?.Dispose(); }
}
