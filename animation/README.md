# La Dernière Danse — version motion design (manga, 1925)

Le film refait d'après le script complet, en **16:9 (1920×1080, 24 i/s)**, dans une grammaire de manga de danse : cases qui glissent, trames, lignes de vitesse, gros plans aux grands yeux, onomatopées. Tout est original (personnages, décors, lettrage) : on emprunte la grammaire du genre, pas ses dessins.

**Sans voix.** Les répliques passent par des bulles, la voix off par des récitatifs, et la musique se voit (notes dessinées). Pas de piste sonore : on peut en poser une au montage.

## Les morceaux (`video/`)

| # | Fichier | Contenu |
| --- | --- | --- |
| 00 | `00-prologue.mp4` | L'étoile rouge, le cabaret, le titre |
| 01 | `01-celestin.mp4` | Chapitre 1 |
| 02 | `02-louise.mp4` | Chapitre 2 |
| 03 | `03-le-concours.mp4` | Chapitre 3 |
| 04 | `04-la-marche-jusqua-purpan.mp4` | Chapitre 4 |
| 05 | `05-le-portrait.mp4` | Chapitre 5 |
| 06 | `06-le-diner-avec-henri.mp4` | Chapitre 6 |
| 07 | `07-levasion-par-la-glycine.mp4` | Chapitre 7 |
| 08 | `08-la-soiree-des-lendemains.mp4` | Chapitre 8 |
| 09 | `09-letoile-filante.mp4` | Chapitre 9 |
| 10 | `10-la-semaine-volee.mp4` | Chapitre 10 |
| 11 | `11-le-violon.mp4` | Chapitre 11 |
| 12 | `12-la-derniere-danse.mp4` | Chapitre 12 |
| 13 | `13-epilogue.mp4` | Près d'un siècle plus tard |

Pour assembler le film entier (≈ 18 min) : `cd video && ffmpeg -f concat -safe 0 -i liste.txt -c copy film-complet.mp4` (le fichier complet dépasse la limite de GitHub, il reste en local).

## Refaire un morceau

```
cd animation/src
pip install skia-python numpy pillow     # ffmpeg doit être installé
python3 rendu.py 03                       # → ../video/03-le-concours.mp4
python3 rendu.py 03 --apercu 10 42        # images de contrôle dans ../apercus/
python3 rendu.py tout
```

| Fichier | Rôle |
| --- | --- |
| `moteur.py` | Papier, grain, trames, lignes de vitesse, bulles, récitatifs, cases, cartons, transitions, encodage |
| `persos.py` | Visages manga, pantins articulés (mains placées par cinématique inverse), la Mini, Chopin |
| `decors.py` | Lieux de Toulouse 1925 et papiers d'époque repris des enveloppes (sans les codes) |
| `scenes.py` | Caméra, couple de danse, ombres chinoises, gros plans |
| `seqNN.py` | Un fichier par morceau, plan par plan, numérotés comme le script |

## Écarts volontaires avec le script

- Aucun mot qui évoque le mariage : Henri dit « Je ne suis pas venu pour vous », le grand-père a enfermé son violon « le jour où il a rencontré » Amélie, Julien photographie un monsieur moustachu (pas une mariée).
- Les codes des artefacts (✦ …) n'apparaissent pas.
