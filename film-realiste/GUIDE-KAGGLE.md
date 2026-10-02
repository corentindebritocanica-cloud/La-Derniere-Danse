# Guide pas à pas — lancer l'essai sur Kaggle (gratuit)

Durée : ≈ 1 h de mise en place la première fois, puis les calculs tournent seuls. Aucun paiement, aucune carte bancaire. Rien à installer sur le PC.

## 1. Créer le compte (une fois)

1. Aller sur kaggle.com et créer un compte (adresse e-mail).
2. Ouvrir le profil → **Settings** → vérifier le compte par **numéro de téléphone**. Sans cela, le GPU et Internet restent désactivés dans les notebooks.
3. Le quota gratuit annoncé est d'environ **30 h de GPU par semaine** (à confirmer dans ton profil → « GPU quota »).

## 2. Préparer les fichiers

1. Télécharger le dossier `film-realiste/` de la branche `essai-realiste` (GitHub → bouton « Code » → Download ZIP, puis ne garder que ce dossier), ou me demander de te l'envoyer.
2. Sur Kaggle : **Datasets → New Dataset**, déposer le dossier `film-realiste/` entier (avec `prompts/` et `references/`), le nommer `ldd-essai`, le laisser **privé**.

## 3. Créer le notebook

1. **Code → New Notebook**.
2. Panneau de droite → **Session options** :
   - **Accelerator** : `GPU T4 x2` (si indisponible : `GPU P100`) ;
   - **Internet** : `On`.
3. **Add Input** → ajouter le dataset `ldd-essai`.

## 4. Lancer, cellule par cellule

Ouvrir `kaggle/essai_etoile_filante.py` et coller chaque bloc (séparé par `# %%`) dans une cellule du notebook. **Cellule 1 : retirer le `# ` devant `!pip install`** pour l'activer.

| Cellule | Ce qu'elle fait | Durée indicative (à mesurer) |
|---|---|---|
| 1 | Installe les bibliothèques | 2 à 3 min |
| 2 | Lit les prompts et vérifie le GPU | quelques secondes |
| 3 | Télécharge SDXL (≈ 7 Go) et génère les 3 images fixes | 10 à 15 min la première fois |
| — | **Pause : regarder les 3 images** (dossier `essai/images`) | — |
| 4 | Télécharge LTX-Video (≈ 25 Go) et anime les 3 images | téléchargement 10 à 20 min, puis quelques minutes à plusieurs dizaines de minutes par clip |
| 5 | Assemble `essai_etoile_filante.mp4` en 16:9 avec grain et fondus | 1 min |

**Notez le temps affiché par la cellule 4 pour chaque clip** : c'est lui qui dira si les 14 plans sont réalistes dans le quota gratuit.

## 5. Si une image est ratée (visage, style)

Dans `prompts/essai-etoile-filante.json`, changer le nombre `"seed"` du plan concerné, supprimer l'image correspondante dans `essai/images/`, relancer la cellule 3 : seules les images manquantes sont refaites. Même principe pour les clips (supprimer `essai/clips/X.mp4`, relancer la cellule 4).
Ne pas toucher aux blocs de description des personnages (voir `references/FICHES-PERSONNAGES.md`).

## 6. Récupérer le résultat

Onglet **Output** du notebook : télécharger `essai_etoile_filante.mp4`, ainsi que `images/` et `clips/`.
**Arrêter la session** quand c'est fini (bouton d'arrêt en haut à droite) : une session oubliée consomme le quota.

## Problèmes fréquents

| Symptôme | Que faire |
|---|---|
| « CUDA out of memory » | Dans le JSON, baisser `video.width`/`height` (ex. 704 × 416, multiples de 32) ou `num_frames` (65, toujours un multiple de 8 plus 1). Redémarrer la session avant de relancer. |
| Vidéo noire ou erreur « NaN » | Dans la cellule 2, remplacer `torch.bfloat16` par `torch.float16`. |
| « IP-Adapter indisponible » | Le script continue sans : visages guidés par le texte et la graine seulement (moins fidèles). Noter dans `EVALUATION.md`. |
| Téléchargement impossible | Vérifier **Internet : On** et la vérification du téléphone. |
| Session interrompue | Relancer les cellules 2 à 5 : ce qui est déjà généré est conservé tant que la session tourne ; sinon il faut tout refaire. |

## 7. Ensuite

Envoie-moi `essai_etoile_filante.mp4` (ou les clips) et les temps de calcul : on remplit ensemble `EVALUATION.md` et je te dis si cela vaut le coup de refaire les 14 plans.
