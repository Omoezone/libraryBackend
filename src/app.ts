import express from 'express';
import { sequalizeAuth, sequelizeSync } from './other_services/sequalizerConnection';
import userRouter from './routes/userRouter';
import bookRouter from './routes/bookRouter';
import authorRouter from './routes/authorRouter';
import tagRouter from './routes/tagRouter';
import authRouter from './routes/authRouter';
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
// testDBConnection(); This is for the basic mysql connector

// auth and sync sequelize
sequalizeAuth();
sequelizeSync();

// Cronjob migration for the database 
// job.start();


// Do this when the server is closed
process.on('SIGINT', () => {
    logger.end();
    console.log('See u later, silly!');
    process.exit(0); 
});

const port = process.env.PORT ?? 3010;
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});