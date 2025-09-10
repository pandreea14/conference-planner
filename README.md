# Software Academy 2025 - Conference Planner Web Application

## Web Application Workshop

> _"Websites should look good from the inside and out."– Paul Cookson_

### Welcome

**Welcome to our Web Application Workshop! 👋**

As we all know, the web is a constantly growing universe, interconnecting a high variety of web applications and services. Over the years, web developing technologies have evolved, allowing developers to create new generation web applications and services, bringing major improvements to users's experiences.

Our goal is to show you how technologies like React and ASP.NET can make you fall in love with designing Web Applications.

This is a **Conference Planner** application built as part of the TotalSoft Software Academy 2025 workshop, demonstrating modern web development practices with a full-stack solution.

## Architecture

The application consists of:

- **Backend**: ASP.NET Core Web API with Entity Framework Core
- **BFF (Backend for Frontend)**: ASP.NET Core application acting as a gateway
- **Worker**: Background service for processing commands
- **Frontend**: React + TypeScript application with Material-UI

## Tech Stack

### Backend

- [ASP.NET Core Web API](https://dotnet.microsoft.com/en-us/apps/aspnet/apis) - REST API framework
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) - ORM for database operations
- [SQL Server](https://www.microsoft.com/en-us/sql-server#Overview) - Database
- [MediatR](https://github.com/jbogard/MediatR) - CQRS implementation
- [Serilog](https://serilog.net/) - Structured logging
- [SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) - Real-time communication

### Frontend

- [React](https://react.dev/) - UI framework
- [TypeScript](https://react.dev/learn/typescript) - Type safety
- [Material-UI (MUI)](https://mui.com/material-ui/getting-started/) - UI components
- [SWR](https://swr.vercel.app/) - Data fetching
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Client-side routing

## Prerequisites

To run this application, you need the following tools installed:

### Required

- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) or [JetBrains Rider](https://www.jetbrains.com/rider/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/en/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (Express/Developer/LocalDB)
- [SQL Server Management Studio](https://learn.microsoft.com/en-us/ssms/install/install)
- [Git](https://git-scm.com/download/win)

### Optional

- [Git Extensions](https://github.com/gitextensions/gitextensions/releases) - Git GUI
- [GitHub Desktop](https://desktop.github.com/) - Alternative Git GUI

### Recommended VS Code Extensions

- [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/conference-planner.git
cd conference-planner
```

### 2. Database Setup

1. Create a SQL Server database named `ConferencePlanner`
2. Run the database initialization script (provided separately)
3. Update connection strings in the configuration files

### 3. Backend Configuration

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Update `appsettings.Development.json` files with your database connection strings:

   ```json
   {
     "ConnectionStrings": {
       "App_Database": "Server=(localdb)\\mssqllocaldb;Database=ConferencePlanner;Trusted_Connection=true;",
       "Log_Database": "Server=(localdb)\\mssqllocaldb;Database=ConferencePlanner_Logs;Trusted_Connection=true;"
     }
   }
   ```

3. Restore NuGet packages:

   ```bash
   dotnet restore
   ```

4. Build the solution:
   ```bash
   dotnet build
   ```

### 4. Frontend Configuration

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Copy `.env.example` to `.env.development` and configure:

   ```env
   VITE_APP_IDENTITY_AUTHORITY=https://your-identity-server.com
   VITE_APP_API_URL=http://localhost:5200
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. **Start the Backend Services** (from `backend` directory):

   ```bash
   # Start the API
   cd src/Charisma.Api
   dotnet run

   # Start the BFF (in a new terminal)
   cd src/Charisma.Bff
   dotnet run

   # Start the Worker (in a new terminal)
   cd src/Charisma.Worker
   dotnet run
   ```

2. **Start the Frontend** (from `frontend` directory):

   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5178
   - BFF: http://localhost:5200

### Production Build

1. **Build Backend**:

   ```bash
   cd backend
   dotnet publish -c Release -o ./publish
   ```

2. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

## Docker Support

The application includes Docker support with multi-stage builds:

```bash
# Build and run with Docker Compose (if available)
docker-compose up --build

# Or build individual containers
docker build -t conference-planner-api ./backend/src/Charisma.Api
docker build -t conference-planner-frontend ./frontend
```

## Project Structure

```
conference-planner/
├── backend/
│   ├── src/
│   │   ├── Charisma.Api/          # Web API project
│   │   ├── Charisma.Bff/          # Backend for Frontend
│   │   ├── Charisma.Worker/       # Background worker
│   │   ├── Charisma.Api.Application/     # Application layer
│   │   ├── Charisma.Worker.Application/  # Worker application layer
│   │   ├── Charisma.Common.Domain/       # Domain models
│   │   └── Charisma.Common.Infrastructure/ # Infrastructure
│   └── Charisma.sln
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-specific components
│   │   ├── units/         # Business logic units
│   │   └── utils/         # Utility functions
│   ├── public/
│   └── package.json
└── README.md
```

## Features

- **Conference Management**: Create and manage conferences
- **Session Scheduling**: Schedule and organize conference sessions
- **Speaker Management**: Manage speaker profiles and assignments
- **Attendee Registration**: Handle attendee registration and management
- **Real-time Updates**: Live updates using SignalR
- **Multi-tenancy**: Support for multiple organizations
- **Authentication**: Integrated with OIDC/OAuth2
- **Responsive Design**: Mobile-friendly user interface

## Contributing

This project is part of the TotalSoft Software Academy 2025 workshop. If you're participating in the workshop:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Workshop Resources

This project is based on the TotalSoft Software Academy 2025 curriculum. For detailed learning materials and step-by-step instructions, refer to the workshop documentation.

## License

This project is created for educational purposes as part of the TotalSoft Software Academy 2025.

## Support

If you encounter any issues during the workshop, please:

1. Check the troubleshooting section in the workshop materials
2. Ask your workshop instructor
3. Create an issue in this repository
