UPDATE ban
SET banned_until = $2,
    banned_by = $3,
    ban_reason = $4
WHERE id = $1;