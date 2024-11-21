-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.time_entry_customer (
    customer_id uuid NOT NULL,
    time_entry_id uuid NOT NULL,
    PRIMARY KEY (customer_id, time_entry_id)
);

ALTER TABLE public.time_entry_customer
    ADD CONSTRAINT fk_time_entry_customer_id FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_time_entry_customer_time_entry_id FOREIGN KEY (time_entry_id) REFERENCES public.time_entry(id) ON DELETE CASCADE;

CREATE INDEX time_entry_customer_customer_idx ON time_entry_customer (customer_id);
CREATE INDEX time_entry_customer_time_entry_idx ON time_entry_customer (time_entry_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.time_entry_customer;
