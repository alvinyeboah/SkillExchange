import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export async function withConnection<T>(
  pool: mysql.Pool,
  operation: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  let connection: mysql.PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    const result = await operation(connection);
    return result;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Database operation failed");
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
