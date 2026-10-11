# Release FlowUI.Blazor 0.3.0

The archive contains the library, runnable Interactive Server gallery, static
reference documentation, NuGet publishing workflow and gallery Dockerfile.
No NuGet package was pushed by the assistant: an account API key is unavailable.
This is a preview; test it in your own applications before your first release.

## 1. Review metadata and build

Review PackageId, Version, Authors, RepositoryUrl and PackageProjectUrl in
`packages/blazor/FlowUI.Blazor.csproj`. Confirm that you can publish the
FlowUI.Blazor package ID on NuGet.org. Choose your intended license and add its
NuGet license metadata; the archive does not invent a license for this library.

```bash
dotnet build FlowUI.Blazor.slnx -c Release
dotnet pack packages/blazor/FlowUI.Blazor.csproj -c Release -o artifacts/blazor
```

The package is `artifacts/blazor/FlowUI.Blazor.0.3.0.nupkg`. Each published
version is immutable; increase Version, rebuild and repack for the next release.
The .NET release is independent of the existing npm packages.

## 2. Publish through GitHub Actions

In the FlowUI GitHub repository, go to Settings → Secrets and variables →
Actions → New repository secret. Name it `NUGET_API_KEY` and paste an API key
created under your NuGet.org account, scoped to pushing FlowUI.Blazor packages.
Do not put the key in source files or send it in chat.

Copy these changes into your existing FlowUI checkout, preserving its .git
folder. Commit and push your changes. Open Actions → Publish FlowUI.Blazor →
Run workflow. The manual workflow builds, packs and uploads the package.
It uses GitHub's masked repository secret; a missing/expired key fails the step.

For a manual local push, set your NUGET_API_KEY securely in your shell, then:

```bash
dotnet nuget push artifacts/blazor/FlowUI.Blazor.0.3.0.nupkg \
  --source https://api.nuget.org/v3/index.json --api-key "$NUGET_API_KEY"
```

Wait for NuGet validation/indexing and check the package page before announcing
installation. A consumer can then run:

```bash
dotnet add package FlowUI.Blazor --version 0.3.0
```

Import the FlowUI namespaces, enable an interactive render mode, and link the
host's generated `.styles.css`. See the package README.

Official guide: https://learn.microsoft.com/en-us/nuget/quickstart/create-and-publish-a-package-using-the-dotnet-cli

## 3. Documentation hosting

Public reference: https://flowui-blazor-docs.tealwolf.chatgpt.site

This is static documentation, with usage code and parameter types for all 30
controls. It does not execute Blazor components or host the gallery backend.
Regenerate static files after changing contracts/examples:

```bash
python3 scripts/build-blazor-docs.py
```

The resulting `docs/blazor` folder can also be deployed to a static host. To use
GitHub Pages, enable Pages with GitHub Actions and run the included manual
Deploy Blazor documentation workflow. It uploads only this static folder.
After NuGet publication, update docs.json's published field and the generator's
release status copy; the documentation currently labels NuGet publication pending.

## 4. Host the interactive gallery

The gallery requires ASP.NET Core hosting and a live server connection. It is
not a static GitHub Pages app. A Dockerfile is supplied:

```bash
docker build -f examples/blazor/Dockerfile -t flowui-blazor-gallery .
docker run -d --name flowui-blazor-gallery --restart unless-stopped \
  -p 127.0.0.1:5180:8080 flowui-blazor-gallery
```

Put an HTTPS reverse proxy in front of port 5180. Nginx location example:

```nginx
location / {
    proxy_pass http://127.0.0.1:5180;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600;
}
```

Use a domain you own and configure its DNS/TLS on the host. The demo does not
store user data or authenticate login attempts. For multiple replicas,
Interactive Server connections require an appropriate affinity/scaling setup.
The Docker image and a real reverse-proxy deployment were not run here;
the sample was validated by building/publishing it and running browser checks.
