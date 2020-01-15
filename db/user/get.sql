SELECT u.username, s.* FROM users AS u
INNER JOIN user_settings AS s
ON u.id = s.user_id
WHERE u.id = $1;