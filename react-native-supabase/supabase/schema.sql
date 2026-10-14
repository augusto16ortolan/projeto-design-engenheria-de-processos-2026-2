-- Cena Marcada: execute este arquivo no SQL Editor de um projeto Supabase novo.
-- O nome é salvo no próprio usuário durante o cadastro:
-- supabase.auth.signUp({ email, password, options: { data: { name } } })
-- As obras pertencem diretamente a auth.users por meio de user_id.

begin;

create table public.works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('movie', 'series')),
  title text not null check (char_length(btrim(title)) > 0),
  image_url text,
  synopsis text,
  status text not null check (status in ('want_to_watch', 'watching', 'watched')),
  created_at timestamptz not null default now()
);

create index works_user_id_idx on public.works (user_id);
create index works_user_status_idx on public.works (user_id, status);
create index works_user_type_idx on public.works (user_id, type);

-- A Data API só permite acesso à tabela pública após grants e políticas.
revoke all on table public.works from anon, authenticated;
grant select, insert, update, delete on table public.works to authenticated;

alter table public.works enable row level security;

create policy "Usuários leem as próprias obras"
on public.works for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Usuários criam as próprias obras"
on public.works for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Usuários atualizam as próprias obras"
on public.works for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Usuários excluem as próprias obras"
on public.works for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

commit;
