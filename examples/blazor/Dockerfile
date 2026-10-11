FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY packages/blazor/FlowUI.Blazor.csproj packages/blazor/
COPY examples/blazor/FlowUI.Blazor.Sample.csproj examples/blazor/
RUN dotnet restore examples/blazor/FlowUI.Blazor.Sample.csproj
COPY packages/blazor/ packages/blazor/
COPY examples/blazor/ examples/blazor/
RUN dotnet publish examples/blazor/FlowUI.Blazor.Sample.csproj -c Release --no-restore -o /app/publish
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
COPY --from=build /app/publish .
USER $APP_UID
ENTRYPOINT ["dotnet", "FlowUI.Blazor.Sample.dll"]
