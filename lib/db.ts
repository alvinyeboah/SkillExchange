import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
  connectTimeout: 5000, 
  idleTimeout:5000,
});

export default pool;
export async function withConnection<T>(
  pool: mysql.Pool,
  operation: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  let connection: mysql.PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    return await operation(connection);
  } catch (error) {
    console.error("Database error:", error); // Log errors
    throw error instanceof Error
      ? error
      : new Error("Database operation failed: " + String(error));
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});