"""Assemble le film entier en UNE vidéo sonorisée : ../video/la-derniere-danse.mp4

    python3 film.py son      → calcule la bande-son (../video/bande-son.wav)
    python3 film.py video    → colle les 14 morceaux et la bande-son en un seul MP4
"""
import os, subprocess, sys
import numpy as np
from scipy.io import wavfile
from son import SR, master
from partition import bande
from rendu import MORCEAUX

ICI = os.path.dirname(os.path.abspath(__file__))
VID = os.path.join(ICI, '..', 'video')

def son():
    morceaux = []
    for k, (n, mod, titre) in enumerate(MORCEAUX):
        st, total = bande(mod, k)
        # même longueur que la vidéo rendue (un nombre entier d'images)
        n_img = int(round(total * 24))
        n_ech = int(round(n_img / 24 * SR))
        st = st[:n_ech] if len(st) >= n_ech else np.vstack([st, np.zeros((n_ech - len(st), 2))])
        print(f'{n} {titre} : {n_img} images, {n_ech / SR:.3f} s', flush=True)
        morceaux.append(st)
    tout = master(np.concatenate(morceaux))
    wavfile.write(os.path.join(VID, 'bande-son.wav'), SR, (tout * 32767).astype(np.int16))
    print('durée totale', len(tout) / SR)

def video(debit='600k'):
    liste = os.path.join(VID, 'liste.txt')
    sortie = os.path.join(VID, 'la-derniere-danse.mp4')
    wav = os.path.join(VID, 'bande-son.wav')
    base = ['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', liste, '-i', wav, '-map', '0:v', '-map', '1:a',
            '-c:v', 'libx264', '-preset', 'medium', '-tune', 'animation', '-b:v', debit, '-pix_fmt', 'yuv420p']
    log = os.path.join(VID, 'ffmpeg2pass')
    subprocess.run(base + ['-pass', '1', '-passlogfile', log, '-an', '-f', 'mp4', '/dev/null'], check=True)
    subprocess.run(base + ['-pass', '2', '-passlogfile', log, '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-shortest', sortie], check=True)
    for f in os.listdir(VID):
        if f.startswith('ffmpeg2pass'):
            os.remove(os.path.join(VID, f))
    print(sortie, os.path.getsize(sortie) // 1e6, 'Mo')

if __name__ == '__main__':
    {'son': son, 'video': lambda: video(*(sys.argv[2:3] or []))}[sys.argv[1]]()
