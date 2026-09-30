/*
# Create helper_locations table for live volunteer tracking

1. New Tables
- `helper_locations`
  - `id` (text, primary key) — helper phone number used as identifier
  - `helper_name` (text) — display name of the volunteer
  - `task_id` (text) — the listing/task being delivered
  - `lat` (double precision) — current latitude
  - `lon` (double precision) — current longitude
  - `heading` (double precision) — direction of travel in degrees
  - `updated_at` (timestamptz) — last position update timestamp

2. Security
- Enable RLS on `helper_locations`.
- Allow anon + authenticated full CRUD — this is a demo app with no Supabase auth;
  data is intentionally shared/public so the anon-key client can read and write.
- Realtime replication enabled so position updates stream to all connected clients.

3. Realtime
- ALTER TABLE ... REPLICA IDENTITY FULL so UPDATE events carry both old and new row data.
- Add table to the Supabase Realtime publication.
*/

CREATE TABLE IF NOT EXISTS helper_locations (
  id text PRIMARY KEY,
  helper_name text NOT NULL DEFAULT 'Volunteer',
  task_id text,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  heading double precision DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE helper_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_helper_locations" ON helper_locations;
CREATE POLICY "anon_select_helper_locations" ON helper_locations FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_helper_locations" ON helper_locations;
CREATE POLICY "anon_insert_helper_locations" ON helper_locations FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_helper_locations" ON helper_locations;
CREATE POLICY "anon_update_helper_locations" ON helper_locations FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_helper_locations" ON helper_locations;
CREATE POLICY "anon_delete_helper_locations" ON helper_locations FOR DELETE
TO anon, authenticated USING (true);

ALTER TABLE helper_locations REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'helper_locations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.helper_locations;
  END IF;
END $$;
