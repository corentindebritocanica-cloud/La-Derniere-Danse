"""Séquence 11 — la découverte, le violon du grand-père (chapitre 11)."""
from scenes import *

def violon(c, x, y, s=1.0, angle=0, a=255):
    c.save(); c.translate(x, y); c.rotate(angle); c.scale(s, s)
    corps = path_pts([(0, -150), (55, -140), (70, -95), (45, -55), (75, -10), (80, 60), (50, 110), (0, 120), (-50, 110), (-80, 60), (-75, -10), (-45, -55), (-70, -95), (-55, -140)], smooth=True)
    encre(c, corps, '#8a4a20', 5, a)
    c.drawPath(corps, degrade(-80, -150, 80, 120, ['#c07a3a', '#6a3418']))
    c.drawPath(corps, P(ENCRE, a, stroke=5))
    for sx in (-1, 1):
        trait(c, [(sx * 30, -10), (sx * 22, 20), (sx * 30, 50)], 4, ENCRE, a)
    encre(c, path_pts([(-10, -150), (10, -150), (8, -330), (-8, -330)]), ENCRE, 3, a)
    c.drawCircle(0, -350, 22, P('#5a2a10', a)); c.drawCircle(0, -350, 22, P(ENCRE, a, stroke=4))
    for k in range(4):
        ligne(c, -9 + k * 6, -330, -9 + k * 6, 90, 1.2, a, '#f0e0b0')
    poly(c, [(-30, 50), (30, 50), (25, 62), (-25, 62)], ENCRE, 0, a)
    trait(c, [(-50, -120), (-20, -150)], 8, BLANC, a * 0.6)
    c.restore()

# 11.1 — la frange de soie noire dans la glycine
def p111(c, t, f):
    if t < 6.0:
        ciel_jour(c, W, H, 0.95)
        c.drawRect(skia.Rect.MakeWH(W, H), P('#9aa0a8', 120))
        info = maison_sarrail(c, W, H, t, False, 255, 0, False, 1.0)
        fx, fy = info['fenetre_louise']
        x = lerp(-200, fx + 40, ease(lin(t, 0, 2.6)))
        figure(c, x, H * 0.98, 520, 'marthe', pose(regard=0.8, expr='neutre' if t < 2.8 else 'surpris', md='leve' if t > 3.4 else 'ballant', mg=(1.2, 1.4)), 1)
        # la frange accrochée à une ronce
        for k in range(12):
            trait(c, [(fx + 60 + k * 4, fy + 220), (fx + 58 + k * 4 + math.sin(t * 4 + k) * 4, fy + 290)], 2.4, ENCRE)
        if t > 3.0:
            onomatopee(c, '?', fx + 200, fy + 160, 100, 10, ENCRE, PAPIER, 255 * env(t, 3.0, 6.0, 0.2))
    else:
        tt = t - 6.0
        # fond rouge : la frange seule au centre
        c.drawRect(skia.Rect.MakeWH(W, H), P(ROUGE))
        soleil_deco(c, W / 2, H / 2, 80, 1400, 30, tt * 0.04, '#8a1a14', 255)
        c.save(); c.translate(W / 2, H * 0.32); c.rotate(math.sin(tt * 1.5) * 4)
        poly(c, [(-260, 0), (260, 0), (260, 24), (-260, 24)], ENCRE, 3)
        for k in range(60):
            xx = -255 + k * 8.6
            sw = math.sin(tt * 3 + k * 0.4) * 14
            trait(c, [(xx, 22), (xx + sw * 0.5, 200), (xx + sw, 380)], 3, ENCRE)
            trait(c, [(xx + 1, 40), (xx + 1 + sw * 0.4, 160)], 1, BLANC, 120)
        c.restore()
        texte(c, 'une frange de soie noire', W / 2, H - 90, font('main', 54), PAPIER, 255 * clamp(tt), 'center')

# 11.2 — « Une glycine n'a pas de franges. »
B112 = [B(1.0, None, 'Élisabeth. Une glycine n’a pas de franges.', 1350, 170, (1500, 360), largeur=520),
        B(4.6, 1.8, 'Non, grand-mère.', 620, 220, (700, 380), largeur=320, style='murmure'),
        B(6.6, None, 'Il n’y a pas de madame Castaing, n’est-ce pas ?', 1350, 170, (1500, 360), largeur=520),
        B(10.4, 1.8, 'Non.', 620, 220, (700, 380), largeur=160, style='murmure'),
        B(12.4, 2.4, 'Tu danses.', 1350, 170, (1500, 360), largeur=280)]
def p112(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, False, True)
    fauteuil(c, 300, H * 0.93, 1.1, 255, 1)
    figure(c, 300, H * 0.92, 640, 'edouard', pose(assis=True, saut=-1.75, regard=0.6, expr='neutre', main_d='journal', md=(1.2, 0.9), mg=(1.0, 1.0)), 1, 255, False)
    pa = pose(regard=-0.5, expr='colere', md=(1.6, 0.9), mg='hanches', main_d='papier',
              parle=parle(t, 1.0, 3.4) + parle(t, 6.6, 9.4) + parle(t, 12.4, 13.4))
    figure(c, 1560, H * 1.02, 760, 'amelie', pa, -1)
    pl = pose(regard=0.5, expr='gene' if t < 12 else 'determine', md='coeur', mg='ballant', parle=parle(t, 4.6, 5.4) + parle(t, 10.4, 10.8))
    figure(c, 860, H * 1.02, 720, 'louise_jour', pl, 1)
    if t > 12.4:
        lignes_vitesse(c, 960, 500, 420, 1400, 80, ENCRE, 9, 6, 140 * clamp(t - 12.4))
    dessiner_bulles(c, t, B112)

# 11.3 — « Je veux soigner les âmes »
B113 = [B(0.6, None, 'Je danse. Je lis des livres que vous ne voulez pas que je lise. Et je veux soigner les âmes, grand-mère.', W / 2, 150, None, largeur=1100, taille=40)]
def p113(c, t, f):
    gros_plan(c, t, 'louise', 'determine', 0.0, W / 2, H / 2 + 140, 300, 'lignes', 11, parle_=parle(t, 0.6, 6.4))
    dessiner_bulles(c, t, B113)
    if t > 7.4:
        k = ease(lin(t, 7.4, 8.0))
        def chat(c, w, h):
            salon_sarrail(c, w * 2, h * 2, t, 255, w, False, False)
            chopin(c, lerp(w * 1.2, w * 0.5, ease(lin(t, 7.6, 9.6))), h * 0.95, 300, -1, 255, queue=t * 2, assis=t > 9.6)
        case(c, (W - 700, H - 420, 640, 360), chat, t, k, 'bas')

# 11.4 — « Ma migraine… » « Amélie. Assieds-toi. »
B114 = [B(0.4, 1.8, 'Ma migraine…', 1450, 160, (1520, 330), largeur=320, style='murmure'),
        B(2.4, 2.4, 'Amélie. Assieds-toi.', 560, 160, (420, 420), largeur=380),
        B(4.8, 2.6, 'Édouard, tu avais promis.', 1450, 160, (1520, 330), largeur=420),
        B(7.4, 2.0, 'Je sais.', 560, 160, (420, 420), largeur=220)]
def p114(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, False, True)
    fauteuil(c, 300, H * 0.93, 1.1, 255, 1)
    leve = ease(lin(t, 9.4, 10.4))
    sort = ease(lin(t, 10.4, 12.0))
    if leve < 0.5:
        figure(c, 300, H * 0.92, 640, 'edouard', pose(assis=True, saut=-1.75, regard=0.6, expr='determine', md=(1.2, 1.6) if t > 2.2 else (1.2, 0.9),
                                                    mg=(1.0, 1.7), main_d='journal' if t < 2.2 else None, parle=parle(t, 2.4, 3.6) + parle(t, 7.4, 8.0)), 1, 255, False)
        if 2.0 < t < 3.0:
            onomatopee(c, 'frrt', 420, 380, 50, -8, ENCRE, PAPIER, 255 * env(t, 2.0, 3.0, 0.2))
    else:
        figure(c, lerp(360, -260, sort), H * 1.02, 720, 'edouard', pose(regard=-0.6, expr='determine', buste=6, md='ballant', mg='ballant',
                                                                     jd=math.sin(t * 6) * 12 * sort, jg=-math.sin(t * 6) * 12 * sort), -1)
    figure(c, 1560, H * 1.02, 760, 'amelie', pose(regard=-0.5, expr='triste' if t > 4.6 else 'ferme', md='front' if t < 4 else 'coeur', mg='ballant',
                                                  parle=parle(t, 0.4, 1.4) + parle(t, 4.8, 6.4)), -1)
    figure(c, 980, H * 1.02, 700, 'louise_jour', pose(regard=-0.5 if t < 9 else 0.5, expr='surpris', md='coeur', mg='ballant'), -1 if t < 9 else 1)
    if t > 12.0:
        for (t0, s, x, y) in ((12.2, 'toc', 220, 200), (12.8, 'toc', 300, 160), (13.4, 'criii', 200, 260)):
            onomatopee(c, s, x, y, 50, -8, ENCRE, PAPIER, 255 * env(t, t0, t0 + 1.4, 0.2))
    dessiner_bulles(c, t, B114)

# 11.5 — l'étui de violon
B115 = [B(2.6, 1.6, 'Grand-père ?', 1360, 180, (1260, 370), largeur=280),
        B(4.2, None, 'J’ai été violoniste avant d’être avoué. J’ai enfermé mon violon le jour où j’ai rencontré ta grand-mère. Elle me l’avait demandé.', 560, 170, (480, 380), largeur=640, taille=32),
        B(11.6, None, 'Je ne te l’avais pas demandé pour toujours.', 1500, 170, (1620, 360), largeur=480, style='murmure'),
        B(15.0, None, 'Je n’ai jamais su comment le reprendre.', 560, 170, (480, 380), largeur=520)]
def p115(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, False, True)
    k = ease(lin(t, 0, 1.2))
    figure(c, lerp(-200, 480, k), H * 1.02, 740, 'edouard', pose(regard=0.4, oeil=(0.3, 0.6), expr='tendre' if t > 4 else 'neutre', md=(1.4, 1.5), mg=(1.2, 1.6),
                                                             parle=parle(t, 4.2, 10.0) + parle(t, 15.0, 17.0)), 1)
    # l'étui ouvert sur la table basse
    poly(c, [(560, H * 0.82), (1180, H * 0.82), (1180, H * 0.86), (560, H * 0.86)], BRUN, 4)
    ouvre = ease(lin(t, 1.2, 2.4))
    poly(c, [(600, H * 0.82), (1140, H * 0.82), (1120, H * 0.72), (620, H * 0.72)], '#2a1a14', 4)
    poly(c, [(620, H * 0.72), (1120, H * 0.72), (1120, H * 0.72 - 120 * ouvre), (620, H * 0.72 - 120 * ouvre)], '#3a2a1c', 4, 255, 0.3)
    if ouvre > 0.3:
        c.drawRect(skia.Rect.MakeXYWH(630, H * 0.72, 480, 30), P(ROUGE))
        violon(c, 870, H * 0.73, 0.55, -90)
        for k_ in range(8):
            c.drawCircle(700 + k_ * 50, H * 0.7 - math.sin(t * 3 + k_) * 20 - (t - 1.2) * 30, 3, P(mix(PAPIER, ENCRE, 0.3), 200 * (1 - clamp((t - 1.2) / 3))))
        if t < 4.6:
            scintille(c, 760, H * 0.7, 30, 255 * env(t, 2.0, 4.6, 0.3))
    figure(c, 1240, H * 1.02, 700, 'louise_jour', pose(regard=-0.5, expr='surpris', md='bouche' if t < 4 else 'coeur', mg='ballant', parle=parle(t, 2.6, 3.4)), -1)
    figure(c, 1620, H * 1.02, 760, 'amelie', pose(regard=-0.5, expr='triste' if t < 11 else 'tendre', md='coeur', mg='ballant', parle=parle(t, 11.6, 13.6)), -1)
    dessiner_bulles(c, t, B115)

# 11.6 — le violon seul ; 11.7 — « Alors qu'il vienne dîner »
B117 = [B(0.6, 2.6, 'Ce garçon… il danse bien ?', 1460, 170, (1560, 360), largeur=420),
        B(3.4, None, 'Il danse comme on parle quand on a quelque chose à dire.', 640, 170, (760, 360), largeur=560),
        B(7.6, None, 'Alors qu’il vienne dîner. Samedi. Et qu’il apporte autre chose qu’un chapeau.', 1420, 170, (1560, 360), largeur=620)]
def p116(c, t, f):
    if t < 2.0:
        # le silence
        c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
        texte(c, '…', W / 2, H / 2, font('titre', 120), PAPIER, 255 * env(t, 0.2, 2.0, 0.3), 'center')
        return
    if t < 13.0:
        tt = t - 2.0
        c.drawRect(skia.Rect.MakeWH(W, H), P('#2a1e18'))
        soleil_deco(c, W * 0.4, H * 0.5, 160, 1500, 30, tt * 0.03, '#4a3428', 255)
        figure(c, 760, H * 1.04, 900, 'edouard', pose(regard=0.2, tete=14, expr='ferme', md=(0.2, -0.2), mg=(-1.6, 0.4 + math.sin(tt * 1.4) * 0.5)), 1)
        violon(c, 780, H * 0.3, 0.7, -60)
        trait(c, [(400, H * 0.18 + math.sin(tt * 1.4) * 50), (1100, H * 0.42 + math.sin(tt * 1.4) * 50)], 5, '#d8c8a0')
        notes_qui_montent(c, tt, 1000, H * 0.35, 5, 52, 255, OR, 0.2, 500, contour=None)
        texte(c, 'la valse de la cuisine, plus grave, plus ancienne', W - 60, H - 50, font('machine', 30), PAPIER, 255 * env(tt, 2.0, 8.0, 0.4), 'right')
        # réactions en petites cases
        for k, (nom, expr, t0) in enumerate((('louise', 'larmes', 3.0), ('amelie', 'ferme', 5.0))):
            a = env(tt, t0, 10.6, 0.3)
            if a > 0:
                case(c, (W - 560, 80 + k * 360, 500, 320),
                     lambda cc, w, h, nom=nom, expr=expr: gros_plan(cc, tt, nom, expr, 0.0, w / 2, h / 2 + 30, 120, 'noir', k, couleur_fond='#3a2a20'),
                     tt, a, 'droite')
        if tt > 7.2:
            case(c, (60, 80, 420, 280), lambda cc, w, h: (cc.drawRect(skia.Rect.MakeWH(w, h), P('#3a2a20')), chopin(cc, w / 2, h * 0.95, 260, 1, 255, 0.0, True)),
                 tt, env(tt, 7.2, 10.6, 0.3), 'gauche')
            texte(c, 'la queue immobile, enfin', 270, 400, font('main', 34), PAPIER, 255 * env(tt, 7.6, 10.6, 0.3), 'center')
        return
    tt = t - 13.0
    salon_sarrail(c, W, H, t, 255, 0, False, True)
    figure(c, 380, H * 1.02, 720, 'edouard', pose(regard=0.5, expr='sourire', md=(1.2, 1.5), mg=(1.0, 1.6)), 1)
    violon(c, 520, H * 0.7, 0.4, -100)
    embrasse = ease(lin(tt, 11.2, 12.0))
    figure(c, lerp(980, 1360, embrasse), H * 1.02, 700, 'louise_jour', pose(regard=-0.5 if embrasse < 0.5 else 0.6, expr='rire' if tt > 7.6 else 'tendre',
           md='ouvert' if embrasse > 0.5 else 'coeur', mg='ouvert' if embrasse > 0.5 else 'ballant', parle=parle(tt, 3.4, 6.6), rougir=0.5), -1 if embrasse < 0.5 else 1)
    figure(c, 1580, H * 1.02, 760, 'amelie', pose(regard=-0.5, expr='tendre' if tt < 11 else 'surpris', md='coeur', mg='ballant',
                                                   parle=parle(tt, 0.6, 2.4) + parle(tt, 7.6, 11.0), rougir=0.6 if tt > 11.6 else 0), -1)
    dessiner_bulles(c, tt, B117)
    if tt > 11.6:
        bulles_shojo(c, (1100, 100, 800, 700), tt, 16, 2, 220)
        texte(c, '(Elle ne l’avait pas fait depuis des années.)', W / 2, H - 50, font('italique', 34), ENCRE, 255 * clamp(tt - 12), 'center')

PLANS = [
    Plan(9.4, p111, '11.1', entree=('noir', 0.5)),
    Plan(15.2, p112, '11.2', entree=('fondu', 0.4)),
    Plan(10.6, p113, '11.3', entree=('blanc', 0.3)),
    Plan(13.8, p114, '11.4', entree=('fondu', 0.4)),
    Plan(17.6, p115, '11.5', entree=('fondu', 0.4)),
    Plan(28.6, p116, '11.6-11.7', entree=('noir', 0.4), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre onzième', 'Le violon'),
]
