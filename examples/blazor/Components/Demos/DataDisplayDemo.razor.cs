using FlowUI.Blazor.Styling;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class DataDisplayDemo
{
private readonly FlowAccordionItem[] questions = [new("installation", "How do I install FlowUI?"), new("themes", "Can I customize themes?")];
    private IReadOnlyList<string> openQuestions = ["installation"];
    public sealed record Product(int Id, string Name, decimal Price, int Stock);
    private readonly Product[] products = [new(1, "Notebook", 12.50m, 40), new(2, "Desk lamp", 35m, 18), new(3, "Pen set", 6m, 120), new(4, "Monitor", 220m, 10), new(5, "Keyboard", 65m, 24), new(6, "Mouse", 25m, 42), new(7, "Cable", 8m, 70)];
    private readonly FlowTableColumn<Product>[] columns = [new() { Title = "Product", Value = p => p.Name }, new() { Title = "Price", Value = p => p.Price }, new() { Title = "Stock", Value = p => p.Stock }];
    private int tablePage = 1;
    public sealed record Node(string Id, string Name, Node[] Children);
    private readonly Node[] nodes = [new("catalog", "Catalog", [new("products", "Products", [new("office", "Office", []), new("electronics", "Electronics", [])]), new("categories", "Categories", [])]), new("settings", "Settings", [new("users", "Users", []), new("roles", "Roles", [])])];
    private string? selectedNode;
    private IReadOnlyList<string> expanded = ["catalog"];

    private const string Example0 = """
        <FlowAccordion Items="questions" @bind-OpenKeys="openQuestions">
            <Content Context="key">@(key == "installation" ? "Install the package and import the FlowUI namespaces in _Imports.razor." : "Choose Light, Dark, or System and supply your own palette when needed.")</Content>
        </FlowAccordion>
        """;
    private const string Example1 = """
        <FlowTable Items="products" Columns="columns" RowKey="p => p.Id" Caption="Product inventory" PageSize="3" @bind-Page="tablePage" />
        """;
    private const string Example2 = """
        <FlowTree Items="nodes" ValueSelector="n => n.Id" TextSelector="n => n.Name" ChildrenSelector="n => n.Children"
                  @bind-Value="selectedNode" @bind-ExpandedValues="expanded" Label="Project folders" />
        <p role="status">Selected node: @(selectedNode ?? "none")</p>
        """;
    private const string ExampleCode = """
        using FlowUI.Blazor.Styling;
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class DataDisplayDemo
        {
        private readonly FlowAccordionItem[] questions = [new("installation", "How do I install FlowUI?"), new("themes", "Can I customize themes?")];
            private IReadOnlyList<string> openQuestions = ["installation"];
            public sealed record Product(int Id, string Name, decimal Price, int Stock);
            private readonly Product[] products = [new(1, "Notebook", 12.50m, 40), new(2, "Desk lamp", 35m, 18), new(3, "Pen set", 6m, 120), new(4, "Monitor", 220m, 10), new(5, "Keyboard", 65m, 24), new(6, "Mouse", 25m, 42), new(7, "Cable", 8m, 70)];
            private readonly FlowTableColumn<Product>[] columns = [new() { Title = "Product", Value = p => p.Name }, new() { Title = "Price", Value = p => p.Price }, new() { Title = "Stock", Value = p => p.Stock }];
            private int tablePage = 1;
            public sealed record Node(string Id, string Name, Node[] Children);
            private readonly Node[] nodes = [new("catalog", "Catalog", [new("products", "Products", [new("office", "Office", []), new("electronics", "Electronics", [])]), new("categories", "Categories", [])]), new("settings", "Settings", [new("users", "Users", []), new("roles", "Roles", [])])];
            private string? selectedNode;
            private IReadOnlyList<string> expanded = ["catalog"];
        }
        """;
}
