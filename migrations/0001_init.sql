-- Migration number: 0001 	 2024-03-26T16:10:07.073Z

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    hash TEXT NOT NULL UNIQUE,
    form_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);