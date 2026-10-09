"""Séquence 9 — l'étoile filante, 16 décembre, 0 h 48 (chapitre 9)."""
from scenes import *

# 9.1 — la Mini sous un ciel dense
def p91(c, t, f):
    champs_nuit(c, W, H, t, 255, t * 30, 0.66, True, True)
    x = lerp(-300, W * 0.55, ease_out(lin(t, 0, 6.5)))
    dans_la_mini(c, x, H * 0.97, 760, [('celestin_frac', 600, pose(regard=0.8, md=(1.6, 0.9), mg=(1.5, 1.0)), 'volant'),
                                       ('louise', 560, pose(regard=0.7, expr='tendre', tete=10, md=(0.6, 1.8), mg=(0.4, 1.9)), 'passager')], 1, 1.0, t * 1.5, f)
    papier(c, W - 560, 70, 480, 120, 255 * env(t, 1.2, 7.4, 0.4), 1.5, PAPIER, ROUGE)
    texte(c, '16 décembre, 0 h 48', 240, 76, font('titre', 44), ENCRE, 255 * env(t, 1.2, 7.4, 0.4), 'center')
    c.restore()

# 9.2 — la montre du tableau de bord ; l'étoile filante
def p92(c, t, f):
    if t < 2.4:
        tableau_de_bord(c, W, H, (0, 47 + (1 if t > 1.2 else 0)), 255, t)
        if t > 1.2:
            onomatopee(c, 'tic', W * 0.72, H * 0.25, 60, -10, PAPIER, ENCRE, 255 * env(t, 1.2, 2.4, 0.15))
    else:
        tt = t - 2.4
        champs_nuit(c, W, H, t, 255, 0, 0.7, True, True)
        p = ease(lin(tt, 0.3, 2.6))
        etoile_filante(c, W * 0.92, H * 0.08, W * 0.12, H * 0.48, p, 255, ROUGE, 14)
        if p >= 1:
            k = 1 - ease(lin(tt, 2.6, 4.6))
            etoile_filante(c, W * 0.92, H * 0.08, W * 0.12, H * 0.48, 1.0, 255 * k, ROUGE, 14)
        texte(c, 'fiiiiiiii…', W * 0.45, H * 0.18, font('italique', 50), BLANC, 255 * env(tt, 0.4, 3.0, 0.3), 'center')

# 9.3 — ils descendent et lèvent la tête
B93 = [B(3.4, 1.8, 'Tu l’as vue ?', 1320, 250, (1220, 420), largeur=300),
       B(5.2, 1.8, 'Je l’ai vue.', 600, 250, (700, 420), largeur=280),
       B(7.0, None, 'Il y a des Géminides à cette époque, ce sont des poussières de comète.', 1300, 240, (1220, 420), largeur=600, taille=34),
       B(11.4, None, 'Tu lis toujours des choses que personne n’a lues ?', 600, 240, (700, 420), largeur=520),
       B(14.8, None, 'C’est le principe des lectures cachées.', 1300, 240, (1220, 420), largeur=480)]
def p93(c, t, f):
    fond_cases(c)
    if t < 3.2:
        def yc(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(NUIT))
            tete(c, w / 2, h / 2 - 210 * 0.2, 210, 'celestin_frac', 'surpris', 0, 0, 255, (0.5, -0.8))
            etoile_filante(c, w * 0.75, h * 0.1, w * 0.55, h * 0.5, 0.8, 200, ROUGE, 6)
        def yl(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(NUIT))
            tete(c, w / 2, h / 2 - 210 * 0.2, 210, 'louise', 'surpris', 0, 0, 255, (0.5, -0.8))
            etoile_filante(c, w * 0.6, h * 0.1, w * 0.4, h * 0.5, 0.8, 200, ROUGE, 6)
        case(c, (24, 24, W - 48, 500), yc, t, lin(t, 0, 0.3), 'gauche')
        case(c, (24, 548, W - 48, 508), yl, t, lin(t, 0.6, 0.9), 'droite')
        return
    champs_nuit(c, W, H, t, 255, 0, 0.7, True, True)
    mini(c, 1500, H * 0.98, 700, 1, phares=1.0)
    figure(c, 720, H * 1.05, 800, 'celestin_frac', pose(regard=0.5, tete=-10, expr='sourire' if t > 12 else 'tendre', md='dos', mg='dos',
                                                          parle=parle(t, 5.2, 6.0) + parle(t, 11.4, 13.4)), 1)
    figure(c, 1080, H * 1.05, 740, 'louise', pose(regard=-0.5, tete=8, expr='rire' if t > 15 else 'surpris' if t < 7 else 'neutre', md='coeur', mg='ballant',
                                                  parle=parle(t, 3.4, 4.2) + parle(t, 7.0, 10.4) + parle(t, 14.8, 16.6)), -1)
    dessiner_bulles(c, t, B93)

# 9.4 — le vœu
B94 = [B(0.6, 1.8, 'Fais un vœu.', 1320, 240, (1220, 420), largeur=300),
       B(2.4, 2.2, 'Je l’ai déjà fait.', 600, 230, (700, 410), largeur=340),
       B(4.6, 2.0, 'Ne me le dis pas.', 1320, 240, (1220, 420), largeur=340),
       B(6.6, 2.4, 'Je n’allais pas le dire.', 600, 230, (700, 410), largeur=380),
       B(9.0, 2.8, 'Moi aussi, j’en ai fait un.', 1320, 240, (1220, 420), largeur=420)]
def p94(c, t, f):
    champs_nuit(c, W, H, t, 255, 0, 0.7, True, True)
    mini(c, 960, H * 0.98, 900, -1, phares=0.0)
    # adossés au capot
    figure(c, 760, H * 1.02, 760, 'celestin_frac', pose(regard=0.3 if t < 11.8 else 0, tete=-12 if t > 11.8 else 0, expr='tendre', md='dos', mg='dos',
                                                          parle=parle(t, 2.4, 3.6) + parle(t, 6.6, 7.8)), 1)
    figure(c, 1100, H * 1.02, 700, 'louise', pose(regard=-0.3 if t < 11.8 else 0, tete=12 if t > 11.8 else 0, expr='sourire' if t > 9 else 'tendre', md='dos', mg='coeur',
                                                  parle=parle(t, 0.6, 1.4) + parle(t, 4.6, 5.6) + parle(t, 9.0, 10.6), rougir=0.4), -1)
    dessiner_bulles(c, t, B94)
    if t > 11.8:
        bulles_shojo(c, (0, 0, W, H * 0.6), t, 20, 9, 200 * clamp(t - 11.8))

# 9.5 — la nuit avance ; ils parlent jusqu'à l'aube (9.6 — les inserts)
def p95(c, t, f):
    D = 14.0
    aube = ease(lin(t, 8.0, D))
    ciel_aube(c, W, H, aube * 0.9, 0.7) if aube > 0 else champs_nuit(c, W, H, t, 255, 0, 0.7, False, True)
    if aube <= 0:
        pass
    else:
        c.drawRect(skia.Rect.MakeXYWH(0, H * 0.7, W, H * 0.3), P(mix('#18202e', '#5a5a4a', aube)))
    # le ciel tourne (fondus lents sur les étoiles)
    for k in range(80):
        ang = k * 2.4 + t * 0.05
        rr = 200 + (k * 37) % 900
        x = W * 0.5 + math.cos(ang) * rr; y = H * 0.1 + math.sin(ang) * rr * 0.5
        if y < H * 0.68:
            c.drawCircle(x, y, 2 + k % 3, P(BLANC, 220 * (1 - aube)))
    occ = []
    for (nom, place, hh, ph) in (('celestin_frac', 'volant', 600, 0), ('louise', 'passager', 560, 1.5)):
        gest = math.sin(t * 3 + ph)
        occ.append((nom, hh, pose(regard=-0.6 if place == 'volant' else 0.6, expr='rire' if gest > 0.7 else 'sourire', md=(1.4 + gest * 0.4, 0.4 + gest * 0.4),
                    mg=(1.3, 1.2), parle=(0.5 + 0.5 * math.sin(t * 9 + ph)) if (int(t / 2) % 2 == (0 if ph == 0 else 1)) else 0), place))
    dans_la_mini(c, 960, H * 0.97, 760, occ, 1, 0.0)
    # 9.6 : en vignettes, tout ce qu'ils se racontent
    vignettes = [('le carnet', 2.0), ('la valse de la cuisine', 3.4), ('le morceau de Léon', 4.8), ('le portrait aux yeux rouges', 6.2)]
    for k, (titre, t0) in enumerate(vignettes):
        a = env(t, t0, t0 + 3.0, 0.3)
        if a <= 0:
            continue
        x, y = 80 + k * 450, 60
        def vig(c, w, h, k=k):
            c.drawRect(skia.Rect.MakeWH(w, h), P('#f6eee0'))
            if k == 0:
                papier(c, 40, 30, w - 80, h - 70, 255, -3, '#f7efdf')
                for i in range(6):
                    trait(c, [(20 + j * (w - 140) / 10, 30 + i * 22 + math.sin(j + i) * 2) for j in range(11)], 2, BLEU)
                c.restore()
            elif k == 1:
                c.drawRect(skia.Rect.MakeWH(w, h), P('#d9c29a'))
                en_silhouette(c, lambda cc: (figure(cc, w * 0.4, h * 0.95, h * 0.85, 'figurante', pose(mg='valse', md='valse')), figure(cc, w * 0.6, h * 0.95, h * 0.6, 'enfant', pose(mg='valse', md='valse'), -1)), '#5a3e1b')
            elif k == 2:
                c.drawRect(skia.Rect.MakeWH(w, h), P(ENCRE))
                notes_qui_montent(c, t, w * 0.3, h * 0.8, 5, 34, 255, OR, 0.4, h * 0.7, contour=None)
            else:
                portrait_louise(c, w * 0.25, 10, w * 0.5, h - 20, 1.0)
        case(c, (x, y, 400, 240), vig, t, a, 'haut')
        texte(c, titre, x + 200, y + 280, font('main', 32), ENCRE if aube > 0.3 else PAPIER, 255 * a, 'center')
    dessiner_recits(c, t, [R_(7.6, 5.4, 'Ils parlèrent jusqu’à l’aube. De la peinture. De Freud. Des ailes d’avion. De ce qu’on veut, de ce qu’on ose.', 120, 760, 1000, 34)])

# 9.7 — l'aube : il s'est endormi, elle tire sa veste sur lui
def p97(c, t, f):
    ciel_aube(c, W, H, 1.0, 0.7)
    soleil_deco(c, W * 0.7, H * 0.72, 60, 900, 24, t * 0.02, '#f3d9a8', 160)
    c.drawCircle(W * 0.7, H * 0.72, 80, P('#f8e2b0'))
    c.drawRect(skia.Rect.MakeXYWH(0, H * 0.7, W, H * 0.3), P('#6a6a52'))
    c.drawRect(skia.Rect.MakeXYWH(0, H * 0.7, W, H * 0.3), trame(0.25, 6, 45, ENCRE))
    u = 90
    tire = ease(lin(t, 3.4, 5.4))
    dans_la_mini(c, 960, H * 0.97, 900, [('celestin_frac', 700, pose(regard=-0.3, tete=-18, buste=-10, expr='ferme', md=(1.2, 1.6), mg=(1.0, 1.7)), 'volant'),
                                         ('louise', 650, pose(regard=0.6, expr='tendre', md=(lerp(0.6, 1.8, tire), lerp(1.8, 0.2, tire)), mg=(0.5, 1.9), rougir=0.5), 'passager')], 1)
    if t > 1.0:
        onomatopee(c, 'zzz', 960 - u * 0.9 + 120, H * 0.38, 56, -10, ENCRE, PAPIER, 255 * (0.5 + 0.5 * math.sin(t * 2)))
    for k in range(3):
        ph = (t * 0.3 + k / 3) % 1
        x = 300 + ph * 600; y = 260 - math.sin(ph * math.pi) * 80 + k * 40
        trait(c, [(x - 20, y), (x, y + 10), (x + 20, y)], 4, ENCRE, 200)
    # le pouce bleu sur le volant
    k = env(t, 6.0, 10.0, 0.4)
    if k > 0:
        def pouce(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P('#f3d9a8'))
            c.drawPath(ovale(w / 2, h * 0.6, w * 0.5, h * 0.3), P(ENCRE, stroke=24))
            encre(c, capsule((w * 0.35, h * 0.4), (w * 0.62, h * 0.32), 40, 34), PEAU, 6)
            c.drawPath(ovale(w * 0.6, h * 0.32, 22, 16), P(BLEU))
        case(c, (W - 560, 60, 500, 340), pouce, t, k, 'droite')
    notes_qui_montent(c, t, W * 0.15, H * 0.6, 2, 46, 255 * clamp(t - 7), ROUGE, 0.3, 200, contour=None)

PLANS = [
    Plan(7.8, p91, '9.1', entree=('noir', 0.6)),
    Plan(7.4, p92, '9.2', entree=('fondu', 0.3)),
    Plan(18.6, p93, '9.3', entree=('blanc', 0.3)),
    Plan(13.6, p94, '9.4', entree=('fondu', 0.4)),
    Plan(14.0, p95, '9.5-9.6', entree=('fondu', 0.6)),
    Plan(10.4, p97, '9.7', entree=('fondu', 0.8), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre neuvième', 'L’étoile filante'),
]
