import { Pool } from 'pg';
import { env } from './env';
import logger from '../utils/logger';

// Create PostgreSQL connection pool
export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  
  // Connection pool tuning for production
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection to become available
});

// The pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', { error: err.message, stack: err.stack });
  process.exit(-1);
});

// Function to test the database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    logger.info(`Successfully connected to PostgreSQL at ${env.DB_HOST}:${env.DB_PORT}. Server time: ${res.rows[0].current_time}`);
    client.release();
    return true;
  } catch (error: any) {
    logger.error('Failed to connect to PostgreSQL database', { error: error.message });
    return false;
  }
};
