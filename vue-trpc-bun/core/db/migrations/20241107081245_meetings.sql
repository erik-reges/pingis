-- migrate:up
SET ROLE hub_database_admin;

CREATE TABLE public.meeting (
    id VARCHAR(255) PRIMARY KEY,
    time_entry_id uuid REFERENCES public.time_entry(id),

    created_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_by uuid NOT NULL REFERENCES public.app_user(id),
    updated_at_utc timestamp DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,

    user_id uuid NOT NULL,


    -- Basic meeting info
    subject VARCHAR(255),
    body TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    change_key VARCHAR(255),
    is_cancelled BOOLEAN DEFAULT FALSE,


    meeting_id VARCHAR(255),
    organizer_email VARCHAR(255),
    attendees VARCHAR(255)[]
);

ALTER TABLE public.meeting
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;
CREATE INDEX idx_meeting_user_time ON meeting (user_id, start_time, end_time);
CREATE INDEX idx_meeting_change_key ON meeting(change_key);
CREATE INDEX meeting_idx ON meeting (user_id);

-- migrate:down
SET ROLE hub_database_admin;

DROP TABLE public.meeting;
