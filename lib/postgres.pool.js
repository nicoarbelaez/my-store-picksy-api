import pg from 'pg';
const { Pool } = pg;
import { config } from '../config/config.js';

const USER = encodeURIComponent(config.db.user);
const PASSWORD = encodeURIComponent(config.db.password);
const URI = `postgres://${USER}:${PASSWORD}@${config.db.host}:${config.db.port}/${config.db.database}`;

export const pool = new Pool({
  connectionString: URI,
});
