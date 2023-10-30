import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { get } from 'http';
dotenv.config();

const mongoDbClient = new MongoClient(process.env.MONGO_DB_HOST as string);

export async function connectToMongoDB() {
    try {
        await mongoDbClient.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

export default mongoDbClient;