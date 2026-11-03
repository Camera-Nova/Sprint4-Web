create table if not exists public.usuarios (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  senha_privada_hash text
);

create table if not exists public.documentos (
  id text primary key,
  usuario_id bigint not null references public.usuarios (id) on delete cascade,
  tipo text not null,
  nome text not null,
  validade date,
  visibilidade text not null default 'privado' check (visibilidade in ('privado', 'publico')),
  qualidade integer not null,
  data timestamptz not null,
  inserido_em timestamptz not null,
  excluido_em timestamptz,
  arquivo text not null
);

create index if not exists documentos_usuario_id_idx on public.documentos (usuario_id);

alter table public.usuarios enable row level security;
alter table public.documentos enable row level security;

revoke all on public.usuarios, public.documentos from anon, authenticated;
grant select, insert, update, delete on public.usuarios, public.documentos to service_role;

insert into public.usuarios (nome, email, senha_hash)
values ('Administrador', 'admin@jovi.com', 'bdc54f9a580c958d1c9dddbd1544e62c$1123c3a3b66cab07aca390ef4d08881c1eb2d98e886f1ab73102df0f98e32a2b')
on conflict (email) do nothing;

insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;
