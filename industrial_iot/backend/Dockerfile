# industrial_iot 后端 Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["industrial-iot-backend.csproj", "."]
RUN dotnet restore "./industrial-iot-backend.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "industrial-iot-backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "industrial-iot-backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "industrial-iot-backend.dll"]