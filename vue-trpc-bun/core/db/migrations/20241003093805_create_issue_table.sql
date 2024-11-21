-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.issue (
    id varchar(200) NOT NULL PRIMARY KEY,
    parent_id character varying(200),
    account_id character varying(200),
    created_by varchar(200) NOT NULL,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    issue_created_at timestamp NOT NULL,
    title character varying(200),
    description text,
    issue_type character varying(200),
    status character varying(200)
);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.issue;
