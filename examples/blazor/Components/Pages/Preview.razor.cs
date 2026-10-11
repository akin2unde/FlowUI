namespace FlowUI.Blazor.Sample.Components.Pages;
public partial class Preview
{
    private sealed record Option(string Id, string Name);
    private readonly Option[] departments = [new("engineering", "Engineering"), new("finance", "Finance"), new("operations", "Operations")];
    private readonly Option[] teams = [new("platform", "Platform"), new("design", "Design"), new("quality", "Quality"), new("support", "Support")];
    private string department = "engineering";
    private IReadOnlyList<string> selectedTeams = ["platform", "design", "quality"];
}
