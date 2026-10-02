/* La Dernière Danse — moteur commun des plans
   Outils mathématiques, cartons, grain de pellicule, lecteur (lecture, son, plein écran). */
(function(){
const L=window.LDD=window.LDD||{};
L.W=1280;L.H=720;
L.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
L.lerp=(a,b,t)=>a+(b-a)*t;
L.eio=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
L.eoc=t=>1-Math.pow(1-t,3);
L.eic=t=>t*t*t;
L.seg=(t,a,b)=>L.clamp((t-a)/(b-a),0,1);
L.rng=function(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
L.mix=function(a,b,t,al){const A=hex(a),B=hex(b);const r=Math.round(L.lerp(A[0],B[0],t)),g=Math.round(L.lerp(A[1],B[1],t)),bl=Math.round(L.lerp(A[2],B[2],t));return al==null?`rgb(${r},${g},${bl})`:`rgba(${r},${g},${bl},${al})`};
L.setLS=(c,v)=>{if('letterSpacing' in c)c.letterSpacing=v};
L.reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);

/* Palette du roman */
L.C={papier:'#f1e7d3',encre:'#1a1512',rouge:'#a8201a',bleu:'#1f3a5f',brun:'#5a3e1b',or:'#e3b23c',ombre:'#0b0907',grisChat:'#7d7a76'};
L.F={titre:"'Limelight', Georgia, serif",texte:"'Bodoni Moda', Georgia, serif",main:"'La Belle Aurore', cursive",machine:"'Special Elite', 'Courier New', monospace"};

/* Étoile à cinq branches */
L.star=function(c,x,y,ro,ri,fill,stroke,lw){c.beginPath();for(let i=0;i<10;i++){const r=i%2?ri:ro,an=-Math.PI/2+i*Math.PI/5;c.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r)}c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||2;c.stroke()}};

/* Carton de cinéma muet : lines = [{s,y,f,c,ls}], option star = y de l'étoile rouge */
L.carton=function(c,lines,a,starY){
  if(a<=0)return;const W=L.W,H=L.H;c.save();c.globalAlpha=a;
  c.strokeStyle='#b88f2e';c.lineWidth=2;c.strokeRect(70,70,W-140,H-140);c.lineWidth=1;c.strokeRect(82,82,W-164,H-164);
  [[82,82,0],[W-82,82,Math.PI/2],[W-82,H-82,Math.PI],[82,H-82,-Math.PI/2]].forEach(([x,y,r])=>{c.save();c.translate(x,y);c.rotate(r);
    for(let i=0;i<=6;i++){const an=i*Math.PI/12;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(an)*54,Math.sin(an)*54);c.stroke()}c.restore()});
  c.textAlign='center';
  for(const l of lines){c.fillStyle=l.c||L.C.papier;c.font=l.f;L.setLS(c,l.ls||'0px');c.fillText(l.s,W/2,l.y)}
  L.setLS(c,'0px');if(starY!=null)L.star(c,W/2,starY,17,7,L.C.rouge);
  c.restore();
};
/* Opacité d'un carton : apparition, tenue, disparition */
L.fade=(t,a,b,inn,out)=>t<a||t>b?0:Math.min(1,(t-a)/(inn||.6),(b-t)/(out||.6));

/* Pellicule : vignettage + grain + rayures + scintillement */
const vg=new WeakMap();
L.pellicule=function(c){
  const W=L.W,H=L.H;let g=vg.get(c);
  if(!g){g=c.createRadialGradient(W/2,H/2,H*.32,W/2,H/2,H*.95);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.58)');vg.set(c,g)}
  c.fillStyle=g;c.fillRect(0,0,W,H);
  if(L.reduce)return;
  for(let i=0;i<160;i++){const v=Math.random();c.fillStyle=v<.5?`rgba(241,231,211,${.03+Math.random()*.07})`:`rgba(0,0,0,${.05+Math.random()*.1})`;const s=1+Math.random()*1.8;c.fillRect(Math.random()*W,Math.random()*H,s,s)}
  if(Math.random()<.05){c.strokeStyle='rgba(241,231,211,.14)';c.lineWidth=1;const x=Math.random()*W;c.beginPath();c.moveTo(x,0);c.lineTo(x+Math.random()*6-3,H);c.stroke()}
  c.fillStyle=`rgba(0,0,0,${Math.random()*.035})`;c.fillRect(0,0,W,H);
};
/* Répliques : durée d'affichage proportionnelle à la longueur (≈ 10 caractères par seconde + 1,3 s de fondu),
   et empilement vers le haut quand une réplique suivante apparaît avant que la précédente ait disparu. */
L.lue=l=>Math.min(9,Math.max(l[3]||1.5,1.3+l[2].length/10));
/* au plus 4 répliques à l'écran : quand 3 plus récentes ont commencé, la plus ancienne s'efface */
L.coupe=(t,lignes,l)=>{const n=lignes.filter(m=>m[0]>l[0]&&m[0]<=t).map(m=>m[0]).sort((a,b)=>a-b);return n.length>=3?1-L.seg(t,n[2]+.5,n[2]+1.1):1};
L.pile=(t,lignes,l)=>{let o=0;for(const m of lignes)if(m[0]>l[0])o+=34*L.seg(t,m[0]-.25,m[0]+.1);return o};
L.noir=function(c,a){if(a>0){c.fillStyle=`rgba(0,0,0,${Math.min(1,a)})`;c.fillRect(0,0,L.W,L.H)}};

/* Plein écran : API standard, puis préfixe webkit (iPad), sinon plein écran « maison » en CSS (iPhone, où Safari
   ne met en plein écran que les vidéos). Une croix permet d'en sortir ; Échap aussi. */
L.pleinEcran=function(s){
  const d=document,natif=d.fullscreenElement||d.webkitFullscreenElement;
  if(!d.getElementById('ldd-pfs')){const st=d.createElement('style');st.id='ldd-pfs';st.textContent=
    '.pseudo-fs{position:fixed!important;inset:0!important;z-index:9999;width:100vw!important;height:100vh!important;height:100dvh!important;max-width:none!important;aspect-ratio:auto!important;margin:0!important;border:0!important;box-shadow:none!important;background:#000!important}'+
    '.pseudo-fs canvas{object-fit:contain}.ldd-sortir{display:none}.pseudo-fs .ldd-sortir{display:grid;place-items:center;position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:calc(10px + env(safe-area-inset-right,0px));width:44px;height:44px;border-radius:50%;border:1px solid rgba(241,231,211,.5);background:rgba(0,0,0,.45);color:#f1e7d3;font-size:22px;line-height:1;cursor:pointer;z-index:2}'+
    'html.ldd-pfs-on,html.ldd-pfs-on body{overflow:hidden}';d.head.appendChild(st)}
  if(!s.querySelector('.ldd-sortir')){const b=d.createElement('button');b.type='button';b.className='ldd-sortir';b.setAttribute('aria-label','Quitter le plein écran');b.textContent='×';
    b.addEventListener('click',e=>{e.stopPropagation();L.pleinEcran(s)});s.appendChild(b);
    d.addEventListener('keydown',e=>{if(e.key==='Escape'&&s.classList.contains('pseudo-fs'))L.pleinEcran(s)})}
  if(s.classList.contains('pseudo-fs')){s.classList.remove('pseudo-fs');d.documentElement.classList.remove('ldd-pfs-on');return}
  if(natif){try{const p=(d.exitFullscreen||d.webkitExitFullscreen).call(d);if(p&&p.catch)p.catch(()=>{})}catch(e){}return}
  const req=s.requestFullscreen||s.webkitRequestFullscreen;
  const maison=()=>{s.classList.add('pseudo-fs');d.documentElement.classList.add('ldd-pfs-on');try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}};
  if(req&&(d.fullscreenEnabled||d.webkitFullscreenEnabled)){try{const p=req.call(s);if(p&&p.catch)p.catch(maison)}catch(e){maison()}}else maison();
};

/* Lecteur : relie le canevas et les boutons de la page.
   opts = {duree, rendu(c,t), partition(ac,sortie,T), affiche, polices:[...]} */
L.film=function(opts){
  const cv=document.getElementById('film'),c=cv.getContext('2d');
  const playBtn=document.getElementById('play'),prog=document.getElementById('prog'),tc=document.getElementById('tc');
  const DUR=opts.duree;let ac=null,bus=null,muted=false,t0=0,playing=false,raf=0;
  const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');
  const draw=t=>{c.save();opts.rendu(c,t);c.restore();L.pellicule(c)};
  window.LDD_rendu=draw;
  function startAudio(){
    try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();}catch(e){ac=null;return 0}
    if(ac.state==='suspended')ac.resume();
    if(bus){try{bus.gain.cancelScheduledValues(0);bus.disconnect()}catch(e){}}
    bus=ac.createGain();bus.gain.value=muted?0:1;bus.connect(ac.destination);
    try{opts.partition(ac,bus,ac.currentTime+.08)}catch(e){console.error(e)}
    return 80;
  }
  function tick(){
    let t=(performance.now()-t0)/1000;if(t>=DUR){t=DUR;playing=false}
    t=Math.max(0,t);draw(t);prog.style.width=(t/DUR*100)+'%';tc.textContent=fmt(t)+' / '+fmt(DUR);
    if(playing)raf=requestAnimationFrame(tick);else{playBtn.hidden=false;playBtn.setAttribute('aria-label','Revoir le plan')}
  }
  function play(){cancelAnimationFrame(raf);const lag=startAudio();t0=performance.now()+lag;playing=true;playBtn.hidden=true;raf=requestAnimationFrame(tick)}
  playBtn.addEventListener('click',play);
  document.getElementById('replay').addEventListener('click',play);
  const snd=document.getElementById('sound');
  snd.addEventListener('click',()=>{muted=!muted;snd.textContent='Son : '+(muted?'coupé':'activé');snd.setAttribute('aria-pressed',String(!muted));if(bus&&ac)bus.gain.setValueAtTime(muted?0:1,ac.currentTime)});
  document.getElementById('fs').addEventListener('click',()=>L.pleinEcran(document.getElementById('screen')));
  tc.textContent='00:00 / '+fmt(DUR);
  draw(opts.affiche);
  const fonts=opts.polices||["26px 'Limelight'","italic 22px 'Bodoni Moda'","20px 'Special Elite'","30px 'La Belle Aurore'"];
  if(document.fonts&&document.fonts.load){Promise.all(fonts.map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>{if(!playing)draw(opts.affiche)})}
};
})();
