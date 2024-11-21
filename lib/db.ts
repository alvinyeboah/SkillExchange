import mysql from 'mysql2';

export const pool = mysql.createPool({
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Convert to number, use default if not set
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT 
        ? parseInt(process.env.DB_CONNECTION_LIMIT, 10) 
        : 10,  // Convert to number with a default
    queueLimit: 0
});

export default pool.promise();