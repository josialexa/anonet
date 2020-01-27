CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(55),
  hash TEXT,
  user_since TIMESTAMP,
  primary_color VARCHAR(7),
  profile_img_url TEXT
);

-- CREATE TABLE user_settings (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id),
--   primary_color VARCHAR(7),
--   profile_img_url TEXT
-- );

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  topic VARCHAR(500),
  owner INTEGER REFERENCES users(id),
  created_on TIMESTAMP,
  last_used_on TIMESTAMP
);

CREATE TABLE moderator (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
room_id INTEGER REFERENCES rooms(id)
);

CREATE TABLE ban (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  room_id INTEGER REFERENCES rooms(id),
  banned_until TIMESTAMP,
  ban_reason TEXT,
  banned_by INTEGER REFERENCES users(id)
);