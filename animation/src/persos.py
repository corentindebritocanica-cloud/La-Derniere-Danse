"""Personnages façon manga de danse, habillés en 1925.

- tete(...)   : visage manga (utilisable du petit format au très gros plan)
- figure(...) : pantin articulé en pied
- mini(...)   : la Citroën Type C jaune ; chopin(...) : le chat
"""
import math
import skia
from moteur import *

# ---------------------------------------------------------------- fiches des personnages
CHEVEUX = '#2a1f19'
GRIS_CH = '#d9d2c4'

PERSOS = {
    'celestin': dict(cheveux='bataille', ch=CHEVEUX, lunettes=True, yeux=1.0, cils=0, peau=PEAU,
                     haut='chemise_gilet', c_haut=BLANC, c_gilet='gris2', bas='pantalon', c_bas='gris3',
                     epaules=1.0, bouche='travers', pouce_bleu=True, sourcils=1.0),
    'celestin_frac': dict(cheveux='bataille', ch=CHEVEUX, lunettes=True, yeux=1.0, cils=0, peau=PEAU,
                          haut='frac', c_haut='noir', bas='pantalon', c_bas='noir', noeud=ENCRE,
                          epaules=1.0, bouche='travers', pouce_bleu=True),
    'louise': dict(cheveux='carre', ch=CHEVEUX, yeux=1.32, cils=1, peau=PEAU, haut='robe', c_haut=BLEU,
                   franges=True, bas='bas', epaules=0.82, bouche='fine', sourcils=0.9, collier=True),
    'louise_jour': dict(cheveux='carre', ch=CHEVEUX, yeux=1.32, cils=1, peau=PEAU, haut='robe', c_haut='gris1',
                        bas='bas', epaules=0.82, bouche='fine', col_blanc=True),
    'louise_manteau': dict(cheveux='carre', ch=CHEVEUX, yeux=1.32, cils=1, peau=PEAU, haut='manteau', c_haut='gris3',
                           bas='bas', epaules=0.84, bouche='fine', chapeau='cloche', c_chapeau=ROUGE),
    'julien': dict(cheveux='court', ch='#4a3a2c', yeux=0.95, peau=PEAU, haut='veste', c_haut='gris2', c_chemise=BLANC,
                   bas='pantalon', c_bas='gris3', chapeau='mou', c_chapeau='noir', epaules=1.0, cravate=ROUGE),
    'fabre': dict(cheveux='foulard', ch='#5a463a', c_foulard='#c9b9a0', yeux=0.85, peau=PEAU, haut='tablier', c_haut='gris1',
                  c_tablier=BLANC, bas='bas', epaules=1.15, ventre=1.5, joues=True, bouche='rond'),
    'baylac': dict(cheveux='plaque', ch='#3b3b3b', yeux=0.62, peau=PEAU, haut='veste', c_haut='gris3', c_chemise=BLANC,
                   bas='pantalon', c_bas='noir', moustache='brosse', epaules=1.0, sourcils=1.4, rides=1, cravate=ENCRE),
    'solange': dict(cheveux='chignon', ch='#1d1716', yeux=1.05, cils=2, peau=PEAU, haut='robe', c_haut='noir',
                    bas='bas', epaules=0.82, grain_beaute=True, rides=0.5, bouche='rouge'),
    'maurice': dict(cheveux='degarni', ch='#3a2e26', yeux=0.7, peau=PEAU, haut='smoking', c_haut='noir', c_chemise=BLANC,
                    bas='pantalon', c_bas='noir', moustache='guidon', noeud=ROUGE, epaules=1.2, ventre=1.7, joues=True),
    'leon': dict(cheveux='boucles', ch='#1a1412', yeux=0.95, peau=PEAU_SOMBRE, haut='chemise', c_haut=BLANC, gilet_ouvert='noir',
                 bas='pantalon', c_bas='noir', epaules=1.05, noeud=ROUGE, moustache='fine'),
    'edouard': dict(cheveux='blanc', ch=GRIS_CH, yeux=0.6, peau=PEAU, haut='veste', c_haut='gris2', c_chemise=BLANC,
                    bas='pantalon', c_bas='gris3', moustache='blanche', lorgnon=True, rides=1.2, epaules=1.0, cravate=ENCRE),
    'amelie': dict(cheveux='chignon_blanc', ch=GRIS_CH, yeux=0.72, cils=1, peau=PEAU, haut='robe_longue', c_haut='gris3',
                   chale='gris1', bas='bas', epaules=0.85, rides=1.0, bouche='pincee', perles=True),
    'marthe': dict(cheveux='bonnet', ch='#8c8578', yeux=0.6, peau=PEAU, haut='robe_longue', c_haut='noir', c_tablier=BLANC,
                   bas='bas', epaules=0.8, rides=1.4, voute=8),
    'henri': dict(cheveux='plaque', ch='#4a3a2c', lunettes=True, yeux=0.9, peau=PEAU, haut='veste', c_haut='gris3', c_chemise=BLANC,
                  bas='pantalon', c_bas='gris3', epaules=0.95, col_dur=True, cravate=ENCRE),
    'jeanne': dict(cheveux='tresse', ch='#6a4a2c', yeux=1.15, cils=1, peau=PEAU, haut='robe', c_haut='gris1', col_blanc=True,
                   bas='bas', epaules=0.84, chapeau='beret', c_chapeau=ROUGE, taches=True),
    'gaston': dict(cheveux='court', ch='#4a3a2c', lunettes=False, yeux=0.8, peau=PEAU, haut='soutane', c_haut='noir',
                   bas='golf', c_bas='#b89a5c', epaules=0.95, col_romain=True),
    'monsieur': dict(cheveux='degarni', ch='#5a5048', yeux=0.6, peau=PEAU, haut='veste', c_haut='gris2', c_chemise=BLANC,
                     bas='pantalon', c_bas='gris3', moustache='guidon', epaules=1.05, ventre=1.3, rides=0.8, cravate=BRUN),
    'lui': dict(cheveux='bataille', ch=CHEVEUX, lunettes=True, yeux=1.0, peau=PEAU, haut='chemise', c_haut='gris1',
                bas='pantalon', c_bas=BLEU, epaules=1.0, bouche='travers', pouce_bleu=True),
    'elle': dict(cheveux='carre', ch=CHEVEUX, yeux=1.32, cils=1, peau=PEAU, haut='chemise', c_haut=BLANC, bas='pantalon', c_bas='gris3',
                 epaules=0.82, bouche='fine'),
    'figurant_h': dict(cheveux='plaque', ch=CHEVEUX, yeux=0.8, peau=PEAU, haut='smoking', c_haut='noir', c_chemise=BLANC,
                       bas='pantalon', c_bas='noir', epaules=1.0, noeud=ENCRE),
    'figurante': dict(cheveux='carre', ch='#3a2a22', yeux=1.1, cils=1, peau=PEAU, haut='robe', c_haut='gris3', franges=True,
                      bas='bas', epaules=0.8),
    'enfant': dict(cheveux='court', ch='#5a3e2b', yeux=1.2, peau=PEAU, haut='chemise', c_haut=BLANC, bas='pantalon',
                   c_bas='gris2', epaules=0.8),
}

# ---------------------------------------------------------------- outils géométriques
def rad(a):
    return math.radians(a)

def vers(p, ang, L):
    """Point à distance L depuis p, ang en degrés (0 = vers le bas, 90 = vers la droite)."""
    return (p[0] + math.sin(rad(ang)) * L, p[1] + math.cos(rad(ang)) * L)

def capsule(p1, p2, r1, r2, n=10):
    dx, dy = p2[0] - p1[0], p2[1] - p1[1]
    a = math.atan2(dy, dx)
    pts = []
    for i in range(n + 1):
        t = a + math.pi / 2 + i * math.pi / n
        pts.append((p1[0] + math.cos(t) * r1, p1[1] + math.sin(t) * r1))
    for i in range(n + 1):
        t = a - math.pi / 2 + i * math.pi / n
        pts.append((p2[0] + math.cos(t) * r2, p2[1] + math.sin(t) * r2))
    return path_pts(pts)

def ovale(x, y, rx, ry):
    p = skia.Path(); p.addOval(skia.Rect.MakeXYWH(x - rx, y - ry, rx * 2, ry * 2)); return p

def union(a, b):
    r = skia.Op(a, b, skia.PathOp.kUnion_PathOp)
    return r if r is not None else a

def diff(a, b):
    r = skia.Op(a, b, skia.PathOp.kDifference_PathOp)
    return r if r is not None else a

def inter(a, b):
    r = skia.Op(a, b, skia.PathOp.kIntersect_PathOp)
    return r if r is not None else a

def trait(c, pts, w, couleur=ENCRE, a=255, smooth=True):
    c.drawPath(path_pts(pts, close=False, smooth=smooth), P(couleur, a, stroke=w))

def trait_effile(c, pts, w0, w1, couleur=ENCRE, a=255):
    """Trait à la plume dont l'épaisseur varie de w0 à w1 (lignes de manga)."""
    n = len(pts)
    if n < 2:
        return
    gauche, droite = [], []
    for i in range(n):
        p = pts[i]
        q0 = pts[max(0, i - 1)]; q1 = pts[min(n - 1, i + 1)]
        dx, dy = q1[0] - q0[0], q1[1] - q0[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = lerp(w0, w1, i / (n - 1)) / 2
        gauche.append((p[0] + nx * w, p[1] + ny * w)); droite.append((p[0] - nx * w, p[1] - ny * w))
    c.drawPath(path_pts(gauche + droite[::-1], smooth=False), P(couleur, a))

def courbe(pts, n=8):
    """Échantillonne une courbe de Catmull-Rom ouverte passant par pts."""
    out = []
    m = len(pts)
    for i in range(m - 1):
        p0 = pts[max(i - 1, 0)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(i + 2, m - 1)]
        for k in range(n):
            t = k / n; t2 = t * t; t3 = t2 * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(pts[-1])
    return out

def bezier_pts(p0, p1, p2, p3, n=16):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out

# ---------------------------------------------------------------- visage
EXPRESSIONS = ('neutre', 'sourire', 'rire', 'surpris', 'colere', 'tendre', 'ferme', 'triste', 'gene', 'determine', 'larmes', 'pensif', 'reve')

def tete(c, x, y, R, nom, expr='neutre', regard=0.0, incl=0.0, a=255, oeil=(0.0, 0.0), clign=0.0, rougir=0.0, parle=0.0, sans_chapeau=False):
    """Visage manga centré en (x, y), demi-largeur R.
    regard : -1 (vers la gauche) .. +1 (vers la droite). oeil = direction des pupilles (-1..1, -1..1).
    clign 0..1 ferme les paupières. rougir 0..1 ajoute les hachures de joues. parle 0..1 ouvre la bouche."""
    s = PERSOS[nom]
    g = clamp(regard, -1, 1)
    c.save(); c.translate(x, y); c.rotate(incl)
    lw = max(1.5, R * 0.045)
    detail = R > 28

    # -- cheveux arrière
    _cheveux_arriere(c, R, s, g, lw)

    # -- oreille (côté opposé au regard)
    if abs(g) < 0.95:
        ox = -g * 0.2 * R + (1.0 if g <= 0 else -1.0) * R * 0.98 * (1 - 0.15 * abs(g))
        if g != 0:
            pth = ovale(ox, R * 0.18, R * 0.16, R * 0.26)
            encre(c, pth, s['peau'], lw, a)
            if detail:
                trait(c, [(ox - R * 0.04 * math.copysign(1, ox), R * 0.08), (ox, R * 0.2), (ox - R * 0.03 * math.copysign(1, ox), R * 0.3)], lw * 0.6, a=a)
    # -- crâne et mâchoire
    cx = g * 0.18 * R
    gauche = R * (1 - 0.12 * max(0, g)); droite = R * (1 - 0.12 * max(0, -g))
    menton = (cx + g * 0.14 * R, R * 1.13)
    pth = skia.Path()
    pth.moveTo(-gauche, R * 0.05)
    pth.cubicTo(-gauche * 1.02, -R * 1.25, droite * 1.02, -R * 1.25, droite, R * 0.05)
    pth.cubicTo(droite * 1.0, R * 0.6, menton[0] + R * 0.42, menton[1] - R * 0.06, menton[0], menton[1])
    pth.cubicTo(menton[0] - R * 0.42, menton[1] - R * 0.06, -gauche * 1.0, R * 0.6, -gauche, R * 0.05)
    pth.close()
    encre(c, pth, s['peau'], lw * 1.15, a)
    if s['peau'] == PEAU_SOMBRE:
        c.save(); c.clipPath(pth, doAntiAlias=True); c.drawPaint(trame(0.14, max(5, int(R * 0.06)), 45, ENCRE, int(a * 0.55))); c.restore()
    # ombre sous la frange (trame légère)
    if detail and s['peau'] == PEAU:
        c.save(); c.clipPath(pth, doAntiAlias=True)
        c.drawRect(skia.Rect.MakeXYWH(-R * 1.2, -R * 0.55, R * 2.4, R * 0.28), trame(0.12, max(5, int(R * 0.05)), 45, ENCRE, int(a * 0.7)))
        c.restore()

    ex = 0.42 * R
    yeux_y = R * 0.2
    es = s.get('yeux', 1.0)
    ew = R * 0.2 * (0.75 + 0.25 * es)
    eh = R * 0.22 * es
    sens_bouche = 1 if g >= 0 else -1
    for k, side in enumerate((-1, 1)):
        # œil lointain plus étroit
        loin = (side < 0 and g > 0) or (side > 0 and g < 0)
        squeeze = 1 - 0.35 * abs(g) if loin else 1 + 0.05 * abs(g)
        px = cx + side * ex * (1 - 0.18 * abs(g) * (1 if loin else -0.2))
        _oeil(c, px, yeux_y, ew * squeeze, eh, s, expr, side, oeil, clign, lw, a, R, detail)
        _sourcil(c, px, yeux_y - eh * 1.15 - R * 0.06, ew * squeeze, s, expr, side, lw, a, R)
    # lunettes
    if s.get('lunettes'):
        for side in (-1, 1):
            loin = (side < 0 and g > 0) or (side > 0 and g < 0)
            sq = 1 - 0.35 * abs(g) if loin else 1.0
            px = cx + side * ex * (1 - 0.18 * abs(g) * (1 if loin else -0.2))
            pth = ovale(px, yeux_y + R * 0.02, R * 0.3 * sq, R * 0.29)
            c.drawPath(pth, P(BLANC, a * 0.18))
            c.drawPath(pth, P(ENCRE, a, stroke=lw * 1.3))
            if detail:
                trait(c, [(px - R * 0.16 * sq, yeux_y - R * 0.12), (px - R * 0.02 * sq, yeux_y - R * 0.24)], lw * 1.4, BLANC, a * 0.9)
        trait(c, [(cx - ex * 0.42, yeux_y - R * 0.04), (cx, yeux_y - R * 0.1), (cx + ex * 0.42, yeux_y - R * 0.04)], lw * 1.1, a=a)
        if g > -0.9:
            trait(c, [(cx + ex + R * 0.3, yeux_y), (R * 1.0, yeux_y - R * 0.05)], lw, a=a)
        if g < 0.9:
            trait(c, [(cx - ex - R * 0.3, yeux_y), (-R * 1.0, yeux_y - R * 0.05)], lw, a=a)
    if s.get('lorgnon'):
        px = cx + ex * 0.95
        c.drawPath(ovale(px, yeux_y, R * 0.24, R * 0.22), P(ENCRE, a, stroke=lw))
        trait(c, [(px + R * 0.2, yeux_y + R * 0.15), (px + R * 0.4, yeux_y + R * 0.9)], lw * 0.5, a=a * 0.7)

    # nez
    nx = cx + g * 0.28 * R
    if detail:
        trait(c, [(nx + g * R * 0.02, R * 0.42), (nx + R * 0.05 * (1 if g >= 0 else -1), R * 0.56), (nx - R * 0.02, R * 0.58)], lw * 0.9, a=a * 0.85)
    else:
        trait(c, [(nx, R * 0.48), (nx + R * 0.04, R * 0.56)], lw * 0.8, a=a)
    # joues / rougeur
    rg = max(rougir, 0.6 if expr in ('gene',) else 0, 0.35 if s.get('joues') else 0)
    if rg > 0 and detail:
        for side in (-1, 1):
            jx = cx + side * R * 0.55
            c.drawPath(ovale(jx, R * 0.52, R * 0.2, R * 0.08), P('#d98b7a', a * 0.35 * rg))
            for i in range(4):
                xx = jx - R * 0.14 + i * R * 0.09
                trait(c, [(xx + R * 0.05, R * 0.45), (xx - R * 0.03, R * 0.6)], lw * 0.55, ROUGE, a * 0.75 * rg, smooth=False)
    # moustache
    _moustache(c, cx + g * 0.26 * R, R * 0.68, R, s, lw, a)
    # bouche
    _bouche(c, cx + g * 0.26 * R, R * 0.8, R, s, expr, parle, lw, a, sens_bouche)
    # rides
    rd = s.get('rides', 0)
    if rd and detail:
        for side in (-1, 1):
            trait(c, [(cx + side * R * 0.32, R * 0.62), (cx + side * R * 0.4, R * 0.82)], lw * 0.5 * rd, a=a * 0.6)
            trait(c, [(cx + side * (ex + R * 0.28), yeux_y + R * 0.02), (cx + side * (ex + R * 0.36), yeux_y + R * 0.08)], lw * 0.45 * rd, a=a * 0.6)
        trait(c, [(cx - R * 0.25, -R * 0.42), (cx + R * 0.25, -R * 0.44)], lw * 0.4 * rd, a=a * 0.45)
    if s.get('grain_beaute') and detail:
        c.drawCircle(cx + R * 0.38, R * 0.74, R * 0.025, P(ENCRE, a))
    if s.get('taches') and detail:
        for (tx, ty) in ((-0.5, 0.48), (-0.42, 0.53), (-0.55, 0.57), (0.48, 0.5), (0.56, 0.55), (0.43, 0.57)):
            c.drawCircle(cx + tx * R, ty * R, R * 0.012, P(BRUN, a * 0.8))
    # larmes
    if expr == 'larmes' and detail:
        for side in (-1, 1):
            px = cx + side * ex
            trait(c, [(px + side * ew * 0.4, yeux_y + eh * 0.9), (px + side * ew * 0.45, yeux_y + eh * 1.6)], lw * 1.6, '#cfe3f0', a)
            trait(c, [(px + side * ew * 0.4, yeux_y + eh * 0.9), (px + side * ew * 0.45, yeux_y + eh * 1.6)], lw * 0.5, ENCRE, a * 0.6)

    # -- cheveux avant
    _cheveux_avant(c, R, s, g, lw, a)
    if not sans_chapeau:
        _chapeau(c, R, s, g, lw, a)
    c.restore()

def _oeil(c, px, py, ew, eh, s, expr, side, oeil, clign, lw, a, R, detail):
    cils = s.get('cils', 0)
    if expr in ('ferme', 'reve') or clign > 0.85:
        # paupière fermée : arc vers le bas
        pts = bezier_pts((px - ew, py), (px - ew * 0.4, py + eh * 0.45), (px + ew * 0.4, py + eh * 0.45), (px + ew, py))
        trait_effile(c, pts, lw * 0.6, lw * (2.2 + cils * 0.4), a=a)
        if cils:
            trait(c, [(px + side * ew, py), (px + side * ew * 1.25, py - eh * 0.1)], lw * 0.8, a=a)
        return
    if expr in ('sourire', 'rire') and clign < 0.3:
        pts = bezier_pts((px - ew, py + eh * 0.15), (px - ew * 0.5, py - eh * 0.55), (px + ew * 0.5, py - eh * 0.55), (px + ew, py + eh * 0.15))
        trait_effile(c, pts, lw * 0.8, lw * (2.4 + cils * 0.4), a=a)
        return
    # forme de l'œil (amande haute)
    haut = py - eh * (1 - clign)
    if expr == 'colere':
        haut = py - eh * 0.55
    if expr in ('tendre', 'pensif'):
        haut = py - eh * 0.62
    if expr == 'determine':
        haut = py - eh * 0.75
    bas = py + eh
    contour = skia.Path()
    contour.moveTo(px - ew, py + eh * 0.1)
    contour.cubicTo(px - ew * 0.9, haut, px + ew * 0.9, haut - eh * 0.05 * side, px + ew, py + eh * 0.05)
    contour.cubicTo(px + ew * 0.85, bas, px - ew * 0.85, bas, px - ew, py + eh * 0.1)
    contour.close()
    c.drawPath(contour, P(BLANC, a))
    # iris
    c.save(); c.clipPath(contour, doAntiAlias=True)
    sur = expr == 'surpris'
    ir_w = ew * (0.5 if sur else 0.72)
    ir_h = eh * (0.72 if sur else 0.98)
    ix = px + oeil[0] * ew * 0.3
    iy = py + eh * 0.12 + oeil[1] * eh * 0.2
    couleur_iris = '#2b2018' if s['peau'] == PEAU else '#1c1410'
    if detail:
        c.drawPath(ovale(ix, iy, ir_w, ir_h), degrade(ix, iy - ir_h, ix, iy + ir_h, [ENCRE, couleur_iris, '#7a5a40'], [0, 0.55, 1]))
        c.drawPath(ovale(ix, iy + ir_h * 0.05, ir_w * 0.48, ir_h * 0.5), P(ENCRE, a))
        c.drawPath(ovale(ix, iy, ir_w, ir_h), P(ENCRE, a, stroke=lw * 0.6))
        # reflets (les étoiles dans les yeux)
        c.drawPath(ovale(ix - ir_w * 0.38, iy - ir_h * 0.38, ir_w * 0.36, ir_h * 0.3), P(BLANC, a))
        c.drawCircle(ix + ir_w * 0.4, iy + ir_h * 0.45, ir_w * 0.16, P(BLANC, a))
        if expr in ('tendre', 'reve', 'larmes', 'surpris'):
            c.drawCircle(ix + ir_w * 0.1, iy + ir_h * 0.1, ir_w * 0.1, P(BLANC, a * 0.9))
        # ombre de la paupière
        c.drawRect(skia.Rect.MakeXYWH(px - ew, haut - eh, ew * 2, eh * 0.55), trame(0.25, max(4, int(R * 0.04)), 45, ENCRE, int(a * 0.8)))
    else:
        c.drawPath(ovale(ix, iy, ir_w, ir_h), P(ENCRE, a))
        c.drawCircle(ix - ir_w * 0.3, iy - ir_h * 0.3, ir_w * 0.35, P(BLANC, a))
    c.restore()
    # paupière supérieure épaisse + cils
    pts = bezier_pts((px - ew * 1.05, py + eh * 0.12), (px - ew * 0.9, haut), (px + ew * 0.9, haut - eh * 0.05 * side), (px + ew * 1.08, py + eh * 0.02))
    if side < 0:
        trait_effile(c, pts, lw * (2.6 + cils), lw * 0.9, a=a)
    else:
        trait_effile(c, pts, lw * 0.9, lw * (2.6 + cils), a=a)
    if cils and detail:
        bx = px + side * ew * 1.04
        for k in range(cils + 1):
            trait(c, [(bx, py + eh * 0.0 - k * eh * 0.15), (bx + side * ew * (0.32 + k * 0.08), py - eh * (0.25 + k * 0.28))], lw * 0.9, a=a)
    # paupière inférieure
    trait(c, [(px - ew * 0.55 * side * -1 if False else px + side * ew * 0.7, py + eh * 0.8), (px + side * ew * 0.15, py + eh * 0.98)], lw * 0.7, a=a * 0.8)
    if expr == 'surpris' and detail:
        trait(c, [(px - ew * 0.6, haut - eh * 0.25), (px + ew * 0.6, haut - eh * 0.28)], lw * 0.5, a=a * 0.6)

def _sourcil(c, px, py, ew, s, expr, side, lw, a, R):
    k = s.get('sourcils', 1.0)
    inc = {'colere': 22, 'determine': 12, 'triste': -18, 'surpris': -6, 'gene': -14, 'tendre': -6, 'pensif': -10, 'larmes': -16}.get(expr, 0)
    dy = {'surpris': -R * 0.1, 'colere': R * 0.05}.get(expr, 0)
    ang = rad(inc) * side
    x0, x1 = px - ew * 1.0, px + ew * 1.05
    y0 = py + dy + math.sin(ang) * ew * (-1)
    y1 = py + dy + math.sin(ang) * ew
    if side > 0:
        y0, y1 = py + dy - math.sin(ang) * ew, py + dy + math.sin(ang) * ew
    pts = bezier_pts((x0, y0), (px - ew * 0.3, py + dy - R * 0.06), (px + ew * 0.3, py + dy - R * 0.06), (x1, y1), 10)
    if side < 0:
        pts = pts[::-1]
    trait_effile(c, pts, lw * 1.6 * k, lw * 0.5, s['ch'] if s['ch'] != GRIS_CH else '#8a8478', a)

def _bouche(c, mx, my, R, s, expr, parle, lw, a, sens):
    st = s.get('bouche', 'normale')
    rouge = st == 'rouge'
    if expr in ('rire',) or parle > 0.5:
        ouv = R * (0.16 if expr == 'rire' else 0.08 + 0.06 * parle)
        pth = skia.Path()
        pth.moveTo(mx - R * 0.17, my - R * 0.02)
        pth.quadTo(mx, my + R * 0.03, mx + R * 0.17, my - R * 0.02)
        pth.quadTo(mx + R * 0.02, my + ouv * 2.2, mx - R * 0.17, my - R * 0.02)
        pth.close()
        c.drawPath(pth, P('#5a1d18', a))
        c.drawPath(ovale(mx, my + ouv * 1.35, R * 0.07, ouv * 0.4), P('#c4675c', a))
        c.drawPath(pth, P(ENCRE, a, stroke=lw * 0.9))
        return
    if expr == 'surpris':
        c.drawPath(ovale(mx, my + R * 0.02, R * 0.06, R * 0.08), P('#5a1d18', a))
        c.drawPath(ovale(mx, my + R * 0.02, R * 0.06, R * 0.08), P(ENCRE, a, stroke=lw * 0.8))
        return
    if st == 'travers' and expr in ('sourire', 'neutre', 'tendre', 'gene', 'determine', 'pensif'):
        # le sourire de travers de Célestin : un coin remonte plus que l'autre
        pts = bezier_pts((mx - R * 0.16, my - R * 0.01), (mx - R * 0.04, my + R * 0.05), (mx + R * 0.1, my + R * 0.02), (mx + R * 0.2 * sens, my - R * 0.11))
        trait_effile(c, pts, lw * 0.6, lw * 1.3, a=a)
        return
    if expr in ('sourire', 'tendre', 'reve'):
        pts = bezier_pts((mx - R * 0.14, my - R * 0.03), (mx - R * 0.05, my + R * 0.06), (mx + R * 0.05, my + R * 0.06), (mx + R * 0.14, my - R * 0.03))
        trait_effile(c, pts, lw * 0.7, lw * 0.7, ROUGE if rouge else ENCRE, a)
        return
    if expr in ('colere', 'determine') or st == 'pincee':
        trait(c, [(mx - R * 0.12, my + R * 0.01), (mx + R * 0.12, my - R * 0.01)], lw * 1.0, a=a)
        return
    if expr in ('triste', 'larmes', 'gene'):
        pts = bezier_pts((mx - R * 0.1, my + R * 0.03), (mx - R * 0.04, my - R * 0.02), (mx + R * 0.04, my - R * 0.02), (mx + R * 0.1, my + R * 0.03))
        trait(c, pts, lw * 0.8, a=a)
        return
    if st == 'rond':
        pts = bezier_pts((mx - R * 0.14, my - R * 0.02), (mx - R * 0.05, my + R * 0.07), (mx + R * 0.05, my + R * 0.07), (mx + R * 0.14, my - R * 0.02))
        trait(c, pts, lw * 0.9, a=a)
        return
    trait(c, [(mx - R * 0.08, my), (mx + R * 0.08, my - R * 0.005)], lw * 0.8, ROUGE if rouge else ENCRE, a)

def _moustache(c, mx, my, R, s, lw, a):
    m = s.get('moustache')
    if not m:
        return
    col = GRIS_CH if m == 'blanche' else s['ch']
    if m == 'brosse':
        pth = skia.Path(); pth.addRoundRect(skia.Rect.MakeXYWH(mx - R * 0.2, my - R * 0.06, R * 0.4, R * 0.1), R * 0.03, R * 0.03)
        encre(c, pth, col, lw * 0.7, a)
    elif m == 'fine':
        trait(c, [(mx - R * 0.2, my + R * 0.02), (mx, my - R * 0.03), (mx + R * 0.2, my + R * 0.02)], lw * 1.1, col, a)
    else:  # guidon / blanche
        for side in (-1, 1):
            pts = [(mx, my - R * 0.04), (mx + side * R * 0.18, my - R * 0.05), (mx + side * R * 0.34, my - R * 0.1), (mx + side * R * 0.42, my - R * 0.2),
                   (mx + side * R * 0.33, my - R * 0.02), (mx + side * R * 0.16, my + R * 0.04), (mx, my + R * 0.02)]
            encre(c, path_pts(pts, smooth=True), col, lw * 0.7, a)

def _reflet_cheveux(c, pth, R, lw, a, y=-0.62):
    """Anneau de reflet du manga : une couronne de fines lamelles blanches qui suit la courbure du crâne."""
    c.save(); c.clipPath(pth, doAntiAlias=True)
    n = 7
    for i in range(n):
        t0 = -0.95 + i * 1.9 / n
        L = 1.9 / n * (0.62 if i % 2 else 0.85)
        pts_h, pts_b = [], []
        for k in range(7):
            t = t0 + L * k / 6
            xx = math.sin(t * 1.2) * R * 1.05
            yy = R * y + (1 - math.cos(t * 1.2)) * R * 0.35
            e = math.sin(math.pi * k / 6) * R * 0.04
            pts_h.append((xx, yy - e)); pts_b.append((xx, yy + e * 1.4))
        c.drawPath(path_pts(pts_h + pts_b[::-1], smooth=True), P(BLANC, a * 0.92))
    c.restore()

def _meches(c, pth, R, lw, a, lignes, couleur=BLANC, alpha=0.55):
    """Quelques mèches dessinées à la plume à l'intérieur de la chevelure."""
    c.save(); c.clipPath(pth, doAntiAlias=True)
    for (x0, y0, x1, y1, x2, y2) in lignes:
        trait_effile(c, bezier_pts((x0 * R, y0 * R), (x1 * R, y1 * R), (x1 * R, y1 * R), (x2 * R, y2 * R), 10), lw * 0.2, lw * 0.9, couleur, a * alpha)
    c.restore()

def _cheveux_arriere(c, R, s, g, lw):
    st = s['cheveux']; col = s['ch']
    if st == 'carre':
        pts = courbe([(-R * 1.0, R * 0.95), (-R * 1.22, R * 0.3), (-R * 1.25, -R * 0.5), (-R * 0.8, -R * 1.25), (0, -R * 1.42),
                      (R * 0.8, -R * 1.25), (R * 1.25, -R * 0.5), (R * 1.22, R * 0.3), (R * 1.0, R * 0.95)])
        pth = path_pts(pts + [(R * 0.6, R * 1.0), (-R * 0.6, R * 1.0)])
        encre(c, pth, col, lw * 1.1)
    elif st in ('chignon', 'chignon_blanc'):
        encre(c, ovale(-g * R * 0.3, -R * 1.05, R * 0.52, R * 0.42), col, lw)
    elif st == 'tresse':
        side = -1 if g >= 0 else 1
        pts = []
        for i in range(6):
            pts.append((side * R * (0.9 + 0.05 * i), R * (0.3 + 0.32 * i)))
        for i, p in enumerate(pts):
            encre(c, ovale(p[0], p[1], R * 0.16, R * 0.2), col, lw * 0.8)
    elif st == 'bataille':
        encre(c, ovale(-g * R * 0.15, -R * 0.35, R * 1.1, R * 0.95), col, lw)

def _cheveux_avant(c, R, s, g, lw, a):
    st = s['cheveux']; col = s['ch']
    sh = g * R * 0.18
    if st == 'bataille':
        # mèches en bataille : pointes irrégulières
        pts = [(-R * 1.05 + sh, R * 0.1)]
        pics = [(-1.15, -0.35), (-0.95, -0.5), (-1.25, -0.85), (-0.7, -0.95), (-0.85, -1.35), (-0.35, -1.1), (-0.2, -1.55),
                (0.15, -1.15), (0.45, -1.5), (0.6, -1.05), (1.05, -1.25), (0.95, -0.7), (1.3, -0.6), (1.04, -0.25)]
        for (px, py) in pics:
            pts.append((px * R + sh * (1 + py * 0.2), py * R))
        pts.append((R * 1.04 + sh, R * 0.1))
        # frange qui retombe sur le front
        frange = [(R * 0.98 + sh, -R * 0.15), (R * 0.75 + sh, -R * 0.42), (R * 0.62 + sh, -R * 0.08), (R * 0.4 + sh, -R * 0.4),
                  (R * 0.2 + sh, -R * 0.02), (R * 0.0 + sh, -R * 0.38), (-R * 0.25 + sh, -R * 0.06), (-R * 0.42 + sh, -R * 0.42),
                  (-R * 0.66 + sh, -R * 0.12), (-R * 0.8 + sh, -R * 0.4), (-R * 0.98 + sh, -R * 0.1)]
        pth = path_pts(pts + frange)
        encre(c, pth, col, lw * 1.1, a)
        _reflet_cheveux(c, pth, R, lw, a, -0.82)
        for (x0, y0, x1, y1) in ((-0.5, -0.9, -0.3, -0.5), (0.3, -1.0, 0.15, -0.55), (0.75, -0.8, 0.6, -0.45)):
            trait(c, [(x0 * R + sh, y0 * R), (x1 * R + sh, y1 * R)], lw * 0.6, BLANC, a * 0.6)
    elif st == 'carre':
        # carré à la garçonne : volume rond, pointes qui rentrent sous la mâchoire, frange effilée en biais
        ext = courbe([(-R * 1.0 + sh * 0.3, R * 0.98), (-R * 1.2, R * 0.35), (-R * 1.24, -R * 0.45), (-R * 0.95, -R * 1.08), (-R * 0.35, -R * 1.36),
                      (R * 0.3, -R * 1.38), (R * 0.95, -R * 1.1), (R * 1.24, -R * 0.45), (R * 1.2, R * 0.35), (R * 1.0 + sh * 0.3, R * 0.98)], 7)
        interieur = courbe([(R * 0.92 + sh * 0.3, R * 0.62), (R * 0.9 + sh * 0.2, R * 0.05), (R * 0.82 + sh * 0.2, -R * 0.25)], 5)
        frange = []
        n = 14
        for i in range(n + 1):
            xx = R * 0.82 - i * R * 1.64 / n + sh
            base_y = -R * 0.04 - (i / n) * R * 0.14          # en biais
            if i % 2 == 0:
                frange.append((xx, base_y + (R * 0.03 if i % 4 == 0 else 0)))
            else:
                frange.append((xx + R * 0.03, base_y - R * 0.14))
        interieur2 = courbe([(-R * 0.82 + sh * 0.2, -R * 0.3), (-R * 0.9 + sh * 0.2, R * 0.05), (-R * 0.92 + sh * 0.3, R * 0.62)], 5)
        pth = path_pts(ext + interieur + frange + interieur2, smooth=False)
        encre(c, pth, col, lw * 1.1, a)
        _reflet_cheveux(c, pth, R, lw, a, -0.88)
        _meches(c, pth, R, lw, a, [(-0.55, -1.2, -0.75, -0.4, -0.95, 0.7), (0.5, -1.2, 0.8, -0.4, 0.98, 0.7), (-0.15, -1.3, -0.3, -0.6, -0.4, -0.25),
                                   (0.25, -1.3, 0.3, -0.6, 0.2, -0.2), (-1.05, -0.3, -1.08, 0.3, -1.0, 0.85), (1.05, -0.3, 1.08, 0.3, 1.0, 0.85)])
    elif st in ('court', 'plaque', 'degarni', 'blanc', 'boucles'):
        if st == 'boucles':
            pts = []
            n = 16
            for i in range(n + 1):
                ang = math.pi + i * math.pi / n
                rr = R * (1.12 if i % 2 == 0 else 1.0)
                pts.append((math.cos(ang) * rr + sh * 0.5, math.sin(ang) * rr * 1.05 - R * 0.12))
            pts.append((R * 0.9, -R * 0.25)); pts.append((-R * 0.9, -R * 0.25))
            pth = path_pts(pts, smooth=True)
            encre(c, pth, col, lw, a)
            for i in range(12):
                ang = math.pi + (i + 0.5) * math.pi / 12
                xx = math.cos(ang) * R * 0.75 + sh * 0.5; yy = math.sin(ang) * R * 0.8 - R * 0.25
                trait(c, [(xx - R * 0.06, yy), (xx, yy - R * 0.05), (xx + R * 0.06, yy)], lw * 0.5, BLANC, a * 0.45)
            return
        if st == 'degarni':
            for side in (-1, 1):
                pth = path_pts([(side * R * 1.02, R * 0.2), (side * R * 1.08, -R * 0.4), (side * R * 0.85, -R * 0.7), (side * R * 0.8, -R * 0.2)], smooth=True)
                encre(c, pth, col, lw * 0.8, a)
            trait(c, [(-R * 0.3, -R * 1.02), (R * 0.1, -R * 1.08), (R * 0.4, -R * 1.0)], lw * 0.7, col, a)
            c.drawPath(ovale(R * 0.25, -R * 0.75, R * 0.25, R * 0.08), P(BLANC, a * 0.6))
            return
        if st == 'blanc':
            pth = path_pts([(-R * 1.05, R * 0.15), (-R * 1.1, -R * 0.5), (-R * 0.8, -R * 0.95), (-R * 0.3, -R * 1.05), (-R * 0.2, -R * 0.85),
                            (-R * 0.7, -R * 0.55), (-R * 0.85, R * 0.1)], smooth=True)
            encre(c, pth, col, lw * 0.8, a)
            pth = path_pts([(R * 1.05, R * 0.15), (R * 1.1, -R * 0.5), (R * 0.8, -R * 0.95), (R * 0.4, -R * 1.02), (R * 0.75, -R * 0.55), (R * 0.85, R * 0.1)], smooth=True)
            encre(c, pth, col, lw * 0.8, a)
            return
        # court / plaqué : raie sur le côté
        raie = 0.35
        pts = [(-R * 1.04, R * 0.05), (-R * 1.1, -R * 0.6), (-R * 0.7, -R * 1.15), (R * raie, -R * 1.22), (R * 0.95, -R * 0.95), (R * 1.08, -R * 0.4), (R * 1.03, R * 0.05),
               (R * 0.88, -R * 0.35), (R * raie + R * 0.1, -R * 0.62 if st == 'plaque' else -R * 0.45)]
        if st == 'court':
            pts += [(R * 0.1, -R * 0.4), (-R * 0.2, -R * 0.56), (-R * 0.5, -R * 0.35), (-R * 0.88, -R * 0.4)]
        else:
            pts += [(-R * 0.4, -R * 0.66), (-R * 0.9, -R * 0.35)]
        pth = path_pts(pts, smooth=True)
        encre(c, pth, col, lw, a)
        _reflet_cheveux(c, pth, R, lw, a, -0.9)
        trait(c, [(R * raie, -R * 1.2), (R * raie + R * 0.08, -R * 0.66)], lw * 0.6, BLANC, a * 0.7)
    elif st in ('chignon', 'chignon_blanc'):
        pth = path_pts([(-R * 1.05, R * 0.2), (-R * 1.12, -R * 0.55), (-R * 0.6, -R * 1.18), (R * 0.6, -R * 1.18), (R * 1.12, -R * 0.55), (R * 1.05, R * 0.2),
                        (R * 0.92, -R * 0.35), (R * 0.2, -R * 0.62), (-R * 0.3, -R * 0.6), (-R * 0.92, -R * 0.35)], smooth=True)
        encre(c, pth, col, lw, a)
        _reflet_cheveux(c, pth, R, lw, a, -0.95)
        for side in (-1, 1):
            trait(c, [(side * R * 0.85, -R * 0.45), (side * R * 0.3, -R * 0.95)], lw * 0.5, BLANC if col != GRIS_CH else '#8a8478', a * 0.6)
    elif st == 'foulard':
        pth = path_pts([(-R * 1.1, R * 0.1), (-R * 1.18, -R * 0.65), (-R * 0.6, -R * 1.25), (R * 0.6, -R * 1.25), (R * 1.18, -R * 0.65), (R * 1.1, R * 0.1),
                        (R * 0.9, -R * 0.4), (0, -R * 0.55), (-R * 0.9, -R * 0.4)], smooth=True)
        encre(c, pth, s.get('c_foulard', '#c9b9a0'), lw, a)
        c.save(); c.clipPath(pth, doAntiAlias=True)
        c.drawRect(skia.Rect.MakeXYWH(-R * 1.3, -R * 1.4, R * 2.6, R * 1.4), trame(0.15, max(5, int(R * 0.07)), 30, BRUN, int(a)))
        c.restore()
        encre(c, ovale(R * 1.0, -R * 0.95, R * 0.22, R * 0.15), s.get('c_foulard'), lw * 0.8, a)
    elif st == 'bonnet':
        pth = path_pts([(-R * 1.15, R * 0.05), (-R * 1.2, -R * 0.7), (-R * 0.5, -R * 1.3), (R * 0.5, -R * 1.3), (R * 1.2, -R * 0.7), (R * 1.15, R * 0.05),
                        (R * 0.95, -R * 0.42), (0, -R * 0.52), (-R * 0.95, -R * 0.42)], smooth=True)
        encre(c, pth, BLANC, lw, a)
        for i in range(7):
            xx = -R * 0.9 + i * R * 0.3
            trait(c, [(xx, -R * 0.5 - abs(xx) * 0.1), (xx * 0.8, -R * 1.0)], lw * 0.4, a=a * 0.5)
    elif st == 'tresse':
        pth = path_pts([(-R * 1.04, R * 0.15), (-R * 1.12, -R * 0.6), (-R * 0.6, -R * 1.2), (R * 0.6, -R * 1.2), (R * 1.12, -R * 0.6), (R * 1.04, R * 0.15),
                        (R * 0.9, -R * 0.3), (R * 0.4, -R * 0.45), (R * 0.1, -R * 0.25), (-R * 0.3, -R * 0.5), (-R * 0.9, -R * 0.3)], smooth=True)
        encre(c, pth, col, lw, a)
        _reflet_cheveux(c, pth, R, lw, a, -0.95)

def _chapeau(c, R, s, g, lw, a):
    ch = s.get('chapeau')
    if not ch:
        return
    col = s.get('c_chapeau', ENCRE)
    if ch == 'cloche':
        pth = path_pts([(-R * 1.32, R * 0.0), (-R * 1.25, -R * 0.8), (-R * 0.7, -R * 1.42), (R * 0.7, -R * 1.42), (R * 1.25, -R * 0.8), (R * 1.32, R * 0.0),
                        (R * 1.0, -R * 0.08), (0, -R * 0.18), (-R * 1.0, -R * 0.08)], smooth=True)
        encre(c, pth, col, lw * 1.1, a)
        c.drawPath(path_pts([(-R * 1.16, -R * 0.42), (R * 1.16, -R * 0.42), (R * 1.12, -R * 0.26), (-R * 1.12, -R * 0.26)]), P(ENCRE, a))
        etoile(c, R * 0.8 + g * R * 0.2, -R * 0.34, R * 0.16, 8, 0.4, OR, a)
    elif ch == 'mou':
        etoffe(c, ovale(g * R * 0.1, -R * 0.62, R * 1.45, R * 0.24), col, lw, a)
        pth = path_pts([(-R * 0.95, -R * 0.62), (-R * 0.9, -R * 1.25), (-R * 0.2, -R * 1.48), (0, -R * 1.32), (R * 0.2, -R * 1.48), (R * 0.9, -R * 1.25), (R * 0.95, -R * 0.62)], smooth=True)
        etoffe(c, pth, col, lw, a)
        c.drawPath(path_pts([(-R * 0.95, -R * 0.62), (R * 0.95, -R * 0.62), (R * 0.93, -R * 0.82), (-R * 0.93, -R * 0.82)]), P(ENCRE if col != 'noir' else '#5a5550', a))
    elif ch == 'beret':
        encre(c, ovale(R * 0.15, -R * 1.0, R * 1.2, R * 0.42), col, lw, a)
        c.drawPath(ovale(R * 0.15, -R * 1.05, R * 1.1, R * 0.35), trame(0.12, max(5, int(R * 0.07)), 45, ENCRE, int(a)))
        trait(c, [(R * 0.15, -R * 1.4), (R * 0.22, -R * 1.58)], lw * 1.2, a=a)

# ---------------------------------------------------------------- corps
POSE_BASE = dict(buste=0, tete=0, regard=0.4, bd=7, cd=-8, bg=-7, cg=8, jd=4, gd=-2, jg=-7, gg=3, saut=0, jupe=0.0,
                 expr='neutre', oeil=(0, 0), main_d=None, main_g=None, rougir=0, parle=0, pied=1)

def pose(**kw):
    p = dict(POSE_BASE); p.update(kw); return p

def melange(p1, p2, t):
    """Interpole deux poses (les valeurs non numériques basculent à mi-chemin)."""
    out = {}
    for k in set(p1) | set(p2):
        a, b = p1.get(k, POSE_BASE.get(k)), p2.get(k, POSE_BASE.get(k))
        if isinstance(a, (int, float)) and isinstance(b, (int, float)):
            out[k] = a + (b - a) * t
        elif isinstance(a, tuple) and isinstance(b, tuple):
            out[k] = tuple(x + (y - x) * t for x, y in zip(a, b))
        else:
            out[k] = b if t > 0.5 else a
    return out

def poses_cles(cles, t, boucle=None):
    """cles = [(temps, pose), ...] → pose interpolée (avec easing) à t."""
    if boucle:
        t = t % boucle
    if t <= cles[0][0]:
        return cles[0][1]
    for (t0, p0), (t1, p1) in zip(cles, cles[1:]):
        if t <= t1:
            return melange(p0, p1, ease(lin(t, t0, t1)))
    return cles[-1][1]

TONS = {'gris1': 0.12, 'gris2': 0.24, 'gris3': 0.42}

def etoffe(c, pth, col, lw, a=255, angle=45):
    """Remplissage d'une étoffe : trame (gris1..3), aplat noir, ou couleur."""
    if col == 'noir':
        c.drawPath(pth, P(ENCRE, a)); c.drawPath(pth, P(ENCRE, a, stroke=lw))
    elif col in TONS:
        c.drawPath(pth, P(BLANC, a))
        c.drawPath(pth, trame(TONS[col], 5, angle, ENCRE, int(a)))
        c.drawPath(pth, P(ENCRE, a, stroke=lw))
    else:
        encre(c, pth, col, lw, a)

def bord_blanc(c, pts, lw, col, a):
    """Sur une étoffe noire, les arêtes se dessinent en blanc (convention manga)."""
    if col == 'noir':
        trait(c, pts, lw * 0.55, BLANC, a * 0.8)
    else:
        trait(c, pts, lw * 0.6, ENCRE, a)

MAINS = {
    # positions de mains prêtes à l'emploi (unités du pantin, depuis le centre des épaules ; x vers la droite de l'écran)
    'repos':    {'g': (-1.02, 2.7), 'd': (1.02, 2.7)},
    'ballant':  {'g': (-0.95, 2.62), 'd': (0.95, 2.62)},
    'hanches':  {'g': (-0.75, 2.2), 'd': (0.75, 2.2)},
    'poitrine': {'g': (-0.1, 0.9), 'd': (0.15, 0.9)},
    'coeur':    {'g': (-0.1, 0.9), 'd': (0.25, 0.8)},
    'noeud':    {'g': (-0.2, -0.05), 'd': (0.2, -0.05)},
    'bouche':   {'g': (0.1, -0.45), 'd': (0.3, -0.45)},
    'tete':     {'g': (-0.5, -1.1), 'd': (0.5, -1.1)},
    'front':    {'g': (-0.35, -0.95), 'd': (0.35, -0.95)},
    'leve':     {'g': (-0.9, -2.3), 'd': (0.9, -2.3)},
    'ouvert':   {'g': (-2.4, 0.3), 'd': (2.4, 0.3)},
    'tendu':    {'g': (-2.5, -0.4), 'd': (2.6, 0.4)},
    'avant':    {'g': (1.6, 1.0), 'd': (2.3, 0.9)},
    'valse':    {'g': (-1.9, -0.25), 'd': (1.25, 1.05)},
    'ecrit':    {'g': (1.3, 1.6), 'd': (1.9, 1.5)},
    'dos':      {'g': (-0.6, 2.0), 'd': (0.6, 2.0)},
}

def ik(epaule, cible, L1, L2, sens_coude=1):
    """Cinématique inverse à deux segments : renvoie (angle du bras, flexion du coude) en degrés."""
    dx, dy = cible[0] - epaule[0], cible[1] - epaule[1]
    d = clamp(math.hypot(dx, dy), abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3)
    base = math.degrees(math.atan2(dx, dy))  # 0 = vers le bas
    cos_a = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)
    alpha = math.degrees(math.acos(cos_a))
    cos_b = clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1)
    beta = 180 - math.degrees(math.acos(cos_b))
    return base + alpha * sens_coude, -beta * sens_coude

def figure(c, x, sol, taille, nom, po=None, sens=1, a=255, ombre=True, f=0):
    """Pantin en pied, proportions de manga de danse (8 têtes).
    (x, sol) = point au sol entre les pieds ; taille = hauteur en pixels ; sens = 1 regarde à droite, -1 à gauche."""
    s = PERSOS[nom]
    po = po or POSE_BASE
    u = taille / 8.2
    c.save()
    c.translate(x, sol)
    if ombre:
        c.drawPath(ovale(0, 0, u * 1.5, u * 0.22), trame(0.45, 7, 45, ENCRE, int(a * 0.7)))
    c.scale(sens, 1)
    lw = max(2.0, u * 0.1)
    femme = s.get('haut') in ('robe', 'robe_longue', 'manteau')
    if po.get('assis'):
        po = dict(po)
        po.setdefault('saut', -1.85)
        po['jd'], po['gd'] = po.get('jd_assis', 84), -84
        po['jg'], po['gg'] = po.get('jg_assis', 78), -78
    hanche = (0, -u * 4.05 - po.get('saut', 0) * u)
    ep = u * (0.95 if not femme else 0.78) * s.get('epaules', 1.0)
    hw = u * (0.5 if not femme else 0.58) * (1.2 if s.get('ventre') else 1)
    buste = po['buste'] + s.get('voute', 0)
    up = (math.sin(rad(buste)), -math.cos(rad(buste)))
    nrm = (math.cos(rad(buste)), math.sin(rad(buste)))
    epc = (hanche[0] + up[0] * u * 2.55, hanche[1] + up[1] * u * 2.55)
    eg = (epc[0] - nrm[0] * ep, epc[1] - nrm[1] * ep)
    ed = (epc[0] + nrm[0] * ep, epc[1] + nrm[1] * ep)
    eg_b = (epc[0] - nrm[0] * ep * 0.86 + up[0] * -u * 0.12, epc[1] - nrm[1] * ep * 0.86 - up[1] * u * 0.12)
    ed_b = (epc[0] + nrm[0] * ep * 0.86 + up[0] * -u * 0.12, epc[1] + nrm[1] * ep * 0.86 - up[1] * u * 0.12)
    hb = po.get('bassin', 0)
    nb = (math.cos(rad(hb)), math.sin(rad(hb)))
    hg = (hanche[0] - nb[0] * hw, hanche[1] - nb[1] * hw)
    hd = (hanche[0] + nb[0] * hw, hanche[1] + nb[1] * hw)
    jambes = {}
    for cote, hp in (('g', hg), ('d', hd)):
        a_cuisse = po['j' + cote]
        genou = vers(hp, a_cuisse, u * 1.95)
        cheville = vers(genou, a_cuisse + po['g' + cote], u * 1.85)
        jambes[cote] = (hp, genou, cheville, a_cuisse + po['g' + cote])
    bras = {}
    for cote, sp in (('g', eg_b), ('d', ed_b)):
        cible = po.get('cible_' + cote)
        loc = None
        if cible:
            loc = ((cible[0] - x) * sens, cible[1] - sol)
        if po.get('joue'):  # jouer de la trompette : main droite à la bouche, main gauche sur les pistons
            tc = (epc[0] + up[0] * u * 0.86, epc[1] + up[1] * u * 0.86)
            ang = rad(po.get('trompette', -20))
            k = 0.5 if cote == 'd' else 1.25
            loc = (tc[0] + u * 0.3 + math.cos(ang) * u * k, tc[1] + u * 0.42 + math.sin(ang) * u * k + u * 0.12)
        m = po.get('m' + cote)   # main placée par rapport au centre des épaules, en unités (x vers l'avant/droite, y vers le bas)
        if m is not None and loc is None:
            if isinstance(m, str):
                m = MAINS[m][cote]
            loc = (epc[0] + m[0] * u, epc[1] + m[1] * u)
        if loc:
            choix = po.get('coude_' + cote)
            if choix is None:
                # on garde le coude qui s'écarte du corps (et plutôt vers le bas)
                cote_x = -1 if cote == 'g' else 1
                best = None
                for sc in (1, -1):
                    ab_, ac_ = ik(sp, loc, u * 1.42, u * 1.32, sc)
                    cd_ = vers(sp, ab_, u * 1.42)
                    score = (cd_[0] - epc[0]) * cote_x + (cd_[1] - sp[1]) * 0.6
                    if best is None or score > best[0]:
                        best = (score, ab_, ac_)
                ab, ac = best[1], best[2]
            else:
                ab, ac = ik(sp, loc, u * 1.42, u * 1.32, choix)
            po = dict(po); po['b' + cote] = ab - buste; po['c' + cote] = ac
        a_bras = po['b' + cote] + buste
        coude = vers(sp, a_bras, u * 1.42)
        main = vers(coude, a_bras + po['c' + cote], u * 1.32)
        bras[cote] = (sp, coude, main, a_bras + po['c' + cote])
    devant = po.get('devant', 'd')   # bras dessiné devant le corps
    derriere = 'g' if devant == 'd' else 'd'
    _bras(c, s, bras[derriere], u, lw, a, po.get('main_' + derriere), cote=derriere)
    for cote in ('g', 'd'):
        _jambe(c, s, jambes[cote], u, lw, a, cote, po.get('pied', 1))
    _corps(c, s, hanche, epc, eg, ed, hg, hd, jambes, buste, u, lw, a, po)
    cou_b = (epc[0] + up[0] * u * 0.05, epc[1] + up[1] * u * 0.05)
    tete_c = (epc[0] + up[0] * u * 0.86, epc[1] + up[1] * u * 0.86)
    encre(c, capsule(cou_b, (tete_c[0], tete_c[1] + u * 0.2), u * 0.16, u * 0.15), s['peau'], lw, a)
    _col(c, s, epc, up, nrm, u, lw, a)
    _bras(c, s, bras[devant], u, lw, a, po.get('main_' + devant), cote=devant)
    tete(c, tete_c[0], tete_c[1], u * 0.5, nom, po['expr'], po['regard'], buste + po['tete'], a, po.get('oeil', (0, 0)),
         rougir=po.get('rougir', 0), parle=po.get('parle', 0), clign=po.get('clign', 0))
    c.restore()
    return dict(tete=(x + sens * tete_c[0], sol + tete_c[1]), main_d=(x + sens * bras['d'][2][0], sol + bras['d'][2][1]),
                main_g=(x + sens * bras['g'][2][0], sol + bras['g'][2][1]), u=u, epaules=(x + sens * epc[0], sol + epc[1]),
                hanche=(x + sens * hanche[0], sol + hanche[1]))

def _jambe(c, s, jb, u, lw, a, cote, pied_dir):
    hp, genou, cheville, a_tibia = jb
    bas = s.get('bas')
    if bas == 'pantalon':
        col = s.get('c_bas', 'gris3')
        pth = union(capsule(hp, genou, u * 0.36, u * 0.3), capsule(genou, cheville, u * 0.3, u * 0.29))
        etoffe(c, pth, col, lw, a)
        bord_blanc(c, [(lerp(hp[0], genou[0], 0.3), lerp(hp[1], genou[1], 0.3)), (lerp(genou[0], cheville[0], 0.9), lerp(genou[1], cheville[1], 0.9))], lw, col, a * 0.6)
    elif bas == 'golf':
        pth = capsule(hp, genou, u * 0.46, u * 0.44)
        encre(c, pth, s['c_bas'], lw, a)
        c.drawPath(pth, hachures(int(u * 0.3) + 4, 45, 2, ROUGE, int(a * 0.6)))
        c.drawPath(pth, hachures(int(u * 0.3) + 4, -45, 2, ROUGE, int(a * 0.6)))
        c.drawPath(pth, P(ENCRE, a, stroke=lw))
        encre(c, capsule(genou, cheville, u * 0.2, u * 0.15), BLANC, lw, a)
    else:
        pth = union(capsule(hp, genou, u * 0.3, u * 0.19), capsule(genou, cheville, u * 0.2, u * 0.11))
        encre(c, pth, '#f4ece0', lw, a)
        c.drawPath(capsule(genou, cheville, u * 0.2, u * 0.11), trame(0.08, 6, 45, ENCRE, int(a)))
    d = pied_dir
    cx, cy = cheville
    pth = skia.Path()
    talon = bas == 'bas'
    pth.moveTo(cx - u * 0.17 * d, cy - u * 0.1)
    pth.quadTo(cx + u * 0.15 * d, cy - u * 0.18, cx + u * 0.48 * d, cy + u * 0.06)
    pth.quadTo(cx + u * 0.58 * d, cy + u * 0.18, cx + u * 0.42 * d, cy + u * 0.2)
    pth.lineTo(cx - (u * 0.08 if talon else u * 0.2) * d, cy + u * 0.2)
    if talon:
        pth.lineTo(cx - u * 0.12 * d, cy + u * 0.05)
        pth.lineTo(cx - u * 0.2 * d, cy + u * 0.05)
    pth.close()
    c.drawPath(pth, P(ENCRE, a)); c.drawPath(pth, P(ENCRE, a, stroke=lw * 0.6))
    c.drawPath(ovale(cx + u * 0.28 * d, cy, u * 0.12, u * 0.035), P(BLANC, a * 0.7))
    if talon:
        trait(c, [(cx - u * 0.05 * d, cy - u * 0.1), (cx + u * 0.18 * d, cy - u * 0.16)], lw * 0.5, ENCRE, a)

def _main(c, s, coude, main, u, lw, a, cote):
    ang = math.degrees(math.atan2(main[1] - coude[1], main[0] - coude[0]))
    c.save(); c.translate(*main); c.rotate(ang)
    pth = union(ovale(u * 0.12, 0, u * 0.22, u * 0.16), capsule((0, -u * 0.06), (u * 0.22, -u * 0.2), u * 0.06, u * 0.05))
    encre(c, pth, s['peau'], lw * 0.7, a)
    if s.get('peau') == PEAU_SOMBRE:
        c.drawPath(pth, trame(0.15, 6, 45, ENCRE, int(a * 0.6)))
    if s.get('pouce_bleu') and cote == 'd':
        c.drawCircle(u * 0.24, -u * 0.2, u * 0.065, P(BLEU, a))
    c.restore()

def _bras(c, s, br, u, lw, a, accessoire, cote):
    sp, coude, main, a_av = br
    haut = s.get('haut')
    col = s.get('c_haut', BLANC)
    if haut in ('veste', 'smoking', 'frac', 'manteau', 'soutane', 'robe_longue', 'tablier'):
        pth = union(capsule(sp, coude, u * 0.24, u * 0.2), capsule(coude, main, u * 0.2, u * 0.16))
        etoffe(c, pth, col, lw, a)
        bord_blanc(c, [(lerp(sp[0], coude[0], 0.6), lerp(sp[1], coude[1], 0.6)), coude, (lerp(coude[0], main[0], 0.4), lerp(coude[1], main[1], 0.4))], lw, col, a * 0.5)
        if haut in ('veste', 'smoking', 'frac'):
            m0 = (lerp(coude[0], main[0], 0.82), lerp(coude[1], main[1], 0.82))
            encre(c, capsule(m0, (lerp(coude[0], main[0], 0.93), lerp(coude[1], main[1], 0.93)), u * 0.17, u * 0.17), BLANC, lw * 0.6, a)
    elif haut == 'robe':
        pth = union(capsule(sp, coude, u * 0.19, u * 0.14), capsule(coude, main, u * 0.14, u * 0.1))
        encre(c, pth, s['peau'], lw, a)
        if s.get('peau') == PEAU_SOMBRE:
            c.drawPath(pth, trame(0.15, 6, 45, ENCRE, int(a * 0.6)))
    else:
        roule = haut == 'chemise_gilet'
        if roule:
            encre(c, capsule(coude, main, u * 0.15, u * 0.12), s['peau'], lw, a)
            pth = capsule(sp, coude, u * 0.25, u * 0.22)
            etoffe(c, pth, col, lw, a)
            m0 = (lerp(sp[0], coude[0], 0.8), lerp(sp[1], coude[1], 0.8))
            encre(c, capsule(m0, coude, u * 0.24, u * 0.23), col if col not in TONS else BLANC, lw, a)
        else:
            pth = union(capsule(sp, coude, u * 0.24, u * 0.2), capsule(coude, main, u * 0.2, u * 0.17))
            etoffe(c, pth, col, lw, a)
        trait(c, [(lerp(sp[0], coude[0], 0.4), lerp(sp[1], coude[1], 0.4)), (lerp(sp[0], coude[0], 0.7), lerp(sp[1], coude[1], 0.7) )], lw * 0.4, ENCRE, a * 0.6)
    _main(c, s, coude, main, u, lw, a, cote)
    if accessoire:
        _accessoire(c, accessoire, main, a_av, u, lw, a)

def _accessoire(c, nom, main, ang, u, lw, a):
    hx, hy = main
    dir_ang = None
    if isinstance(nom, tuple):
        nom, dir_ang = nom
    c.save(); c.translate(hx, hy)
    if nom == 'pinceau':
        c.rotate(-ang + 180 + 30)
        encre(c, capsule((0, 0), (0, -u * 1.2), u * 0.05, u * 0.04), BRUN, lw * 0.5, a)
        encre(c, path_pts([(-u * 0.06, -u * 1.2), (u * 0.06, -u * 1.2), (0, -u * 1.55)]), BLEU, lw * 0.5, a)
    elif nom == 'trompette':
        c.rotate(dir_ang if dir_ang is not None else -ang + 90)
        c.translate(-u * 0.15, 0)
        encre(c, capsule((-u * 0.3, 0), (u * 1.4, 0), u * 0.07, u * 0.07), OR, lw * 0.6, a)
        pth = path_pts([(u * 1.3, -u * 0.08), (u * 1.9, -u * 0.38), (u * 1.9, u * 0.38), (u * 1.3, u * 0.08)])
        encre(c, pth, OR, lw * 0.6, a)
        encre(c, ovale(u * 1.9, 0, u * 0.08, u * 0.38), '#8a6a2a', lw * 0.5, a)
        for k in range(3):
            encre(c, capsule((u * (0.4 + k * 0.18), 0), (u * (0.4 + k * 0.18), -u * 0.22), u * 0.04, u * 0.04), OR, lw * 0.4, a)
        trait(c, [(u * 0.2, -u * 0.04), (u * 1.2, -u * 0.04)], lw * 0.5, BLANC, a * 0.7)
    elif nom == 'canne':
        encre(c, capsule((0, -u * 0.2), (u * 0.1, u * 2.3), u * 0.05, u * 0.05), ENCRE, lw * 0.3, a)
        encre(c, ovale(0, -u * 0.25, u * 0.1, u * 0.1), OR, lw * 0.4, a)
    elif nom == 'journal':
        c.rotate(-ang + 180)
        pth = path_pts([(-u * 1.0, -u * 0.6), (u * 1.0, -u * 0.6), (u * 1.0, u * 0.7), (-u * 1.0, u * 0.7)])
        encre(c, pth, '#e8e0cc', lw * 0.6, a)
        texte(c, 'LA DÉPÊCHE', 0, -u * 0.32, font('titre', u * 0.3), ENCRE, a, 'center')
        for i in range(6):
            trait(c, [(-u * 0.85, -u * 0.12 + i * u * 0.13), (u * 0.85, -u * 0.12 + i * u * 0.13)], lw * 0.35, a=a * 0.5, smooth=False)
    elif nom == 'regle':
        c.rotate(-ang + 180)
        encre(c, path_pts([(-u * 0.06, -u * 1.6), (u * 0.06, -u * 1.6), (u * 0.06, u * 0.4), (-u * 0.06, u * 0.4)]), '#c8b48a', lw * 0.5, a)
        encre(c, path_pts([(-u * 0.5, -u * 1.6), (u * 0.5, -u * 1.6), (u * 0.5, -u * 1.48), (-u * 0.5, -u * 1.48)]), '#c8b48a', lw * 0.5, a)
    elif nom == 'plateau':
        encre(c, ovale(u * 0.4, -u * 0.05, u * 0.9, u * 0.14), '#b8a07a', lw * 0.6, a)
        for k in range(3):
            pth = path_pts([(u * (-0.1 + k * 0.45), -u * 0.1), (u * (0.05 + k * 0.45), -u * 0.42), (u * (0.3 + k * 0.45), -u * 0.45), (u * (0.45 + k * 0.45), -u * 0.1)], smooth=True)
            encre(c, pth, '#d9a24a', lw * 0.5, a)
    elif nom == 'livre':
        c.rotate(-ang + 180)
        encre(c, path_pts([(-u * 0.35, -u * 0.5), (u * 0.35, -u * 0.5), (u * 0.35, u * 0.45), (-u * 0.35, u * 0.45)]), JAUNE, lw * 0.6, a)
        trait(c, [(-u * 0.25, -u * 0.5), (-u * 0.25, u * 0.45)], lw * 0.5, a=a, smooth=False)
    elif nom == 'tasse':
        encre(c, ovale(0, -u * 0.05, u * 0.4, u * 0.09), BLANC, lw * 0.5, a)
        encre(c, path_pts([(-u * 0.2, -u * 0.12), (u * 0.2, -u * 0.12), (u * 0.15, -u * 0.38), (-u * 0.15, -u * 0.38)]), BLANC, lw * 0.5, a)
    elif nom == 'appareil':
        encre(c, path_pts([(-u * 0.5, -u * 0.5), (u * 0.5, -u * 0.5), (u * 0.5, u * 0.15), (-u * 0.5, u * 0.15)]), '#2a2624', lw * 0.6, a)
        encre(c, ovale(u * 0.0, -u * 0.17, u * 0.22, u * 0.22), '#5a5550', lw * 0.6, a)
        c.drawCircle(-u * 0.06, -u * 0.24, u * 0.06, P(BLANC, a * 0.7))
    elif nom == 'baguette':
        c.rotate(-ang + 180)
        trait(c, [(0, 0), (0, -u * 1.1)], lw * 0.6, BLANC, a)
        trait(c, [(0, 0), (0, -u * 1.1)], lw * 0.25, ENCRE, a)
    elif nom == 'papier':
        c.rotate(-ang + 180)
        encre(c, path_pts([(-u * 0.25, -u * 0.35), (u * 0.25, -u * 0.35), (u * 0.25, u * 0.15), (-u * 0.25, u * 0.15)]), BLANC, lw * 0.5, a)
    elif nom == 'lettre':
        c.rotate(-ang + 180)
        encre(c, path_pts([(-u * 0.4, -u * 0.5), (u * 0.4, -u * 0.5), (u * 0.4, u * 0.4), (-u * 0.4, u * 0.4)]), '#f7efdf', lw * 0.5, a)
        for i in range(5):
            trait(c, [(-u * 0.3, -u * 0.35 + i * u * 0.15), (u * 0.3, -u * 0.35 + i * u * 0.15)], lw * 0.3, BLEU, a * 0.7, smooth=False)
    elif nom == 'diplome':
        c.rotate(-ang + 180)
        encre(c, path_pts([(-u * 0.6, -u * 0.45), (u * 0.6, -u * 0.45), (u * 0.6, u * 0.45), (-u * 0.6, u * 0.45)]), '#efe3c4', lw * 0.6, a)
        etoile(c, 0, -u * 0.12, u * 0.18, 8, 0.4, ROUGE, a)
        cadre_deco(c, -u * 0.55, -u * 0.4, u * 1.1, u * 0.8, OR, a, 1.5)
    elif nom == 'gui':
        for k in range(5):
            ang2 = -60 + k * 30
            p2 = vers((0, 0), 180 + ang2, u * 0.6)
            trait(c, [(0, 0), p2], lw * 0.4, '#3d5a3a', a)
            encre(c, ovale(p2[0], p2[1], u * 0.16, u * 0.08), '#5d7a4a', lw * 0.3, a)
            c.drawCircle(p2[0] * 0.6, p2[1] * 0.6, u * 0.06, P(BLANC, a))
    c.restore()

def _corps(c, s, hanche, epc, eg, ed, hg, hd, jambes, buste, u, lw, a, po):
    haut = s.get('haut')
    up = (epc[0] - hanche[0], epc[1] - hanche[1])
    L = math.hypot(*up) or 1
    up = (up[0] / L, up[1] / L)
    nrm = (-up[1], up[0])
    ventre = s.get('ventre', 1.0)
    def P_(t, k):  # point sur l'axe du buste (t de 0 hanche à 1 épaules) décalé de k*u latéralement
        return (lerp(hanche[0], epc[0], t) + nrm[0] * k * u, lerp(hanche[1], epc[1], t) + nrm[1] * k * u)
    col = s.get('c_haut', BLANC)
    femme = haut in ('robe', 'robe_longue', 'manteau', 'tablier', 'soutane')
    if femme:
        kg, kd = jambes['g'][1], jambes['d'][1]
        long_ = haut in ('robe_longue', 'soutane', 'tablier', 'manteau')
        if long_:
            remonte = 0.9 if haut == 'manteau' else 0.3
            kg = (jambes['g'][2][0], jambes['g'][2][1] - u * remonte)
            kd = (jambes['d'][2][0], jambes['d'][2][1] - u * remonte)
        jupe = po.get('jupe', 0)
        flare = u * (0.35 + jupe * 1.5)
        bas_y = max(kg[1], kd[1]) + u * (0.25 if not long_ else 0) - jupe * u * 0.6
        gx = min(kg[0], hg[0]) - flare
        dx = max(kd[0], hd[0]) + flare
        if ventre > 1.2:
            gx -= u * 0.4; dx += u * 0.4
        ep_w = math.hypot(ed[0] - eg[0], ed[1] - eg[1]) / 2 / u
        haut_pts = [P_(1.02, -ep_w * 0.55), (eg[0] + up[0] * u * 0.05, eg[1] + up[1] * u * 0.05), P_(0.82, -ep_w * 0.95), P_(0.55, -0.5 * ventre), P_(0.05, -0.62 * ventre)]
        bas_pts = [(gx, bas_y)]
        n = 10
        for i in range(1, n):
            xx = lerp(gx, dx, i / n)
            bas_pts.append((xx, bas_y + math.sin(i * 1.9 + jupe * 7) * u * 0.07 * (1 + jupe * 2)))
        bas_pts.append((dx, bas_y))
        haut_pts_d = [P_(0.05, 0.62 * ventre), P_(0.55, 0.5 * ventre), P_(0.82, ep_w * 0.95), (ed[0] + up[0] * u * 0.05, ed[1] + up[1] * u * 0.05), P_(1.02, ep_w * 0.55)]
        pth = path_pts(haut_pts + bas_pts + haut_pts_d, smooth=False)
        if col == BLEU:
            encre(c, pth, BLEU, lw, a)
            c.save(); c.clipPath(pth, doAntiAlias=True)
            c.drawPaint(trame(0.2, 7, 45, ENCRE, int(a)))
            for k in range(4):
                xx = lerp(gx, dx, 0.2 + k * 0.2)
                trait_effile(c, [(xx + u * 0.1 * (k - 1.5), hanche[1] - u * 1.2), (xx + u * 0.25 * (k - 1.5) * (1 + jupe), bas_y)], lw * 0.3, lw * 1.4, '#7d9cc4', a * 0.7)
            c.restore()
        else:
            etoffe(c, pth, col, lw, a)
        if haut == 'manteau':
            bord_blanc(c, [P_(0.98, 0.15), P_(0.5, 0.3), (P_(0, 0.35)[0], bas_y)], lw, col, a)
            for k in range(3):
                c.drawCircle(*P_(0.7 - k * 0.3, 0.55), u * 0.07, P(ENCRE if col != 'noir' else BLANC, a))
            fourrure = path_pts([P_(1.04, -ep_w * 0.75), P_(0.78, -0.2), P_(0.6, 0.35), P_(0.78, 0.5), P_(1.04, ep_w * 0.75)], smooth=True)
            encre(c, fourrure, BLANC, lw * 0.8, a)
            c.drawPath(fourrure, hachures(6, 70, 1.2, ENCRE, int(a * 0.5)))
        if haut in ('robe', 'robe_longue'):
            trait(c, [P_(0.05, -0.75 * ventre), P_(0.02, 0), P_(0.05, 0.75 * ventre)], lw * 1.2, ENCRE if col != 'noir' else BLANC, a * 0.8)
        if s.get('franges'):
            for i in range(30):
                xx = lerp(gx + u * 0.04, dx - u * 0.04, i / 29)
                yy = bas_y + math.sin(i / 29 * 10 * 1.9 + jupe * 7) * 0
                sw = math.sin(i * 0.9 + jupe * 12 + po.get('vent', 0)) * u * 0.08 * (1 + jupe * 3)
                trait(c, [(xx, yy - u * 0.02), (xx + sw, yy + u * 0.42)], lw * 0.5, ENCRE, a, smooth=False)
        if s.get('c_tablier'):
            tb = path_pts([P_(0.55, -0.45), P_(0.55, 0.45), (dx - u * 0.55, bas_y - u * 0.12), (gx + u * 0.55, bas_y - u * 0.12)])
            encre(c, tb, s['c_tablier'], lw * 0.8, a)
            trait(c, [P_(0.55, -0.48), P_(0.55, 0.48)], lw * 1.2, ENCRE, a)
        if s.get('chale'):
            ch = path_pts([P_(1.05, -ep_w * 1.05), P_(0.55, -0.1), P_(0.35, 0.0), P_(0.55, 0.1), P_(1.05, ep_w * 1.05), P_(0.75, ep_w * 1.0), P_(0.75, -ep_w * 1.0)], smooth=True)
            etoffe(c, ch, s['chale'], lw * 0.8, a, 20)
            for k in range(8):
                xx = P_(0.4 + abs(k - 3.5) * 0.08, (k - 3.5) * 0.25)
                trait(c, [xx, (xx[0], xx[1] + u * 0.25)], lw * 0.4, ENCRE, a)
        if haut == 'soutane':
            for k in range(10):
                c.drawCircle(*P_(0.95 - k * 0.1, 0.0), u * 0.045, P(BLANC, a * 0.8))
            for k in range(6):
                c.drawCircle(epc[0], epc[1] + u * (2.7 + k * 0.35), u * 0.045, P(BLANC, a * 0.8))
        if s.get('col_blanc'):
            encre(c, path_pts([P_(1.0, -0.45), P_(0.82, 0), P_(1.0, 0.45), P_(0.95, 0)]), BLANC, lw * 0.7, a)
        if s.get('perles'):
            for k in range(11):
                ang = math.pi * (0.1 + k * 0.8 / 10)
                c.drawCircle(epc[0] + math.cos(ang) * u * 0.42, epc[1] - u * 0.05 + math.sin(ang) * u * 0.48, u * 0.055, P(BLANC, a))
                c.drawCircle(epc[0] + math.cos(ang) * u * 0.42, epc[1] - u * 0.05 + math.sin(ang) * u * 0.48, u * 0.055, P(ENCRE, a, stroke=lw * 0.3))
        if s.get('collier'):
            for k in range(7):
                ang = math.pi * (0.2 + k * 0.6 / 6)
                etoile(c, epc[0] + math.cos(ang) * u * 0.38, epc[1] + math.sin(ang) * u * 0.42, u * 0.08, 5, 0.45, OR, a)
        return
    # --- hauts masculins
    ep_w = math.hypot(ed[0] - eg[0], ed[1] - eg[1]) / 2 / u
    w_t = 0.55 * ventre
    tronc = [P_(1.03, -ep_w * 0.5), (eg[0] + up[0] * u * 0.02, eg[1] + up[1] * u * 0.02), P_(0.9, -ep_w * 1.04), P_(0.7, -ep_w * 0.85),
             P_(0.35, -w_t), P_(-0.02, -0.56), P_(-0.02, 0.56), P_(0.35, w_t), P_(0.7, ep_w * 0.85), P_(0.9, ep_w * 1.04),
             (ed[0] + up[0] * u * 0.02, ed[1] + up[1] * u * 0.02), P_(1.03, ep_w * 0.5)]
    pth = path_pts(tronc, smooth=False)
    if haut == 'chemise_gilet':
        encre(c, pth, BLANC, lw, a)
        trait(c, [P_(0.75, -0.5), P_(0.45, -0.3)], lw * 0.4, ENCRE, a * 0.5)
        gil = path_pts([P_(1.0, -0.35), P_(0.62, 0.0), P_(1.0, 0.35), P_(0.85, ep_w * 0.7), P_(0.35, w_t), P_(-0.12, 0.5), P_(-0.25, 0.0),
                        P_(-0.12, -0.5), P_(0.35, -w_t), P_(0.85, -ep_w * 0.7)])
        etoffe(c, gil, s.get('c_gilet', 'gris2'), lw * 0.9, a)
        for k in range(4):
            c.drawCircle(*P_(0.55 - k * 0.15, 0.03), u * 0.05, P(ENCRE, a))
        trait(c, [P_(0.3, 0.15), P_(0.25, 0.45), P_(0.32, 0.5)], lw * 0.5, OR, a)  # chaîne de montre
        trait(c, [P_(0.0, -0.58), P_(-0.03, 0), P_(0.0, 0.58)], lw * 1.0, ENCRE, a)  # ceinture
    elif haut in ('veste', 'smoking', 'frac'):
        etoffe(c, pth, col, lw, a)
        plastron = path_pts([P_(1.0, -0.3), P_(1.0, 0.3), P_(0.45, 0.1), P_(0.45, -0.1)])
        encre(c, plastron, s.get('c_chemise', BLANC), lw * 0.7, a)
        for side in (-1, 1):
            rev = path_pts([P_(1.0, side * 0.32), P_(0.45, side * 0.1), P_(0.75, side * 0.58)])
            etoffe(c, rev, 'noir' if col == 'noir' else 'gris3', lw * 0.6, a)
            bord_blanc(c, [P_(1.0, side * 0.32), P_(0.45, side * 0.1)], lw, col, a)
        if haut == 'frac':
            for side in (-1, 1):
                q = path_pts([P_(0.1, side * 0.1), P_(0.1, side * 0.6), (hanche[0] + side * u * 0.65, hanche[1] + u * 1.9), (hanche[0] + side * u * 0.3, hanche[1] + u * 1.6)])
                etoffe(c, q, col, lw * 0.8, a)
                bord_blanc(c, [P_(0.1, side * 0.3), (hanche[0] + side * u * 0.45, hanche[1] + u * 1.7)], lw, col, a * 0.6)
        if haut == 'veste':
            for k in range(2):
                c.drawCircle(*P_(0.38 - k * 0.15, 0.12), u * 0.055, P(ENCRE if col != 'noir' else BLANC, a))
            bord_blanc(c, [P_(0.45, 0.1), P_(-0.02, 0.2)], lw, col, a)
            trait(c, [P_(0.2, -0.45), P_(0.2, -0.15)], lw * 0.5, ENCRE if col != 'noir' else BLANC, a * 0.7)
        if s.get('cravate'):
            encre(c, path_pts([P_(0.98, -0.06), P_(0.98, 0.06), P_(0.55, 0.09), P_(0.47, 0), P_(0.55, -0.09)]), s['cravate'], lw * 0.5, a)
    elif haut == 'chemise':
        etoffe(c, pth, col, lw, a)
        if s.get('gilet_ouvert'):
            for side in (-1, 1):
                gp = path_pts([P_(1.0, side * 0.32), P_(0.6, side * 0.18), P_(-0.05, side * 0.22), P_(-0.05, side * 0.56), P_(0.35, side * w_t), P_(0.85, side * ep_w * 0.7)])
                etoffe(c, gp, s['gilet_ouvert'], lw * 0.8, a)
        for k in range(4):
            c.drawCircle(*P_(0.85 - k * 0.2, 0.0), u * 0.04, P(ENCRE, a * 0.7))
        trait(c, [P_(0.0, -0.58), P_(-0.03, 0), P_(0.0, 0.58)], lw * 1.0, ENCRE, a)

def _col(c, s, epc, up, nrm, u, lw, a):
    x, y = epc
    if s.get('noeud'):
        col = s['noeud']
        for side in (-1, 1):
            encre(c, path_pts([(x, y + u * 0.08), (x + side * u * 0.3, y - u * 0.05), (x + side * u * 0.3, y + u * 0.22)]), col, lw * 0.6, a)
        encre(c, ovale(x, y + u * 0.09, u * 0.07, u * 0.07), col, lw * 0.5, a)
    if s.get('col_dur'):
        encre(c, path_pts([(x - u * 0.22, y - u * 0.15), (x + u * 0.22, y - u * 0.15), (x + u * 0.2, y + u * 0.05), (x - u * 0.2, y + u * 0.05)]), BLANC, lw * 0.6, a)
    if s.get('col_romain'):
        encre(c, path_pts([(x - u * 0.2, y - u * 0.12), (x + u * 0.2, y - u * 0.12), (x + u * 0.2, y), (x - u * 0.2, y)]), BLANC, lw * 0.5, a)

# ---------------------------------------------------------------- la Mini (Citroën Type C, « le Petit Citron »)
def mini(c, x, sol, L, sens=1, a=255, roues=0.0, phares=0.0, capote=False, f=0, secousse=0.0):
    """Petite torpédo jaune. L = longueur en pixels. roues = angle de rotation (tours)."""
    u = L / 10
    c.save(); c.translate(x, sol - math.sin(f * 1.3) * secousse * u * 0.08); c.scale(sens, 1)
    lw = max(2, u * 0.1)
    c.drawPath(ovale(0, 0, u * 5.4, u * 0.35), trame(0.5, 7, 45, ENCRE, int(a * 0.7)))
    # caisse
    caisse = path_pts([(-u * 4.6, -u * 1.2), (-u * 4.8, -u * 2.4), (-u * 4.2, -u * 3.0), (-u * 1.2, -u * 3.0), (-u * 0.6, -u * 2.55),
                       (u * 1.6, -u * 2.6), (u * 3.9, -u * 2.35), (u * 4.6, -u * 1.9), (u * 4.75, -u * 1.25)], smooth=True)
    encre(c, caisse, JAUNE, lw * 1.2, a)
    c.save(); c.clipPath(caisse, doAntiAlias=True)
    c.drawRect(skia.Rect.MakeXYWH(-u * 5, -u * 1.9, u * 10, u * 0.8), trame(0.22, 7, 45, BRUN, int(a)))
    trait(c, [(-u * 4.0, -u * 2.75), (u * 3.6, -u * 2.25)], lw * 1.2, BLANC, a * 0.75)
    c.restore()
    # capot à persiennes
    for k in range(5):
        xx = u * (2.0 + k * 0.4)
        trait(c, [(xx, -u * 2.35), (xx, -u * 1.8)], lw * 0.6, a=a, smooth=False)
    trait(c, [(u * 1.5, -u * 2.6), (u * 1.5, -u * 1.3)], lw * 0.7, a=a, smooth=False)
    trait(c, [(-u * 1.0, -u * 2.7), (-u * 1.0, -u * 1.3)], lw * 0.7, a=a, smooth=False)
    # pare-brise
    encre(c, path_pts([(u * 0.6, -u * 2.6), (u * 0.3, -u * 4.0), (u * 0.5, -u * 4.05), (u * 0.85, -u * 2.6)]), '#cfe0e6', lw * 0.8, a)
    # volant + siège
    trait(c, [(u * 0.0, -u * 2.7), (-u * 0.3, -u * 3.4)], lw, a=a)
    c.drawPath(ovale(-u * 0.32, -u * 3.45, u * 0.12, u * 0.35), P(ENCRE, a, stroke=lw * 0.8))
    if capote:
        encre(c, path_pts([(-u * 4.4, -u * 3.0), (-u * 3.9, -u * 4.7), (-u * 0.6, -u * 4.6), (u * 0.3, -u * 4.0), (-u * 1.0, -u * 3.0)], smooth=True), '#2a2624', lw, a)
    # garde-boue
    for wx in (-u * 3.0, u * 3.0):
        encre(c, path_pts([(wx - u * 1.6, -u * 1.1), (wx - u * 1.2, -u * 2.0), (wx + u * 1.2, -u * 2.0), (wx + u * 1.6, -u * 1.1), (wx + u * 1.3, -u * 1.25), (wx - u * 1.3, -u * 1.25)], smooth=True), '#2a2624', lw, a)
    # roues à rayons
    for wx in (-u * 3.0, u * 3.0):
        c.drawCircle(wx, -u * 1.05, u * 1.05, P(ENCRE, a))
        c.drawCircle(wx, -u * 1.05, u * 0.78, P('#e8dcc0', a))
        for k in range(10):
            ang = roues * 2 * math.pi + k * math.pi / 5
            trait(c, [(wx, -u * 1.05), (wx + math.cos(ang) * u * 0.76, -u * 1.05 + math.sin(ang) * u * 0.76)], lw * 0.45, a=a, smooth=False)
        c.drawCircle(wx, -u * 1.05, u * 0.2, P(JAUNE, a)); c.drawCircle(wx, -u * 1.05, u * 0.2, P(ENCRE, a, stroke=lw * 0.6))
    # phares ronds (les « yeux » de la Mini)
    for (px, r) in ((u * 4.6, u * 0.42),):
        if phares > 0:
            gl = degrade_rad(px + u * 3, -u * 2.0, u * 5, [hexc('#fff2c0', int(140 * phares * a / 255)), hexc('#fff2c0', 0)])
            c.drawPath(path_pts([(px, -u * 2.25), (px + u * 9, -u * 3.6), (px + u * 9, -u * 0.2), (px, -u * 1.75)]), gl)
        encre(c, ovale(px, -u * 2.0, r * 0.7, r), '#fff7d8' if phares > 0 else BLANC, lw, a)
        c.drawCircle(px - r * 0.15, -u * 2.15, r * 0.25, P(BLANC, a))
    # klaxon à poire
    encre(c, ovale(u * 1.0, -u * 2.95, u * 0.22, u * 0.14), '#2a1a12', lw * 0.6, a)
    c.restore()
    return dict(siege=(x + sens * (-u * 0.9), sol - u * 2.6), passager=(x + sens * (-u * 2.4), sol - u * 2.6), u=u)

# ---------------------------------------------------------------- Chopin, le chat gris aux yeux jaunes
def chopin(c, x, sol, L, sens=1, a=255, queue=0.0, assis=True, yeux=1.0, f=0, ronron=False):
    """L = longueur du chat. queue = phase d'oscillation de la queue."""
    u = L / 10
    c.save(); c.translate(x, sol); c.scale(sens, 1)
    lw = max(1.8, u * 0.14)
    gris = '#8d8a86'
    c.drawPath(ovale(0, 0, u * 4, u * 0.4), trame(0.4, 6, 45, ENCRE, int(a * 0.6)))
    # queue
    qa = math.sin(queue) * 0.6
    pts = [(-u * 2.0, -u * 1.0)]
    for i in range(1, 9):
        k = i / 8
        pts.append((-u * 2.0 - u * 2.6 * k + math.sin(qa * k * 2) * u * 0.6, -u * 1.0 - u * 3.0 * k * (0.3 + 0.7 * math.cos(qa * k))))
    trait(c, pts, u * 0.55, ENCRE, a)
    trait(c, pts, u * 0.38, gris, a)
    if assis:
        corps = path_pts([(-u * 2.3, 0), (-u * 2.5, -u * 1.8), (-u * 1.4, -u * 3.6), (u * 0.2, -u * 4.2), (u * 1.2, -u * 3.4), (u * 1.0, -u * 1.5), (u * 1.4, 0)], smooth=True)
        tx, ty = u * 0.7, -u * 4.9
    else:
        corps = path_pts([(-u * 2.6, -u * 0.6), (-u * 2.8, -u * 2.2), (-u * 1.0, -u * 2.7), (u * 1.6, -u * 2.6), (u * 2.4, -u * 1.6), (u * 2.0, -u * 0.6)], smooth=True)
        tx, ty = u * 2.6, -u * 3.2
        for lx in (-u * 2.2, -u * 1.6, u * 1.2, u * 1.8):
            encre(c, capsule((lx, -u * 1.2), (lx + u * 0.1, 0), u * 0.3, u * 0.28), gris, lw, a)
    encre(c, corps, gris, lw, a)
    c.save(); c.clipPath(corps, doAntiAlias=True); c.drawPaint(trame(0.14, 6, 30, ENCRE, int(a * 0.8))); c.restore()
    if assis:
        for lx in (u * 0.1, u * 0.8):
            encre(c, ovale(lx, -u * 0.25, u * 0.38, u * 0.28), gris, lw, a)
    # tête
    hd = ovale(tx, ty, u * 1.35, u * 1.1)
    for side in (-1, 1):
        ore = path_pts([(tx + side * u * 0.5, ty - u * 0.7), (tx + side * u * 1.15, ty - u * 1.9), (tx + side * u * 1.3, ty - u * 0.3)])
        encre(c, ore, gris, lw, a)
        trait(c, [(tx + side * u * 0.85, ty - u * 0.75), (tx + side * u * 1.1, ty - u * 1.5)], lw * 0.6, '#d9a0a0', a)
    encre(c, hd, gris, lw, a)
    # yeux jaunes (seule touche de jaune avec la Mini)
    for side in (-1, 1):
        ex, ey = tx + side * u * 0.5, ty - u * 0.05
        if yeux < 0.3:
            trait(c, [(ex - u * 0.3, ey), (ex, ey + u * 0.15), (ex + u * 0.3, ey)], lw, a=a)
        else:
            encre(c, ovale(ex, ey, u * 0.32, u * 0.3 * yeux), '#e8c43a', lw * 0.7, a)
            c.drawPath(ovale(ex, ey, u * 0.07, u * 0.25 * yeux), P(ENCRE, a))
            c.drawCircle(ex - u * 0.1, ey - u * 0.1, u * 0.07, P(BLANC, a))
    c.drawPath(path_pts([(tx - u * 0.12, ty + u * 0.3), (tx + u * 0.12, ty + u * 0.3), (tx, ty + u * 0.45)]), P('#c08080', a))
    trait(c, [(tx - u * 0.25, ty + u * 0.62), (tx, ty + u * 0.5), (tx + u * 0.25, ty + u * 0.62)], lw * 0.6, a=a)
    for side in (-1, 1):
        for k in range(3):
            trait(c, [(tx + side * u * 0.5, ty + u * 0.45), (tx + side * u * 1.7, ty + u * (0.2 + k * 0.25))], lw * 0.35, a=a * 0.8, smooth=False)
    if ronron:
        onomatopee(c, 'rrrr', tx + u * 2.2, ty - u * 1.0, u * 1.0, -12, ENCRE, PAPIER, a)
    c.restore()
