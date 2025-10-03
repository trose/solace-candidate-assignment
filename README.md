## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Development Setup

Set up Git hooks for code quality enforcement:

```bash
npm run prepare
```

## Database and Redis Setup

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you'd like to configure a database, you're encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/solaceassignment

# Redis Configuration (optional - defaults to localhost:6379)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Application Configuration
NODE_ENV=development
```

### Setup Steps

1. Start PostgreSQL and Redis using Docker Compose:

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```

### Redis Caching

The application now uses Redis for distributed caching to improve performance. Redis is automatically started with Docker Compose and provides:

- **Distributed caching** across multiple application instances
- **Automatic TTL** (Time To Live) for cache entries
- **Connection resilience** with automatic reconnection
- **Graceful fallback** when Redis is unavailable

Cache keys are automatically generated for:
- All advocates: `advocates:all`
- Search results: `advocates:search:{params}`
- Individual advocates: `advocates:id:{id}`
