-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.customer_system (
    system_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    PRIMARY KEY (system_id, customer_id)
);

ALTER TABLE public.customer_system
    ADD CONSTRAINT fk_customer_systems_customer_id FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_customer_systems_system_id FOREIGN KEY (system_id) REFERENCES public.system(id) ON DELETE CASCADE;

CREATE INDEX customers_system_customer_idx ON customer_system (customer_id);
CREATE INDEX customers_system_system_idx ON customer_system (system_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.customer_system;
