# Film « La Dernière Danse » — essai version illustrée détaillée

Branche `essai-realiste`. **Rien n'est modifié dans `film/` ni dans `index.html`.** Tout l'essai vit dans ce dossier. Rien ne sera fusionné dans `main` sans accord explicite.

## Objectif

Tester si l'on peut obtenir, gratuitement, quelques clips plus riches que les silhouettes actuelles : décors peints, visages expressifs, lumière, profondeur. Le rendu visé reste du **dessin** (gouache / affiche art déco, Toulouse, décembre 1925), pas des acteurs photoréalistes.

## Choix techniques

| Étape | Outil | Pourquoi |
|---|---|---|
| Machine | Kaggle Notebooks, GPU gratuit (T4 ×2, 16 Go de VRAM chacun) | Le PC portable (RTX 3050, ~4 Go de VRAM) est trop juste pour un modèle vidéo. |
| Images fixes | SDXL (+ IP-Adapter pour garder les visages) | Tient sur 16 Go, bon rendu « illustration ». |
| Animation | **LTX-Video** en image-vers-vidéo (diffusers) | Le plus léger des modèles ouverts : tient sur 16 Go avec déchargement CPU. |
| Montage | ffmpeg | Recadrage 16:9, grain, fondus. |

**Pourquoi pas Wan 2.2 ?** Sa fiche officielle (version 5B) annonce 24 Go de VRAM pour du 720p. Sur 16 Go, cela demande des réductions de résolution et des essais à tâtons. On le gardera en piste B si LTX-Video déçoit.

## Contenu

| Fichier | Rôle |
|---|---|
| `GUIDE-KAGGLE.md` | Pas à pas pour lancer l'essai |
| `ESSAI-ETOILE-FILANTE.md` | Les 3 clips du chapitre 9 : intention, cadrage, prompts |
| `references/FICHES-PERSONNAGES.md` | Descriptions verrouillées de Célestin et Louise + consignes de cohérence |
| `references/*_ref.jpg` | Portraits de référence (copies de `assets/`) |
| `prompts/essai-etoile-filante.json` | Prompts lus par le script |
| `kaggle/essai_etoile_filante.py` | Script à coller dans un notebook Kaggle (cellules `# %%`) |
| `EVALUATION.md` | Grille pour juger le résultat |

## Règles respectées

- Uniquement les noms fictifs, Célestin et Louise.
- Fidélité au roman ; les libertés sont signalées dans les fichiers.
- Aucun jeton ni mot de passe dans le dépôt.
- Couleurs de la charte : fond `#f1e7d3`, encre `#1a1512`, rouge `#a8201a`, bleu `#1f3a5f`.

## État

Préparé, **non testé sur GPU** (aucun GPU dans cet environnement). La première exécution sur Kaggle sert justement à valider le script ; on corrigera ensemble ce qui casse.
