DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friend_status;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100),
    last VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio VARCHAR(500),
    imgUrl VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_status(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
)
