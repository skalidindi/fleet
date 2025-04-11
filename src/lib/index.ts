import { drizzle } from "drizzle-orm/mysql2";
import { getDatabaseCredentials } from "../lib/secrets";
import mysql from "mysql2/promise";

let db = null;

export async function getDb() {
  if (db) return db;

  const credentials = await getDatabaseCredentials();

  const pool = mysql.createPool({
    host: credentials.host,
    port: credentials.port,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  db = drizzle(pool);

  return db;
}
