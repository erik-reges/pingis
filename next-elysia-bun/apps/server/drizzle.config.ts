import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/drizzle",
  dialect: "postgresql",
  schema: "./src/db/schema.ts",

  driver: "pglite",
  dbCredentials: {
    url: "./pglite/",
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  entities: {
    roles: {
      provider: "",
      exclude: [],
      include: [],
    },
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
