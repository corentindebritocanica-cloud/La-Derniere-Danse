"""Synthétiseur de la bande-son (aucune voix) : les instruments du premier film (film/lib/musique.js)
portés en Python, plus une trousse de bruitages. Tout est calculé, rien n'est emprunté."""
import math
import numpy as np
from scipy.signal import butter, lfilter

SR = 44100
rng = np.random.default_rng(1925)

def mf(m):
    return 440.0 * 2 ** ((m - 69) / 12)

THEME = dict(
    motif=[[0, 69, 1], [1, 72, .5], [1.5, 74, .5], [2, 77, 1.5], [3.5, 76, .5], [4, 74, 1], [5, 71, .5], [5.5, 72, 1.5]],
    reponse=[[0, 72, .5], [.5, 74, .5], [1, 76, 1], [2, 79, 1], [3, 76, .5], [3.5, 74, .5], [4, 73, 2]],
    lent=[[0, 69, 1.5], [1.5, 72, .75], [2.25, 74, .75], [3, 77, 2.5], [5.5, 76, .75], [6.25, 74, .75], [7, 72, 1.5], [8.5, 69, 3]],
    accords=dict(Dm9=[50, 53, 57, 60, 64], G13=[43, 53, 59, 64], Cmaj9=[48, 52, 55, 59, 62], A7b9=[45, 55, 61, 70], A7=[45, 55, 61, 67],
                 Fmaj9=[53, 57, 60, 64, 67], Bbmaj7=[46, 53, 57, 62], Fadd9=[41, 53, 57, 60, 67], D69=[38, 50, 57, 62, 66, 69, 71, 74],
                 Am9=[45, 48, 52, 55, 59], Gm7=[43, 50, 53, 58], Dm=[50, 53, 57, 62], Gm=[43, 55, 58, 62], A=[45, 57, 61, 64], F=[41, 53, 57, 60]),
    basses=dict(Dm9=[38, 40, 41, 45], G13=[43, 45, 47, 50], Cmaj9=[36, 38, 40, 43], A7b9=[45, 49, 52, 43], A7=[45, 47, 49, 52]),
    grille=['Dm9', 'G13', 'Cmaj9', 'A7b9'],
)
# Thème de Célestin : trois notes de trompette qui montent, un peu de travers (et qui ne résolvent pas)
CELESTIN = [[0, 62, .5], [.5, 66, .5], [1, 69, 1.5]]
CELESTIN_RESOLU = [[0, 62, .5], [.5, 66, .5], [1, 69, .75], [1.75, 74, 2.5]]
# Thème de Louise : célesta, deux notes qui descendent (puis qui se retournent)
LOUISE = [[0, 81, 1], [1, 77, 2]]
LOUISE_RETOURNE = [[0, 77, 1], [1, 81, 2]]
# Valse de la cuisine (3/4) : mélodie et accords
VALSE_MEL = [[0, 69, 2], [2, 72, 1], [3, 74, 2], [5, 72, 1], [6, 69, 3], [9, 65, 3],
             [12, 67, 2], [14, 70, 1], [15, 69, 2], [17, 67, 1], [18, 65, 3], [21, 64, 3]]
VALSE_GRILLE = ['Dm', 'Dm', 'Gm', 'A', 'Dm', 'F', 'Gm', 'A']

class Piste:
    def __init__(self, duree):
        self.n = int(duree * SR) + SR
        self.g = np.zeros(self.n)
        self.d = np.zeros(self.n)

    def ajoute(self, t, sig, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.n or len(sig) == 0:
            return
        if i < 0:
            sig = sig[-i:]; i = 0
        j = min(self.n, i + len(sig))
        s = sig[:j - i] * gain
        self.g[i:j] += s * math.sqrt(0.5 * (1 - pan)) * 1.414
        self.d[i:j] += s * math.sqrt(0.5 * (1 + pan)) * 1.414

    def stereo(self):
        return np.stack([self.g, self.d], 1)

# ---------------------------------------------------------------- briques
def _t(dur):
    return np.arange(int(dur * SR)) / SR

def env_ad(n, att, dec):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(att, 1e-4))
    e *= np.exp(-np.maximum(0, t - att) / max(dec, 1e-4) * 5)
    return e

def env_asr(n, att, rel):
    t = np.arange(n) / SR
    tot = n / SR
    return np.minimum(1, t / max(att, 1e-4)) * np.minimum(1, np.maximum(0, (tot - t) / max(rel, 1e-4)))

def filtre(x, typ, f, f2=None, ordre=2):
    ny = SR / 2
    if typ == 'bande':
        b, a = butter(ordre, [max(20, f) / ny, min(f2, ny * 0.95) / ny], 'band')
    else:
        b, a = butter(ordre, min(f, ny * 0.95) / ny, 'low' if typ == 'bas' else 'high')
    return lfilter(b, a, x)

def bruit(dur):
    return rng.uniform(-1, 1, int(dur * SR))

def saw(f, dur, vib=0.0, vf=5.5, vib_att=0.35):
    t = _t(dur)
    dev = vib * f * np.minimum(1, t / vib_att) * np.sin(2 * math.pi * vf * t)
    ph = 2 * math.pi * np.cumsum(f + dev) / SR
    return 2 * ((ph / (2 * math.pi)) % 1) - 1

def tri(f, dur):
    t = _t(dur)
    return 2 * np.abs(2 * ((f * t) % 1) - 1) - 1

def sine(f, dur, f_fin=None):
    t = _t(dur)
    if f_fin:
        fr = f * (f_fin / f) ** (t / dur)
        return np.sin(2 * math.pi * np.cumsum(fr) / SR)
    return np.sin(2 * math.pi * f * t)

# ---------------------------------------------------------------- instruments (cf. musique.js)
def piano(p, m, w, g=0.05, pan=0.0, dur=1.4):
    s = tri(mf(m), dur) * 0.7 + np.sin(2 * math.pi * mf(m) * 2 * _t(dur)) * 0.12
    s = filtre(s, 'bas', 2600) * env_ad(len(s), 0.006, dur * 0.9)
    p.ajoute(w, s, g, pan)

def accord(p, nom, w, g=0.026, pan=0.0):
    for m in THEME['accords'][nom]:
        piano(p, m, w, g, pan)

def basse(p, m, w, g=0.2, dur=0.6):
    s = sine(mf(m), dur) + 0.25 * sine(mf(m) * 2, dur)
    p.ajoute(w, s * env_ad(len(s), 0.01, 0.5), g)

def grosse_caisse(p, w, g=0.2):
    s = sine(110, 0.25, 45)
    p.ajoute(w, s * env_ad(len(s), 0.003, 0.18), g)

def charleston(p, w, g=0.045, pan=0.3):
    s = filtre(bruit(0.09), 'haut', 7000) * env_ad(int(0.09 * SR), 0.002, 0.07)
    p.ajoute(w, s, g * 1.6, pan)

def caisse_claire(p, w, g=0.08, balais=False):
    s = filtre(bruit(0.18), 'bande', 1200, 6000) * env_ad(int(0.18 * SR), 0.002, 0.12 if not balais else 0.2)
    s += 0.4 * sine(190, 0.18) * env_ad(int(0.18 * SR), 0.002, 0.06)
    p.ajoute(w, s, g)

def roulement(p, a, b, g=0.06):
    w = a
    while w < b:
        caisse_claire(p, w, g * (0.25 + 0.75 * (w - a) / max(b - a, 0.01)))
        w += 0.045

def cymbale(p, w, g=0.08, dur=1.8):
    s = filtre(bruit(dur), 'haut', 4500) * env_ad(int(dur * SR), 0.004, dur)
    p.ajoute(w, s, g, 0.2)

def souffle(p, m, w, dur, g=0.05, cut=1700, vib=0.006, vf=5.5, att=0.04, pan=0.0, sourdine=False):
    d = dur + 0.12
    s = saw(mf(m), d, vib, vf)
    s = filtre(s, 'bas', cut)
    if sourdine:
        s = filtre(s, 'bande', 500, 2200)
    e = env_asr(len(s), att, 0.1)
    p.ajoute(w, s * e, g, pan)

def trompette(p, m, w, dur, g=0.05, pan=0.0, sourdine=False):
    souffle(p, m, w, dur, g, 1700, 0.006, 5.5, 0.04, pan, sourdine)

def violon(p, m, w, dur, g=0.04, pan=0.0):
    souffle(p, m, w, dur, g, 2600, 0.009, 6.0, 0.25, pan)

def clarinette(p, m, w, dur, g=0.05, pan=0.0):
    d = dur + 0.1
    t = _t(d)
    f = mf(m)
    s = np.sign(np.sin(2 * math.pi * f * t)) * 0.6 + np.sin(2 * math.pi * f * 3 * t) * 0.2
    s = filtre(s, 'bas', 1800) * env_asr(len(s), 0.05, 0.1)
    p.ajoute(w, s, g, pan)

def celesta(p, m, w, g=0.06, pan=0.0):
    d = 2.6
    s = sine(mf(m), d) + 0.35 * sine(mf(m) * 4, d) * np.exp(-_t(d) * 6)
    p.ajoute(w, s * env_ad(len(s), 0.003, 2.0), g, pan)

def cloche(p, m, w, g=0.06, pan=0.0, dur=3.8):
    s = sine(mf(m), dur) + 0.3 * sine(mf(m) * 2.76, dur) + 0.15 * sine(mf(m) * 5.4, dur)
    p.ajoute(w, s * env_ad(len(s), 0.004, dur), g, pan)

def nappe_accord(p, nom, w, dur, g=0.012, cut=900):
    for m in THEME['accords'][nom]:
        for dt in (-4, 4):
            f = mf(m) * 2 ** (dt / 1200)
            s = filtre(saw(f, dur + 0.7), 'bas', cut)
            e = env_asr(len(s), 1.5, 1.2)
            p.ajoute(w, s * e, g, 0.3 * (1 if dt > 0 else -1))

def verre(p, w, dur=3.0, g=0.08, m=93):
    """Verre frotté (l'étoile filante)."""
    s = sine(mf(m), dur) + 0.5 * sine(mf(m) * 1.003, dur) + 0.2 * sine(mf(m) * 2.01, dur)
    p.ajoute(w, s * env_asr(int(dur * SR), 0.6, 1.4), g)

def phrase(p, notes, w, b, instr, g=None, transpose=0, pan=0.0, **kw):
    for (o, m, d) in notes:
        m += transpose
        if instr == 'piano':
            piano(p, m, w + o * b, g or 0.05, pan)
        elif instr == 'celesta':
            celesta(p, m, w + o * b, g or 0.06, pan)
        elif instr == 'trompette':
            trompette(p, m, w + o * b, d * b * 0.95, g or 0.05, pan, **kw)
        elif instr == 'violon':
            violon(p, m, w + o * b, d * b * 0.95, g or 0.04, pan)
        elif instr == 'clarinette':
            clarinette(p, m, w + o * b, d * b * 0.95, g or 0.05, pan)

def orchestre(p, w, b, grille, piano_g=0.026, batterie=True, basse_g=0.2):
    for i, nom in enumerate(grille):
        x = w + i * 4 * b
        for o in (0, 1.5):
            accord(p, nom, x + o * b, piano_g)
        for k, m in enumerate(THEME['basses'].get(nom, THEME['basses']['Dm9'])):
            basse(p, m, x + k * b, basse_g)
        if batterie:
            for k in (0, 2):
                grosse_caisse(p, x + k * b, 0.16)
            for k in (1, 3):
                charleston(p, x + k * b)
            for k in (1.5, 3.5):
                charleston(p, x + k * b, 0.02)
            for k in (1, 3):
                caisse_claire(p, x + k * b, 0.025, True)

def gramophone(p, a, dur, g=0.03):
    s = filtre(bruit(dur), 'bande', 2500, 4200) * env_asr(int(dur * SR), 0.3, 0.4)
    p.ajoute(a, s, g)
    for _ in range(int(dur * 6)):
        w = a + rng.random() * dur
        c = filtre(bruit(0.012), 'haut', 3000) * env_ad(int(0.012 * SR), 0.001, 0.01)
        p.ajoute(w, c, 0.04 + rng.random() * 0.08)

def projecteur(p, a, dur, g=0.012):
    t = _t(dur)
    s = filtre(bruit(dur), 'bande', 1800, 3000) * (0.6 + 0.4 * np.sign(np.sin(2 * math.pi * 24 * t)))
    p.ajoute(a, s * env_asr(len(s), 0.6, 0.6), g)

# ---------------------------------------------------------------- lits musicaux (boucles)
def lit_jazz(p, a, b_dur, b=0.5, g=1.0, trompette_motif=True, batterie=True, piano_g=0.026, grille=None):
    """L'orchestre de Léon, en boucle de a à a+b_dur."""
    grille = grille or THEME['grille']
    mesure = 4 * b * len(grille)
    w = a
    k = 0
    while w < a + b_dur - 0.2:
        orchestre(p, w, b, grille, piano_g * g, batterie, 0.2 * g)
        if trompette_motif and k % 2 == 0:
            phrase(p, THEME['motif'], w + 2 * b, b * 2, 'trompette', 0.045 * g, sourdine=True)
        elif trompette_motif:
            phrase(p, THEME['reponse'], w + 2 * b, b * 2, 'clarinette', 0.04 * g, -12)
        w += mesure
        k += 1

def lit_valse(p, a, dur, b=0.42, g=1.0, melodie=True, instr='piano', transpose=0):
    """La valse de la cuisine : basse au premier temps, accord aux deux suivants."""
    mesure = 3 * b
    w = a
    k = 0
    while w < a + dur - 0.2:
        nom = VALSE_GRILLE[k % len(VALSE_GRILLE)]
        ac = THEME['accords'][nom]
        basse(p, ac[0] - 12 + transpose, w, 0.15 * g, 0.5)
        for o in (1, 2):
            for m in ac[1:]:
                piano(p, m + transpose, w + o * b, 0.018 * g)
        k += 1
        w += mesure
    if melodie:
        w = a + mesure
        cycle = 24 * b
        while w < a + dur - 2:
            if instr == 'piano':
                phrase(p, VALSE_MEL, w, b, 'piano', 0.05 * g, transpose + 12)
            else:
                phrase(p, VALSE_MEL, w, b, instr, 0.04 * g, transpose)
            w += cycle

def lit_nuit(p, a, dur, g=1.0, accords=('Dm9', 'Bbmaj7', 'Fmaj9', 'A7'), celesta_notes=True, seg=4.0):
    """Nappes douces et célesta : la nuit, les étoiles."""
    w = a
    k = 0
    while w < a + dur - 0.5:
        d = min(seg, a + dur - w)
        nappe_accord(p, accords[k % len(accords)], w, d, 0.01 * g)
        if celesta_notes:
            for j in range(3):
                m = THEME['accords'][accords[k % len(accords)]][j % 4] + 24
                celesta(p, m, w + 0.5 + j * seg / 3, 0.035 * g, (j - 1) * 0.5)
        w += seg
        k += 1

def lit_piano_doux(p, a, dur, g=1.0, b=0.6):
    """Piano léger (jour, ville)."""
    w = a; k = 0
    grille = ['Fmaj9', 'Cmaj9', 'Dm9', 'G13']
    while w < a + dur - 0.3:
        nom = grille[k % 4]
        ac = THEME['accords'][nom]
        basse(p, ac[0] - 12 if ac[0] > 45 else ac[0], w, 0.1 * g, 0.9)
        for j, m in enumerate(ac[1:]):
            piano(p, m + 12, w + j * b * 0.5, 0.025 * g, (j - 2) * 0.2)
        w += 4 * b
        k += 1

def lit_piano_studio(p, a, dur, g=1.0):
    """Le piano droit de Solange qui répète quatre mesures."""
    b = 0.45
    w = a
    while w < a + dur - 0.3:
        for k, nom in enumerate(('Dm', 'Gm', 'A', 'Dm')):
            ac = THEME['accords'][nom]
            x = w + k * 3 * b
            basse(p, ac[0] - 12, x, 0.12 * g, 0.4)
            for o in (1, 2):
                for m in ac[1:]:
                    piano(p, m + 12, x + o * b, 0.016 * g)
        w += 12 * b

# ---------------------------------------------------------------- bruitages
def sfx(p, nom, w, g=1.0, pan=0.0):
    f = SFX.get(nom)
    if f is None:
        raise KeyError(nom)
    f(p, w, g, pan)

def _impact(p, w, g, pan, f0, f1, dur, bruit_g=0.3, bande=(800, 4000)):
    s = sine(f0, dur, f1) * env_ad(int(dur * SR), 0.002, dur)
    s += bruit_g * filtre(bruit(dur), 'bande', *bande) * env_ad(int(dur * SR), 0.001, dur * 0.4)
    p.ajoute(w, s, g, pan)

def _dong(p, w, g, pan):
    cloche(p, 43, w, 0.05 * g, pan, 3.0); cloche(p, 55, w, 0.02 * g, pan, 3.0)

def _drelin(p, w, g, pan):
    for k in range(6):
        cloche(p, 96 + (k % 2) * 3, w + k * 0.06, 0.03 * g, pan, 0.8)

def _tac(p, w, g, pan):
    _impact(p, w, 0.25 * g, pan, 900, 600, 0.08, 0.6, (1500, 5000))

def _toc(p, w, g, pan):
    _impact(p, w, 0.3 * g, pan, 500, 300, 0.12, 0.5, (600, 2500))

def _clic(p, w, g, pan):
    _impact(p, w, 0.2 * g, pan, 2500, 1500, 0.04, 1.0, (2000, 8000))

def _flash(p, w, g, pan):
    _clic(p, w, g, pan)
    s = filtre(bruit(0.6), 'bande', 600, 6000) * env_ad(int(0.6 * SR), 0.005, 0.45)
    p.ajoute(w + 0.03, s, 0.18 * g, pan)
    s = sine(1800, 0.5, 5200) * env_ad(int(0.5 * SR), 0.01, 0.4)
    p.ajoute(w + 0.02, s, 0.03 * g, pan)

def _klaxon(p, w, g, pan):
    for k, (m, d) in enumerate(((62, 0.18), (57, 0.32))):
        s = np.sign(sine(mf(m), d)) * 0.5 + saw(mf(m) * 1.01, d) * 0.3
        s = filtre(s, 'bande', 300, 2500) * env_asr(int(d * SR), 0.01, 0.05)
        p.ajoute(w + k * 0.2, s, 0.12 * g, pan)

def _teuf(p, w, g, pan):
    s = filtre(bruit(0.22), 'bas', 260) * env_ad(int(0.22 * SR), 0.005, 0.18)
    s += 0.5 * sine(70, 0.22, 50) * env_ad(int(0.22 * SR), 0.003, 0.15)
    p.ajoute(w, s, 0.6 * g, pan)

def _soupir_moteur(p, w, g, pan):
    s = filtre(bruit(1.0), 'bas', 400) * env_ad(int(1.0 * SR), 0.05, 0.9) * np.linspace(1, 0.2, int(1.0 * SR))
    p.ajoute(w, s, 0.4 * g, pan)

def moteur(p, a, dur, g=1.0, monte=0.0, pan=0.0):
    """Moteur deux temps de la Mini (régime qui monte si monte > 0)."""
    t = _t(dur)
    fr = 26 + monte * 40 * np.minimum(1, t / max(dur, 0.1))
    ph = np.cumsum(fr) / SR
    puls = np.maximum(0, np.sin(2 * math.pi * ph)) ** 6
    s = filtre(bruit(dur), 'bas', 500) * puls + 0.4 * np.sin(2 * math.pi * ph * 2) * puls
    p.ajoute(a, s * env_asr(len(s), 0.2, 0.4), 0.35 * g, pan)

def _vroum(p, w, g, pan):
    moteur(p, w, 2.2, g * 1.3, 1.0, pan)

def _crac(p, w, g, pan):
    for k in range(3):
        s = filtre(bruit(0.03), 'bande', 1500, 7000) * env_ad(int(0.03 * SR), 0.001, 0.02)
        p.ajoute(w + k * 0.035 + rng.random() * 0.02, s, 0.35 * g, pan)

def _clap(p, w, g, pan):
    for k in range(4):
        s = filtre(bruit(0.04), 'bande', 900, 3000) * env_ad(int(0.04 * SR), 0.001, 0.03)
        p.ajoute(w + k * 0.012, s, 0.3 * g, pan)

def applaudissements(p, a, dur, g=1.0, foule=140):
    for _ in range(int(foule * dur)):
        w = a + (rng.random() ** 1.3) * dur
        s = filtre(bruit(0.035), 'bande', 1000 + rng.random() * 1800, 4500) * env_ad(int(0.035 * SR), 0.001, 0.03)
        p.ajoute(w, s, 0.05 * g * (1 - 0.6 * (w - a) / (dur + 0.6)), rng.uniform(-0.7, 0.7))

def _pop(p, w, g, pan):
    _impact(p, w, 0.4 * g, pan, 600, 200, 0.07, 0.8, (500, 3000))
    s = filtre(bruit(0.5), 'haut', 3000) * env_ad(int(0.5 * SR), 0.01, 0.4)
    p.ajoute(w + 0.05, s, 0.03 * g, pan)

def _porte(p, w, g, pan):
    _impact(p, w, 0.35 * g, pan, 120, 60, 0.3, 0.5, (100, 1200))

def _grincement(p, w, g, pan):
    s = saw(320, 0.9, 0.08, 7) * env_asr(int(0.9 * SR), 0.1, 0.3)
    p.ajoute(w, filtre(s, 'bande', 600, 2400), 0.03 * g, pan)

def _cling(p, w, g, pan):
    for k in range(4):
        cloche(p, 100 + (k * 5) % 7, w + k * 0.05 + rng.random() * 0.02, 0.025 * g, pan, 0.5)

def _ding_ding(p, w, g, pan):
    for k in range(2):
        cloche(p, 88, w + k * 0.35, 0.08 * g, pan, 1.6)

def _tramway(p, w, g, pan):
    _ding_ding(p, w, g, pan)
    s = filtre(bruit(2.4), 'bas', 300) * env_asr(int(2.4 * SR), 0.6, 0.8)
    p.ajoute(w, s, 0.3 * g, pan)
    for k in range(8):
        _toc(p, w + 0.2 + k * 0.28, 0.25 * g, pan)

def _hop(p, w, g, pan):
    s = filtre(bruit(0.25), 'bande', 400, 3000) * env_ad(int(0.25 * SR), 0.01, 0.2)
    p.ajoute(w, s, 0.15 * g, pan)

def _frrt(p, w, g, pan):
    """Papier froissé, journal qu'on tourne."""
    for k in range(12):
        s = filtre(bruit(0.03), 'bande', 2000, 9000) * env_ad(int(0.03 * SR), 0.002, 0.025)
        p.ajoute(w + k * 0.035 + rng.random() * 0.03, s, (0.08 + rng.random() * 0.06) * g, pan)

def _plume(p, a, g, pan, dur=2.0):
    for k in range(int(dur * 14)):
        s = filtre(bruit(0.05), 'bande', 3000, 9000) * env_asr(int(0.05 * SR), 0.01, 0.02)
        p.ajoute(a + k / 14 + rng.random() * 0.03, s, 0.025 * g, pan)

def _ronron(p, w, g, pan, dur=2.6):
    t = _t(dur)
    s = filtre(bruit(dur), 'bas', 180) * (0.5 + 0.5 * np.sin(2 * math.pi * 24 * t)) * (0.6 + 0.4 * np.sin(2 * math.pi * 0.6 * t))
    p.ajoute(w, s * env_asr(len(s), 0.3, 0.5), 0.35 * g, pan)

def _miaou(p, w, g, pan):
    d = 0.7
    t = _t(d)
    f = 500 + 300 * np.sin(math.pi * t / d)
    s = np.sin(2 * math.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * math.pi * np.cumsum(f) / SR)
    s = filtre(s, 'bande', 400, 3000) * env_asr(len(s), 0.08, 0.25)
    p.ajoute(w, s, 0.06 * g, pan)

def _tic(p, w, g, pan):
    _impact(p, w, 0.12 * g, pan, 3000, 2600, 0.03, 0.7, (3000, 9000))

def tic_tac(p, a, dur, g=1.0, periode=1.0, pan=-0.4):
    w = a; k = 0
    while w < a + dur:
        _impact(p, w, (0.1 if k % 2 == 0 else 0.07) * g, pan, 2400 if k % 2 == 0 else 1900, 1800, 0.03, 0.7, (2500, 8000))
        w += periode / 2; k += 1

def _hic(p, w, g, pan):
    clarinette(p, 79, w, 0.08, 0.06 * g, pan)
    clarinette(p, 84, w + 0.09, 0.06, 0.05 * g, pan)

def _hou(p, w, g, pan):
    """Hibou."""
    for k in range(2):
        s = sine(mf(64 - k * 2), 0.5) * env_asr(int(0.5 * SR), 0.08, 0.2)
        p.ajoute(w + k * 0.7, filtre(s, 'bas', 900), 0.07 * g, pan)

def grillons(p, a, dur, g=1.0, pan=0.0):
    t = _t(dur)
    porteuse = np.sin(2 * math.pi * 4300 * t)
    trem = (np.sin(2 * math.pi * 32 * t) > 0.3).astype(float) * (np.sin(2 * math.pi * 1.6 * t) > 0).astype(float)
    s = porteuse * filtre(trem, 'bas', 300)
    p.ajoute(a, s * env_asr(len(s), 1.0, 1.0), 0.012 * g, pan)

def vent(p, a, dur, g=1.0):
    s = filtre(bruit(dur), 'bande', 250, 900)
    t = _t(dur)
    s *= 0.6 + 0.4 * np.sin(2 * math.pi * 0.15 * t + 1)
    p.ajoute(a, s * env_asr(len(s), 1.5, 1.5), 0.06 * g)

def pas(p, a, dur, cadence=2.0, g=1.0, gravier=False, pan=0.0, decal=0.0):
    w = a + decal
    while w < a + dur:
        if gravier:
            s = filtre(bruit(0.12), 'bande', 1500, 7000) * env_ad(int(0.12 * SR), 0.005, 0.1)
            p.ajoute(w, s, 0.07 * g, pan)
        else:
            _impact(p, w, 0.09 * g, pan, 180, 120, 0.06, 0.6, (300, 2500))
        w += 1 / cadence

def foule(p, a, dur, g=1.0):
    """Brouhaha de cabaret (conversations sans paroles, verres)."""
    s = filtre(bruit(dur), 'bande', 250, 1400)
    t = _t(dur)
    s *= 0.7 + 0.3 * np.sin(2 * math.pi * 0.37 * t) * np.sin(2 * math.pi * 0.11 * t + 2)
    p.ajoute(a, s * env_asr(len(s), 1.0, 1.0), 0.05 * g)
    for _ in range(int(dur * 0.8)):
        w = a + rng.random() * dur
        cloche(p, 96 + rng.integers(0, 6), w, 0.012 * g, rng.uniform(-0.8, 0.8), 0.6)

def _oiseaux(p, w, g, pan):
    for k in range(5):
        d = 0.09
        s = sine(3200 + rng.random() * 800, d, 4200 + rng.random() * 1000) * env_ad(int(d * SR), 0.005, d)
        p.ajoute(w + k * 0.14 + rng.random() * 0.05, s, 0.025 * g, pan)

def _fiii(p, w, g, pan):
    verre(p, w, 3.2, 0.09 * g)

def _flamme(p, a, dur, g=1.0):
    for _ in range(int(dur * 9)):
        s = filtre(bruit(0.02), 'haut', 1500) * env_ad(int(0.02 * SR), 0.001, 0.015)
        p.ajoute(a + rng.random() * dur, s, (0.02 + rng.random() * 0.05) * g, 0.4)
    s = filtre(bruit(dur), 'bas', 400)
    p.ajoute(a, s * env_asr(len(s), 0.5, 0.5), 0.03 * g, 0.4)

def _souffle_doux(p, w, g, pan):
    s = filtre(bruit(0.8), 'bande', 300, 1500) * env_asr(int(0.8 * SR), 0.2, 0.5)
    p.ajoute(w, s, 0.05 * g, pan)

def _tampon(p, w, g, pan):
    _impact(p, w, 0.5 * g, pan, 150, 80, 0.12, 0.6, (200, 2000))

def _zip(p, w, g, pan):
    s = filtre(bruit(0.12), 'bande', 2000, 6000) * env_asr(int(0.12 * SR), 0.02, 0.05)
    p.ajoute(w, s, 0.08 * g, pan)

def _bling(p, w, g, pan):
    cloche(p, 98, w, 0.05 * g, pan, 1.0)
    for k in range(10):
        _tic(p, w + 0.08 + k * 0.03, 0.5 * g, pan)

def _boum(p, w, g, pan):
    _impact(p, w, 0.3 * g, pan, 90, 40, 0.35, 0.5, (80, 900))

def _whoosh(p, w, g, pan):
    d = 0.6
    s = bruit(d)
    out = np.zeros_like(s)
    for k in range(6):
        seg = slice(int(k * len(s) / 6), int((k + 1) * len(s) / 6))
        out[seg] = filtre(s[seg], 'bande', 400 + k * 600, 1200 + k * 900)
    p.ajoute(w, out * env_asr(len(s), 0.25, 0.3), 0.12 * g, pan)

def _scintille(p, w, g, pan):
    for k in range(3):
        celesta(p, 96 + k * 4, w + k * 0.07, 0.025 * g, pan)

def _rires(p, w, g, pan):
    """Pas de voix : les rires sont rendus par un petit trille de clarinette."""
    for k in range(5):
        clarinette(p, 76 + (k % 2) * 3, w + k * 0.12, 0.09, 0.03 * g, pan)

def _sursaut(p, w, g, pan):
    for k, m in enumerate((79, 83, 86)):
        piano(p, m, w + k * 0.03, 0.05 * g, pan, 0.6)

def _aie(p, w, g, pan):
    trompette(p, 74, w, 0.12, 0.05 * g, pan, sourdine=True)
    trompette(p, 70, w + 0.12, 0.3, 0.05 * g, pan, sourdine=True)

def _chute_comique(p, w, g, pan):
    for k in range(5):
        trompette(p, 72 - k * 2, w + k * 0.12, 0.1, 0.04 * g, pan, sourdine=True)

SFX = dict(dong=_dong, drelin=_drelin, tac=_tac, toc=_toc, clic=_clic, flash=_flash, klaxon=_klaxon, teuf=_teuf, soupir=_soupir_moteur,
           vroum=_vroum, crac=_crac, clap=_clap, pop=_pop, porte=_porte, grincement=_grincement, cling=_cling, ding=_ding_ding,
           tramway=_tramway, hop=_hop, frrt=_frrt, plume=_plume, ronron=_ronron, miaou=_miaou, tic=_tic, hic=_hic, hou=_hou,
           oiseaux=_oiseaux, fiii=_fiii, souffle=_souffle_doux, tampon=_tampon, zip=_zip, bling=_bling, boum=_boum, whoosh=_whoosh,
           scintille=_scintille, rires=_rires, sursaut=_sursaut, aie=_aie, chute=_chute_comique)

def master(st, gain_cible=0.85, cible_db=-17.0):
    """Nivellement lent (les passages calmes remontent, les forts redescendent), puis limiteur doux."""
    mono = np.abs(st).mean(1)
    fen = int(0.6 * SR)
    def moy(x, k):
        c = np.concatenate([[0.0], np.cumsum(x)])
        i = np.arange(len(x))
        a = np.clip(i - k // 2, 0, len(x)); b = np.clip(i + k // 2, 0, len(x))
        return (c[b] - c[a]) / np.maximum(b - a, 1)
    rms = np.sqrt(moy(mono ** 2, fen) + 1e-10)
    rms = moy(rms, int(1.5 * SR))
    g = np.clip(10 ** (cible_db / 20) / (rms + 1e-6), 0.35, 5.0)
    g[rms < 10 ** (-58 / 20)] = 1.0          # on ne remonte pas les vrais silences
    st = st * g[:, None]
    pic = np.percentile(np.abs(st), 99.95) + 1e-9   # les rares transitoires passent dans le limiteur
    st = st / pic * 0.9
    st = np.tanh(st) * gain_cible
    return st.astype(np.float32)
