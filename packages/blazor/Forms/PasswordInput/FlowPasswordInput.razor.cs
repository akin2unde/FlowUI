using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Forms;

public partial class FlowPasswordInput : FlowTextFieldBase
{

    [Parameter] public bool AllowReveal { get; set; } = true;
    [Parameter] public string ShowLabel { get; set; } = "Show password";
    [Parameter] public string HideLabel { get; set; } = "Hide password";
    private bool revealed;
    private async Task ToggleAsync()
    {
        if (Disabled || !AllowReveal) return;
        revealed = !revealed;
        var module = await GetModuleAsync();
        await module.InvokeVoidAsync("revealPassword", InputElement, revealed);
    }

}
