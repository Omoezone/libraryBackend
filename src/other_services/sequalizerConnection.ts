import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import logger from "./winstonLogger";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    host: 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: (msg) => {
        console.log('Received log message:', msg)
    },
}); 

process.on('SIGINT', () => {
    logger.end();
    console.log('See u later, alligator!');
    process.exit(0); 
});

export default sequelize;