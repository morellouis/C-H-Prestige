-- Autoriser les notes avec demi-étoiles (0.5, 1, 1.5, ..., 5)
-- À exécuter dans le SQL Editor de Supabase

alter table avis
  drop constraint if exists avis_note_check;

alter table avis
  alter column note type numeric(2,1) using note::numeric(2,1);

alter table avis
  add constraint avis_note_check check (
    note in (0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
  );
