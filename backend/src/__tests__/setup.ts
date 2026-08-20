import { pool } from '../config/db';

beforeAll(async () => {
  // Ensure we can connect before running tests
  await pool.query('SELECT 1');
});


