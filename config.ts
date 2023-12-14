// config.ts
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV;
console.log("ENV ", environment)
const commonConfig = {
    current_env: environment,
};

export const devConfig = {
    ...commonConfig,
    dbConfig: {
        mysql: {
            mysql_host: process.env.MYSQL_DEV_DB_HOST,
            mysql_user: process.env.MYSQL_DEV_DB_USERNAME,
            mysql_password: process.env.MYSQL_DEV_DB_PASSWORD,
            mysql_database: process.env.MYSQL_DEV_DB_NAME,
            mysql_port: process.env.MYSQL_DEV_DB_PORT,
        },
        mongo: {
            mongo_host: process.env.MONGO_DEV_DB_HOST,
            mongo_database: process.env.MONGO_DEV_DB_NAME,
        },
        neo4j: {
            neo4j_host: process.env.NEO4J_DEV_HOST_NAME,
            neo4j_user: process.env.NEO4J_DEV_DB_USERNAME,
            neo4j_password: process.env.NEO4J_DEV_DB_PASSWORD,
        },
        APP_PORT: process.env.DEV_PORT,
    },
};

export const prodConfig = {
    ...commonConfig,
    dbConfig: {
        mysql: {
            mysql_host: process.env.MYSQL_PROD_DB_HOST,
            mysql_user: process.env.MYSQL_PROD_DB_USERNAME,
            mysql_password: process.env.MYSQL_PROD_DB_PASSWORD,
            mysql_database: process.env.MYSQL_PROD_DB_NAME,
            mysql_port: process.env.MYSQL_PROD_DB_PORT,
        },
        mongo: {
            mongo_host: process.env.MONGO_PROD_DB_HOST,
            mongo_database: process.env.MONGO_PROD_DB_NAME,
        },
        neo4j: {
            neo4j_host: process.env.NEO4J_PROD_HOST_NAME,
            neo4j_user: process.env.NEO4J_PROD_DB_USERNAME,
            neo4j_password: process.env.NEO4J_PROD_DB_PASSWORD,
        },
        APP_PORT: process.env.PROD_PORT,
    },
};

export const config = (process.env.NODE_ENV == "development " ? devConfig : prodConfig);