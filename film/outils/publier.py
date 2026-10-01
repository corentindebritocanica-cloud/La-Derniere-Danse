"""Prépare un plan pour la publication en artefact claude.ai (le service ajoute lui-même doctype/html/head/body).
Usage : python3 film/outils/publier.py plan-05-danse.html:danse.html [dossier_sortie]
Le dossier de sortie par défaut est film/outils/pub/ (ignoré par git). Publier ensuite pub/danse.html
avec l'outil Artifact en passant l'URL existante du plan (voir film/INSTRUCTIONS.md)."""
import re,sys,os
F=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args=[a for a in sys.argv[1:] if ':' in a];D=next((a for a in sys.argv[1:] if ':' not in a),os.path.join(F,'outils','pub'))
os.makedirs(D,exist_ok=True)
for a in args:
    f,o=a.split(':');s=open(os.path.join(F,f),encoding='utf-8').read()
    s=re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*','',s)
    s=s.replace('</head>\n<body>\n','').replace('</body>\n</html>\n','')
    open(os.path.join(D,o),'w',encoding='utf-8').write(s);print(os.path.join(D,o))
