-- Table des messages de contact
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  email text not null,
  sujet text,
  message text not null,
  lu boolean default false,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

-- N'importe qui peut écrire un message (formulaire public)
create policy "Insertion publique" on messages
  for insert with check (true);

-- Lecture/modif/suppression seulement côté admin
-- (pour l'instant ouvert, à durcir avec une vraie auth Supabase plus tard)
create policy "Lecture admin" on messages
  for select using (true);

create policy "Modification admin" on messages
  for update using (true);

create policy "Suppression admin" on messages
  for delete using (true);
