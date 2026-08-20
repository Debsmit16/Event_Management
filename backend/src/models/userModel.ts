import { pool } from '../config/db';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export const createUser = async (name: string, email: string, passwordHash: string): Promise<User> => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const values = [name, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const query = `SELECT id, name, email, created_at FROM users WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};
