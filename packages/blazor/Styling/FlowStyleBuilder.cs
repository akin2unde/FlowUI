using System.Text;

namespace FlowUI.Blazor.Styling;

/// <summary>Builds CSS declarations without repeated string-concatenation code in components.</summary>
public sealed class FlowStyleBuilder
{
    private readonly StringBuilder _style = new();
    public FlowStyleBuilder Add(string property, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value)) _style.Append(property).Append(':').Append(value).Append(';');
        return this;
    }
    public FlowStyleBuilder Append(string? declarations)
    {
        if (!string.IsNullOrWhiteSpace(declarations)) _style.Append(declarations.Trim().TrimEnd(';')).Append(';');
        return this;
    }
    public override string ToString() => _style.ToString();

    public static string Align(FlowAlign value) => value switch
    {
        FlowAlign.Start => "flex-start", FlowAlign.End => "flex-end",
        FlowAlign.Center => "center", FlowAlign.Baseline => "baseline", _ => "stretch"
    };
    public static string Justify(FlowJustify value) => value switch
    {
        FlowJustify.Center => "center", FlowJustify.End => "flex-end",
        FlowJustify.SpaceBetween => "space-between", FlowJustify.SpaceAround => "space-around",
        FlowJustify.SpaceEvenly => "space-evenly", _ => "flex-start"
    };
}
