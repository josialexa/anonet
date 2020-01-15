INSERT INTO rooms
(name, topic, owner, created_on, last_used_on)
VALUES
($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);