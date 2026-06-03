-- Flawed Frame — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS pieces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  series        TEXT NOT NULL,
  series_number INTEGER NOT NULL,
  edition_label TEXT NOT NULL,
  edition_total INTEGER NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  sold_count    INTEGER DEFAULT 0,
  inscription   TEXT,
  status        TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  series_ends_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  email         TEXT,
  avatar_url    TEXT,
  member_since  DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT UNIQUE NOT NULL,
  user_id           UUID REFERENCES auth.users(id) NOT NULL,
  piece_id          UUID REFERENCES pieces(id) NOT NULL,
  piece_title       TEXT NOT NULL,
  edition_label     TEXT NOT NULL,
  copy_number       INTEGER NOT NULL DEFAULT 1,
  price             DECIMAL(10,2) NOT NULL,
  paypal_order_id   TEXT,
  paypal_capture_id TEXT,
  status            TEXT DEFAULT 'being_prepared'
                    CHECK (status IN ('pending','being_prepared','shipped','delivered')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE pieces   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Pieces: public read, no user writes
CREATE POLICY "pieces_public_read"
  ON pieces FOR SELECT USING (true);

-- Profiles: users manage their own record
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: users manage their own orders
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-create profile on sign-up
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED: Art pieces
-- Adjust series_ends_at dates as needed before running.
-- ============================================================

INSERT INTO pieces (slug, title, series, series_number, edition_label, edition_total, price, sold_count, inscription, status, series_ends_at)
VALUES
  -- Series I: Access (67 days from now)
  ('summit-reserved',  'Summit Reserved',  'Access', 1, '1 of 1',       1,  2400.00, 1, 'the summit was always reserved',    'sold',      NOW() + INTERVAL '67 days'),
  ('horizon-ramp',     'Horizon Ramp',     'Access', 1, '3 of 3',       3,   680.00, 1, 'this way out.',                     'available', NOW() + INTERVAL '67 days'),
  ('written-in-cloud', 'Written in Cloud', 'Access', 1, 'Edition of 10',10,  195.00, 3, 'you left a note in the sky',        'available', NOW() + INTERVAL '67 days'),
  ('the-loop',         'The Loop',         'Access', 1, '1 of 1',       1,  1800.00, 0, 'going around again',                'available', NOW() + INTERVAL '67 days'),
  ('four-fifty-five',  'Four Fifty Five',  'Access', 1, '3 of 3',       3,   750.00, 0, 'the last minute before',            'available', NOW() + INTERVAL '67 days'),
  ('desert-signal',    'Desert Signal',    'Access', 1, 'Edition of 10',10,  220.00, 2, 'something is trying to reach you',  'available', NOW() + INTERVAL '67 days'),

  -- Series II: Almost (23 days — urgent)
  ('the-millimetre',   'The Millimetre',   'Almost', 2, '1 of 1',       1,  3100.00, 1, 'the distance between',              'sold',      NOW() + INTERVAL '23 days'),
  ('tide-and-line',    'Tide & Line',      'Almost', 2, '3 of 3',       3,   590.00, 3, 'it keeps coming back',              'sold',      NOW() + INTERVAL '23 days'),
  ('one-shelf-up',     'One Shelf Up',     'Almost', 2, 'Edition of 10',10,  175.00, 6, 'just out of reach',                 'available', NOW() + INTERVAL '23 days'),
  ('washed-away',      'Washed Away',      'Almost', 2, '1 of 1',       1,  2200.00, 0, 'gone clean',                        'available', NOW() + INTERVAL '23 days'),
  ('the-last-step',    'The Last Step',    'Almost', 2, '3 of 3',       3,   620.00, 2, 'you were so close',                 'available', NOW() + INTERVAL '23 days'),
  ('silver-lining',    'Silver Lining',    'Almost', 2, 'Edition of 10',10,  195.00, 3, 'against all evidence',              'available', NOW() + INTERVAL '23 days')

ON CONFLICT (slug) DO NOTHING;
