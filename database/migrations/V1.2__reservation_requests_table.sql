CREATE TABLE reservations.reservation_requests (
    id UUID NOT NULL PRIMARY KEY,
    data JSONB
);

CREATE TABLE reservations.reservation_request_events (
    id UUID NOT NULL PRIMARY KEY,
    reservation_request_id UUID NOT NULL,
    data JSONB
);