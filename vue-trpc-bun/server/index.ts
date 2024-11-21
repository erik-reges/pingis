import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";
import superjson from "superjson";
import { db } from "../core/src";
import type { DB } from "../core/src";
import { eq, desc, or, sql } from "drizzle-orm";
import { player, result } from "../core/src/drizzle/schema";

interface Context {
  db: DB;
}
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const appRouter = t.router({
  pingis: t.router({
    recordMatch: t.procedure
      .input(
        z.object({
          player1: z.string(),
          player2: z.string(),
          player1Score: z.number(),
          player2Score: z.number(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const newResult = await ctx.db
            .insert(result)
            .values({
              player1: input.player1,
              player2: input.player2,
              player1Score: input.player1Score,
              player2Score: input.player2Score,
            })
            .returning();
          return newResult[0];
        } catch (error) {
          throw new Error("Failed to record match");
        }
      }),

    getLeaderboard: t.procedure.query(async ({ ctx }) => {
      const matches = await ctx.db.select().from(result);
      const playerStats = new Map();

      matches.forEach((match) => {
        if (!playerStats.has(match.player1)) {
          playerStats.set(match.player1, { wins: 0, matches: 0 });
        }
        const player1Stats = playerStats.get(match.player1);
        player1Stats.matches++;
        if (match.player1Score > match.player2Score) player1Stats.wins++;

        if (!playerStats.has(match.player2)) {
          playerStats.set(match.player2, { wins: 0, matches: 0 });
        }
        const player2Stats = playerStats.get(match.player2);
        player2Stats.matches++;
        if (match.player2Score > match.player1Score) player2Stats.wins++;
      });

      const leaderboard = Array.from(playerStats.entries())
        .map(([name, stats]) => ({
          name,
          matches: stats.matches,
          wins: stats.wins,
          winRate: ((stats.wins / stats.matches) * 100).toFixed(1),
        }))
        .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

      return leaderboard;
    }),
  }),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type,authorization,x-trpc-source", // Explicitly list allowed headers
  "Access-Control-Allow-Credentials": "true",
};

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (url.pathname.includes("trpc")) {
      try {
        const response = await fetchRequestHandler({
          endpoint: "/trpc",
          req,
          router: appRouter,
          createContext: async () => ({
            db: db,
          }),
        });

        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        return response;
      } catch (error) {
        console.error("TRPC error:", error);
        return new Response(
          JSON.stringify({ error: "Internal Server Error" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
});

console.log(`Server running at http://localhost:${server.port}`);

export type AppRouter = typeof appRouter;
