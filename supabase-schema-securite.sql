-- ============================================================
--  DURCISSEMENT DES RLS — À EXÉCUTER DANS LE SQL EDITOR SUPABASE
--  Après ça, la clé anon (navigateur) ne peut PLUS écrire.
--  Toutes les écritures passent par les API routes serveur
--  (service-role + vérification du cookie JWT admin).
-- ============================================================

-- ---------- PRODUITS : lecture publique, écriture interdite à anon ----------
alter table produits enable row level security;

drop policy if exists "Lecture publique" on produits;
drop policy if exists "Modification admin" on produits;
drop policy if exists "produits_select_public" on produits;

create policy "produits_select_public" on produits
  for select using (true);
-- (aucune policy insert/update/delete → anon bloqué ; service-role bypass RLS)

-- ---------- AVIS : lecture des publiés uniquement, écriture interdite ----------
alter table avis enable row level security;

drop policy if exists "Lecture publique des avis publiés" on avis;
drop policy if exists "Modification admin" on avis;
drop policy if exists "avis_select_publies" on avis;

create policy "avis_select_publies" on avis
  for select using (publie = true);

-- ---------- MESSAGES : AUCUN accès anon (ni lecture, ni écriture) ----------
-- L'insertion se fait via /api/contact (service-role + rate-limit + honeypot)
alter table messages enable row level security;

drop policy if exists "Insertion publique" on messages;
drop policy if exists "Lecture admin" on messages;
drop policy if exists "Modification admin" on messages;
drop policy if exists "Suppression admin" on messages;
-- (aucune policy → anon totalement bloqué sur messages)

-- ---------- STORAGE : images en lecture publique, upload interdit à anon ----------
drop policy if exists "Images publiques" on storage.objects;
drop policy if exists "Upload admin" on storage.objects;
drop policy if exists "Update admin" on storage.objects;
drop policy if exists "Delete admin" on storage.objects;
drop policy if exists "storage_select_public" on storage.objects;

create policy "storage_select_public" on storage.objects
  for select using (bucket_id = 'produits-images');
-- (upload/update/delete : service-role uniquement via l'API)

-- ============================================================
--  Vérification : ces requêtes doivent renvoyer les policies ci-dessus
--  select tablename, policyname, cmd from pg_policies
--    where tablename in ('produits','avis','messages','objects');
-- ============================================================
