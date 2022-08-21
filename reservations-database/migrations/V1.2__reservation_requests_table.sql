CREATE TABLE reservations.reservation_requests (
    id UUID NOT NULL PRIMARY KEY,
    data JSONB
);

CREATE TABLE reservations.reservation_request_events (
    id UUID NOT NULL PRIMARY KEY,
    reservation_request_id UUID NOT NULL,
    data JSONB
);

GRANT INSERT, UPDATE ON reservations.reservation_request_events  TO ruteho;
GRANT INSERT, UPDATE, DELETE ON reservations.reservation_requests  TO ruteho;