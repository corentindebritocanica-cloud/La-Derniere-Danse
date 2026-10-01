#!/usr/bin/env python3
"""Construit les plans du film : chaque film/plan-XX.html est autonome
(bibliothèques film/lib/*.js + code du plan film/src/plan-XX.js inlinés).
Usage : python3 film/build.py            (tous les plans)
        python3 film/build.py 05 10      (seulement certains)"""
import json, os, sys, html
ICI = os.path.dirname(os.path.abspath(__file__))
LIBS = ['moteur.js', 'musique.js', 'personnages.js', 'decors.js']
plans = json.load(open(os.path.join(ICI, 'plans.json'), encoding='utf-8'))
gabarit = open(os.path.join(ICI, 'src', 'page.html'), encoding='utf-8').read()
choix = sys.argv[1:]
for num, meta in plans.items():
    if choix and num not in choix:
        continue
    code = ''.join('<script>\n' + open(os.path.join(ICI, 'lib', f), encoding='utf-8').read() + '\n</script>\n' for f in LIBS)
    code += '<script>\n' + open(os.path.join(ICI, 'src', f'plan-{num}.js'), encoding='utf-8').read() + '\n</script>'
    page = gabarit
    for cle in ['TITRE', 'SURTITRE', 'SOUSTITRE', 'DESCRIPTION', 'NOTE']:
        page = page.replace('{{' + cle + '}}', html.escape(meta[cle], quote=(cle == 'DESCRIPTION')))
    page = page.replace('{{SCRIPTS}}', code)
    sortie = os.path.join(ICI, meta['fichier'])
    open(sortie, 'w', encoding='utf-8').write(page)
    print('construit', meta['fichier'])
