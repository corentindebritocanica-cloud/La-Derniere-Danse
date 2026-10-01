# Artefacts papier des enveloppes

Copie des sources du canvas claude.ai (https://claude.ai/artifact/SjfqppdwXW8aUq6ncz1XCA), récupérée le 1er octobre 2026.
**Pour savoir à quoi ressemble un artefact, regarder `png/` plutôt que lire le code.**

- `*.dc.html` : sources des planches du canvas (HTML + styles en ligne ; `{{rouge}}` = `#a8201a`).
- `canvas.json` : taille exacte de chaque planche, en px (1 px = 1/96 de pouce).
- `images/` : images générées utilisées par les planches (`/_blob/<id>` dans le source = `images/<id>.<ext>`).
- `png/` : rendu de chaque planche en PNG à 2×, produit par `python3 artefacts-papier/rendu.py`.
- Les vraies photos sont incluses (accord de Corentin) : `images/33fd….jpg` (photo du carnet de bal, env. 8) et `images/751d….jpg` (portrait non utilisé par une planche).

Si le canvas change : relire les fichiers modifiés avec l'outil Artifact (`read`, `paths: ["project/<Nom>.dc.html"]`), les copier ici, puis relancer `rendu.py`.

## Catalogue

| Enveloppe | Planche | PNG | Contenu utile pour le film et le site |
|---|---|---|---|
| 0 | Affiche du concours (A5) | `png/Main.png` | Cabaret des Étoiles, rue des Teinturiers ; samedi 14 décembre ; « Première grande soirée des Parrains » ; concours de danse, un confirmé + un débutant, tirage au sort ; fox-trot, tango ; orchestre de jazz sous la direction de Léon ; prix : une coupe et cinquante francs ; tirage des couples à 20 h 30 ; « La Direction : Maurice ». Reproduite à l'identique dans `film/lib/decors.js` (`L.afficheConcours`). |
| 0 | Carte de consigne (A6) | `png/Consigne.png` | Règle des enveloppes ; « Pour mon petit hibou ». |
| 0 | Laissez-passer Latécoère | `png/LaissezPasser.png` | Ateliers Latécoère, usine de Montaudran ; n° 0348 ; Delacroix Célestin, né le 12 mars 1897 à Castres ; bureau d'études, dessinateur ; valable 1925 (pas de code). Portrait généré : `images/137c….jpg`. |
| 0 | Carte de lectrice | `png/CarteLectrice.png` | Bibliothèque municipale de Toulouse, n° 1142 ; Sarrail Louise Élisabeth, née le 16 avril 1899 ; domicile Purpan. Portrait généré : `images/1112….jpg` (carré brun, col Claudine blanc, robe bleue). |
| 0 | QR code du Registre des habitués (A6) | `png/QRCode.png` | Mène au site ; explique les codes à quatre chiffres marqués d'une étoile. |
| 1 | Diplôme (A5 paysage) | `png/Diplome.png` | « De la plus belle troisième danse », Monsieur Delacroix & Mademoiselle Sarrail, « pour une danse qui n'existe pas encore » ; prix : une bouteille de mousseux, à boire au goulot ; signé Maurice et Léon. Code ✦ 1412. |
| 2 | Page du carnet de Louise (A5) | `png/Carnet.png` | 15 décembre 1925, « Observation clinique. Sujet : moi-même. » ; pouce taché de bleu de Prusse ; p. 23. |
| 2 | Le mot de Louise | `png/MotLouise.png` | « Mon grand-père sait que je suis sortie. Il m'enferme ce soir. Dîner avec H. L. à 20 h… — Le petit hibou » ; « Troisième fenêtre à gauche. Premier étage. » Code ✦ 1899. **À reprendre tel quel dans le plan 07.** |
| 3 | Plan de la glycine (A4 paysage) | `png/PlanGlycine.png` | Élévation de la façade Sarrail, glycine à deux tiges, pattes tous les 600 mm, 3e patte branlante, fourche, fenêtre de L. (3e à gauche, 1er étage) ; « Trois points d'appui. Toujours trois. » ; plan n° 0714, dessiné C. Delacroix, 15.12.1925. Géométrie reprise dans `L.SARRAIL` / `L.maisonSarrail`. |
| 4 | Carte du ciel (A4) | `png/CarteDuCiel.png` | « Minuit quarante-huit », nuit du 15 au 16 décembre 2024, 43° 36′ N · 1° 26′ E ; Géminides, **pleine Lune haute**, Jupiter près du Taureau, Mars à l'est. Code ✦ 0048. Carte : `images/5843….svg`. **À respecter dans le plan 10.** |
| 5 | Lettre de Célestin (modèle à recopier) | `png/Lettre.png` | Toulouse, mercredi 18 décembre 1925, 2 h du matin ; glissée par Henri dans une boîte de marrons glacés ; la couleur du rire (jaune de Naples + vermillon). Code ✦ 1897. |
| 6 | Étiquette de la frange | `png/EtiquetteFrange.png` | « Pièce à conviction. Frange de soie noire. Trouvée dans la glycine, à mi-hauteur, sous la troisième fenêtre à gauche. » Lundi 23 décembre. Code ✦ 1925. |
| 7 | Invitation au réveillon (A6) + verso | `png/Invitation.png`, `png/InvitationVerso.png` | Grand bal du réveillon, 31 décembre ; carnet remis par le cavalier sur présentation du carton, « à toute heure du jour et de la nuit » ; verso : usage du carnet (I à V). |
| 7 | Tirage de Julien (A6) | `png/TirageJulien.png` | « J. Mercier, photographe · Toulouse · Portraits · Mariages · La ville la nuit », réveillon 31 décembre 1925. Image générée : `images/a5cf….jpg` (couple dansant, robe noire à franges, smoking). |
| 8 (secret) | Carnet de bal, extérieur et intérieur | `png/CarnetBalExterieur.png`, `png/CarnetBalInterieur.png` | Carnet n° 8, Mlle Louise Sarrail ; danses : fox-trot, tango, charleston, la danse qui n'existe pas encore, valse du réveillon, dernière danse de l'année → toutes « Célestin » ; ligne vide « Toutes les suivantes (si tu veux bien) ». |
| 8 (secret) | Vraie photo | `png/PhotoCarnet.png` | « Toulouse, près d'un siècle plus tard. » Photo : `images/33fd….jpg`. |
| 8 (secret) | QR code de la page réservée | `png/QRCodeCarnet.png` | « Page réservée à la cavalière qui a rempli la dernière ligne » → page bonus du site (mot de passe TOUJOURS). |
| — | Étiquettes des enveloppes (A4) | `png/Etiquettes.png` | Enveloppes 0 à 7 et leur moment d'ouverture. |

Image non utilisée par une planche : `images/ee30….jpg` (variante de la scène de danse du tirage de Julien).
