CREATE TABLE reservation_drafts (
    id UUID NOT NULL PRIMARY KEY,
    data JSONB
);

CREATE TABLE reservation_draft_events (
    id UUID NOT NULL PRIMARY KEY,
    reservation_draft_id UUID NOT NULL,
    data JSONB
);