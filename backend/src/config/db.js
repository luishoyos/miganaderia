import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'miganaderia',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

export const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default { query, getClient };
