-- migrate:up

SET ROLE hub_database_admin;

CREATE TABLE public.commit (
    id varchar(200) NOT NULL PRIMARY KEY,
    created_by varchar(200) NOT NULL,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    commit_created_at timestamp NOT NULL,
    message text NOT NULL,
    repo varchar(200) NOT NULL,
    branch varchar(200) NOT NULL,
    author varchar(200),
    user_id uuid DEFAULT NULL,
    time_entry_id uuid
);

ALTER TABLE public.commit
    ADD CONSTRAINT commit_time_entry_id_fkey FOREIGN KEY (time_entry_id) REFERENCES public.time_entry(id) ON DELETE SET NULL;

CREATE INDEX commit_idx ON commit (time_entry_id);
CREATE INDEX commit_app_user_idx ON commit (user_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.commit;
