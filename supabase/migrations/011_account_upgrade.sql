-- ─── Account upgrade: profiles extension, follows, race log, avatars bucket ────

-- 1. Extend profiles with public-facing fields
alter table profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists location text,
  add column if not exists website_url text,
  add column if not exists profile_visibility text not null default 'public',
  add column if not exists goal_distance text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_visibility_check'
  ) then
    alter table profiles
      add constraint profiles_visibility_check
      check (profile_visibility in ('public', 'private'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_username_format_check'
  ) then
    alter table profiles
      add constraint profiles_username_format_check
      check (
        username is null
        or (length(username) between 3 and 30 and username ~ '^[a-z0-9_]+$')
      );
  end if;
end
$$;

create unique index if not exists profiles_username_unique
  on profiles (lower(username))
  where username is not null;

create index if not exists idx_profiles_visibility on profiles (profile_visibility);

-- 2. Anyone can view a public profile (in addition to existing owner-read policy)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Anyone can view public profiles'
  ) then
    create policy "Anyone can view public profiles"
      on profiles for select
      using (profile_visibility = 'public');
  end if;
end
$$;

-- 3. Auto-create a profile row whenever a new auth user is created so the
--    public profile route always has a record to render.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created_profile'
  ) then
    create trigger on_auth_user_created_profile
      after insert on auth.users
      for each row execute function public.handle_new_user_profile();
  end if;
end
$$;

-- 4. Follow graph
create table if not exists follows (
  follower_user_id uuid not null references auth.users(id) on delete cascade,
  followed_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_user_id, followed_user_id),
  constraint follows_no_self_follow check (follower_user_id <> followed_user_id)
);

create index if not exists idx_follows_follower on follows (follower_user_id, created_at desc);
create index if not exists idx_follows_followed on follows (followed_user_id, created_at desc);

alter table follows enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'Anyone can view follows'
  ) then
    create policy "Anyone can view follows"
      on follows for select
      using (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'Users can follow others'
  ) then
    create policy "Users can follow others"
      on follows for insert
      with check (auth.uid() = follower_user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'Users can unfollow'
  ) then
    create policy "Users can unfollow"
      on follows for delete
      using (auth.uid() = follower_user_id);
  end if;
end
$$;

-- 5. Race log (lightweight archive of completed plans)
create table if not exists race_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references training_plans(id) on delete set null,
  race_name text,
  race_date date not null,
  distance text not null,
  finish_time text,
  placing text,
  age_group_placing text,
  dnf boolean not null default false,
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_race_results_user_date on race_results (user_id, race_date desc);
create index if not exists idx_race_results_plan on race_results (plan_id);

alter table race_results enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'race_results'
      and policyname = 'Owners can view own race results'
  ) then
    create policy "Owners can view own race results"
      on race_results for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'race_results'
      and policyname = 'Anyone can view race results for public profiles'
  ) then
    create policy "Anyone can view race results for public profiles"
      on race_results for select
      using (
        exists (
          select 1 from profiles
          where profiles.id = race_results.user_id
            and profiles.profile_visibility = 'public'
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'race_results'
      and policyname = 'Owners can insert race results'
  ) then
    create policy "Owners can insert race results"
      on race_results for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'race_results'
      and policyname = 'Owners can update race results'
  ) then
    create policy "Owners can update race results"
      on race_results for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'race_results'
      and policyname = 'Owners can delete race results'
  ) then
    create policy "Owners can delete race results"
      on race_results for delete
      using (auth.uid() = user_id);
  end if;
end
$$;

-- 6. Avatars storage bucket (mirror blog-cover-images pattern)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Anyone can view avatars'
  ) then
    create policy "Anyone can view avatars"
      on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload own avatars'
  ) then
    create policy "Authenticated users can upload own avatars"
      on storage.objects for insert to authenticated
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can update own avatars'
  ) then
    create policy "Authenticated users can update own avatars"
      on storage.objects for update to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete own avatars'
  ) then
    create policy "Authenticated users can delete own avatars"
      on storage.objects for delete to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;

-- 7. Cross-source activity feed view (public_kits + public_training_plans + public blog_posts)
create or replace view account_feed_items as
  select
    'kit'::text                   as item_type,
    pk.id::text                   as item_id,
    pk.user_id                    as author_user_id,
    pk.kit_title                  as title,
    pk.kit_subtitle               as subtitle,
    pk.slug                       as slug,
    pk.published_at               as published_at,
    pk.updated_at                 as updated_at
  from public_kits pk
  union all
  select
    'plan'::text                  as item_type,
    ptp.id::text                  as item_id,
    ptp.user_id                   as author_user_id,
    ptp.plan_title                as title,
    ptp.race_name                 as subtitle,
    ptp.slug                      as slug,
    ptp.published_at              as published_at,
    ptp.updated_at                as updated_at
  from public_training_plans ptp
  union all
  select
    'post'::text                  as item_type,
    bp.id::text                   as item_id,
    bp.author_user_id             as author_user_id,
    bpv.title                     as title,
    bpv.excerpt                   as subtitle,
    bp.slug                       as slug,
    bp.published_at               as published_at,
    bp.updated_at                 as updated_at
  from blog_posts bp
  join blog_post_versions bpv
    on bpv.id = bp.published_version_id
  where bp.visibility = 'public'
    and bp.published_at is not null
    and bp.author_user_id is not null;
