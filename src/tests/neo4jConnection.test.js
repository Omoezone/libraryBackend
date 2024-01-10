import neo4j from 'neo4j-driver';

describe('Neo4j Connection Test', () => {
    test('should connect to Neo4j', async () => {
        // Update these parameters with your Neo4j database connection details
        const neo4jUri = "neo4j+s://neo4j@159a8e7f.databases.neo4j.io:7687"; //process.env.NEO4J_PROD_DB_HOST;
        const neo4jUser = "neo4j"; // process.env.NEO4J_PROD_DB_USERNAME;
        const neo4jPassword = "nkEN5UwOr6JNYAx0RMtv9eUqLvNMKL08L-w_C3u3Q9I"; // process.env.NEO4J_PROD_DB_PASSWORD;

        // Create a Neo4j driver instance
        const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

        // Attempt to connect to the Neo4j database
        const session = driver.session();

        try {
            const result = await session.run('RETURN 1 AS result');
            expect(result.records[0].get('result').toNumber()).toBe(1);
        } catch (error) {
            fail(`Failed to connect to Neo4j: ${error}`);
        } finally {
            // Close the session and the driver
            await session.close();
            await driver.close();
        }
    });
});