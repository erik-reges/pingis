-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.commit_issue (
    commit_id varchar(200) NOT NULL,
    issue_id varchar(200) NOT NULL,
    PRIMARY KEY (issue_id, commit_id)
);

ALTER TABLE public.commit_issue
    ADD CONSTRAINT fk_commit_issue_commit_id FOREIGN KEY (commit_id) REFERENCES public.commit(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_commit_issue_issue_id FOREIGN KEY (issue_id) REFERENCES public.issue(id) ON DELETE CASCADE;

CREATE INDEX commit_issue_id_idx ON public.commit_issue (commit_id, issue_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.commit_issue;
