import { pool } from '../config/db';

export interface Event {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  date: Date;
  location: string;
  created_at: Date;
  updated_at: Date;
}

export const createEvent = async (ownerId: number, name: string, description: string, date: string, location: string): Promise<Event> => {
  const query = `
    INSERT INTO events (owner_id, name, description, date, location)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [ownerId, name, description, date, location];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getEvents = async (
  page: number, 
  limit: number, 
  search?: string, 
  dateFilter?: string, 
  locationFilter?: string,
  sortBy: string = 'date',
  sortDir: 'ASC' | 'DESC' = 'ASC',
  ownerId?: number
): Promise<{ events: Event[], total: number }> => {
  const offset = (page - 1) * limit;
  const values: any[] = [];
  let whereClauses: string[] = [];

  if (search) {
    values.push(`%${search}%`);
    whereClauses.push(`name ILIKE $${values.length}`);
  }
  
  if (dateFilter) {
    values.push(dateFilter);
    whereClauses.push(`date = $${values.length}`);
  }

  if (locationFilter) {
    values.push(`%${locationFilter}%`);
    whereClauses.push(`location ILIKE $${values.length}`);
  }

  if (ownerId) {
    values.push(ownerId);
    whereClauses.push(`owner_id = $${values.length}`);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
  // Safe sort column to prevent SQL injection
  const safeSortBy = ['date', 'name', 'created_at'].includes(sortBy) ? sortBy : 'date';

  const dataQuery = `
    SELECT * FROM events 
    ${whereString} 
    ORDER BY ${safeSortBy} ${sortDir} 
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  
  const countQuery = `SELECT COUNT(*) FROM events ${whereString}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [...values, limit, offset]),
    pool.query(countQuery, values)
  ]);

  return {
    events: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10)
  };
};

export const getEventById = async (id: number): Promise<Event | null> => {
  const query = `SELECT * FROM events WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const updateEvent = async (id: number, name: string, description: string, date: string, location: string): Promise<Event | null> => {
  const query = `
    UPDATE events 
    SET name = $1, description = $2, date = $3, location = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
  `;
  const values = [name, description, date, location, id];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

export const deleteEvent = async (id: number): Promise<boolean> => {
  const query = `DELETE FROM events WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};
