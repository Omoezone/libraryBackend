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
import mongoAuthorRouter from './routes/mongoRoutes/mongoAuthorRouter';
import mongoReviewRouter from './routes/mongoRoutes/mongoReviewRouter';
import mongoTagRouter from './routes/mongoRoutes/mongoTagRouter';
import mongoUserRouter from './routes/mongoRoutes/mongoUserRouter';
import mongoAuthRouter from './routes/mongoRoutes/mongoAuthRouter';
import neo4jUserRouter from './routes/neo4jRoutes/neo4jUserRouter';
import neo4jAuthorRouter from './routes/neo4jRoutes/neo4jAuthorRouter';
import neo4jBookRouter from './routes/neo4jRoutes/neo4jBookRouter';
import neo4jReviewRouter from './routes/neo4jRoutes/neo4jReviewRouter';
import neo4jTagRouter from './routes/neo4jRoutes/neo4jTagRouter';
import neo4jAuthRouter from './routes/neo4jRoutes/neo4jAuthRouter';
import logger from './other_services/winstonLogger';
import dotenv from 'dotenv';
import job from './other_services/cronJob';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();
const app = express();
app.use(cors())


// MongoDB Swagger options
const mongoOption = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MongoDB Library API documentation',
        version: '1.0.0',
        description: 'API documentation for MongoDB routes in our library project',
      },
    },
    apis: [
      './src/routes/mongoRoutes/swagger/mongoSwaggerUserRouter.yaml',
      './src/routes/mongoRoutes/swagger/mongoSwaggerAuthorRouter.yaml',
      './src/routes/mongoRoutes/swagger/mongoSwaggerAuthRouter.yaml',
      './src/routes/mongoRoutes/swagger/mongoSwaggerBookRouter.yaml',
      './src/routes/mongoRoutes/swagger/mongoSwaggerTagRouter.yaml',
      './src/routes/mongoRoutes/swagger/mongoSwaggerReviewRouter.yaml',
      
      //neo4j
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerUserRouter.yaml',
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerAuthRouter.yaml',
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerAuthorRouter.yaml',
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerBookRouter.yaml',
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerReviewRouter.yaml',
      './src/routes/neo4jRoutes/swagger/neo4jSwaggerTagRouter.yaml',
    ],
  };
  

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(mongoOption)));



//mysql router
/*
app.use(userRouter);
app.use(bookRouter);
app.use(authorRouter);
app.use(tagRouter);
app.use(authRouter);
*/

// --- test mongoDB connection
connectToMongoDB();
//seedData();

// --- mongo router ----

app.use(mongoBookRouter)
app.use(mongoAuthorRouter)
app.use(mongoReviewRouter)
app.use(mongoTagRouter)
app.use(mongoUserRouter)
app.use(mongoAuthRouter)


// --- neo4j router ---

app.use(neo4jAuthorRouter)
app.use(neo4jBookRouter)
app.use(neo4jReviewRouter)
app.use(neo4jTagRouter)
app.use(neo4jUserRouter)
app.use(neo4jAuthRouter)

// --- auth and sync sequelize
//sequalizeAuth();
//sequelizeSync();


// --- test neo4j connection
//console.log(getAllUsers());
//seedDataNeo4j();


// --- Cronjob migration for the database 
//job.start();

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