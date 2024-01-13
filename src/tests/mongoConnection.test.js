import { MongoClient } from 'mongodb';

describe('MongoDB Connection Test', () => {
  let client;

  beforeAll(async () => {
    // Update these parameters with your MongoDB connection details
    const mongoUri = 'mongodb+srv://admin:adminPass@cluster0.xgywy6a.mongodb.net/';
    const dbName = 'databaseFag';

    // Create a MongoDB client
    client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to the MongoDB database
    await client.connect();
  });

  test('should connect to MongoDB', async () => {
    try {
      // Access a specific database
      const db = await client.db('databaseFag');

      console.log('Connected to MongoDB', await db.s.namespace.db);

      // Perform a simple query (e.g., check if a collection exists)
      const databaseName = await db.s.namespace.db;

      expect(databaseName === 'databaseFag').toBe(true);
    } catch (error) {
      fail(`Failed to connect to MongoDB: ${error}`);
    }
  });

  afterAll(async () => {
    // Close the MongoDB connection
    await client.close();
  });
});
