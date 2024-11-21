import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import * as schema from "./drizzle/index";

const { PG_USER, PG_DB, PG_HOST, PG_PASSWORD, NODE_ENV } = process.env;

const pool = new Pool({
  connectionString:
    "postgres://erik.celander@reges.se:@127.0.0.1/hub?sslmode=disable",
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
