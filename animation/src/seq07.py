"""Séquence 7 — l'évasion par la glycine (chapitre 7)."""
from scenes import *

# 7.1 — le plan coté
def p71(c, t, f):
    chambre_louise(c, W, H, t, 255, True, 0, False, True)
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE, 90))
    plan_glycine(c, 260, 160, 1300, 255, -1.5, ease(lin(t, 0.4, 5.0)))
    # la main de Louise trace au crayon
    k = ease(lin(t, 0.4, 5.0))
    px, py = 260 + 1300 * (0.4 + 0.2 * math.sin(k * 6)), 160 + 910 * (0.25 + 0.4 * k)
    trait(c, [(px, py), (px + 140, py + 220)], 14, BRUN)
    encre(c, ovale(px + 170, py + 260, 70, 55), PEAU, 5)
    dessiner_recits(c, t, [R_(4.6, 4.6, 'Elle avait un esprit de dessinatrice, ce soir-là. Elle ne le savait pas encore.', 80, 60, 980, 36)])

# 7.2 — le pantalon de golf du cousin Gaston
def p72(c, t, f):
    chambre_louise(c, W, H, t, 255, True, 0, False, True)
    # l'armoire
    poly(c, [(1380, H * 0.9), (1380, H * 0.1), (1860, H * 0.1), (1860, H * 0.9)], BRUN, 5, 255, 0.3)
    ouvre = ease(lin(t, 0.3, 1.0))
    poly(c, [(1620, H * 0.88), (1620, H * 0.12), (lerp(1860, 1980, ouvre), H * 0.08), (lerp(1860, 1980, ouvre), H * 0.92)], '#6a4a30', 4, 255, 0.3)
    # la photo encadrée du cousin
    poly(c, [(1080, 200), (1300, 200), (1300, 480), (1080, 480)], '#e0d6c0', 6, 255, 0.2)
    c.save(); c.clipRect(skia.Rect.MakeXYWH(1090, 210, 200, 260))
    figure(c, 1190, 560, 330, 'gaston', pose(regard=0.0, expr='sourire', md='coeur', mg='coeur'), 1, 255, False)
    c.restore()
    if 1.6 < t < 6.0:
        papier(c, 1000, 520, 420, 110, 255 * env(t, 1.6, 6.0, 0.3), 2, '#f6efdc')
        texte(c, 'Propriété du cousin Gaston,', 210, 50, font('machine', 26), ENCRE, 255 * env(t, 1.6, 6.0, 0.3), 'center')
        texte(c, 'dans les Ordres.', 210, 86, font('machine', 26), ENCRE, 255 * env(t, 1.6, 6.0, 0.3), 'center')
        c.restore()
    # Louise brandit l'immense pantalon à carreaux, puis l'enfile sous sa jupe
    sous = ease(lin(t, 6.0, 8.0))
    pl = pose(regard=0.6, expr='determine' if t < 6 else 'rire', md='leve' if t < 6 else 'hanches', mg=(-0.6, -1.6) if t < 6 else 'hanches')
    inf = figure(c, 700, H * 1.02, 780, 'louise_jour', pl, 1)
    if t < 6.0:
        hx, hy = inf['main_d']
        hx += 230; hy -= 60
        pg = path_pts([(hx - 120, hy), (hx + 120, hy), (hx + 160, hy + 360), (hx + 10, hy + 380), (hx, hy + 120), (hx - 10, hy + 380), (hx - 160, hy + 360)])
        encre(c, pg, '#d8c08a', 5)
        c.drawPath(pg, hachures(18, 45, 3, ROUGE, 180)); c.drawPath(pg, hachures(18, -45, 3, ROUGE, 180))
        onomatopee(c, 'TA-DAM !', hx + 300, hy - 60, 90, -8, ROUGE, PAPIER, 255 * env(t, 1.0, 4.0, 0.2))
    else:
        # les carreaux dépassent sous l'ourlet
        y0 = H * 1.02 - 780 / 8.2 * 2.2
        pg = path_pts([(600, y0), (800, y0), (820, y0 + 90), (580, y0 + 90)])
        encre(c, pg, '#d8c08a', 4)
        c.drawPath(pg, hachures(14, 45, 3, ROUGE, 180)); c.drawPath(pg, hachures(14, -45, 3, ROUGE, 180))
        bulle(c, '(La cravate en guise de ceinture.)', 1100, 300, 460, (800, 520), 255 * env(t, 7.0, 10.0, 0.2), clamp((t - 7.0) / 0.25), 32, 'pensee')

# 7.3 — en bas, Henri propose une partie de dames
B73 = [B(1.6, None, 'Quelle belle soirée pour jouer !', 1250, 200, (1150, 380), largeur=460, style='cri')]
def p73(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, True, True)
    # table de jeu
    poly(c, [(760, H * 0.78), (1160, H * 0.78), (1160, H * 0.82), (760, H * 0.82)], BRUN, 4)
    for i in range(8):
        for j in range(3):
            c.drawRect(skia.Rect.MakeXYWH(800 + i * 40, H * 0.77 - j * 6 - 6, 40, 6), P(ENCRE if (i + j) % 2 else BLANC))
    figure(c, 640, H * 1.0, 660, 'edouard', pose(assis=True, regard=0.5, expr='pensif', md=(1.6, 1.4), mg=(1.4, 1.6), clign=cligne(t, 2)), 1, 255, False)
    lv = ease(lin(t, 5.0, 5.6)) * (1 - ease(lin(t, 7.6, 8.2)))
    ph = pose(assis=True, regard=-0.4 if t < 4.5 else 0.2, expr='sourire' if t < 5 else 'determine', md=(1.6, 1.4) if lv < 0.5 else (0.6, -1.6),
              mg=(1.4, 1.6), parle=parle(t, 1.6, 3.6))
    figure(c, 1280, H * 1.0, 700, 'henri', ph, -1, 255, False)
    if lv > 0.5:
        k = 1 + int((t - 5.4) * 2.2)
        onomatopee(c, ' '.join(['I'] * min(3, k)), 1240, 260, 70, 0, ROUGE, PAPIER, 255)
    dessiner_bulles(c, t, B73)
    if 8.0 < t:
        onomatopee(c, 'clac', 960, H * 0.7, 46, -8, ENCRE, PAPIER, 255 * env(t, 8.0, 9.6, 0.2))

# 7.4 — la descente
def p74(c, t, f):
    D = 9.0
    k = ease(lin(t, 0.4, 7.8))
    with camera(c, t, D, 1.35, 1.1, W * 0.5, lerp(H * 0.25, H * 0.75, k)):
        ciel_nuit(c, W, H, t, 120, 14, lune=True, horizon=0.95)
        info = maison_sarrail(c, W, H, t, True, 255, 0, True, 1.0)
        fx, fy = info['fenetre_louise']
        base = info['base']
        # Louise descend branche après branche : trois points d'appui, toujours trois
        x = fx + 70 + math.sin(k * 9) * 30
        y = lerp(fy + 60, base - 20, k)
        bal = math.sin(t * 6) * 0.5
        po = pose(regard=-0.2, expr='determine', md=(1.0, -1.6 + bal), mg=(-0.9, -0.6 - bal), jd=-30 + bal * 30, gd=40, jg=20 - bal * 30, gg=-30, jupe=0.3)
        figure(c, x, y + 360 * 0.0 + 340, 340, 'louise_jour', po, 1, 255, False)
        # les carreaux sous l'ourlet
        chopin(c, fx + 200, fy + 250, 120, -1, 255, queue=t * 1.5, assis=True)
    for (t0, s, xx, yy) in ((1.0, 'crac', 1400, 300), (3.2, 'crr', 500, 500), (5.6, 'crac', 1450, 700)):
        onomatopee(c, s, xx, yy, 50, -10, ENCRE, PAPIER, 255 * env(t, t0, t0 + 1.0, 0.2))
    onomatopee(c, 'hou… hou…', 360, 180, 52, -6, BLANC, ENCRE, 255 * env(t, 4.0, 6.6, 0.3))
    texte(c, 'Trois points d’appui. Toujours trois.', W - 60, H - 60, font('machine', 36), PAPIER, 255 * env(t, 1.2, 6.0, 0.4), 'right')

# 7.5 — le Petit Citron attend dans l'ombre du jardin
B75 = [B(1.6, 2.8, 'Vous avez changé de garde-robe ?', 760, 200, (720, 380), largeur=460),
       B(4.4, 2.8, 'Je suis passée par la glycine.', 1350, 200, (1300, 400), largeur=440),
       B(7.2, 2.6, 'Elle a bien fait les choses.', 760, 200, (720, 380), largeur=420),
       B(9.8, 3.0, 'Elle a fait un plan coté.', 1350, 200, (1300, 400), largeur=400)]
def p75(c, t, f):
    route_purpan(c, W, H, t, 255, 0, True, 0.6, 0.5)
    for k in range(6):
        glycine_branches(c, -100 + k * 30, H, 200 + k * 20, H * 0.2, t, True, 255, 0.6, graine=20 + k)
    dans_la_mini(c, 900, H * 0.99, 900, [('celestin', 700, pose(regard=0.7, expr='sourire' if t > 7 else 'surpris', md=(1.7, 0.9), mg=(1.6, 1.0),
                                         parle=parle(t, 1.6, 3.4) + parle(t, 7.2, 8.6)), 'volant')], 1, 1.0, 0, f)
    k = ease(lin(t, 0.0, 1.4))
    pl = pose(regard=-0.6, expr='rire' if t > 9.8 else 'determine', md='hanches', mg='hanches', jupe=0.2, parle=parle(t, 4.4, 6.0) + parle(t, 9.8, 11.4))
    figure(c, lerp(1900, 1450, k), H * 1.02, 720, 'louise_jour', pl, -1)
    y0 = H * 1.02 - 720 / 8.2 * 2.2
    xl = lerp(1900, 1450, k)
    pg = path_pts([(xl - 100, y0), (xl + 100, y0), (xl + 110, y0 + 80), (xl - 110, y0 + 80)])
    encre(c, pg, '#d8c08a', 4); c.drawPath(pg, hachures(12, 45, 3, ROUGE, 180))
    if 0 < t < 1.4:
        onomatopee(c, 'BOUM', 1600, 760, 80, 8, ENCRE, PAPIER, 255 * env(t, 0.3, 1.4, 0.15))
    dessiner_bulles(c, t, B75)

# 7.6 — la Mini démarre du premier coup
B76 = [B(0.8, 2.0, 'Elle marche !', 1250, 200, (1080, 400), largeur=320, style='cri'),
       B(2.8, None, 'Elle sait quand c’est important.', 640, 200, (760, 400), largeur=480)]
def p76(c, t, f):
    fond_cases(c)
    def route(c, w, h):
        route_purpan(c, w, h * 1.4, t, 255, 0, True, 0.6, 0.55)
        dep = ease_in(lin(t, 0.2, 5.0))
        mini(c, lerp(w * 0.3, w * 1.4, dep), h * 0.98, 700, 1, roues=t * 2, phares=1.0, f=f)
        lignes_paralleles(c, (0, 0, w, h), 0, 30, 3, PAPIER, 150 * clamp(t), t)
        onomatopee(c, 'VROUM', w * 0.6, h * 0.25, 100, -8, ROUGE, PAPIER, 255 * env(t, 0.2, 2.0, 0.15))
    case(c, (24, 24, W - 48, 620), route, t, 1.0, 'gauche')
    def salon(c, w, h):
        salon_sarrail(c, w, h * 1.5, t, 255, 0, True, False)
        figure(c, w * 0.35, h * 1.35, 700, 'edouard', pose(assis=True, regard=0.5, expr='rire' if t > 6 else 'sourire', md=(1.6, 1.4), mg='leve' if t > 6 else (1.4, 1.6)), 1, 255, False)
        figure(c, w * 0.62, h * 1.35, 700, 'henri', pose(assis=True, regard=-0.5, expr='gene', md='front' if t > 6 else (1.6, 1.4), mg=(1.4, 1.6)), -1, 255, False)
        if t > 6:
            texte(c, 'Henri perd la partie de dames, avec élégance.', w - 30, h - 30, font('machine', 30), ENCRE, 255 * clamp(t - 6), 'right')
    case(c, (24, 668, W - 48, 388), salon, t, lin(t, 5.4, 5.9), 'bas')
    def fen(c, w, h):
        ciel_nuit(c, w, h, t, 40, 8, lune=True, horizon=1)
        c.drawRect(skia.Rect.MakeXYWH(w * 0.25, h * 0.15, w * 0.5, h * 0.75), P(ENCRE))
        c.drawRect(skia.Rect.MakeXYWH(w * 0.25, h * 0.15, w * 0.5, h * 0.75), P(BLANC, stroke=4))
        texte(c, 'la fenêtre vide', w / 2, h - 12, font('main', 28), BLANC, 255, 'center')
    case(c, (W - 380, 60, 320, 260), fen, t, lin(t, 3.6, 4.0), 'droite')
    dessiner_bulles(c, t, B76)

PLANS = [
    Plan(9.6, p71, '7.1', entree=('noir', 0.5)),
    Plan(10.2, p72, '7.2', entree=('fondu', 0.4)),
    Plan(9.8, p73, '7.3', entree=('fondu', 0.4)),
    Plan(9.0, p74, '7.4', entree=('fondu', 0.4)),
    Plan(13.0, p75, '7.5', entree=('fondu', 0.4)),
    Plan(9.4, p76, '7.6', entree=('blanc', 0.3), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre septième', 'L’évasion par la glycine'),
]
