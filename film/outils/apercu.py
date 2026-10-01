"""Planche-contact d'un plan : rend les instants demandés (en secondes) et vérifie qu'il n'y a pas d'erreur JS.
Usage : python3 film/outils/apercu.py plan-06-marche.html 5 12 20.5 31 [--out /chemin/planche.png]
Puis regarder la planche (outil Read sur le PNG). 2 images par ligne, 640 px de large chacune."""
from playwright.sync_api import sync_playwright
import os,sys
F=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
a=sys.argv[1:];out=None
if '--out' in a:i=a.index('--out');out=a[i+1];a=a[:i]+a[i+2:]
f=a[0];times=[float(x) for x in a[1:]];out=out or '/tmp/planche-'+f[:7]+'.png'
with sync_playwright() as p:
    b=p.chromium.launch();errs=[]
    pg=b.new_page(viewport={'width':1280,'height':900});pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' else None)
    pg.goto('file://'+os.path.join(F,f));pg.wait_for_timeout(1200)
    imgs=[pg.evaluate(f"(()=>{{window.LDD_rendu({t});return document.getElementById('film').toDataURL('image/jpeg',.7)}})()") for t in times]
    sheet='<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(2,640px)">'+''.join(f'<img src="{d}" width=640>' for d in imgs)+'</body>'
    p2=b.new_page(viewport={'width':1280,'height':360});p2.set_content(sheet);p2.wait_for_timeout(300);p2.screenshot(path=out,full_page=True)
    print('planche',out);print('erreurs',errs);b.close()
