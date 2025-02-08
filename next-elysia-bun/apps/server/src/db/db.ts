import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const client = new PGlite({ dataDir: "pglite" });
export const db = drizzle({ client, schema });

// Fix the CREATE TABLE queries
await client.query(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    elo NUMERIC NOT NULL DEFAULT 1000,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
