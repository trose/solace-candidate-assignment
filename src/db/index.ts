import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// for query purposes with connection pooling
const queryClient = postgres(process.env.DATABASE_URL, {
  max: 10, // max connections
  idle_timeout: 20, // idle timeout in seconds
  max_lifetime: 60 * 30, // max lifetime in seconds
});
const db = drizzle(queryClient, { schema });

export default db;
