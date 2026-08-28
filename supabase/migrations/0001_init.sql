-- Copenhagen Academy — core schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Parents (one row per logged-in auth user)
-- ---------------------------------------------------------------------------
create table if not exists parents (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Children / players
-- ---------------------------------------------------------------------------
create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references parents(id) on delete set null,
  name text not null,
  initials text not null,
  age_group text not null,
  position text,
  club text,
  streak_weeks int not null default 0,
  attendance_pct int not null default 0,
  sessions_count int not null default 0,
  technique_score int not null default 0,
  technique_delta int not null default 0,
  tactics_score int not null default 0,
  tactics_delta int not null default 0,
  physical_score int not null default 0,
  physical_delta int not null default 0,
  development_history int[] not null default '{}',
  development_months text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists children_parent_id_idx on children(parent_id);

-- ---------------------------------------------------------------------------
-- Badges
-- ---------------------------------------------------------------------------
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  key text not null,
  label text not null,
  kind text not null check (kind in ('number', 'check', 'text')),
  value text not null default '',
  unlocked boolean not null default false
);

create index if not exists badges_child_id_idx on badges(child_id);

-- ---------------------------------------------------------------------------
-- Teams — real team structure, each with its own billing terms
-- ---------------------------------------------------------------------------
create table if not exists teams (
  id text primary key,
  name text not null,
  weekday text not null,
  time text not null,
  location text not null,
  coach text,
  billing_kind text not null check (billing_kind in ('recurring', 'recurring-promo', 'per-session')),
  price_per_month int,
  cycle_months numeric,
  free_until date,
  price_per_session int,
  frequency text
);

-- ---------------------------------------------------------------------------
-- Enrollments — a child's membership of a team, with the current cycle's
-- payment status. Not used for the per-session workshop team.
-- ---------------------------------------------------------------------------
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  team_id text not null references teams(id),
  cycle_start date not null,
  cycle_end date not null,
  status text not null check (status in ('betalt', 'afventer', 'gratis')),
  created_at timestamptz not null default now()
);

create index if not exists enrollments_child_id_idx on enrollments(child_id);

-- ---------------------------------------------------------------------------
-- Sessions — one calendar occurrence (a team's weekly slot, or a standalone
-- event like Champions Cup). Attendance is per child per date.
-- ---------------------------------------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  team_id text references teams(id),
  session_date date not null,
  weekday text not null,
  title text not null,
  time text not null,
  location text not null,
  type text not null check (type in ('training', 'event')),
  signed_up boolean not null default false,
  price int,
  payment_status text check (payment_status in ('betalt', 'afventer', 'gratis')),
  capacity int,
  coach text,
  created_at timestamptz not null default now()
);

create index if not exists sessions_child_id_idx on sessions(child_id);
create index if not exists sessions_date_idx on sessions(session_date);

-- ---------------------------------------------------------------------------
-- Payment history (receipts)
-- ---------------------------------------------------------------------------
create table if not exists payment_history (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  label text not null,
  paid_on date not null,
  amount int not null,
  method text not null,
  created_at timestamptz not null default now()
);

create index if not exists payment_history_child_id_idx on payment_history(child_id);

-- ---------------------------------------------------------------------------
-- Applications — the public onboarding form. No auth required to submit.
-- ---------------------------------------------------------------------------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  birth_year text not null,
  current_club text,
  parent_email text,
  parent_phone text,
  status text not null default 'ny' check (status in ('ny', 'kontaktet', 'optaget', 'afvist')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table parents enable row level security;
alter table children enable row level security;
alter table badges enable row level security;
alter table teams enable row level security;
alter table enrollments enable row level security;
alter table sessions enable row level security;
alter table payment_history enable row level security;
alter table applications enable row level security;

-- parents: a signed-in user can see/update only their own row.
create policy "parents_select_own" on parents for select using (id = auth.uid());
create policy "parents_update_own" on parents for update using (id = auth.uid());
create policy "parents_insert_self" on parents for insert with check (id = auth.uid());

-- children: a parent can see only their own children. No client-side
-- insert/update/delete — children are enrolled/managed by the club (admin).
create policy "children_select_own" on children for select using (parent_id = auth.uid());

-- badges: visible if the badge belongs to one of the caller's children.
create policy "badges_select_own" on badges for select using (
  exists (select 1 from children c where c.id = badges.child_id and c.parent_id = auth.uid())
);

-- teams: public reference data, safe to read for anyone signed in.
create policy "teams_select_all" on teams for select using (true);

-- enrollments: visible if it belongs to one of the caller's children.
create policy "enrollments_select_own" on enrollments for select using (
  exists (select 1 from children c where c.id = enrollments.child_id and c.parent_id = auth.uid())
);

-- sessions: visible if it belongs to one of the caller's children.
-- No blanket UPDATE policy — toggling signup goes through the
-- toggle_session_signup() function below so parents can only ever flip
-- signed_up on their own children's sessions, never price/payment_status.
create policy "sessions_select_own" on sessions for select using (
  exists (select 1 from children c where c.id = sessions.child_id and c.parent_id = auth.uid())
);

-- payment_history: visible if it belongs to one of the caller's children.
create policy "payment_history_select_own" on payment_history for select using (
  exists (select 1 from children c where c.id = payment_history.child_id and c.parent_id = auth.uid())
);

-- applications: anyone (including anon) can submit one. Nobody can read them
-- back through the client — only the server-side admin panel (service role,
-- which bypasses RLS) can list them.
create policy "applications_insert_public" on applications for insert with check (true);

-- ---------------------------------------------------------------------------
-- toggle_session_signup — the only way a parent can write to `sessions`.
-- Runs as SECURITY DEFINER so it can perform the update despite there being
-- no direct UPDATE grant/policy for the `authenticated` role, but it checks
-- ownership itself before doing anything.
-- ---------------------------------------------------------------------------
create or replace function toggle_session_signup(p_session_id uuid)
returns sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owns boolean;
  v_session sessions;
begin
  select exists (
    select 1
    from sessions s
    join children c on c.id = s.child_id
    where s.id = p_session_id and c.parent_id = auth.uid()
  ) into v_owns;

  if not v_owns then
    raise exception 'not authorized';
  end if;

  update sessions set signed_up = not signed_up
  where id = p_session_id
  returning * into v_session;

  return v_session;
end;
$$;

revoke all on function toggle_session_signup(uuid) from public;
grant execute on function toggle_session_signup(uuid) to authenticated;
