"""Séquence 4 — la marche jusqu'à Purpan (chapitre 4)."""
from scenes import *

# 4.1 — la Mini ne démarre pas
B41 = [B(4.2, 2.6, 'Elle est fatiguée, la Mini.', 1300, 190, (1180, 360), largeur=440),
       B(6.8, 2.6, 'Elle est surtout têtue.', 520, 190, (600, 360), largeur=420),
       B(9.4, 2.6, 'Alors on marche.', 1300, 190, (1180, 360), largeur=380)]
def p41(c, t, f):
    ciel_nuit(c, W, H, t, 150, 4, lune=True, horizon=0.55)
    facade_cabaret(c, W, H, t, 255, 500, 8, 0.0)
    mini(c, 1250, H * 0.99, 760, 1, secousse=0.6 if t < 3.6 else 0, f=f)
    tourne = t * 2.6
    if t < 3.8:
        manx, many = 1250 + 76 * 4.8, H * 0.99 - 76 * 2.0
        cx_ = manx + math.cos(tourne * 2 * math.pi) * 34; cy_ = many + math.sin(tourne * 2 * math.pi) * 34
        trait(c, [(manx + 10, many), (cx_, cy_)], 8)
        figure(c, 1780, H * 0.99, 700, 'celestin', pose(buste=34, regard=0.6, expr='determine', cible_d=(cx_, cy_), cible_g=(cx_ + 20, cy_ + 10), jd=-25, gd=35, jg=18), -1)
        for (t0, s, x, y) in ((0.4, 'teuf', 1500, 300), (1.4, 'teuf…', 1620, 240), (2.6, 'pfffiou…', 1500, 280)):
            onomatopee(c, s, x, y, 70, -8, ENCRE, PAPIER, 255 * env(t, t0, t0 + 1.2, 0.2))
    else:
        figure(c, 620, H * 1.02, 760, 'celestin', pose(regard=0.6, expr='gene' if t < 9 else 'sourire', md='front' if t < 7 else 'ballant', mg='hanches',
                                                         parle=parle(t, B41[1]['t0'], B41[1]['t0'] + 1.4)), 1)
        if 4.0 < t < 6.0:
            onomatopee(c, 'pouêt…', 1700, 600, 50, 10, ENCRE, PAPIER, 255 * env(t, 4.0, 6.0, 0.2))
    pl = pose(regard=-0.5 if t > 3.8 else 0.4, expr='sourire' if t > 9.4 else 'neutre', md='coeur', mg='ballant',
              parle=parle(t, B41[0]['t0'], B41[0]['t0'] + 1.4) + parle(t, B41[2]['t0'], B41[2]['t0'] + 1))
    figure(c, 1020, H * 1.02, 700, 'louise_manteau', pl, -1 if t > 3.8 else 1)
    dessiner_bulles(c, t, B41)

# 4.2 — le Pont-Neuf, la Garonne dorée
def p42(c, t, f):
    pan = t * 40
    ciel_nuit(c, W, H, t, 200, 6, lune=True, horizon=0.7, cam=pan)
    toits_toulouse(c, W, H, H * 0.5, t, pan * 0.3, True, 31, 255, 0.55)
    garonne(c, W, H * 0.5, H * 0.5, t, True, pan)
    pont_neuf(c, W, H, H * 0.95, t, True, pan * 0.4)
    tab = H * 0.95 - 250
    k = lin(t, 0, 7.5)
    for (nom, dx, hh) in (('celestin', -40, 230), ('louise_manteau', 60, 214)):
        x = lerp(300, 1500, k) + dx
        cyc = t * 6 + (0 if nom == 'celestin' else 1.2)
        figure(c, x, tab, hh, nom, pose(regard=0.9, md='ballant', mg='ballant', jd=math.sin(cyc) * 20, jg=-math.sin(cyc) * 20, expr='neutre'), 1, 255, False)
    sous_titre_lieu(c, t, 'Le Pont-Neuf, après minuit', 0.4, 5.0)

# 4.3 — à mi-pont
B43 = [B(0.6, 2.2, 'Vous peignez ?', 1300, 200, (1180, 360), largeur=360),
       B(2.8, None, 'Un peu. Le matin, des avions. La nuit, des visages.', 560, 180, (620, 340), largeur=560),
       B(7.2, 2.8, 'Et vous ne dormez jamais ?', 1300, 200, (1180, 360), largeur=420),
       B(10.0, 3.0, 'Je dors pendant les valses.', 560, 180, (620, 340), largeur=440)]
def p43(c, t, f):
    ciel_nuit(c, W, H, t, 160, 8, lune=True, horizon=0.7)
    garonne(c, W, H * 0.55, H * 0.45, t, True)
    toits_toulouse(c, W, H, H * 0.56, t, 0, True, 33, 255, 0.5)
    # parapet au premier plan
    poly(c, [(0, H * 0.82), (W, H * 0.82), (W, H), (0, H)], mix(BRIQUE, NUIT, 0.65), 4, 255, 0.5, 5)
    reverbere(c, 960, H * 0.82, 520, True)
    pc = pose(regard=0.6, expr='sourire' if t > 10 else 'neutre', md='dos', mg='dos', parle=parle(t, B43[1]['t0'], B43[1]['t0'] + 3) + parle(t, B43[3]['t0'], B43[3]['t0'] + 1.6))
    figure(c, 680, H * 1.12, 860, 'celestin', pc, 1, 255, False)
    rit = t > 11.0
    pl = pose(regard=-0.6, expr='rire' if rit else ('surpris' if 7 < t < 10 else 'neutre'), md='bouche' if rit else 'coeur', mg='ballant',
              parle=parle(t, B43[0]['t0'], B43[0]['t0'] + 1) + parle(t, B43[2]['t0'], B43[2]['t0'] + 1.5), rougir=0.4 if rit else 0)
    figure(c, 1170, H * 1.12, 800, 'louise_manteau', pl, -1, 255, False)
    if rit:
        onomatopee(c, 'pff hi hi', 1450, 300, 60, 8, ENCRE, PAPIER, 255 * env(t, 11.0, 13.2, 0.2))
    dessiner_bulles(c, t, B43)

# 4.4 — la route de Purpan
def p44(c, t, f):
    route_purpan(c, W, H, t, 255, 0, True, 1.0, 0.55)
    k = lin(t, 0, 10)
    d = lerp(0.0, 0.85, k)          # elles s'éloignent sur la route
    z = 1 / (0.35 + d * 1.6)
    x = W * 0.5
    y = H * 0.55 + 180 * z
    hh = 260 * z
    ecart = lerp(1.0, 0.6, k)
    cyc = t * 5
    for (nom, dx) in (('celestin', -0.22), ('louise_manteau', 0.22)):
        figure(c, x + dx * hh * ecart, y, hh * (1 if nom == 'celestin' else 0.93), nom,
               pose(regard=0.0, md='ballant', mg='ballant', jd=math.sin(cyc) * 16, jg=-math.sin(cyc) * 16, expr='neutre'), 1, 255, True)
        if math.sin(cyc * 1.7 + dx * 10) > 0.8:
            trait(c, [(x + dx * hh + 30, y - hh * 0.9), (x + dx * hh + 60, y - hh * 1.0)], 3, BLANC, 180)
    dessiner_recits(c, t, [R_(1.0, 6.4, 'Ils ne parlaient pas de grand-chose. C’est ainsi qu’on parle de tout.', 120, 80, 980, 40)])

# 4.5 — les pas qui s'accordent
def p45(c, t, f):
    fond_cases(c)
    def pieds(c, w, h):
        c.drawRect(skia.Rect.MakeWH(w, h), P('#3a4054'))
        c.drawRect(skia.Rect.MakeWH(w, h), trame(0.3, 6, 45, ENCRE))
        accord = ease(lin(t, 1.5, 4.0))
        for k, (nom, y) in enumerate((('h', h * 0.38), ('f', h * 0.72))):
            for j in range(6):
                ph = (t * 1.6 + j / 6 + (0 if k == 0 else lerp(0.37, 0.0, accord))) % 1
                xx = w * (1.1 - ph * 1.3)
                L = 120 if nom == 'h' else 90
                pth = path_pts([(xx, y), (xx + L, y - 30), (xx + L * 1.2, y + 4), (xx, y + 18)], smooth=True)
                c.drawPath(pth, P(ENCRE)); c.drawPath(pth, P(BLANC, 120, stroke=2))
        s = 'crr… crr…' if t < 3 else 'crr. crr.'
        onomatopee(c, s, w * 0.5, h * 0.18, 70, -4, BLANC, ENCRE, 255)
    case(c, (24, 24, W - 48, 500), pieds, t, lin(t, 0, 0.4), 'gauche')
    def maison(c, w, h):
        ciel_nuit(c, w, h, t, 80, 13, lune=True, horizon=0.8)
        with camera(c, t, 6, 0.55, 0.62, w / 2, h * 0.9):
            maison_sarrail(c, w * 1.8, h * 1.8, t, True, 255, w * 0.9, False, 1.0, base=h * 1.0)
    case(c, (24, 548, W - 48, 508), maison, t, lin(t, 2.0, 2.4), 'bas')
    dessiner_recits(c, t, [R_(4.2, 2.6, 'Leurs pas ne faisaient plus qu’un seul bruit.', W - 800, 470, 760, 34)])

# 4.6 — au portail
B46 = [B(1.4, None, 'Ma grand-mère veille ; elle a des migraines stratégiques.', 1300, 180, (1200, 360), largeur=560, style='murmure'),
       B(5.6, 2.6, 'Je viendrai vous retrouver.', 560, 180, (640, 340), largeur=440),
       B(8.2, 1.8, 'Où ?', 1300, 180, (1200, 360), largeur=240, style='murmure'),
       B(10.0, None, 'Là où la nuit sera la plus longue.', 560, 180, (640, 340), largeur=500)]
def p46(c, t, f):
    ciel_nuit(c, W, H, t, 120, 14, lune=True, horizon=0.9)
    info = maison_sarrail(c, W, H, t, True, 255, -200, t > 0.8, 1.0)
    # le portail
    for k in range(9):
        ligne(c, 300 + k * 50, H, 300 + k * 50, H * 0.62, 6)
        etoile(c, 300 + k * 50, H * 0.61, 8, 4, 0.4, ENCRE)
    ligne(c, 280, H * 0.7, 720, H * 0.7, 6)
    if 0.8 < t < 2.4:
        onomatopee(c, 'clic', info['fenetre_louise'][0] + 140, info['fenetre_louise'][1] - 100, 50, -8, OR, ENCRE, 255 * env(t, 0.8, 2.4, 0.2))
    part = ease(lin(t, 13.6, 15.4))
    pc = pose(regard=0.6, expr='tendre' if t > 10 else 'neutre', md='coeur' if t > 10 else 'ballant', mg='ballant',
              parle=parle(t, B46[1]['t0'], B46[1]['t0'] + 1.4) + parle(t, B46[3]['t0'], B46[3]['t0'] + 2))
    figure(c, 640, H * 1.04, 760, 'celestin', pc, 1)
    pl = pose(regard=-0.6 if part < 0.3 else 0.6, expr='sourire' if t > 12 else 'neutre', md='bouche' if 1.2 < t < 4 else 'coeur', mg='ballant',
              parle=parle(t, B46[0]['t0'], B46[0]['t0'] + 3) + parle(t, B46[2]['t0'], B46[2]['t0'] + 0.6), rougir=0.5 if t > 11 else 0)
    figure(c, lerp(1060, 1500, part), H * 1.04, 700, 'louise_manteau', pl, -1 if part < 0.3 else 1, 255 * (1 - ease(lin(t, 15.0, 15.8))))
    dessiner_bulles(c, t, B46)
    # en surimpression : la fenêtre du grenier s'allume au même moment
    kk = env(t, 15.4, 18.0, 0.4)
    if kk > 0:
        def fen(c, w, h):
            grenier(c, w * 1.5, h * 1.5, t, True, 0, True)
            c.drawCircle(w * 0.93, h * 0.78, 200, degrade_rad(w * 0.93, h * 0.78, 200, [hexc('#ffe9a0', 150), hexc('#ffe9a0', 0)]))
        case(c, (W - 640, 60, 580, 380), fen, t, kk, 'haut')

PLANS = [
    Plan(12.2, p41, '4.1', entree=('noir', 0.5)),
    Plan(7.5, p42, '4.2', entree=('fondu', 0.4)),
    Plan(13.4, p43, '4.3', entree=('fondu', 0.4)),
    Plan(9.0, p44, '4.4', entree=('fondu', 0.6)),
    Plan(7.2, p45, '4.5', entree=('fondu', 0.3)),
    Plan(18.2, p46, '4.6', entree=('fondu', 0.4), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre quatrième', 'La marche jusqu’à Purpan'),
]
