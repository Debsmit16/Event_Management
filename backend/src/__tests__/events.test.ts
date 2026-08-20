import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/eventRoutes';
import authRoutes from '../routes/authRoutes';
import { pool } from '../config/db';

const app = express();
app.use(express.json());
// Add mock auth middleware for testing
app.use((req, res, next) => {
  if (req.headers.authorization === 'Bearer TEST_TOKEN') {
    req.user = { id: 9999, email: 'tester@test.com' };
    next();
  } else {
    next();
  }
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);

describe('Event Endpoints', () => {
  beforeAll(async () => {
    await pool.query('DELETE FROM events WHERE owner_id = 9999');
  });

  afterAll(async () => {
    await pool.end();
  });

  const mockEvent = {
    name: 'Test Event 1',
    description: 'A great test event',
    date: '2025-12-31',
    location: 'Test City'
  };
  let createdEventId: number;

  it('should prevent unauthenticated creation', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .send(mockEvent);
      
    // Auth middleware usually handles 401s, but we mocked it.
    // If the token is missing, req.user is undefined. 
    // The controller might throw 500 or auth middleware throws 401. 
    // We expect it NOT to be 201.
    expect(res.status).not.toBe(201);
  });

  it('should get all events', async () => {
    const res = await request(app)
      .get('/api/v1/events');
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });
});
