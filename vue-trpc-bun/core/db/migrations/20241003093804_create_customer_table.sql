-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.customer (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    name character varying(255) NOT NULL,
    email_domains VARCHAR[] NOT NULL
);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.customer;
