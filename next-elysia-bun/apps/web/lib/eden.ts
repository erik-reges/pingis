import { treaty } from "@elysiajs/eden";
import { App } from "../../server/src";

export const api = treaty<App>("localhost:3005", {
  fetch: {
    cache: "no-store",
  },
});
