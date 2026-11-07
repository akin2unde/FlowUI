using FlowUI.Blazor.Styling;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace FlowUI.Blazor.Forms;

public partial class FlowAutocomplete : FlowComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public IReadOnlyList<string> Items { get; set; } = [];
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }
    [Parameter] public EventCallback<string> Selected { get; set; }
    [Parameter] public string Label { get; set; } = "Search";
    [Parameter] public string? Placeholder { get; set; }
    [Parameter] public int MinCharacters { get; set; } = 1;
    [Parameter] public bool Disabled { get; set; }

    private readonly string listId = $"fui-suggestions-{Guid.NewGuid():N}";
    private ElementReference root;
    private IJSObjectReference? module;
    private DotNetObjectReference<FlowAutocomplete>? receiver;
    private string[] matches = [];
    private bool open;
    private int activeIndex = -1;

    private void Close() { open = false; activeIndex = -1; }
    private void Toggle()
    {
        if (open) { Close(); return; }
        matches = [.. Items];
        open = true;
    }

    private async Task Search(ChangeEventArgs args)
    {
        var query = args.Value?.ToString() ?? "";
        matches = Items.Where(item => item.Contains(query, StringComparison.OrdinalIgnoreCase)).ToArray();
        open = query.Length >= MinCharacters;
        activeIndex = -1;
        await ValueChanged.InvokeAsync(query);
    }

    private async Task Select(string item)
    {
        Close();
        await ValueChanged.InvokeAsync(item);
        await Selected.InvokeAsync(item);
    }

    private async Task KeyDown(KeyboardEventArgs args)
    {
        if (Disabled) return;
        if (args.Key == "Escape") Close();
        if (args.Key == "ArrowDown" && !open) Toggle();
        if (!open || matches.Length == 0) return;
        if (args.Key == "ArrowDown") activeIndex = Math.Min(activeIndex + 1, matches.Length - 1);
        if (args.Key == "ArrowUp") activeIndex = Math.Max(activeIndex - 1, 0);
        if (args.Key == "Enter" && activeIndex >= 0) await Select(matches[activeIndex]);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!open)
        {
            if (module is not null) await module.InvokeVoidAsync("unwatchOutside", root);
            return;
        }
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        receiver ??= DotNetObjectReference.Create(this);
        await module.InvokeVoidAsync("watchOutside", root, receiver);
    }

    [JSInvokable] public Task CloseFromOutside() => InvokeAsync(() => { Close(); StateHasChanged(); });

    public async ValueTask DisposeAsync()
    {
        try
        {
            if (module is not null)
            {
                await module.InvokeVoidAsync("unwatchOutside", root);
                await module.DisposeAsync();
            }
        }
        catch (JSDisconnectedException) { }
        finally { receiver?.Dispose(); }
    }
}
