-- Allow authenticated users to insert their own profile row.
-- Required for upsert calls (e.g. avatar upload) when a profile row
-- doesn't exist yet (users who signed up before the auto-create trigger).
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);
