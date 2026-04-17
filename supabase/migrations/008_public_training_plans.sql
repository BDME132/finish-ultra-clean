create table if not exists public_training_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_plan_id uuid not null references training_plans(id) on delete cascade,
  slug text not null unique,
  author_display_name text,
  plan_title text not null,
  race_name text,
  race_date date not null,
  distance text not null,
  level text not null,
  weeks_total integer not null,
  current_weekly_miles integer not null default 0,
  weeks jsonb not null,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_training_plans_user_key unique (user_id),
  constraint public_training_plans_source_plan_key unique (source_plan_id)
);

create index if not exists idx_public_training_plans_slug on public_training_plans(slug);
create index if not exists idx_public_training_plans_published_at on public_training_plans(published_at desc);
create index if not exists idx_public_training_plans_updated_at on public_training_plans(updated_at desc);
create index if not exists idx_public_training_plans_distance_level on public_training_plans(distance, level);

alter table public_training_plans enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'public_training_plans'
      and policyname = 'Anyone can view public training plans'
  ) then
    create policy "Anyone can view public training plans"
      on public_training_plans for select
      using (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'public_training_plans'
      and policyname = 'Users can publish own training plans'
  ) then
    create policy "Users can publish own training plans"
      on public_training_plans for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'public_training_plans'
      and policyname = 'Users can update own public training plans'
  ) then
    create policy "Users can update own public training plans"
      on public_training_plans for update
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'public_training_plans'
      and policyname = 'Users can delete own public training plans'
  ) then
    create policy "Users can delete own public training plans"
      on public_training_plans for delete
      using (auth.uid() = user_id);
  end if;
end
$$;
