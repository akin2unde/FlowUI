using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Overlays;

public partial class FlowToast : FlowComponentBase, IDisposable
{
    [Parameter] public bool Open { get; set; }
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }
    [Parameter] public string? Title { get; set; }
    [Parameter] public FlowColor Color { get; set; } = FlowColor.Info;
    [Parameter] public int Duration { get; set; } = 5000;
    private CancellationTokenSource? timer;
    private bool wasOpen, disposed;
    protected override void OnParametersSet() { if (Duration < 0) throw new ArgumentException("Duration must be nonnegative; zero stays open."); if (Open != wasOpen) { wasOpen = Open; if (Open) Resume(); else Pause(); } }
    private void Pause() { timer?.Cancel(); timer?.Dispose(); timer = null; }
    private void Resume() { Pause(); if (Open && Duration > 0) { timer = new(); _ = RunTimer(timer.Token); } }
    private async Task RunTimer(CancellationToken token) { try { await Task.Delay(Duration, token); if (!disposed) await InvokeAsync(Dismiss); } catch (OperationCanceledException) { } }
    private async Task Dismiss() { Pause(); Open = false; wasOpen = false; await OpenChanged.InvokeAsync(false); }
    public void Dispose() { disposed = true; Pause(); }
}
