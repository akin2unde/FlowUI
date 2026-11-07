using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class NavigationDemo
{
private readonly FlowBreadcrumbItem[] breadcrumbs = [new("Home", "/"), new("Projects", "/"), new("Platform")];
    private readonly FlowTabItem[] tabs = [new("overview", "Overview"), new("activity", "Activity"), new("settings", "Settings", true)];
    private string activeTab = "overview";
    private int page = 1;
    private bool showReport;
    private IReadOnlyList<FlowTabItem> Tabs => showReport ? [.. tabs, new("report", "Report")] : tabs;
    private void ToggleReport()
    {
        showReport = !showReport;
        activeTab = showReport ? "report" : "overview";
    }

    private const string Example0 = """
        <FlowBreadcrumbs Items="breadcrumbs" Separator="/" />
        """;
    private const string Example1 = """
        <FlowButton OnClick="ToggleReport">@(showReport ? "Remove report tab" : "Add report tab")</FlowButton>
        <FlowTabs Items="Tabs" @bind-ActiveKey="activeTab" Label="Project sections">
            <IconTemplate Context="item">@if (item.Key == "report") { <span aria-hidden="true">▤</span> }</IconTemplate>
            <Content Context="key">@if (key == "overview") { <p>Project overview content.</p> } else { <p>@key content.</p> }</Content>
        </FlowTabs>
        """;
    private const string Example2 = """
        <FlowPagination @bind-Page="page" PageCount="12" MaxVisiblePages="5" />
        <p role="status">Selected page: @(page)</p>
        """;
    private const string ExampleCode = """
        using FlowUI.Blazor.Styling;
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class NavigationDemo
        {
        private readonly FlowBreadcrumbItem[] breadcrumbs = [new("Home", "/"), new("Projects", "/"), new("Platform")];
            private readonly FlowTabItem[] tabs = [new("overview", "Overview"), new("activity", "Activity"), new("settings", "Settings", true)];
            private string activeTab = "overview";
            private int page = 1;
            private bool showReport;
            private IReadOnlyList<FlowTabItem> Tabs => showReport ? [.. tabs, new("report", "Report")] : tabs;
            private void ToggleReport()
            {
                showReport = !showReport;
                activeTab = showReport ? "report" : "overview";
            }
        }
        """;
}
