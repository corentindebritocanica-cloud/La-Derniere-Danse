"""Outils de mise en scène communs à toutes les séquences."""
import math, random
import skia
from moteur import *
from persos import *
from decors import *

# ---------------------------------------------------------------- caméra
class Camera:
    """Transformation de caméra : zoom autour d'un point + panoramique, avec easing."""
    def __init__(self, c):
        self.c = c
    def __enter__(self):
        return self
    def __exit__(self, *a):
        self.c.restore()

def camera(c, t, duree, z0=1.0, z1=1.0, cx=W / 2, cy=H / 2, dx0=0, dx1=0, dy0=0, dy1=0, courbe=ease, secousse=0.0):
    k = courbe(clamp(t / duree)) if duree > 0 else 1
    z = lerp(z0, z1, k)
    dx = lerp(dx0, dx1, k); dy = lerp(dy0, dy1, k)
    if secousse:
        dx += math.sin(t * 47) * secousse; dy += math.cos(t * 39) * secousse
    c.save()
    c.translate(cx + dx, cy + dy); c.scale(z, z); c.translate(-cx, -cy)
    return Camera(c)

# ---------------------------------------------------------------- vie des personnages
def cligne(t, graine=0, periode=3.7):
    ph = (t + graine * 1.37) % periode
    return 1.0 if ph < 0.12 else 0.0

def parle(t, t0, t1):
    """Ouverture de bouche pendant qu'une réplique s'écrit (le film n'a pas de voix : seulement la bouche qui bouge)."""
    if t0 <= t <= t1:
        return 0.55 + 0.45 * math.sin(t * 15)
    return 0.0

def respire(t, graine=0, amp=1.0):
    return math.sin(t * 2.2 + graine) * amp

# ---------------------------------------------------------------- textes
def B(t0, dur, s, x, y, queue=None, style='parole', largeur=560, taille=38, nom='texte', cps=26):
    """Raccourci de bulle. dur = durée d'affichage (None → temps de lecture)."""
    if dur is None:
        dur = duree_lecture(s) + 0.6
    return dict(t0=t0, t1=t0 + dur, s=s, x=x, y=y, queue=queue, style=style, largeur=largeur, taille=taille, nom=nom, cps=cps)

def dessiner_bulles(c, t, liste):
    for b in liste:
        if b['t0'] <= t <= b['t1']:
            ap = clamp((t - b['t0']) / 0.28)
            a = 255 * (1 - ease(lin(t, b['t1'] - 0.3, b['t1'])))
            vis = ecriture(t, b['t0'] + 0.12, b['s'], b['cps'])
            bulle(c, b['s'], b['x'], b['y'], b['largeur'], b['queue'], a, ap, b['taille'], b['style'], b['nom'], visible=vis)

def R_(t0, dur, s, x, y, largeur=780, taille=36, nom='italique', cps=30):
    if dur is None:
        dur = duree_lecture(s) + 0.8
    return dict(t0=t0, t1=t0 + dur, s=s, x=x, y=y, largeur=largeur, taille=taille, nom=nom, cps=cps)

def dessiner_recits(c, t, liste):
    for r in liste:
        if r['t0'] <= t <= r['t1']:
            a = 255 * env(t, r['t0'], r['t1'], 0.35)
            recitatif(c, r['s'], r['x'], r['y'], r['largeur'], a, r['taille'], r['nom'], visible=ecriture(t, r['t0'] + 0.15, r['s'], r['cps']))

def fin_textes(liste, marge=0.6):
    return max(b['t1'] for b in liste) + marge

def sous_titre_lieu(c, t, s, t0=0.3, t1=3.5, x=60, y=60):
    """Petit cartouche « Lieu — moment » en machine à écrire, en haut à gauche."""
    a = 255 * env(t, t0, t1, 0.4)
    if a <= 0:
        return
    f = font('machine', 30)
    w = f.measureText(s) + 50
    c.drawRect(skia.Rect.MakeXYWH(x + 6, y + 6, w, 54), P(ENCRE, a * 0.8))
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, 54), P(PAPIER, a))
    c.drawRect(skia.Rect.MakeXYWH(x, y, w, 54), P(ENCRE, a, stroke=3))
    texte(c, s, x + 25, y + 37, f, ENCRE, a, 'left', visible=ecriture(t, t0 + 0.1, s, 40))

def plein_ecran(dessin):
    """Adapte un décor dessiné dans (w, h) au plein écran."""
    def d(c, t, *a, **k):
        return dessin(c, W, H, t, *a, **k)
    return d

def bandes_cinema(c, k=1.0):
    """Bandes noires (format cinéma) pour les plans solennels."""
    if k <= 0:
        return
    hh = 90 * ease(k)
    c.drawRect(skia.Rect.MakeXYWH(0, 0, W, hh), P(ENCRE))
    c.drawRect(skia.Rect.MakeXYWH(0, H - hh, W, hh), P(ENCRE))

def gros_plan(c, t, nom, expr='neutre', regard=0.0, x=W / 2, y=H / 2 + 60, R=330, fond='lignes', graine=0, rougir=0, oeil=(0, 0), incl=0, parle_=0, a=255, clign=None, couleur_fond=None):
    """Gros plan de visage façon manga, sur fond de lignes de vitesse, de trame ou de bulles shōjo."""
    if fond == 'lignes':
        lignes_vitesse(c, x, y, R * 1.25, 1600, 110, ENCRE, graine + int(t * 6) % 3, 9)
    elif fond == 'shojo':
        c.drawRect(skia.Rect.MakeWH(W, H), P(couleur_fond or '#f6eee0'))
        bulles_shojo(c, (0, 0, W, H), t, 30, graine)
    elif fond == 'trame':
        c.drawRect(skia.Rect.MakeWH(W, H), trame(0.25, 6, 45, ENCRE))
    elif fond == 'noir':
        c.drawRect(skia.Rect.MakeWH(W, H), P(couleur_fond or ENCRE))
    elif fond == 'soleil':
        c.drawRect(skia.Rect.MakeWH(W, H), P(couleur_fond or ENCRE))
        soleil_deco(c, x, y, R * 0.8, 1800, 28, t * 0.05, OR, 140)
    # épaules suggérées
    s = PERSOS[nom]
    epaule = path_pts([(x - R * 1.7, H + 50), (x - R * 1.35, y + R * 1.45), (x - R * 0.35, y + R * 1.1), (x + R * 0.35, y + R * 1.1), (x + R * 1.35, y + R * 1.45), (x + R * 1.7, H + 50)], smooth=True)
    col = s.get('c_haut', BLANC)
    if s['haut'] == 'chemise_gilet':
        col = 'gris2'
    etoffe(c, epaule, col, R * 0.04, a)
    cou = capsule((x, y + R * 0.9), (x, y + R * 1.2), R * 0.3, R * 0.33)
    encre(c, cou, s['peau'], R * 0.04, a)
    if s.get('noeud'):
        for side in (-1, 1):
            encre(c, path_pts([(x, y + R * 1.25), (x + side * R * 0.35, y + R * 1.1), (x + side * R * 0.35, y + R * 1.42)]), s['noeud'], R * 0.03, a)
    if s.get('collier'):
        for k in range(9):
            ang = math.pi * (0.15 + k * 0.7 / 8)
            etoile(c, x + math.cos(ang) * R * 0.45, y + R * 0.95 + math.sin(ang) * R * 0.3, R * 0.06, 5, 0.45, OR, a)
    tete(c, x, y, R, nom, expr, regard, incl, a, oeil, cligne(t, graine) if clign is None else clign, rougir, parle_)

def yeux_seuls(c, t, nom, expr='neutre', regard=0.0, y=H / 2, R=700, oeil=(0, 0), fond=ENCRE, rougir=0):
    """Case horizontale de manga : une bande sur les yeux."""
    hh = R * 0.75
    c.drawRect(skia.Rect.MakeWH(W, H), P(fond))
    c.save()
    c.clipRect(skia.Rect.MakeXYWH(0, y - hh / 2, W, hh))
    c.drawRect(skia.Rect.MakeXYWH(0, y - hh / 2, W, hh), P(PAPIER))
    tete(c, W / 2, y - R * 0.18, R, nom, expr, regard, 0, 255, oeil, cligne(t, 5), rougir)
    c.restore()
    c.drawRect(skia.Rect.MakeXYWH(0, y - hh / 2, W, hh), P(ENCRE, stroke=8, join='miter'))

def papier_froisse(c, x, y, w, h, a=255, couleur='#f7efdf'):
    pth = path_pts([(x, y + 4), (x + w * 0.5, y), (x + w, y + 6), (x + w - 3, y + h * 0.5), (x + w, y + h), (x + w * 0.5, y + h - 4), (x, y + h), (x + 3, y + h * 0.5)])
    c.drawPath(path_pts([(px + 10, py + 10) for (px, py) in [(x, y + 4), (x + w, y + 6), (x + w, y + h), (x, y + h)]]), P(ENCRE, a * 0.5))
    c.drawPath(pth, P(couleur, a)); c.drawPath(pth, P(ENCRE, a, stroke=3))

def fond_cases(c, couleur=ENCRE):
    c.drawRect(skia.Rect.MakeWH(W, H), P(couleur))

def titre_chapitre(numero, titre, duree=4.5, sortie=('noir', 0.4)):
    def d(c, t, f):
        carton(c, t, numero, titre, duree)
    return Plan(duree, d, 'carton', entree=('noir', 0.5), sortie=sortie)

def montage(*plans):
    out = []
    for p in plans:
        if isinstance(p, (list, tuple)):
            out.extend(p)
        else:
            out.append(p)
    return out

# ---------------------------------------------------------------- la danse
def en_silhouette(c, dessin, couleur=ENCRE, a=255):
    """Dessine dessin(c) entièrement d'une seule couleur (ombre chinoise)."""
    pt = skia.Paint()
    pt.setColorFilter(skia.ColorFilters.Blend(hexc(couleur, int(a)), skia.BlendMode.kSrcIn))
    c.saveLayer(None, pt)
    dessin(c)
    c.restore()

def epaules_de(x, sol, taille, saut=0.0):
    u = taille / 8.2
    return (x, sol - u * (4.05 + 2.55 + saut)), u

def couple(c, xc, xl, sol, taille, tenue=('celestin', 'louise'), prise='ferme', pc=None, pl=None, sens_l=-1, tour_l=1.0,
           tour_c=1.0, silhouette=None, a=255, ordre='cl'):
    """Célestin (à gauche, regarde à droite) et Louise (à droite, regarde à gauche).
    prise : 'ferme' (position de danse fermée), 'main' (une main), 'cerf' (cerf-volant : bras tendus), 'aucune'."""
    pc = dict(pc or pose()); pl = dict(pl or pose())
    tl = taille * 0.93
    (ecx, ecy), uc = epaules_de(xc, sol, taille, pc.get('saut', 0))
    (elx, ely), ul = epaules_de(xl, sol, tl, pl.get('saut', 0))
    if prise == 'ferme':
        pc['cible_d'] = (xl + ul * 0.15, ely + ul * 1.0)              # main droite dans le dos de Louise
        pl['cible_d'] = (xc + uc * 0.55, ecy + uc * 0.1)              # main gauche de Louise sur l'épaule de Célestin
        jx, jy = (xc + xl) / 2, min(ecy, ely) - uc * 0.6               # mains jointes levées entre eux
        pc['cible_g'] = (jx, jy); pl['cible_g'] = (jx + 6, jy)
        pc.setdefault('devant', 'g'); pl.setdefault('devant', 'd')
    elif prise == 'main':
        jx, jy = (xc + xl) / 2, (ecy + ely) / 2 + uc * 1.4
        pc['cible_d'] = (jx, jy); pl['cible_d'] = (jx + 4, jy)
        pc.setdefault('mg', 'ballant'); pl.setdefault('mg', 'ballant')
    elif prise == 'cerf':
        pc['cible_d'] = (lerp(xc, xl, 0.48), lerp(ecy, ely, 0.5) + uc * 0.3)
        pl['cible_d'] = (lerp(xc, xl, 0.52), lerp(ecy, ely, 0.5) + uc * 0.3)
        pc.setdefault('mg', (-1.6, 1.4)); pl.setdefault('mg', (-2.2, -0.2))
    def dessine(c):
        if ordre == 'cl':
            figure(c, xc, sol, taille, tenue[0], pc, math.copysign(max(0.22, abs(tour_c)), tour_c), a)
            figure(c, xl, sol, tl, tenue[1], pl, sens_l * math.copysign(max(0.22, abs(tour_l)), tour_l), a)
        else:
            figure(c, xl, sol, tl, tenue[1], pl, sens_l * math.copysign(max(0.22, abs(tour_l)), tour_l), a)
            figure(c, xc, sol, taille, tenue[0], pc, math.copysign(max(0.22, abs(tour_c)), tour_c), a)
    if silhouette:
        en_silhouette(c, dessine, silhouette, a)
    else:
        dessine(c)

def pas_de_valse(t, tempo=1.0, amp=1.0):
    """Jambes et balancement d'une valse à trois temps."""
    ph = t * tempo * 3
    temps = ph % 3
    m = math.sin(ph * math.pi / 1.5)
    return dict(jd=12 * m * amp, gd=-6 * amp, jg=-12 * m * amp, gg=6 * amp, saut=(0.12 if temps < 1 else 0.0) * amp,
                buste=3 * math.sin(ph * math.pi / 3) * amp)

def dans_la_mini(c, x, sol, L, occupants, sens=1, phares=0.0, roues=0.0, f=0, a=255, capote=False):
    """La Mini avec ses passagers assis : occupants = [(nom, taille, pose, place)] ; place 'volant' ou 'passager'."""
    u = L / 10
    for (nom, hh, po, place) in occupants:
        uf = hh / 8.2
        xs = x + sens * (-u * 0.9 if place == 'volant' else -u * 2.4)
        hanche = sol - u * 1.85
        po = dict(po); po['assis'] = True
        figure(c, xs, hanche + uf * 2.2, hh, nom, po, sens, a, False)
    mini(c, x, sol, L, sens, a, roues, phares, capote, f)
