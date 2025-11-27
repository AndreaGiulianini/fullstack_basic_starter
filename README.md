# **Modern Full Stack Architecture Starter**

A comprehensive, production-ready full-stack starter template designed for modern web development. This project serves as an excellent learning resource and starting point for developers working with cutting-edge technologies.

## **Technology Stack**

### **Frontend**
- **[Angular 21](https://angular.dev/)** - The modern web development platform
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Angular Signals](https://angular.dev/guide/signals)** - Fine-grained reactivity for state management
- **[Standalone Components](https://angular.dev/guide/components)** - Simplified component architecture without NgModules
- **[Zoneless Change Detection](https://angular.dev/guide/experimental/zoneless)** - Improved performance (default in v21)
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework

### **Backend**
- **[ASP.NET Core 10](https://dotnet.microsoft.com/apps/aspnet)** - High-performance, cross-platform web framework
- **[Entity Framework Core 10](https://docs.microsoft.com/ef/core/)** - Modern object-database mapper
- **[ASP.NET Core Identity](https://docs.microsoft.com/aspnet/core/security/authentication/identity)** - Membership system with JWT authentication
- **[Serilog](https://serilog.net/)** - Structured logging with Elasticsearch sink
- **[Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)** - Swagger/OpenAPI documentation
- **[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)** - Separation of concerns with layered design

### **Infrastructure & DevOps**
- **[Docker](https://www.docker.com/)** - Containerization platform with multi-stage builds
- **[Traefik 3.6](https://doc.traefik.io/traefik/)** - Modern reverse proxy and load balancer
- **[PostgreSQL 18](https://www.postgresql.org/)** - Robust relational database
- **[Valkey 9](https://valkey.dev/)** - High-performance in-memory data store (Redis-compatible)
- **[Elasticsearch 9.2](https://www.elastic.co/elasticsearch/)** - Search and analytics engine
- **[Kibana 9.2](https://www.elastic.co/kibana/)** - Data visualization and monitoring

### **Code Quality & Development**
- **[Hot Reload](https://docs.microsoft.com/dotnet/core/tools/dotnet-watch)** - Fast development with `dotnet watch` and Angular dev server
- **Multi-stage Docker builds** - Optimized container images for dev and production
- **Health checks** - Service dependency management with Docker Compose

---

## **Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Git

> **Note:** No local SDK installation required! Everything runs inside Docker containers.

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd fullstack_basic_starter
```

### **2. Environment Configuration**
```bash
# Copy environment template
cp .env.placeholder .env

# Edit environment variables
nano .env
```

### **3. Start the Application**

The `start.sh` script provides a convenient way to start the application with various options:

```bash
# Start in development mode (default)
./start.sh

# Start in production mode
./start.sh -e production

# Start in development with watch mode (auto-reload on changes)
./start.sh -w

# Clean build (removes existing containers and images)
./start.sh -c

# Combine options
./start.sh -e production -c

# Show all available options
./start.sh -h
```

**Available Options:**
- `-e, --env` - Set environment (development|production) [default: development]
- `-w, --watch` - Enable watch mode for automatic reload during development
- `-c, --clean` - Clean build (removes existing containers and images before starting)
- `-h, --help` - Display help message with all options

**Manual Docker Compose:**
```bash
# Development environment
docker compose -f compose.yaml -f compose_override/development.yaml up --build

# Production environment
docker compose -f compose.yaml -f compose_override/production.yaml up --build -d
```

### **4. Database Migrations**

The `populate.sh` script manages Entity Framework Core migrations:

```bash
# Apply pending migrations
./populate.sh

# Create a new migration
./populate.sh -c AddNewFeature

# Apply migrations in production
./populate.sh -e production

# Show help
./populate.sh -h
```

**Manual EF Core commands (inside container):**
```bash
# Create migration
docker compose -f compose.yaml -f compose_override/development.yaml exec -T api \
  dotnet ef migrations add MigrationName --project Api.Infrastructure --startup-project Api

# Apply migrations
docker compose -f compose.yaml -f compose_override/development.yaml exec -T api \
  dotnet ef database update --project Api.Infrastructure --startup-project Api
```

---

## **Available Services**

Once the application is running, you can access the following services:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost](http://localhost) | Angular 21 application |
| **API** | [http://localhost/api](http://localhost/api) | ASP.NET Core REST API |
| **Swagger UI** | [http://localhost/swagger](http://localhost/swagger) | Interactive API documentation |
| **Health Check** | [http://localhost/api/healthcheck/ping](http://localhost/api/healthcheck/ping) | API health status |
| **Traefik Dashboard** | [http://localhost:8080](http://localhost:8080) | Reverse proxy management |
| **Elasticsearch** | [http://localhost:9200](http://localhost:9200) | Search and analytics engine |
| **Kibana** | [http://localhost:5601](http://localhost:5601) | Data visualization and monitoring |
| **PostgreSQL** | localhost:5432 | Database server |
| **Valkey** | localhost:6379 | Cache server |

---

## **Project Structure**

```
fullstack_basic_starter/
├── app/                          # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Core services, guards, interceptors
│   │   │   │   ├── guards/       # Route guards (auth, guest)
│   │   │   │   ├── interceptors/ # HTTP interceptors (auth token)
│   │   │   │   └── services/     # Singleton services (auth, user)
│   │   │   ├── features/         # Feature modules
│   │   │   │   ├── auth/         # Login, register, forgot-password
│   │   │   │   ├── home/         # Home/dashboard
│   │   │   │   └── user/         # User profile
│   │   │   ├── app.component.ts  # Root component
│   │   │   ├── app.config.ts     # Application configuration
│   │   │   └── app.routes.ts     # Route definitions
│   │   ├── environments/         # Environment configurations
│   │   ├── styles/               # Global SCSS styles
│   │   ├── index.html            # HTML entry point
│   │   └── main.ts               # Application bootstrap
│   ├── angular.json              # Angular CLI configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── Dockerfile                # Frontend container (Node 24)
├── api/                          # ASP.NET Core backend API
│   ├── Api/                      # Web API project (presentation layer)
│   │   ├── Controllers/          # API controllers
│   │   ├── Middleware/           # Custom middleware
│   │   ├── Program.cs            # Application entry point
│   │   └── appsettings.json      # Configuration
│   ├── Api.Core/                 # Domain layer
│   │   ├── Entities/             # Domain entities
│   │   ├── DTOs/                 # Data transfer objects
│   │   └── Interfaces/           # Service contracts
│   ├── Api.Infrastructure/       # Infrastructure layer
│   │   ├── Data/                 # DbContext and configurations
│   │   ├── Migrations/           # EF Core migrations
│   │   └── Services/             # Service implementations
│   ├── Api.sln                   # Solution file
│   ├── global.json               # .NET SDK version
│   └── Dockerfile                # Backend container (.NET 10)
├── compose_override/             # Docker Compose environment overrides
│   ├── development.yaml          # Development services (DB, cache, etc.)
│   └── production.yaml           # Production configuration
├── compose.yaml                  # Base Docker Compose configuration
├── start.sh                      # Application startup script
├── populate.sh                   # Database migration script
└── README.md                     # This file
```

---

## **Key Features**

### **Frontend Features**
- **Zoneless** - Angular 21's default zoneless change detection for better performance
- **Signals** - Fine-grained reactivity with Angular Signals for state management
- **Standalone** - No NgModules, simplified component architecture
- **Type Safety** - Full TypeScript support with strict mode
- **Lazy Loading** - Route-based code splitting for optimal bundle size
- **Reactive Forms** - Form handling with built-in validation
- **HTTP Interceptors** - Automatic JWT token injection

### **Backend Features**
- **Clean Architecture** - Separation of concerns with Api, Core, and Infrastructure layers
- **JWT Authentication** - Secure token-based authentication with ASP.NET Core Identity
- **Entity Framework Core** - Code-first database with migrations
- **Caching** - Redis/Valkey integration for session and data caching
- **Structured Logging** - Serilog with Elasticsearch sink for centralized logging
- **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- **Health Checks** - Endpoint for monitoring service health

### **DevOps & Infrastructure**
- **Containerized** - Multi-stage Docker builds for development and production
- **Reverse Proxy** - Traefik with priority-based routing
- **Hot Reload** - Fast development with volume mounts and watch mode
- **Health Checks** - Service dependencies with Docker Compose healthchecks
- **Centralized Logging** - ELK stack for log aggregation and visualization

---

## **Authentication**

### **Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register new user |
| POST | `/api/auth/sign-in/email` | Login with email/password |
| POST | `/api/auth/sign-out` | Logout (requires auth) |
| GET | `/api/auth/get-session` | Get current session (requires auth) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/change-password` | Change password (requires auth) |

### **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit

### **Example: Register**
```bash
curl -X POST http://localhost/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'
```

### **Example: Login**
```bash
curl -X POST http://localhost/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

---

## **Development**

### **Docker Commands**

**Basic Operations:**
```bash
# Start development environment
docker compose -f compose.yaml -f compose_override/development.yaml up -d

# View logs
docker compose -f compose.yaml -f compose_override/development.yaml logs -f

# View logs for specific service
docker compose -f compose.yaml -f compose_override/development.yaml logs -f api

# Stop services
docker compose -f compose.yaml -f compose_override/development.yaml down

# Stop and remove volumes
docker compose -f compose.yaml -f compose_override/development.yaml down -v
```

**Rebuild Services:**
```bash
# Rebuild all services
docker compose -f compose.yaml -f compose_override/development.yaml up -d --build

# Rebuild specific service
docker compose -f compose.yaml -f compose_override/development.yaml up -d --build api
```

**Execute Commands in Containers:**
```bash
# Access API container shell
docker compose -f compose.yaml -f compose_override/development.yaml exec api bash

# Run .NET commands
docker compose -f compose.yaml -f compose_override/development.yaml exec -T api dotnet build

# Access Angular container shell
docker compose -f compose.yaml -f compose_override/development.yaml exec app sh
```

---

## **Learning Opportunities**

This project is perfect for learning modern web development concepts:

1. **Angular Signals** - Master reactive state management with Angular's new Signals API
2. **Clean Architecture** - Understand separation of concerns in .NET applications
3. **JWT Authentication** - Implement secure token-based authentication
4. **Entity Framework Core** - Learn code-first database development with migrations
5. **Docker Compose** - Multi-container application orchestration
6. **Reverse Proxy** - Configure Traefik for routing and load balancing
7. **Centralized Logging** - Set up ELK stack for log aggregation

---

## **Future Enhancements**

- [ ] **Unit Tests** - Vitest for Angular, xUnit for .NET
- [ ] **E2E Tests** - Playwright or Cypress integration
- [ ] **CI/CD Pipeline** - GitHub Actions workflows
- [ ] **OAuth Providers** - Google, GitHub, Microsoft authentication
- [ ] **Real-time Features** - SignalR for WebSocket support
- [ ] **Admin Dashboard** - User management backoffice
- [ ] **Kubernetes** - Production deployment manifests

---

## **Contributing**

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code patterns and architecture
- Add tests for new features
- Update documentation as needed
- Ensure Docker builds pass

---

## **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**

- [Angular Team](https://angular.dev/) for the powerful framework
- [.NET Team](https://dotnet.microsoft.com/) for ASP.NET Core
- [Docker Team](https://www.docker.com/) for containerization
- [Traefik Team](https://traefik.io/) for the excellent reverse proxy
- All contributors and the open-source community

---

**Star this repository if you find it helpful!**
