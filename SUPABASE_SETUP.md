# Supabase Integration Guide

## 1. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Find in Supabase: Project Settings > API.

## 3. Database Schema (Supabase SQL Editor)
```sql
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date timestamp,
  priority integer default 4,
  project_id text,
  completed boolean default false,
  completed_at timestamp,
  created_at timestamp default now()
);

alter table tasks enable row level security;

create policy "Users can view their own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks for delete using (auth.uid() = user_id);
```

## 4. File Structure
```
src/lib/supabase/
├── client.ts     # Browser client
├── server.ts     # Server client with cookies
└── types.ts      # Database types

middleware.ts     # Auth protection
src/app/actions/tasks.ts  # Server Actions
```

## 5. Server Actions
- `login(formData)` - Authenticate user, redirects to `/inbox`
- `signUp(formData)` - Create account, redirects to `/login`
- `logout()` - Sign out, redirects to `/login`
- `getTasks()` - Fetch user's tasks
- `addTask(formData)` - Create task
- `updateTaskStatus(formData)` - Toggle completion (updates `completed_at`)
- `deleteTask(formData)` - Remove task

## 6. Deployment
Add the environment variables in Vercel: Project Settings > Environment Variables.