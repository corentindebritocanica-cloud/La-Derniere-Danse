# Essai — « L'étoile filante » (chapitre 9)

Pourquoi cette scène : peu de mouvement, ambiance nocturne, un seul visage net par plan. C'est le terrain le plus favorable pour juger le rendu sans que les défauts connus (mains, danse à deux) fassent échouer l'essai. La valse viendra plus tard, si l'essai convainc.

Référence film actuel : `film/src/plan-10.js` (« L'étoile filante », 150 s). On teste seulement trois moments, 4 s chacun.

## Les 3 clips

| Clip | Moment du livre | Image | Ce qu'on évalue |
|---|---|---|---|
| **A — La route** | « Elle apparut au-dessus de la ville, vers l'est… Une ligne de lumière. Une seule. » | Mini jaune au bord d'une route droite, champs gelés, ville au loin, étoile filante. Personne. | Atmosphère, ciel, trait de l'étoile, tenue du style peint |
| **B — Le volant** | « Célestin freina… la tête levée vers le ciel, le cœur battant. » | Célestin de trois quarts, lunettes rondes, lueur du tableau de bord | Fidélité du visage au portrait, souffle dans le froid |
| **C — La fenêtre** | « Même dans le noir, il vit qu'elle pleurait et qu'elle riait en même temps. » | Louise sur le rebord, couverture, Chopin à côté, glycine nue | Visage de Louise, expression, chat, décor Sarrail |

Prompts complets : `prompts/essai-etoile-filante.json`.

## Fidélité au livre

- Décembre : glycine **sans fleurs**, givre, buée, arbres nus.
- Mini : jaune, capote repliée, phares ronds.
- Louise : carré brun, robe champagne perlée (celle du cabaret), couverture sur les épaules.
- Célestin : lunettes rondes, cheveux en bataille. **Liberté signalée** : long manteau sombre dans la Mini (le livre ne parle que de froid).
- Heure : montre à 0 h 48 (le modèle ne sait pas écrire une heure lisible : on l'ajoutera au montage si besoin, dans le style des cartons du film).

## Montage prévu (hors modèle)

1. Carton d'ouverture dans le style actuel : « Minuit quarante-huit. »
2. A → B → C, fondus enchaînés de 0,5 s.
3. Grain léger et vignettage ajoutés par ffmpeg (voir script).
4. Musique : reprendre le thème « le morceau sans nom » du film actuel (export audio du plan 10), pour comparer à bande-son égale.

## Ce qui peut rater (à noter dans `EVALUATION.md`)

- Visage de Louise qui change entre l'image fixe et la fin du clip.
- Style qui glisse vers la photo sépia à cause du portrait de référence.
- Chat déformé.
- Étoile filante trop épaisse ou absente (le modèle l'ignore parfois ; on relance avec une autre graine).
