# Validation for FlowUI 1.0.2

- Core, React, Angular and React Native packages build successfully.
- All JavaScript adapter type checks pass.
- React and Angular production examples build; React Native example type-checks.
- Core: 26 tests passed. React: 19 tests passed. React Native: 5 tests passed. Angular: 4 tests passed. Packaging: 4 tests passed.
- npm tarball entry-point checks pass for core, React, Angular and React Native, including the generated Angular distribution.
- Formatting checks pass.
- Blazor source, examples, scoped styles and generated documentation are updated. The .NET SDK is unavailable in this environment, so the Blazor build has not been verified here. Run `dotnet build FlowUI.Blazor.slnx` with .NET 10 before release.
- Packages have not been published.

See `docs/CONTROL-CUSTOMIZATION.md` for usage and platform-specific behaviour.
