namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class SelectionDemo
{
    public sealed record Option(string Id, string Name, bool Disabled = false);
    private readonly Option[] departments = [new("engineering", "Engineering"), new("finance", "Finance"), new("operations", "Operations"), new("archived", "Archived", true)];
    private readonly Option[] teams = [new("platform", "Platform"), new("design", "Design"), new("quality", "Quality"), new("support", "Support"), new("sales", "Sales"), new("archived", "Archived", true)];
    private readonly Option[] deliveries = [new("standard", "Standard"), new("express", "Express"), new("unavailable", "Unavailable", true)];
    private string? department;
    private string delivery = "standard";
    private IReadOnlyList<string> selectedTeams = ["platform"];
    private readonly IReadOnlyList<string> lockedTeams = ["design", "removed"];

    private const string Example0 = """
        <FlowVC>
            <FlowDropdown Label="Department" Items="departments" ValueSelector="i => i.Id" TextSelector="i => i.Name" DisabledSelector="i => i.Disabled" @bind-Value="department" Searchable="true" Clearable="true" Placeholder="Choose a department" HelperText="Arrow keys navigate; Enter selects; Escape closes." />
            <p role="status">Department: @(department ?? "none")</p>
            <FlowDropdown Label="Loading departments" Items="Array.Empty<Option>()" ValueSelector="i => i.Id" TextSelector="i => i.Name" Loading="true" Placeholder="Open to see loading feedback" />
            <FlowDropdown Label="Missing selection" Items="departments" ValueSelector="i => i.Id" TextSelector="i => i.Name" Value='@("removed")' ReadOnly="true" HelperText="A missing value is preserved rather than selecting the first option." />
        </FlowVC>
        """;
    private const string Example1 = """
        <FlowVC>
            <FlowMultiSelect Label="Teams" Items="teams" ValueSelector="i => i.Id" TextSelector="i => i.Name" DisabledSelector="i => i.Disabled" @bind-Values="selectedTeams" Searchable="true" Clearable="true" ShowSelectAll="true" MaxSelections="4" MaxVisibleTags="2" HelperText="Select up to four. Bulk selection applies to enabled filtered options." />
            <p role="status">Team IDs: @string.Join(", ", selectedTeams)</p>
            <FlowMultiSelect Label="Read-only teams" Items="teams" ValueSelector="i => i.Id" TextSelector="i => i.Name" Values="lockedTeams" ReadOnly="true" />
        </FlowVC>
        """;
    private const string Example2 = """
        <FlowVC>
            <FlowRadioGroup Label="Delivery" Items="deliveries" ValueSelector="i => i.Id" TextSelector="i => i.Name" DisabledSelector="i => i.Disabled" @bind-Value="delivery" Orientation="FlowOrientation.Horizontal" HelperText="Native radios share a unique group name." />
            <FlowRadioGroup Label="Read-only delivery" Items="deliveries" ValueSelector="i => i.Id" TextSelector="i => i.Name" Value='@("standard")' ReadOnly="true" />
            <p role="status">Delivery: @delivery</p>
        </FlowVC>
        """;
    private const string ExampleCode = """
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class SelectionDemo
        {
            public sealed record Option(string Id, string Name, bool Disabled = false);
            private readonly Option[] departments = [new("engineering", "Engineering"), new("finance", "Finance"), new("operations", "Operations"), new("archived", "Archived", true)];
            private readonly Option[] teams = [new("platform", "Platform"), new("design", "Design"), new("quality", "Quality"), new("support", "Support"), new("sales", "Sales"), new("archived", "Archived", true)];
            private readonly Option[] deliveries = [new("standard", "Standard"), new("express", "Express"), new("unavailable", "Unavailable", true)];
            private string? department;
            private string delivery = "standard";
            private IReadOnlyList<string> selectedTeams = ["platform"];
            private readonly IReadOnlyList<string> lockedTeams = ["design", "removed"];
        }
        """;
}
