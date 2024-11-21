-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.customer_issue (
    customer_id uuid NOT NULL,
    issue_id varchar(200) NOT NULL,
    PRIMARY KEY (customer_id, issue_id)
);

ALTER TABLE public.customer_issue
    ADD CONSTRAINT fk_customer_issues_customer_id FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_customer_issues_issue_id FOREIGN KEY (issue_id) REFERENCES public.issue(id) ON DELETE CASCADE;

CREATE INDEX customer_issue_customer_idx ON customer_issue (customer_id);
CREATE INDEX customer_issue_issue_idx ON customer_issue (issue_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.customer_issue;
