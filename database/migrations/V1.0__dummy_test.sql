CREATE SCHEMA dummy;

CREATE TABLE dummy.test (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(50),
    description TEXT
);