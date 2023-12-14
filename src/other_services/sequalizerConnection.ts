import { Sequelize } from "sequelize";
import logger from "./winstonLogger";
import { config } from '../../config';

const dbConfig = config.dbConfig;
const sequelize = new Sequelize(dbConfig.mysql.mysql_database!, dbConfig.mysql.mysql_user!, dbConfig.mysql.mysql_password!, {
    host: dbConfig.mysql.mysql_host!,
    port: Number(dbConfig.mysql.mysql_port),
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