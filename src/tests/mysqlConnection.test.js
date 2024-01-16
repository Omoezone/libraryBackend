import mysql from 'mysql2/promise';
import { after, afterEach } from 'node:test';

describe('MySQL Connection Test', () => {
    let connection;

    beforeAll(async () => {
        // Update these parameters with your MySQL connection details
        const mysqlConfig = {
            host: 'db-exam.mysql.database.azure.com',
            user: 'customer',
            password: 'customerPass',
            database: 'kea_library',
        };

        // Create a MySQL connection
        connection = await mysql.createConnection(mysqlConfig);
    });

    test('should connect to MySQL', async () => {
        try {
            // Perform a simple query to check the connection
            const [rows] = await connection.execute('SELECT DATABASE() AS databaseName');
            const databaseName = rows[0].databaseName;

            expect(databaseName === 'kea_library').toBe(true);
        } catch (error) {
            fail(`Failed to connect to MySQL: ${error}`);
        }
    });

    afterAll(async () => {
        // Close the MySQL connection
        await connection.end();
    });
});
