DELETE FROM bans AS b
USING rooms AS r
WHERE b.room_id = r.id
AND r.owner = $1;

DELETE FROM bans
WHERE user_id = $1;

DELETE FROM bans
WHERE banned_by = $1;

DELETE FROM moderator AS m
USING rooms AS r
WHERE m.room_id = r.id
AND r.owner = $1;

DELETE FROM moderator
WHERE user_id = $1;

DELETE FROM rooms
WHERE owner = $1;

DELETE FROM users
WHERE id = $1;