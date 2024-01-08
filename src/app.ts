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
import userTabRouter from './routes/userTabRouter';
import mongoBookRouter from './routes/mongoRoutes/mongoBookRouter';
import mongoAuthorRouter from './routes/mongoRoutes/mongoAuthorRouter';
import mongoReviewRouter from './routes/mongoRoutes/mongoReviewRouter';
import mongoTagRouter from './routes/mongoRoutes/mongoTagRouter';
import mongoUserRouter from './routes/mongoRoutes/mongoUserRouter';
import mongoAuthRouter from './routes/mongoRoutes/mongoAuthRouter'
import neo4jUserRouter from './routes/neo4jRoutes/neo4jUserRouter';
import logger from './other_services/winstonLogger';
import dotenv from 'dotenv';
import job from './other_services/cronJob';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
dotenv.config();
const app = express();

//http://localhost:3000/docs/
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API documentation",
            version: "1.0.0",
            description: "code documentation for our library project",
        },
    },
    apis: [
        './src/routes/mongoRoutes/swagger/mongoSwaggerUserRouter.yaml',
        './src/routes/mongoRoutes/swagger/mongoSwaggerAuthorRouter.yaml',
        './src/routes/mongoRoutes/swagger/mongoSwaggerAuthRouter.yaml',
        './src/routes/mongoRoutes/swagger/mongoSwaggerBookRouter.yaml',
        './src/routes/mongoRoutes/swagger/mongoSwaggerTagRouter.yaml', 
        './src/routes/mongoRoutes/swagger/mongoSwaggerReviewRouter.yaml',
    ],
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.use(cors())

// API routes imported from routes folder

// --- auth and sync sequelize mysql
//sequalizeAuth();
//sequelizeSync();

//mysql router
app.use(userRouter);
app.use(bookRouter);
app.use(authorRouter);
app.use(tagRouter);
app.use(authRouter);
app.use(userTabRouter);

// --- mongoDB connection
connectToMongoDB();
//seedData();

// --- mongo router ----
app.use(mongoBookRouter)
app.use(mongoAuthorRouter)
app.use(mongoReviewRouter)
app.use(mongoTagRouter)
app.use(mongoUserRouter)
app.use(mongoAuthRouter)

/*
// --- neo4j router ---
app.use(userTabRouter);
app.use(neo4jUserRouter)

// --- test neo4j connection
console.log(getAllUsers());
seedDataNeo4j();
*/

// --- Cronjob migration for the database 
//job.start();

app.get('/', (req, res) => {
    res.send('Library backend is up and running! SÅDAN MAND! ');
});
// --- Do this when the server is closed
process.on('SIGINT', () => {
    logger.end();
    mongoDbClient.close();
    console.log('See u later, silly!');
    process.exit(0); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});