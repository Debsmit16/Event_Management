import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes';
import { pool } from '../config/db';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Clean up users before tests
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@test.com']);
  });



  const testUser = {
    name: 'Test User',
    email: 'jest@test.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
      
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
  });

  it('should not register duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
      
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
      
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
