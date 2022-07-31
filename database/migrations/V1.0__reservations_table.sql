CREATE SCHEMA reservations;

CREATE TABLE reservations.reservations (
    id UUID NOT NULL PRIMARY KEY,
    customer_email VARCHAR,
    customer_name VARCHAR,
    checkin DATE,
    checkout DATE,
    num_adults INTEGER,
    num_children INTEGER,
    room_type TEXT,
    special_requests TEXT
  
);