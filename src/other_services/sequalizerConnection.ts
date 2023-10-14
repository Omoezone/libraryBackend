import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import logger from "./winstonLogger";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    host: 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: (msg) => {
        logger.verbose(`Received log message: ${msg}`);
    },
}); 

export const sequalizeAuth = async () => { sequelize.authenticate()
    .then(() => logger.verbose('Connection has been established successfully.'))
    .catch((error: any) => logger.error('Unable to connect to the database:', error));
}
export const sequelizeSync = async () => { await sequelize.sync()
    .then(() => logger.verbose('Sequelize sync successful'))
    .catch((error:any) => logger.error('Sequelize sync failed', error));
}

export default sequelize;