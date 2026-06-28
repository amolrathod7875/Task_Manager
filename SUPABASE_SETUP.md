# Supabase Integration Guide

## 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Environment Variables (.env.local)

Create `.env.local` with your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase project Settings > API.

## 3. Database Schema (Run in Supabase SQL Editor)

```sql
-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date timestamp,
  priority integer default 4,
  project_id text,
  completed boolean default false,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table tasks enable row level security;

-- Drop existing policies if needed
drop policy if exists "Users can view their own tasks" on tasks;
drop policy if exists "Users can insert their own tasks" on tasks;
drop policy if exists "Users can update their own tasks" on tasks;
drop policy if exists "Users can delete their own tasks" on tasks;

-- Create policies
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
```

## 4. File Structure Created

```
lib/supabase/
├── client.ts       # Browser client
├── server.ts       # Server client with cookie support
└── types.ts        # Database types

middleware.ts       # Auth session protection
actions/tasks.ts    # Server Actions
```

## 5. Deployment to Vercel

Add the same environment variables in Vercel project settings:
- Go to Project Settings > Environment Variables
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`