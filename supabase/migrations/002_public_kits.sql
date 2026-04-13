create table if not exists public_kits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_kit_id text not null,
  slug text not null unique,
  author_display_name text,
  kit_title text not null,
  kit_subtitle text not null,
  race_details jsonb not null,
  items jsonb not null,
  packing_checklist jsonb not null default '[]'::jsonb,
  drop_bag_essentials jsonb not null default '[]'::jsonb,
  testing_timeline jsonb not null default '[]'::jsonb,
  total_cost numeric(10,2) not null default 0,
  preset_id text,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_kits_user_source_key unique (user_id, source_kit_id),
  constraint public_kits_source_saved_kit_fkey
    foreign key (user_id, source_kit_id)
    references saved_kits(user_id, kit_id)
    on delete cascade
);

create index if not exists idx_public_kits_slug on public_kits(slug);
create index if not exists idx_public_kits_published_at on public_kits(published_at desc);
create index if not exists idx_public_kits_updated_at on public_kits(updated_at desc);

alter table public_kits enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'public_kits'
      and policyname = 'Anyone can view public kits'
  ) then
    create policy "Anyone can view public kits"
      on public_kits for select
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
      and tablename = 'public_kits'
      and policyname = 'Users can publish own kits'
  ) then
    create policy "Users can publish own kits"
      on public_kits for insert
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
      and tablename = 'public_kits'
      and policyname = 'Users can update own public kits'
  ) then
    create policy "Users can update own public kits"
      on public_kits for update
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
      and tablename = 'public_kits'
      and policyname = 'Users can delete own public kits'
  ) then
    create policy "Users can delete own public kits"
      on public_kits for delete
      using (auth.uid() = user_id);
  end if;
end
$$;
