"""Séquence 2 — Louise (chapitre 2)."""
from scenes import *

# 2.1 — de l'autre côté de la ville, la maison de Purpan, la glycine nue
def p21(c, t, f):
    D = 7.5
    with camera(c, t, D, 1.0, 1.5, W * 0.52, H * 0.32, 0, 0, 0, 120):
        ciel_aube(c, W, H, 0.55, 0.9)
        nuages(c, W, H, t, 0.08, 3, 7, 160)
        maison_sarrail(c, W, H, t, False, 255, 0, False, 1.0)
        c.drawRect(skia.Rect.MakeXYWH(0, H * 0.9, W, H * 0.1), P('#8a8a6a'))
        c.drawRect(skia.Rect.MakeXYWH(0, H * 0.9, W, H * 0.1), trame(0.3, 6, 45, ENCRE))
    sous_titre_lieu(c, t, 'Purpan — chez les Sarrail, à cinq heures', 0.5, 6.5)

# 2.2 — le salon : le grand-père et La Dépêche, le thé de 17 h, Chopin
B22 = [B(4.0, None, 'Il n’y a que lui, ici, de musicien convenable.', 1230, 170, (1260, 330), largeur=600)]
def p22(c, t, f):
    salon_sarrail(c, W, H, t + 17 * 3600 / 10, 255, 0, False)
    fauteuil(c, 640, H * 0.93, 1.25, 255, 1)
    # Édouard, assis, derrière son journal
    po = pose(assis=True, saut=-1.75, buste=-2, regard=0.3, expr='neutre', main_d='journal', md=(1.2, 0.9), mg=(1.0, 1.0), clign=cligne(t, 2))
    figure(c, 620, H * 0.92, 700, 'edouard', po, 1, ombre=False)
    # ses doigts tapotent l'accoudoir en mesure (on ne le sait pas encore : il est violoniste)
    if int(t * 3) % 3 == 0:
        for k in range(2):
            trait(c, [(560 + k * 14, 620 - k * 6), (548 + k * 14, 600 - k * 6)], 3)
    # Chopin sur le dossier du fauteuil
    chopin(c, 700, H * 0.93 - 1.25 * 360, 190, 1, 255, queue=t * 1.5 if 5.5 < t < 9 else math.sin(t) * 0.3, assis=True, yeux=0.55 + 0.45 * (t > 5.5))
    # Amélie verse le thé
    pa = pose(regard=-0.4, expr='pincee' if False else 'neutre', main_d='tasse', md=(1.6, 1.3), mg=(1.5, 1.6),
              parle=parle(t, B22[0]['t0'], B22[0]['t0'] + 3), buste=8)
    figure(c, 1320, H * 0.96, 760, 'amelie', pa, -1)
    # l'horloge sonne cinq heures
    if t < 3.5:
        for k in range(5):
            if t > 0.4 + k * 0.5:
                onomatopee(c, 'DONG', 200 + (k % 2) * 60, 160 + k * 70, 46, -8, ENCRE, PAPIER, 255 * env(t, 0.4 + k * 0.5, 0.9 + k * 0.5 + 1.2, 0.15))
    if 6.0 < t < 9.5:
        onomatopee(c, 'frrt', 800, H * 0.93 - 1.25 * 360 - 120, 40, 10, ENCRE, PAPIER, 255 * env(t, 6.0, 9.5, 0.2))
    dessiner_bulles(c, t, B22)

# 2.3 — en haut : Louise lit Freud en cachette
def p23(c, t, f):
    fond_cases(c)
    def chambre(c, w, h):
        chambre_louise(c, w, h, t, 255, True, 0, False, True)
        # Louise en tailleur sur son lit, le livre jaune
        po = pose(assis=True, saut=-1.6, jd_assis=70, jg_assis=60, buste=6, regard=0.2, oeil=(0.3, 0.6), expr='pensif',
                  md=(1.0, 1.25), mg=(0.6, 1.35), main_d='livre')
        figure(c, 300, h * 0.66 + 660 / 8.2 * 2.2, 660, 'louise_jour', po, 1, ombre=False)
        # bougie
        c.drawCircle(w * 0.06 + w * 0.36 + 45, h * 0.62, 70, degrade_rad(w * 0.42 + 45, h * 0.62, 70, [hexc('#ffe9a0', 120), hexc('#ffe9a0', 0)]))
    case(c, (24, 24, 1200, 1032), chambre, t, lin(t, 0, 0.4), 'gauche')
    def livre(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P('#2a2230'))
        c.save(); c.translate(w / 2, h / 2); c.rotate(-6)
        encre(c, path_pts([(-150, -200), (150, -200), (150, 200), (-150, 200)]), JAUNE, 6)
        texte(c, 'S. FREUD', 0, -110, font('titre', 40), ENCRE, 255, 'center')
        texte(c, 'Introduction', 0, -40, font('texte', 30), ENCRE, 255, 'center')
        texte(c, 'à la', 0, 0, font('italique', 26), ENCRE, 255, 'center')
        texte(c, 'psychanalyse', 0, 40, font('texte', 30), ENCRE, 255, 'center')
        c.restore()
        carte_lectrice(c, w * 0.42, h * 0.55, 300, 255, 14)
    case(c, (1248, 24, 648, 500), livre, t, lin(t, 1.5, 2.0), 'droite')
    def yeux(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P(ENCRE))
        c.save(); c.clipRect(skia.Rect.MakeXYWH(0, h * 0.22, w, h * 0.56))
        c.drawRect(skia.Rect.MakeWH(w, h), P(PAPIER))
        tete(c, w / 2, h * 0.43, 360, 'louise', 'pensif' if t < 6 else 'neutre', 0, 0, 255, (0, 0.4) if t < 6 else (0, -0.1), cligne(t, 3))
        c.restore()
    case(c, (1248, 548, 648, 508), yeux, t, lin(t, 3.0, 3.5), 'bas')
    dessiner_recits(c, t, [R_(3.8, 3.4, 'Le jour, elle apprenait à se taire.', 60, 840, 760, 38),
                          R_(7.4, 3.6, 'La nuit, elle apprenait à écouter.', 60, 840, 760, 38)])

# 2.4 — Marthe et les « leçons de piano »
B24 = [B(1.8, None, 'Madame votre grand-mère demande si les leçons de piano de chez madame Castaing sont toujours le mercredi.', 1300, 190, (1380, 400), largeur=700, taille=34),
       B(8.6, 2.8, 'Toujours, Marthe.', 520, 250, (560, 400), largeur=420)]
def p24(c, t, f):
    chambre_louise(c, W, H, t, 255, True, 0, False, True)
    # la porte s'ouvre à droite
    k = ease(lin(t, 0.0, 0.8))
    poly(c, [(1500, H * 0.75), (1500, H * 0.12), (1800, H * 0.12), (1800, H * 0.75)], '#f6d98a', 4)
    poly(c, [(1500, H * 0.75), (1500, H * 0.12), (lerp(1800, 1560, k), H * 0.08), (lerp(1800, 1560, k), H * 0.79)], BRUN, 4, 255, 0.3)
    # Louise cache le livre sous l'oreiller d'un geste de prestidigitatrice
    cache = ease(lin(t, 0.5, 1.2))
    po = pose(assis=True, saut=-1.6, jd_assis=70, jg_assis=60, buste=lerp(6, -10, cache), regard=lerp(0.2, 0.8, cache),
              expr='surpris' if 0.4 < t < 1.6 else ('sourire' if t > 9 else 'neutre'), md=(lerp(1.0, -1.2, cache), lerp(1.25, 1.0, cache)),
              mg=(0.6, 1.35), main_d='livre' if t < 1.0 else None, parle=parle(t, B24[1]['t0'], B24[1]['t0'] + 1.5))
    figure(c, 380, H * 0.66 + 680 / 8.2 * 2.2, 680, 'louise_jour', po, 1, ombre=False)
    if 0.6 < t < 1.6:
        lignes_paralleles(c, (200, 300, 400, 300), 10, 14, 4, ENCRE, 200)
        onomatopee(c, 'HOP', 330, 280, 70, -12, ENCRE, PAPIER, 255 * env(t, 0.6, 1.6, 0.15))
    # Marthe, le plateau, les clés
    km = ease(lin(t, 0.4, 1.6))
    x = lerp(1900, 1420, km)
    pm = pose(regard=-0.6, expr='neutre' if t < 10 else 'sourire', main_d='plateau', md=(1.4, 1.2), mg=(1.2, 1.3),
              jd=math.sin(t * 10) * 10 * (1 - km), jg=-math.sin(t * 10) * 10 * (1 - km), parle=parle(t, B24[0]['t0'], B24[0]['t0'] + 5))
    figure(c, x, H * 0.97, 640, 'marthe', pm, -1)
    if t > 10.2:
        for k_, s in enumerate(('cling', 'cling')):
            onomatopee(c, s, 1300 + k_ * 90, 600 - k_ * 50, 44, -10 + k_ * 20, ENCRE, PAPIER, 255 * env(t, 10.2 + k_ * 0.3, 12.0, 0.15))
    dessiner_bulles(c, t, B24)

# 2.5 — le tramway, la course jusqu'au studio
def p25(c, t, f):
    ciel_aube(c, W, H, 0.35, 0.7)
    facade(c, -100, H * 0.8, 800, 560, True, 255, True, porte=True, graine=21)
    facade(c, 700, H * 0.8, 700, 600, True, 255, True, porte=False, graine=22)
    facade(c, 1400, H * 0.8, 700, 540, True, 255, True, porte=True, graine=23)
    rue_pavee(c, W, H, H * 0.8, t, True, t * 300)
    # plaque du studio
    poly(c, [(1540, 560), (1840, 560), (1840, 640), (1540, 640)], PAPIER, 3)
    texte(c, 'SOLANGE · COURS DE DANSE', 1690, 610, font('machine', 22), ENCRE, 255, 'center')
    # Louise court de gauche à droite
    k = lin(t, 0, 5.2)
    x = lerp(-150, 1600, k)
    cyc = t * 7
    po = pose(buste=10, regard=0.9, expr='determine', jd=math.sin(cyc) * 22, gd=-20 - 20 * max(0, math.cos(cyc)), jg=-math.sin(cyc) * 22, gg=-20 - 20 * max(0, -math.cos(cyc)),
              md=(0.9 + math.sin(cyc) * 0.5, 1.8), mg=(-0.9 - math.sin(cyc) * 0.5, 1.8), saut=abs(math.sin(cyc)) * 0.15, jupe=0.0)
    figure(c, x, H * 0.98, 720, 'louise_manteau', po, 1)
    lignes_paralleles(c, (0, 300, W, 600), 0, 30, 9, ENCRE, 140, t)
    # le tramway passe en flou au premier plan
    tk = lin(t, 1.4, 3.2)
    if 0 < tk < 1:
        tx = lerp(W + 900, -1400, tk)
        poly(c, [(tx, H * 0.95), (tx, H * 0.28), (tx + 1300, H * 0.28), (tx + 1300, H * 0.95)], '#7a2a22', 6, 255, 0.3, 5)
        for k_ in range(6):
            poly(c, [(tx + 60 + k_ * 205, H * 0.36), (tx + 220 + k_ * 205, H * 0.36), (tx + 220 + k_ * 205, H * 0.6), (tx + 60 + k_ * 205, H * 0.6)], '#f7d98a', 4)
        texte(c, 'TRAMWAYS DE TOULOUSE', tx + 650, H * 0.72, font('titre', 50), OR, 255, 'center')
        lignes_paralleles(c, (0, H * 0.25, W, H * 0.72), 0, 50, 4, PAPIER, 200, t * 3)
        onomatopee(c, 'DING DING', W * 0.5, H * 0.2, 80, -6, ENCRE, PAPIER, 255)

# 2.6 — le studio de Solange
B26 = [B(1.0, 2.6, 'Un, deux, trois…', 1400, 150, (1430, 320), largeur=420),
       B(6.2, None, 'Ce n’est pas un examen, mademoiselle. C’est une conversation.', 1380, 160, (1430, 320), largeur=620),
       B(10.6, 2.8, 'Avec qui ?', 560, 240, (600, 380), largeur=320),
       B(13.2, None, 'Avec le sol, le temps et celui qui vous tient la main.', 1380, 160, (1430, 320), largeur=620)]
def p26(c, t, f):
    studio_solange(c, W, H, t)
    # Louise essaie seule une valse maladroite, puis s'arrête devant son reflet
    arret = ease(lin(t, 4.6, 5.2))
    ph = t * 2.2 * (1 - arret)
    tremble = math.sin(t * 13) * 2 * (1 - arret)
    po = pose(buste=tremble, regard=lerp(0.3, -0.2, arret), expr='gene' if t < 5 else ('surpris' if t < 7 else ('pensif' if t < 13 else 'tendre')),
              mg='valse', md='valse', jd=math.sin(ph * math.pi) * 18, jg=-math.sin(ph * math.pi) * 18, gd=-8, gg=8,
              parle=parle(t, B26[2]['t0'], B26[2]['t0'] + 1.2), jupe=0.1)
    x = 640 + math.sin(ph) * 60
    # le reflet dans le miroir (inversé, plus pâle)
    c.save(); c.clipRect(skia.Rect.MakeXYWH(30 + W * 0.27, H * 0.08, W * 0.24, H * 0.6))
    figure(c, x + 240, H * 0.68, 420, 'louise_jour', po, -1, 150, False)
    c.drawRect(skia.Rect.MakeWH(W, H), P('#dfe8ea', 60))
    c.restore()
    figure(c, x, H * 1.0, 760, 'louise_jour', po, 1)
    # Solange et sa canne
    frappe = (t * 1.6) % 1 < 0.15 and t < 4.6
    ps = pose(regard=-0.5, expr='sourire' if t > 6 else 'neutre', main_d='canne', md=(0.8, 1.4 + (0.25 if frappe else 0)), mg='hanches',
              parle=parle(t, B26[1]['t0'], B26[1]['t0'] + 3) + parle(t, B26[3]['t0'], B26[3]['t0'] + 3) + parle(t, B26[0]['t0'], B26[0]['t0'] + 1.5))
    figure(c, 1480, H * 0.99, 800, 'solange', ps, -1)
    if frappe:
        onomatopee(c, 'TOC', 1600, H * 0.86, 56, 8, ENCRE, PAPIER, 255)
    # le souvenir du Moulin-Rouge, en surimpression
    kk = env(t, 13.0, 17.4, 0.6)
    if kk > 0:
        c.save()
        c.drawRect(skia.Rect.MakeXYWH(60, 60, 520, 330), P(ROUGE, 230 * kk))
        soleil_deco(c, 320, 225, 30, 260, 18, t * 0.1, '#c84a3a', 255 * kk)
        texte(c, 'MOULIN-ROUGE', 320, 210, font('titre', 54), OR, 255 * kk, 'center')
        texte(c, 'Paris, autrefois', 320, 270, font('main', 40), PAPIER, 255 * kk, 'center')
        c.drawRect(skia.Rect.MakeXYWH(60, 60, 520, 330), P(ENCRE, 255 * kk, stroke=6, join='miter'))
        c.restore()
    dessiner_bulles(c, t, B26)

# 2.7 — le studio de Julien : l'affiche du concours
B27 = [B(2.4, None, 'Tu as vu l’affiche du concours ? Samedi, au Cabaret des Étoiles. Tirage au sort des couples.', 1350, 170, (1380, 360), largeur=640, taille=34),
       B(8.8, None, 'Je danse seul depuis trop longtemps.', 560, 200, (560, 360), largeur=520),
       B(12.4, None, 'Alors que le hasard te choisisse quelqu’un.', 1350, 170, (1380, 360), largeur=600)]
def p27(c, t, f):
    studio_photo(c, W, H, t)
    flash = env(t, 0.6, 1.4, 0.15)
    # un monsieur moustachu pose, très raide (portrait de famille)
    figure(c, 1060, H * 0.9, 640, 'monsieur', pose(regard=0.1, expr='colere', md='dos', mg='dos', clign=1 if 0.6 < t < 1.4 else 0), 1)
    appareil_trepied(c, 1560, H * 0.97, 1.1, 255, flash)
    pj = pose(regard=-0.4, expr='rire' if 0.8 < t < 2 else ('sourire'), md=(1.0, -0.2) if t < 2.0 else (0.6, 1.6), mg=(0.6, -0.5) if t < 2 else 'hanches',
              parle=parle(t, B27[0]['t0'], B27[0]['t0'] + 4) + parle(t, B27[2]['t0'], B27[2]['t0'] + 2.5))
    figure(c, 1600, H * 1.02, 780, 'julien', pj, -1)
    # Célestin passe la porte
    k = ease(lin(t, 1.6, 3.0))
    pc = pose(regard=0.6, expr='neutre' if t < 9 else ('pensif' if t < 12.4 else 'sourire'), md='ballant', mg='ballant',
              parle=parle(t, B27[1]['t0'], B27[1]['t0'] + 2))
    figure(c, lerp(-200, 470, k), H * 1.04, 800, 'celestin', pc, 1)
    if flash > 0:
        c.drawRect(skia.Rect.MakeWH(W, H), P(BLANC, 200 * flash))
        onomatopee(c, 'FLASH !', 1450, 260, 110, -10, ENCRE, PAPIER, 255 * flash)
    # l'affiche
    ka = env(t, 4.6, 9.0, 0.4)
    if ka > 0:
        affiche_concours(c, 720, 60 + (1 - ka) * 60, 400, 255 * ka, -4)
    dessiner_bulles(c, t, B27)

PLANS = [
    Plan(7.5, p21, '2.1', entree=('fondu', 0.8)),
    Plan(10.5, p22, '2.2', entree=('fondu', 0.4)),
    Plan(11.5, p23, '2.3', entree=('fondu', 0.4)),
    Plan(12.5, p24, '2.4', entree=('fondu', 0.4)),
    Plan(5.5, p25, '2.5', entree=('blanc', 0.3)),
    Plan(17.8, p26, '2.6', entree=('fondu', 0.4)),
    Plan(16.0, p27, '2.7', entree=('fondu', 0.4), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre deuxième', 'Louise'),
]
