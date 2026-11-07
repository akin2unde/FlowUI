using System.Globalization;
using FlowUI.Blazor.Styling;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace FlowUI.Blazor.Forms;

public enum FlowDateTimeMode { Date, Time, DateTime }

public partial class FlowDateTime : FlowComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;
    [Parameter] public FlowDateTimeMode Mode { get; set; } = FlowDateTimeMode.DateTime;
    [Parameter] public string? Value { get; set; }
    [Parameter] public EventCallback<string> ValueChanged { get; set; }
    [Parameter] public string? Min { get; set; }
    [Parameter] public string? Max { get; set; }
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool ShowDayBoundaryButtons { get; set; } = true;

    private static readonly string[] Weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    private static DateOnly Today => DateOnly.FromDateTime(DateTime.Today);
    private ElementReference root;
    private IJSObjectReference? module;
    private DotNetObjectReference<FlowDateTime>? receiver;
    private string? picker;
    private DateOnly month = new(Today.Year, Today.Month, 1);
    private int hour;
    private int minute;

    private DateOnly? DateValue => Mode != FlowDateTimeMode.Time &&
        DateOnly.TryParseExact(Value?.Split('T')[0], "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) ? date : null;
    private TimeOnly? TimeValue => Mode != FlowDateTimeMode.Date &&
        TimeOnly.TryParse(Mode == FlowDateTimeMode.Time ? Value : Value?.Split('T').ElementAtOrDefault(1), CultureInfo.InvariantCulture, DateTimeStyles.None, out var time) ? time : null;

    private string FormatDate(DateOnly date) => Mode == FlowDateTimeMode.Date
        ? date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
        : FormattableString.Invariant($"{date:yyyy-MM-dd}T{(TimeValue ?? TimeOnly.MinValue):HH:mm}");
    private string FormatTime(TimeOnly time) => Mode == FlowDateTimeMode.Time
        ? time.ToString("HH:mm", CultureInfo.InvariantCulture)
        : FormattableString.Invariant($"{(DateValue ?? Today):yyyy-MM-dd}T{time:HH:mm}");
    private bool Allowed(string value) => !Disabled && (Min is null || string.CompareOrdinal(value, Min) >= 0)
        && (Max is null || string.CompareOrdinal(value, Max) <= 0);

    protected override void OnParametersSet()
    {
        if (Disabled || (Mode == FlowDateTimeMode.Date && picker == "time") || (Mode == FlowDateTimeMode.Time && picker == "date")) Close();
    }
    private void Toggle(string next)
    {
        if (picker == next) { Close(); return; }
        if (next == "date")
        {
            var current = DateValue ?? Today;
            month = new(current.Year, current.Month, 1);
        }
        else
        {
            var current = TimeValue ?? TimeOnly.MinValue;
            hour = current.Hour;
            minute = current.Minute;
        }
        picker = next;
    }
    private void MoveMonth(int count) => month = month.AddMonths(count);
    private void Close() => picker = null;
    private void KeyDown(KeyboardEventArgs args) { if (args.Key == "Escape") Close(); }

    private async Task SelectDate(DateOnly date)
    {
        var next = FormatDate(date);
        if (!Allowed(next)) return;
        Close();
        await ValueChanged.InvokeAsync(next);
    }

    private async Task SetTime(TimeOnly time)
    {
        var next = FormatTime(time);
        if (!Allowed(next)) return;
        hour = time.Hour;
        minute = time.Minute;
        await ValueChanged.InvokeAsync(next);
    }
    private async Task ApplyTime()
    {
        await SetTime(new(hour, minute));
        Close();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (picker is null)
        {
            if (module is not null) await module.InvokeVoidAsync("unwatchOutside", root);
            return;
        }
        module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/overlays.js");
        receiver ??= DotNetObjectReference.Create(this);
        await module.InvokeVoidAsync("watchOutside", root, receiver);
    }
    [JSInvokable] public Task CloseFromOutside() => InvokeAsync(() => { Close(); StateHasChanged(); });
    public async ValueTask DisposeAsync()
    {
        try
        {
            if (module is not null)
            {
                await module.InvokeVoidAsync("unwatchOutside", root);
                await module.DisposeAsync();
            }
        }
        catch (JSDisconnectedException) { }
        finally { receiver?.Dispose(); }
    }
}
