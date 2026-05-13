-- Créer la table des produits
create table if not exists produits (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  description text,
  prix numeric(10, 2) not null,
  image_url text,
  categorie text,
  en_vedette boolean default false,
  created_at timestamp with time zone default now()
);

-- Activer la lecture publique
alter table produits enable row level security;

create policy "Lecture publique" on produits
  for select using (true);

create policy "Modification admin" on produits
  for all using (true);

-- Bucket de stockage pour les images
insert into storage.buckets (id, name, public)
  values ('produits-images', 'produits-images', true)
  on conflict do nothing;

create policy "Images publiques" on storage.objects
  for select using (bucket_id = 'produits-images');

create policy "Upload admin" on storage.objects
  for insert with check (bucket_id = 'produits-images');

create policy "Update admin" on storage.objects
  for update using (bucket_id = 'produits-images');

create policy "Delete admin" on storage.objects
  for delete using (bucket_id = 'produits-images');
