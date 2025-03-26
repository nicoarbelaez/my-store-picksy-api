import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';

const USER = encodeURIComponent(config.db.user);
const PASSWORD = encodeURIComponent(config.db.password);
const URI = `postgres://${USER}:${PASSWORD}@${config.db.host}:${config.db.port}/${config.db.database}`;

export const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: console.log,
});
