import express from 'express';
import { sequalizeAuth, sequelizeSync } from './other_services/sequalizerConnection';
import mongoDbClient, { connectToMongoDB } from './db_services/mongo/mongoConnSetup';
import { seedDataNeo4j } from './db_services/neo4j/neo4jConnSetup';
import { getAllUsers } from './db_services/neo4j/neo4jConnSetup';
import seedData from './db_services/mongo/mongoSeedData';
import userRouter from './routes/userRouter';
import bookRouter from './routes/bookRouter';
import authorRouter from './routes/authorRouter';
import tagRouter from './routes/tagRouter';
import authRouter from './routes/authRouter';
import mongoBookRouter from './routes/mongoRoutes/mongoBookRouter';
import logger from './other_services/winstonLogger';
import dotenv from 'dotenv';
import job from './other_services/cronJob';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors())
// API routes imported from routes folder
app.use(userRouter);
app.use(bookRouter);
app.use(authorRouter);
app.use(tagRouter);
app.use(authRouter);
//app.use(mongoBookRouter)

// --- auth and sync sequelize
sequalizeAuth();
sequelizeSync();

// --- test mongoDB connection
//connectToMongoDB();
//seedData();

// --- test neo4j connection
//console.log(getAllUsers());
seedDataNeo4j();

// --- Cronjob migration for the database 
// job.start();

// --- Do this when the server is closed
process.on('SIGINT', () => {
    logger.end();
    //mongoDbClient.close();
    console.log('See u later, silly!');
    process.exit(0); 
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});