
CREATE TABLE reservations (
    id UUID NOT NULL PRIMARY KEY,
    data JSONB
);

CREATE TABLE reservation_events (
    id UUID NOT NULL PRIMARY KEY,
    reservation_id UUID NOT NULL,
    data JSONB
);