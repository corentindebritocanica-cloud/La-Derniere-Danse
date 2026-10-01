/* Plan 08 — L'évasion par la glycine (24 s)
   D'abord le plan coté de l'enveloppe 3 (« Étude de résistance — glycine », plan n° 0714), qui se dessine
   trait par trait sur papier ; la caméra plonge dans le dessin et il devient la vraie façade de la maison Sarrail.
   Louise sort par la 3e fenêtre du 1er étage, se repose sur la fourche pendant que le grand-père allume,
   pose le pied sur la 3e patte (« branlante, à éviter ») qui cède, se rattrape, et rejoint la Mini. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,S=L.SARRAIL;
const SOL=S.sol,ROUTE=700,ECH=.62;

/* ---------- la descente (coordonnées du plan) ---------- */
const DESC=[[9.4,318],[11,360],[13.2,362],[13.9,415],[14.05,436],[14.8,438],[16.4,560],[17,575]];
function hanche(t){if(t<=DESC[0][0])return DESC[0][1];for(let i=1;i<DESC.length;i++){const[a,ya]=DESC[i-1],[b,yb]=DESC[i];if(t<=b){const u=(t-a)/(b-a);return lerp(ya,yb,i===4?u*u:eio(u))}}return DESC[DESC.length-1][1]}
const GRIMPE={tA:.12,hd:-.25,aF:[2.75,-.2],aB:[2.45,.35],lF:[.95,-1.25],lB:[.15,.15]};
function louise(t){
  if(t<9.2)return null;
  if(t<17){const y=hanche(t),bouge=Math.abs(hanche(t+.05)-y)>.15,ph=t*7,p=L.melange(GRIMPE,GRIMPE,0);
    if(bouge){p.aF=[2.75+.25*Math.sin(ph),-.2];p.aB=[2.45-.25*Math.sin(ph),.35];p.lF=[.95+.35*Math.sin(ph),-1.25];p.lB=[.15-.3*Math.sin(ph),.15]}
    if(t>13.9&&t<14.4){p.aB=[2.95,.05];p.lF=[.3,0];p.lB=[-.2,.1]}
    return{x:lerp(402,416,seg(t,9.2,9.9)),F:1,p,s:ECH,hipY:y,alpha:seg(t,9.2,9.6)}}
  if(t<17.4){const u=eio(seg(t,17,17.4));return{x:416,F:1,p:L.melange(GRIMPE,{...L.POSES.debout,tA:.25,hd:.1},u),s:ECH,hipY:lerp(575,586,u),alpha:1}}
  if(t<18.3)return{x:416,F:1,p:{...L.POSES.debout,hd:-.1},s:ECH,sol:SOL,alpha:1};
  const u=seg(t,18.3,19.4);
  return{x:lerp(416,628,eio(u)),F:1,p:L.pas(L.POSES.debout,(t-18.3)*15,.45*(u<1?1:0),0),s:lerp(ECH,.66,u),sol:lerp(SOL,ROUTE+4,u),alpha:1-seg(t,19.3,19.55)};
}

/* ---------- le plan coté, sur papier (même dessin que l'enveloppe 3) ---------- */
function plan(c,t,a){
  if(a<=0)return;c.save();c.globalAlpha=a;
  c.fillStyle='#f1e7d3';c.fillRect(-400,-300,1900,1400);c.strokeStyle='#1a1512';c.lineWidth=2;c.strokeRect(0,0,1063,734);
  const ink='#1a1512',rouge='#a8201a';
  const trace=(path,p,lw,col,len)=>{if(p<=0)return;c.save();c.strokeStyle=col||ink;c.lineWidth=lw;c.setLineDash([len,len]);c.lineDashOffset=len*(1-p);c.stroke(typeof path==='string'?new Path2D(path):path);c.restore()};
  const r=(x,y,w,h)=>{const p=new Path2D();p.rect(x,y,w,h);return p};
  trace('M60 640 L760 640',seg(t,3.3,3.8),2.4,ink,700);
  trace(r(110,170,560,470),seg(t,3.4,4.1),1.6,ink,2060);
  trace('M90 170 L390 70 L690 170',seg(t,3.7,4.2),1.6,ink,640);
  if(t>4.3){c.save();c.setLineDash([10,5]);c.lineWidth=.8;c.globalAlpha*=seg(t,4.3,4.6);c.beginPath();c.moveTo(110,400);c.lineTo(670,400);c.strokeStyle=ink;c.stroke();c.restore()}
  const fens=[...S.etage.map((f,i)=>[f,i===S.louise]),...S.rdc.map(f=>[f,false]),[S.porte,false]];
  fens.forEach(([f,rouge2],i)=>{const p=seg(t,4+i*.06,4.35+i*.06);if(p<=0)return;c.save();c.globalAlpha*=p;c.fillStyle=rouge2?'#f3d9d3':'#f6efdf';c.fillRect(f.x,f.y,f.w,f.h);c.strokeStyle=rouge2?rouge:ink;c.lineWidth=rouge2?2:1.2;c.strokeRect(f.x,f.y,f.w,f.h);c.restore()});
  trace(S.tiges[0],seg(t,4.6,5.6),7,'#5a3e1b',520);trace(S.tiges[1],seg(t,4.75,5.75),5.5,'#5a3e1b',520);
  S.branches.forEach((b,i)=>trace(b,seg(t,5.5+i*.08,5.8+i*.08),3,'#5a3e1b',80));
  if(t>5.8){c.save();c.globalAlpha*=seg(t,5.8,6.1);c.fillStyle=ink;S.pattes.forEach(y=>c.fillRect(426,y,12,5));
    c.strokeStyle=ink;c.lineWidth=.8;c.beginPath();c.moveTo(395,590);c.lineTo(395,290);[590,530,470,410,350,290].forEach(y=>{c.moveTo(389,y);c.lineTo(401,y)});
    c.moveTo(720,640);c.lineTo(720,350);c.moveTo(712,640);c.lineTo(728,640);c.moveTo(712,350);c.lineTo(728,350);c.stroke();
    c.setLineDash([3,3]);c.beginPath();c.moveTo(670,350);c.lineTo(728,350);c.stroke();c.setLineDash([]);
    c.font="11px "+L.F.machine;c.fillStyle=ink;c.textAlign='right';[564,504,444,384,324].forEach(y=>c.fillText('600',386,y));
    c.save();c.translate(734,500);c.rotate(-Math.PI/2);c.textAlign='center';c.fillText('2 900 (sol → appui fenêtre)',0,0);c.restore();c.restore()}
  if(t>6.1){c.save();c.globalAlpha*=seg(t,6.1,6.4);c.strokeStyle=rouge;c.lineWidth=2;c.strokeRect(424,464,16,13);c.lineWidth=1.4;c.setLineDash([3,3]);c.beginPath();c.arc(444,410,16,0,7);c.stroke();c.setLineDash([]);
    c.lineWidth=.9;c.beginPath();c.moveTo(410,232);c.lineTo(340,160);c.moveTo(440,470);c.lineTo(560,440);c.moveTo(460,406);c.lineTo(560,390);c.stroke();
    c.fillStyle=rouge;c.font="12.5px "+L.F.machine;c.textAlign='left';c.fillText('Fenêtre de L. (3e à gauche, 1er étage)',200,150);c.fillText('3e patte : branlante. À ÉVITER.',566,436);c.fillText('Fourche : on peut s’y reposer.',566,388);c.restore()}
  if(t>6.5){c.save();c.globalAlpha*=seg(t,6.5,6.8);c.fillStyle=ink;c.font="12px "+L.F.machine;c.textAlign='left';
    [['NOTES',782,60],['1. Glycine ancienne, deux tiges',782,86],['principales (Ø ~ un poignet).',800,104],['2. Pattes de scellement env.',782,128],['tous les 600 mm.',800,146],['3. Bois sec mais sain. Porte',782,170],['largement la charge prévue.',800,188],['4. Relevé effectué au briquet,',782,212],['entre 19 h et 22 h, pendant',800,230],['un certain dîner.',800,248],['5. Tolérance : généreuse.',782,272]].forEach(([s,x,y])=>c.fillText(s,x,y));c.restore()}
  if(t>6.8){c.save();c.globalAlpha*=seg(t,6.8,7.1);c.strokeStyle=rouge;c.lineWidth=2;c.strokeRect(782,300,250,84);c.fillStyle=rouge;c.font="17px "+L.F.titre;c.textAlign='center';c.fillText('TROIS POINTS D’APPUI.',907,332);c.fillText('TOUJOURS TROIS.',907,362);c.restore()}
  if(t>7){c.save();c.globalAlpha*=seg(t,7,7.3);c.strokeStyle=ink;c.lineWidth=1.4;c.strokeRect(760,584,303,150);c.beginPath();[624,664,699].forEach(y=>{c.moveTo(760,y);c.lineTo(1063,y)});c.moveTo(940,664);c.lineTo(940,734);c.stroke();
    c.fillStyle=ink;c.textAlign='left';c.font="15px "+L.F.machine;c.fillText('ÉTUDE DE RÉSISTANCE — GLYCINE',772,610);c.font="12px "+L.F.machine;c.fillText('Maison Sarrail, Purpan · Élévation façade',772,650);
    c.font="10px "+L.F.machine;c.fillText('Dessiné : C. Delacroix',772,686);c.fillText('Date : 15.12.1925',945,686);c.fillText('Échelle : 1:50 · cotes mm',772,721);c.fillText('Plan n°',945,721);c.fillStyle=rouge;c.fillText('✦ 0714 · Ind. A',988,721);c.restore()}
  c.restore();
}

/* ---------- la nuit autour de la maison ---------- */
function jardin(c,t){
  c.fillStyle='#070d12';[[30,470,95],[-40,540,80],[760,460,100],[850,540,90],[1000,500,120]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(x,y,r,r*1.3,0,0,7);c.fill();c.fillRect(x-6,y,12,SOL-y)});
  c.fillStyle='#0e1612';c.fillRect(-500,SOL,2200,ROUTE-SOL);c.fillStyle='#24201a';c.fillRect(-500,ROUTE-12,2200,400);
  c.fillStyle='rgba(255,255,255,.04)';for(let x=-500;x<1700;x+=20)c.fillRect(x,ROUTE-4+((x/20)%2)*5,8,2);
}
function grappeTombe(c,t){const u=seg(t,13.95,14.9);if(u<=0||u>=1)return;const x=440+u*24,y=lerp(470,SOL-6,u*u);
  c.save();c.translate(x,y);c.rotate(u*4);c.fillStyle='#8a6aaa';c.beginPath();c.ellipse(0,0,3,9,0,0,7);c.fill();c.restore();
  for(let k=0;k<6;k++){c.fillStyle=`rgba(160,130,190,${.7*(1-u)})`;c.fillRect(436+Math.sin(k*2+t*6)*16,lerp(470,SOL,u)-k*16*u,2,2)}
  c.fillStyle=`rgba(40,30,20,${1-u})`;c.save();c.translate(432,470+u*u*160);c.rotate(u*6);c.fillRect(-6,-2,12,5);c.restore();}
function voiture(c,t){
  const dep=t>20.6?L.eic(seg(t,20.6,22.8))*900:0,x=560+dep,gy=ROUTE+14,K=1.25;
  const clign=(t>17.75&&t<17.95)||(t>18.1&&t<18.3)?0:1;
  c.save();c.translate(x,gy);c.scale(K,K);
  if(t<21.6)L.phares(c,190,-70,.9*clign);
  const dedans=t>19.45;
  L.mini(c,0,0,{roue:dep/24/K,louise:dedans?{look:0,lean:0}:false,celestin:{look:0,lean:dedans?.6:0}});
  if(t>20.4&&t<23){for(let k=0;k<5;k++){const a=(t-20.4-k*.25);if(a<0||a>1.2)continue;c.fillStyle=`rgba(200,200,210,${.25*(1-a/1.2)})`;c.beginPath();c.arc(-6-a*40,-26-a*14,4+a*10,0,7);c.fill()}}
  c.restore();
}

/* ---------- caméra ---------- */
function camera(t,lo){
  const p0={z:.9,cx:531.5,cy:367};
  let cible={z:1.6,cx:450,cy:320};
  if(t>9.2&&lo&&lo.hipY!=null)cible.cy=clamp(lo.hipY,300,520);
  if(t>=17)cible={z:1.6,cx:lerp(450,600,eio(seg(t,17.2,19))),cy:520};
  const u=eio(seg(t,7.3,9.3));
  return{z:Math.exp(lerp(Math.log(p0.z),Math.log(cible.z),u)),cx:lerp(p0.cx,cible.cx,u),cy:lerp(p0.cy,cible.cy,u)};
}

const OUVERTURE=[{s:'LA NUIT DE L’ÉVASION',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Un dessinateur prépare toujours un plan.',y:380,f:"italic 44px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const lo=louise(t),cam=camera(t,lo);
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#060b15');g.addColorStop(1,'#13233b');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.save();c.translate(W/2,H/2);c.scale(cam.z,cam.z);c.translate(-cam.cx,-cam.cy);
    const nuit=seg(t,7.6,8.8);
    if(nuit>0){c.save();c.globalAlpha=nuit;jardin(c,t);
      const gp=seg(t,11.3,11.5)*(1-seg(t,12.9,13.05));
      L.maisonSarrail(c,{lumLouise:1-.6*seg(t,10,11),ouvre:eio(seg(t,8.7,9.2)),lumGP:gp,ombreGP:true});
      grappeTombe(c,t);
      if(lo){c.save();c.globalAlpha=lo.alpha;L.pantin(c,lo,'L',0);c.restore()}
      voiture(c,t);c.restore()}
    plan(c,t,1-seg(t,7.8,8.9));
    c.restore();
    if(nuit>0){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(60,90,150,${.07*nuit})`;c.fillRect(0,0,W,H);c.restore()}
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>23.1?(t-23.1)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,24);
  for(let w=3.3;w<7.3;w+=.12+Math.random()*.15)K.noise(T+w,.08+Math.random()*.1,'highpass',3500,.7,.012+Math.random()*.012,.01);
  K.phrase(L.THEME.motif.slice(0,4),T+3.6,.6,'piano',null,.035);
  K.nappe(T+8,13,'lowpass',180,.7,[[1,.05],[12,.05],[13,0]]);
  K.souffle(46,T+8.7,.4,{g:.012,cut:600,vib:10,att:.08});
  for(let i=0;i<26;i++){const w=9.5+Math.random()*7.4;if(w>11.2&&w<13.2)continue;K.noise(T+w,.15,'bandpass',900+Math.random()*900,1,.025,.04)}
  K.noise(T+11.35,.4,'bandpass',2400,.8,.03,.08);K.noise(T+12.95,.05,'bandpass',2000,4,.04,.002);
  K.noise(T+13.92,.08,'highpass',1500,.5,.16,.001);K.noise(T+13.95,.25,'bandpass',600,1,.08,.003);K.noise(T+14.75,.06,'bandpass',3000,3,.05,.002);
  [[15,62],[15.6,64],[16.2,65],[16.8,67]].forEach(([w,m])=>K.piano(m,T+w,.03));
  K.noise(T+17.35,.15,'lowpass',200,.8,.12,.004);
  [17.78,18.13].forEach(w=>K.noise(T+w,.03,'bandpass',2500,4,.04,.002));
  K.noise(T+19.45,.12,'lowpass',300,1,.12,.004);
  const mo=ac.createOscillator();mo.type='sawtooth';mo.frequency.setValueAtTime(38,T+20.3);mo.frequency.linearRampToValueAtTime(58,T+22.8);
  const am=ac.createGain();am.gain.value=0;const lfo=ac.createOscillator();lfo.frequency.setValueAtTime(9,T+20.3);lfo.frequency.linearRampToValueAtTime(16,T+22.8);const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);
  const mg=ac.createGain();mg.gain.setValueAtTime(0,T+20.3);mg.gain.linearRampToValueAtTime(.06,T+20.5);mg.gain.setValueAtTime(.06,T+22);mg.gain.linearRampToValueAtTime(0,T+23.2);
  mo.connect(K.lp(500)).connect(am).connect(mg).connect(K.out);mo.start(T+20.3);lfo.start(T+20.3);mo.stop(T+23.3);lfo.stop(T+23.3);
  const o=K.bus();K.orchestre(T+20.8,.42,['Dm9','G13'],o,{piano:.02});K.phrase(L.THEME.reponse,T+20.9,.42,'trompette',o,.045);
  K.finale(T,24);
}

L.film({duree:24,rendu,partition,affiche:12});
})();
