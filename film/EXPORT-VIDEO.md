# Exporter le film en MP4 sur son PC (Windows)

Le film est dessiné par le code (canevas HTML, 1280×720). L'export rend chaque image et la bande-son, puis assemble un MP4 d'environ 20 min 30 (≈ 40 min à 1 h de calcul, 150 à 300 Mo).

## 1. Installer (une seule fois)
1. **Python 3** : https://www.python.org/downloads/ (cocher « Add python.exe to PATH »).
2. **ffmpeg** : dans PowerShell, `winget install Gyan.FFmpeg`, puis fermer et rouvrir PowerShell.
3. **Playwright** : `pip install playwright` puis `python -m playwright install chromium`.
4. **Git** : https://git-scm.com/download/win (ou télécharger le dépôt en ZIP depuis GitHub).

## 2. Récupérer le dépôt
`git clone https://github.com/corentindebritocanica-cloud/La-Derniere-Danse.git` puis `cd La-Derniere-Danse`

## 3. Lancer l'export
**4K (3840×2160)** : `python film/outils/video.py --4k --out C:\Videos\ldd`
→ `C:\Videos\ldd\la-derniere-danse-4k.mp4` (≈ 1 Go ; prévoir 3 Go libres). Calcul : ≈ 3 h sur un petit processeur 2 cœurs, 1 h 30 à 2 h sur un PC récent.

1080p (compromis) : `python film/outils/video.py --1080 --out C:\Videos\ldd` (≈ 1 à 1 h 30). 720p d'origine : sans option (≈ 40 min).

**Tester d'abord sur un seul plan** (4K, ≈ 3 min) : `python film/outils/video.py 01 --4k --out C:\Videos\ldd` puis ouvrir `plan-01-4k.mp4`.

- Résultat : le film complet, plus un fichier par plan (`plan-XX-4k.mp4`).
- Qualité : `--crf 18` par défaut (plus petit = meilleure image, plus lourd ; 14 à 20 conseillé).
- Un seul plan pour tester (≈ 35 s) : `python film/outils/video.py 01 --out C:\Videos\ldd`
- Si le calcul s'interrompt, relancer seulement les plans manquants : `python film/outils/video.py 07 08 09 --4k --out C:\Videos\ldd`, puis assembler :
  `ffmpeg -f concat -safe 0 -i liste.txt -c copy -movflags +faststart film.mp4` (liste.txt : une ligne `file 'C:/Videos/ldd/plan-01-4k.mp4'` par plan).

Ne pas laisser le PC se mettre en veille pendant le calcul. Les vidéos ne vont pas dans le dépôt (trop lourdes).
