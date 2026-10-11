using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Forms;

public partial class FlowTextArea : FlowTextFieldBase
{

    [Parameter] public int Rows { get; set; } = 4;
    [Parameter] public FlowResize Resize { get; set; } = FlowResize.Vertical;
    [Parameter] public bool AutoGrow { get; set; }
    [Parameter] public string? MaxHeight { get; set; }
    [Parameter] public bool ShowCharacterCount { get; set; }
    private string TextAreaStyle => new FlowStyleBuilder().Add("resize", AutoGrow ? "none" : Resize.ToString().ToLowerInvariant()).Add("max-height", MaxHeight).ToString();
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (AutoGrow)
        {
            var module = await GetModuleAsync();
            await module.InvokeVoidAsync("autoGrow", InputElement, Rows);
        }
    }

}
