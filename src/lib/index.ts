import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { getDatabaseCredentials } from "@/lib/secrets";
import mysql from "mysql2/promise";

// Import your schema to provide type information
import * as schema from "./schema";

// Define the type for your database
let db: MySql2Database<typeof schema> | null = null;

export async function getDb(): Promise<MySql2Database<typeof schema>> {
  if (db) return db;

  const credentials = await getDatabaseCredentials();

  const pool = mysql.createPool({
    host: credentials.host,
    port: credentials.port,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  db = drizzle(pool, { schema, mode: "default" });

  return db;
}
