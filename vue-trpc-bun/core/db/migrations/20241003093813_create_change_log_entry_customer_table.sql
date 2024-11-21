-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.change_log_entry_customer (
    change_log_entries_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    PRIMARY KEY (change_log_entries_id, customer_id)
);

ALTER TABLE public.change_log_entry_customer
    ADD CONSTRAINT fk_change_log_entries_customers_change_log_entries_id FOREIGN KEY (change_log_entries_id) REFERENCES public.change_log_entry(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_change_log_entries_customers_customer_id FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE;

CREATE INDEX change_log_entry_customers_entries_idx ON change_log_entry_customer (change_log_entries_id);
CREATE INDEX change_log_entry_customers_customer_idx ON change_log_entry_customer (customer_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.change_log_entry_customer;
