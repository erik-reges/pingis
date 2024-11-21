ALTER TABLE "matches" ADD COLUMN "player1_elo_change" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "player2_elo_change" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "player1_elo_after" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "player2_elo_after" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "deleted" boolean;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "elo" numeric DEFAULT '1000' NOT NULL;