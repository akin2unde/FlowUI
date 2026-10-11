using System.Linq.Expressions;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;

namespace FlowUI.Blazor.Styling;

/// <summary>Optional EditForm integration with fully awaited value callbacks, including standalone fields.</summary>
public abstract class FlowFieldBase<TValue> : FlowComponentBase, IDisposable, IAsyncDisposable
{
    [CascadingParameter] protected EditContext? FormContext { get; set; }
    [Inject] protected IJSRuntime JS { get; set; } = default!;
    [Parameter] public TValue Value { get; set; } = default!;
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }
    [Parameter] public Expression<Func<TValue>>? ValueExpression { get; set; }
    [Parameter] public string? Label { get; set; }
    [Parameter] public string? HelperText { get; set; }
    [Parameter] public bool Required { get; set; }
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool ReadOnly { get; set; }
    [Parameter] public FlowSize Size { get; set; } = FlowSize.Md;
    [Parameter] public FlowUpdateOn UpdateOn { get; set; } = FlowUpdateOn.Input;
    [Parameter] public EventCallback<Microsoft.AspNetCore.Components.Web.FocusEventArgs> OnFocus { get; set; }
    [Parameter] public EventCallback<Microsoft.AspNetCore.Components.Web.FocusEventArgs> OnBlur { get; set; }
    protected readonly string GeneratedId = "fui-" + Guid.NewGuid().ToString("N");
    protected string InputId => Id ?? GeneratedId;
    protected string HelpId => InputId + "-help";
    protected string? DescriptionId => string.IsNullOrEmpty(Message) ? null : HelpId;
    protected string FieldClasses => Classes("fui-field" + (HasErrors ? " fui-invalid" : ""));
    protected string Invalid => HasErrors.ToString().ToLowerInvariant();
    protected ElementReference InputElement;
    protected IJSObjectReference? Module;
    private EditContext? subscribedContext;
    private FieldIdentifier? boundField;
    private ValidationMessageStore? parsingMessages;
    private string? localError;
    private bool disposed;
    protected string? Error => localError ?? (boundField is { } id && FormContext is not null ? FormContext.GetValidationMessages(id).FirstOrDefault() : null);
    protected bool HasErrors => !string.IsNullOrWhiteSpace(Error);
    protected string? Message => Error ?? HelperText;

    protected override void OnParametersSet()
    {
        if (FormContext is not null && ValueExpression is null)
            throw new InvalidOperationException($"{GetType().Name} requires @bind-Value (or ValueExpression) inside EditForm.");
        var nextField = ValueExpression is null ? (FieldIdentifier?)null : FieldIdentifier.Create(ValueExpression);
        if (subscribedContext != FormContext || !Nullable.Equals(boundField, nextField))
        {
            if (subscribedContext is not null) subscribedContext.OnValidationStateChanged -= ValidationChanged;
            parsingMessages?.Clear();
            subscribedContext = FormContext; boundField = nextField;
            parsingMessages = FormContext is null ? null : new ValidationMessageStore(FormContext);
            if (subscribedContext is not null) subscribedContext.OnValidationStateChanged += ValidationChanged;
        }
    }
    protected async Task SetValueAsync(TValue next)
    {
        if (Disabled || ReadOnly) return;
        ClearParsingError();
        Value = next;
        await ValueChanged.InvokeAsync(next);
        if (boundField is { } id) FormContext?.NotifyFieldChanged(id);
    }
    protected void SetParsingError(string message)
    {
        localError = message;
        if (parsingMessages is not null && boundField is { } id)
        {
            parsingMessages.Clear(id); parsingMessages.Add(id, message);
            FormContext!.NotifyValidationStateChanged();
        }
    }
    protected void ClearParsingError()
    {
        localError = null;
        if (parsingMessages is not null && boundField is { } id)
        {
            parsingMessages.Clear(id); FormContext!.NotifyValidationStateChanged();
        }
    }
    private void ValidationChanged(object? sender, ValidationStateChangedEventArgs args)
    {
        if (!disposed) _ = InvokeAsync(StateHasChanged);
    }
    protected async Task<IJSObjectReference> GetModuleAsync() => Module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./_content/FlowUI.Blazor/flowui.js");
    public virtual void Dispose()
    {
        if (disposed) return;
        disposed = true;
        if (subscribedContext is not null) subscribedContext.OnValidationStateChanged -= ValidationChanged;
        parsingMessages?.Clear();
        if (parsingMessages is not null) subscribedContext?.NotifyValidationStateChanged();
    }
    public virtual async ValueTask DisposeAsync()
    {
        Dispose();
        if (Module is not null)
        {
            try { await Module.DisposeAsync(); } catch (JSDisconnectedException) { } catch (OperationCanceledException) { }
        }
    }
}
