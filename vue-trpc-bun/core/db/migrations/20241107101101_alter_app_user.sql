-- migrate:up
ALTER TABLE app_user ADD COLUMN microsoft_graph_id text;

-- migrate:down
ALTER TABLE app_user DROP COLUMN microsoft_graph_id;
