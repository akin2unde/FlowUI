using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
namespace FlowUI.Blazor.Styling;
public abstract class FlowModalBase : FlowComponentBase, IAsyncDisposable
{
    [Inject] protected IJSRuntime JS { get; set; } = default!;
    [Parameter] public bool Open { get; set; }
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }
    [Parameter] public string Title { get; set; } = "Dialog";
    [Parameter] public RenderFragment? Header { get; set; }
    [Parameter] public RenderFragment? Footer { get; set; }
    [Parameter] public FlowSize Size { get; set; } = FlowSize.Md;
    [Parameter] public bool CloseOnEscape { get; set; } = true;
    [Parameter] public bool CloseOnBackdrop { get; set; } = true;
    [Parameter] public bool ShowCloseButton { get; set; } = true;
    [Parameter] public EventCallback<string> OnClose { get; set; }
    protected string TitleId = "fui-modal-" + Guid.NewGuid().ToString("N");
    protected ElementReference DialogElement;
    private IJSObjectReference? module;
    private DotNetObjectReference<FlowModalBase>? receiver;
    [JSInvokable] public async Task RequestClose(string reason)
    {
        if (!Open) return;
        if (reason == "escape" && !CloseOnEscape || reason == "backdrop" && !CloseOnBackdrop) return;
        Open = false; await OpenChanged.InvokeAsync(false); await OnClose.InvokeAsync(reason); await InvokeAsync(StateHasChanged);
    }
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        receiver ??= DotNetObjectReference.Create(this);
        await module.InvokeVoidAsync("syncModal", DialogElement, Open, CloseOnEscape, CloseOnBackdrop, receiver);
    }
    public async ValueTask DisposeAsync()
    {
        if (module is not null)
        {
            try { await module.InvokeVoidAsync("disposeModal", DialogElement); await module.DisposeAsync(); } catch (JSDisconnectedException) { } catch (OperationCanceledException) { }
        }
        receiver?.Dispose();
    }
}
