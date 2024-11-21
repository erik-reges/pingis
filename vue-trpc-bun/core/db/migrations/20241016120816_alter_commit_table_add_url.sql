-- migrate:up

SET ROLE hub_database_admin;

ALTER TABLE public.commit
ADD COLUMN url varchar(200);

ALTER TABLE public.commit
ALTER COLUMN url SET DEFAULT NULL;

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.commit;