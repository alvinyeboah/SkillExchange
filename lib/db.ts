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
  operation: (connection: mysql.PoolConnection) => Promise<T>,
  label: string
): Promise<T> {
  let connection: mysql.PoolConnection | null = null;
  try {
    console.log(`[${label}] - Attempting to get a database connection.`);
    connection = await pool.getConnection();
    console.log(`[${label}] - Connection acquired.`);
    return await operation(connection);
  } catch (error) {
    console.error(`[${label}] - Database error:`, error); // Log errors with label
    throw error instanceof Error
      ? error
      : new Error(`[${label}] - Database operation failed: ${String(error)}`);
  } finally {
    if (connection) {
      connection.release();
      console.log(`[${label}] - Connection released.`);
    }
  }
}


// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});