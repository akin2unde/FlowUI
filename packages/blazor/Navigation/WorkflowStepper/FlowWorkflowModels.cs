namespace FlowUI.Blazor.Navigation;

public sealed record FlowTextStyle(string? Color = null, string? FontFamily = null, string? FontSize = null,
    string? FontWeight = null, string? LineHeight = null, string? TextAlign = null);
public sealed record FlowIconStyle(string? Color = null, string? Size = null);
public sealed record FlowAction(string Label, string? Icon = null, bool IsReadonly = false,
    FlowTextStyle? TextStyle = null, FlowIconStyle? IconStyle = null);
public sealed record FlowStage(string Id, string Label, bool IsCurrent = false, bool IsCompleted = false,
    bool IsDisabled = false, IReadOnlyList<FlowAction>? Actions = null, FlowAction? SelectedAction = null,
    FlowTextStyle? TextStyle = null);
public sealed record FlowStageStyle(string? BackgroundColor = null, string? Icon = null,
    FlowIconStyle? IconStyle = null, FlowTextStyle? TextStyle = null);
public sealed record FlowActionMenuStyle(string? BackgroundColor = null, string? BorderColor = null,
    string? BorderRadius = null, string? BoxShadow = null);
public sealed record FlowActionItemStyle(string? BackgroundColor = null, FlowTextStyle? TextStyle = null,
    FlowIconStyle? IconStyle = null, FlowActionItemStyle? Hover = null, FlowActionItemStyle? Selected = null,
    FlowActionItemStyle? Readonly = null);
public sealed record FlowActionChange(FlowStage Stage, FlowAction Action);
