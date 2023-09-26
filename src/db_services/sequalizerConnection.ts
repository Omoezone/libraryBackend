import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const db_name = process.env["DB_NAME"]!;
const db_username = process.env["DB_USERNAME"]!;
const db_password = process.env["DB_PASSWORD"]!;

const sequelize = new Sequelize(db_name, db_username, db_password, {
    host: 'localhost',
    port: Number(process.env["PORT"]) ,
    dialect: 'mysql'
});

export default sequelize;