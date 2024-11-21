-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.outgoing_email (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    time_entry_id UUID,
    web_link VARCHAR(255) NOT NULL,
    desktop_link VARCHAR(255) NOT NULL
);

ALTER TABLE public.outgoing_email
    ADD CONSTRAINT outgoing_email_time_entry_id_fkey FOREIGN KEY (time_entry_id) REFERENCES time_entry(id) ON DELETE SET NULL;

CREATE INDEX outgoing_email_time_entry_idx ON outgoing_email (time_entry_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.outgoing_email;
