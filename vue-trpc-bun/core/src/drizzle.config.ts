import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV,
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_DB,
  DATABASE_URL,
  DB_PORT,
} = process.env;

let dbCredentials: any;

if (NODE_ENV === "production") {
  dbCredentials = {
    host: `/cloudsql/${PG_HOST}`,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DB,
    port: parseInt(DB_PORT || "5432", 10),
  };
} else {
  dbCredentials = {
    url: DATABASE_URL,
    user: PG_USER,
    port: parseInt(DB_PORT || "5432", 10),
  };
}

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials,
} satisfies Config;
