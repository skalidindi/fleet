// For MySQL
import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { getDatabaseCredentials } from "@/lib/secrets";

let pool: Pool | null = null;

async function getPool(): Promise<Pool> {
  if (pool) return pool;

  const credentials = await getDatabaseCredentials();

  pool = mysql.createPool({
    host: credentials.host,
    port: credentials.port,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: {
      rejectUnauthorized: true,
    },
    connectionLimit: 10,
  });

  return pool;
}

export async function query<
  T extends RowDataPacket[][] | RowDataPacket[] | ResultSetHeader
>(sql: string, params?: unknown[]): Promise<T> {
  const pool = await getPool();
  const [results] = await pool.execute(sql, params);
  return results as T;
}

// Helper function for queries that return rows
export async function queryRows<T extends RowDataPacket>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const results = await query<RowDataPacket[]>(sql, params);
  return results as T[];
}

// Helper function for insert/update/delete operations
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<ResultSetHeader> {
  const result = await query<ResultSetHeader>(sql, params);
  return result;
}

// Close the pool (useful for tests or scripts)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
