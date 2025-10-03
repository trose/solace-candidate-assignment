import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Enhanced connection pooling configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const queryClient = postgres(process.env.DATABASE_URL, {
  // Connection pool settings
  max: isProduction ? 20 : 10, // More connections in production
  idle_timeout: 20, // idle timeout in seconds
  max_lifetime: 60 * 30, // max lifetime in seconds (30 minutes)

  // Performance settings
  prepare: false, // Disable prepared statements for better performance with dynamic queries
  transform: {
    undefined: null, // Transform undefined to null for PostgreSQL
  },

  // Connection settings
  connect_timeout: 10, // Connection timeout in seconds
  ssl: isProduction ? 'require' : false, // Require SSL in production

  // Debug settings (only in development)
  debug: isDevelopment,

  // Error handling
  // eslint-disable-next-line no-console
  onnotice: isDevelopment ? console.log : undefined,
});

const db = drizzle(queryClient, {
  schema,
  logger: isDevelopment, // Enable query logging in development
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGINT, closing database connections...');
  await queryClient.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGTERM, closing database connections...');
  await queryClient.end();
  process.exit(0);
});

export default db;
