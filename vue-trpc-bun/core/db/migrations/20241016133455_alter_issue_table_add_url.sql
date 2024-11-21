-- migrate:up

SET ROLE hub_database_admin;

ALTER TABLE public.issue
ADD COLUMN url varchar(200);

ALTER TABLE public.issue
ALTER COLUMN url SET DEFAULT NULL;

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.issue;