DELETE FROM moderator
WHERE user_id = $1
AND room_id = $2;