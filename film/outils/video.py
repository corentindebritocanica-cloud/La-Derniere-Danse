"""Export vidéo : rend chaque plan image par image + sa bande-son (OfflineAudioContext), puis assemble le film.
Usage : python3 film/outils/video.py [01 02 ...] [--fps 25] [--crf 18] [--out dossier] [--1080 | --4k | --echelle N]
Sans numéro : tous les plans de plans.json, puis film complet « la-derniere-danse[-1080p|-4k].mp4 ».
Le film est dessiné en coordonnées 1280×720 : --1080 le dessine ×1,5 (1920×1080), --4k ×3 (3840×2160), net, sans flou."""
from playwright.sync_api import sync_playwright
import os, sys, json, base64, subprocess, wave
F = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
a = sys.argv[1:]
def flag(n):
    global a
    if n in a: a = [x for x in a if x != n]; return True
    return False
def opt(n, d):
    global a
    if n in a:
        i = a.index(n); v = a[i+1]; a = a[:i]+a[i+2:]; return v
    return d
E = 3.0 if flag('--4k') else 1.5 if flag('--1080') else float(opt('--echelle', '1'))
SUF = {1.0: '', 1.5: '-1080p', 3.0: '-4k'}.get(E, '-x%g' % E)
CW, CH = round(1280*E), round(720*E)
FPS = int(opt('--fps', '25')); CRF = opt('--crf', '18'); OUT = opt('--out', os.path.join(F, 'video')); SR = 48000
os.makedirs(OUT, exist_ok=True)
plans = json.load(open(os.path.join(F, 'plans.json')))
nums = a or sorted(plans)

# Capte les options passées à L.film (rendu, partition, durée) sans toucher au moteur.
INIT = """
(()=>{const o={};Object.defineProperty(o,'film',{configurable:true,
  set(f){this._f=f},get(){const f=this._f;return opts=>{window.LDD_opts=opts;return f(opts)}}});
  window.LDD=o;})();
"""
AUDIO = """async ()=>{
  const o=window.LDD_opts, D=o.duree, SR=%d;
  const ac=new OfflineAudioContext(2, Math.ceil(D*SR)+SR, SR);
  const bus=ac.createGain(); bus.connect(ac.destination);
  try{o.partition(ac,bus,0)}catch(e){console.error('partition',e)}
  const b=await ac.startRendering(); const n=Math.ceil(D*SR);
  const L=b.getChannelData(0), R=b.numberOfChannels>1?b.getChannelData(1):L;
  const out=new Int16Array(n*2);
  for(let i=0;i<n;i++){out[2*i]=Math.max(-1,Math.min(1,L[i]))*32767;out[2*i+1]=Math.max(-1,Math.min(1,R[i]))*32767}
  window.LDD_pcm=new Uint8Array(out.buffer); return window.LDD_pcm.length;
}""" % SR
CHUNK = """(s)=>{const u=window.LDD_pcm.subarray(s,s+4000000);let r='';for(let i=0;i<u.length;i+=32768)r+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(r)}"""
FRAMES = """([a,n,fps,E,CW,CH])=>{const cv=document.getElementById('film'),r=[];
  if(cv.width!==CW){cv.width=CW;cv.height=CH}
  const cx=cv.getContext('2d');
  for(let k=0;k<n;k++){cx.setTransform(E,0,0,E,0,0);window.LDD_rendu((a+k)/fps);r.push(cv.toDataURL('image/jpeg',.93).slice(23))}return r}"""

def rendre(num, pg):
    f = plans[num]['fichier']; errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://'+os.path.join(F, f)); pg.wait_for_timeout(1500)
    D = pg.evaluate('window.LDD_opts.duree')
    # son
    n = pg.evaluate(AUDIO); pcm = b''
    for s in range(0, n, 4000000): pcm += base64.b64decode(pg.evaluate(CHUNK, s))
    wav = os.path.join(OUT, f'plan-{num}.wav')
    with wave.open(wav, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
    # images
    mp4 = os.path.join(OUT, f'plan-{num}{SUF}.mp4'); N = round(D*FPS); LOT = max(4, int(50 / (E*E)))
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', str(FPS), '-i', '-',
                           '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', CRF, '-pix_fmt', 'yuv420p',
                           '-c:a', 'aac', '-b:a', '192k', '-ar', str(SR), '-shortest', '-movflags', '+faststart', mp4], stdin=subprocess.PIPE)
    for a0 in range(0, N, LOT):
        for d in pg.evaluate(FRAMES, [a0, min(LOT, N-a0), FPS, E, CW, CH]): ff.stdin.write(base64.b64decode(d))
    ff.stdin.close(); ff.wait(); os.remove(wav)
    print(f'plan {num} : {D} s, {N} images, {CW}x{CH}', 'ERREURS '+str(errs) if errs else '', flush=True)
    return mp4

with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    faits = []
    for num in nums:
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); pg.add_init_script(INIT)
        faits.append(rendre(num, pg)); pg.close()
    b.close()
if not sys.argv[1:] or len(nums) == len(plans):
    lst = os.path.join(OUT, 'liste.txt')
    open(lst, 'w').write(''.join("file '%s'\n" % m.replace(chr(92), '/') for m in faits))
    film = os.path.join(OUT, f'la-derniere-danse{SUF}.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', film], check=True)
    print('film', film)
