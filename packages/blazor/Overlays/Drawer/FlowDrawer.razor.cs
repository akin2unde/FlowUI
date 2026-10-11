using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Overlays;
public partial class FlowDrawer : FlowModalBase { [Parameter] public FlowDrawerSide Side { get; set; } = FlowDrawerSide.End; }
