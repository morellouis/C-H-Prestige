-- Ajouter une colonne pour stocker plusieurs images (tableau d'URLs)
-- À exécuter dans le SQL Editor de Supabase

alter table produits
  add column if not exists images text[] default '{}';

-- (optionnel) Migrer les anciennes image_url vers le tableau images
update produits
  set images = array[image_url]
  where image_url is not null
    and (images is null or array_length(images, 1) is null);
