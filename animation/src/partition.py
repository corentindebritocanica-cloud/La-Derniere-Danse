"""La partition : musique et bruitages calés plan par plan sur les 14 morceaux.
Les temps sont ceux des fichiers seqNN.py (temps local de chaque plan)."""
import importlib
from son import *
from son import _impact, _plume, _oiseaux, _drelin

def debuts(mod):
    m = importlib.import_module(mod)
    T, acc, cartons = {}, 0.0, []
    for pl in m.PLANS:
        if pl.nom == 'carton':
            cartons.append(acc)
        else:
            T[pl.nom] = (acc, pl.duree)
        acc += pl.duree
    return T, acc, cartons, m

def carton_musique(p, a, numero):
    """Intertitre : une cloche, un accord, et le thème de Louise ou de Célestin selon le chapitre."""
    cloche(p, 62, a + 0.4, 0.05)
    nappe_accord(p, 'Fmaj9' if numero % 2 else 'Dm9', a + 0.3, 3.8, 0.009)
    if numero % 2:
        phrase(p, CELESTIN, a + 1.0, 0.55, 'trompette', 0.04, sourdine=True)
    else:
        phrase(p, LOUISE, a + 1.0, 0.6, 'celesta', 0.06)

# ---------------------------------------------------------------- séquences
def s00(p, T):
    a, d = T['étoile']
    gramophone(p, a, 6.5, 0.035)
    for k, tn in enumerate((2.2, 2.9, 3.6)):
        trompette(p, (62, 66, 69)[k], a + tn, 0.6 if k < 2 else 1.6, 0.05, sourdine=True)
    nappe_accord(p, 'Dm9', a + 0.5, 6.0, 0.006)
    a, d = T['cabaret']
    foule(p, a, d, 0.6)
    lit_jazz(p, a + 0.6, d - 0.6, 0.5, 0.45, True, True)
    a, d = T['titre']
    cymbale(p, a + 0.6, 0.06, 3)
    phrase(p, THEME['lent'], a + 0.8, 0.6, 'trompette', 0.05)
    nappe_accord(p, 'D69', a + 0.6, 7.0, 0.008)

def s01(p, T):
    a, d = T['1.1']
    lit_piano_doux(p, a, d + T['1.2'][1] - 1, 0.9)
    for k in range(4):
        cloche(p, 55 - k * 2, a + 0.8 + k * 1.3, 0.04, -0.5, 3.0)
    _drelin(p, a + 6.5, 0.6, 0.3)
    a, d = T['1.2']
    sfx(p, 'souffle', a + 0.6, 1.0)
    phrase(p, CELESTIN, a + 2.6, 0.5, 'trompette', 0.05, sourdine=True)
    sfx(p, 'zip', a + 2.7, 0.8)
    sfx(p, 'scintille', a + 4.8)
    a, d = T['1.3']
    gramophone(p, a, d, 0.03)
    lit_valse(p, a + 0.3, d - 0.3, 0.46, 0.9)
    a, d = T['1.4']
    sfx(p, 'drelin', a + 0.4)
    pas(p, a, 1.4, 2.5, 0.8)
    lit_piano_doux(p, a + 0.6, d - 0.6, 0.6)
    sfx(p, 'frrt', a + 9.0)
    a, d = T['1.5']
    for t0 in (0.6, 1.8, 3.0):
        sfx(p, 'teuf', a + t0)
        sfx(p, 'teuf', a + t0 + 0.3, 0.6)
    sfx(p, 'soupir', a + 3.2)
    sfx(p, 'vroum', a + 4.8, 0.8)
    moteur(p, a + 5.4, 1.4, 0.7)
    sfx(p, 'klaxon', a + 6.8)
    moteur(p, a + 6.6, 3.4, 1.0, 1.0)
    sfx(p, 'whoosh', a + 7.4)
    a, d = T['1.6']
    vent(p, a, d, 0.3)
    for k in range(int(d / 1.7)):
        _impact(p, a + 0.5 + k * 1.7, 0.03, -0.6, 400, 300, 0.08, 0.7, (400, 3000))  # marteaux lointains
    sfx(p, 'tampon', a + 1.0)
    _plume(p, a + 2.4, 1.0, 0.0, 3.0)
    lit_piano_doux(p, a + 0.4, 6.0, 0.45)
    pas(p, a + 5.0, 1.4, 2.2, 0.9, pan=0.6)
    tic_tac(p, a + 6.4, 7.0, 0.8, 1.0, 0.6)
    for k in range(6):
        sfx(p, 'toc', a + 6.6 + k * 0.5, 0.4, 0.5)
    sfx(p, 'hic', a + 13.0)
    phrase(p, CELESTIN, a + 11.0, 0.45, 'trompette', 0.04, sourdine=True)
    a, d = T['1.7']
    for k in range(3):
        sfx(p, 'zip', a + 0.3 + k * 0.5, 0.6)
    nappe_accord(p, 'Dm9', a, d, 0.008)
    phrase(p, THEME['motif'], a + 2.0, 0.55, 'trompette', 0.045, sourdine=True)
    projecteur(p, a, d, 0.008)

def s02(p, T):
    a, d = T['2.1']
    lit_nuit(p, a, d, 0.8, ('Fmaj9', 'Am9'))
    phrase(p, LOUISE, a + 2.0, 0.7, 'celesta')
    a, d = T['2.2']
    tic_tac(p, a, d, 0.9, 1.0, -0.6)
    for k in range(5):
        sfx(p, 'dong', a + 0.4 + k * 0.5, 0.6)
    sfx(p, 'frrt', a + 3.0, 0.8)
    _impact(p, a + 4.6, 0.12, 0.4, 2800, 2600, 0.15, 0.2, (2000, 6000))  # la tasse
    sfx(p, 'ronron', a + 6.0, 0.7)
    lit_piano_doux(p, a + 4.0, d - 4.0, 0.35)
    for k in range(9):  # le grand-père tapote l'accoudoir : un pizzicato imperceptible
        _impact(p, a + 1.0 + k, 0.025, -0.5, mf(55), mf(55), 0.15, 0.0)
    a, d = T['2.3']
    lit_nuit(p, a, d, 0.9, ('Dm9', 'Bbmaj7'))
    phrase(p, LOUISE, a + 3.6, 0.7, 'celesta')
    phrase(p, LOUISE, a + 7.4, 0.7, 'celesta')
    _plume(p, a + 1.0, 0.5, 0, 2)
    a, d = T['2.4']
    sfx(p, 'grincement', a + 0.1)
    sfx(p, 'hop', a + 0.6)
    sfx(p, 'whoosh', a + 0.7, 0.6)
    pas(p, a + 0.4, 1.2, 3.0, 0.5, pan=0.6)
    lit_piano_doux(p, a + 1.5, d - 1.5, 0.35)
    sfx(p, 'cling', a + 10.2); sfx(p, 'cling', a + 10.5)
    a, d = T['2.5']
    pas(p, a, d, 4.0, 0.9)
    sfx(p, 'tramway', a + 1.3, 1.0, 0.0)
    sfx(p, 'whoosh', a + 1.6)
    phrase(p, LOUISE_RETOURNE, a + 3.4, 0.35, 'celesta')
    a, d = T['2.6']
    lit_piano_studio(p, a, d, 0.9)
    for k in range(int(4.6 * 1.6)):
        sfx(p, 'toc', a + k / 1.6, 0.6)
    sfx(p, 'sursaut', a + 4.8)
    nappe_accord(p, 'Am9', a + 13.0, 4.4, 0.01)
    trompette(p, 74, a + 13.4, 1.0, 0.03, sourdine=True)  # le Moulin-Rouge, au loin
    a, d = T['2.7']
    sfx(p, 'flash', a + 0.6)
    sfx(p, 'rires', a + 0.9)
    sfx(p, 'drelin', a + 1.6, 0.6)
    pas(p, a + 1.6, 1.4, 2.4, 0.7, pan=-0.5)
    lit_jazz(p, a + 2.0, d - 2.0, 0.5, 0.35, True, False)
    sfx(p, 'whoosh', a + 4.6, 0.8)
    phrase(p, CELESTIN, a + 13.0, 0.5, 'trompette', 0.05)

def s03(p, T):
    a, d = T['3.1']
    foule(p, a, d, 0.6)
    for k in range(8):
        sfx(p, 'tac', a + 0.4 + k * 0.33, 0.7, -0.2 + k * 0.05)
        celesta(p, 72 + [0, 2, 4, 5, 7, 9, 11, 12][k], a + 0.4 + k * 0.33, 0.03)
    roulement(p, a + 3.0, a + 4.4, 0.08)
    cymbale(p, a + 4.4, 0.06, 2)
    lit_jazz(p, a + 4.6, d - 4.6, 0.5, 0.5, True, True)
    a, d = T['3.2']
    foule(p, a, d, 0.7)
    for (t0, m) in ((0.6, 'tsoin'), (1.8, 'bom'), (3.4, 'tut')):
        if m == 'tsoin':
            souffle(p, 50, a + t0, 1.0, 0.04, 1200, 0.03, 3)  # trombone qui glisse
        elif m == 'bom':
            basse(p, 38, a + t0, 0.25); basse(p, 38, a + t0 + 0.4, 0.25)
        else:
            trompette(p, 69, a + t0, 1.2, 0.05)
    for k in range(6):
        piano(p, 60 + k * 2, a + 0.3 + k * 0.4, 0.02)
    phrase(p, THEME['motif'][:4], a + 4.4, 0.5, 'trompette', 0.05)
    a, d = T['3.3']
    foule(p, a, d, 0.5)
    lit_jazz(p, a, d, 0.5, 0.35, False, True)
    sfx(p, 'rires', a + 5.6)
    sfx(p, 'flash', a + 7.4)
    a, d = T['3.4']
    sfx(p, 'frrt', a + 0.4)
    nappe_accord(p, 'A7b9', a, d, 0.012)
    roulement(p, a + 1.0, a + 3.2, 0.07)
    sfx(p, 'sursaut', a + 3.2)
    cymbale(p, a + 3.2, 0.07)
    a, d = T['3.5']
    foule(p, a, d, 0.3)
    lit_nuit(p, a, d, 0.5, ('Am9', 'Fmaj9', 'Dm9'), False)
    for k, (t0, m) in enumerate(((1.4, 74), (1.9, 77))):
        trompette(p, m, a + t0, 0.45, 0.05)  # la trompette de Léon glisse deux notes
    phrase(p, LOUISE, a + 3.4, 0.6, 'celesta', 0.05)
    a, d = T['3.6']
    foule(p, a, d, 0.4)
    lit_piano_doux(p, a, d, 0.4)
    phrase(p, CELESTIN, a + 0.8, 0.4, 'trompette', 0.035, sourdine=True)
    a, d = T['3.7']
    foule(p, a, d, 0.35)
    lit_valse(p, a, 5.5, 0.44, 0.8)                                     # la valse
    lit_jazz(p, a + 5.5, 5.5, 0.4, 0.7, True, True)                     # le fox-trot
    sfx(p, 'aie', a + 5.5 + 1.6)
    sfx(p, 'rires', a + 5.5 + 3.4)
    roulement(p, a + 11.0, a + 11.6, 0.06)
    cymbale(p, a + 11.6, 0.05)
    phrase(p, THEME['motif'][:3], a + 13.0, 0.55, 'trompette', 0.045)   # quelques notes qui hésitent
    a, d = T['3.8']
    phrase(p, THEME['lent'], a + 0.2, 0.62, 'trompette', 0.05)
    lit_jazz(p, a, d, 0.62, 0.5, False, False, 0.02, ['Dm9', 'Bbmaj7', 'Fmaj9', 'A7'])
    nappe_accord(p, 'D69', a + 4.5, d - 4.5, 0.008)
    phrase(p, THEME['reponse'], a + 6.4, 0.62, 'trompette', 0.05)
    for k in range(4):
        sfx(p, 'scintille', a + 5 + k * 2)
    a, d = T['3.9']
    applaudissements(p, a + 2.0, d - 2.0, 1.2)
    foule(p, a + 2.0, d - 2.0, 0.6)
    roulement(p, a + 4.6, a + 5.2, 0.07); cymbale(p, a + 5.2, 0.07)
    phrase(p, CELESTIN_RESOLU, a + 7.4, 0.4, 'trompette', 0.05)
    a, d = T['3.10']
    vent(p, a, d, 0.25)
    lit_piano_doux(p, a, d, 0.5)
    phrase(p, LOUISE_RETOURNE, a + 12.2, 0.6, 'celesta')
    sfx(p, 'rires', a + 12.3, 0.8)

def s04(p, T):
    a, d = T['4.1']
    vent(p, a, d, 0.3)
    for t0 in (0.4, 1.4, 2.6):
        sfx(p, 'teuf', a + t0)
    sfx(p, 'soupir', a + 2.8)
    sfx(p, 'klaxon', a + 4.0, 0.4)
    lit_piano_doux(p, a + 4, d - 4, 0.35)
    a, d = T['4.2']
    pas(p, a, d, 2.0, 0.5, pan=-0.2); pas(p, a, d, 2.0, 0.4, pan=0.2, decal=0.2)
    lit_nuit(p, a, d, 0.8, ('Fmaj9', 'Cmaj9'))
    phrase(p, LOUISE, a + 1.0, 0.7, 'celesta')
    a, d = T['4.3']
    lit_nuit(p, a, d, 0.8, ('Fmaj9', 'Cmaj9', 'Dm9', 'G13'))
    sfx(p, 'rires', a + 11.0, 0.8)
    a, d = T['4.4']
    grillons(p, a, d, 1.0)
    pas(p, a, d, 1.6, 0.4, True, -0.2); pas(p, a, d, 1.6, 0.35, True, 0.2, 0.31)
    lit_nuit(p, a, d, 0.7, ('Dm9', 'Bbmaj7'))
    a, d = T['4.5']
    grillons(p, a, 4.4, 1.0)
    pas(p, a, 1.6, 1.6, 0.5, True, -0.2); pas(p, a, 1.6, 1.6, 0.45, True, 0.2, 0.37)
    pas(p, a + 1.6, 1.6, 1.6, 0.5, True, -0.2); pas(p, a + 1.6, 1.6, 1.6, 0.45, True, 0.2, 0.18)
    pas(p, a + 3.2, d - 3.2, 1.6, 0.8, True, 0.0)                  # un seul bruit
    a, d = T['4.6']
    sfx(p, 'clic', a + 0.8, 0.5, 0.4)
    lit_nuit(p, a, d, 0.7, ('Am9', 'Fmaj9', 'Dm9'))
    phrase(p, LOUISE, a + 13.6, 0.6, 'celesta')
    sfx(p, 'grincement', a + 14.4, 0.6)
    phrase(p, CELESTIN, a + 15.6, 0.5, 'trompette', 0.04, sourdine=True)

def s05(p, T):
    a, d = T['5.1']
    sfx(p, 'clic', a + 0.3)
    lit_nuit(p, a, d, 0.8, ('Dm9', 'Bbmaj7', 'Fmaj9'))
    phrase(p, CELESTIN, a + 1.0, 0.6, 'trompette', 0.04, sourdine=True)
    _plume(p, a + 1.5, 0.5, -0.4, 7)
    a, d = T['5.2']
    sfx(p, 'grincement', a + 0.2)
    nappe_accord(p, 'A7b9', a + 1.4, 9, 0.012)
    piano(p, 38, a + 1.4, 0.12); piano(p, 39, a + 1.4, 0.12)
    sfx(p, 'porte', a + 11.3)
    a, d = T['5.3']
    lit_nuit(p, a, d, 0.8, ('Fmaj9', 'Am9'))
    _plume(p, a + 0.6, 0.8, 0, 4)
    sfx(p, 'crac', a + 3.4, 0.6)
    sfx(p, 'frrt', a + 3.6)
    sfx(p, 'miaou', a + 6.0)
    sfx(p, 'ronron', a + 7.4)
    phrase(p, LOUISE, a + 9.2, 0.6, 'celesta')
    a, d = T['5.5']
    _oiseaux(p, a + 0.5, 1.0, 0.4)
    _oiseaux(p, a + 4.5, 0.8, -0.4)
    phrase(p, CELESTIN, a + 0.6, 0.5, 'trompette', 0.045)
    lit_piano_doux(p, a + 1.5, d - 1.5, 0.5)
    pas(p, a + 3.0, 1.0, 2.5, 0.6, pan=0.6)

def s06(p, T):
    a, d = T['6.1']
    lit_piano_doux(p, a, d, 0.5)
    sfx(p, 'bling', a + 4.6)
    sfx(p, 'hic', a + 5.0)
    a, d = T['6.2']
    tic_tac(p, a, d, 0.6, 1.0, 0.5)
    lit_piano_doux(p, a, d, 0.4)
    for k in range(10):  # couverts
        _impact(p, a + 0.8 + k * 1.1 + rng.random() * 0.4, 0.04, rng.uniform(-0.5, 0.5), 3200, 3000, 0.08, 0.3, (3000, 8000))
    sfx(p, 'miaou', a + 6.0, 0.8)
    a, d = T['6.3']
    tic_tac(p, a, d, 1.0, 1.0, 0.5)
    pas(p, a + 1.6, 1.8, 2.2, 0.6)
    sfx(p, 'porte', a + 3.3, 0.4)
    clarinette(p, 69, a + 5.0, 1.2, 0.03)
    a, d = T['6.4']
    nappe_accord(p, 'Fmaj9', a, d, 0.01)
    sfx(p, 'sursaut', a + 4.0)
    sfx(p, 'rires', a + 4.2)
    phrase(p, [[0, 72, 1], [1, 76, 1], [2, 79, 2]], a + 6.6, 0.5, 'clarinette', 0.045)   # Henri amoureux : la clarinette se fait tendre
    phrase(p, LOUISE, a + 9.8, 0.6, 'celesta')
    sfx(p, 'clap', a + 15.6, 1.2)
    cymbale(p, a + 15.6, 0.05)
    phrase(p, [[0, 72, .5], [.5, 76, .5], [1, 79, 1]], a + 15.8, 0.35, 'clarinette', 0.05)
    a, d = T['6.5']
    sfx(p, 'frrt', a + 3.4, 0.6)
    lit_piano_doux(p, a, d, 0.45)
    phrase(p, [[0, 72, 1], [1, 76, 1], [2, 74, 2]], a + 1.0, 0.5, 'clarinette', 0.04)

def s07(p, T):
    a, d = T['7.1']
    _plume(p, a + 0.4, 1.0, 0, 4.6)
    lit_nuit(p, a, d, 0.7, ('Dm9', 'G13'))
    a, d = T['7.2']
    sfx(p, 'grincement', a + 0.3)
    roulement(p, a + 0.6, a + 1.0, 0.05); cymbale(p, a + 1.0, 0.06)
    sfx(p, 'rires', a + 6.4)
    lit_jazz(p, a + 1.4, d - 1.4, 0.45, 0.3, True, True)
    a, d = T['7.3']
    tic_tac(p, a, d, 0.6, 1.0, -0.5)
    lit_piano_doux(p, a, d, 0.35)
    for k in range(3):
        sfx(p, 'toc', a + 5.4 + k * 0.45, 0.4, 0.4)
    sfx(p, 'toc', a + 8.0, 0.6)
    a, d = T['7.4']
    vent(p, a, d, 0.5)
    for t0 in (1.0, 3.2, 5.6):
        sfx(p, 'crac', a + t0)
    for k in range(10):
        sfx(p, 'crac', a + 0.4 + k * 0.8, 0.25, rng.uniform(-0.4, 0.4))
    sfx(p, 'hou', a + 4.0)
    nappe_accord(p, 'A7b9', a, d, 0.008)
    for k in range(int(d * 2)):  # suspense : pizzicati
        _impact(p, a + k * 0.5, 0.05, 0, mf(45 + (k % 2) * 3), mf(45 + (k % 2) * 3), 0.2, 0.0)
    a, d = T['7.5']
    sfx(p, 'boum', a + 0.4)
    grillons(p, a, d, 0.8)
    moteur(p, a, d, 0.25)
    lit_piano_doux(p, a + 1, d - 1, 0.4)
    sfx(p, 'rires', a + 9.9)
    a, d = T['7.6']
    sfx(p, 'vroum', a + 0.2)
    moteur(p, a + 1.0, d - 1.0, 0.8, 1.0)
    phrase(p, LOUISE_RETOURNE, a + 1.0, 0.45, 'celesta', 0.07)   # le thème de Louise se retourne pour la première fois
    lit_jazz(p, a + 2.0, d - 2.0, 0.45, 0.5, True, True)

def s08(p, T):
    a, d = T['8.1']
    foule(p, a, d, 0.9)
    roulement(p, a + 0.2, a + 1.0, 0.08); cymbale(p, a + 1.0, 0.08)
    lit_jazz(p, a + 1.0, d - 1.0, 0.42, 0.75, True, True)
    sfx(p, 'rires', a + 5.0)
    a, d = T['8.2']
    foule(p, a, d, 0.4)
    lit_jazz(p, a, d, 0.5, 0.35, False, True)
    phrase(p, CELESTIN, a + 0.4, 0.45, 'trompette', 0.045)
    phrase(p, LOUISE, a + 2.8, 0.6, 'celesta', 0.07)
    for k in range(5):
        sfx(p, 'scintille', a + 3.0 + k * 0.7)
    a, d = T['8.3']
    foule(p, a, d, 0.35)
    lit_valse(p, a, d, 0.44, 0.6, False)
    phrase(p, THEME['motif'] + [[o + 6.5, m, dd] for (o, m, dd) in THEME['reponse']], a + 0.6, 0.44, 'trompette', 0.05)   # vingt notes
    a, d = T['8.4']
    foule(p, a, d, 0.3)
    lit_piano_doux(p, a, d, 0.4)
    trompette(p, 69, a + 4.6, 0.5, 0.03, sourdine=True)
    a, d = T['8.5']
    vent(p, a, d, 0.35)
    lit_nuit(p, a, d, 0.6, ('Fmaj9', 'Cmaj9', 'Am9'))
    lit_jazz(p, a, d, 0.5, 0.12, False, True)    # la salle, derrière la porte vitrée
    for k in range(10):
        sfx(p, 'zip', a + 12.6 + k * 0.3, 0.3, 0.6)   # fwik fwik
    a, d = T['8.6-8.7']
    vent(p, a, 2.0, 0.2)
    # silence complet de 3 s (premier silence du film), puis la trompette seule
    phrase(p, THEME['lent'], a + 5.4, 0.62, 'trompette', 0.055)
    nappe_accord(p, 'D69', a + 5.8, d - 5.8, 0.007)
    for k in range(4):
        sfx(p, 'scintille', a + 6 + k * 1.5, 0.8)
    a, d = T['8.8']
    lit_nuit(p, a, d, 0.8, ('D69', 'Fmaj9'))
    phrase(p, THEME['lent'][-2:], a + 1.0, 0.7, 'trompette', 0.04)

def s09(p, T):
    a, d = T['9.1']
    moteur(p, a, d, 0.5)
    lit_nuit(p, a, d, 0.8, ('Dm9', 'Bbmaj7'))
    phrase(p, CELESTIN, a + 1.4, 0.7, 'trompette', 0.035, -12)
    a, d = T['9.2']
    tic_tac(p, a, 2.4, 1.6, 1.0, 0.0)
    sfx(p, 'tic', a + 1.2, 1.4)
    sfx(p, 'fiii', a + 2.6)
    nappe_accord(p, 'Fmaj9', a + 2.4, d - 2.4, 0.007)
    a, d = T['9.3']
    lit_nuit(p, a, d, 0.7, ('Fmaj9', 'Cmaj9', 'Am9', 'Dm9'))
    sfx(p, 'grincement', a + 3.2, 0.4)
    a, d = T['9.4']
    lit_nuit(p, a, d, 0.7, ('Fmaj9', 'Bbmaj7', 'D69'))
    phrase(p, LOUISE, a + 11.8, 0.6, 'celesta')
    a, d = T['9.5-9.6']
    lit_nuit(p, a, 8.0, 0.8, ('Dm9', 'Bbmaj7'))
    phrase(p, VALSE_MEL[:6], a + 3.4, 0.4, 'celesta', 0.04)
    phrase(p, THEME['motif'][:4], a + 4.8, 0.4, 'trompette', 0.03, sourdine=True)
    lit_piano_doux(p, a + 8.0, d - 8.0, 0.5)
    a, d = T['9.7']
    for k in range(4):
        _oiseaux(p, a + 0.6 + k * 2.4, 1.0, (-1) ** k * 0.5)
    phrase(p, LOUISE, a + 0.8, 0.7, 'celesta')
    phrase(p, LOUISE_RETOURNE, a + 6.0, 0.7, 'celesta', 0.07)     # résolu sur une note haute
    celesta(p, 89, a + 7.6, 0.06)
    nappe_accord(p, 'Fmaj9', a, d, 0.008)

def s10(p, T):
    a, d = T['10.1']
    lit_jazz(p, a, d, 0.4, 0.45, True, True, grille=['Fmaj9', 'Dm9', 'G13', 'Cmaj9'])
    for k, t0 in enumerate((0.3, 2.7, 5.1)):
        sfx(p, 'frrt', a + t0, 0.5)
        sfx(p, 'drelin' if k == 0 else 'tac', a + t0 + 0.3, 0.5)
    a, d = T['10.2']
    _oiseaux(p, a + 0.4, 0.6, 0.6)
    lit_piano_doux(p, a, d, 0.45)
    phrase(p, LOUISE, a + 8.2, 0.6, 'celesta', 0.04)
    sfx(p, 'whoosh', a + 12.6, 0.5)
    for k in range(10):
        cloche(p, 88, a + 16.4 + k * 0.12, 0.03, 0.6, 0.4)    # la cloche de l'école
    a, d = T['10.3']
    lit_piano_doux(p, a, d, 0.4)
    sfx(p, 'flash', a + 3.2)
    nappe_accord(p, 'Fmaj9', a + 4.0, 4.4, 0.008)
    a, d = T['10.4']
    sfx(p, 'whoosh', a + 0.6)
    lit_nuit(p, a, d, 0.6, ('Am9', 'Fmaj9'), True)
    phrase(p, LOUISE, a + 9.8, 0.6, 'celesta')
    sfx(p, 'hop', a + 12.6); sfx(p, 'miaou', a + 12.5, 0.6)
    sfx(p, 'chute', a + 13.3)
    a, d = T['10.5-10.6']
    _plume(p, a + 0.4, 1.0, 0, 6.0)
    nappe_accord(p, 'Dm9', a, 8, 0.009)
    phrase(p, CELESTIN, a + 1.4, 0.7, 'trompette', 0.035, sourdine=True)
    sfx(p, 'frrt', a + 6.4, 0.6)
    _oiseaux(p, a + 8.4, 0.6, 0.5)
    pas(p, a + 8.0, 3.4, 3.0, 0.4, pan=0.6)
    sfx(p, 'frrt', a + 9.6)
    lit_nuit(p, a + 8.0, d - 8.0, 0.6, ('Fmaj9', 'Am9'))
    phrase(p, LOUISE_RETOURNE, a + 13.0, 0.7, 'celesta')

def s11(p, T):
    a, d = T['11.1']
    vent(p, a, 6.0, 0.4)
    pas(p, a, 2.6, 2.5, 0.5, True)
    for k in range(int(6 / 0.6)):    # violoncelle pizzicato très bas
        _impact(p, a + k * 0.6, 0.06, 0, mf(36), mf(36), 0.3, 0.0)
    sfx(p, 'frrt', a + 6.0, 0.7)    # froissement de la soie
    nappe_accord(p, 'A7b9', a + 6.0, 3.4, 0.012)
    a, d = T['11.2']
    tic_tac(p, a, d, 1.0, 1.0, -0.5)
    nappe_accord(p, 'Dm9', a + 4.0, d - 4.0, 0.006)
    piano(p, 38, a + 12.4, 0.15); piano(p, 45, a + 12.4, 0.1)
    a, d = T['11.3']
    nappe_accord(p, 'D69', a, d, 0.01)
    phrase(p, LOUISE_RETOURNE, a + 6.4, 0.6, 'celesta', 0.07)
    pas(p, a + 7.6, 2.0, 2.0, 0.2, pan=0.6)
    a, d = T['11.4']
    tic_tac(p, a, d, 0.8, 1.0, -0.5)
    sfx(p, 'frrt', a + 2.0)
    pas(p, a + 10.4, 2.0, 1.8, 0.7)
    for t0 in (12.2, 12.8):
        sfx(p, 'toc', a + t0, 0.6)
    sfx(p, 'grincement', a + 13.4, 0.8)
    a, d = T['11.5']
    pas(p, a, 1.2, 1.8, 0.6)
    sfx(p, 'grincement', a + 1.2, 0.5)
    sfx(p, 'scintille', a + 2.0)
    nappe_accord(p, 'Bbmaj7', a + 2.0, d - 2.0, 0.008)
    a, d = T['11.6-11.7']
    # silence complet de 2 s (second silence du film), puis le violon seul, a cappella
    w = a + 2.0
    phrase(p, [[o * 3, m - 12, dd * 3] for (o, m, dd) in VALSE_MEL[:6]], w, 0.42, 'violon', 0.05)
    phrase(p, [[o * 3, m - 12, dd * 3] for (o, m, dd) in VALSE_MEL[6:12]], w + 0.42 * 3 * 12 * 0.5, 0.42, 'violon', 0.05)
    lit_piano_doux(p, a + 13.0, d - 13.0, 0.45)
    phrase(p, LOUISE_RETOURNE, a + 13.0 + 11.4, 0.6, 'celesta')
    sfx(p, 'scintille', a + 13.0 + 11.6)

def s12(p, T):
    a, d = T['12.1']
    lit_piano_doux(p, a, d, 0.5)
    sfx(p, 'frrt', a + 1.0, 0.5)
    sfx(p, 'ronron', a + 8.2)
    a, d = T['12.2']
    lit_piano_doux(p, a, d, 0.45)
    for k in range(10):
        _impact(p, a + 0.5 + k * 1.4 + rng.random() * 0.4, 0.035, rng.uniform(-0.5, 0.5), 3200, 3000, 0.08, 0.3, (3000, 8000))
    sfx(p, 'rires', a + 13.0, 0.7)
    a, d = T['12.3']
    lit_piano_doux(p, a, d, 0.45)
    phrase(p, [[0, 72, 1], [1, 76, 1], [2, 79, 2]], a + 0.6, 0.5, 'clarinette', 0.045)
    sfx(p, 'scintille', a + 3.6)
    a, d = T['12.4']
    vent(p, a, 3.4, 0.3)
    foule(p, a + 3.0, d - 3.0, 1.0)
    lit_jazz(p, a + 3.4, d - 3.4, 0.4, 0.8, True, True)
    for t0 in (0.6, 2.0):
        sfx(p, 'pop', a + 3.4 + t0)
    applaudissements(p, a + 3.4 + 4.4, 2.0, 0.6)
    a, d = T['12.5']
    foule(p, a, d, 0.6)
    roulement(p, a + 0.2, a + 0.6, 0.07); cymbale(p, a + 0.6, 0.06)
    lit_piano_doux(p, a + 4.6, d - 4.6, 0.4)
    phrase(p, CELESTIN, a + 5.4, 0.5, 'trompette', 0.04)
    phrase(p, LOUISE, a + 7.2, 0.6, 'celesta')
    a, d = T['12.6-12.7']
    # Léon attaque le morceau sans nom en entier ; les thèmes de Célestin et de Louise s'entrelacent
    b = 0.5
    lit_jazz(p, a + 2.4, d - 2.4, b, 0.9, False, True)
    w = a + 2.4
    cycle = 4 * b * 4
    k = 0
    while w < a + d - 3:
        phrase(p, THEME['motif'] if k % 2 == 0 else THEME['reponse'], w + 2 * b, b * 2, 'trompette', 0.055)
        phrase(p, CELESTIN, w, b, 'trompette', 0.03, 12, pan=-0.5, sourdine=True)
        phrase(p, LOUISE_RETOURNE, w + 8 * b, b, 'celesta', 0.05, pan=0.5)
        w += cycle; k += 1
    nappe_accord(p, 'D69', a + 4.0 + 13, 5, 0.01)
    for k in range(6):
        sfx(p, 'scintille', a + 4.0 + 13 + k * 0.8, 0.8)
    cymbale(p, a + 4.0 + 18.0, 0.08, 3)
    a, d = T['12.8']
    for k in range(12):
        sfx(p, 'dong', a + 0.25 + k * 0.5, 0.8)
    w = a + 6.2
    foule(p, w, 4.0, 0.3)
    trompette(p, 74, w + 0.2, 4.0, 0.05)    # la note tenue que le jazz-band laisse s'éteindre
    nappe_accord(p, 'D69', w + 0.2, 4.0, 0.008)
    cymbale(p, w + 4.0, 0.09, 4)
    phrase(p, THEME['lent'], w + 4.2, 0.55, 'trompette', 0.05)
    applaudissements(p, w + 4.0, 2.0, 0.7)
    a, d = T['12.9']
    foule(p, a, d, 0.3)
    lit_nuit(p, a, d, 0.6, ('Fmaj9', 'D69'))
    phrase(p, LOUISE_RETOURNE, a + 5.4, 0.6, 'celesta')
    phrase(p, CELESTIN, a + 8.4, 0.5, 'trompette', 0.04)

def s13(p, T):
    a, d = T['E.1']
    vent(p, a, d, 0.3)
    gramophone(p, a, 4.0, 0.03)
    lit_jazz(p, a, 4.0, 0.5, 0.3, True, False)
    lit_piano_doux(p, a + 4.0, d - 4.0, 0.45)
    moteur(p, a + 5.5, 3.5, 0.3, 0.5)
    a, d = T['E.2']
    _oiseaux(p, a + 0.6, 0.6, 0.4)
    lit_piano_doux(p, a, d, 0.5)
    phrase(p, CELESTIN, a + 4.6, 0.5, 'trompette', 0.04)
    phrase(p, LOUISE_RETOURNE, a + 6.0, 0.6, 'celesta')
    a, d = T['E.3']
    tic_tac(p, a, 2.6, 0.9, 1.0, 0.0)
    moteur(p, a + 2.6, d - 2.6, 0.25)
    sfx(p, 'fiii', a + 3.6)
    lit_nuit(p, a + 2.6, d - 2.6, 0.7, ('Fmaj9', 'D69'))
    phrase(p, [[o * 2, m - 12, dd * 2] for (o, m, dd) in VALSE_MEL[:4]], a + 7.6, 0.42, 'violon', 0.02)   # un violon, très doucement
    a, d = T['E.4']
    nappe_accord(p, 'D69', a, d, 0.01)
    phrase(p, CELESTIN_RESOLU, a + 3.2, 0.6, 'trompette', 0.055)   # et cette fois, elles résolvent
    cloche(p, 50, a + 7.0, 0.05)
    a, d = T['fin']
    nappe_accord(p, 'D69', a, d - 1, 0.008)
    celesta(p, 86, a + 0.6, 0.05); celesta(p, 81, a + 1.4, 0.05); celesta(p, 77, a + 2.2, 0.05); celesta(p, 74, a + 3.0, 0.06)

PARTITIONS = {'seq00': s00, 'seq01': s01, 'seq02': s02, 'seq03': s03, 'seq04': s04, 'seq05': s05, 'seq06': s06, 'seq07': s07,
              'seq08': s08, 'seq09': s09, 'seq10': s10, 'seq11': s11, 'seq12': s12, 'seq13': s13}

def bande(mod, numero_chapitre):
    T, total, cartons, m = debuts(mod)
    p = Piste(total + 2)
    PARTITIONS[mod](p, T)
    for a in cartons:
        carton_musique(p, a, numero_chapitre)
    projecteur(p, 0, total, 0.004)   # le ronronnement discret du projecteur, d'un bout à l'autre
    st = p.stereo()[:int(total * SR)]
    # petits fondus d'entrée et de sortie pour enchaîner les morceaux sans clic
    n = int(0.05 * SR)
    st[:n] *= np.linspace(0, 1, n)[:, None]; st[-n:] *= np.linspace(1, 0, n)[:, None]
    return st, total
