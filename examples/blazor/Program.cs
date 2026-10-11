using FlowUI.Blazor.Sample.Components;

var builder = WebApplication.CreateBuilder(args);
// The host selects the render mode. FlowUI components do not force one.
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
var app = builder.Build();
if (!app.Environment.IsDevelopment()) app.UseExceptionHandler("/error", createScopeForErrors: true);
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
app.Run();
