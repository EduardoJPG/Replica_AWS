FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY InventarioAPI/InventarioAPI.csproj InventarioAPI/
RUN dotnet restore InventarioAPI/InventarioAPI.csproj
COPY InventarioAPI/ InventarioAPI/
WORKDIR /src/InventarioAPI
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "InventarioAPI.dll"]
