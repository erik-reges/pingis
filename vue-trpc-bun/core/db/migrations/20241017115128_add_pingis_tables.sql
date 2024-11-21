-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.player (
name VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
email VARCHAR(255) NOT NULL
);

CREATE TABLE public.result (
id SERIAL PRIMARY KEY,
game_played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
player1 VARCHAR(255),
player2 VARCHAR(255),
player1_score INTEGER NOT NULL,
player2_score INTEGER NOT NULL
);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.result;
DROP TABLE public.player;

