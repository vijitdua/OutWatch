import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(env.database, env.databaseUser, env.databasePassword, {
    host: env.databaseHost,
    dialect: 'postgres',
    logging: false,
});