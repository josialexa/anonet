SELECT * FROM users AS u
INNER JOIN rooms AS r
ON u.id = r.user_id
INNER JOIN moderators AS m
ON m.room_id = r.id
INNER JOIN ban AS b
ON b.room_id = r.id;
