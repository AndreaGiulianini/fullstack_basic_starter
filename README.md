# **Basic Full Stack Architecture Starter**

This is a small toy project that I prepared to give some exercises to new colleagues who are approaching web development for the first time, so I can give them a starting point that allows me over time to be able to explain everything to them.

This project integrates the following technologies:

- **Frontend**: [Next.js (App Router)](https://nextjs.org/docs/app), [TailwindCSS](https://tailwindcss.com/docs/v4-beta), [Shadcn](https://ui.shadcn.com/docs/components/accordion), [TypeScript](https://www.typescriptlang.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [i18n](https://next-intl-docs.vercel.app/docs/getting-started/app-router/without-i18n-routing).
- **Backend**: [Fastify](https://www.fastify.io/), [Drizzle ORM](https://orm.drizzle.team/), [Better-Auth](https://www.better-auth.com/), [Zod](https://zod.dev/), [Pino](https://getpino.io/#/), [OpenAPI](https://swagger.io/), [Scalar](https://scalar.com/).
- **Infrastructure**: [Docker](https://www.docker.com/), [Traefik](https://doc.traefik.io/traefik/), [Valkey](https://valkey.dev/).
- **Database**: [PostgreSQL](https://www.postgresql.org/).
- **Monitoring**: [ELK](https://www.elastic.co/what-is/elk-stack).
- **Linting code**: [BiomeJS](https://biomejs.dev/).

This setup provides a ready-to-use playground for exploring web development concepts and workflows, from frontend UI design to backend services and database interactions.

---

## **Getting Started**

1. **Create Environment File**:
   - Create a `.env` file in the root directory by renaming `.env.placeholder` to `.env`.
   - Fill in the necessary environment variables in the `.env` file.

2. **Start the Project**:
   - To launch the project using Docker, run the following script:

   ```bash
   ./start.sh
   ```

   This script will handle all necessary setup and start the services in a containerized environment.

3. **Populate the Database**:
   - After starting the project, populate the database by running:

   ```bash
   ./populate.sh
   ```

---

## **Available URLs**

After starting the project, the following URLs will be available:

- **Frontend (Next.js)**: [http://localhost](http://localhost:80)
- **Backend API (Fastify)**: [http://localhost/api](http://localhost/api)
- **Scalar**: [http://localhost/reference](http://localhost/reference)
- **Traefik Dashboard**: [http://localhost:8080](http://localhost:8080)
- **Elasticsearch**: [http://localhost:9200](http://localhost:9200)
- **Kibana**: [http://localhost:5601](http://localhost:5601)

---

## **What's Missing?**

The following features and examples are not yet implemented in the current version but can serve as exercises or extensions for developers:

1. **Transaction Example**
   - Implement an example of database transactions using [Drizzle ORM transactions](https://orm.drizzle.team/docs/transactions#transactions).

2. **Backoffice Dashboard**
   - Create a functional backoffice dashboard with features like user management, analytics, or content control.

---

## **Future Goals**

This starter project is intended to evolve with new tools and features. Some potential future enhancements include:

- Integrating CI/CD workflows.
- Adding unit and integration testing.
- Expanding backend functionalities (e.g., file uploads, advanced authentication).
- Enhancing Docker configuration for production-ready deployment.

---

## **Contributing**

Contributions are welcome! If you'd like to add features, fix bugs, or enhance the documentation, feel free to fork the repository and submit a pull request.

---

## **License**

This project is licensed under the MIT License. Feel free to use, modify, and distribute as needed.

---