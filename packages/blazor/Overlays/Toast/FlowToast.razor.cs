using System.Diagnostics;
using Microsoft.AspNetCore.Components;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Overlays;

public enum FlowToastType { Success, Info, Warning, Error, Decision }
public sealed record FlowToastAction(string Label, Func<Task> OnClick);

public partial class FlowToast : FlowComponentBase, IDisposable
{
    [Parameter] public bool Open { get; set; }
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }
    [Parameter] public string? Title { get; set; }
    [Parameter] public FlowColor Color { get; set; } = FlowColor.Info;
    [Parameter] public FlowToastType? Type { get; set; }
    [Parameter] public int? Duration { get; set; }
    [Parameter] public int? DefaultDuration { get; set; }
    [Parameter] public bool Dismissible { get; set; } = true;
    [Parameter] public RenderFragment? Details { get; set; }
    [Parameter] public FlowToastAction? Accept { get; set; }
    [Parameter] public FlowToastAction? Cancel { get; set; }

    private CancellationTokenSource? timer;
    private double remaining;
    private long started;
    private int generation;
    private (bool Open, FlowToastType Kind, int Lifetime)? previous;
    private bool hovered, focused, expanded, pending;
    private string? actionError;

    private FlowToastType Kind => Type ?? (Color switch
    {
        FlowColor.Success => FlowToastType.Success,
        FlowColor.Warning => FlowToastType.Warning,
        FlowColor.Danger => FlowToastType.Error,
        _ => FlowToastType.Info
    });

    private string Glyph => Kind switch
    {
        FlowToastType.Success => "✓",
        FlowToastType.Warning => "⚠",
        FlowToastType.Error => "×",
        FlowToastType.Decision => "?",
        _ => "ⓘ"
    };

    private int Lifetime => Kind == FlowToastType.Decision ? 0
        : Duration is > 0 ? Duration.Value
        : DefaultDuration is > 0 ? DefaultDuration.Value
        : Kind switch { FlowToastType.Success => 4000, FlowToastType.Warning => 7000, FlowToastType.Error => 8000, _ => 5000 };

    protected override void OnParametersSet()
    {
        var current = (Open, Kind, Lifetime);
        if (previous == current) return;
        previous = current;
        generation++;
        Pause();
        remaining = Lifetime;
        hovered = focused = expanded = pending = false;
        actionError = null;
        UpdateTimer();
    }

    private void SetHover(bool value) { hovered = value; UpdateTimer(); }
    private void SetFocus(bool value) { focused = value; UpdateTimer(); }
    private void ToggleDetails() { expanded = !expanded; UpdateTimer(); }

    private void UpdateTimer()
    {
        if (!Open || Kind == FlowToastType.Decision || hovered || focused || expanded)
        {
            Pause();
            return;
        }
        if (timer is not null) return;
        timer = new();
        started = Stopwatch.GetTimestamp();
        _ = RunTimer(timer.Token);
    }

    private void Pause()
    {
        if (timer is null) return;
        remaining = Math.Max(0, remaining - Stopwatch.GetElapsedTime(started).TotalMilliseconds);
        timer.Cancel();
        timer.Dispose();
        timer = null;
    }

    private async Task RunTimer(CancellationToken token)
    {
        try
        {
            await Task.Delay(TimeSpan.FromMilliseconds(remaining), token);
            await InvokeAsync(async () => { if (!token.IsCancellationRequested) await Dismiss(); });
        }
        catch (OperationCanceledException) { }
    }

    private async Task Choose(FlowToastAction action)
    {
        if (pending) return;
        var current = generation;
        pending = true;
        actionError = null;
        try
        {
            await action.OnClick();
            if (generation == current) await Dismiss();
        }
        catch
        {
            if (generation == current) actionError = "The action could not be completed. Please try again.";
        }
        finally
        {
            if (generation == current) pending = false;
        }
    }

    private async Task Dismiss()
    {
        Pause();
        Open = false;
        previous = (false, Kind, Lifetime);
        await OpenChanged.InvokeAsync(false);
        StateHasChanged();
    }

    public void Dispose() { generation++; Pause(); }
}
