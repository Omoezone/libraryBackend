import express from 'express';
import { sequalizeAuth, sequelizeSync } from './other_services/sequalizerConnection';
import { testDBConnection } from './db_services/mysqlConnSetup';
import { Book } from "./other_services/models/seqBooks"
import userRouter from './routes/userRouter';
import bookRouter from './routes/bookRouter';
import authorRouter from './routes/authorRouter';
import tagRouter from './routes/tagRouter';
import logger from './other_services/winstonLogger';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// API routes imported from routes folder
app.use(userRouter);
app.use(bookRouter);
app.use(authorRouter);
app.use(tagRouter);
// testDBConnection(); This is for the basic mysql connector

// auth and sync sequelize
sequalizeAuth();
sequelizeSync();

// Do this when the server is closed
process.on('SIGINT', () => {
    logger.end();
    console.log('See u later, alligator!');
    process.exit(0); 
});

const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});