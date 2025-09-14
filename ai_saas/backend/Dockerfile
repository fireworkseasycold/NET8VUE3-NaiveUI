# ai_saas 后端 Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ai-saas-backend.csproj", "."]
RUN dotnet restore "./ai-saas-backend.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ai-saas-backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ai-saas-backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ai-saas-backend.dll"]