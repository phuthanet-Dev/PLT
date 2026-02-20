-- =============================================================
-- Pet Adoption Website - Database Schema
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor)
-- =============================================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  phone text,
  line_id text,
  created_at timestamptz default now()
);

-- 2. Pets table
create table if not exists public.pets (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  species text not null check (species in ('dog','cat','bird','rabbit','other')),
  breed text,
  age_text text,
  gender text check (gender in ('male','female','unknown')),
  description text,
  image_urls text[] default '{}',
  province text,
  status text default 'available' check (status in ('available','adopted','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Row Level Security
alter table public.profiles enable row level security;
alter table public.pets enable row level security;

-- 4. Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- 5. Pets policies
create policy "Pets are viewable by everyone"
  on pets for select using (true);

create policy "Authenticated users can insert pets"
  on pets for insert with check (auth.uid() = owner_id);

create policy "Users can update own pets"
  on pets for update using (auth.uid() = owner_id);

create policy "Users can delete own pets"
  on pets for delete using (auth.uid() = owner_id);

-- 6. Function to auto-create profile on sign up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- 7. Trigger to auto-create profile
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Create storage bucket for pet images
-- NOTE: Run this separately or via Supabase Dashboard -> Storage
-- insert into storage.buckets (id, name, public)
-- values ('pet-images', 'pet-images', true);
