import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: 'localhost',
  port: 5431,
  user: 'postgres',
  password: 'postgres',
  database: 'my_store',
});
