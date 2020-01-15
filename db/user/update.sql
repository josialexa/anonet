UPDATE users
SET primary_color = $2,
    profile_img_url = $3
WHERE id = $1
RETURNING *;