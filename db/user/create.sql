INSERT INTO users
(username, hash, user_since)
VALUES
($1, $2, CURRENT_TIMESTAMP)
RETURNING *;