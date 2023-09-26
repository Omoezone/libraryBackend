import express from 'express';
//import sequelize from './db_services/sequalizerConnection';
import { testDBConnection } from './db_services/mysqlConnSetup';
import userRouter from './routes/userRouter';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(userRouter)

testDBConnection();


/*sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error: any) => console.error('Unable to connect to the database:', error));
*/

const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});