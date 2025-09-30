# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /workspace
COPY ["dependencies.props", "."]
COPY ["Directory.Build.props", "."]
COPY ["NuGet.config", "."]
COPY ["src/Charisma.Worker/Charisma.Worker.csproj", "src/Charisma.Worker/"]
COPY ["src/Charisma.Common.Domain/Charisma.Common.Domain.csproj", "src/Charisma.Common.Domain/"]
COPY ["src/Charisma.Worker.Application/Charisma.Worker.Application.csproj", "src/Charisma.Worker.Application/"]
RUN dotnet restore "./src/Charisma.Worker/Charisma.Worker.csproj"
COPY . .
WORKDIR "/workspace/src/Charisma.Worker"
RUN dotnet build "./Charisma.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Charisma.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ARG imageUser=tsuser
ARG imageUserGroup=tsgroup
ARG imageUserId=1375
ARG imageUserGroupId=1375

RUN addgroup --system --gid $imageUserGroupId $imageUserGroup && \     
    adduser --system --uid $imageUserId --ingroup $imageUserGroup $imageUser

USER $imageUser
COPY --chown=$imageUser:$imageUserGroup --from=publish /app .

ARG APP_VERSION=0.0.0.0
ENV APP_VERSION=${APP_VERSION}

ARG APP_DATE=1900-01-01
ENV APP_DATE=${APP_DATE}

ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "Charisma.Worker.dll"]