using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Presentation;

public partial class FlowImage : FlowComponentBase
{

    [Parameter, EditorRequired] public string Src { get; set; } = "";
    [Parameter, EditorRequired] public string Alt { get; set; } = "";
    [Parameter] public string? FallbackSrc { get; set; }
    [Parameter] public string Fit { get; set; } = "cover";
    [Parameter] public string Loading { get; set; } = "lazy";
    [Parameter] public EventCallback<EventArgs> OnError { get; set; }
    private string source = "";
    private string? previousSource;
    protected override void OnParametersSet()
    {
        if (previousSource != Src) { previousSource = Src; source = Src; }
    }
    protected override FlowStyleBuilder BuildStyle() => base.BuildStyle().Add("object-fit", Fit);
    private async Task HandleError(EventArgs args)
    {
        if (!string.IsNullOrWhiteSpace(FallbackSrc) && source != FallbackSrc) source = FallbackSrc;
        await OnError.InvokeAsync(args);
    }

}
