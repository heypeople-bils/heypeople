-- HEYPEOPLE - Domanda del giorno + Risposte feed
-- Esegui nel SQL Editor di Supabase.

create table if not exists public.daily_questions (
  id bigserial primary key,
  question_text text not null,
  is_active boolean not null default false,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (date_trunc('day', now()) + interval '1 day' - interval '1 second'),
  created_at timestamptz not null default now()
);

create table if not exists public.replies (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reply_text text not null check (char_length(reply_text) between 1 and 280),
  created_at timestamptz not null default now()
);

alter table public.daily_questions enable row level security;
alter table public.replies enable row level security;

drop policy if exists "daily_questions_select_auth" on public.daily_questions;
create policy "daily_questions_select_auth"
on public.daily_questions
for select
to authenticated
using (true);

drop policy if exists "replies_select_auth" on public.replies;
create policy "replies_select_auth"
on public.replies
for select
to authenticated
using (true);

drop policy if exists "replies_insert_own" on public.replies;
create policy "replies_insert_own"
on public.replies
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "replies_update_own" on public.replies;
create policy "replies_update_own"
on public.replies
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "replies_delete_own" on public.replies;
create policy "replies_delete_own"
on public.replies
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists replies_created_at_idx on public.replies(created_at desc);
create index if not exists replies_user_id_idx on public.replies(user_id);

-- Seed domanda attiva di esempio (una sola attiva alla volta).
update public.daily_questions set is_active = false where is_active = true;
insert into public.daily_questions (question_text, is_active)
values ('Qual è l''ultima cosa che ti ha fatto sorridere davvero?', true);
