#!/usr/bin/env python3
"""Exporte film/film-complet.html en MP4 (1280x720, 30 i/s, AAC).
Son : rendu hors ligne (OfflineAudioContext), plan par plan, puis mixé.
Image : le canevas est dessiné à chaque instant t puis capturé en JPEG.
Usage : python3 outils/exporter_mp4.py [sortie.mp4] [--test N]   (N = secondes de test)
"""
import sys, os, base64, subprocess, json, time, wave, io
import numpy as np
from playwright.sync_api import sync_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.join(ICI, '..', 'film-complet.html')
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SORTIE = args[0] if args else os.path.join(ICI, '..', 'La-Derniere-Danse.mp4')
TEST = None
if '--test' in sys.argv:
    TEST = float(sys.argv[sys.argv.index('--test') + 1])
    if SORTIE.isdigit():
        SORTIE = os.path.join(ICI, '..', 'test.mp4')
FPS, SR = 30, 44100

JS_AUDIO = """
async ([i, sr]) => {
  const L = window.LDD, P = L.PLANS, d = P[i].duree + 5;
  const oac = new OfflineAudioContext(2, Math.ceil(sr * d), sr);
  const m = oac.createGain(); m.connect(oac.destination);
  const b = oac.createGain(); b.connect(m);
  P[i].partition(oac, b, 0.05);
  const buf = await oac.startRendering();
  const n = buf.length, out = new Int16Array(n * 2);
  const l = buf.getChannelData(0), r = buf.numberOfChannels > 1 ? buf.getChannelData(1) : l;
  for (let k = 0; k < n; k++) {
    out[2*k] = Math.max(-1, Math.min(1, l[k])) * 32767;
    out[2*k+1] = Math.max(-1, Math.min(1, r[k])) * 32767;
  }
  const u = new Uint8Array(out.buffer); let s = '';
  for (let k = 0; k < u.length; k += 32768) s += String.fromCharCode.apply(null, u.subarray(k, k + 32768));
  return btoa(s);
}
"""

JS_FRAMES = """
([t0, n, fps]) => {
  const cv = document.getElementById('film'), out = [];
  for (let k = 0; k < n; k++) { window.LDD_rendu(t0 + k / fps); out.push(cv.toDataURL('image/jpeg', 0.93).slice(23)); }
  return out;
}
"""

def main():
    t_debut = time.time()
    with sync_playwright() as p:
        nav = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        page = nav.new_page(viewport={'width': 1280, 'height': 720})
        page.goto('file://' + os.path.abspath(FILM))
        page.wait_for_function('window.LDD_OFF && window.LDD && window.LDD.PLANS')
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(2500)
        info = page.evaluate("({off: window.LDD_OFF, dur: window.LDD.PLANS.map(p => p.duree)})")
        off, durs = info['off'], info['dur']
        total = off[-1] + durs[-1]
        if TEST: total = min(total, TEST)
        print(f'{len(durs)} plans, durée {total:.1f} s', flush=True)

        # ---- son
        nech = int(np.ceil(total * SR)) + SR * 6
        mix = np.zeros((nech, 2), dtype=np.float32)
        for i in range(len(durs)):
            if off[i] >= total: break
            b64 = page.evaluate(JS_AUDIO, [i, SR])
            pcm = np.frombuffer(base64.b64decode(b64), dtype=np.int16).reshape(-1, 2).astype(np.float32) / 32767
            a = int(round(off[i] * SR)); e = min(a + len(pcm), nech)
            mix[a:e] += pcm[:e - a]
            print(f'  son plan {i+1}: ok ({time.time()-t_debut:.0f} s)', flush=True)
        mix = mix[:int(total * SR)]
        pic = float(np.abs(mix).max()); print('crête audio', round(pic, 3))
        if pic > 0.98: mix *= 0.98 / pic
        wav = SORTIE + '.wav'
        with wave.open(wav, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        del mix

        # ---- image
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS),
                               '-c:v', 'mjpeg', '-i', '-', '-i', wav,
                               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
                               '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', SORTIE],
                              stdin=subprocess.PIPE)
        nf = int(total * FPS); lot = FPS * 2; k = 0
        while k < nf:
            n = min(lot, nf - k)
            for s in page.evaluate(JS_FRAMES, [k / FPS, n, FPS]):
                ff.stdin.write(base64.b64decode(s))
            k += n
            if (k // lot) % 15 == 0 or k >= nf:
                print(f'  image {k}/{nf} ({100*k/nf:.0f} %) — {time.time()-t_debut:.0f} s', flush=True)
        ff.stdin.close(); ff.wait()
        nav.close()
    os.remove(wav)
    print('terminé :', SORTIE, round(os.path.getsize(SORTIE) / 1e6, 1), 'Mo', flush=True)

main()
