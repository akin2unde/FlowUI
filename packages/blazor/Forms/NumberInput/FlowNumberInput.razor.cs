using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using FlowUI.Blazor.Styling;

namespace FlowUI.Blazor.Forms;

public partial class FlowNumberInput<TValue> : FlowFieldBase<TValue>
{

    [Parameter] public decimal? Min { get; set; }
    [Parameter] public decimal? Max { get; set; }
    [Parameter] public decimal Step { get; set; } = 1m;
    [Parameter] public int? DecimalPlaces { get; set; }
    [Parameter] public string? Prefix { get; set; }
    [Parameter] public string? Suffix { get; set; }
    [Parameter] public string? Placeholder { get; set; }
    [Parameter] public bool ShowStepper { get; set; } = true;
    [Parameter] public bool AllowMouseWheel { get; set; }
    [Parameter] public System.Globalization.CultureInfo Culture { get; set; } = System.Globalization.CultureInfo.CurrentCulture;
    private string text = "";
    private TValue lastValue = default!;
    private bool initialized;
    private static Type NumberType => Nullable.GetUnderlyingType(typeof(TValue)) ?? typeof(TValue);
    private static bool IsInteger => NumberType == typeof(int) || NumberType == typeof(long) || NumberType == typeof(short);
    private decimal NumericValue => Value is null ? 0 : Convert.ToDecimal(Value, Culture);
    private bool AtMinimum => Min is { } min && NumericValue <= min;
    private bool AtMaximum => Max is { } max && NumericValue >= max;
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (!IsInteger && NumberType != typeof(decimal) && NumberType != typeof(double) && NumberType != typeof(float))
            throw new InvalidOperationException("FlowNumberInput supports int, long, short, decimal, double, float and nullable equivalents.");
        if (Step <= 0 || Min > Max || DecimalPlaces is < 0 or > 28)
            throw new ArgumentException("Use a positive Step, Min <= Max, and DecimalPlaces from 0 to 28.");
        if (IsInteger && Step != decimal.Truncate(Step)) throw new ArgumentException("Integer fields require a whole-number Step.");
        if (!initialized || !EqualityComparer<TValue>.Default.Equals(lastValue, Value))
        { text = Format(Value); lastValue = Value; initialized = true; }
    }
    private string Format(TValue value) => value is null ? "" : value is IFormattable f ? f.ToString(DecimalPlaces is { } places && !IsInteger ? $"F{places}" : null, Culture) : value.ToString() ?? "";
    private async Task HandleInput(ChangeEventArgs args)
    {
        if (Disabled || ReadOnly) return;
        text = args.Value?.ToString() ?? "";
        if (UpdateOn == FlowUpdateOn.Input && text is not ("-" or "+") && !text.EndsWith(Culture.NumberFormat.NumberDecimalSeparator)) await CommitAsync();
    }
    private async Task HandleChange(ChangeEventArgs args)
    {
        if (Disabled || ReadOnly) return;
        text = args.Value?.ToString() ?? "";
        await CommitAsync();
    }
    private async Task<bool> CommitAsync()
    {
        if (string.IsNullOrWhiteSpace(text) && (!typeof(TValue).IsValueType || Nullable.GetUnderlyingType(typeof(TValue)) is not null))
        { lastValue = default!; await SetValueAsync(default!); return true; }
        if (!BindConverter.TryConvertTo<TValue>(text, Culture, out var value) || value is null)
        { SetParsingError($"Enter a valid number for {Label ?? "this field"}."); return false; }
        decimal number;
        try { number = Convert.ToDecimal(value, Culture); }
        catch (Exception e) when (e is OverflowException or FormatException)
        { SetParsingError("This number is outside the supported range."); return false; }
        if (Min is { } min && number < min || Max is { } max && number > max)
        { SetParsingError($"Enter a number{(Min is null ? "" : $" at least {Min}")}{(Max is null ? "" : $" no greater than {Max}")}."); return false; }
        lastValue = value; await SetValueAsync(value); return true;
    }
    private async Task BlurAsync(FocusEventArgs args)
    {
        if (!Disabled && !ReadOnly && await CommitAsync()) text = Format(Value);
        await OnBlur.InvokeAsync(args);
    }
    private async Task StepAsync(int direction)
    {
        if (Disabled || ReadOnly) return;
        decimal next;
        try { next = checked(NumericValue + direction * Step); }
        catch (OverflowException) { SetParsingError("This number is outside the supported range."); return; }
        if (Min is { } min) next = Math.Max(min, next);
        if (Max is { } max) next = Math.Min(max, next);
        text = next.ToString(Culture);
        if (await CommitAsync()) text = Format(Value);
    }
    private Task WheelAsync(WheelEventArgs args) => AllowMouseWheel ? StepAsync(args.DeltaY < 0 ? 1 : -1) : Task.CompletedTask;

}
