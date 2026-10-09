"""Moteur de rendu « La Dernière Danse » — motion design façon manga, 1920x1080, 24 i/s.

Tout est dessiné en vectoriel avec skia, image par image, puis encodé par ffmpeg.
Aucune voix : tout ce qui se dit passe par des bulles, des récitatifs et des cartons.
"""
import math, os, random, subprocess, sys
import numpy as np
import skia

W, H, FPS = 1920, 1080, 24
ICI = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- couleurs
def hexc(h, a=255):
    h = h.lstrip('#')
    return skia.Color(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

PAPIER = '#f1e7d3'
ENCRE = '#1a1512'
ROUGE = '#a8201a'
BLEU = '#1f3a5f'
BRUN = '#5a3e1b'
JAUNE = '#e3b23c'
OR = '#c9a24a'
PEAU = '#fcf5ea'
PEAU_SOMBRE = '#9b6c4c'
BLANC = '#fffaf0'
NUIT = '#141b2c'

def mix(a, b, t):
    a = a.lstrip('#'); b = b.lstrip('#')
    ca = [int(a[i:i+2], 16) for i in (0, 2, 4)]
    cb = [int(b[i:i+2], 16) for i in (0, 2, 4)]
    return '#%02x%02x%02x' % tuple(int(ca[i] + (cb[i] - ca[i]) * t) for i in range(3))

# ---------------------------------------------------------------- polices
_tf = {}
def police(nom):
    fichiers = {
        'titre': 'Limelight-Regular.ttf',
        'texte': 'BodoniModa.ttf',
        'italique': 'BodoniModa-Italic.ttf',
        'main': 'LaBelleAurore.ttf',
        'machine': 'SpecialElite-Regular.ttf',
    }
    if nom not in _tf:
        _tf[nom] = skia.Typeface.MakeFromFile(os.path.join(ICI, 'polices', fichiers[nom]))
    return _tf[nom]

def font(nom, taille):
    f = skia.Font(police(nom), taille)
    f.setEdging(skia.Font.Edging.kAntiAlias)
    f.setSubpixel(True)
    return f

# ---------------------------------------------------------------- courbes de temps
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x

def lin(t, t0, t1):
    if t1 == t0:
        return 1.0 if t >= t1 else 0.0
    return clamp((t - t0) / (t1 - t0))

def ease(x):  # douce
    x = clamp(x); return x * x * (3 - 2 * x)

def ease_out(x):
    x = clamp(x); return 1 - (1 - x) ** 3

def ease_in(x):
    x = clamp(x); return x ** 3

def back_out(x, s=1.70158):
    x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1

def elastic(x):
    x = clamp(x)
    if x in (0, 1): return x
    return 2 ** (-10 * x) * math.sin((x * 10 - 0.75) * (2 * math.pi) / 3) + 1

def lerp(a, b, t):
    return a + (b - a) * t

def env(t, t0, t1, fade=0.4):
    """0 → 1 → 0 : apparition à t0, disparition à t1."""
    return ease(lin(t, t0, t0 + fade)) * (1 - ease(lin(t, t1 - fade, t1)))

# ---------------------------------------------------------------- peinture
def P(color=ENCRE, a=255, stroke=None, cap='round', join='round', aa=True):
    p = skia.Paint(AntiAlias=aa)
    p.setColor(hexc(color, int(a)) if isinstance(color, str) else color)
    if stroke is not None:
        p.setStyle(skia.Paint.kStroke_Style)
        p.setStrokeWidth(stroke)
        p.setStrokeCap({'round': skia.Paint.kRound_Cap, 'butt': skia.Paint.kButt_Cap, 'square': skia.Paint.kSquare_Cap}[cap])
        p.setStrokeJoin({'round': skia.Paint.kRound_Join, 'miter': skia.Paint.kMiter_Join}[join])
    return p

def path_pts(pts, close=True, smooth=False):
    p = skia.Path()
    if not pts:
        return p
    if not smooth or len(pts) < 3:
        p.moveTo(*pts[0])
        for q in pts[1:]:
            p.lineTo(*q)
    else:  # Catmull-Rom → Bézier
        n = len(pts)
        rng = range(n) if close else range(n - 1)
        p.moveTo(*pts[0])
        for i in rng:
            p0 = pts[(i - 1) % n] if (close or i > 0) else pts[i]
            p1 = pts[i]; p2 = pts[(i + 1) % n]
            p3 = pts[(i + 2) % n] if (close or i + 2 < n) else p2
            c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
            c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
            p.cubicTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    if close:
        p.close()
    return p

def encre(c, path, fill=PAPIER, w=5, a=255, trait=ENCRE, fa=None):
    """Remplit puis cerne à l'encre — le geste de base du manga."""
    if fill is not None:
        c.drawPath(path, P(fill, a if fa is None else fa) if isinstance(fill, str) else fill)
    if w:
        c.drawPath(path, P(trait, a, stroke=w))

# ---------------------------------------------------------------- trames (screentones)
_trames = {}
def trame(densite=0.35, pas=9, angle=45, couleur=ENCRE, alpha=255):
    """Trame de points façon manga. densite 0..1 = taille des points."""
    cle = (round(densite, 2), pas, angle, couleur, alpha)
    if cle not in _trames:
        n = pas * 4
        s = skia.Surface(n, n)
        cc = s.getCanvas()
        cc.clear(skia.Color(0, 0, 0, 0))
        r = pas * 0.5 * math.sqrt(densite) * 1.15
        p = P(couleur, alpha)
        for i in range(-1, 6):
            for j in range(-1, 6):
                cc.drawCircle(i * pas + (j % 2) * pas / 2, j * pas, r, p)
        img = s.makeImageSnapshot()
        m = skia.Matrix(); m.setRotate(angle)
        _trames[cle] = img.makeShader(skia.TileMode.kRepeat, skia.TileMode.kRepeat, skia.SamplingOptions(skia.FilterMode.kLinear), m)
    pt = skia.Paint(AntiAlias=True)
    pt.setShader(_trames[cle])
    return pt

_hach = {}
def hachures(pas=10, angle=45, w=1.6, couleur=ENCRE, alpha=255):
    cle = (pas, angle, w, couleur, alpha)
    if cle not in _hach:
        s = skia.Surface(pas, 64)
        cc = s.getCanvas(); cc.clear(skia.Color(0, 0, 0, 0))
        cc.drawLine(pas / 2, -2, pas / 2, 66, P(couleur, alpha, stroke=w, cap='butt'))
        m = skia.Matrix(); m.setRotate(angle)
        _hach[cle] = s.makeImageSnapshot().makeShader(skia.TileMode.kRepeat, skia.TileMode.kRepeat, skia.SamplingOptions(skia.FilterMode.kLinear), m)
    pt = skia.Paint(AntiAlias=True); pt.setShader(_hach[cle])
    return pt

def degrade(x0, y0, x1, y1, couleurs, pos=None):
    p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeLinear([skia.Point(x0, y0), skia.Point(x1, y1)], [hexc(c) if isinstance(c, str) else c for c in couleurs], pos))
    return p

def degrade_rad(x, y, r, couleurs, pos=None):
    p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeRadial(skia.Point(x, y), r, [hexc(c) if isinstance(c, str) else c for c in couleurs], pos))
    return p

def trame_degradee(c, rect, haut=0.0, bas=0.5, pas=9, couleur=ENCRE, bandes=10):
    """Trame dont la densité varie verticalement (ciels, ombres portées)."""
    x, y, w, h = rect
    for i in range(bandes):
        d = lerp(haut, bas, (i + 0.5) / bandes)
        if d <= 0.01:
            continue
        c.drawRect(skia.Rect.MakeXYWH(x, y + h * i / bandes, w, h / bandes + 1), trame(d, pas, 45, couleur))

# ---------------------------------------------------------------- papier & grain
_papier = None
_grains = []
def _prepare_papier():
    global _papier, _grains
    rng = np.random.default_rng(1925)
    base = np.array([0xf1, 0xe7, 0xd3], np.float32)
    bruit = rng.normal(0, 1, (H // 4, W // 4)).astype(np.float32)
    from PIL import Image, ImageFilter
    b = Image.fromarray(((bruit * 30) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
    bb = (np.asarray(b, np.float32) - 128) / 128.0
    fin = rng.normal(0, 1, (H, W)).astype(np.float32)
    v = base[None, None, :] + bb[..., None] * 7 + fin[..., None] * 3
    # vignettage léger
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    v *= (1 - 0.10 * np.clip(d - 0.55, 0, 1))[..., None]
    v = v.clip(0, 255).astype(np.uint8)
    bgra = np.dstack([v[..., 2], v[..., 1], v[..., 0], np.full((H, W), 255, np.uint8)])
    _papier = skia.Image.fromarray(bgra, colorType=skia.ColorType.kBGRA_8888_ColorType)
    for k in range(6):
        g = rng.normal(0, 1, (H // 2, W // 2))
        a = (np.clip(np.abs(g) - 1.6, 0, 3) * 40).astype(np.uint8)
        z = np.zeros_like(a)
        arr = np.dstack([z + 26, z + 21, z + 18, a])
        # quelques rayures de pellicule
        for _ in range(rng.integers(0, 3)):
            xs = rng.integers(0, W // 2)
            arr[:, xs:xs + 1, 3] = np.maximum(arr[:, xs:xs + 1, 3], rng.integers(10, 30))
        _grains.append(skia.Image.fromarray(np.ascontiguousarray(arr), colorType=skia.ColorType.kBGRA_8888_ColorType))

def fond_papier(c, ton=None):
    if _papier is None:
        _prepare_papier()
    c.drawImage(_papier, 0, 0)
    if ton:
        c.drawRect(skia.Rect.MakeWH(W, H), P(ton[0], ton[1]))

def grain(c, f, force=1.0):
    if not _grains:
        _prepare_papier()
    p = skia.Paint(); p.setAlphaf(0.55 * force)
    c.save(); c.scale(2, 2)
    c.drawImage(_grains[f % len(_grains)], (f * 37) % 7 - 3, (f * 53) % 5 - 2, skia.SamplingOptions(), p)
    c.restore()

# ---------------------------------------------------------------- effets manga
def lignes_vitesse(c, cx, cy, r_in, r_out, n=90, couleur=ENCRE, graine=0, epaisseur=7, a=255, rect=None):
    """Lignes de concentration (focus lines) autour d'un point."""
    rng = random.Random(graine)
    p = P(couleur, a)
    for i in range(n):
        ang = (i + rng.random() * 0.8) / n * 2 * math.pi
        r0 = r_in * (0.85 + rng.random() * 0.5)
        e = epaisseur * (0.4 + rng.random())
        dx, dy = math.cos(ang), math.sin(ang)
        nx, ny = -dy, dx
        pth = skia.Path()
        pth.moveTo(cx + dx * r0, cy + dy * r0)
        pth.lineTo(cx + dx * r_out + nx * e, cy + dy * r_out + ny * e)
        pth.lineTo(cx + dx * r_out - nx * e, cy + dy * r_out - ny * e)
        pth.close()
        c.drawPath(pth, p)

def lignes_paralleles(c, rect, angle=0, n=40, graine=0, couleur=ENCRE, a=200, decal=0.0):
    """Lignes de vitesse parallèles (mouvement)."""
    rng = random.Random(graine)
    x, y, w, h = rect
    c.save(); c.clipRect(skia.Rect.MakeXYWH(x, y, w, h))
    c.translate(x + w / 2, y + h / 2); c.rotate(angle)
    L = math.hypot(w, h)
    for i in range(n):
        yy = (rng.random() - 0.5) * L
        ln = L * (0.2 + rng.random() * 0.6)
        xx = ((rng.random() - 0.5) * L + decal * L * 2) % (L * 1.5) - L * 0.75
        e = 1 + rng.random() * 4
        pth = skia.Path(); pth.moveTo(xx - ln / 2, yy); pth.lineTo(xx + ln / 2, yy - e / 2); pth.lineTo(xx + ln / 2, yy + e / 2); pth.close()
        c.drawPath(pth, P(couleur, a))
    c.restore()

def etoile(c, x, y, r, branches=8, interne=0.42, couleur=ROUGE, a=255, rot=0, trait=None, w=3):
    pts = []
    for i in range(branches * 2):
        ang = math.radians(rot) - math.pi / 2 + i * math.pi / branches
        rr = r if i % 2 == 0 else r * interne
        pts.append((x + math.cos(ang) * rr, y + math.sin(ang) * rr))
    pth = path_pts(pts)
    c.drawPath(pth, P(couleur, a))
    if trait:
        c.drawPath(pth, P(trait, a, stroke=w))

def scintille(c, x, y, r, a=255, couleur=BLANC, trait=ENCRE):
    """Petite étincelle shōjo à 4 branches."""
    pts = []
    for i in range(8):
        ang = i * math.pi / 4
        rr = r if i % 2 == 0 else r * 0.18
        pts.append((x + math.cos(ang) * rr, y + math.sin(ang) * rr))
    pth = path_pts(pts)
    c.drawPath(pth, P(couleur, a))
    if trait:
        c.drawPath(pth, P(trait, a, stroke=max(1.2, r * 0.08)))

def bulles_shojo(c, rect, t, n=26, graine=3, a=255):
    """Fond « fleurs et bulles » des moments romantiques."""
    rng = random.Random(graine)
    x, y, w, h = rect
    for i in range(n):
        bx = x + rng.random() * w
        by = y + ((rng.random() * h - t * (20 + rng.random() * 40)) % h)
        r = 8 + rng.random() * 34
        aa = a * (0.4 + 0.6 * abs(math.sin(t * 1.3 + i)))
        c.drawCircle(bx, by, r, P(BLANC, aa * 0.5))
        c.drawCircle(bx, by, r, P(ENCRE, aa * 0.55, stroke=1.6))
        c.drawCircle(bx - r * 0.35, by - r * 0.35, r * 0.18, P(BLANC, aa))
    for i in range(n // 2):
        sx = x + rng.random() * w; sy = y + rng.random() * h
        scintille(c, sx, sy, 8 + rng.random() * 18, a * abs(math.sin(t * 2.1 + i * 1.7)))

def soleil_deco(c, cx, cy, r_in, r_out, n=24, t=0, couleur=OR, a=255, alt=None):
    """Soleil rayonnant art déco (éventail de rayons)."""
    for i in range(n):
        ang = i / n * 2 * math.pi + t
        da = math.pi / n * 0.55
        pts = [(cx + math.cos(ang - da * 0.25) * r_in, cy + math.sin(ang - da * 0.25) * r_in),
               (cx + math.cos(ang - da) * r_out, cy + math.sin(ang - da) * r_out),
               (cx + math.cos(ang + da) * r_out, cy + math.sin(ang + da) * r_out),
               (cx + math.cos(ang + da * 0.25) * r_in, cy + math.sin(ang + da * 0.25) * r_in)]
        col = couleur if (alt is None or i % 2 == 0) else alt
        c.drawPath(path_pts(pts), P(col, a))

def onomatopee(c, texte, x, y, taille=90, angle=-8, couleur=ENCRE, contour=PAPIER, a=255, ech=1.0):
    """SFX dessinés en lettres art déco, avec contour blanc épais."""
    f = font('titre', taille)
    w = f.measureText(texte)
    c.save(); c.translate(x, y); c.rotate(angle); c.scale(ech, ech)
    tb = skia.TextBlob.MakeFromString(texte, f)
    if contour:
        c.drawTextBlob(tb, -w / 2, taille * 0.35, P(contour, a, stroke=taille * 0.16))
    c.drawTextBlob(tb, -w / 2, taille * 0.35, P(couleur, a))
    c.restore()

# ---------------------------------------------------------------- texte
def mesure(texte, f):
    return f.measureText(texte)

def couper(texte, f, largeur):
    lignes = []
    for para in texte.split('\n'):
        mots = para.split(' ')
        cur = ''
        for m in mots:
            essai = (cur + ' ' + m).strip()
            if f.measureText(essai) <= largeur or not cur:
                cur = essai
            else:
                lignes.append(cur); cur = m
        lignes.append(cur)
    return lignes

def texte(c, s, x, y, f, couleur=ENCRE, a=255, align='left', visible=None):
    """Écrit une ligne. visible = nombre de caractères affichés (effet machine à écrire)."""
    if visible is not None:
        s = s[:max(0, int(visible))]
    if not s:
        return
    w = f.measureText(s)
    if align == 'center':
        x -= w / 2
    elif align == 'right':
        x -= w
    c.drawString(s, x, y, f, P(couleur, a))

def paragraphe(c, s, x, y, f, largeur, interligne=1.3, couleur=ENCRE, a=255, align='left', visible=None):
    lignes = couper(s, f, largeur)
    reste = visible
    h = f.getSize() * interligne
    for i, l in enumerate(lignes):
        v = None
        if reste is not None:
            v = reste; reste -= len(l) + 1
        texte(c, l, x, y + i * h, f, couleur, a, align, v)
    return len(lignes) * h

def duree_lecture(s, base=1.6, cps=12.0):
    """Temps de lecture confortable (≈ 12 caractères par seconde)."""
    return base + len(s) / cps

# ---------------------------------------------------------------- bulles & récitatifs
def bulle(c, s, x, y, largeur=520, queue=None, a=255, apparition=1.0, taille=40, style='parole',
          nom='texte', couleur=ENCRE, fond=BLANC, visible=None, ancre='centre'):
    """Bulle de manga. (x, y) = centre (ou coin haut-gauche si ancre='coin').
    queue = (qx, qy) pointe vers le locuteur. style : parole | pensee | cri | murmure."""
    if a <= 0 or apparition <= 0:
        return
    f = font(nom, taille)
    lignes = couper(s, f, largeur - taille * 1.4)
    lh = taille * 1.28
    tw = max(f.measureText(l) for l in lignes)
    bw = tw + taille * 1.8
    bh = len(lignes) * lh + taille * 1.1
    if ancre == 'coin':
        x += bw / 2; y += bh / 2
    s_ = back_out(apparition, 2.2) if apparition < 1 else 1.0
    c.save(); c.translate(x, y); c.scale(s_, s_)
    rx, ry = bw / 2, bh / 2
    if style == 'cri':
        pts = []
        rng = random.Random(len(s))
        n = 26
        for i in range(n):
            ang = i / n * 2 * math.pi
            k = 1.22 if i % 2 == 0 else 0.98
            k += rng.random() * 0.08
            pts.append((math.cos(ang) * rx * k, math.sin(ang) * ry * k))
        corps = path_pts(pts)
    else:
        corps = skia.Path(); corps.addOval(skia.Rect.MakeXYWH(-rx * 1.06, -ry * 1.1, rx * 2.12, ry * 2.2))
    if queue and style != 'pensee':
        qx, qy = queue[0] - x, queue[1] - y
        ang = math.atan2(qy, qx)
        base = 0.28
        b1 = (math.cos(ang - base) * rx * 0.85, math.sin(ang - base) * ry * 0.85)
        b2 = (math.cos(ang + base) * rx * 0.85, math.sin(ang + base) * ry * 0.85)
        q = skia.Path(); q.moveTo(*b1)
        q.quadTo((b1[0] + qx) / 2, (b1[1] + qy) / 2 + 4, qx, qy)
        q.quadTo((b2[0] + qx) / 2, (b2[1] + qy) / 2, *b2); q.close()
        corps = skia.Op(corps, q, skia.PathOp.kUnion_PathOp) or corps
    if style == 'pensee' and queue:
        qx, qy = queue[0] - x, queue[1] - y
        for k, rr in ((0.62, 13), (0.80, 9), (0.93, 6)):
            cx, cy = qx * k, qy * k
            c.drawCircle(cx, cy, rr, P(fond, a)); c.drawCircle(cx, cy, rr, P(ENCRE, a, stroke=3))
    c.drawPath(corps, P(fond, a))
    if style == 'murmure':
        eff = skia.DashPathEffect.Make([14, 9], 0)
        pp = P(ENCRE, a, stroke=3.5); pp.setPathEffect(eff)
        c.drawPath(corps, pp)
    else:
        c.drawPath(corps, P(ENCRE, a, stroke=4.5 if style != 'cri' else 5.5))
    reste = visible
    y0 = -bh / 2 + taille * 0.55 + taille * 0.82
    for i, l in enumerate(lignes):
        v = None
        if reste is not None:
            v = reste; reste -= len(l) + 1
        texte(c, l, 0, y0 + i * lh, f, couleur, a, 'center', v)
    c.restore()
    return bw, bh

def recitatif(c, s, x, y, largeur=760, a=255, taille=36, nom='italique', visible=None, fond=PAPIER, couleur=ENCRE, cadre=ENCRE):
    """Cartouche narratif rectangulaire (la « voix off » écrite)."""
    if a <= 0:
        return
    f = font(nom, taille)
    lignes = couper(s, f, largeur - 60)
    lh = taille * 1.3
    bh = len(lignes) * lh + 44
    bw = largeur
    r = skia.Rect.MakeXYWH(x, y, bw, bh)
    c.drawRect(skia.Rect.MakeXYWH(x + 8, y + 8, bw, bh), P(ENCRE, a * 0.85))
    c.drawRect(r, P(fond, a))
    c.drawRect(r, P(cadre, a, stroke=3.5, join='miter'))
    c.drawRect(skia.Rect.MakeXYWH(x + 7, y + 7, bw - 14, bh - 14), P(cadre, a * 0.6, stroke=1.2, join='miter'))
    reste = visible
    for i, l in enumerate(lignes):
        v = None
        if reste is not None:
            v = reste; reste -= len(l) + 1
        texte(c, l, x + 30, y + 22 + taille * 0.95 + i * lh, f, couleur, a, 'left', v)
    return bw, bh

def ecriture(t, t0, s, cps=34):
    """Nombre de caractères visibles d'un texte qui s'écrit à partir de t0."""
    return max(0, (t - t0) * cps)

# ---------------------------------------------------------------- cases (panels)
class Case:
    def __init__(self, x, y, w, h, bord=7):
        self.x, self.y, self.w, self.h, self.bord = x, y, w, h, bord

    def rect(self):
        return skia.Rect.MakeXYWH(self.x, self.y, self.w, self.h)

def case(c, rect, dessin, t=0, entree=1.0, sens='droite', bord=7, fond=PAPIER, ombre=True, biais=None):
    """Dessine une case de manga : clip, contenu, cadre épais. entree 0..1 = glissement d'arrivée.
    biais = décalages des 4 coins pour des cases obliques."""
    if entree <= 0:
        return
    x, y, w, h = rect
    e = ease_out(entree)
    dx = dy = 0
    d = 260 * (1 - e)
    if sens == 'droite': dx = d
    elif sens == 'gauche': dx = -d
    elif sens == 'haut': dy = -d
    elif sens == 'bas': dy = d
    c.save()
    c.translate(dx, dy)
    if biais:
        pts = [(x + biais[0][0], y + biais[0][1]), (x + w + biais[1][0], y + biais[1][1]),
               (x + w + biais[2][0], y + h + biais[2][1]), (x + biais[3][0], y + h + biais[3][1])]
        forme = path_pts(pts)
    else:
        forme = skia.Path(); forme.addRect(skia.Rect.MakeXYWH(x, y, w, h))
    a = 255 * clamp(entree * 3)
    if ombre:
        c.save(); c.translate(10, 10); c.drawPath(forme, P(ENCRE, a * 0.9)); c.restore()
    c.save(); c.clipPath(forme, doAntiAlias=True)
    c.drawPath(forme, P(fond))
    c.translate(x, y)
    dessin(c, w, h)
    c.restore()
    c.drawPath(forme, P(ENCRE, a, stroke=bord, join='miter'))
    c.restore()

# ---------------------------------------------------------------- cartons & transitions
def iris(c, t, cx=W / 2, cy=H / 2, ouvert=1.0):
    """Fermeture à l'iris (vieux cinéma). ouvert 0 = noir complet."""
    if ouvert >= 1:
        return
    r = math.hypot(W, H) * 0.6 * ease(ouvert)
    pth = skia.Path(); pth.addRect(skia.Rect.MakeWH(W, H))
    trou = skia.Path(); trou.addCircle(cx, cy, max(r, 0.1))
    pth = skia.Op(pth, trou, skia.PathOp.kDifference_PathOp)
    c.drawPath(pth, P(ENCRE))

def cadre_deco(c, x, y, w, h, couleur=OR, a=255, epais=4):
    """Encadrement art déco à coins à gradins."""
    p = P(couleur, a, stroke=epais, join='miter')
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), p)
    c.drawRect(skia.Rect.MakeXYWH(x + 14, y + 14, w - 28, h - 28), P(couleur, a, stroke=1.5, join='miter'))
    for (cx, cy, sx, sy) in ((x, y, 1, 1), (x + w, y, -1, 1), (x, y + h, 1, -1), (x + w, y + h, -1, -1)):
        for k in range(3):
            o = 24 + k * 14
            pth = skia.Path(); pth.moveTo(cx + sx * o, cy + sy * 14); pth.lineTo(cx + sx * o, cy + sy * o); pth.lineTo(cx + sx * 14, cy + sy * o)
            c.drawPath(pth, P(couleur, a, stroke=2, join='miter'))
        etoile(c, cx + sx * 34, cy + sy * 34, 9, 4, 0.3, couleur, a)

def carton(c, t, titre, sous=None, duree=4.0, f=0, style='chapitre'):
    """Intertitre plein écran, fond encre, lettres or (Limelight)."""
    a = 255 * env(t, 0, duree, 0.5)
    c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE))
    soleil_deco(c, W / 2, H / 2, 120, 900, 36, t * 0.03, mix(ENCRE, OR, 0.12), 255 * env(t, 0, duree, 0.8))
    cadre_deco(c, 150, 120, W - 300, H - 240, OR, a)
    if style == 'chapitre':
        etoile(c, W / 2, H / 2 - 150, 34, 8, 0.42, ROUGE, a)
        texte(c, titre, W / 2, H / 2 + 20, font('titre', 92), OR, a, 'center')
        if sous:
            paragraphe(c, sous, W / 2, H / 2 + 110, font('italique', 42), 1200, 1.3, PAPIER, a, 'center')
    else:
        paragraphe(c, titre, W / 2, H / 2 - 20, font('texte', 54), 1300, 1.35, PAPIER, a, 'center')

# ---------------------------------------------------------------- rendu
class Plan:
    """Un plan = une durée + une fonction dessin(c, t, f) où t est le temps local en secondes.
    entree / sortie = (type, durée) avec type 'fondu' (papier), 'noir', 'blanc' ou 'iris'."""
    def __init__(self, duree, dessin, nom='', entree=None, sortie=None):
        self.duree, self.dessin, self.nom = duree, dessin, nom
        self.entree, self.sortie = entree, sortie

def _transition(c, typ, k):
    """k = 1 : complètement masqué ; 0 : rien."""
    if k <= 0:
        return
    if typ == 'fondu':
        if _papier is None: _prepare_papier()
        pt = skia.Paint(); pt.setAlphaf(clamp(k))
        c.drawImage(_papier, 0, 0, skia.SamplingOptions(), pt)
    elif typ == 'noir':
        c.drawRect(skia.Rect.MakeWH(W, H), P(ENCRE, 255 * clamp(k)))
    elif typ == 'blanc':
        c.drawRect(skia.Rect.MakeWH(W, H), P(BLANC, 255 * clamp(k)))
    elif typ == 'iris':
        iris(c, 0, ouvert=1 - clamp(k))

def duree_totale(plans):
    return sum(p.duree for p in plans)

def rendre(plans, sortie, debut=0.0, fin=None, apercu_png=None, crf=21, grain_force=1.0, fondu=0.0):
    """Rend la liste de plans en MP4 (ou une image PNG si apercu_png = temps)."""
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    total = duree_totale(plans)
    if apercu_png is not None:
        _dessiner(c, plans, apercu_png, int(apercu_png * FPS), grain_force)
        surf.makeImageSnapshot().save(sortie, skia.kPNG)
        return
    fin = total if fin is None else min(fin, total)
    n = int(round((fin - debut) * FPS))
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-tune', 'animation', '-movflags', '+faststart', sortie]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        tg = debut + i / FPS
        _dessiner(c, plans, tg, int(round(tg * FPS)), grain_force)
        pr.stdin.write(surf.makeImageSnapshot().toarray().tobytes())
        if i % (FPS * 10) == 0:
            print(f'  {os.path.basename(sortie)} {tg:6.1f}/{fin:.1f} s', flush=True)
    pr.stdin.close(); pr.wait()

def _dessiner(c, plans, tg, f, grain_force):
    acc = 0.0
    for k, p in enumerate(plans):
        if tg < acc + p.duree or k == len(plans) - 1:
            c.save()
            fond_papier(c)
            tl = tg - acc
            p.dessin(c, tl, f)
            c.restore()
            if p.entree and tl < p.entree[1]:
                _transition(c, p.entree[0], 1 - ease(tl / p.entree[1]))
            if p.sortie and tl > p.duree - p.sortie[1]:
                _transition(c, p.sortie[0], ease((tl - (p.duree - p.sortie[1])) / p.sortie[1]))
            break
        acc += p.duree
    grain(c, f, grain_force)

def note_musique(c, x, y, s=40, double=False, a=255, couleur=ENCRE, angle=-10, contour=PAPIER):
    """Note de musique dessinée (le film est muet : la musique se voit)."""
    c.save(); c.translate(x, y); c.rotate(angle)
    def _forme():
        p = skia.Path()
        p.addOval(skia.Rect.MakeXYWH(-s * 0.32, -s * 0.2, s * 0.5, s * 0.36))
        q = skia.Path(); q.addRect(skia.Rect.MakeXYWH(s * 0.1, -s * 1.1, s * 0.08, s * 1.05)); p = skia.Op(p, q, skia.PathOp.kUnion_PathOp) or p
        if double:
            p2 = skia.Path(); p2.addOval(skia.Rect.MakeXYWH(s * 0.38, -s * 0.38, s * 0.5, s * 0.36)); p = skia.Op(p, p2, skia.PathOp.kUnion_PathOp) or p
            q2 = skia.Path(); q2.addRect(skia.Rect.MakeXYWH(s * 0.8, -s * 1.28, s * 0.08, s * 1.05)); p = skia.Op(p, q2, skia.PathOp.kUnion_PathOp) or p
            b = skia.Path(); b.moveTo(s * 0.1, -s * 1.1); b.lineTo(s * 0.88, -s * 1.28); b.lineTo(s * 0.88, -s * 1.08); b.lineTo(s * 0.1, -s * 0.9); b.close()
            p = skia.Op(p, b, skia.PathOp.kUnion_PathOp) or p
        else:
            f = skia.Path(); f.moveTo(s * 0.18, -s * 1.1); f.cubicTo(s * 0.5, -s * 0.9, s * 0.6, -s * 0.7, s * 0.42, -s * 0.45)
            f.cubicTo(s * 0.48, -s * 0.72, s * 0.35, -s * 0.85, s * 0.18, -s * 0.9); f.close()
            p = skia.Op(p, f, skia.PathOp.kUnion_PathOp) or p
        return p
    p = _forme()
    if contour:
        c.drawPath(p, P(contour, a, stroke=s * 0.16))
    c.drawPath(p, P(couleur, a))
    c.restore()

def notes_qui_montent(c, t, x, y, n=3, s=44, a=255, couleur=ENCRE, vitesse=0.5, amplitude=160, graine=0, contour=PAPIER):
    """Quelques notes qui s'échappent et montent en ondulant."""
    for k in range(n):
        ph = (t * vitesse + k / n + graine * 0.13) % 1
        al = a * env(ph, 0, 1, 0.25)
        note_musique(c, x + ph * amplitude * 0.8 + math.sin(ph * 6 + k) * 20, y - ph * amplitude, s * (0.8 + 0.3 * (k % 2)), k % 2 == 1, al, couleur, -15 + k * 12, contour)
