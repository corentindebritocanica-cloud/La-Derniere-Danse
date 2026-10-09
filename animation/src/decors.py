"""Décors : Toulouse, décembre 1925, à l'encre et à la trame.

Chaque décor se dessine dans un rectangle (0, 0, w, h) ; cam = décalage de caméra (parallaxe).
"""
import math, random
import skia
from moteur import *
from persos import trait, trait_effile, ovale, capsule, union, courbe, bezier_pts, etoffe

BRIQUE = '#c98a6a'   # brique rose toulousaine (touche de couleur discrète)

def rect(x, y, w, h):
    return skia.Rect.MakeXYWH(x, y, w, h)

def poly(c, pts, fill=PAPIER, w=3, a=255, ton=None, pas=6, angle=45, smooth=False):
    pth = path_pts(pts, smooth=smooth)
    if fill:
        c.drawPath(pth, P(fill, a))
    if ton:
        c.drawPath(pth, trame(ton, pas, angle, ENCRE, int(a)))
    if w:
        c.drawPath(pth, P(ENCRE, a, stroke=w))
    return pth

def ligne(c, x0, y0, x1, y1, w=2, a=255, couleur=ENCRE):
    c.drawLine(x0, y0, x1, y1, P(couleur, a, stroke=w))

# ---------------------------------------------------------------- ciels
def ciel_nuit(c, w, h, t=0, etoiles=160, graine=7, lune=True, gemeaux=False, horizon=0.75, cam=0):
    c.drawRect(rect(0, 0, w, h), degrade(0, 0, 0, h * horizon, [NUIT, BLEU, '#2c4466'], [0, 0.7, 1]))
    rng = random.Random(graine)
    for i in range(etoiles):
        x = (rng.random() * w * 1.3 - cam * 0.05) % (w * 1.3) - w * 0.15
        y = rng.random() * h * horizon * 0.95
        r = rng.random() ** 3 * 4 + 0.8
        sc = 0.55 + 0.45 * math.sin(t * (1 + rng.random() * 2) + i)
        if r > 3:
            scintille(c, x, y, r * 3, 255 * sc, BLANC, None)
        else:
            c.drawCircle(x, y, r, P(BLANC, 200 * sc))
    if gemeaux:
        pts = [(0.62, 0.18), (0.66, 0.15), (0.69, 0.24), (0.72, 0.33), (0.64, 0.27), (0.6, 0.36), (0.58, 0.45)]
        for (a_, b_) in ((0, 2), (2, 3), (1, 4), (4, 5), (5, 6), (0, 1)):
            ligne(c, pts[a_][0] * w, pts[a_][1] * h, pts[b_][0] * w, pts[b_][1] * h, 1.2, 90, BLANC)
        for (px, py) in pts:
            scintille(c, px * w, py * h, 10, 230, BLANC, None)
    if lune:
        lx, ly = w * 0.82 - cam * 0.03, h * 0.16
        c.drawCircle(lx, ly, 46, P('#f4ecd4'))
        c.drawCircle(lx + 18, ly - 8, 42, P(NUIT))

def ciel_aube(c, w, h, k=0.5, horizon=0.75):
    c.drawRect(rect(0, 0, w, h), degrade(0, 0, 0, h * horizon, [mix(NUIT, '#5b6f9a', k), mix(BLEU, '#e8b98a', k), mix('#2c4466', '#f3d9a8', k)], [0, 0.6, 1]))

def ciel_jour(c, w, h, horizon=0.75):
    c.drawRect(rect(0, 0, w, h * horizon), P(BLANC))
    trame_degradee(c, (0, 0, w, h * horizon), 0.18, 0.0, 6, ENCRE, 12)

def nuages(c, w, h, t=0, y=0.25, n=5, graine=2, a=255, nuit=False):
    rng = random.Random(graine)
    for i in range(n):
        x = (rng.random() * w * 1.5 + t * (6 + rng.random() * 8)) % (w * 1.5) - w * 0.25
        yy = h * (y + rng.random() * 0.15)
        s = 60 + rng.random() * 90
        pth = skia.Path()
        for k in range(5):
            pth.addCircle(x + k * s * 0.55, yy - math.sin(k / 4 * math.pi) * s * 0.35, s * (0.35 + 0.15 * math.sin(k)))
        pth = skia.Op(pth, skia.Path(), skia.PathOp.kUnion_PathOp) or pth
        c.drawPath(pth, P('#3a4a6a' if nuit else BLANC, a * (0.6 if nuit else 1)))
        c.drawPath(pth, P(ENCRE, a * (0.3 if nuit else 0.8), stroke=2.5))

# ---------------------------------------------------------------- Toulouse
def toits_toulouse(c, w, h, base, t=0, cam=0, nuit=False, graine=11, a=255, echelle=1.0, clochers=True):
    """Silhouette des toits : maisons de brique, clochers (Saint-Sernin, les Jacobins), cheminées."""
    rng = random.Random(graine)
    x = -200 - (cam % 400)
    col_mur = mix(BRIQUE, NUIT, 0.75) if nuit else BRIQUE
    while x < w + 200:
        bw = (80 + rng.random() * 140) * echelle
        bh = (90 + rng.random() * 160) * echelle
        y0 = base - bh
        toit = 30 * echelle + rng.random() * 40 * echelle
        pts = [(x, base), (x, y0), (x + bw * 0.5, y0 - toit), (x + bw, y0), (x + bw, base)]
        pth = poly(c, pts, col_mur, 2.5 * echelle, a)
        c.save(); c.clipPath(pth, doAntiAlias=True)
        c.drawRect(rect(x, y0, bw, bh), trame(0.25 if not nuit else 0.5, 5, 45, ENCRE, int(a * 0.6)))
        # tuiles canal (lignes du toit)
        for k in range(int(bw / 10)):
            ligne(c, x + k * 10, y0 - toit + 4, x + k * 10 - 4, y0 + 4, 1, a * 0.4)
        c.restore()
        poly(c, [(x - 4, y0 + 2), (x + bw * 0.5, y0 - toit - 2), (x + bw + 4, y0 + 2), (x + bw + 4, y0 + 10), (x + bw * 0.5, y0 - toit + 8), (x - 4, y0 + 10)],
             mix('#9a5a40', NUIT, 0.7) if nuit else '#9a5a40', 2 * echelle, a)
        # fenêtres
        for fy in range(int(y0 + 25 * echelle), int(base - 30 * echelle), int(48 * echelle)):
            for fx in range(int(x + 16 * echelle), int(x + bw - 26 * echelle), int(36 * echelle)):
                allume = nuit and rng.random() < 0.3
                c.drawRect(rect(fx, fy, 14 * echelle, 22 * echelle), P('#f7d98a' if allume else (ENCRE if nuit else '#f6f0e2'), a))
                c.drawRect(rect(fx, fy, 14 * echelle, 22 * echelle), P(ENCRE, a, stroke=1.6))
        if rng.random() < 0.5:
            cx = x + bw * (0.2 + rng.random() * 0.6)
            poly(c, [(cx, y0 - toit * 0.3), (cx, y0 - toit - 22 * echelle), (cx + 14 * echelle, y0 - toit - 22 * echelle), (cx + 14 * echelle, y0 - toit * 0.1)], col_mur, 2, a)
        x += bw - 6
    if clochers:
        # clocher octogonal de Saint-Sernin (étages en retrait) + clocher des Jacobins
        for (cxr, hh, sc) in ((0.3, 1.0, 1.0), (0.72, 0.8, 0.8)):
            cx = w * cxr - cam * 0.6
            s = 60 * echelle * sc
            y = base - 120 * echelle
            for k in range(5):
                ww = s * (1.6 - k * 0.22)
                hk = s * 0.7
                poly(c, [(cx - ww / 2, y), (cx - ww / 2, y - hk), (cx + ww / 2, y - hk), (cx + ww / 2, y)], col_mur, 2.5, a)
                for m in range(3):
                    mx = cx - ww / 2 + ww * (m + 0.5) / 3
                    poly(c, [(mx - 5, y - hk * 0.2), (mx - 5, y - hk * 0.7), (mx, y - hk * 0.85), (mx + 5, y - hk * 0.7), (mx + 5, y - hk * 0.2)], ENCRE, 0, a)
                y -= hk
            poly(c, [(cx - s * 0.4, y), (cx, y - s * 1.6 * hh), (cx + s * 0.4, y)], col_mur, 2.5, a)
            c.drawCircle(cx, y - s * 1.65 * hh, 4, P(ENCRE, a))

def garonne(c, w, y, h, t=0, nuit=False, cam=0, a=255):
    """Le fleuve : bandes ondulées, reflets dorés la nuit."""
    c.drawRect(rect(0, y, w, h), P('#20304a' if nuit else '#dfe6e6', a))
    if not nuit:
        c.drawRect(rect(0, y, w, h), trame(0.2, 6, 0, BLEU, int(a * 0.8)))
    rng = random.Random(5)
    for i in range(40):
        yy = y + 8 + rng.random() * (h - 16)
        xx = (rng.random() * w * 1.4 + t * 20 * (0.5 + rng.random()) - cam * 0.3) % (w * 1.4) - w * 0.2
        L = 30 + rng.random() * 120
        pts = [(xx + k * L / 6, yy + math.sin(k + t * 2 + i) * 2.5) for k in range(7)]
        trait(c, pts, 2.2, OR if nuit else BLANC, a * (0.7 if nuit else 0.9))
        if not nuit:
            trait(c, [(p[0], p[1] + 4) for p in pts], 1.2, BLEU, a * 0.6)

def pont_neuf(c, w, h, base, t=0, nuit=False, cam=0, a=255):
    """Le Pont-Neuf : arches de brique et oculi (les « dégueuloirs »)."""
    col = mix(BRIQUE, NUIT, 0.65) if nuit else BRIQUE
    tablier = base - 210
    x0 = -cam * 0.8 - 100
    pth = skia.Path()
    pth.addRect(rect(x0, tablier, w + 400, base - tablier + 30))
    arches = skia.Path()
    oc = skia.Path()
    for k in range(7):
        ax = x0 + 80 + k * 320
        aw = 120 + (40 if k % 2 else 0)
        arches.addOval(rect(ax, tablier + 50, aw * 2, (base - tablier) * 1.6))
        oc.addCircle(ax + aw * 2 + 30, tablier + 80, 24)
    pth = skia.Op(pth, arches, skia.PathOp.kDifference_PathOp) or pth
    pth = skia.Op(pth, oc, skia.PathOp.kDifference_PathOp) or pth
    c.drawPath(pth, P(col, a))
    c.save(); c.clipPath(pth, doAntiAlias=True)
    for yy in range(int(tablier), int(base + 30), 12):
        ligne(c, x0, yy, x0 + w + 400, yy, 1, a * 0.35)
    c.drawPaint(trame(0.3 if not nuit else 0.55, 5, 45, ENCRE, int(a * 0.6)))
    c.restore()
    c.drawPath(pth, P(ENCRE, a, stroke=3))
    # parapet et réverbères
    poly(c, [(x0, tablier - 40), (x0 + w + 400, tablier - 40), (x0 + w + 400, tablier), (x0, tablier)], col, 3, a, 0.3 if not nuit else 0.5, 5)
    for k in range(6):
        rx = x0 + 150 + k * 380
        reverbere(c, rx, tablier - 40, 150, nuit, a)

def reverbere(c, x, sol, hauteur, nuit=False, a=255, halo=1.0):
    if nuit and halo > 0:
        c.drawCircle(x, sol - hauteur, 90, degrade_rad(x, sol - hauteur, 90, [hexc('#ffe7a0', int(120 * halo * a / 255)), hexc('#ffe7a0', 0)]))
    trait(c, [(x, sol), (x, sol - hauteur)], 6, ENCRE, a)
    trait(c, [(x, sol - hauteur + 10), (x + 22, sol - hauteur + 4)], 3, ENCRE, a)
    lp = path_pts([(x - 14, sol - hauteur), (x + 14, sol - hauteur), (x + 9, sol - hauteur - 30), (x - 9, sol - hauteur - 30)])
    c.drawPath(lp, P('#ffe7a0' if nuit else BLANC, a)); c.drawPath(lp, P(ENCRE, a, stroke=3))
    etoile(c, x, sol - hauteur - 38, 8, 4, 0.4, ENCRE, a)

def rue_pavee(c, w, h, horizon, t=0, nuit=False, cam=0, a=255):
    """Sol pavé en perspective."""
    c.drawRect(rect(0, horizon, w, h - horizon), P('#2a2a30' if nuit else '#d8cdb8', a))
    vx = w / 2 - cam * 0.2
    for k in range(-14, 15):
        ligne(c, vx + k * 30, horizon, vx + k * 260, h, 1.5, a * 0.5)
    y = horizon; dy = 6
    while y < h:
        ligne(c, 0, y, w, y, 1.4, a * 0.5)
        y += dy; dy *= 1.18
    c.drawRect(rect(0, horizon, w, h - horizon), trame(0.12 if not nuit else 0.35, 6, 45, ENCRE, int(a * 0.7)))

def facade(c, x, base, bw, bh, nuit=False, a=255, fenetres=True, enseigne=None, porte=True, couleur=None, graine=1):
    col = couleur or (mix(BRIQUE, NUIT, 0.7) if nuit else BRIQUE)
    poly(c, [(x, base), (x, base - bh), (x + bw, base - bh), (x + bw, base)], col, 3, a, 0.28 if not nuit else 0.55, 5)
    rng = random.Random(graine)
    for yy in range(int(base - bh + 8), int(base), 14):
        ligne(c, x, yy, x + bw, yy, 0.8, a * 0.3)
    if fenetres:
        for fy in range(int(base - bh + 40), int(base - 140), 110):
            for fx in range(int(x + 30), int(x + bw - 70), 90):
                allume = nuit and rng.random() < 0.35
                poly(c, [(fx, fy), (fx + 48, fy), (fx + 48, fy + 76), (fx, fy + 76)], '#f7d98a' if allume else (ENCRE if nuit else '#efe8d8'), 2.5, a)
                ligne(c, fx + 24, fy, fx + 24, fy + 76, 1.5, a)
                poly(c, [(fx - 6, fy + 76), (fx + 54, fy + 76), (fx + 54, fy + 84), (fx - 6, fy + 84)], col, 2, a)
                # volets
                for vx in (fx - 20, fx + 50):
                    poly(c, [(vx, fy), (vx + 18, fy), (vx + 18, fy + 76), (vx, fy + 76)], '#6a7a6a' if not nuit else '#20262a', 2, a)
    if porte:
        px = x + bw / 2 - 45
        poly(c, [(px, base), (px, base - 150), (px + 45, base - 175), (px + 90, base - 150), (px + 90, base)], ENCRE if nuit else BRUN, 3, a)

# ---------------------------------------------------------------- intérieurs
def mur_papier_peint(c, x, y, w, h, motif='losanges', a=255, ton=0.15, nuit=False):
    c.drawRect(rect(x, y, w, h), P('#e9dfc8' if not nuit else '#3a3640', a))
    if motif == 'losanges':
        for i in range(int(w / 60) + 2):
            for j in range(int(h / 80) + 2):
                cx = x + i * 60 + (30 if j % 2 else 0); cy = y + j * 80
                poly(c, [(cx, cy - 18), (cx + 10, cy), (cx, cy + 18), (cx - 10, cy)], None, 1.2, a * 0.45)
    elif motif == 'rayures':
        for i in range(int(w / 40) + 1):
            c.drawRect(rect(x + i * 40, y, 16, h), trame(ton, 5, 45, ENCRE, int(a)))
    elif motif == 'deco':
        for i in range(int(w / 140) + 2):
            cx = x + i * 140
            for k in range(5):
                ang = -math.pi / 2 + (k - 2) * 0.35
                ligne(c, cx, y + h, cx + math.cos(ang) * h * 0.5, y + h + math.sin(ang) * h * 0.5, 1.3, a * 0.35)
    c.drawRect(rect(x, y, w, h), trame(ton * 0.6, 6, 45, ENCRE, int(a * 0.6)))

def parquet(c, x, y, w, h, vx=None, a=255, cire=True, sombre=False):
    c.drawRect(rect(x, y, w, h), P('#b88a5a' if not sombre else '#5a3e2b', a))
    vx = x + w / 2 if vx is None else vx
    for k in range(-30, 31):
        ligne(c, vx + k * 18, y, vx + k * 140, y + h, 1.4, a * 0.55)
    yy = y; dy = 8
    while yy < y + h:
        ligne(c, x, yy, x + w, yy, 1, a * 0.3)
        yy += dy; dy *= 1.15
    c.drawRect(rect(x, y, w, h), trame(0.2 if not sombre else 0.45, 5, 45, ENCRE, int(a * 0.55)))
    if cire:
        for k in range(5):
            trait(c, [(x + w * (0.2 + k * 0.15), y + h * 0.3), (x + w * (0.15 + k * 0.17), y + h * 0.9)], 10, BLANC, a * 0.18)

def grenier(c, w, h, t=0, nuit=False, cam=0, fenetre=True, a=255, aube=0.0):
    """Le grenier de Célestin : poutres, fenêtre en demi-lune sur la Garonne, chevalet, lit de fer, gramophone."""
    mur = '#e2d3b8' if not nuit else '#3c3640'
    c.drawRect(rect(0, 0, w, h), P(mur, a))
    c.drawRect(rect(0, 0, w, h), trame(0.12 if not nuit else 0.4, 6, 45, ENCRE, int(a)))
    # plancher
    parquet(c, 0, h * 0.78, w, h * 0.22, w / 2 - cam * 0.3, a, cire=False, sombre=nuit)
    # pente du toit + poutres
    poly(c, [(0, 0), (w * 0.38, 0), (0, h * 0.42)], BRUN if not nuit else '#2a2018', 3, a, 0.3, 5)
    for k in range(5):
        x = (w * 0.18 + k * w * 0.2 - cam * 0.4)
        poly(c, [(x, 0), (x + 34, 0), (x + 34, h * 0.78), (x, h * 0.78)], '#7a5638' if not nuit else '#2c2018', 3, a, 0.35, 5)
        for j in range(6):
            ligne(c, x + 6 + j * 4, 10, x + 8 + j * 4, h * 0.76, 0.8, a * 0.4)
    ligne(c, 0, 70, w, 70, 26, a, '#6a4a30' if not nuit else '#241a14')
    if fenetre:
        fx, fy, fr = w * 0.62 - cam * 0.5, h * 0.52, h * 0.3
        fen = skia.Path(); fen.moveTo(fx - fr, fy); fen.arcTo(rect(fx - fr, fy - fr, fr * 2, fr * 2), 180, 180, False); fen.close()
        c.save(); c.clipPath(fen, doAntiAlias=True)
        if nuit:
            ciel_nuit(c, w, h, t, 60, 3, lune=False, horizon=0.55)
            if aube > 0:
                c.drawRect(rect(0, 0, w, h), P('#f3c98a', 120 * aube))
            garonne(c, w, fy - fr * 0.25, fr * 0.3, t, True)
            toits_toulouse(c, w, h, fy - fr * 0.22, t, cam * 0.2, True, 3, a, 0.45, clochers=False)
        else:
            ciel_jour(c, w, h, 0.5)
            garonne(c, w, fy - fr * 0.25, fr * 0.3, t, False)
            toits_toulouse(c, w, h, fy - fr * 0.22, t, cam * 0.2, False, 3, a, 0.45, clochers=False)
            c.drawRect(rect(0, 0, w, h), P(BLANC, 70))
        c.restore()
        c.drawPath(fen, P(ENCRE, a, stroke=10))
        for k in range(5):
            ang = math.pi + k * math.pi / 4
            ligne(c, fx, fy, fx + math.cos(ang) * fr, fy + math.sin(ang) * fr, 5, a, '#5a3e1b')
        c.drawCircle(fx, fy, fr * 0.22, P(ENCRE, a, stroke=5))
        ligne(c, fx - fr - 20, fy + 6, fx + fr + 20, fy + 6, 14, a, '#5a3e1b')
        if not nuit:
            # rayon de lumière
            lum = path_pts([(fx - fr, fy), (fx + fr, fy), (fx + fr * 0.4, h * 0.95), (fx - fr * 1.8, h * 0.95)])
            c.drawPath(lum, P(BLANC, 55 * a / 255))

def chevalet(c, x, sol, hauteur, toile='vide', a=255, t=0, retourne=False):
    """Chevalet de peintre avec toile ; toile = 'vide' | 'garonne' | 'portrait' | 'portrait_fini'."""
    lw = 4
    trait(c, [(x - hauteur * 0.25, sol), (x, sol - hauteur)], lw * 1.5, BRUN, a)
    trait(c, [(x + hauteur * 0.25, sol), (x, sol - hauteur)], lw * 1.5, BRUN, a)
    trait(c, [(x, sol - hauteur * 0.9), (x + hauteur * 0.05, sol)], lw * 1.2, BRUN, a)
    tw, th = hauteur * 0.52, hauteur * 0.62
    tx, ty = x - tw / 2, sol - hauteur * 0.92
    ligne(c, tx - 10, ty + th, tx + tw + 10, ty + th, 8, a, BRUN)
    if retourne:
        poly(c, [(tx, ty), (tx + tw, ty), (tx + tw, ty + th), (tx, ty + th)], '#c8b48a', 4, a)
        ligne(c, tx, ty + th / 2, tx + tw, ty + th / 2, 3, a, BRUN); ligne(c, tx + tw / 2, ty, tx + tw / 2, ty + th, 3, a, BRUN)
        return (tx, ty, tw, th)
    poly(c, [(tx, ty), (tx + tw, ty), (tx + tw, ty + th), (tx, ty + th)], '#fbf6ea', 4, a)
    if toile == 'garonne':
        c.drawRect(rect(tx + 6, ty + 6, tw - 12, th * 0.5), P(BLEU, a))
        c.drawRect(rect(tx + 6, ty + 6 + th * 0.5, tw - 12, th * 0.45), P('#4a6a8a', a))
        for k in range(5):
            trait(c, [(tx + 10, ty + th * (0.6 + k * 0.07)), (tx + tw - 10, ty + th * (0.62 + k * 0.07))], 2, OR, a)
    return (tx, ty, tw, th)

def portrait_louise(c, x, y, w, h, avancement=1.0, a=255, yeux_rouges=True):
    """Le portrait peint : visage de trois quarts, tout en bleus, les yeux rouges."""
    from persos import tete
    c.save()
    c.clipRect(rect(x, y, w, h))
    c.drawRect(rect(x, y, w, h), P('#fbf6ea', a))
    c.drawRect(rect(x, y, w, h), degrade(x, y, x + w, y + h, ['#c5d3e4', '#5a7aa0', BLEU]))
    # touches de pinceau
    rng = random.Random(9)
    for i in range(60):
        px = x + rng.random() * w; py = y + rng.random() * h
        trait(c, [(px, py), (px + rng.random() * 40 - 20, py + rng.random() * 30)], 6 + rng.random() * 8, mix(BLEU, '#8fa8c8', rng.random()), 90 * a / 255)
    if avancement > 0:
        c.save()
        visible = skia.Path(); visible.addRect(rect(x, y, w, h * avancement))
        c.clipPath(visible)
        tete(c, x + w * 0.5, y + h * 0.48, w * 0.3, 'louise', 'neutre', -0.45, -4, a, oeil=(-0.4, 0))
        c.drawRect(rect(x, y, w, h), P(BLEU, 70 * a / 255))
        if yeux_rouges:
            for (ex, ey) in ((x + w * 0.4, y + h * 0.53), (x + w * 0.57, y + h * 0.53)):
                c.drawCircle(ex, ey, w * 0.035, P(ROUGE, 220 * a / 255))
        c.restore()
    c.restore()
    poly(c, [(x, y), (x + w, y), (x + w, y + h), (x, y + h)], None, 4, a)

def lit_de_fer(c, x, sol, w, a=255, nuit=False):
    poly(c, [(x, sol - 80), (x + w, sol - 80), (x + w, sol - 50), (x, sol - 50)], BLANC if not nuit else '#8a8aa0', 3, a)
    poly(c, [(x + 10, sol - 105), (x + w * 0.25, sol - 110), (x + w * 0.25, sol - 80), (x + 10, sol - 80)], BLANC if not nuit else '#a0a0b8', 3, a)
    poly(c, [(x + w * 0.3, sol - 95), (x + w, sol - 92), (x + w, sol - 72), (x + w * 0.3, sol - 75)], '#b8a88a' if not nuit else '#504a60', 3, a, 0.2)
    for xx in (x, x + w):
        trait(c, [(xx, sol), (xx, sol - 180 if xx == x else sol - 130)], 6, ENCRE, a)
    for k in range(5):
        xx = x + 8 + k * 10
        trait(c, [(xx, sol - 80), (xx, sol - 170)], 2.5, ENCRE, a)
    c.drawCircle(x, sol - 186, 9, P(OR, a)); c.drawCircle(x, sol - 186, 9, P(ENCRE, a, stroke=2))

def gramophone(c, x, sol, s=1.0, a=255, t=0, joue=False):
    poly(c, [(x - 60 * s, sol), (x + 60 * s, sol), (x + 55 * s, sol - 50 * s), (x - 55 * s, sol - 50 * s)], BRUN, 3, a, 0.3, 5)
    c.drawPath(ovale(x, sol - 54 * s, 52 * s, 8 * s), P(ENCRE, a))
    trait(c, [(x + 30 * s, sol - 58 * s), (x + 20 * s, sol - 110 * s), (x + 40 * s, sol - 150 * s)], 6 * s, OR, a)
    pav = path_pts([(x + 30 * s, sol - 150 * s), (x + 150 * s, sol - 250 * s), (x + 190 * s, sol - 170 * s)], smooth=False)
    c.drawPath(pav, P(OR, a)); c.drawPath(pav, P(ENCRE, a, stroke=3))
    c.drawPath(ovale(x + 170 * s, sol - 210 * s, 25 * s, 48 * s), P('#8a6a2a', a)); c.drawPath(ovale(x + 170 * s, sol - 210 * s, 25 * s, 48 * s), P(ENCRE, a, stroke=3))
    if joue:
        notes_qui_montent(c, t, x + 200 * s, sol - 220 * s, 3, 40 * s, a)

def boulangerie(c, w, h, t=0, a=255, cam=0):
    """La boutique de madame Fabre : comptoir de bois, vitrine bombée, croissants, volutes dorées."""
    mur_papier_peint(c, 0, 0, w, h * 0.7, 'rayures', a, 0.18)
    parquet(c, 0, h * 0.7, w, h * 0.3, w * 0.5 - cam * 0.3, a, False)
    # étagères à pain
    for k in range(3):
        y = h * (0.18 + k * 0.14)
        ligne(c, w * 0.05, y, w * 0.95, y, 10, a, BRUN)
        for i in range(10):
            bx = w * (0.08 + i * 0.09)
            pth = ovale(bx, y - 18, 34, 14)
            encre(c, pth, '#d9a24a', 2.5, a)
            for j in range(3):
                ligne(c, bx - 18 + j * 14, y - 26, bx - 10 + j * 14, y - 10, 1.5, a)
    # comptoir
    poly(c, [(w * 0.1 - cam * 0.6, h * 0.62), (w * 0.9 - cam * 0.6, h * 0.62), (w * 0.9 - cam * 0.6, h), (w * 0.1 - cam * 0.6, h)], BRUN, 4, a, 0.35, 5)
    poly(c, [(w * 0.08 - cam * 0.6, h * 0.6), (w * 0.92 - cam * 0.6, h * 0.6), (w * 0.92 - cam * 0.6, h * 0.64), (w * 0.08 - cam * 0.6, h * 0.64)], '#7a5638', 3, a)
    # cloche à croissants (vitrine)
    vx = w * 0.62 - cam * 0.6
    pth = skia.Path(); pth.moveTo(vx - 160, h * 0.6); pth.cubicTo(vx - 160, h * 0.38, vx + 160, h * 0.38, vx + 160, h * 0.6); pth.close()
    c.drawPath(pth, P(BLANC, 120 * a / 255)); c.drawPath(pth, P(ENCRE, a, stroke=3))
    for i in range(5):
        croissant(c, vx - 110 + i * 55, h * 0.585, 26, a)
    trait(c, [(vx - 120, h * 0.47), (vx - 60, h * 0.42)], 6, BLANC, a * 0.8)
    # volutes de bonne odeur
    for k in range(4):
        ph = (t * 0.25 + k / 4) % 1
        bx = vx - 60 + k * 40
        pts = [(bx + math.sin(ph * 8 + j) * 14, h * 0.55 - j * 26 - ph * 60) for j in range(6)]
        trait(c, pts, 4, OR, 255 * env(ph, 0, 1, 0.3))

def croissant(c, x, y, s, a=255):
    pth = path_pts([(x - s, y), (x - s * 0.6, y - s * 0.6), (x, y - s * 0.75), (x + s * 0.6, y - s * 0.6), (x + s, y), (x + s * 0.5, y - s * 0.2), (x, y - s * 0.3), (x - s * 0.5, y - s * 0.2)], smooth=True)
    encre(c, pth, '#d9a24a', max(1.5, s * 0.08), a)
    for k in (-0.45, 0, 0.45):
        ligne(c, x + k * s, y - s * 0.65, x + k * s * 1.3, y - s * 0.2, max(1, s * 0.05), a)

def hangar_latecoere(c, w, h, t=0, a=255, cam=0):
    """Bureau d'études des ateliers Latécoère, Montaudran : verrière, aile en construction, tables à dessin."""
    c.drawRect(rect(0, 0, w, h), P('#e9e4d8', a))
    # verrière
    for i in range(14):
        x = i * w / 12 - (cam * 0.3) % (w / 12)
        ligne(c, x, 0, x + 60, h * 0.45, 4, a)
    for j in range(5):
        y = j * h * 0.09
        ligne(c, 0, y, w, y + 12, 3, a)
    c.drawRect(rect(0, 0, w, h * 0.45), trame(0.08, 6, 30, BLEU, int(a)))
    for k in range(6):
        trait(c, [(w * (0.1 + k * 0.15), 0), (w * (0.02 + k * 0.15), h * 0.85)], 40, BLANC, a * 0.25)
    # carcasse d'aile au fond (nervures)
    ax, ay = w * 0.5 - cam * 0.5, h * 0.42
    for k in range(12):
        xx = ax - 520 + k * 90
        pth = path_pts([(xx, ay), (xx + 20, ay - 46), (xx + 70, ay - 54), (xx + 90, ay - 30), (xx + 95, ay)], smooth=True)
        c.drawPath(pth, P(ENCRE, a, stroke=3))
    ligne(c, ax - 540, ay, ax + 560, ay, 5, a); ligne(c, ax - 520, ay - 46, ax + 540, ay - 46, 3, a)
    c.drawRect(rect(0, h * 0.45, w, h * 0.55), P('#d8d0bf', a))
    c.drawRect(rect(0, h * 0.45, w, h * 0.55), trame(0.15, 6, 45, ENCRE, int(a)))
    texte(c, 'BUREAU D’ÉTUDES', w * 0.82 - cam * 0.4, h * 0.12, font('machine', 34), ENCRE, a, 'center')

def table_a_dessin(c, x, sol, w, a=255, plan='aile', t=0, hanche_danseuse=0.0):
    """Planche inclinée avec un plan d'aile ; hanche_danseuse 0..1 dessine la courbe en miroir dans le coin."""
    hh = w * 0.55
    trait(c, [(x + w * 0.2, sol), (x + w * 0.35, sol - hh * 0.9)], 7, BRUN, a)
    trait(c, [(x + w * 0.8, sol), (x + w * 0.65, sol - hh * 0.9)], 7, BRUN, a)
    pl = [(x, sol - hh * 0.8), (x + w, sol - hh * 0.8), (x + w * 0.92, sol - hh * 1.45), (x + w * 0.08, sol - hh * 1.45)]
    poly(c, pl, '#f6f2e6', 4, a)
    # plan coté de l'aile
    cx, cy = x + w * 0.45, sol - hh * 1.12
    pts = [(cx - w * 0.3, cy), (cx - w * 0.22, cy - hh * 0.12), (cx, cy - hh * 0.15), (cx + w * 0.25, cy - hh * 0.05), (cx + w * 0.3, cy)]
    trait(c, courbe(pts, 6) + [(cx - w * 0.3, cy)], 3, BLEU, a)
    for k in range(5):
        xx = cx - w * 0.25 + k * w * 0.12
        ligne(c, xx, cy + 4, xx, cy - hh * 0.12, 1.2, a * 0.7, BLEU)
    ligne(c, cx - w * 0.3, cy + 22, cx + w * 0.3, cy + 22, 1.2, a, BLEU)
    texte(c, '1 250', cx, cy + 18, font('machine', max(12, w * 0.04)), BLEU, a, 'center')
    if hanche_danseuse > 0:
        hx, hy = x + w * 0.83, sol - hh * 1.18
        pts = [(hx, hy - hh * 0.22), (hx + w * 0.05, hy - hh * 0.1), (hx + w * 0.02, hy), (hx + w * 0.06, hy + hh * 0.12)]
        cc = courbe(pts, 8)
        n = max(2, int(len(cc) * hanche_danseuse))
        trait(c, cc[:n], 3, BLEU, a)

def lampe_bureau(c, x, sol, s=1.0, a=255, allumee=True):
    if allumee:
        cone = path_pts([(x + 60 * s, sol - 200 * s), (x + 110 * s, sol - 200 * s), (x + 260 * s, sol), (x - 60 * s, sol)])
        c.drawPath(cone, P('#fff3c8', 90 * a / 255))
    trait(c, [(x, sol), (x + 20 * s, sol - 140 * s), (x + 80 * s, sol - 210 * s)], 6 * s, ENCRE, a)
    poly(c, [(x + 50 * s, sol - 230 * s), (x + 120 * s, sol - 215 * s), (x + 110 * s, sol - 190 * s), (x + 55 * s, sol - 200 * s)], '#2a2a2a', 3, a)

def maison_sarrail(c, w, h, t=0, nuit=True, a=255, cam=0, fenetre_allumee=False, glycine=1.0, louise_fenetre=False, base=None):
    """Façade de la maison de Purpan avec la glycine qui tombe jusqu'à la fenêtre de Louise
    (troisième fenêtre à gauche, premier étage)."""
    base = h * 0.9 if base is None else base
    x0 = w * 0.18 - cam * 0.5
    fw = w * 0.64
    hh = h * 0.72
    col = '#d8c8a8' if not nuit else '#4a4658'
    poly(c, [(x0, base), (x0, base - hh), (x0 + fw, base - hh), (x0 + fw, base)], col, 4, a, 0.12 if not nuit else 0.45, 5)
    # toit d'ardoise
    poly(c, [(x0 - 30, base - hh), (x0 + fw * 0.15, base - hh - 120), (x0 + fw * 0.85, base - hh - 120), (x0 + fw + 30, base - hh)], '#3a3a44', 4, a, 0.5, 5)
    for k in range(10):
        ligne(c, x0 + fw * (0.15 + k * 0.077), base - hh - 120, x0 + fw * (0.1 + k * 0.085), base - hh, 1.5, a * 0.5, BLANC)
    # bandeau
    ligne(c, x0, base - hh * 0.5, x0 + fw, base - hh * 0.5, 10, a, '#b8a888' if not nuit else '#3a3648')
    fenetres = []
    for et, yy in ((1, base - hh * 0.92), (0, base - hh * 0.42)):
        for i in range(5):
            fx = x0 + fw * (0.08 + i * 0.185)
            fenetres.append((et, i, fx, yy))
            if et == 0 and i == 2:
                continue  # au rez-de-chaussée, la porte
            allume = nuit and ((et == 1 and i == 2 and fenetre_allumee) or (et == 0 and i == 4))
            poly(c, [(fx, yy), (fx + 74, yy), (fx + 74, yy + 130), (fx, yy + 130)], '#f7d98a' if allume else (ENCRE if nuit else '#f0ead8'), 3, a)
            ligne(c, fx + 37, yy, fx + 37, yy + 130, 2, a, BLANC if nuit else ENCRE)
            ligne(c, fx, yy + 60, fx + 74, yy + 60, 2, a, BLANC if nuit else ENCRE)
            poly(c, [(fx - 8, yy + 130), (fx + 82, yy + 130), (fx + 82, yy + 140), (fx - 8, yy + 140)], col, 2, a)
            for vx in (fx - 30, fx + 76):
                poly(c, [(vx, yy), (vx + 28, yy), (vx + 28, yy + 130), (vx, yy + 130)], '#5a6a5a' if not nuit else '#1c2228', 2.5, a)
                for k in range(8):
                    ligne(c, vx + 3, yy + 10 + k * 15, vx + 25, yy + 10 + k * 15, 1, a * 0.5, BLANC if nuit else ENCRE)
    # porte (sous la fenêtre de Louise, comme sur le plan coté)
    fx = x0 + fw * (0.08 + 2 * 0.185)
    px = fx - 13
    poly(c, [(px, base), (px, base - 190), (px + 50, base - 215), (px + 100, base - 190), (px + 100, base)], BRUN if not nuit else '#1a1410', 4, a, 0.3, 5)
    # glycine : deux tiges qui montent entre la 3e et la 4e fenêtre jusqu'à la fenêtre de Louise
    glycine_branches(c, fx + 108, base, fx + 92, base - hh * 0.92 - 20, t, nuit, a, glycine)
    glycine_branches(c, fx + 124, base, fx + 112, base - hh * 0.98, t, nuit, a, glycine * 0.5, graine=6)
    if louise_fenetre:
        pass
    return dict(fenetre_louise=(fx + 37, base - hh * 0.92 + 65), base=base, x0=x0, fw=fw)

def glycine_branches(c, x_pied, y_pied, x_haut, y_haut, t=0, nuit=True, a=255, densite=1.0, fleurs=False, graine=4):
    """La glycine : un tronc tordu qui monte le long de la façade, des branches en dentelle."""
    rng = random.Random(graine)
    pts = []
    n = 14
    for k in range(n + 1):
        f = k / n
        pts.append((lerp(x_pied, x_haut, f) + math.sin(f * 7 + graine) * 18, lerp(y_pied, y_haut, f)))
    trait_effile(c, pts, 26, 9, '#3a2a1c' if not nuit else ENCRE, a)
    trait(c, pts, 2, BLANC if nuit else '#6a4a30', a * 0.4)
    for k in range(int(26 * densite)):
        f = rng.random()
        bx = lerp(x_pied, x_haut, f) + math.sin(f * 7 + graine) * 18
        by = lerp(y_pied, y_haut, f)
        ang = rng.uniform(-2.6, -0.5) if rng.random() < 0.5 else rng.uniform(-2.6 + math.pi, -0.5 + math.pi)
        L = 60 + rng.random() * 160
        bp = [(bx, by)]
        for j in range(1, 6):
            bp.append((bx + math.cos(ang) * L * j / 5 + math.sin(j + t * 0.8 + k) * 8, by + math.sin(ang) * L * j / 5 + j * j * 3))
        trait_effile(c, bp, 7, 1.5, '#3a2a1c' if not nuit else ENCRE, a)
        # grappes de feuilles mortes / bourgeons (décembre : presque nue)
        for j in range(2, 6):
            if rng.random() < 0.5:
                c.drawPath(ovale(bp[j][0], bp[j][1] + 8, 5, 10), P('#5a4a3a' if not nuit else '#2a2a3a', a))
        if fleurs and rng.random() < 0.7:
            gx, gy = bp[-1]
            for m in range(6):
                c.drawCircle(gx + rng.uniform(-8, 8), gy + m * 9, 7 - m * 0.7, P('#8a6aa8', a))

def salon_sarrail(c, w, h, t=0, a=255, cam=0, nuit=False, lampe=True):
    """Salon bourgeois : papier peint, cheminée, horloge, fauteuil à oreilles, lampe à abat-jour."""
    mur_papier_peint(c, 0, 0, w, h * 0.72, 'losanges', a, 0.12, nuit)
    ligne(c, 0, h * 0.72, w, h * 0.72, 12, a, BRUN)
    parquet(c, 0, h * 0.72, w, h * 0.28, w * 0.5 - cam * 0.2, a, True, nuit)
    # tapis
    poly(c, [(w * 0.2, h * 0.8), (w * 0.8, h * 0.8), (w * 0.9, h * 0.98), (w * 0.1, h * 0.98)], ROUGE, 3, a, 0.3, 5)
    cadre_deco(c, w * 0.22, h * 0.815, w * 0.56, h * 0.15, OR, a * 0.7, 2)
    # horloge de parquet
    hx = w * 0.12 - cam * 0.3
    poly(c, [(hx - 40, h * 0.72), (hx - 40, h * 0.18), (hx, h * 0.12), (hx + 40, h * 0.18), (hx + 40, h * 0.72)], BRUN, 4, a, 0.3, 5)
    c.drawCircle(hx, h * 0.24, 30, P(BLANC, a)); c.drawCircle(hx, h * 0.24, 30, P(ENCRE, a, stroke=3))
    ang = t * 0.1
    ligne(c, hx, h * 0.24, hx + math.sin(ang) * 22, h * 0.24 - math.cos(ang) * 22, 2, a)
    ligne(c, hx, h * 0.24, hx + math.sin(ang / 12) * 14, h * 0.24 - math.cos(ang / 12) * 14, 3, a)
    pend = math.sin(t * 3) * 0.3
    trait(c, [(hx, h * 0.34), (hx + math.sin(pend) * 120, h * 0.34 + math.cos(pend) * 120)], 3, OR, a)
    c.drawCircle(hx + math.sin(pend) * 120, h * 0.34 + math.cos(pend) * 120, 14, P(OR, a))
    # cheminée + miroir
    mx = w * 0.62 - cam * 0.25
    poly(c, [(mx - 170, h * 0.72), (mx - 170, h * 0.48), (mx + 170, h * 0.48), (mx + 170, h * 0.72)], '#e8e0d0', 4, a)
    poly(c, [(mx - 100, h * 0.72), (mx - 100, h * 0.56), (mx + 100, h * 0.56), (mx + 100, h * 0.72)], ENCRE, 3, a)
    for k in range(3):
        fl = path_pts([(mx - 50 + k * 50, h * 0.72), (mx - 40 + k * 50 + math.sin(t * 6 + k) * 6, h * 0.6), (mx - 30 + k * 50, h * 0.72)], smooth=True)
        c.drawPath(fl, P('#e8a040', a))
    poly(c, [(mx - 130, h * 0.46), (mx - 130, h * 0.14), (mx + 130, h * 0.14), (mx + 130, h * 0.46)], '#dfe6e6', 5, a, 0.1)
    trait(c, [(mx - 90, h * 0.2), (mx - 40, h * 0.12)], 10, BLANC, a * 0.7)
    cadre_deco(c, mx - 130, h * 0.14, 260, h * 0.32, OR, a, 3)
    if lampe:
        lampe_abat_jour(c, w * 0.88 - cam * 0.35, h * 0.72, 1.0, a, nuit)

def lampe_abat_jour(c, x, sol, s=1.0, a=255, nuit=False):
    if nuit:
        c.drawCircle(x, sol - 300 * s, 260 * s, degrade_rad(x, sol - 300 * s, 260 * s, [hexc('#ffe9b0', int(110 * a / 255)), hexc('#ffe9b0', 0)]))
    trait(c, [(x, sol), (x, sol - 260 * s)], 6 * s, OR, a)
    poly(c, [(x - 60 * s, sol), (x + 60 * s, sol), (x + 20 * s, sol - 20 * s), (x - 20 * s, sol - 20 * s)], OR, 3, a)
    aj = path_pts([(x - 90 * s, sol - 250 * s), (x + 90 * s, sol - 250 * s), (x + 45 * s, sol - 340 * s), (x - 45 * s, sol - 340 * s)])
    c.drawPath(aj, P('#f2c879' if nuit else '#e8d8b0', a)); c.drawPath(aj, P(ENCRE, a, stroke=3))
    for k in range(9):
        xx = -90 * s + k * 22.5 * s
        trait(c, [(x + xx, sol - 250 * s), (x + xx, sol - 236 * s)], 2, ENCRE, a)

def fauteuil(c, x, sol, s=1.0, a=255, sens=1):
    """Fauteuil à oreilles du grand-père."""
    c.save(); c.translate(x, sol); c.scale(sens * s, s)
    poly(c, [(-110, 0), (-110, -140), (-130, -320), (-90, -360), (40, -360), (60, -320), (40, -140), (110, -140), (110, 0)], '#7a3a2a', 4, a, 0.3, 5)
    poly(c, [(-120, -120), (120, -120), (120, -60), (-120, -60)], '#8a4a3a', 4, a, 0.2, 5)
    for k in range(4):
        c.drawCircle(-90 + k * 40, -330, 4, P(OR, a))
    for xx in (-100, 100):
        trait(c, [(xx, 0), (xx, 16)], 8, ENCRE, a)
    c.restore()

def chambre_louise(c, w, h, t=0, a=255, nuit=True, cam=0, fenetre_ouverte=False, lune=True):
    """Chambre de Louise au premier étage : lit, table de chevet, fenêtre sur la glycine."""
    mur_papier_peint(c, 0, 0, w, h * 0.75, 'deco', a, 0.1, nuit)
    parquet(c, 0, h * 0.75, w, h * 0.25, w * 0.4 - cam * 0.2, a, False, nuit)
    fx, fy, fw, fh = w * 0.55 - cam * 0.4, h * 0.1, w * 0.26, h * 0.52
    c.save(); c.clipRect(rect(fx, fy, fw, fh))
    if nuit:
        ciel_nuit(c, w, h, t, 40, 9, lune=lune, horizon=0.6)
        glycine_branches(c, fx + fw * 0.2, fy + fh + 80, fx + fw * 0.9, fy - 50, t, True, a, 0.8, graine=8)
    else:
        ciel_jour(c, w, h, 0.6)
        glycine_branches(c, fx + fw * 0.2, fy + fh + 80, fx + fw * 0.9, fy - 50, t, False, a, 0.8, graine=8)
    c.restore()
    poly(c, [(fx, fy), (fx + fw, fy), (fx + fw, fy + fh), (fx, fy + fh)], None, 8, a)
    if fenetre_ouverte:
        for side in (0, 1):
            vx = fx - fw * 0.42 if side == 0 else fx + fw
            poly(c, [(vx, fy), (vx + fw * 0.42, fy + (0 if side else 10)), (vx + fw * 0.42, fy + fh - (0 if side else 10)), (vx, fy + fh)], '#cfd9de' if not nuit else '#2a3448', 4, a, 0.1)
    else:
        ligne(c, fx + fw / 2, fy, fx + fw / 2, fy + fh, 5, a)
        ligne(c, fx, fy + fh * 0.45, fx + fw, fy + fh * 0.45, 4, a)
    # rideaux
    for side in (-1, 1):
        rx = fx - 40 if side < 0 else fx + fw
        poly(c, [(rx, fy - 30), (rx + 40, fy - 30), (rx + 40 + side * 10, fy + fh + 40), (rx - side * 10, fy + fh + 40)], ROUGE, 3, a, 0.35, 5)
    poly(c, [(fx - 40, fy + fh), (fx + fw + 40, fy + fh), (fx + fw + 40, fy + fh + 20), (fx - 40, fy + fh + 20)], BLANC, 3, a)
    # lit
    lx = w * 0.06 - cam * 0.2
    poly(c, [(lx, h * 0.86), (lx + w * 0.34, h * 0.86), (lx + w * 0.34, h * 0.66), (lx, h * 0.66)], BLANC, 4, a)
    poly(c, [(lx, h * 0.7), (lx + w * 0.34, h * 0.7), (lx + w * 0.34, h * 0.78), (lx, h * 0.78)], '#c8b8d8' if not nuit else '#5a5070', 3, a, 0.2)
    poly(c, [(lx - 10, h * 0.9), (lx - 10, h * 0.48), (lx + 20, h * 0.46), (lx + 20, h * 0.9)], BRUN, 4, a, 0.3)
    # table de chevet + bougie
    tx = lx + w * 0.36
    poly(c, [(tx, h * 0.86), (tx + 90, h * 0.86), (tx + 90, h * 0.66), (tx, h * 0.66)], BRUN, 4, a, 0.3)
    ligne(c, tx + 8, h * 0.74, tx + 82, h * 0.74, 2, a)
    c.drawCircle(tx + 45, h * 0.705, 4, P(OR, a))

def studio_solange(c, w, h, t=0, a=255, cam=0):
    """Studio de danse : miroirs, barre, piano droit, parquet ciré."""
    c.drawRect(rect(0, 0, w, h * 0.7), P('#e8e2d2', a))
    for k in range(4):
        mx = k * w * 0.27 + 30 - cam * 0.3
        poly(c, [(mx, h * 0.08), (mx + w * 0.24, h * 0.08), (mx + w * 0.24, h * 0.68), (mx, h * 0.68)], '#dfe8ea', 6, a, 0.06)
        trait(c, [(mx + 40, h * 0.12), (mx + 120, h * 0.04 + h * 0.08)], 18, BLANC, a * 0.6)
        trait(c, [(mx + 80, h * 0.6), (mx + 170, h * 0.45)], 10, BLANC, a * 0.5)
    ligne(c, 0, h * 0.5, w, h * 0.5, 12, a, BRUN)
    for k in range(6):
        bx = k * w / 5 - cam * 0.3
        ligne(c, bx, h * 0.5, bx, h * 0.7, 6, a, ENCRE)
    parquet(c, 0, h * 0.7, w, h * 0.3, w * 0.5 - cam * 0.3, a, True)
    piano_droit(c, w * 0.86 - cam * 0.5, h * 0.72, 1.0, a)

def piano_droit(c, x, sol, s=1.0, a=255):
    c.save(); c.translate(x, sol); c.scale(s, s)
    poly(c, [(-150, 0), (-150, -300), (150, -300), (150, 0)], ENCRE, 3, a)
    poly(c, [(-170, -310), (170, -310), (170, -290), (-170, -290)], ENCRE, 3, a)
    poly(c, [(-150, -150), (150, -150), (150, -120), (-150, -120)], BLANC, 2, a)
    for k in range(20):
        ligne(c, -150 + k * 15, -150, -150 + k * 15, -120, 1, a)
        if k % 7 not in (2, 6):
            c.drawRect(rect(-142 + k * 15, -150, 8, 18), P(ENCRE, a))
    trait(c, [(-120, -280), (-60, -200)], 8, BLANC, a * 0.25)
    poly(c, [(-60, -300), (60, -300), (50, -360), (-50, -360)], '#efe8d8', 2, a)
    c.restore()

def studio_photo(c, w, h, t=0, a=255, cam=0):
    """Salon de pose de Julien : fond peint, portraits de mariage au mur."""
    mur_papier_peint(c, 0, 0, w, h * 0.75, 'rayures', a, 0.14)
    parquet(c, 0, h * 0.75, w, h * 0.25, w * 0.5 - cam * 0.2, a, False)
    # fond peint (colonnade et nuages)
    fx = w * 0.35 - cam * 0.5
    poly(c, [(fx, h * 0.08), (fx + w * 0.45, h * 0.08), (fx + w * 0.45, h * 0.8), (fx, h * 0.8)], '#e8e6dc', 4, a)
    c.save(); c.clipRect(rect(fx, h * 0.08, w * 0.45, h * 0.72))
    nuages(c, w, h * 0.6, 0, 0.2, 4, 6, a)
    for k in range(3):
        cx = fx + w * (0.06 + k * 0.16)
        poly(c, [(cx, h * 0.8), (cx, h * 0.3), (cx + 50, h * 0.3), (cx + 50, h * 0.8)], BLANC, 3, a, 0.15)
    c.restore()
    # cadres au mur
    for k in range(3):
        px = w * (0.04 + k * 0.1) - cam * 0.3
        poly(c, [(px, h * 0.18), (px + 120, h * 0.18), (px + 120, h * 0.34), (px, h * 0.34)], '#e0d6c0', 4, a, 0.3)
        c.drawCircle(px + 45, h * 0.24, 14, P(ENCRE, a)); c.drawCircle(px + 78, h * 0.24, 14, P(BLANC, a)); c.drawCircle(px + 78, h * 0.24, 14, P(ENCRE, a, stroke=2))

def appareil_trepied(c, x, sol, s=1.0, a=255, flash=0.0):
    c.save(); c.translate(x, sol); c.scale(s, s)
    for dx in (-80, 0, 80):
        trait(c, [(0, -260), (dx, 0)], 6, BRUN, a)
    poly(c, [(-70, -360), (70, -360), (70, -250), (-70, -250)], '#2a2624', 4, a)
    poly(c, [(70, -330), (130, -345), (130, -265), (70, -280)], '#3a3634', 3, a, 0.3)
    c.drawCircle(140, -305, 26, P('#5a5550', a)); c.drawCircle(140, -305, 26, P(ENCRE, a, stroke=3))
    trait(c, [(-40, -360), (-60, -420)], 4, ENCRE, a)
    poly(c, [(-90, -420), (-30, -420), (-40, -440), (-80, -440)], '#9a9690', 3, a)
    if flash > 0:
        c.drawCircle(-60, -440, 300 * flash, degrade_rad(-60, -440, 300 * flash, [hexc(BLANC, int(255 * flash)), hexc(BLANC, 0)]))
        lignes_vitesse(c, -60, -440, 40, 200 + 200 * flash, 24, BLANC, 3, 8, 255 * flash)
    c.restore()

# ---------------------------------------------------------------- le Cabaret des Étoiles
def enseigne_etoile(c, x, y, r, t=0, allumees=8, a=255, rouge=0.0):
    """Enseigne en fer peinte d'étoiles dorées ; l'étoile centrale peut virer au rouge."""
    for k in range(8):
        ang = -math.pi / 2 + k * math.pi / 4
        on = k < allumees
        ex, ey = x + math.cos(ang) * r * 1.25, y + math.sin(ang) * r * 1.25
        etoile(c, ex, ey, r * 0.18, 5, 0.45, OR if on else '#6a5a3a', a, trait=ENCRE, w=2)
        if on:
            c.drawCircle(ex, ey, r * 0.3, degrade_rad(ex, ey, r * 0.3, [hexc('#ffe9a0', int(80 * a / 255)), hexc('#ffe9a0', 0)]))
    col = mix(OR, ROUGE, rouge)
    if rouge > 0:
        c.drawCircle(x, y, r * 1.6, degrade_rad(x, y, r * 1.6, [hexc(ROUGE, int(110 * rouge * a / 255)), hexc(ROUGE, 0)]))
    etoile(c, x, y, r, 8, 0.42, col, a, trait=ENCRE, w=4)
    etoile(c, x, y, r * 0.55, 8, 0.42, mix(col, BLANC, 0.3), a)

def facade_cabaret(c, w, h, t=0, a=255, cam=0, allumees=8, rouge=0.0, base=None):
    """Rue des Teinturiers : ancien entrepôt de vin, porte rouge, enseigne aux étoiles dorées."""
    base = h * 0.82 if base is None else base
    facade(c, -cam * 0.4 - 80, base, w * 0.35, h * 0.8, True, a, True, porte=False, graine=3)
    facade(c, w * 0.72 - cam * 0.4, base, w * 0.4, h * 0.85, True, a, True, porte=False, graine=4)
    x0 = w * 0.3 - cam * 0.4
    fw = w * 0.44
    poly(c, [(x0, base), (x0, base - h * 0.7), (x0 + fw, base - h * 0.7), (x0 + fw, base)], '#4a3a3a', 4, a, 0.5, 5)
    for yy in range(int(base - h * 0.7 + 10), int(base), 16):
        ligne(c, x0, yy, x0 + fw, yy, 1, a * 0.3)
    # porte rouge
    px = x0 + fw / 2 - 80
    lum = path_pts([(px, base), (px + 160, base), (px + 260, h), (px - 100, h)])
    c.drawPath(lum, P('#ffd98a', 60 * a / 255))
    poly(c, [(px, base), (px, base - 260), (px + 80, base - 300), (px + 160, base - 260), (px + 160, base)], ROUGE, 5, a, 0.2, 5)
    ligne(c, px + 80, base - 290, px + 80, base, 3, a)
    c.drawCircle(px + 64, base - 120, 6, P(OR, a)); c.drawCircle(px + 96, base - 120, 6, P(OR, a))
    enseigne_etoile(c, x0 + fw / 2, base - h * 0.48, 80, t, allumees, a, rouge)
    texte(c, 'CABARET DES ÉTOILES', x0 + fw / 2, base - h * 0.62, font('titre', 46), OR, a, 'center')
    poly(c, [(x0 + 30, base - h * 0.6), (x0 + fw - 30, base - h * 0.6), (x0 + fw - 30, base - h * 0.595), (x0 + 30, base - h * 0.595)], OR, 0, a)
    # lanternes rouges
    for k in range(2):
        lx = px - 70 + k * 300
        c.drawCircle(lx, base - 240, 70, degrade_rad(lx, base - 240, 70, [hexc('#ff7a5a', int(90 * a / 255)), hexc('#ff7a5a', 0)]))
        poly(c, [(lx - 18, base - 270), (lx + 18, base - 270), (lx + 22, base - 210), (lx - 22, base - 210)], ROUGE, 3, a)
    rue_pavee(c, w, h, base, t, True, cam, a)

def salle_cabaret(c, w, h, t=0, a=255, cam=0, lumiere=1.0, public=True, scene=True, orchestre=True, piste_y=None, f=0, festif=0.0):
    """Intérieur : salle en éventail, piste ronde de parquet ciré, scène en demi-lune, lampes rouges."""
    from persos import figure, pose
    c.drawRect(rect(0, 0, w, h), P('#241c1e', a))
    soleil_deco(c, w * 0.5 - cam * 0.2, h * 0.42, 120, w * 0.9, 32, t * 0.02, '#3a2a2a', a, '#2a2022')
    # scène en demi-lune
    sx = w * 0.5 - cam * 0.3
    if scene:
        sc = skia.Path(); sc.addOval(rect(sx - w * 0.36, h * 0.28, w * 0.72, h * 0.3))
        c.save(); c.clipRect(rect(0, 0, w, h * 0.43)); c.drawPath(sc, P('#5a1a18', a)); c.restore()
        c.save(); c.clipRect(rect(0, 0, w, h * 0.43))
        for k in range(12):
            ang = math.pi + k * math.pi / 11
            ligne(c, sx, h * 0.43, sx + math.cos(ang) * w * 0.4, h * 0.43 + math.sin(ang) * h * 0.3, 2, a * 0.4, OR)
        c.restore()
        poly(c, [(sx - w * 0.36, h * 0.43), (sx + w * 0.36, h * 0.43), (sx + w * 0.36, h * 0.46), (sx - w * 0.36, h * 0.46)], OR, 2, a)
        # rideaux
        for side in (-1, 1):
            rx = sx + side * w * 0.36
            pts = [(rx, h * 0.0), (rx + side * w * 0.2, h * 0.0), (rx + side * w * 0.2, h * 0.46), (rx + side * w * 0.05, h * 0.46)]
            poly(c, pts, '#7a1a16', 3, a, 0.3, 5)
            for k in range(6):
                xx = rx + side * w * 0.03 * (k + 1)
                ligne(c, xx, 0, xx + side * 10, h * 0.46, 2, a * 0.6)
        if orchestre:
            musiciens(c, sx, h * 0.43, w * 0.6, h * 0.17, t, a, f)
    # piste ronde
    py = h * 0.72 if piste_y is None else piste_y
    piste = ovale(w * 0.5 - cam * 0.5, py, w * 0.42, h * 0.2)
    c.drawPath(piste, P('#a07040', a))
    c.save(); c.clipPath(piste, doAntiAlias=True)
    for k in range(-20, 21):
        ligne(c, w * 0.5 - cam * 0.5 + k * 40, py - h * 0.2, w * 0.5 - cam * 0.5 + k * 60, py + h * 0.2, 1.2, a * 0.4)
    c.drawPaint(trame(0.15, 5, 45, ENCRE, int(a * 0.6)))
    for k in range(4):
        trait(c, [(w * (0.3 + k * 0.12) - cam * 0.5, py - h * 0.15), (w * (0.28 + k * 0.12) - cam * 0.5, py + h * 0.15)], 26, BLANC, a * 0.18 * lumiere)
    c.restore()
    c.drawPath(piste, P(OR, a, stroke=4))
    # lampes rouges à abat-jour sur les tables
    rng = random.Random(3)
    if public:
        for k in range(9):
            tx = (k * w / 8 - cam * 0.8) % (w + 200) - 100
            ty = h * (0.58 if k % 2 else 0.95)
            c.drawCircle(tx, ty - 40, 70, degrade_rad(tx, ty - 40, 70, [hexc('#ff6a4a', int(70 * lumiere * a / 255)), hexc('#ff6a4a', 0)]))
            poly(c, [(tx - 26, ty - 30), (tx + 26, ty - 30), (tx + 14, ty - 60), (tx - 14, ty - 60)], ROUGE, 3, a)
            trait(c, [(tx, ty - 30), (tx, ty)], 4, OR, a)
            c.drawPath(ovale(tx, ty, 70, 14), P(BLANC, a)); c.drawPath(ovale(tx, ty, 70, 14), P(ENCRE, a, stroke=3))
    if festif > 0:
        serpentins(c, w, h, t, festif, a)

def musiciens(c, x, sol, w, hauteur, t, a=255, f=0, leon=True, leon_joue=True, leon_leve=0.0):
    """Le jazz-band en ombres chinoises : contrebasse, banjo, piano, batterie, saxophone… et Léon au centre."""
    from persos import figure, pose
    noms = ['contrebasse', 'banjo', 'batterie', 'leon', 'saxo', 'piano']
    for i, n in enumerate(noms):
        mx = x - w / 2 + (i + 0.5) * w / len(noms)
        bal = math.sin(t * 4 + i) * 4
        if n == 'leon':
            if leon:
                ang = lerp(-15, -55, leon_leve)
                figure(c, mx, sol, hauteur * 1.18, 'leon', pose(joue=leon_joue, trompette=ang, main_d=('trompette', ang) if leon_joue else None,
                                                                  expr='ferme' if leon_joue else 'sourire', buste=-5 - leon_leve * 10 + bal * 0.5, regard=0.3), a=a, ombre=False)
            continue
        c.save(); c.translate(mx, sol)
        sil = ENCRE
        # corps en silhouette
        c.drawPath(capsule((0, -hauteur * 0.15), (bal, -hauteur * 0.75), hauteur * 0.12, hauteur * 0.1), P(sil, a))
        c.drawCircle(bal, -hauteur * 0.86, hauteur * 0.09, P(sil, a))
        c.drawRect(rect(-hauteur * 0.07, -hauteur * 0.2, hauteur * 0.14, hauteur * 0.2), P(sil, a))
        if n == 'contrebasse':
            poly(c, [(-hauteur * 0.32, -hauteur * 0.05), (-hauteur * 0.42, -hauteur * 0.45), (-hauteur * 0.3, -hauteur * 0.62), (-hauteur * 0.15, -hauteur * 0.45), (-hauteur * 0.2, -hauteur * 0.05)], BRUN, 2, a, smooth=True)
            trait(c, [(-hauteur * 0.28, -hauteur * 0.6), (-hauteur * 0.25, -hauteur * 1.05)], 4, ENCRE, a)
        elif n == 'banjo':
            c.drawCircle(hauteur * 0.1, -hauteur * 0.42, hauteur * 0.13, P(BLANC, a)); c.drawCircle(hauteur * 0.1, -hauteur * 0.42, hauteur * 0.13, P(ENCRE, a, stroke=3))
            trait(c, [(hauteur * 0.1, -hauteur * 0.42), (hauteur * 0.45, -hauteur * 0.7)], 5, BRUN, a)
        elif n == 'batterie':
            c.drawPath(ovale(hauteur * 0.25, -hauteur * 0.15, hauteur * 0.2, hauteur * 0.15), P(BLANC, a))
            c.drawPath(ovale(hauteur * 0.25, -hauteur * 0.15, hauteur * 0.2, hauteur * 0.15), P(ENCRE, a, stroke=3))
            etoile(c, hauteur * 0.25, -hauteur * 0.15, hauteur * 0.08, 8, 0.4, ROUGE, a)
            c.drawPath(ovale(-hauteur * 0.25, -hauteur * 0.42 + abs(math.sin(t * 8)) * 6, hauteur * 0.16, hauteur * 0.03), P(OR, a))
        elif n == 'saxo':
            trait(c, [(hauteur * 0.05, -hauteur * 0.72), (hauteur * 0.12, -hauteur * 0.4), (hauteur * 0.05, -hauteur * 0.25), (hauteur * 0.2, -hauteur * 0.3)], 9, OR, a)
        elif n == 'piano':
            poly(c, [(-hauteur * 0.45, 0), (-hauteur * 0.45, -hauteur * 0.5), (hauteur * 0.1, -hauteur * 0.5), (hauteur * 0.1, 0)], ENCRE, 2, a)
            ligne(c, -hauteur * 0.45, -hauteur * 0.35, hauteur * 0.1, -hauteur * 0.35, 5, a, BLANC)
        c.restore()

def serpentins(c, w, h, t, k=1.0, a=255, graine=5):
    rng = random.Random(graine)
    cols = [ROUGE, OR, BLEU, BLANC]
    for i in range(int(40 * k)):
        x = rng.random() * w
        y = (rng.random() * h + t * (40 + rng.random() * 60)) % (h + 100) - 50
        col = cols[i % 4]
        if i % 3 == 0:
            pts = [(x + math.sin(y * 0.02 + j) * 12, y + j * 12) for j in range(6)]
            trait(c, pts, 4, col, a)
        else:
            c.save(); c.translate(x, y); c.rotate(t * 90 + i * 30)
            c.drawRect(rect(-6, -3, 12, 6), P(col, a)); c.restore()

def public_ombres(c, w, sol, t=0, a=255, n=14, graine=2, hauteur=220, cam=0, festif=False):
    """Rangée de spectateurs en ombres chinoises au premier plan."""
    rng = random.Random(graine)
    for i in range(n):
        x = (i + 0.5) * w / n + rng.uniform(-20, 20) - cam
        hh = hauteur * rng.uniform(0.85, 1.1)
        bob = math.sin(t * 3 + i) * (8 if festif else 2)
        c.drawPath(capsule((x, sol), (x, sol - hh * 0.6 + bob), hh * 0.22, hh * 0.18), P(ENCRE, a))
        c.drawCircle(x, sol - hh * 0.8 + bob, hh * 0.15, P(ENCRE, a))
        if rng.random() < 0.4:
            poly(c, [(x - hh * 0.2, sol - hh * 0.9 + bob), (x + hh * 0.2, sol - hh * 0.9 + bob), (x + hh * 0.14, sol - hh * 1.15 + bob), (x - hh * 0.14, sol - hh * 1.15 + bob)], ENCRE, 0, a)
            ligne(c, x - hh * 0.28, sol - hh * 0.9 + bob, x + hh * 0.28, sol - hh * 0.9 + bob, 5, a)
        elif rng.random() < 0.5:
            c.drawPath(ovale(x, sol - hh * 0.86 + bob, hh * 0.19, hh * 0.13), P(ENCRE, a))
            trait(c, [(x + hh * 0.1, sol - hh * 0.95 + bob), (x + hh * 0.25, sol - hh * 1.1 + bob)], 3, BLANC, a * 0.8)
        if festif and i % 3 == 0:
            trait(c, [(x + hh * 0.15, sol - hh * 0.55 + bob), (x + hh * 0.35, sol - hh * 1.1 + bob)], hh * 0.08, ENCRE, a)

# ---------------------------------------------------------------- campagne & route
def route_purpan(c, w, h, t=0, a=255, cam=0, nuit=True, brume=1.0, horizon=0.55):
    """Longue route de campagne en perspective, peupliers, brume bleue."""
    hy = h * horizon
    if nuit:
        ciel_nuit(c, w, h, t, 120, 12, lune=True, horizon=horizon)
    else:
        ciel_jour(c, w, h, horizon)
    c.drawRect(rect(0, hy, w, h - hy), P('#1c2434' if nuit else '#c8c4a8', a))
    c.drawRect(rect(0, hy, w, h - hy), trame(0.35 if nuit else 0.15, 5, 45, ENCRE, int(a)))
    vx = w * 0.5 - cam * 0.05
    route = path_pts([(vx - 10, hy), (vx + 10, hy), (w * 0.72, h), (w * 0.28, h)])
    c.drawPath(route, P('#3a4054' if nuit else '#e8dfc8', a)); c.drawPath(route, P(ENCRE, a, stroke=3))
    # peupliers
    for side in (-1, 1):
        for k in range(10):
            d = (k + (t * 0.0)) / 10
            zz = 1 / (0.12 + d * 1.6)
            px = vx + side * (30 + 260 * zz * 0.35)
            hh = 70 * zz
            if px < -100 or px > w + 100:
                continue
            base_y = hy + 12 * zz
            pth = path_pts([(px, base_y - hh * 2.4), (px + hh * 0.28, base_y - hh * 1.2), (px + hh * 0.18, base_y - hh * 0.2), (px - hh * 0.18, base_y - hh * 0.2), (px - hh * 0.28, base_y - hh * 1.2)], smooth=True)
            c.drawPath(pth, P('#0e1420' if nuit else '#4a4a3a', a))
            trait(c, [(px, base_y), (px, base_y - hh * 0.3)], max(2, hh * 0.06), ENCRE, a)
    if brume > 0:
        for k in range(3):
            yy = hy + 10 + k * 30
            c.drawRect(rect(0, yy, w, 60), degrade(0, yy, 0, yy + 60, [hexc('#9ab0d0', 0), hexc('#9ab0d0', int(70 * brume)), hexc('#9ab0d0', 0)]))

def champs_nuit(c, w, h, t=0, a=255, cam=0, horizon=0.66, gemeaux=True, ville=True):
    """Route droite entre les champs gelés, la ville au loin, grand ciel."""
    hy = h * horizon
    ciel_nuit(c, w, h, t, 260, 21, lune=False, gemeaux=gemeaux, horizon=horizon)
    if ville:
        toits_toulouse(c, w, h, hy + 5, t, cam * 0.05, True, 17, a, 0.35)
    c.drawRect(rect(0, hy, w, h - hy), P('#18202e', a))
    for k in range(12):
        yy = hy + (k / 12) ** 1.8 * (h - hy)
        ligne(c, 0, yy, w, yy, 1.2, a * 0.6, '#7a8aa8')
    for k in range(-10, 11):
        ligne(c, w / 2 + k * 20 - cam * 0.1, hy, w / 2 + k * 300 - cam * 0.6, h, 1, a * 0.35, '#9ab0d0')

def etoile_filante(c, x0, y0, x1, y1, p, a=255, couleur=ROUGE, epaisseur=10):
    """Trait de lumière de (x0, y0) vers (x1, y1) ; p = avancement 0..1."""
    if p <= 0:
        return
    hx, hy = lerp(x0, x1, p), lerp(y0, y1, p)
    q = max(0, p - 0.35)
    tx, ty = lerp(x0, x1, q), lerp(y0, y1, q)
    pth = skia.Path()
    ang = math.atan2(hy - ty, hx - tx)
    nx, ny = -math.sin(ang), math.cos(ang)
    pth.moveTo(tx, ty); pth.lineTo(hx + nx * epaisseur / 2, hy + ny * epaisseur / 2); pth.lineTo(hx - nx * epaisseur / 2, hy - ny * epaisseur / 2); pth.close()
    c.drawPath(pth, degrade(tx, ty, hx, hy, [hexc(couleur, 0), hexc(couleur, int(a))]))
    c.drawCircle(hx, hy, epaisseur * 2.5, degrade_rad(hx, hy, epaisseur * 2.5, [hexc(BLANC, int(a)), hexc(couleur, int(a * 0.6)), hexc(couleur, 0)], [0, 0.3, 1]))
    scintille(c, hx, hy, epaisseur * 2, a, BLANC, None)

def tableau_de_bord(c, w, h, heure=(0, 48), a=255, t=0):
    """Gros plan sur la montre du tableau de bord de la Mini."""
    c.drawRect(rect(0, 0, w, h), P('#3a2a1c', a))
    c.drawRect(rect(0, 0, w, h), hachures(14, 10, 2, '#5a3e2b', int(a)))
    cx, cy, r = w * 0.5, h * 0.5, min(w, h) * 0.34
    c.drawCircle(cx, cy, r * 1.15, P(OR, a)); c.drawCircle(cx, cy, r * 1.15, P(ENCRE, a, stroke=5))
    c.drawCircle(cx, cy, r, P('#f6efdc', a)); c.drawCircle(cx, cy, r, P(ENCRE, a, stroke=4))
    for k in range(12):
        ang = k * math.pi / 6
        ligne(c, cx + math.sin(ang) * r * 0.82, cy - math.cos(ang) * r * 0.82, cx + math.sin(ang) * r * 0.95, cy - math.cos(ang) * r * 0.95, 5 if k % 3 == 0 else 2.5, a)
    f = font('texte', r * 0.18)
    for k, s in ((0, 'XII'), (3, 'III'), (6, 'VI'), (9, 'IX')):
        ang = k * math.pi / 6
        texte(c, s, cx + math.sin(ang) * r * 0.66, cy - math.cos(ang) * r * 0.66 + r * 0.06, f, ENCRE, a, 'center')
    hh, mm = heure
    am = (mm / 60) * 2 * math.pi
    ah = ((hh % 12) / 12 + mm / 720) * 2 * math.pi
    trait_effile(c, [(cx, cy), (cx + math.sin(ah) * r * 0.5, cy - math.cos(ah) * r * 0.5)], r * 0.07, r * 0.03, ENCRE, a)
    trait_effile(c, [(cx, cy), (cx + math.sin(am) * r * 0.78, cy - math.cos(am) * r * 0.78)], r * 0.05, r * 0.02, ENCRE, a)
    c.drawCircle(cx, cy, r * 0.05, P(ROUGE, a))
    trait(c, [(cx - r * 0.6, cy - r * 0.5), (cx - r * 0.2, cy - r * 0.85)], r * 0.08, BLANC, a * 0.5)

def salle_a_manger(c, w, h, t=0, a=255, cam=0, nuit=True):
    """Salle à manger des Sarrail : longue table, nappe blanche, lustre, chandeliers."""
    mur_papier_peint(c, 0, 0, w, h * 0.7, 'rayures', a, 0.16, nuit)
    parquet(c, 0, h * 0.7, w, h * 0.3, w * 0.5 - cam * 0.2, a, False, nuit)
    lx = w * 0.5 - cam * 0.3
    c.drawCircle(lx, h * 0.2, 220, degrade_rad(lx, h * 0.2, 220, [hexc('#fff0c0', 90), hexc('#fff0c0', 0)]))
    trait(c, [(lx, 0), (lx, h * 0.12)], 4, OR, a)
    for k in range(7):
        ang = math.pi * (0.1 + k * 0.8 / 6)
        bx, by = lx + math.cos(ang) * 120, h * 0.14 + math.sin(ang) * 40
        trait(c, [(lx, h * 0.15), (bx, by)], 3, OR, a)
        c.drawCircle(bx, by - 14, 8, P('#fff3c8', a))
        for j in range(3):
            trait(c, [(bx, by), (bx + (j - 1) * 6, by + 30)], 1.5, BLANC, a * 0.8)
    # table
    poly(c, [(w * 0.08 - cam * 0.5, h * 0.72), (w * 0.92 - cam * 0.5, h * 0.72), (w * 0.98 - cam * 0.5, h * 0.92), (w * 0.02 - cam * 0.5, h * 0.92)], BLANC, 4, a)
    poly(c, [(w * 0.02 - cam * 0.5, h * 0.92), (w * 0.98 - cam * 0.5, h * 0.92), (w * 0.98 - cam * 0.5, h), (w * 0.02 - cam * 0.5, h)], BLANC, 4, a, 0.1)
    for k in range(6):
        ax = w * (0.15 + k * 0.14) - cam * 0.5
        c.drawPath(ovale(ax, h * 0.81, 46, 14), P('#f4f0e8', a)); c.drawPath(ovale(ax, h * 0.81, 46, 14), P(ENCRE, a, stroke=2.5))
        c.drawPath(ovale(ax, h * 0.81, 28, 8), P(ENCRE, a, stroke=1.5))
    for k in (0.3, 0.7):
        cx = w * k - cam * 0.5
        trait(c, [(cx, h * 0.8), (cx, h * 0.66)], 6, OR, a)
        for d in (-30, 0, 30):
            trait(c, [(cx, h * 0.7), (cx + d, h * 0.66), (cx + d, h * 0.6)], 4, OR, a)
            c.drawPath(ovale(cx + d, h * 0.575, 5, 11), P('#ffd060', a))

def ecole_blagnac(c, w, h, t=0, a=255, cam=0):
    """Cour de l'école de Jeanne : préau, marelle, platane, tableau noir."""
    ciel_jour(c, w, h, 0.5)
    c.drawRect(rect(0, h * 0.5, w, h * 0.5), P('#e0d6c0', a))
    c.drawRect(rect(0, h * 0.5, w, h * 0.5), trame(0.1, 6, 45, ENCRE, int(a)))
    # bâtiment
    poly(c, [(w * 0.05 - cam * 0.3, h * 0.55), (w * 0.05 - cam * 0.3, h * 0.12), (w * 0.6 - cam * 0.3, h * 0.12), (w * 0.6 - cam * 0.3, h * 0.55)], BRIQUE, 4, a, 0.25, 5)
    texte(c, 'ÉCOLE DE FILLES', w * 0.325 - cam * 0.3, h * 0.19, font('titre', 40), ENCRE, a, 'center')
    for k in range(4):
        fx = w * (0.09 + k * 0.13) - cam * 0.3
        poly(c, [(fx, h * 0.25), (fx + 80, h * 0.25), (fx + 80, h * 0.45), (fx, h * 0.45)], '#e8eef0', 3, a)
    # préau
    poly(c, [(w * 0.6 - cam * 0.3, h * 0.3), (w * 1.05, h * 0.25), (w * 1.05, h * 0.3), (w * 0.6 - cam * 0.3, h * 0.34)], '#5a5a62', 3, a, 0.4)
    for k in range(4):
        px = w * (0.64 + k * 0.12) - cam * 0.3
        ligne(c, px, h * 0.33, px, h * 0.6, 8, a, BRUN)
    # marelle
    for k in range(6):
        mx = w * 0.3 + (k % 2) * 60 - cam * 0.6
        my = h * 0.9 - k * 50
        poly(c, [(mx, my), (mx + 70, my), (mx + 60, my - 45), (mx + 8, my - 45)], None, 3, a)
        texte(c, str(k + 1), mx + 34, my - 14, font('main', 34), ENCRE, a, 'center')
    texte(c, 'CIEL', w * 0.33 - cam * 0.6, h * 0.55, font('main', 40), ENCRE, a, 'center')
    # platane
    tx = w * 0.85 - cam * 0.4
    trait_effile(c, [(tx, h * 0.62), (tx + 10, h * 0.3), (tx - 20, h * 0.05)], 40, 14, '#8a7a6a', a)
    c.drawPath(capsule((tx, h * 0.6), (tx + 10, h * 0.3), 18, 14), trame(0.3, 6, 45, ENCRE, int(a)))

def terrasse(c, w, h, t=0, a=255, cam=0):
    """Terrasse du cabaret : rambarde en fer forgé, Toulouse et la Garonne la nuit."""
    ciel_nuit(c, w, h, t, 160, 31, lune=True, horizon=0.62)
    garonne(c, w, h * 0.55, h * 0.12, t, True, cam)
    toits_toulouse(c, w, h, h * 0.56, t, cam * 0.3, True, 23, a, 0.55)
    c.drawRect(rect(0, h * 0.7, w, h * 0.3), P('#1a1416', a))
    ligne(c, 0, h * 0.7, w, h * 0.7, 10, a)
    for k in range(int(w / 70) + 1):
        x = k * 70 - (cam % 70)
        ligne(c, x, h * 0.7, x, h * 0.95, 4, a)
        c.drawPath(ovale(x + 35, h * 0.8, 22, 36), P(ENCRE, a, stroke=3))
    ligne(c, 0, h * 0.95, w, h * 0.95, 8, a)

# ---------------------------------------------------------------- les papiers d'époque (inserts fidèles aux enveloppes)
def papier(c, x, y, w, h, a=255, angle=0, couleur='#f1e7d3', cadre=None):
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(angle); c.translate(-w / 2, -h / 2)
    c.drawRect(rect(12, 14, w, h), P(ENCRE, a * 0.45))
    c.drawRect(rect(0, 0, w, h), P(couleur, a))
    if cadre:
        c.drawRect(rect(18, 18, w - 36, h - 36), P(cadre, a, stroke=3, join='miter'))
        c.drawRect(rect(26, 26, w - 52, h - 52), P(cadre, a, stroke=1.2, join='miter'))
    return c   # l'appelant dessine puis fait c.restore()

def laissez_passer(c, x, y, w, a=255, angle=-3, tampon=0.0):
    h = w * 0.66
    papier(c, x, y, w, h, a, angle, '#efe4cc', None)
    c.drawRect(rect(16, 16, w - 32, h - 32), P(BLEU, a, stroke=4, join='miter'))
    s = w / 600
    texte(c, 'ATELIERS LATÉCOÈRE', 40 * s, 70 * s, font('texte', 30 * s), BLEU, a)
    texte(c, 'Usine de Montaudran · Toulouse', 40 * s, 105 * s, font('italique', 20 * s), BLEU, a)
    texte(c, 'N° 0348', w - 40 * s, 105 * s, font('machine', 20 * s), BLEU, a, 'right')
    ligne(c, 36 * s, 118 * s, w - 36 * s, 118 * s, 2, a, BLEU)
    c.drawRect(rect(40 * s, 135 * s, 120 * s, 150 * s), P('#c8b89a', a)); c.drawRect(rect(40 * s, 135 * s, 120 * s, 150 * s), P(BLEU, a, stroke=2))
    from persos import tete
    c.save(); c.clipRect(rect(40 * s, 135 * s, 120 * s, 150 * s)); tete(c, 100 * s, 200 * s, 42 * s, 'celestin', 'neutre', 0.1, 0, a); c.restore()
    texte(c, 'LAISSEZ-PASSER', 185 * s, 158 * s, font('texte', 24 * s), BLEU, a)
    lignes = ['Nom : DELACROIX', 'Prénoms : Célestin', 'Né le 12 mars 1897 à Castres (Tarn)', 'Service : Bureau d’études', 'Emploi : Dessinateur']
    for i, l in enumerate(lignes):
        texte(c, l, 185 * s, (192 + i * 28) * s, font('machine', 19 * s), ENCRE, a)
    texte(c, 'Valable pour l’année 1925', 40 * s, h - 34 * s, font('machine', 17 * s), ENCRE, a)
    texte(c, 'C. Delacroix', w - 120 * s, h - 60 * s, font('main', 34 * s), ENCRE, a, 'center')
    if tampon > 0:
        c.save(); c.translate(w * 0.66, h * 0.42); c.rotate(-14); c.scale(lerp(1.6, 1, ease(tampon)), lerp(1.6, 1, ease(tampon)))
        aa = a * clamp(tampon * 2) * 0.85
        c.drawCircle(0, 0, 58 * s, P(ROUGE, aa, stroke=5)); c.drawCircle(0, 0, 46 * s, P(ROUGE, aa, stroke=2))
        texte(c, 'VU', 0, 10 * s, font('titre', 34 * s), ROUGE, aa, 'center')
        c.restore()
    c.restore()

def diplome(c, x, y, w, a=255, angle=2):
    h = w * 0.7
    papier(c, x, y, w, h, a, angle, '#f1e7d3', ROUGE)
    s = w / 600
    texte(c, 'RUE DES TEINTURIERS · TOULOUSE', w / 2, 70 * s, font('texte', 13 * s), ENCRE, a, 'center')
    texte(c, 'CABARET DES ÉTOILES', w / 2, 110 * s, font('titre', 40 * s), ENCRE, a, 'center')
    texte(c, 'Grande soirée des Parrains du samedi 14 décembre', w / 2, 140 * s, font('italique', 15 * s), ENCRE, a, 'center')
    texte(c, 'D I P L Ô M E', w / 2, 185 * s, font('texte', 14 * s), ENCRE, a, 'center')
    texte(c, 'de la plus belle troisième danse', w / 2, 222 * s, font('italique', 30 * s), ENCRE, a, 'center')
    texte(c, 'Monsieur Delacroix & Mademoiselle Sarrail', w / 2, 275 * s, font('main', 30 * s), ENCRE, a, 'center')
    texte(c, 'pour une danse qui n’existe pas encore.', w / 2, 310 * s, font('italique', 15 * s), ENCRE, a, 'center')
    c.drawCircle(w / 2, h - 80 * s, 30 * s, P(ROUGE, a, stroke=3)); etoile(c, w / 2, h - 80 * s, 20 * s, 5, 0.45, ROUGE, a)
    texte(c, 'Maurice', 130 * s, h - 75 * s, font('main', 26 * s), ENCRE, a, 'center')
    texte(c, 'Léon', w - 130 * s, h - 75 * s, font('main', 26 * s), ENCRE, a, 'center')
    c.restore()

def lettre_pliee(c, x, y, w, a=255, angle=-4, ouverte=0.0, lignes_visibles=1.0):
    """La lettre de Célestin. Le film ne montre jamais ce qu'elle dit : des lignes d'écriture illisibles."""
    h = w * 1.3
    papier(c, x, y, w, h * lerp(0.25, 1, ease(ouverte)), a, angle, '#f7efdf')
    if ouverte > 0.6:
        rng = random.Random(4)
        n = int(16 * lignes_visibles)
        for i in range(n):
            yy = 60 + i * (h - 120) / 16
            L = w * (0.7 + rng.random() * 0.2) if i < 15 else w * 0.4
            pts = [(50 + k * L / 24, yy + math.sin(k * 2.3 + i) * 3) for k in range(25)]
            trait(c, pts, 2.2, BLEU, a * 0.85)
    c.restore()

def plan_glycine(c, x, y, w, a=255, angle=1, avancement=1.0):
    h = w * 0.7
    papier(c, x, y, w, h, a, angle, '#f3ecdc', None)
    s = w / 620
    c.drawRect(rect(14 * s, 14 * s, w - 28 * s, h - 28 * s), P(ENCRE, a, stroke=2, join='miter'))
    k = ease(avancement)
    # façade
    poly(c, [(70 * s, 350 * s), (70 * s, 110 * s), (385 * s, 110 * s), (385 * s, 350 * s)], None, 2, a * k)
    poly(c, [(60 * s, 110 * s), (230 * s, 55 * s), (395 * s, 110 * s)], None, 2, a * k)
    for et, yy in ((1, 150 * s), (0, 260 * s)):
        for i in range(5):
            if et == 0 and i == 2:
                poly(c, [(205 * s, 350 * s), (205 * s, 285 * s), (250 * s, 285 * s), (250 * s, 350 * s)], None, 1.5, a * k)
                continue
            fx = (92 + i * 60) * s
            col = '#f2c8c8' if (et == 1 and i == 2) else None
            poly(c, [(fx, yy), (fx + 34 * s, yy), (fx + 34 * s, yy + 60 * s), (fx, yy + 60 * s)], col, 1.5, a * k)
    if avancement > 0.3:
        kk = ease(lin(avancement, 0.3, 0.8))
        pts = courbe([(262 * s, 350 * s), (258 * s, 300 * s), (266 * s, 250 * s), (258 * s, 200 * s), (262 * s, 150 * s)], 6)
        n = max(2, int(len(pts) * kk))
        trait(c, pts[:n], 6 * s, BRUN, a)
        for (yy, lab) in ((300, '600'), (250, '600'), (200, '600')):
            if kk > 0.5:
                ligne(c, 240 * s, yy * s, 285 * s, yy * s, 1.2, a, ROUGE)
                texte(c, lab, 232 * s, yy * s + 4, font('machine', 11 * s), ROUGE, a, 'right')
    if avancement > 0.7:
        kk = ease(lin(avancement, 0.7, 1.0))
        texte(c, 'Fenêtre de L. (3e à gauche, 1er étage)', 130 * s, 100 * s, font('machine', 12 * s), ROUGE, a * kk)
        c.drawRect(rect(430 * s, 160 * s, 160 * s, 50 * s), P(ROUGE, a * kk, stroke=2, join='miter'))
        texte(c, 'TROIS POINTS D’APPUI.', 510 * s, 182 * s, font('machine', 12 * s), ROUGE, a * kk, 'center')
        texte(c, 'TOUJOURS TROIS.', 510 * s, 200 * s, font('machine', 12 * s), ROUGE, a * kk, 'center')
        texte(c, 'ÉTUDE DE RÉSISTANCE — GLYCINE', 430 * s, h - 60 * s, font('machine', 12 * s), ENCRE, a * kk)
    c.restore()

def carte_lectrice(c, x, y, w, a=255, angle=4):
    h = w * 0.62
    papier(c, x, y, w, h, a, angle, '#efe4cc', None)
    s = w / 600
    c.drawRect(rect(16, 16, w - 32, h - 32), P(ROUGE, a, stroke=3, join='miter'))
    texte(c, 'BIBLIOTHÈQUE MUNICIPALE', 40 * s, 70 * s, font('texte', 26 * s), ROUGE, a)
    texte(c, 'Ville de Toulouse · Service du prêt', 40 * s, 102 * s, font('italique', 18 * s), ROUGE, a)
    texte(c, 'CARTE DE LECTRICE', 40 * s, 160 * s, font('texte', 22 * s), ENCRE, a)
    for i, l in enumerate(['Nom : SARRAIL', 'Prénoms : Louise Élisabeth', 'Née le 16 avril 1899 à Toulouse', 'Domicile : Purpan, Toulouse']):
        texte(c, l, 40 * s, (200 + i * 28) * s, font('machine', 19 * s), ENCRE, a)
    texte(c, 'L. Sarrail', w - 130 * s, h - 50 * s, font('main', 32 * s), ENCRE, a, 'center')
    c.restore()

def affiche_concours(c, x, y, w, a=255, angle=-2):
    h = w * 1.35
    papier(c, x, y, w, h, a, angle, '#f1e7d3', ROUGE)
    s = w / 500
    soleil_deco(c, w / 2, 210 * s, 40 * s, 170 * s, 20, 0, mix(PAPIER, OR, 0.4), a)
    etoile(c, w / 2, 210 * s, 46 * s, 8, 0.42, ROUGE, a)
    texte(c, 'CABARET', w / 2, 90 * s, font('titre', 44 * s), ENCRE, a, 'center')
    texte(c, 'DES ÉTOILES', w / 2, 135 * s, font('titre', 44 * s), ROUGE, a, 'center')
    texte(c, 'GRAND CONCOURS', w / 2, 345 * s, font('titre', 34 * s), ENCRE, a, 'center')
    texte(c, 'des Parrains & des Débutants', w / 2, 385 * s, font('italique', 24 * s), ENCRE, a, 'center')
    texte(c, 'SAMEDI 14 DÉCEMBRE', w / 2, 450 * s, font('machine', 26 * s), ENCRE, a, 'center')
    texte(c, 'les couples seront tirés au sort', w / 2, 495 * s, font('italique', 22 * s), ENCRE, a, 'center')
    texte(c, 'Rue des Teinturiers · Toulouse', w / 2, h - 60 * s, font('texte', 18 * s), ENCRE, a, 'center')
    c.restore()

def tirage_julien(c, x, y, w, a=255, angle=-3, developpe=1.0, contenu=None):
    """Tirage photographique « J. Mercier, photographe » ; contenu(c, w, h) dessine l'image."""
    h = w * 1.25
    papier(c, x, y, w, h, a, angle, '#e8dcc0', None)
    s = w / 400
    c.save(); c.clipRect(rect(30 * s, 30 * s, w - 60 * s, h * 0.7))
    c.drawRect(rect(30 * s, 30 * s, w - 60 * s, h * 0.7), P('#5a4a3a', a))
    if contenu:
        c.save(); c.translate(30 * s, 30 * s); contenu(c, w - 60 * s, h * 0.7); c.restore()
        c.drawRect(rect(30 * s, 30 * s, w - 60 * s, h * 0.7), P('#a07a4a', 90 * a / 255))
    c.drawRect(rect(30 * s, 30 * s, w - 60 * s, h * 0.7), P('#e8dcc0', a * (1 - ease(developpe))))
    c.restore()
    texte(c, 'J. MERCIER', w / 2, h * 0.82 + 30 * s, font('texte', 24 * s), ENCRE, a, 'center')
    texte(c, 'PHOTOGRAPHE · TOULOUSE', w / 2, h * 0.82 + 56 * s, font('texte', 12 * s), ENCRE, a, 'center')
    c.restore()

def carte_du_ciel(c, x, y, w, a=255, angle=2, t=0):
    h = w * 1.25
    papier(c, x, y, w, h, a, angle, '#f1e7d3', ROUGE)
    s = w / 500
    texte(c, 'LE CIEL DE TOULOUSE', w / 2, 70 * s, font('texte', 13 * s), ENCRE, a, 'center')
    texte(c, 'Minuit quarante-huit', w / 2, 110 * s, font('titre', 34 * s), ENCRE, a, 'center')
    cx, cy, r = w / 2, h * 0.48, w * 0.38
    c.drawCircle(cx, cy, r, P(ENCRE, a, stroke=2))
    rng = random.Random(16)
    for i in range(140):
        ang = rng.random() * 2 * math.pi; rr = math.sqrt(rng.random()) * r * 0.97
        c.drawCircle(cx + math.cos(ang) * rr, cy + math.sin(ang) * rr, rng.random() * 2.2 + 0.4, P(ENCRE, a))
    etoile_filante(c, cx + r * 0.5, cy - r * 0.5, cx - r * 0.3, cy + r * 0.2, 0.9, a, ROUGE, 4)
    texte(c, 'Et une étoile est tombée.', w / 2, h - 90 * s, font('italique', 18 * s), ENCRE, a, 'center')
    c.restore()

def invitation_reveillon(c, x, y, w, a=255, angle=-2):
    h = w * 1.4
    papier(c, x, y, w, h, a, angle, '#f1e7d3', ROUGE)
    s = w / 400
    soleil_deco(c, w / 2, 70 * s, 6 * s, 50 * s, 14, 0, ROUGE, a * 0.7)
    etoile(c, w / 2, 70 * s, 10 * s, 5, 0.45, ROUGE, a)
    texte(c, 'CABARET DES ÉTOILES', w / 2, 120 * s, font('titre', 28 * s), ENCRE, a, 'center')
    texte(c, 'Grand bal du réveillon · 31 décembre', w / 2, 150 * s, font('italique', 16 * s), ENCRE, a, 'center')
    texte(c, 'La Direction a l’honneur de convier', w / 2, 220 * s, font('texte', 16 * s), ENCRE, a, 'center')
    texte(c, 'Mademoiselle Louise Sarrail', w / 2, 262 * s, font('main', 26 * s), ENCRE, a, 'center')
    texte(c, 'au dernier bal de l’année.', w / 2, 300 * s, font('texte', 16 * s), ENCRE, a, 'center')
    c.restore()
