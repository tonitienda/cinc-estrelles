
CREATE TABLE reservations.reservations (
    id UUID NOT NULL PRIMARY KEY,
    data JSONB
);

CREATE TABLE reservations.reservation_events (
    id UUID NOT NULL PRIMARY KEY,
    reservation_id UUID NOT NULL,
    data JSONB
);


GRANT INSERT, UPDATE ON reservations.reservation_events  TO ruteho;
GRANT INSERT, UPDATE, DELETE ON reservations.reservations  TO ruteho;