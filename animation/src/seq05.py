"""Séquence 5 — le portrait (chapitre 5). Montage alterné : le grenier / la chambre."""
from scenes import *

def split(c, t, gauche, droite, ratio=0.5):
    """Écran coupé en deux cases obliques (montage alterné)."""
    fond_cases(c)
    xm = W * ratio
    case(c, (24, 24, xm - 40, H - 48), gauche, t, 1.0, 'gauche', biais=((0, 0), (40, 0), (-40, 0), (0, 0)))
    case(c, (xm + 16, 24, W - xm - 40, H - 48), droite, t, 1.0, 'droite', biais=((40, 0), (0, 0), (0, 0), (-40, 0)))

# 5.1 — le grenier : la toile blanche, le bleu de Prusse
def grenier_peint(c, w, h, t, avancement, cam=0):
    grenier(c, w * 1.6, h, t, True, w * 0.5, fenetre=True, aube=avancement * 0.6)
    lampe_bureau(c, w * 0.06, h * 0.82, 0.9)
    tx, ty, tw, th = chevalet(c, w * 0.7, h * 0.9, h * 0.62, 'vide')
    portrait_louise(c, tx + 6, ty + 6, tw - 12, th - 12, avancement)
    return (tx, ty, tw, th)

def p51(c, t, f):
    def g(c, w, h):
        tx, ty, tw, th = grenier_peint(c, w, h, t, ease(lin(t, 1.5, 9.0)) * 0.55)
        po = pose(regard=0.7, expr='pensif', md=(2.0 + math.sin(t * 4) * 0.2, 0.3 + math.cos(t * 3) * 0.3), mg=(-0.6, 2.0), main_d='pinceau', buste=8)
        figure(c, w * 0.32, h * 1.08, h * 0.9, 'celestin', po, 1)
        if t < 2.0:
            onomatopee(c, 'clic', w * 0.3, h * 0.2, 44, -10, ENCRE, PAPIER, 255 * env(t, 0.2, 2.0, 0.2))
    def d(c, w, h):
        chambre_louise(c, w * 1.6, h, t, 255, True, w * 0.6, False, True)
        po = pose(regard=-0.3, expr='neutre', md='coeur', mg='ballant')
        figure(c, w * 0.55, h * 1.06, h * 0.82, 'louise_manteau', po, -1)
    split(c, t, g, d, 0.58)
    dessiner_recits(c, t, [R_(3.0, 5.8, 'Il peignit un visage qu’il avait vu une seule fois.', 80, 860, 860, 38)])
    sous_titre_lieu(c, t, 'Cette même nuit', 0.3, 3.2)

# 5.2 — « Élisabeth. »
B52 = [B(1.4, 2.2, 'Élisabeth.', 1500, 200, (1580, 360), largeur=320, style='cri', taille=46),
       B(4.2, None, 'Une demoiselle ne rentre pas à cette heure. Tu resteras ici jusqu’à ce que tu aies réfléchi.', 1350, 190, (1560, 380), largeur=620, taille=34)]
def p52(c, t, f):
    chambre_louise(c, W, H, t, 255, True, 0, False, True)
    ouvre = ease(lin(t, 0.2, 0.8))
    poly(c, [(1500, H * 0.75), (1500, H * 0.12), (1800, H * 0.12), (1800, H * 0.75)], '#f6d98a', 4)
    sortie = ease(lin(t, 10.6, 11.4))
    if sortie < 1:
        pa = pose(regard=-0.6, expr='colere', md=(1.3, 1.4), mg='hanches', parle=parle(t, B52[0]['t0'], B52[0]['t0'] + 0.8) + parle(t, B52[1]['t0'], B52[1]['t0'] + 5))
        figure(c, lerp(1640, 1900, sortie), H * 0.97, 760, 'amelie', pa, -1)
    porte = ouvre * (1 - ease(lin(t, 11.0, 11.5)))
    poly(c, [(1500, H * 0.75), (1500, H * 0.12), (lerp(1800, 1560, porte), H * 0.08), (lerp(1800, 1560, porte), H * 0.79)], BRUN, 4, 255, 0.3)
    if t < 2:
        lignes_vitesse(c, 960, 400, 380, 1400, 70, ENCRE, 3, 6, 160 * env(t, 1.2, 2.2, 0.15))
    pl = pose(regard=0.6, expr='surpris' if t < 4 else ('triste' if t < 11.5 else 'determine'), md='coeur', mg='ballant')
    figure(c, 760, H * 1.02, 760, 'louise_manteau', pl, 1)
    if t > 11.3:
        onomatopee(c, 'CLAC', 1640, 420, 120, -10, ENCRE, PAPIER, 255 * env(t, 11.3, 12.8, 0.1), back_out(lin(t, 11.3, 11.5)))
        lignes_vitesse(c, 1640, 420, 120, 600, 40, ENCRE, 2, 6, 255 * env(t, 11.3, 12.6, 0.1))
    dessiner_bulles(c, t, B52)

# 5.3 — le carnet ; 5.4 — Chopin
def p53(c, t, f):
    chambre_louise(c, W, H, t, 255, True, 0, t > 6.0, True)
    # bureau et carnet
    poly(c, [(220, H * 0.64), (980, H * 0.64), (980, H * 0.68), (220, H * 0.68)], BRUN, 4, 255, 0.3)
    for xx in (240, 950):
        ligne(c, xx, H * 0.68, xx, H * 0.95, 8, 255, BRUN)
    po = pose(assis=True, regard=0.4, oeil=(0.3, 0.7), expr='pensif' if t < 6 else ('surpris' if t < 7.5 else 'sourire'), md='ecrit', mg=(1.6, 1.7), buste=14)
    figure(c, 330, H * 0.99, 700, 'louise_jour', po, 1, 255, False)
    # les mots s'envolent par la fenêtre
    mots = ['minuit', 'le peintre', 'bleu', 'une danse', 'qui n’existe pas']
    for k, m in enumerate(mots):
        ph = clamp((t - 1.0 - k * 0.9) / 3.6)
        if 0 < ph < 1:
            x = lerp(700, 1550, ph) + math.sin(ph * 6 + k) * 40
            y = lerp(H * 0.58, H * 0.2, ph) + math.cos(ph * 5 + k) * 30
            texte(c, m, x, y, font('main', 46), ENCRE, 255 * env(ph, 0, 1, 0.2), 'center')
    # Chopin sur le rebord, puis à l'intérieur
    if t < 6.2:
        chopin(c, 1420, H * 0.62, 160, -1, 255, queue=t * 2, assis=True)
    else:
        k = ease(lin(t, 6.2, 7.2))
        x = lerp(1300, 520, k) if t < 9.4 else lerp(520, 1500, ease(lin(t, 9.4, 11.0)))
        chopin(c, x, H * 0.97, 220, -1 if t < 9.4 else 1, 255, queue=t * 3, assis=False)
        if 7.4 < t < 9.2:
            onomatopee(c, 'rrr', 560, H * 0.7, 60, -10, ENCRE, PAPIER, 255 * env(t, 7.4, 9.2, 0.2))
    bulle(c, 'Tu es indépendant, toi.', 760, 260, 440, (480, 420), 255 * env(t, 9.2, 12.4, 0.2), clamp((t - 9.2) / 0.25), 36, visible=ecriture(t, 9.3, '', 26))
    if t > 11.6:
        bulle(c, '(Évidemment.)', 1500, 650, 300, (1520, 860), 255 * env(t, 11.6, 13.6, 0.2), clamp((t - 11.6) / 0.25), 32, 'pensee')
    # la page arrachée, glissée sous le tapis (petit insert)
    k = env(t, 3.0, 5.6, 0.3)
    if k > 0:
        def page(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P('#f7efdf'))
            rng = random.Random(3)
            for i in range(9):
                pts = [(30 + j * (w - 60) / 20, 40 + i * 32 + math.sin(j * 1.7 + i) * 3) for j in range(21)]
                trait(c, pts, 2, BLEU, 200)
            trait(c, [(w - 10, 0), (w - 30, h * 0.3), (w - 8, h * 0.6), (w - 26, h)], 4, ENCRE)
            texte(c, 'crrrac', w / 2, h - 30, font('titre', 40), ROUGE, 255, 'center')
        case(c, (W - 620, 60, 540, 360), page, t, k, 'droite', fond='#f7efdf')

# 5.5 — au petit jour, le portrait terminé ; madame Fabre
B55 = [B(4.2, 2.2, 'Mon Dieu. C’est qui ?', 1400, 200, (1500, 380), largeur=380),
       B(6.6, 3.0, 'Je ne sais pas encore.', 560, 200, (620, 360), largeur=420)]
def p55(c, t, f):
    grenier(c, W, H, t, True, 0, fenetre=True, aube=1.0)
    tx, ty, tw, th = chevalet(c, 960, H * 0.95, 760, 'vide')
    portrait_louise(c, tx + 6, ty + 6, tw - 12, th - 12, 1.0)
    recul = ease(lin(t, 0.4, 1.6))
    pc = pose(regard=0.8, expr='surpris' if t < 3 else ('pensif' if t < 6.6 else 'sourire'), md='ballant', mg='ballant', main_d='pinceau',
              parle=parle(t, B55[1]['t0'], B55[1]['t0'] + 1.2))
    figure(c, lerp(560, 440, recul), H * 1.03, 800, 'celestin', pc, 1)
    if t < 3:
        lignes_vitesse(c, 960, H * 0.45, 330, 1300, 80, ENCRE, 4, 5, 200 * env(t, 0.3, 3.0, 0.3))
    k = ease(lin(t, 3.0, 4.0)) * (1 - ease(lin(t, 10.0, 11.0)))
    pf = pose(regard=-0.5, expr='surpris' if t < 6 else 'sourire', md='bouche' if t < 6.4 else 'repos', mg=(1.4, 1.4),
              parle=parle(t, B55[0]['t0'], B55[0]['t0'] + 1))
    figure(c, lerp(2100, 1500, k), H * 1.02, 640, 'fabre', pf, -1)
    if 7.6 < t:
        croissant(c, 1300, H * 0.72, 30)
    dessiner_bulles(c, t, B55)

PLANS = [
    Plan(9.4, p51, '5.1', entree=('noir', 0.5)),
    Plan(13.0, p52, '5.2', entree=('fondu', 0.3)),
    Plan(14.0, p53, '5.3', entree=('fondu', 0.4)),
    Plan(11.4, p55, '5.5', entree=('fondu', 0.6), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre cinquième', 'Le portrait'),
]
