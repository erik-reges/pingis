-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "schema_migrations" (
	"version" varchar(128) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"user_id" uuid NOT NULL,
	"time_start" timestamp NOT NULL,
	"time_end" timestamp NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commit" (
	"id" varchar(200) PRIMARY KEY NOT NULL,
	"created_by" varchar(200) NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"commit_created_at" timestamp NOT NULL,
	"message" text NOT NULL,
	"repo" varchar(200) NOT NULL,
	"branch" varchar(200) NOT NULL,
	"author" varchar(200),
	"user_id" uuid,
	"time_entry_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email_domains" varchar[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"name" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outgoing_email" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"time_entry_id" uuid,
	"web_link" varchar(255) NOT NULL,
	"desktop_link" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "issue" (
	"id" varchar(200) PRIMARY KEY NOT NULL,
	"parent_id" varchar(200),
	"account_id" varchar(200),
	"created_by" varchar(200) NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"issue_created_at" timestamp NOT NULL,
	"title" varchar(200),
	"description" text,
	"issue_type" varchar(200),
	"status" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "change_log_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"category_id" uuid NOT NULL,
	"system_id" uuid NOT NULL,
	"description" varchar(200) NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"name" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" varchar(200) NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	"email" varchar(200) NOT NULL,
	"associated_emails" varchar(200)[],
	CONSTRAINT "app_user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commit_issue" (
	"commit_id" varchar(200) NOT NULL,
	"issue_id" varchar(200) NOT NULL,
	CONSTRAINT "commit_issue_pkey" PRIMARY KEY("commit_id","issue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_entry_customer" (
	"customer_id" uuid NOT NULL,
	"time_entry_id" uuid NOT NULL,
	CONSTRAINT "time_entry_customer_pkey" PRIMARY KEY("customer_id","time_entry_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "change_log_entry_customer" (
	"change_log_entries_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	CONSTRAINT "change_log_entry_customer_pkey" PRIMARY KEY("change_log_entries_id","customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_issue" (
	"customer_id" uuid NOT NULL,
	"issue_id" varchar(200) NOT NULL,
	CONSTRAINT "customer_issue_pkey" PRIMARY KEY("customer_id","issue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_system" (
	"system_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"created_at_utc" timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text) NOT NULL,
	CONSTRAINT "customer_system_pkey" PRIMARY KEY("system_id","customer_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_entry" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commit" ADD CONSTRAINT "commit_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "public"."time_entry"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system" ADD CONSTRAINT "system_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system" ADD CONSTRAINT "system_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outgoing_email" ADD CONSTRAINT "outgoing_email_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outgoing_email" ADD CONSTRAINT "outgoing_email_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outgoing_email" ADD CONSTRAINT "outgoing_email_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "public"."time_entry"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry" ADD CONSTRAINT "change_log_entry_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry" ADD CONSTRAINT "change_log_entry_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry" ADD CONSTRAINT "fk_change_log_entries_category_id" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry" ADD CONSTRAINT "fk_change_log_entries_system_id" FOREIGN KEY ("system_id") REFERENCES "public"."system"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commit_issue" ADD CONSTRAINT "fk_commit_issue_commit_id" FOREIGN KEY ("commit_id") REFERENCES "public"."commit"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commit_issue" ADD CONSTRAINT "fk_commit_issue_issue_id" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_entry_customer" ADD CONSTRAINT "fk_time_entry_customer_id" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_entry_customer" ADD CONSTRAINT "fk_time_entry_customer_time_entry_id" FOREIGN KEY ("time_entry_id") REFERENCES "public"."time_entry"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry_customer" ADD CONSTRAINT "fk_change_log_entries_customers_change_log_entries_id" FOREIGN KEY ("change_log_entries_id") REFERENCES "public"."change_log_entry"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "change_log_entry_customer" ADD CONSTRAINT "fk_change_log_entries_customers_customer_id" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_issue" ADD CONSTRAINT "fk_customer_issues_customer_id" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_issue" ADD CONSTRAINT "fk_customer_issues_issue_id" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_system" ADD CONSTRAINT "fk_customer_systems_customer_id" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_system" ADD CONSTRAINT "fk_customer_systems_system_id" FOREIGN KEY ("system_id") REFERENCES "public"."system"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_entry_idx" ON "time_entry" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "commit_app_user_idx" ON "commit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "commit_idx" ON "commit" USING btree ("time_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "outgoing_email_time_entry_idx" ON "outgoing_email" USING btree ("time_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "change_log_entry_category_idx" ON "change_log_entry" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "change_log_entry_system_idx" ON "change_log_entry" USING btree ("system_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "commit_issue_id_idx" ON "commit_issue" USING btree ("commit_id","issue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_entry_customer_customer_idx" ON "time_entry_customer" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_entry_customer_time_entry_idx" ON "time_entry_customer" USING btree ("time_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "change_log_entry_customers_customer_idx" ON "change_log_entry_customer" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "change_log_entry_customers_entries_idx" ON "change_log_entry_customer" USING btree ("change_log_entries_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_issue_customer_idx" ON "customer_issue" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_issue_issue_idx" ON "customer_issue" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_system_customer_idx" ON "customer_system" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_system_system_idx" ON "customer_system" USING btree ("system_id");
*/