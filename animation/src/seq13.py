"""Épilogue — près d'un siècle plus tard."""
from scenes import *

def voiture_moderne(c, x, sol, L, sens=1, phares=1.0, a=255):
    u = L / 10
    c.save(); c.translate(x, sol); c.scale(sens, 1)
    c.drawPath(ovale(0, 0, u * 5.2, u * 0.35), trame(0.5, 7, 45, ENCRE, int(a * 0.6)))
    if phares:
        c.drawPath(path_pts([(u * 4.6, -u * 1.6), (u * 13, -u * 2.8), (u * 13, -u * 0.2), (u * 4.6, -u * 1.2)]),
                   degrade(u * 4.6, 0, u * 13, 0, [hexc('#fff2c0', int(150 * phares)), hexc('#fff2c0', 0)]))
    caisse = path_pts([(-u * 4.8, -u * 0.9), (-u * 4.9, -u * 2.0), (-u * 3.2, -u * 2.3), (-u * 2.0, -u * 3.6), (u * 1.4, -u * 3.6),
                       (u * 2.8, -u * 2.4), (u * 4.7, -u * 2.0), (u * 4.9, -u * 0.9)], smooth=True)
    encre(c, caisse, '#e3b23c', u * 0.12, a)
    poly(c, [(-u * 1.8, -u * 2.4), (-u * 1.6, -u * 3.3), (u * 1.2, -u * 3.3), (u * 2.4, -u * 2.4)], '#20304a', u * 0.08, a)
    ligne(c, -u * 0.2, -u * 3.3, -u * 0.2, -u * 2.4, u * 0.1, a)
    for wx in (-u * 3.0, u * 3.0):
        c.drawCircle(wx, -u * 0.85, u * 0.95, P(ENCRE, a)); c.drawCircle(wx, -u * 0.85, u * 0.45, P('#9a9a9a', a))
    c.restore()

# E.1 — le vieux cabaret, puis la ville d'aujourd'hui
def pe1(c, t, f):
    k = ease(lin(t, 1.5, 5.5))
    ciel_nuit(c, W, H, t, 140, 4, lune=True, horizon=0.55)
    facade_cabaret(c, W, H, t, 255, 0, 8 if k < 0.5 else 0, 0.0)
    # surimpression : la rue d'aujourd'hui (le grain de pellicule s'efface)
    if k > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, H * 0.82, W, H * 0.18), P('#3a3a42', 255 * k))
        for j in range(12):
            ligne(c, j * 180 + 40, H * 0.9, j * 180 + 120, H * 0.9, 6, 255 * k, BLANC)
        for j in range(4):
            reverbere(c, 200 + j * 520, H * 0.84, 300, True, 255 * k)
    if t > 5.5:
        x = lerp(-600, W + 600, lin(t, 5.5, 9.0))
        voiture_moderne(c, x, H * 0.97, 520, 1, 1.0)
    papier(c, W - 760, 70, 680, 120, 255 * env(t, 1.0, 9.0, 0.4), 1.5, PAPIER, ROUGE)
    texte(c, 'Près d’un siècle plus tard', 340, 78, font('titre', 46), ENCRE, 255 * env(t, 1.0, 9.0, 0.4), 'center')
    c.restore()

# E.2 — à la fenêtre en demi-lune
def pe2(c, t, f):
    ciel_aube(c, W, H, 0.4, 0.72)
    toits_toulouse(c, W, H, H * 0.72, t, 0, False, 13, 255, 0.8)
    garonne(c, W, H * 0.72, H * 0.1, t, False)
    bx = W * 0.35
    poly(c, [(bx, H), (bx, H * 0.18), (bx + 640, H * 0.18), (bx + 640, H)], BRIQUE, 4, 255, 0.25, 5)
    fen = skia.Path(); fen.moveTo(bx + 60, H * 0.7); fen.arcTo(skia.Rect.MakeXYWH(bx + 60, H * 0.18, 520, 1040), 180, 180, False); fen.close()
    c.drawPath(fen, P('#f6e7c4'))
    c.save(); c.clipPath(fen, doAntiAlias=True)
    figure(c, bx + 250, H * 1.25, 900, 'lui', pose(regard=0.5, expr='sourire', md=(1.4, -0.9) if t > 4.6 else 'dos', mg='dos'), 1, 255, False)
    figure(c, bx + 430, H * 1.25, 840, 'elle', pose(regard=-0.5, expr='sourire', md='coeur', mg='ballant', rougir=0.4), -1, 255, False)
    c.restore()
    c.drawPath(fen, P(ENCRE, stroke=10))
    ligne(c, bx + 40, H * 0.7, bx + 600, H * 0.7, 18, 255, BRUN)
    poly(c, [(bx + 40, H * 0.86), (bx + 600, H * 0.86), (bx + 600, H * 0.92), (bx + 40, H * 0.92)], '#5a3e1b', 3)
    texte(c, 'BOULANGERIE', bx + 320, H * 0.905, font('titre', 34), OR, 255, 'center')
    # le pouce levé : bleu de Prusse
    if t > 4.6:
        k = env(t, 5.0, 9.6, 0.3)
        def pouce(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(BLANC))
            lignes_vitesse(c, w / 2, h / 2, 90, 700, 50, ENCRE, 3, 5)
            encre(c, capsule((w * 0.5, h * 0.9), (w * 0.5, h * 0.25), 70, 56), PEAU, 6)
            c.drawPath(ovale(w * 0.5, h * 0.27, 34, 26), P(BLEU)); c.drawPath(ovale(w * 0.5, h * 0.27, 34, 26), P(ENCRE, stroke=4))
        case(c, (60, 60, 420, 420), pouce, t, k, 'gauche')
    dessiner_recits(c, t, [R_(1.0, 7.8, 'Il existe des histoires qui ne se terminent pas. Elles changent de siècle.', W - 860, H - 230, 800, 40)])

# E.3 — 0 h 48, une étoile rouge
def pe3(c, t, f):
    if t < 2.6:
        c.drawRect(skia.Rect.MakeWH(W, H), P('#141414'))
        poly(c, [(W * 0.3, H * 0.3), (W * 0.7, H * 0.3), (W * 0.7, H * 0.7), (W * 0.3, H * 0.7)], '#0a1a14', 6)
        texte(c, '00:48', W / 2, H / 2 + 60, font('machine', 180), '#7ae0a0', 255, 'center')
        return
    tt = t - 2.6
    champs_nuit(c, W, H, t, 255, t * 20, 0.66, True, True)
    x = lerp(W * 0.3, W * 0.62, ease_out(lin(tt, 0, 6)))
    voiture_moderne(c, x, H * 0.96, 720, 1, 1.0)
    p = ease(lin(tt, 1.0, 3.2))
    etoile_filante(c, W * 0.95, H * 0.06, W * 0.15, H * 0.42, p, 255, ROUGE, 12)
    if tt > 3.6:
        def interieur(c, w, h):
            c.drawRect(skia.Rect.MakeWH(w, h), P(NUIT))
            for (nom, xx, s) in (('lui', w * 0.35, 1), ('elle', w * 0.65, -1)):
                tete(c, xx, h * 0.6, 120, nom, 'surpris' if tt < 5.6 else 'tendre', 0.5 * s, 0, 255, (0.4 * s, -0.6))
            etoile_filante(c, w * 0.9, h * 0.05, w * 0.6, h * 0.3, 1.0, 180, ROUGE, 5)
        case(c, (W / 2 - 520, 60, 1040, 380), interieur, tt, env(tt, 3.6, 9.4, 0.4), 'haut')
    if tt > 5.0:
        violon_discret = 200 * env(tt, 5.0, 9.4, 0.6)
        texte(c, '(au loin, très doucement, un violon)', W / 2, H - 60, font('italique', 32), PAPIER, violon_discret, 'center')

# E.4 — l'étoile redevient l'enseigne ; l'iris se ferme
def pe4(c, t, f):
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    k = ease(lin(t, 0.4, 3.0))
    soleil_deco(c, W / 2, H / 2, 100, 1300, 36, t * 0.04, mix(ENCRE, ROUGE, 0.3), 255 * k)
    enseigne_etoile(c, W / 2, H / 2, lerp(20, 170, k), t, int(k * 8.99), 255, 1.0 - k * 0.6)
    # trois notes qui montent… et cette fois se résolvent
    for k_, tn in enumerate((3.2, 3.8, 4.4, 5.0)):
        if t > tn:
            note_musique(c, W / 2 + 280 + k_ * 100, H / 2 + 80 - min(k_, 2) * 70 - (40 if k_ == 3 else 0), 54, k_ == 3, 255 * env(t, tn, 8.0, 0.3), OR, -10, None)
    iris(c, 0, W / 2, H / 2, 1 - ease(lin(t, 7.0, 9.0)))

def pfin(c, t, f):
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    a = 255 * ease(lin(t, 0.4, 1.6))
    cadre_deco(c, 360, 240, W - 720, H - 480, OR, a)
    texte(c, 'Fin', W / 2, H / 2 + 50, font('titre', 160), OR, a, 'center')
    etoile(c, W / 2, H / 2 - 130, 26, 8, 0.42, ROUGE, a)

PLANS = [
    Plan(9.4, pe1, 'E.1', entree=('noir', 0.8)),
    Plan(10.0, pe2, 'E.2', entree=('fondu', 0.8)),
    Plan(12.4, pe3, 'E.3', entree=('noir', 0.4)),
    Plan(9.4, pe4, 'E.4', entree=('fondu', 0.6)),
    Plan(6.0, pfin, 'fin', sortie=('noir', 1.2)),
]
