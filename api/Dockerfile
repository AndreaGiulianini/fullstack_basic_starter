# =============================================================================
# .NET 10 API Dockerfile
# Multi-stage build for development and production
# =============================================================================

# -----------------------------------------------------------------------------
# Build stage - Restore and build
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy solution and project files
COPY Api.sln .
COPY Api/Api.csproj ./Api/
COPY Api.Core/Api.Core.csproj ./Api.Core/
COPY Api.Infrastructure/Api.Infrastructure.csproj ./Api.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy all source files
COPY . .

# Build the application
RUN dotnet build -c Release --no-restore

# Publish the application
RUN dotnet publish Api/Api.csproj -c Release -o /app/publish --no-build

# -----------------------------------------------------------------------------
# Development stage
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS development

WORKDIR /src

# Install EF Core tools
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy source files
COPY . .

# Restore dependencies
RUN dotnet restore

EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development

# Start with hot reload
CMD ["dotnet", "watch", "run", "--project", "Api/Api.csproj", "--no-launch-profile"]

# -----------------------------------------------------------------------------
# Production stage
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS production

WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Api.dll"]
