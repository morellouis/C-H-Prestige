-- Table des avis clients
create table if not exists avis (
  id uuid default gen_random_uuid() primary key,
  auteur text not null,
  texte text not null,
  achat text,
  note integer not null default 5 check (note >= 1 and note <= 5),
  publie boolean default true,
  ordre integer default 0,
  created_at timestamp with time zone default now()
);

alter table avis enable row level security;

-- Lecture publique uniquement des avis publiés
create policy "Lecture publique des avis publiés" on avis
  for select using (publie = true);

-- Modif admin (à durcir plus tard avec une vraie auth Supabase)
create policy "Modification admin" on avis
  for all using (true);

-- Quelques avis de démarrage (à remplacer par les vrais)
insert into avis (auteur, texte, achat, note, ordre) values
  ('Alexandre M.', 'Service impeccable, pièce authentique et livrée en 24h. Je recommande sans hésiter.', 'Louis Vuitton Keepall', 5, 1),
  ('Sophie L.', 'Une équipe à l''écoute qui a réussi à trouver le modèle exact que je cherchais depuis des mois. Merci !', 'Chanel Classic Flap', 5, 2),
  ('Karim B.', 'Excellente authentification, packaging soigné, et un suivi parfait du début à la fin.', 'Air Jordan 1 Dior', 5, 3),
  ('Camille R.', 'C&H Prestige est devenu mon référent pour toutes mes pièces de luxe. Sérieux et réactif.', 'Hermès Birkin 30', 5, 4)
on conflict do nothing;
