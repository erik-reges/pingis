CREATE TABLE IF NOT EXISTS "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"player1_id" integer NOT NULL,
	"player2_id" integer NOT NULL,
	"player1_score" integer NOT NULL,
	"player2_score" integer NOT NULL,
	"played_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "players_name_unique" UNIQUE("name"),
	CONSTRAINT "players_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_player1_id_players_id_fk" FOREIGN KEY ("player1_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_player2_id_players_id_fk" FOREIGN KEY ("player2_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
