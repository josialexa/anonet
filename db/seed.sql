CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(55),
  hash TEXT,
  user_since TIMESTAMP
);