create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  author_user_id uuid references auth.users(id) on delete cascade,
  author_name text not null,
  author_type text not null check (author_type in ('ai', 'member')),
  visibility text not null default 'archived' check (visibility in ('public', 'archived')),
  published_version_id uuid,
  latest_version_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blog_post_versions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references blog_posts(id) on delete cascade,
  title text not null,
  excerpt text not null,
  body_markdown text not null,
  category text not null,
  tags text[] not null default '{}'::text[],
  cover_image_url text,
  read_time text,
  featured boolean not null default false,
  related_slugs text[] not null default '{}'::text[],
  affiliate_products jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  submission_kind text not null check (submission_kind in ('seed', 'initial', 'revision')),
  moderation_status text not null check (moderation_status in ('draft', 'pending_review', 'approved', 'rejected')),
  reviewer_note text,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  reviewed_at timestamptz
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blog_posts_published_version_id_fkey'
  ) then
    alter table blog_posts
      add constraint blog_posts_published_version_id_fkey
      foreign key (published_version_id)
      references blog_post_versions(id)
      on delete set null;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blog_posts_latest_version_id_fkey'
  ) then
    alter table blog_posts
      add constraint blog_posts_latest_version_id_fkey
      foreign key (latest_version_id)
      references blog_post_versions(id)
      on delete set null;
  end if;
end
$$;

create table if not exists blog_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references blog_posts(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  body text not null,
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_visibility_published on blog_posts(visibility, published_at desc);
create index if not exists idx_blog_posts_author_user on blog_posts(author_user_id);
create index if not exists idx_blog_posts_author_type on blog_posts(author_type);
create index if not exists idx_blog_versions_post on blog_post_versions(post_id, created_at desc);
create index if not exists idx_blog_versions_status on blog_post_versions(moderation_status, created_at desc);
create index if not exists idx_blog_comments_post on blog_comments(post_id, created_at asc);
create index if not exists idx_blog_comments_status on blog_comments(moderation_status, created_at desc);

alter table blog_posts enable row level security;
alter table blog_post_versions enable row level security;
alter table blog_comments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Anyone can view public blog posts'
  ) then
    create policy "Anyone can view public blog posts"
      on blog_posts for select
      using (visibility = 'public' and published_version_id is not null);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Authors can view own blog posts'
  ) then
    create policy "Authors can view own blog posts"
      on blog_posts for select
      using (auth.uid() = author_user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Authors can create own blog posts'
  ) then
    create policy "Authors can create own blog posts"
      on blog_posts for insert
      with check (
        author_type = 'member'
        and auth.uid() = author_user_id
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Authors can update own blog posts'
  ) then
    create policy "Authors can update own blog posts"
      on blog_posts for update
      using (auth.uid() = author_user_id)
      with check (
        author_type = 'member'
        and auth.uid() = author_user_id
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_post_versions'
      and policyname = 'Anyone can view approved published blog versions'
  ) then
    create policy "Anyone can view approved published blog versions"
      on blog_post_versions for select
      using (
        moderation_status = 'approved'
        and exists (
          select 1
          from blog_posts
          where blog_posts.published_version_id = blog_post_versions.id
            and blog_posts.visibility = 'public'
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
      and tablename = 'blog_post_versions'
      and policyname = 'Authors can view own blog versions'
  ) then
    create policy "Authors can view own blog versions"
      on blog_post_versions for select
      using (
        exists (
          select 1
          from blog_posts
          where blog_posts.id = blog_post_versions.post_id
            and blog_posts.author_user_id = auth.uid()
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
      and tablename = 'blog_post_versions'
      and policyname = 'Authors can create own blog versions'
  ) then
    create policy "Authors can create own blog versions"
      on blog_post_versions for insert
      with check (
        exists (
          select 1
          from blog_posts
          where blog_posts.id = blog_post_versions.post_id
            and blog_posts.author_user_id = auth.uid()
            and blog_posts.author_type = 'member'
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
      and tablename = 'blog_post_versions'
      and policyname = 'Authors can update own blog versions'
  ) then
    create policy "Authors can update own blog versions"
      on blog_post_versions for update
      using (
        exists (
          select 1
          from blog_posts
          where blog_posts.id = blog_post_versions.post_id
            and blog_posts.author_user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from blog_posts
          where blog_posts.id = blog_post_versions.post_id
            and blog_posts.author_user_id = auth.uid()
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
      and tablename = 'blog_comments'
      and policyname = 'Anyone can view visible blog comments'
  ) then
    create policy "Anyone can view visible blog comments"
      on blog_comments for select
      using (
        moderation_status = 'visible'
        and exists (
          select 1
          from blog_posts
          where blog_posts.id = blog_comments.post_id
            and blog_posts.visibility = 'public'
            and blog_posts.published_version_id is not null
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
      and tablename = 'blog_comments'
      and policyname = 'Authors can view own blog comments'
  ) then
    create policy "Authors can view own blog comments"
      on blog_comments for select
      using (auth.uid() = author_user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_comments'
      and policyname = 'Authors can create own blog comments'
  ) then
    create policy "Authors can create own blog comments"
      on blog_comments for insert
      with check (auth.uid() = author_user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_comments'
      and policyname = 'Authors can update own blog comments'
  ) then
    create policy "Authors can update own blog comments"
      on blog_comments for update
      using (auth.uid() = author_user_id)
      with check (auth.uid() = author_user_id);
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('blog-cover-images', 'blog-cover-images', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Anyone can view blog cover images'
  ) then
    create policy "Anyone can view blog cover images"
      on storage.objects for select
      using (bucket_id = 'blog-cover-images');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload blog cover images'
  ) then
    create policy "Authenticated users can upload blog cover images"
      on storage.objects for insert to authenticated
      with check (
        bucket_id = 'blog-cover-images'
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
      and policyname = 'Authenticated users can update own blog cover images'
  ) then
    create policy "Authenticated users can update own blog cover images"
      on storage.objects for update to authenticated
      using (
        bucket_id = 'blog-cover-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'blog-cover-images'
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
      and policyname = 'Authenticated users can delete own blog cover images'
  ) then
    create policy "Authenticated users can delete own blog cover images"
      on storage.objects for delete to authenticated
      using (
        bucket_id = 'blog-cover-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;
