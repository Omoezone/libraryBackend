import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_DEV_DB_HOST as string, {"dbName": process.env.MONGO_DEV_DB_NAME});
const mongoDbClient = mongoose.connection;

export async function connectToMongoDB() {
    mongoDbClient.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoDbClient.once('open', () => {
        console.log('Connected to MongoDB');
    });
}

export default mongoDbClient;