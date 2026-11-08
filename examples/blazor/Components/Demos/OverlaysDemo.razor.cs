using FlowUI.Blazor.Overlays;
using Microsoft.AspNetCore.Components;
using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class OverlaysDemo
{
private bool dialogOpen, drawerOpen, popoverOpen, toastOpen;
    private string? projectName;
    private string projectStatus = "No project created yet.";
    private void SaveProject() { projectStatus = $"Created {projectName} (demo only)."; dialogOpen = false; }

    private FlowToastType noticeType;
    private bool acceptOnly;
    private int noticeId;
    private string noticeResult = "";
    private void ShowNotice(FlowToastType type, bool only = false)
    {
        noticeType = type;
        acceptOnly = only;
        noticeResult = "";
        noticeId++;
        toastOpen = true;
    }

    private string NoticeTitle => noticeType switch
    {
        FlowToastType.Success => "Saved successfully",
        FlowToastType.Info => "Update available",
        FlowToastType.Warning => "Check required fields",
        FlowToastType.Error => "Could not save changes",
        _ => acceptOnly ? "Review required" : "Reassign ticket?"
    };
    private string NoticeBody => noticeType switch
    {
        FlowToastType.Success => "Your changes have been saved.",
        FlowToastType.Info => "A new version is ready.",
        FlowToastType.Warning => "Two fields need your attention.",
        FlowToastType.Error => "Ticket #1042 changed while you were editing. Reload it and apply your changes again.",
        _ => acceptOnly ? "Read the handoff notes before continuing." : "Ticket #1042 · Support → Development"
    };
    private static readonly RenderFragment ConflictDetails =
        builder => builder.AddContent(0, "Conflict detected. The ticket changed after this edit was opened.");
    private FlowToastAction AcceptNotice => new(acceptOnly ? "Open handoff notes" : "Reassign", () =>
    {
        noticeResult = acceptOnly ? "Handoff notes opened." : "Ticket reassigned.";
        return Task.CompletedTask;
    });
    private FlowToastAction CancelNotice => new("Cancel", () =>
    {
        noticeResult = "Reassignment cancelled.";
        return Task.CompletedTask;
    });

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
            <FlowTooltip Text="Available to keyboard and mouse users" Location="bottom"><FlowBadge Color="FlowColor.Info">Hover or focus for a hint</FlowBadge></FlowTooltip>
        </FlowHC>
        """;
    private const string Example3 = """
        <FlowToast @bind-Open="toastOpen" Type="FlowToastType.Decision" Title="Reassign ticket?"
                   Accept="@AcceptNotice" Cancel="@CancelNotice">
            <p>Ticket #1042 · Support → Development</p>
        </FlowToast>
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
