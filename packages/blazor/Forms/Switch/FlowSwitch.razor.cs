using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Forms;

public partial class FlowSwitch : FlowFieldBase<bool>
{

    [Parameter] public FlowColor Color { get; set; } = FlowColor.Primary;
    private Task ChangeAsync(ChangeEventArgs args) => SetValueAsync(args.Value is true);
    private string CheckedState => Value.ToString().ToLowerInvariant();

}
