-- Import des avis récupérés depuis chprestige.com
-- À exécuter dans le SQL Editor de Supabase

insert into avis (auteur, texte, achat, note, ordre) values
  (
    'Monic Wisselmann',
    'Je n''ai pas de mots pour décrire le service exceptionnel que j''ai reçu de C&H Prestige. Leur équipe s''est surpassée pour répondre à mes besoins et a dépassé toutes mes attentes.',
    null,
    5,
    10
  ),
  (
    'Monic Wisselmann',
    'J''ai été agréablement surprise par la qualité des pièces de seconde main de C&H Prestige. Mon sac est comme neuf et le service client était impeccable. Une expérience de confiance que je recommande !',
    'Sac de seconde main',
    5,
    11
  ),
  (
    'Marc D.',
    'La sélection des matériaux est vraiment soignée. J''ai acheté une paire de chaussures et elles sont d''une qualité exceptionnelle. C&H Prestige a vraiment le sens du détail et du luxe durable.',
    'Chaussures',
    5,
    12
  ),
  (
    'Émilie R.',
    'L''attention portée à chaque étape du service est remarquable. De la navigation sur le site à la réception de mon vêtement, tout était parfait. C&H Prestige, c''est l''assurance d''un achat serein.',
    'Vêtement',
    5,
    13
  );
