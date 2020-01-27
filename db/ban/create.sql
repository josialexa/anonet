INSERT INTO ban
(user_id, room_id, banned_until, ban_reason, banned_by)
VALUES
($1, $2, $3, $4, $5);