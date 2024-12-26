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
  idleTimeout: 5000,
});

export default pool;

export async function withConnection<T>(
  operation: (connection: mysql.PoolConnection) => Promise<T>,
  label: string
): Promise<T> {
  let connection = null;
  const startTime = performance.now();

  try {
    `[${label}] Starting operation`;
    connection = await pool.getConnection();
    const result = await operation(connection);
    const duration = Math.round(performance.now() - startTime);
    console.log(`[${label}] Completed successfully in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    console.error(`[${label}] Failed after ${duration}ms:`, error);

    if (!(error instanceof Error)) {
      throw new Error(`[${label}] Operation failed: ${String(error)}`, {
        cause: error,
      });
    }
    throw error;
  } finally {
    if (connection) {
      try {
        connection.release();
        console.log(`[${label}] Connection released`);
      } catch (releaseError) {
        console.error(`[${label}] Error releasing connection:`, releaseError);
      }
    }
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database pool...");
  await pool.end();
  process.exit(0);
});
