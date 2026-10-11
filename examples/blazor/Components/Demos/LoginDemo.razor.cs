using System.ComponentModel.DataAnnotations;
namespace FlowUI.Blazor.Sample.Components.Demos;
public partial class LoginDemo
{
    private readonly LoginModel login = new();
    private bool signingIn;
    private string? loginStatus;
    private async Task SignInAsync()
    {
        if (signingIn) return;
        signingIn = true;
        loginStatus = null;
        try
        {
            // Replace this delay with your application's authentication service.
            await Task.Delay(700);
            loginStatus = $"Sample sign-in complete. Remember me: {(login.RememberMe ? "on" : "off")}. No authentication request was sent.";
        }
        finally { signingIn = false; login.Password = null; }
    }
    public sealed class LoginModel
    {
        [Required, EmailAddress] public string? Email { get; set; }
        [Required, MinLength(8)] public string? Password { get; set; }
        public bool RememberMe { get; set; }
    }

    private const string LoginMarkup = """
        <div class="login-stage">
            <div class="login-card">
                <div class="login-brand" aria-hidden="true">F</div>
                <p class="login-eyebrow">FLOWUI / ACCOUNT ACCESS</p>
                <h2>Welcome back</h2>
                <p class="login-subtitle">Sign in to your workspace.</p>
                <EditForm Model="login" OnValidSubmit="SignInAsync" FormName="sample-login">
                    <DataAnnotationsValidator />
                    <FlowVC Gap="1.25rem">
                        <FlowInput Label="Email address" @bind-Value="login.Email"
                                   Placeholder="you@example.com" AutoComplete="username"
                                   inputmode="email" Required="true" Disabled="signingIn" />
                        <FlowPasswordInput Label="Password" @bind-Value="login.Password"
                                           Placeholder="Enter your password" AutoComplete="current-password"
                                           Required="true" Disabled="signingIn" />
                        <FlowCheckbox Label="Remember me" @bind-Value="login.RememberMe" Disabled="signingIn" />
                        <FlowButton Type="submit" Width="100%" Loading="signingIn" LoadingText="Signing in…">Sign in</FlowButton>
                        @if (!string.IsNullOrEmpty(loginStatus)) { <p class="login-status" role="status">@loginStatus</p> }
                    </FlowVC>
                </EditForm>
                <p class="login-note">Sample form · Use any valid email and a password of at least 8 characters.</p>
            </div>
        </div>
        """;

    private const string LoginCode = """
        using System.ComponentModel.DataAnnotations;
        namespace FlowUI.Blazor.Sample.Components.Demos;
        public partial class LoginDemo
        {
            private readonly LoginModel login = new();
            private bool signingIn;
            private string? loginStatus;
            private async Task SignInAsync()
            {
                if (signingIn) return;
                signingIn = true;
                loginStatus = null;
                try
                {
                    // Replace this delay with your application's authentication service.
                    await Task.Delay(700);
                    loginStatus = $"Sample sign-in complete. Remember me: {(login.RememberMe ? "on" : "off")}. No authentication request was sent.";
                }
                finally { signingIn = false; login.Password = null; }
            }
            public sealed class LoginModel
            {
                [Required, EmailAddress] public string? Email { get; set; }
                [Required, MinLength(8)] public string? Password { get; set; }
                public bool RememberMe { get; set; }
            }
        }
        """;
}
