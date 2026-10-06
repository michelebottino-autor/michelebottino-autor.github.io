-- Michele Bottino — reazioni articoli, schema iniziale
create table if not exists public.article_reactions (
  article_slug text not null,
  device_id uuid not null,
  reaction text not null check (reaction in ('like','dislike')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (article_slug, device_id)
);
alter table public.article_reactions enable row level security;
revoke all on table public.article_reactions from anon, authenticated;
create or replace function public.article_reaction_counts(p_article_slug text)
returns table(reaction text,total bigint)
language sql security definer set search_path=''
as $$ select ar.reaction,count(*) from public.article_reactions ar where ar.article_slug=p_article_slug group by ar.reaction; $$;
create or replace function public.set_article_reaction(p_article_slug text,p_device_id uuid,p_reaction text)
returns table(reaction text,total bigint)
language plpgsql security definer set search_path=''
as $$
begin
 if p_reaction not in ('like','dislike') then raise exception 'invalid reaction'; end if;
 insert into public.article_reactions(article_slug,device_id,reaction) values(p_article_slug,p_device_id,p_reaction)
 on conflict(article_slug,device_id) do update set reaction=excluded.reaction,updated_at=now();
 return query select ar.reaction,count(*) from public.article_reactions ar where ar.article_slug=p_article_slug group by ar.reaction;
end; $$;
revoke execute on function public.article_reaction_counts(text) from public;
revoke execute on function public.set_article_reaction(text,uuid,text) from public;
grant execute on function public.article_reaction_counts(text) to anon,authenticated;
grant execute on function public.set_article_reaction(text,uuid,text) to anon,authenticated;
