DELETE FROM rooms
WHERE owner = $1;

DELETE FROM users
WHERE id = $1;