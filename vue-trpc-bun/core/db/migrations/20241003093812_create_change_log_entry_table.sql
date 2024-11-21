-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.change_log_entry (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    category_id uuid NOT NULL,
    system_id uuid NOT NULL,
    description character varying(200) NOT NULL,
    date timestamp without time zone NOT NULL
);

ALTER TABLE public.change_log_entry
    ADD CONSTRAINT fk_change_log_entries_category_id FOREIGN KEY (category_id) REFERENCES public.category(id),
    ADD CONSTRAINT fk_change_log_entries_system_id FOREIGN KEY (system_id) REFERENCES public.system(id);

CREATE INDEX change_log_entry_category_idx ON change_log_entry (category_id);
CREATE INDEX change_log_entry_system_idx ON change_log_entry (system_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.change_log_entry;
