-- ============================================================
-- DUX FARM — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Players table
create table if not exists players (
  id              uuid primary key default gen_random_uuid(),
  wallet_address  text unique not null,
  username        text unique not null,
  class           text not null check (class in ('Knight', 'Rogue', 'Wizard')),
  level           int not null default 1,
  xp              int not null default 0,
  farm_earned     numeric not null default 0,  -- lifetime $FARM earned
  farm_balance    numeric not null default 0,  -- current $FARM balance
  nfts_minted     int not null default 0,
  daily_streak    int not null default 0,
  last_active     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Activity events feed
create table if not exists activity_events (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid references players(id) on delete cascade,
  username    text not null,
  class       text not null,
  event_type  text not null check (event_type in ('craft','farm','kill','sell','streak','mint')),
  description text not null,
  value       numeric,
  created_at  timestamptz not null default now()
);

-- Ranking view (pre-sorted, with rank number)
create or replace view ranking as
  select
    *,
    row_number() over (order by farm_earned desc) as rank
  from players
  order by farm_earned desc;

-- Indexes
create index if not exists idx_players_farm_earned on players(farm_earned desc);
create index if not exists idx_players_class on players(class);
create index if not exists idx_activity_created on activity_events(created_at desc);

-- Enable Realtime on activity_events (for the live feed)
alter publication supabase_realtime add table activity_events;

-- ── Seed data (dev only) ─────────────────────────────────────────────────────
insert into players (wallet_address, username, class, level, xp, farm_earned, farm_balance, nfts_minted, daily_streak) values
  ('wallet_1xxx', 'CryptoKnight',   'Knight', 72, 98400, 48200, 12400, 312, 47),
  ('wallet_2xxx', 'ShadowRogue',    'Rogue',  68, 87200, 41800, 9800,  287, 31),
  ('wallet_3xxx', 'ArcaneWizzard',  'Wizard', 65, 82000, 39100, 8200,  241, 28),
  ('wallet_4xxx', 'OrcSlayer99',    'Knight', 61, 74200, 33420, 7100,  198, 14),
  ('wallet_5xxx', 'BoneCollector',  'Rogue',  58, 68000, 29900, 5400,  176, 3),
  ('wallet_6xxx', 'AlchemyMaster',  'Wizard', 55, 62000, 27150, 4800,  152, 22),
  ('wallet_7xxx', 'SkullFarmer',    'Knight', 51, 55000, 23600, 3900,  134, 7),
  ('wallet_8xxx', 'RuneSeeker',     'Wizard', 49, 51000, 21200, 3200,  119, 12),
  ('wallet_9xxx', 'IronHarvester',  'Knight', 46, 47000, 18700, 2800,  98,  5),
  ('wallet_10xx', 'MidnightRogue',  'Rogue',  43, 43000, 16300, 2100,  87,  9)
on conflict do nothing;
