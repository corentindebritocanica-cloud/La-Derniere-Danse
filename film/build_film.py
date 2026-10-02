#!/usr/bin/env python3
"""Assemble les quatorze plans en un seul film : film/film-complet.html (autonome).
Les bibliothèques sont inlinées une fois ; L.film est détourné pour que chaque plan s'enregistre
dans L.PLANS au lieu d'ouvrir son propre lecteur. Usage : python3 film/build_film.py"""
import json, os
ICI = os.path.dirname(os.path.abspath(__file__))
LIBS = ['moteur.js', 'musique.js', 'personnages.js', 'decors.js']
plans = json.load(open(os.path.join(ICI, 'plans.json'), encoding='utf-8'))
nums = sorted(plans)
code = ''.join('<script>\n' + open(os.path.join(ICI, 'lib', f), encoding='utf-8').read() + '\n</script>\n' for f in LIBS)
code += '<script>LDD.PLANS=[];LDD.film=function(o){LDD.PLANS.push(o)};</script>\n'
for n in nums:
    code += f'<script>/* ——— plan {n} ——— */\n' + open(os.path.join(ICI, 'src', f'plan-{n}.js'), encoding='utf-8').read() + '\n</script>\n'
meta = [{'n': n, 'titre': 'Ouverture' if n == '01' else plans[n]['TITRE']} for n in nums]
page = open(os.path.join(ICI, 'src', 'film-complet.html'), encoding='utf-8').read()
page = page.replace('{{SCRIPTS}}', code).replace('{{META}}', json.dumps(meta, ensure_ascii=False))
open(os.path.join(ICI, 'film-complet.html'), 'w', encoding='utf-8').write(page)
print('construit film-complet.html', len(page)//1024, 'Ko')
