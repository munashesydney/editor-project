-- 1. Create a public users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Policy: Users can view and update their own data
create policy "Users can view own data." on public.users 
  for select using (auth.uid() = id);

create policy "Users can update own data." on public.users 
  for update using (auth.uid() = id);

-- 2. Create a trigger to automatically create a public.user when an auth.user is created
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create Workspaces table
create table public.workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on workspaces
alter table public.workspaces enable row level security;

-- Policy: Users can view and create workspaces they own
create policy "Users can view their own workspaces." on public.workspaces 
  for select using (auth.uid() = owner_id);

create policy "Users can create workspaces." on public.workspaces 
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own workspaces." on public.workspaces 
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own workspaces." on public.workspaces 
  for delete using (auth.uid() = owner_id);
