import { pool } from '../config/db';

export interface Participant {
  id: number;
  event_id: number;
  name: string;
  email: string;
  status: 'registered' | 'cancelled';
  cancel_reason?: string;
  registered_at: Date;
  cancelled_at?: Date;
}

export const registerForEvent = async (eventId: number, name: string, email: string): Promise<Participant> => {
  const query = `
    INSERT INTO participants (event_id, name, email)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [eventId, name, email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getParticipantsByEventId = async (eventId: number): Promise<Participant[]> => {
  const query = `SELECT * FROM participants WHERE event_id = $1 ORDER BY registered_at DESC`;
  const { rows } = await pool.query(query, [eventId]);
  return rows;
};

export const cancelRegistration = async (id: number, cancelReason: string): Promise<Participant | null> => {
  const query = `
    UPDATE participants 
    SET status = 'cancelled', cancel_reason = $1, cancelled_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [cancelReason, id];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const getParticipantById = async (id: number): Promise<Participant | null> => {
  const query = `SELECT * FROM participants WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};
