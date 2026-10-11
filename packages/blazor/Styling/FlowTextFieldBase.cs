using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace FlowUI.Blazor.Styling;

public abstract class FlowTextFieldBase : FlowFieldBase<string?>
{
    [Parameter] public string? Placeholder { get; set; }
    [Parameter] public int? MaxLength { get; set; }
    [Parameter] public string? AutoComplete { get; set; }
    protected string Text = "";
    private string? lastValue;
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (lastValue != Value) { Text = Value ?? ""; lastValue = Value; }
    }
    protected async Task HandleInput(ChangeEventArgs args)
    {
        if (Disabled || ReadOnly) return;
        Text = args.Value?.ToString() ?? "";
        if (UpdateOn == FlowUpdateOn.Input) { lastValue = Text; await SetValueAsync(Text); }
    }
    protected async Task HandleChange(ChangeEventArgs args)
    {
        if (Disabled || ReadOnly) return;
        Text = args.Value?.ToString() ?? "";
        if (UpdateOn == FlowUpdateOn.Change) { lastValue = Text; await SetValueAsync(Text); }
    }
    protected Task FocusAsync(FocusEventArgs args) => OnFocus.InvokeAsync(args);
    protected Task BlurAsync(FocusEventArgs args) => OnBlur.InvokeAsync(args);
}
