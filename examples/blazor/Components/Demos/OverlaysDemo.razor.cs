using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class OverlaysDemo
{
private bool dialogOpen, drawerOpen, popoverOpen, toastOpen;
    private string? projectName;
    private string projectStatus = "No project created yet.";
    private void SaveProject() { projectStatus = $"Created {projectName} (demo only)."; dialogOpen = false; }

    private const string Example0 = """
        <FlowButton OnClick="() => dialogOpen = true">Open dialog</FlowButton>
        <FlowDialog @bind-Open="dialogOpen" Title="Create a project">
            <ChildContent><FlowInput Label="Project name" @bind-Value="projectName" Placeholder="Enter a name" /></ChildContent>
            <Footer><FlowHC Justify="FlowJustify.End"><FlowButton Variant="FlowVariant.Ghost" OnClick="() => dialogOpen = false">Cancel</FlowButton><FlowButton Disabled="string.IsNullOrWhiteSpace(projectName)" OnClick="SaveProject">Create project</FlowButton></FlowHC></Footer>
        </FlowDialog>
        <p role="status">@projectStatus</p>
        """;
    private const string Example1 = """
        <FlowButton Variant="FlowVariant.Outline" OnClick="() => drawerOpen = true">Open drawer</FlowButton>
        <FlowDrawer @bind-Open="drawerOpen" Title="Project details" Side="FlowDrawerSide.End">
            <ChildContent><FlowVC><FlowLabel>Assigned team</FlowLabel><FlowBadge>Platform</FlowBadge><p>A side panel can contain forms or details while retaining the current page.</p></FlowVC></ChildContent>
            <Footer><FlowButton OnClick="() => drawerOpen = false">Done</FlowButton></Footer>
        </FlowDrawer>
        """;
    private const string Example2 = """
        <FlowHC Wrap="true" Align="FlowAlign.Center">
            <FlowPopover Text="Project information" Label="Project information" @bind-Open="popoverOpen"><FlowVC><strong>Platform project</strong><p>The popover closes with Escape or an outside click.</p></FlowVC></FlowPopover>
            <FlowTooltip Text="Available to keyboard and mouse users"><FlowBadge Color="FlowColor.Info">Hover or focus for a hint</FlowBadge></FlowTooltip>
        </FlowHC>
        """;
    private const string Example3 = """
        <FlowButton Color="FlowColor.Success" OnClick="() => toastOpen = true">Show success notification</FlowButton>
        <FlowToast @bind-Open="toastOpen" Title="Saved" Color="FlowColor.Success" Duration="2500"><p>Your sample changes have been saved.</p></FlowToast>
        """;
    private const string ExampleCode = """
        using FlowUI.Blazor.Styling;
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class OverlaysDemo
        {
        private bool dialogOpen, drawerOpen, popoverOpen, toastOpen;
            private string? projectName;
            private string projectStatus = "No project created yet.";
            private void SaveProject() { projectStatus = $"Created {projectName} (demo only)."; dialogOpen = false; }
        }
        """;
}
