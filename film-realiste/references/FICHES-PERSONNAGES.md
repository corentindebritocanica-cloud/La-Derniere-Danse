# Fiches de cohérence — Célestin et Louise

Les blocs « À COLLER TEL QUEL » sont repris mot pour mot dans chaque prompt d'image. Ne pas les reformuler d'un plan à l'autre : c'est la première règle de cohérence.

## Style commun (tous les plans)

**À COLLER TEL QUEL :**
`detailed gouache illustration, 1920s French art deco poster style, hand-painted, visible brush texture, warm paper grain, limited palette of deep Prussian blue, ink black, brick red and warm cream, soft cinematic lighting, Toulouse December 1925`

**Négatif commun :**
`photo, photorealistic, 3d render, modern clothes, smartphone, neon, text, watermark, signature, extra fingers, deformed hands, blurry, lowres, cartoon chibi`

## Célestin Delacroix (28 ans)

Source : roman et `PROJET.md`. Portrait de référence : `celestin_ref.jpg`.

**À COLLER TEL QUEL :**
`Célestin, a 28-year-old man with tousled dark brown hair, round wire-rimmed glasses, a lopsided smile that starts in the eyes, grey wool waistcoat over a cream shirt with rolled sleeves, a faint smudge of Prussian blue paint on his thumb`

Détails à ne pas perdre : lunettes rondes, cheveux en bataille, gilet gris, chemise crème. Dans la Mini, en décembre : long manteau sombre ajouté par-dessus (liberté signalée, le livre ne le précise pas).

## Louise Sarrail (26 ans)

Source : roman et `PROJET.md`. Portrait de référence : `louise_ref.jpg`.

**À COLLER TEL QUEL :**
`Louise, a 26-year-old woman with a short dark brown bob haircut in 1920s garçonne style, large dark eyes that look a little surprised, a little angry and very attentive, deep red lipstick, champagne-coloured beaded dress`

Détails à ne pas perdre : carré court, grands yeux sombres, rouge à lèvres. Au rebord de la fenêtre : couverture de laine jetée sur les épaules. On ne parle jamais de ses parents.

## La Mini (Citroën Type C)

`small open-top yellow 1920s Citroën Type C two-seater with round headlamps, canvas roof folded back`
Jaune `#e3b23c` (couleur « film » du projet).

## Chopin (le chat)

`large grey cat with yellow eyes, aloof expression`

## Consignes de cohérence des visages

1. **Même bloc de texte** à chaque prompt (voir ci-dessus), jamais de paraphrase.
2. **Même graine** (`seed`) par personnage pour les images fixes (valeurs dans `prompts/essai-etoile-filante.json`).
3. **IP-Adapter** : le portrait de référence est donné au générateur d'image avec une force de 0,5 à 0,6. Plus haut, le rendu redevient une photo sépia ; plus bas, le visage dérive.
4. **Une seule personne nette par image** quand c'est possible. Deux visages dans le même cadre dérivent bien plus vite.
5. **Plans de face ou de trois quarts, expression calme.** Pas de gros plan sur la parole : le modèle vidéo déforme la bouche. Les répliques passent par les cartons du film, comme aujourd'hui.
6. **Mouvement faible** dans le prompt vidéo (« slowly », « gentle »). Plus le mouvement est grand, plus le visage change.
7. **Image de départ = première image du clip** : le modèle vidéo garde le visage de l'image fournie ; c'est elle qu'il faut soigner (la regénérer jusqu'à ce qu'elle soit bonne, en changeant seulement la graine).
8. Si un visage dérive en cours de clip : raccourcir le clip (3 s au lieu de 4) et couper avant la dérive au montage.
