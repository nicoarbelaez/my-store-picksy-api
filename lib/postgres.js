import pg from 'pg';
const { Client } = pg;

export const getConnection = async () => {
  const client = new Client({
    host: 'localhost',
    port: 5431,
    user: 'postgres',
    password: 'postgres',
    database: 'my_store',
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};
