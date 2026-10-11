using System.ComponentModel.DataAnnotations;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class FormsDemo
{
    private string? productName = "Sample product";
    private string? committed = "Initial value";
    private string? password;
    private string? description = "A short product description.";
    private decimal? price = 12.50m;
    private int quantity = 1;
    private bool acceptUpdates, allSelected, notifications;
    private bool mixed = true;
    private void SetAll(bool value) { allSelected = value; mixed = false; }
    private readonly ProductModel model = new();
    private string submitStatus = "Fill in the form and submit.";
    private Task SubmitAsync() { submitStatus = "Valid sample saved (demo only)."; return Task.CompletedTask; }
    public sealed class ProductModel
    {
        [Required, MinLength(3)] public string? Name { get; set; }
        [Required, Range(typeof(decimal), "0", "1000")] public decimal? Amount { get; set; }
        [Range(typeof(bool), "true", "true", ErrorMessage = "Accept the terms to continue.")]
        public bool AcceptTerms { get; set; }
    }

    private const string Example0 = """
        <FlowVC>
            <FlowInput Label="Product name" @bind-Value="productName" Placeholder="Enter a product name" MaxLength="60" HelperText="Updates as you type." />
            <p role="status">Product: @productName</p>
            <FlowInput Label="Committed on change" @bind-Value="committed" UpdateOn="FlowUpdateOn.Change" HelperText="Leave the field to commit." />
            <p role="status">Committed: @committed</p>
            <FlowInput Label="Read-only reference" Value="SKU-1042" ReadOnly="true" />
            <FlowInput Label="Disabled input" Value="Unavailable" Disabled="true" />
        </FlowVC>
        """;
    private const string Example1 = """
        <FlowPasswordInput Label="Password" @bind-Value="password" AutoComplete="new-password" HelperText="Use the eye button to reveal or hide. The sample never displays your password elsewhere." />
        """;
    private const string Example2 = """
        <FlowTextArea Label="Description" @bind-Value="description" Rows="3" AutoGrow="true" MaxHeight="12rem" MaxLength="240" ShowCharacterCount="true" Resize="FlowResize.Vertical" HelperText="Enter preserves new lines; the field grows with your text." />
        """;
    private const string Example3 = """
        <FlowVC>
            <FlowNumberInput TValue="decimal?" Label="Price" @bind-Value="price" Prefix="$" Min="0" Max="1000" Step="0.25m" DecimalPlaces="2" HelperText="Nullable decimal; typed values are validated without clamping." />
            <p role="status">Price: @(price?.ToString("0.00") ?? "empty")</p>
            <FlowNumberInput TValue="int" Label="Quantity" @bind-Value="quantity" Min="1" Max="20" Step="1" />
            <p role="status">Quantity: @quantity</p>
        </FlowVC>
        """;
    private const string Example4 = """
        <FlowVC>
            <FlowCheckbox Label="Accept updates" @bind-Value="acceptUpdates" HelperText="A native checkbox with a separate mixed-state parameter." />
            <FlowCheckbox Label="Partly selected" Value="allSelected" Indeterminate="mixed" ValueChanged="SetAll" />
            <FlowSwitch Label="Email notifications" @bind-Value="notifications" HelperText="The label stays stable when the value changes." />
            <FlowSwitch Label="Read-only preference" Value="true" ReadOnly="true" />
            <p role="status">Updates: @acceptUpdates · Notifications: @notifications</p>
        </FlowVC>
        """;
    private const string Example5 = """
        <EditForm Model="model" OnValidSubmit="SubmitAsync" FormName="product-editor">
            <DataAnnotationsValidator />
            <FlowVC>
                <FlowInput Label="Validated name" @bind-Value="model.Name" Required="true" HelperText="Required with at least 3 characters." />
                <FlowNumberInput TValue="decimal?" Label="Validated amount" @bind-Value="model.Amount" Required="true" Min="0" Max="1000" />
                <FlowCheckbox Label="Accept terms" @bind-Value="model.AcceptTerms" Required="true" />
                <FlowButton Type="submit">Validate form</FlowButton>
                <p role="status">@submitStatus</p>
            </FlowVC>
        </EditForm>
        """;
    private const string ExampleCode = """
        using System.ComponentModel.DataAnnotations;
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class FormsDemo
        {
            private string? productName = "Sample product";
            private string? committed = "Initial value";
            private string? password;
            private string? description = "A short product description.";
            private decimal? price = 12.50m;
            private int quantity = 1;
            private bool acceptUpdates, allSelected, notifications;
            private bool mixed = true;
            private void SetAll(bool value) { allSelected = value; mixed = false; }
            private readonly ProductModel model = new();
            private string submitStatus = "Fill in the form and submit.";
            private Task SubmitAsync() { submitStatus = "Valid sample saved (demo only)."; return Task.CompletedTask; }
            public sealed class ProductModel
            {
                [Required, MinLength(3)] public string? Name { get; set; }
                [Required, Range(typeof(decimal), "0", "1000")] public decimal? Amount { get; set; }
                [Range(typeof(bool), "true", "true", ErrorMessage = "Accept the terms to continue.")]
                public bool AcceptTerms { get; set; }
            }
        }
        """;
}
