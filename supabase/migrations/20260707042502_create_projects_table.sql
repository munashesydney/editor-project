-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  canvas_state jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Policies for projects:
-- Since projects belong to a workspace, we check if the user is the owner of the parent workspace.
-- In a real team environment, you would join on a workspace_members table.
-- For this MVP, we join to public.workspaces where owner_id = auth.uid().

create policy "Users can view projects in their workspaces" on public.projects
  for select using (
    exists (
      select 1 from public.workspaces w 
      where w.id = projects.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Users can insert projects into their workspaces" on public.projects
  for insert with check (
    exists (
      select 1 from public.workspaces w 
      where w.id = projects.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Users can update projects in their workspaces" on public.projects
  for update using (
    exists (
      select 1 from public.workspaces w 
      where w.id = projects.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Users can delete projects in their workspaces" on public.projects
  for delete using (
    exists (
      select 1 from public.workspaces w 
      where w.id = projects.workspace_id and w.owner_id = auth.uid()
    )
  );
