"""Rend un morceau du film.

    python3 rendu.py 03              → ../video/03-....mp4
    python3 rendu.py 03 --apercu 2.5 7 12   → images PNG aux temps donnés (dans ../apercus/)
    python3 rendu.py tout            → tous les morceaux
"""
import importlib, os, sys, time
from moteur import rendre, duree_totale, W, H

ICI = os.path.dirname(os.path.abspath(__file__))
MORCEAUX = [
    ('00', 'seq00', 'prologue'),
    ('01', 'seq01', 'celestin'),
    ('02', 'seq02', 'louise'),
    ('03', 'seq03', 'le-concours'),
    ('04', 'seq04', 'la-marche-jusqua-purpan'),
    ('05', 'seq05', 'le-portrait'),
    ('06', 'seq06', 'le-diner-avec-henri'),
    ('07', 'seq07', 'levasion-par-la-glycine'),
    ('08', 'seq08', 'la-soiree-des-lendemains'),
    ('09', 'seq09', 'letoile-filante'),
    ('10', 'seq10', 'la-semaine-volee'),
    ('11', 'seq11', 'le-violon'),
    ('12', 'seq12', 'la-derniere-danse'),
    ('13', 'seq13', 'epilogue'),
]

def charger(num):
    for n, mod, titre in MORCEAUX:
        if n == num:
            m = importlib.import_module(mod)
            return m.PLANS, f'{n}-{titre}'
    raise SystemExit('morceau inconnu : ' + num)

def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__); return
    nums = [m[0] for m in MORCEAUX] if args[0] == 'tout' else [args[0]]
    if '--apercu' in args:
        temps = [float(x) for x in args[args.index('--apercu') + 1:]]
        plans, nom = charger(nums[0])
        dossier = os.path.join(ICI, '..', 'apercus'); os.makedirs(dossier, exist_ok=True)
        print(nom, f'{duree_totale(plans):.1f} s')
        for tt in temps:
            sortie = os.path.join(dossier, f'{nom}_{tt:06.2f}.png')
            rendre(plans, sortie, apercu_png=tt)
            print(sortie)
        return
    dossier = os.path.join(ICI, '..', 'video'); os.makedirs(dossier, exist_ok=True)
    for n in nums:
        plans, nom = charger(n)
        t0 = time.time()
        sortie = os.path.join(dossier, nom + '.mp4')
        print(f'{nom} : {duree_totale(plans):.1f} s', flush=True)
        rendre(plans, sortie)
        print(f'  fini en {time.time() - t0:.0f} s', flush=True)

if __name__ == '__main__':
    main()
