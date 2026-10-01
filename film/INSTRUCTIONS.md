# Film « La Dernière Danse » — mode d'emploi pour reprendre le travail

À lire en premier dans une nouvelle conversation. Ce fichier est fait pour éviter de relire tout l'historique.
Le contexte du cadeau, les personnages, les enveloppes et les écarts relevés plan par plan sont dans `../PROJET.md` (section 6).

## 1. Démarrer une session

1. Ajouter le dépôt `corentindebritocanica-cloud/La-Derniere-Danse` à la session (outil add_repo, accès « push »), puis le cloner. Ne jamais écrire de jeton GitHub dans le dépôt.
2. Lire, dans cet ordre :
   - ce fichier ;
   - `../PROJET.md` §6, « Écarts relevés » : ce qu'il faut corriger pour chaque plan ;
   - le chapitre concerné dans `../roman/la-derniere-danse.txt`. Les débuts de chapitre sont donnés en numéros de ligne, voir §6 ci-dessous.
3. Pour un lieu ou un objet qui existe sur papier, regarder `../artefacts-papier/png/` et lire `../artefacts-papier/README.md`. Le film doit reprendre ces visuels tels quels.
4. Dépendances : Python 3 et Playwright, avec Chromium déjà présent dans l'environnement cloud.

## 2. Règles (non négociables)

- Réponses à Corentin en français, concises. S'il dit « attends », ne rien modifier sans son accord.
- **Fidélité au roman** :
  - lieux, vêtements, gestes, objets et répliques viennent du livre ;
  - les répliques sont citées mot pour mot, quitte à les couper ;
  - toute liberté prise doit être signalée dans `plans.json` (champ `NOTE`) et dans `PROJET.md`.
- **Cohérence avec les artefacts papier** : la maison Sarrail, l'affiche, la carte du ciel, le mot de Louise, le carnet de bal, le tirage de Julien.
- **Saison** : décembre. Glycine sans fleurs (`grappes:false`), arbres nus, givre, buée.
- **Site public** : sur le site (`index.html`), seuls les noms fictifs apparaissent. Les vraies photos sont dans `artefacts-papier/images/` (accord de Corentin).
- **Enveloppe 8** : secret absolu. Rien ne doit évoquer le mariage.

## 3. Comment un plan est fabriqué

```
film/lib/moteur.js       outils + lecteur      (window.LDD = L)
film/lib/musique.js      instruments + thème
film/lib/personnages.js  pantins et personnages
film/lib/decors.js       décors partagés
film/src/plan-XX.js      le plan : rendu(c,t) + partition(ac,sortie,T)
film/src/page.html + film/plans.json (titres, description, note) → film/build.py → film/plan-XX-nom.html (autonome)
```

Squelette d'un plan :

```js
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL,P=L.POSES;
function rendu(c,t){ /* dessine l'image au temps t (s), canvas 1280×720 */ }
function partition(ac,sortie,T){ const K=L.kit(ac,sortie); /* … */ K.finale(T,DUREE); }
L.film({duree:DUREE,rendu,partition,affiche:/* instant de l'affiche */});
})();
```

### Outils de `moteur.js`

**Courbes et interpolation**

| Outil | Rôle |
|---|---|
| `seg(t,a,b)` | Rampe de 0 à 1 entre a et b. |
| `eio` | Courbe d'accélération entrée-sortie. |
| `eoc` | Courbe d'accélération en sortie. |
| `eic` | Courbe d'accélération en entrée. |
| `lerp`, `clamp` | Interpolation linéaire, bornage. |
| `mix(c1,c2,u)` | Mélange de deux couleurs. |
| `rng(seed)` | Générateur aléatoire déterministe. |

**Dessin et cartons**

| Outil | Rôle |
|---|---|
| `setLS(c,'3px')` | Espacement des lettres. |
| `star(c,x,y,R,r,coul)` | Étoile. |
| `carton(c,lignes,alpha,yEtoile)` | Carton de cinéma muet. `lignes=[{s,y,f,c,ls}]`. |
| `noir(c,a)` | Fondu au noir. |
| `L.C` | Couleurs : `encre`, `rouge`, `or`, `papier`… |
| `L.F` | Polices : `titre` = Limelight, `texte` = Bodoni, `main` = La Belle Aurore, `machine` = Special Elite. |

**Lecture et vérification**

| Outil | Rôle |
|---|---|
| `window.LDD_rendu(t)` | Dessine l'instant t. Sert aux vérifications. |

### Musique (`L.kit`)

| Groupe | Fonctions |
|---|---|
| Ambiances | `nappe`, `projecteur`, `gramophone`, `noise` |
| Instruments | `piano`, `accord`, `basse`, `grosseCaisse`, `charleston`, `roulement`, `cymbale`, `souffle` (bandonéon, vent), `trompette`, `violon`, `cloche` |
| Accords tenus | `nappeAccord` |
| Mélodies et ensembles | `phrase(notes,t0,battement,'piano'\|instr,bus,gain)`, `orchestre`, `applaudissements` |
| Routage | `bus`, `finale` |

- Les notes s'écrivent `[[décalage, midi, durée], …]`.
- Le thème, « le morceau sans nom » de Léon, se trouve dans `L.THEME` : `motif`, `reponse`, `lent`, `accords`, `basses`, `grille`.
- Accords disponibles : `Dm9`, `G13`, `Cmaj9`, `A7b9`, `Fmaj9`, etc. Vérifier la liste dans `musique.js` avant d'utiliser un nouveau nom.

### Personnages (`personnages.js`)

`L.pantin(c,{x,F,p,s,sol,hipY,lift,levres},type)` dessine un pantin et renvoie `{tete,main,mainDos,hanche}`.
- `F` vaut 1 ou -1 : sens du regard.
- `p` est une pose. Les poses se trouvent dans `L.POSES` : debout, timide, invite, tenue, bras_leve, promenade, renverse_C, renverse_L, assis, assis_volant, peint, lit.
- Les angles d'une pose sont donnés en radians, en partant de l'axe vertical vers le bas. Une valeur positive va vers l'avant.

| Type | Personnage |
|---|---|
| `C` | Célestin |
| `L` | Louise |
| `J` | Julien |
| `S` | Solange |
| `X` | homme |
| `B` | chauve |
| `K` | contrôleur |
| `Y` | femme |

Autres fonctions :
- **Animer une pose** : `L.melange(p,q,u)` et `L.pas(p,phase,amplitude,coup)` pour la marche.
- **Personnages dessinés à part** : `L.mini(c,x,sol,{roue,louise,celestin,vide})`, `L.phares`, `L.leon`, `L.maurice`, `L.amelie`, `L.chopin(c,x,y,s,queue,cligne)`.
- **Sol** : la ligne de sol vaut `L.SOL = 612`.

### Décors (`decors.js`)

| Outil | Rôle |
|---|---|
| `ciel` | Ciel de nuit. |
| `etoiles` | Étoiles, avec les Gémeaux. |
| `toulouse` | Silhouette de la ville. |
| `collines`, `cypres` | Paysage. |
| `public` | Public. |
| `soleil` | Soleil art déco. |
| `afficheConcours(c)` | Affiche de l'enveloppe 0, 559 × 794. |

**Maison Sarrail** : `L.SARRAIL` (géométrie du plan coté de l'enveloppe 3) et `L.maisonSarrail(c,{lumLouise,ouvre,lumGP,ombreGP,grappes})`.
- Le sol de la maison est à y = 640.
- La porte est en (350, 490).
- La fenêtre de Louise est `S.etage[S.louise]`.
- Le bureau du grand-père est `S.rdc[S.grandPere]`.
- Pour la placer : `translate`, puis `scale(k)`.

**Cabaret** : `L.SCENE`, `L.salleCabaret(c,t,{lampes,colonne})`, `L.tablesCabaret`, `L.orchestreSix`.

### Conventions de mise en scène, à reprendre des plans 04 à 06

- **Répliques** : fonction `parole(...)` en La Belle Aurore 27 px, cernée de sombre, au-dessus de la tête du locuteur. Listes `[[t,'C'|'L',texte,durée]]` + `dire(...)`.
- **Lieu et heure** : en haut à droite, en Special Elite doré (`heure(c,'PURPAN · QUATRE HEURES MOINS DIX',a)`).
- **Cartons** : un carton d'ouverture, avec le titre du chapitre ou une phrase du livre, et parfois un carton de fin citant le livre.
- **Vitesse de lecture** : laisser environ 1,5 à 2 s par réplique et ne pas superposer deux répliques.

## 4. Vérifier, publier, enregistrer

```bash
cd film
python3 build.py 06                                     # construit plan-06-….html (sans argument : tous)
python3 outils/apercu.py plan-06-marche.html 5 12 20 31 # planche-contact /tmp/planche-plan-06.png + erreurs JS
```

1. Regarder la planche avec l'outil Read, et corriger le cadrage, les chevauchements et la lisibilité.
2. Publier :
   - Lancer `python3 outils/publier.py plan-06-marche.html:marche.html`. Le fichier préparé arrive dans `film/outils/pub/`, qui est ignoré par git.
   - Appeler l'outil Artifact (publish) avec `file_path` pointant sur ce fichier et `url` égal à l'adresse du plan dans le tableau ci-dessous.
   - La première fois dans une conversation, faire un `read` de l'artefact avant de le republier.
3. Enregistrer : `git add -A && git commit` en terminant le message par les lignes d'attribution du rappel système, puis `git fetch && git rebase origin/main && git push origin HEAD:main`.
4. Donner à Corentin une phrase de compte rendu.

## 5. État des plans (1er octobre 2026)

| Plan | Chapitre | Fichier | Artefact | État |
|---|---|---|---|---|
| Storyboard | — | `storyboard/` | https://claude.ai/artifact/PDDgJdnzVN3cTKYL3yjV5q | à mettre à jour à la fin |
| 01 Ouverture | — | `plan-01-ouverture.html` | https://claude.ai/artifact/GRPzWs2e8G2sznQfsYC6wL | conforme |
| 02 La fenêtre | 1 | `plan-02-fenetre.html` | https://claude.ai/artifact/PKxRAPSnERwsTieoC9yE92 | ✅ refait d'après le livre |
| 03 Purpan | 2 | `plan-03-purpan.html` | https://claude.ai/artifact/NRF43SQmRMwvM5ioeHAiG8 | ✅ refait |
| 04 Le tirage | 3 (début) | `plan-04-tirage.html` | https://claude.ai/artifact/HVcQ2emeSSPQm1fkdffTi4 | ✅ refait |
| 05 La danse | 3 (fin) | `plan-05-danse.html` | https://claude.ai/artifact/8i5uzu5MYxhB1KYspFrEjU | ✅ refait (liberté : fil d'or au sol) |
| 06 L'heure des hiboux | 4 | `plan-06-marche.html` | https://claude.ai/artifact/933jod6ATQTFY5Mm2NxAVz | 🟡 **réécrit, pas encore publié** (voir ci-dessous) |
| 07 Le portrait / enfermée | 5 | `plan-07-portrait.html` | https://claude.ai/artifact/PyBENh3VDyeHMTJViiMCWu | ❌ à refaire (écarts dans PROJET.md) |
| 08 La glycine | 7 | `plan-08-glycine.html` | https://claude.ai/artifact/5Q5dsaErcVoFixNE2CB7JC | ❌ à refaire |
| 09 Soirée des lendemains | 8 | — | — | ⬜ à créer (nouvel artefact) |
| 10 L'étoile filante | 9 | `plan-10-etoile-filante.html` | https://claude.ai/artifact/RhiNcMF8wjVBm1DpN8cCqy | ❌ à refaire |
| 11, 12, épilogue | 10–12 | — | — | ⬜ à créer (voir storyboard) |

### Plan 06 : où on en est

`src/plan-06.js` a été réécrit pour le chapitre 4. Il dure 79 s. Il se construit et ne produit aucune erreur JS.

**Scènes**

| Scène | Temps | Contenu |
|---|---|---|
| A | 3–14,4 s | Sortie du cabaret, givre : « Où habitez-vous ? »… « Alors on marche. » |
| B1 | 14,4–20,2 s | Rue de la République, fenêtre en demi-lune éteinte, il la montre du doigt. |
| B2 | 20,2–27,2 s | Avenue de Grande-Bretagne, platanes, Cartoucherie : « Je crois que je cherche un visage. » |
| B3 | 27,2–35,4 s | Carrefour, réverbère qui grésille : « D'étouffement, je crois. » |
| C | 35,4–49,4 s | Banc près du lavoir, mousseux au goulot : « Un petit hibou. » Rire de Louise. |
| D | 49,4–73 s | Purpan, la grille : « Pour les hiboux, si. » Elle traverse le jardin, ils lèvent la main. |
| Fin | après 73 s | Carton « Il savait enfin quoi peindre. » |

**Reste à corriger avant de publier** (constaté sur la planche-contact) :

Scène D, Purpan :
- La maison est trop petite et trop loin. Il faut l'agrandir (KM ≈ 0,6) et faire commencer l'allée de platanes à la grille.
- La lueur de la lanterne est trop forte et masque la porte. La réduire et la placer au-dessus d'un **perron de six marches**.
- Le livre donne des **volets gris** et une **grille de fer forgé peinte en vert** ; dans le plan, la grille est noire.
- À 71 s, Louise est déjà invisible quand elle lève la main. Il faut qu'elle reste visible au coin de la maison, lève la main, puis disparaisse.

Scène B1 :
- Le couple masque l'enseigne « BOULANGERIE · FABRE ». Le décaler, ou faire passer le couple devant la vitrine plus tard.

Toutes les scènes :
- Vérifier sur la planche que les répliques ne chevauchent pas la lueur des réverbères.

**Après correction** :
- Publier sur l'artefact du plan 06.
- Mettre à jour `plans.json` (entrée `06` : titre « L'heure des hiboux », durée, description, note) et le tableau ci-dessus.

## 6. Repères dans le roman (`roman/la-derniere-danse.txt`)

| Chapitre | Ligne de début |
|---|---|
| 1 | 81 |
| 2 | 263 |
| 3 | 446 |
| 4 | 669 |
| 5 | 877 |
| 6 | 1031 |
| 7 | 1196 |
| 8 | 1375 |
| 9 | 1528 |
| 10 | 1720 |
| 11 | 1866 |
| 12 | 2027 |
| Épilogue | 2222 |

Lire un chapitre : `sed -n 877,1031p roman/la-derniere-danse.txt`.

### Plan 09 (chapitre 8), éléments déjà relevés

**Arrivée et tenue**
- Arrivée à 22 h 40. Solange pousse un cri en la voyant.
- Louise porte le pantalon de golf (« le pantalon de Gaston ») ; il lui manque une frange.
- Solange lui prête une robe champagne brodée de perles, dans l'arrière-salle.

**Les danses**
- Fox-trot, charleston, puis une valse (la cuisine de Castres).
- Léon dédie le « morceau sans nom ».
- Célestin : « Hier c'était un accident. Aujourd'hui c'est un choix. Faites-moi confiance. »
- La danse-élastique, plus lente. Elle joue avec, puis vient jusqu'à lui.
- La trompette tient une note, puis silence.

**Le baiser**
- Elle l'embrasse sur la pointe des pieds. La salle explose.
- Répliques : « Pardon… Je ne sais pas ce qui m'a pris. » — « Moi je sais. » — « La même chose qu'à moi, petit hibou. »
- Second baiser, plus long, pendant que Léon rejoue.

Avant d'écrire le plan 09, relire tout le chapitre 8 : ces éléments ne suffisent pas.

### Artefacts papier à respecter pour les plans à venir

- **Plan 07** : le mot de Louise, à recopier mot pour mot (`artefacts-papier/png/MotLouise.png`).
- **Plan 08** : le plan de la glycine, déjà intégré dans `L.SARRAIL`. La frange accrochée correspond à `EtiquetteFrange` (env. 6).
- **Plan 10** : la carte du ciel, « Minuit quarante-huit ».
  - Ciel : pleine Lune haute, Jupiter près du Taureau, Mars à l'est, Géminides.
  - Coordonnées : 43° 36′ N, 1° 26′ E.
- **Réveillon (plan 12)** :
  - l'invitation et le carnet de bal (danses : fox-trot, tango, charleston, la danse qui n'existe pas encore, valse du réveillon, dernière danse de l'année) ;
  - le tirage de Julien : couple dansant, robe noire à franges, smoking.
