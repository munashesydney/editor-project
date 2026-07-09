-- Create enum for AI job status
create type public.ai_job_status as enum ('pending', 'processing', 'completed', 'failed');

-- Create updated_at function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create the ai_jobs table
create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  project_id uuid references public.projects(id),
  prompt text not null,
  status public.ai_job_status not null default 'pending',
  response_text text,
  response_elements jsonb,
  error_message text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.ai_jobs enable row level security;

-- Create policies
create policy "Users can view their own ai jobs"
  on public.ai_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ai jobs"
  on public.ai_jobs for insert
  with check (auth.uid() = user_id);

-- Add updated_at trigger
create trigger set_updated_at
  before update on public.ai_jobs
  for each row
  execute function public.handle_updated_at();

-- Enable realtime for the table
alter publication supabase_realtime add table public.ai_jobs;
