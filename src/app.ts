import express from 'express';
import sequelize from './other_services/sequalizerConnection';
import { testDBConnection } from './db_services/mysqlConnSetup';
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


sequelize.authenticate()
    .then(() => console.info('Connection has been established successfully.'))
    .catch((error: any) => console.error('Unable to connect to the database:', error));

logger.info("HELLO WORLD");
const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});