INSERT INTO users
(username, hash, user_since, primary_color, profile_img_url)
VALUES
($1, $2, CURRENT_TIMESTAMP, $3, $4)
RETURNING *;