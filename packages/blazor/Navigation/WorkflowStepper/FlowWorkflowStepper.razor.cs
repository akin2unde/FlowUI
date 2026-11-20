using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace FlowUI.Blazor.Navigation;

public partial class FlowWorkflowStepper : IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public IReadOnlyList<FlowStage> Stages { get; set; } = [];
    [Parameter] public string Direction { get; set; } = "horizontal";
    [Parameter] public string LabelPosition { get; set; } = "below";
    [Parameter] public string? LineColor { get; set; }
    [Parameter] public FlowTextStyle? StageTextStyle { get; set; }
    [Parameter] public FlowStageStyle? CompletedStyle { get; set; }
    [Parameter] public FlowStageStyle? CurrentStyle { get; set; }
    [Parameter] public FlowStageStyle? DisabledStyle { get; set; }
    [Parameter] public FlowActionMenuStyle? ActionMenuStyle { get; set; }
    [Parameter] public FlowActionItemStyle? ActionItemStyle { get; set; }
    [Parameter] public FlowIconStyle? ChevronStyle { get; set; }
    [Parameter] public FlowIconStyle? CheckmarkStyle { get; set; }
    [Parameter] public EventCallback<FlowStage> OnStageClick { get; set; }
    [Parameter] public EventCallback<FlowActionChange> OnActionChange { get; set; }

    private readonly Dictionary<string, FlowAction> selections = [];
    private string? openId;
    private FlowAction? hoverAction;
    private string? renderedMenu;
    private ElementReference root;
    private IJSObjectReference? module;
    private DotNetObjectReference<FlowWorkflowStepper>? callback;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (renderedMenu == openId) return;
        renderedMenu = openId;
        if (openId is null)
        {
            if (module is not null) await module.InvokeVoidAsync("closeMenu", root);
            return;
        }
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/workflow-stepper.js");
        callback ??= DotNetObjectReference.Create(this);
        await module.InvokeVoidAsync("positionMenu", root, callback);
    }
    [JSInvokable]
    public Task DismissActionMenu() => InvokeAsync(() => { Close(); StateHasChanged(); });

    public async ValueTask DisposeAsync()
    {
        if (module is not null)
        {
            try
            {
                await module.InvokeVoidAsync("closeMenu", root);
                await module.DisposeAsync();
            }
            catch (JSDisconnectedException) { }
        }
        callback?.Dispose();
    }


    private static string Flag(bool value) => value ? "true" : "false";
    private static bool CanPick(FlowStage stage) => stage.IsCurrent && !stage.IsDisabled && stage.Actions is { Count: > 1 };
    private FlowAction? FindSelection(FlowStage stage)
    {
        var selected = stage.SelectedAction ?? selections.GetValueOrDefault(stage.Id);
        return stage.Actions?.FirstOrDefault(action => ReferenceEquals(action, selected))
            ?? stage.Actions?.FirstOrDefault(action => action.Label == selected?.Label);
    }
    private void Close() { openId = null; hoverAction = null; }
    private void Toggle(string id)
    {
        var alreadyOpen = openId == id;
        Close();
        if (!alreadyOpen) openId = id;
    }
    private async Task ClickStage(FlowStage stage)
    {
        Close();
        await OnStageClick.InvokeAsync(stage);
    }
    private async Task Select(FlowStage stage, FlowAction action)
    {
        if (!CanPick(stage) || action.IsReadonly) return;
        if (stage.SelectedAction is null) selections[stage.Id] = action;
        Close();
        await OnActionChange.InvokeAsync(new(stage, action));
    }
    private static string Declaration(string key, string? value) => value is null ? "" : $"{key}:{value};";
    private static string FormatText(params FlowTextStyle?[] styles) => string.Concat(styles.OfType<FlowTextStyle>().Select(style =>
        Declaration("color", style.Color) + Declaration("font-family", style.FontFamily) + Declaration("font-size", style.FontSize)
        + Declaration("font-weight", style.FontWeight) + Declaration("line-height", style.LineHeight) + Declaration("text-align", style.TextAlign)));
    private static string FormatIcon(params FlowIconStyle?[] styles) => string.Concat(styles.OfType<FlowIconStyle>().Select(style =>
        Declaration("color", style.Color) + Declaration("font-size", style.Size)));
    private string MenuStyles => Declaration("background-color", ActionMenuStyle?.BackgroundColor)
        + Declaration("border-color", ActionMenuStyle?.BorderColor) + Declaration("border-radius", ActionMenuStyle?.BorderRadius)
        + Declaration("box-shadow", ActionMenuStyle?.BoxShadow);
    private string FormatRow(FlowAction action, params FlowActionItemStyle?[] styles) =>
        Declaration("background-color", styles.Reverse().FirstOrDefault(item => item?.BackgroundColor is not null)?.BackgroundColor ?? ActionItemStyle?.BackgroundColor)
        + FormatText(new[] { ActionItemStyle?.TextStyle }.Concat(styles.Select(item => item?.TextStyle)).Append(action.TextStyle).ToArray());
}
