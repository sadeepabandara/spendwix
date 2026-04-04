-- Run this in your Supabase SQL editor to set up the database

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  currency text not null default 'USD',
  plan text not null default 'free',
  avatar_url text,
  created_at timestamptz default now()
);

-- Income entries
create table public.income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  name text not null,
  payday text,
  expected numeric not null default 0,
  actual numeric not null default 0,
  start_day text,
  created_at timestamptz default now()
);

-- Bills
create table public.bills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  name text not null,
  due_day text,
  budget numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz default now()
);

-- Expenses
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  name text not null,
  budget numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz default now()
);

-- Savings
create table public.savings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  name text not null,
  budget numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz default now()
);

-- Debt
create table public.debt (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  name text not null,
  budget numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz default now()
);

-- Transactions
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  date text not null,
  amount numeric not null default 0,
  category text not null,
  description text,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.income enable row level security;
alter table public.bills enable row level security;
alter table public.expenses enable row level security;
alter table public.savings enable row level security;
alter table public.debt enable row level security;
alter table public.transactions enable row level security;

-- RLS Policies: users can only see/edit their own data
create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage own income" on public.income for all using (auth.uid() = user_id);
create policy "Users can manage own bills" on public.bills for all using (auth.uid() = user_id);
create policy "Users can manage own expenses" on public.expenses for all using (auth.uid() = user_id);
create policy "Users can manage own savings" on public.savings for all using (auth.uid() = user_id);
create policy "Users can manage own debt" on public.debt for all using (auth.uid() = user_id);
create policy "Users can manage own transactions" on public.transactions for all using (auth.uid() = user_id);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
