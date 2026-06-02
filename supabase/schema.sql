-- Blackberry Space — database schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`) to provision
-- the tables, relationships, Row Level Security policies, and the profile
-- auto-creation trigger that the app depends on.

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, mirrored from auth.users.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- snippets: code snippets shared by users.
-- user_id references profiles(id) so PostgREST can embed `profiles(...)`.
-- ---------------------------------------------------------------------------
create table if not exists public.snippets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  description text,
  language    text not null,
  code        text not null,
  tags        text[] not null default '{}',
  credits     text,
  created_at  timestamptz not null default now()
);

create index if not exists snippets_user_id_idx    on public.snippets (user_id);
create index if not exists snippets_created_at_idx on public.snippets (created_at desc);

-- ---------------------------------------------------------------------------
-- favorites: join table between users and snippets.
-- The unique constraint prevents duplicate favorite rows.
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  snippet_id  uuid not null references public.snippets (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, snippet_id)
);

create index if not exists favorites_user_id_idx    on public.favorites (user_id);
create index if not exists favorites_snippet_id_idx on public.favorites (snippet_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.snippets  enable row level security;
alter table public.favorites enable row level security;

-- profiles: world-readable, but a user may only modify their own row.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- snippets: world-readable, but a user may only write their own snippets.
create policy "Snippets are viewable by everyone"
  on public.snippets for select
  using (true);

create policy "Users can insert own snippets"
  on public.snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on public.snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on public.snippets for delete
  using (auth.uid() = user_id);

-- favorites: a user may only see and manage their own favorites.
create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- Pulls name/avatar/username from the OAuth provider metadata (GitHub).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'user_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
