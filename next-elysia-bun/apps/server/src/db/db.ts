import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const client = new PGlite({ dataDir: "pglite" });
export const db = drizzle({ client, schema });
await client.query(`
  CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    elo NUMERIC NOT NULL DEFAULT 1000,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER NOT NULL REFERENCES players(id),
    player2_id INTEGER NOT NULL REFERENCES players(id),
    player1_score INTEGER NOT NULL,
    player2_score INTEGER NOT NULL,
    player1_elo_change NUMERIC NOT NULL,
    player2_elo_change NUMERIC NOT NULL,
    player1_elo_after NUMERIC NOT NULL,
    player2_elo_after NUMERIC NOT NULL,
    played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
