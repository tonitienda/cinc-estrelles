
-- This table is a mirror of reservations but with all types set to
-- "string". When we import reservations from the outside world, we might receive
-- reservations with the wrong format. They are alread recorded in the external system
-- (booking.com, etc) so we cannot just reject them. We need to store them and try to 
-- fix them before considering them a reservation
CREATE TABLE reservations.reservation_requests (
    id UUID NOT NULL PRIMARY KEY,
    customer_email VARCHAR,
    customer_name VARCHAR,
    checkin VARCHAR,
    checkout VARCHAR,
    num_adults VARCHAR,
    num_children VARCHAR,
    room_type TEXT,
    special_requests TEXT,
    source_origin VARCHAR,
    source_reservation_id VARCHAR
);