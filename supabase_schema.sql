-- ============================================================
-- NANO CAR — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: lost_cars
CREATE TABLE IF NOT EXISTS lost_cars (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate         TEXT NOT NULL,
  brand         TEXT,
  color         TEXT,
  model_year    TEXT,
  location      TEXT NOT NULL,
  owner_name    TEXT NOT NULL,
  owner_phone   TEXT NOT NULL,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'lost'
                  CHECK (status IN ('lost', 'found', 'cancelled')),
  reported_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT plate_not_empty CHECK (char_length(trim(plate)) > 0)
);

-- Auto-normalize plate + update timestamp
CREATE OR REPLACE FUNCTION normalize_plate()
RETURNS TRIGGER AS $$
BEGIN
  NEW.plate = UPPER(TRIM(NEW.plate));
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_normalize_plate
  BEFORE INSERT OR UPDATE ON lost_cars
  FOR EACH ROW EXECUTE FUNCTION normalize_plate();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lost_cars_plate ON lost_cars (plate);
CREATE INDEX IF NOT EXISTS idx_lost_cars_status ON lost_cars (status);
CREATE INDEX IF NOT EXISTS idx_lost_cars_reported_at ON lost_cars (reported_at DESC);

-- RLS
ALTER TABLE lost_cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"   ON lost_cars FOR SELECT USING (true);
CREATE POLICY "Public insert" ON lost_cars FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update"   ON lost_cars FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete"   ON lost_cars FOR DELETE USING (auth.role() = 'authenticated');

-- Seed data (delete before production)
INSERT INTO lost_cars (plate, brand, color, model_year, location, owner_name, owner_phone, notes, status) VALUES
  ('A-1234-MR', 'تويوتا', 'أبيض', '2020', 'حي تفرغ زينة، نواكشوط', 'محمد ولد أحمد', '+222 36001234', 'كورولا بزجاج خلفي مكسور', 'lost'),
  ('B-5678-MR', 'نيسان', 'رمادي', '2019', 'السوق الكبير، نواكشوط', 'فاطمة بنت محمد', '+222 22345678', NULL, 'lost'),
  ('C-9999-MR', 'هيونداي', 'أحمر', '2021', 'حي كرفور، نواكشوط', 'إبراهيم ولد سالم', '+222 46789999', 'توكسون — خدش على الباب الأيمن', 'found');
