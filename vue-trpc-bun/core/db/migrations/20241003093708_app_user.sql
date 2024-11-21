-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.app_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    provider_id varchar(200) NOT NULL,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    email varchar(200) UNIQUE NOT NULL,
    associated_emails varchar(200)[]
);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.app_user;
