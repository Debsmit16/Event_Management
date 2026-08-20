import { pool } from '../config/db';

beforeAll(async () => {
  // Ensure we can connect before running tests
  await pool.query('SELECT 1');
});

afterAll(async () => {
  // Close connection pool after all tests
  await pool.end();
});
