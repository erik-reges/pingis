-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.time_entry (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    user_id uuid NOT NULL,
    time_start timestamp NOT NULL,
    time_end timestamp NOT NULL,
    description text NOT NULL
);

ALTER TABLE public.time_entry
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;

CREATE INDEX time_entry_idx ON time_entry (user_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.time_entry;
