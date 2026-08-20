import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as participantModel from '../models/participantModel';
import * as eventModel from '../models/eventModel';

// Schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
  })
});

export const cancelSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Please provide a valid reason (at least 5 characters)'),
  })
});

// Controllers
export const applyToEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId);
    if (isNaN(eventId)) return res.status(400).json({ success: false, error: { message: 'Invalid Event ID' } });

    const { name, email } = req.body;

    // Check if event exists
    const event = await eventModel.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: { message: 'Event not found' } });
    }

    try {
      const participant = await participantModel.registerForEvent(eventId, name, email);
      res.status(201).json({ success: true, data: participant });
    } catch (error: any) {
      // Handle unique constraint violation for duplicate registration
      if (error.code === '23505') { 
        return res.status(409).json({ success: false, error: { message: 'You have already applied for this event with this email' } });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getEventParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId);
    if (isNaN(eventId)) return res.status(400).json({ success: false, error: { message: 'Invalid Event ID' } });
    
    const userId = req.user!.id;

    // Check ownership
    const event = await eventModel.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: { message: 'Event not found' } });
    }
    if (event.owner_id !== userId) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden. You do not own this event.' } });
    }

    const participants = await participantModel.getParticipantsByEventId(eventId);
    res.json({ success: true, data: participants });
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid Participant ID' } });

    const { reason } = req.body;
    const userId = req.user!.id;

    // To cancel a participant, we need to check if the user requesting this is the owner of the event
    const participant = await participantModel.getParticipantById(id);
    if (!participant) {
      return res.status(404).json({ success: false, error: { message: 'Participant not found' } });
    }

    const event = await eventModel.getEventById(participant.event_id);
    if (!event) {
      return res.status(404).json({ success: false, error: { message: 'Associated event not found' } });
    }

    if (event.owner_id !== userId) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden. You do not own this event.' } });
    }

    const updatedParticipant = await participantModel.cancelRegistration(id, reason);
    res.json({ success: true, data: updatedParticipant });
  } catch (error) {
    next(error);
  }
};
