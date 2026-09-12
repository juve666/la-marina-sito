-- Aggiunge il campo foto a giocatori e dirigenza
alter table players add column if not exists photo_url text;
alter table staff add column if not exists photo_url text;

-- Tabella classifica del girone (aggiornata manualmente dall'admin)
create table if not exists standings (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  played int default 0,
  won int default 0,
  drawn int default 0,
  lost int default 0,
  goals_for int default 0,
  goals_against int default 0,
  points int default 0,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table standings enable row level security;

create policy "Lettura pubblica" on standings for select using (true);
