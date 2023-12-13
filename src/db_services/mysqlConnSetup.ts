import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

// Create connection to mysql database and import where its needed
const pool: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_DEV_DB_HOST,
    user: process.env.MYSQL_DEV_DB_USERNAME,
    password: process.env.MYSQL_DEV_DB_PASSWORD,
    database: process.env.MYSQL_DEV_DB_NAME,
    port: process.env.MYSQL_DEV_DB_PORT ? parseInt(process.env.MYSQL_DEV_DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function testDBConnection() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
        console.log(`Connected to mysql database on PORT: ${process.env.MYSQL_DEV_DB_PORT}`);
    }
    catch (err) {
        console.log("Could not connect to mysql database");
        process.exit(1);
    }
}

export default pool;