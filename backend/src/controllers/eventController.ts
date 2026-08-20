import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as eventModel from '../models/eventModel';

// Schemas
export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    location: z.string().min(3, 'Location must be at least 3 characters'),
  })
});

export const updateEventSchema = createEventSchema; // reuse for now

// Controllers
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, date, location } = req.body;
    const ownerId = req.user!.id; // from auth middleware

    const event = await eventModel.createEvent(ownerId, name, description, date, location);
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const dateFilter = req.query.date as string;
    const locationFilter = req.query.location as string;
    const sortBy = req.query.sortBy as string;
    const sortDir = (req.query.sortDir as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const ownerId = req.query.ownerId ? parseInt(req.query.ownerId as string) : undefined;

    const result = await eventModel.getEvents(page, limit, search, dateFilter, locationFilter, sortBy, sortDir, ownerId);
    
    res.json({
      success: true,
      data: result.events,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid ID' } });

    const event = await eventModel.getEventById(id);
    
    if (!event) {
      return res.status(404).json({ success: false, error: { message: 'Event not found' } });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid ID' } });

    const { name, description, date, location } = req.body;
    const userId = req.user!.id;

    // Check ownership
    const existingEvent = await eventModel.getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({ success: false, error: { message: 'Event not found' } });
    }
    if (existingEvent.owner_id !== userId) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden. You do not own this event.' } });
    }

    const updatedEvent = await eventModel.updateEvent(id, name, description, date, location);
    
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid ID' } });

    const userId = req.user!.id;

    // Check ownership
    const existingEvent = await eventModel.getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({ success: false, error: { message: 'Event not found' } });
    }
    if (existingEvent.owner_id !== userId) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden. You do not own this event.' } });
    }

    await eventModel.deleteEvent(id);
    
    res.json({ success: true, data: { message: 'Event deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
