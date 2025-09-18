# **Modern Full Stack Architecture Starter**

A comprehensive, production-ready full-stack starter template designed for modern web development. This project serves as an excellent learning resource and starting point for developers working with cutting-edge technologies.

## **🚀 Technology Stack**

### **Frontend**
- **[Nuxt 4](https://nuxt.com/)** - The intuitive Vue framework with file-based routing
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Pinia](https://pinia.vuejs.org/)** - Modern state management for Vue
- **[VueUse](https://vueuse.org/)** - Collection of essential Vue Composition Utilities
- **[i18n](https://i18n.nuxtjs.org/)** - Internationalization support

### **Backend**
- **[Fastify](https://www.fastify.io/)** - Fast and low overhead web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM with excellent performance
- **[Better-Auth](https://www.better-auth.com/)** - Modern authentication library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Pino](https://getpino.io/#/)** - Super fast JSON logger
- **[OpenAPI](https://swagger.io/)** - API documentation standard
- **[Scalar](https://scalar.com/)** - Beautiful API documentation

### **Infrastructure & DevOps**
- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Traefik](https://doc.traefik.io/traefik/)** - Modern reverse proxy and load balancer
- **[Valkey](https://valkey.dev/)** - High-performance in-memory data store
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[ELK Stack](https://www.elastic.co/what-is/elk-stack)** - Elasticsearch, Logstash, Kibana for monitoring

### **Code Quality & Development**
- **[Oxlint](https://oxc-project.github.io/docs/linter/)** - Ultra-fast linter written in Rust
- **[ESLint](https://eslint.org/)** - Pluggable JavaScript/TypeScript linter
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **Multi-stage Docker builds** - Optimized container images
- **Hot reloading** - Fast development experience

This setup provides a complete, production-ready foundation for modern web applications with excellent developer experience and performance.

---

## **🚀 Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

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
```bash
# Start all services with Docker
./start.sh

# Or manually with Docker Compose
docker compose up --build
```

### **4. Initialize Database**
```bash
# Populate database with initial data
./populate.sh
```

### **5. Development Commands**
```bash
# Frontend development
cd frontend
npm run dev

# Backend development
cd api
npm run dev

# Linting and formatting
npm run lint
npm run format
```

---

## **🌐 Available Services**

Once the application is running, you can access the following services:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost](http://localhost) | Nuxt 4 application with Vue 3 |
| **API** | [http://localhost/api](http://localhost/api) | Fastify REST API with OpenAPI docs |
| **API Docs** | [http://localhost/reference](http://localhost/reference) | Interactive Scalar API documentation |
| **Traefik Dashboard** | [http://localhost:8080](http://localhost:8080) | Reverse proxy management interface |
| **Elasticsearch** | [http://localhost:9200](http://localhost:9200) | Search and analytics engine |
| **Kibana** | [http://localhost:5601](http://localhost:5601) | Data visualization and monitoring |

## **📁 Project Structure**

```
fullstack_basic_starter/
├── frontend/                 # Nuxt 4 frontend application
│   ├── app/                 # Vue components and pages
│   ├── stores/              # Pinia state management
│   ├── locales/             # i18n translation files
│   └── server/              # Server-side API routes
├── api/                     # Fastify backend API
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic services
│   ├── middleware/          # Express middleware
│   └── utils/               # Utility functions
├── compose.yaml             # Docker Compose configuration
├── oxlint.json             # Oxlint configuration
└── README.md               # This file
```

---

## **✨ Key Features**

### **Frontend Features**
- 🎨 **Modern UI** - TailwindCSS with custom components
- 🌍 **Internationalization** - Multi-language support with i18n
- 📱 **Responsive Design** - Mobile-first approach
- 🔄 **State Management** - Pinia stores for global state
- 🎯 **Type Safety** - Full TypeScript support
- ⚡ **Performance** - Optimized with Nuxt 4 features

### **Backend Features**
- 🚀 **High Performance** - Fastify with excellent benchmarks
- 🔐 **Authentication** - Better-Auth with modern security
- 📊 **API Documentation** - Auto-generated OpenAPI/Scalar docs
- 🗄️ **Database ORM** - Drizzle ORM with type safety
- 📝 **Logging** - Structured logging with Pino
- ✅ **Validation** - Zod schema validation

### **DevOps & Quality**
- 🐳 **Containerized** - Multi-stage Docker builds
- 🔍 **Code Quality** - Oxlint + ESLint integration
- 📈 **Monitoring** - ELK stack for observability
- 🔄 **Hot Reload** - Fast development experience
- 🛡️ **Security** - Production-ready configurations

## **🎯 Learning Opportunities**

This project is perfect for learning modern web development concepts:

1. **Database Transactions** - Implement with [Drizzle ORM transactions](https://orm.drizzle.team/docs/transactions)
2. **Admin Dashboard** - Build a backoffice with user management
3. **Real-time Features** - Add WebSocket support
4. **Testing** - Implement unit and integration tests
5. **CI/CD** - Set up GitHub Actions workflows
6. **Advanced Auth** - OAuth providers, 2FA, etc.

## **🚀 Future Enhancements**

- [ ] **Testing Suite** - Jest/Vitest integration
- [ ] **CI/CD Pipeline** - GitHub Actions workflows
- [ ] **Real-time Features** - WebSocket support
- [ ] **Advanced Monitoring** - APM and metrics
- [ ] **Microservices** - Service decomposition
- [ ] **Cloud Deployment** - Kubernetes manifests

---

## **🛠️ Development**

### **Code Quality**
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### **Docker Commands**
```bash
# Build images
docker compose build

# Start services
docker compose up

# Stop services
docker compose down

# View logs
docker compose logs -f
```

## **🤝 Contributing**

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass

## **📄 License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## **🙏 Acknowledgments**

- [Nuxt Team](https://nuxt.com/) for the amazing framework
- [Vue Team](https://vuejs.org/) for the reactive framework
- [Fastify Team](https://www.fastify.io/) for the high-performance server
- [Oxc Project](https://oxc-project.github.io/) for the ultra-fast linter
- All contributors and the open-source community

---

**⭐ Star this repository if you find it helpful!**