# tools_platform 后端 Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["tools-platform-backend.csproj", "."]
RUN dotnet restore "./tools-platform-backend.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "tools-platform-backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "tools-platform-backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "tools-platform-backend.dll"]