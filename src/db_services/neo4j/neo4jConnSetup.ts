import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export const driver = neo4j.driver(
    process.env.NEO4J_DB_HOST as string,
    neo4j.auth.basic(process.env.NEO4J_DB_USERNAME as string, process.env.NEO4J_DB_PASSWORD as string)
);

export const session = driver.session();

// Test connection
session
    .run('RETURN 1 as result')
    .then((result) => {
        const testResult = result.records[0];
        const value = testResult.get('result').toNumber();
        console.log(`Connected to Neo4j. Test query result should be 1. It is: ${value}`);
    })
    .catch((error) => {
        console.error('Error testing the Neo4j connection:', error);
    });

export async function getAllUsers() {
    const txc = session.beginTransaction(); // Start a new transaction

    try {
        const result = await txc.run(
            `
            MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData)
            RETURN u, ud
            `
        );

        const users = result.records.map((record) => ({
            userData: record.get('ud').properties,
            user: record.get('u').properties,
        }));

        await txc.commit(); // Commit the transaction
        users.forEach((user, index) => {
            console.log(`User ${index + 1} Data:`, user.userData);
        });
        return users;
    } catch (error) {
        await txc.rollback();
        console.error('Error retrieving all users:', error);
        throw error;
    } finally {
        await txc.close();
        session.close();
    }
}
// Seed data for neo4j db. It comes from seedData.cypher file
export async function seedDataNeo4j() {
    const cypherScript = fs.readFileSync('./src/db_services/neo4j/seedData.cypher', 'utf8');
    const scriptSession = driver.session();

    scriptSession.run(cypherScript)
    .then(result => {
        result.records.forEach(record => {
        console.log(record.toObject());
        });
    })
    .catch(error => {
        console.error('Error executing Cypher script:', error);
    }).finally(() => {
        scriptSession.close();
    });
}

