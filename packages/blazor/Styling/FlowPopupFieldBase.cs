using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
namespace FlowUI.Blazor.Styling;
public abstract class FlowPopupFieldBase<TItem, TField> : FlowFieldBase<TField>
{
    [Parameter, EditorRequired] public IEnumerable<TItem> Items { get; set; } = [];
    [Parameter, EditorRequired] public Func<TItem, string> TextSelector { get; set; } = default!;
    [Parameter] public Func<TItem, bool>? DisabledSelector { get; set; }
    [Parameter] public RenderFragment<TItem>? ItemTemplate { get; set; }
    [Parameter] public bool Searchable { get; set; }
    [Parameter] public bool Clearable { get; set; }
    [Parameter] public bool Loading { get; set; }
    [Parameter] public string Placeholder { get; set; } = "Select an option";
    [Parameter] public string SearchPlaceholder { get; set; } = "Search options";
    [Parameter] public string EmptyText { get; set; } = "No options available";
    [Parameter] public string NoResultsText { get; set; } = "No matching options";
    protected List<TItem> Source = [];
    protected List<TItem> Visible => string.IsNullOrWhiteSpace(search) ? Source : Source.Where(i => TextSelector(i).Contains(search, StringComparison.CurrentCultureIgnoreCase)).ToList();
    protected ElementReference RootElement, TriggerElement, PanelElement, SearchElement, AnchorElement;
    protected bool open;
    protected string search = "";
    protected int activeIndex = -1;
    protected string PanelId => InputId + "-list";
    protected string? ActiveId => open && activeIndex >= 0 ? InputId + "-option-" + activeIndex : null;
    private DotNetObjectReference<FlowPopupFieldBase<TItem, TField>>? receiver;
    private bool menuAttached, pendingFocus, pendingScroll, keysAttached;
    protected bool IsItemDisabled(TItem item) => DisabledSelector?.Invoke(item) == true;
    protected virtual bool CanChoose(TItem item) => !IsItemDisabled(item) && !Loading;
    protected abstract Task ChooseAsync(TItem item);
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (TextSelector is null) throw new InvalidOperationException("TextSelector is required.");
        Source = Items?.ToList() ?? [];
        if (Disabled || ReadOnly) open = false;
        var items = Visible;
        if (activeIndex >= items.Count || (activeIndex >= 0 && !CanChoose(items[activeIndex]))) activeIndex = -1;
    }
    protected async Task ToggleAsync()
    {
        if (Disabled || ReadOnly) return;
        if (open) await CloseAsync(true);
        else { open = true; search = ""; activeIndex = FirstEnabled(); pendingFocus = true; }
    }
    protected int FirstEnabled() => Visible.FindIndex(CanChoose);
    protected async Task CloseAsync(bool focusTrigger = false)
    {
        open = false;
        if (Module is not null && menuAttached) { await Module.InvokeVoidAsync("closeMenu", RootElement); menuAttached = false; }
        if (focusTrigger && Module is not null) await Module.InvokeVoidAsync("focusElement", TriggerElement);
    }
    [JSInvokable] public async Task CloseFromOutside() { await CloseAsync(); await InvokeAsync(StateHasChanged); }
    protected void SearchChanged(ChangeEventArgs args) { search = args.Value?.ToString() ?? ""; activeIndex = FirstEnabled(); pendingScroll = true; }
    protected Task TriggerKey(KeyboardEventArgs args) => HandleKey(args, false);
    protected Task SearchKey(KeyboardEventArgs args) => HandleKey(args, true);
    private async Task HandleKey(KeyboardEventArgs args, bool inSearch)
    {
        if (Disabled || ReadOnly) return;
        if (args.Key == "Escape") { await CloseAsync(true); return; }
        if (args.Key == "Tab") { await CloseAsync(); return; }
        if (!open)
        {
            if (args.Key is "ArrowDown" or "ArrowUp" or "Home" or "End") { await ToggleAsync(); if (args.Key is "ArrowUp" or "End") activeIndex = Visible.FindLastIndex(CanChoose); }
            return; // Enter and space activate a native button through its click event.
        }
        if (inSearch && args.Key is "Home" or "End") return;
        if (args.Key is "ArrowDown" or "ArrowUp" or "Home" or "End")
        {
            var items = Visible;
            if (args.Key == "Home") activeIndex = items.FindIndex(CanChoose);
            else if (args.Key == "End") activeIndex = items.FindLastIndex(CanChoose);
            else if (items.Count > 0)
            {
                var direction = args.Key == "ArrowDown" ? 1 : -1;
                for (var n = 1; n <= items.Count; n++)
                {
                    var next = (activeIndex + direction * n + items.Count * 2) % items.Count;
                    if (CanChoose(items[next])) { activeIndex = next; break; }
                }
            }
            pendingScroll = true;
        }
        else if ((args.Key == "Enter" || (!inSearch && args.Key == " ")) && activeIndex >= 0) await ChooseAsync(Visible[activeIndex]);
    }
    protected async Task ActivateAsync()
    {
        if (open && activeIndex >= 0 && !Searchable) await ChooseAsync(Visible[activeIndex]);
        else await ToggleAsync();
    }
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var module = await GetModuleAsync();
        if (!keysAttached) { await module.InvokeVoidAsync("prepareMenuKeys", RootElement, TriggerElement); keysAttached = true; }
        if (open)
        {
            if (!menuAttached) { receiver ??= DotNetObjectReference.Create(this); await module.InvokeVoidAsync("openMenu", RootElement, TriggerElement, PanelElement, receiver, AnchorElement); menuAttached = true; }
            if (pendingFocus) await module.InvokeVoidAsync("focusElement", Searchable ? SearchElement : TriggerElement);
            if (pendingScroll && activeIndex >= 0) await module.InvokeVoidAsync("scrollOption", PanelElement, activeIndex);
        }
        else if (menuAttached) { await module.InvokeVoidAsync("closeMenu", RootElement); menuAttached = false; }
        pendingFocus = pendingScroll = false;
    }
    public override async ValueTask DisposeAsync()
    {
        if (Module is not null)
        {
            try { await Module.InvokeVoidAsync("disposeMenu", RootElement); } catch (JSDisconnectedException) { } catch (OperationCanceledException) { }
        }
        receiver?.Dispose();
        await base.DisposeAsync();
    }
}
