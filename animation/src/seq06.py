"""Séquence 6 — le dîner avec Henri (chapitre 6)."""
from scenes import *

def nappe_devant(c, x0=0.02):
    """Le bord de la table, au premier plan : les convives sont assis derrière."""
    poly(c, [(W * x0, H * 0.8), (W * 0.98, H * 0.8), (W * 0.98, H), (W * x0, H)], BLANC, 4, 255)
    c.drawRect(skia.Rect.MakeXYWH(W * x0, H * 0.84, W * (0.98 - x0), H * 0.16), trame(0.1, 5, 45, ENCRE))
    for k in range(6):
        ax = W * (0.15 + k * 0.14)
        if ax > W * x0:
            c.drawPath(ovale(ax, H * 0.815, 50, 12), P('#f4f0e8')); c.drawPath(ovale(ax, H * 0.815, 50, 12), P(ENCRE, stroke=2.5))

def convives(c, t, henri_x=1180, louise_expr='neutre', henri_expr='gene', henri_parle=0, louise_parle=0, amelie=True, edouard=True,
             amelie_expr='neutre', amelie_parle=0, rougir_h=0.0):
    salle_a_manger(c, W, H, t, 255, 0, True)
    if edouard:
        figure(c, 260, H * 1.0, 640, 'edouard', pose(assis=True, regard=0.5, md=(1.4, 1.0), mg=(1.3, 1.1), main_d='journal', clign=cligne(t, 2)), 1, 255, False)
    if amelie:
        figure(c, 1700, H * 1.0, 600, 'amelie', pose(assis=True, regard=-0.6, expr=amelie_expr, md=(1.4, 1.5), mg=(1.2, 1.6), parle=amelie_parle), -1, 255, False)
    figure(c, 720, H * 1.0, 600, 'louise_jour', pose(assis=True, regard=0.5, expr=louise_expr, md=(1.3, 1.6), mg=(1.1, 1.7), parle=louise_parle), 1, 255, False)
    figure(c, henri_x, H * 1.0, 660, 'henri', pose(assis=True, regard=-0.5, expr=henri_expr, md=(1.3, 1.5), mg=(1.1, 1.6), parle=henri_parle, rougir=rougir_h), -1, 255, False)
    # la nappe passe devant les jambes
    nappe_devant(c)

# 6.1 — la présentation
B61 = [B(1.2, None, 'Louise, monsieur Henri Lasserre, notaire.', 1450, 170, (1650, 420), largeur=520)]
def p61(c, t, f):
    salle_a_manger(c, W, H, t, 255, 0, True)
    figure(c, 260, H * 1.0, 640, 'edouard', pose(assis=True, regard=0.5, md=(1.4, 1.0), mg=(1.3, 1.1), main_d='journal'), 1, 255, False)
    pa = pose(regard=-0.4, expr='sourire', md='ouvert', mg='hanches', parle=parle(t, B61[0]['t0'], B61[0]['t0'] + 2.5))
    figure(c, 1650, H * 1.03, 760, 'amelie', pa, -1)
    # Henri se lève trop vite et renverse la salière
    leve = ease(lin(t, 4.2, 4.7))
    ph = pose(assis=leve < 0.5, regard=-0.4, expr='gene' if t > 4.6 else 'neutre', rougir=0.8 if t > 4.8 else 0, md=(1.6, 1.0) if leve > 0.5 else (1.3, 1.5), mg='ballant')
    figure(c, 1200, H * 1.0 if leve < 0.5 else H * 1.02, 700, 'henri', ph, -1, 255, False)
    pl = pose(regard=0.5, expr='neutre', md='coeur', mg='ballant')
    k = ease(lin(t, 0.0, 1.2))
    figure(c, lerp(-150, 700, k), H * 1.03, 700, 'louise_jour', pl, 1)
    nappe_devant(c, 0.25)
    if t > 4.6:
        sx = 1040 + ease(lin(t, 4.6, 5.0)) * 30
        poly(c, [(sx, H * 0.86), (sx + 40, H * 0.84), (sx + 46, H * 0.86), (sx + 6, H * 0.88)], BLANC, 3)
        for k_ in range(10):
            c.drawCircle(sx - 20 - k_ * 9, H * 0.865 + math.sin(k_) * 6, 3, P(ENCRE))
        onomatopee(c, 'BLING', 980, H * 0.7, 60, -10, ENCRE, PAPIER, 255 * env(t, 4.6, 6.4, 0.15))
        onomatopee(c, 'hic', 1320, 300, 50, 10, ENCRE, PAPIER, 255 * env(t, 5.0, 6.6, 0.15))
    dessiner_bulles(c, t, B61)

# 6.2 — le dîner ; Chopin traverse la table
B62 = [B(4.0, None, 'Les contrats, voyez-vous, c’est la sécurité.', 1540, 170, (1680, 520), largeur=460, taille=32),
       B(7.6, None, 'Laissez-le, Amélie. C’est l’unique convive qui n’ait rien à demander.', 420, 170, (300, 470), largeur=560, taille=34)]
def p62(c, t, f):
    convives(c, t, amelie_expr='colere' if 6 < t < 10 else 'neutre', amelie_parle=parle(t, B62[0]['t0'], B62[0]['t0'] + 2))
    cx = lerp(-200, W + 200, lin(t, 5.0, 11.0))
    chopin(c, cx, H * 0.86, 220, 1, 255, queue=t * 2.5, assis=False)
    if 6.0 < t < 8.0:
        onomatopee(c, '!!', 1650, 380, 80, 8, ROUGE, PAPIER, 255 * env(t, 6.0, 8.0, 0.15))
    dessiner_bulles(c, t, B62)
    # le journal se baisse à peine
    texte(c, 'tic… tac…', 1850, 70, font('machine', 30), PAPIER, 160 * (0.5 + 0.5 * math.sin(t * 3)), 'right')

# 6.3 — dessert : la migraine, ils restent seuls
B63 = [B(0.6, 2.0, 'Ma migraine…', 1600, 190, (1700, 420), largeur=320, style='murmure'),
       B(5.0, None, 'Mademoiselle, je dois vous dire quelque chose de très grave.', 1350, 180, (1260, 370), largeur=520, style='murmure', taille=34),
       B(9.0, 2.4, 'Moi aussi.', 580, 200, (700, 380), largeur=260, style='murmure')]
def p63(c, t, f):
    part = ease(lin(t, 1.6, 3.4))
    salle_a_manger(c, W, H, t, 255, 0, True)
    if part < 1:
        figure(c, lerp(260, -300, part), H * 1.02, 640, 'edouard', pose(regard=0.5, md=(1.4, 1.0), mg=(1.3, 1.1), main_d='journal'), -1, 255)
        figure(c, lerp(1700, 2200, part), H * 1.02, 700, 'amelie', pose(regard=0.6, expr='ferme', md='front', mg='ballant', parle=parle(t, 0.6, 1.6)), 1, 255)
    figure(c, 720, H * 1.0, 600, 'louise_jour', pose(assis=True, regard=0.5, expr='pensif' if t < 9 else 'surpris', md=(1.3, 1.6), mg=(1.1, 1.7), parle=parle(t, 9.0, 9.8)), 1, 255, False)
    figure(c, 1180, H * 1.0, 660, 'henri', pose(assis=True, regard=-0.5, expr='gene' if t < 5 else 'determine', md=(1.3, 1.5), mg=(1.1, 1.6), parle=parle(t, 5.0, 7.5)), -1, 255, False)
    nappe_devant(c)
    if 3.4 < t < 5.0:
        onomatopee(c, '…', W / 2, 260, 140, 0, ENCRE, PAPIER, 255 * env(t, 3.4, 5.0, 0.3))
    if t > 10.6:
        onomatopee(c, 'pfff', 900, 430, 56, -6, ENCRE, PAPIER, 255 * env(t, 10.6, 12.0, 0.2))
        onomatopee(c, 'pfff', 1060, 430, 56, 6, ENCRE, PAPIER, 255 * env(t, 10.6, 12.0, 0.2))
    dessiner_bulles(c, t, B63)

# 6.4 — l'alliance
B64 = [B(0.6, None, 'Je ne suis pas venu pour vous, mademoiselle.', 1350, 170, (1200, 380), largeur=520),
       B(4.0, 2.4, 'Moi non plus !', 560, 200, (690, 380), largeur=320, style='cri'),
       B(6.6, None, 'J’aime une institutrice de Blagnac.', 1350, 170, (1200, 380), largeur=480),
       B(9.8, None, 'Moi, je ne peux pas tout vous dire.', 560, 200, (690, 380), largeur=460),
       B(13.0, 2.8, 'Alors nous sommes alliés.', 1350, 170, (1200, 380), largeur=420)]
def p64(c, t, f):
    fond_cases(c)
    def gp(c, w, h):
        gros_plan(c, t, 'henri', 'gene' if t < 6 else ('tendre' if t < 9 else 'determine'), -0.3, w / 2, h / 2 + 40, 200, 'trame', 7,
                  rougir=1.0 if 6.6 < t < 9.6 else 0, parle_=parle(t, 0.6, 2.8) + parle(t, 6.6, 8.6) + parle(t, 13.0, 14.4))
        if 6.6 < t < 9.6:
            bulles_shojo(c, (0, 0, w, h), t, 14, 5, 200)
    def gl(c, w, h):
        e = 'surpris' if 2.6 < t < 4 else ('rire' if 4.0 < t < 6.4 else ('pensif' if t < 13 else 'determine'))
        gros_plan(c, t, 'louise', e, 0.3, w / 2, h / 2 + 40, 200, 'lignes' if 4 < t < 6.4 else 'trame', 2,
                  parle_=parle(t, 4.0, 4.8) + parle(t, 9.8, 11.8))
    case(c, (24, 24, 924, 1032), gl, t, 1.0, 'gauche')
    case(c, (972, 24, 924, 1032), gp, t, 1.0, 'droite')
    dessiner_bulles(c, t, B64)
    # la poignée de main par-dessus la nappe
    k = ease(lin(t, 15.4, 16.2))
    if k > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, H * 0.5 - 220 * k, W, 440 * k), P(PAPIER))
        lignes_vitesse(c, W / 2, H / 2, 160, 1200, 70, ENCRE, 5, 6, 255 * k)
        for side in (-1, 1):
            manche = capsule((W / 2 + side * 900, H / 2 + 60), (W / 2 + side * 120, H / 2), 70, 60)
            etoffe(c, manche, 'gris1' if side < 0 else 'gris3', 6, 255 * k)
        gant = union(ovale(W / 2, H / 2, 150, 90), ovale(W / 2 - 60, H / 2 - 50, 60, 40))
        encre(c, gant, BLANC, 6, 255 * k)
        for j in range(3):
            trait(c, [(W / 2 - 60 + j * 50, H / 2 - 40), (W / 2 - 40 + j * 50, H / 2 + 50)], 4, ENCRE, 255 * k)
        onomatopee(c, 'TOPE !', W / 2, H / 2 - 200, 100, -6, ROUGE, PAPIER, 255 * k)

# 6.5 — une porte de secours
B65 = [B(1.0, None, 'Quand vous aurez besoin d’une fenêtre ouverte, je serai une porte de secours.', 1300, 180, (1160, 380), largeur=600)]
def p65(c, t, f):
    salon_sarrail(c, W, H, t, 255, 0, True, True)
    ph = pose(regard=-0.5, expr='tendre' if t < 6 else 'neutre', md=(1.6, 1.2) if t < 4 else 'ballant', mg='dos', parle=parle(t, 1.0, 4.4))
    figure(c, 1180, H * 1.02, 760, 'henri', ph, -1)
    pl = pose(regard=0.5, expr='surpris' if t < 4 else 'sourire', md=(1.6, 1.3) if t < 4 else 'coeur', mg='ballant', main_d='papier' if t > 3.4 else None)
    figure(c, 760, H * 1.02, 700, 'louise_jour', pl, 1)
    if t > 5.5:
        pa = pose(regard=0.5, expr='sourire', md='ouvert', mg='hanches')
        figure(c, 1700, H * 1.02, 760, 'amelie', pa, -1)
        bulle(c, 'Bonsoir, madame.', 1350, 260, 340, (1200, 380), 255 * env(t, 6.2, 8.6, 0.2), clamp((t - 6.2) / 0.25), 34)
    dessiner_bulles(c, t, B65)

PLANS = [
    Plan(7.6, p61, '6.1', entree=('noir', 0.5)),
    Plan(13.0, p62, '6.2', entree=('fondu', 0.4)),
    Plan(12.4, p63, '6.3', entree=('fondu', 0.4)),
    Plan(17.4, p64, '6.4', entree=('blanc', 0.3)),
    Plan(9.4, p65, '6.5', entree=('fondu', 0.4), sortie=('iris', 1.0)),
    titre_chapitre('Chapitre sixième', 'Le dîner avec Henri'),
]
