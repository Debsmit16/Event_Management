-- Migration 002: Add indexes for performance

-- Index for querying events by owner
CREATE INDEX IF NOT EXISTS idx_events_owner_id ON events(owner_id);

-- Index for querying events by date
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Index for querying participants by event
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
