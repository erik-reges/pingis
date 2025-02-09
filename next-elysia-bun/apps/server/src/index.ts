import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { eq, desc, and, or, sql } from "drizzle-orm";
import { db } from "./db/db";
import { Player, Duel } from "teslo";
import { matches, players } from "./db/schema";
import { logger } from "@bogeychan/elysia-logger";
export type NewPlayer = typeof players.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

const app = new Elysia()
  .use(cors())
  .use(
    logger({
      level: "info",
    }),
  )
  .get("/", () => {
    return { message: "hello" };
  })

  .get("/players", async () => {
    return await db.select().from(players);
  })

  .post(
    "/players",
    async ({ body }) => {
      const newPlayer = await db
        .insert(players)
        .values({
          name: body.name,
          elo: "1000",
        })
        .returning();
      return newPlayer[0];
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  )

  .post(
    "/matches",
    async ({ body, log, set, request }) => {
      log.info(`Recording match: ${body.player1Name} vs ${body.player2Name}`);

      log.info(request);

      const [player1] = await db
        .select()
        .from(players)
        .where(eq(players.name, body.player1Name));

      const [player2] = await db
        .select()
        .from(players)
        .where(eq(players.name, body.player2Name));

      if (!player1 || !player2) {
        log.error(
          `Players not found: ${body.player1Name} and/or ${body.player2Name}`,
        );
        set.status = 404;

        return {
          message: `Players not found: ${body.player1Name} and/or ${body.player2Name}`,
        };
      }

      log.info(
        `Players found with initial Elo - ${player1.name}: ${player1.elo}, ${player2.name}: ${player2.elo}`,
      );

      const match = new Duel();
      match.addPlayers(
        new Player(player1.id.toString(), Number(player1.elo)),
        new Player(player2.id.toString(), Number(player2.elo)),
      );

      const winnerId =
        body.player1Score > body.player2Score
          ? player1.id.toString()
          : player2.id.toString();
      const results = match.calculate(winnerId);

      // Calculate Elo changes
      const player1EloChange = results[0].elo - Number(player1.elo);
      const player2EloChange = results[1].elo - Number(player2.elo);

      log.info(
        `Elo changes calculated - ${player1.name}: ${player1EloChange}, ${player2.name}: ${player2EloChange}`,
      );

      // Insert match record
      const newMatch = await db
        .insert(matches)
        .values({
          player1_id: player1.id,
          player2_id: player2.id,
          player1_score: body.player1Score,
          player2_score: body.player2Score,
          player1_elo_change: player1EloChange.toString(),
          player2_elo_change: player2EloChange.toString(),
          player1_elo_after: results[0].elo.toString(),
          player2_elo_after: results[1].elo.toString(),
        })
        .returning();

      log.info(`Match recorded with ID: ${newMatch[0].id}`);

      await db
        .update(players)
        .set({ elo: results[0].elo.toString() })
        .where(eq(players.id, player1.id));

      await db
        .update(players)
        .set({ elo: results[1].elo.toString() })
        .where(eq(players.id, player2.id));

      log.info(
        `Player Elo ratings updated - ${player1.name}: ${results[0].elo}, ${player2.name}: ${results[1].elo}`,
      );

      return newMatch[0];
    },
    {
      body: t.Object({
        player1Name: t.String(),
        player2Name: t.String(),
        player1Score: t.Number(),
        player2Score: t.Number(),
      }),
    },
  )

  .get("/matches", async () => {
    const matchesWithPlayers = await db
      .select({
        id: matches.id,
        player1: players.name,
        player2: {
          name: sql<string>`p2.name`,
        },
        player1_score: matches.player1_score,
        player2_score: matches.player2_score,
        player1_elo_change: matches.player1_elo_change,
        player2_elo_change: matches.player2_elo_change,
        player1_elo_after: matches.player1_elo_after,
        player2_elo_after: matches.player2_elo_after,
        played_at: matches.played_at,
      })
      .from(matches)
      .innerJoin(players, eq(matches.player1_id, players.id))
      .innerJoin(sql`players as p2`, eq(matches.player2_id, sql`p2.id`))
      .orderBy(desc(matches.played_at));
    console.log(matchesWithPlayers);
    return matchesWithPlayers;
  })

  .get("/leaderboard", async () => {
    const stats = await db.execute(sql`
        WITH player_stats AS (
          SELECT
            p.id as player_id,
            p.name,
            p.elo,
            COUNT(*) as matches_played,
            COUNT(
              CASE WHEN
                (m.player1_id = p.id AND m.player1_score > m.player2_score) OR
                (m.player2_id = p.id AND m.player2_score > m.player1_score)
              THEN 1 END
            ) as wins
          FROM players p
          LEFT JOIN matches m ON p.id = m.player1_id OR p.id = m.player2_id
          GROUP BY p.id, p.name, p.elo
        )
        SELECT
          player_id,
          name,
          elo,
          matches_played,
          wins,
          (matches_played - wins) as losses,
          CASE
            WHEN matches_played = 0 THEN 0
            ELSE (CAST(wins AS FLOAT) / matches_played * 100)
          END as win_percentage
        FROM player_stats
        ORDER BY elo DESC, wins DESC
      `);

    return stats.rows;
  })

  .listen(3005);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
export type App = typeof app;
