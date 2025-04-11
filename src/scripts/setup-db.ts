import { getDb } from "@/lib";
import { sql } from "drizzle-orm";

async function setup() {
  try {
    console.log("Setting up database...");
    const db = await getDb();

    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database setup complete");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

await setup();
