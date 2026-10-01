/* Plan 08 — L'évasion par la glycine (24 s)
   D'abord le plan coté de la glycine, tracé par Célestin au bleu d'architecte (celui de l'enveloppe 3),
   qui se change en vraie façade de nuit. Louise sort par la fenêtre et descend la glycine ;
   une branche craque, la lumière du grand-père s'allume puis s'éteint. En bas, la Mini attend, phares allumés. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H;
const SOLMUR=1150,ROUTE=1250;
const FEN={x:520,y:120,w:160,h:210},FENGP={x:770,y:690,w:130,h:180},PORTE={x:380,y:900,w:96};
const TRONC=[[600,1150],[586,1060],[612,960],[590,860],[618,760],[596,660],[622,560],[600,460],[626,380],[640,336]];
const GRAPPES=[];(function(){const R=L.rng(708);for(let i=0;i<46;i++){const k=R()*(TRONC.length-1),j=Math.floor(k),f=k-j,a=TRONC[j],b=TRONC[j+1];
  GRAPPES.push({x:a[0]+(b[0]-a[0])*f+(R()-.5)*120,y:a[1]+(b[1]-a[1])*f+(R()-.5)*30,l:10+R()*12,c:R()<.5?'#6b4a8a':'#8a6aaa'})}})();

/* ---------- la descente de Louise ---------- */
const DESCENTE=[[9.4,300],[11.6,470],[12.45,560],[12.6,598],[14.4,600],[15.6,780],[16.6,930],[17.2,1010]];
function hanche(t){if(t<=DESCENTE[0][0])return DESCENTE[0][1];for(let i=1;i<DESCENTE.length;i++){const[a,ya]=DESCENTE[i-1],[b,yb]=DESCENTE[i];if(t<=b){const u=(t-a)/(b-a);return lerp(ya,yb,i===3?u*u:eio(u))}}return DESCENTE[DESCENTE.length-1][1]}
const GRIMPE={tA:.12,hd:-.25,aF:[2.75,-.2],aB:[2.45,.35],lF:[.95,-1.25],lB:[.15,.15]};
function louise(t){
  if(t<9.2)return null;
  if(t<17.2){const y=hanche(t),bouge=Math.abs(hanche(t+.05)-y)>.3?1:0,ph=t*7;
    const p=L.melange(GRIMPE,GRIMPE,0);if(bouge){p.aF=[2.75+.25*Math.sin(ph),-.2];p.aB=[2.45-.25*Math.sin(ph),.35];p.lF=[.95+.35*Math.sin(ph),-1.25];p.lB=[.15-.3*Math.sin(ph),.15]}
    if(t>12.45&&t<12.9)p.aB=[2.9,.1];
    return{x:578,F:1,p,s:1.15,hipY:y,alpha:seg(t,9.2,9.6)}}
  if(t<17.7){const u=eio(seg(t,17.2,17.6));return{x:lerp(578,570,u),F:1,p:L.melange(GRIMPE,{...L.POSES.debout,tA:.25,hd:.1},u),s:1.15,hipY:lerp(1010,1052,u),alpha:1}}
  if(t<18.3)return{x:570,F:1,p:{...L.POSES.debout,hd:-.1},s:1.15,sol:SOLMUR,alpha:1};
  const u=seg(t,18.3,19.4);
  return{x:lerp(570,950,eio(u)),F:1,p:L.pas(L.POSES.debout,(t-18.3)*15,.45*(u<1?1:0),0),s:lerp(1.15,1.25,u),sol:lerp(SOLMUR,ROUTE+6,u),alpha:1-seg(t,19.3,19.55)};
}

/* ---------- la façade, la nuit ---------- */
function facade(c,t){
  const ciel=c.createLinearGradient(0,-400,0,SOLMUR);ciel.addColorStop(0,'#060b15');ciel.addColorStop(1,'#0f1d33');c.fillStyle=ciel;c.fillRect(-300,-400,1900,SOLMUR+400);
  c.fillStyle='#070d12';[[60,700,170],[150,820,140],[1180,760,180],[1290,880,130],[-40,880,120]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(x,y,r,r*1.3,0,0,7);c.fill();c.fillRect(x-10,y,20,SOLMUR-y)});
  c.fillStyle='#3a3026';c.fillRect(260,40,780,SOLMUR-40);
  c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=1;for(let y=56;y<SOLMUR;y+=16){c.beginPath();c.moveTo(260,y);c.lineTo(1040,y);c.stroke()}
  c.fillStyle='#16121a';c.beginPath();c.moveTo(230,44);c.lineTo(650,-60);c.lineTo(1070,44);c.closePath();c.fill();
  // fenêtre de Louise
  const ouv=eio(seg(t,8.7,9.2));
  c.fillStyle=L.mix('#a8875a','#5a4630',seg(t,10,11));c.fillRect(FEN.x,FEN.y,FEN.w,FEN.h);
  c.fillStyle='#2a1a10';const lw=FEN.w/2*(1-.85*ouv);c.fillRect(FEN.x,FEN.y,lw,FEN.h);c.fillRect(FEN.x+FEN.w-lw,FEN.y,lw,FEN.h);
  c.fillStyle='rgba(255,200,120,.35)';c.fillRect(FEN.x+6,FEN.y+6,lw-12>0?lw-12:0,FEN.h-12);c.fillRect(FEN.x+FEN.w-lw+6,FEN.y+6,lw-12>0?lw-12:0,FEN.h-12);
  c.strokeStyle='#2a1a10';c.lineWidth=8;c.strokeRect(FEN.x,FEN.y,FEN.w,FEN.h);c.fillStyle='#4a3d30';c.fillRect(FEN.x-14,FEN.y+FEN.h,FEN.w+28,12);
  // fenêtre du grand-père : la lumière s'allume, l'ombre de La Dépêche
  const gp=seg(t,12.9,13.1)*(1-seg(t,14.2,14.35));
  c.fillStyle=gp>0?L.mix('#0c0908','#c99a52',gp):'#0c0908';c.fillRect(FENGP.x,FENGP.y,FENGP.w,FENGP.h);
  if(gp>0){c.fillStyle=`rgba(20,12,8,${.85*gp})`;c.beginPath();c.arc(FENGP.x+50,FENGP.y+70,14,0,7);c.fill();c.fillRect(FENGP.x+34,FENGP.y+84,32,96);
    c.fillStyle=`rgba(240,230,210,${.9*gp})`;c.fillRect(FENGP.x+62,FENGP.y+66,44,52);c.fillStyle=`rgba(20,12,8,${.5*gp})`;for(let k=0;k<5;k++)c.fillRect(FENGP.x+66,FENGP.y+74+k*9,36,2)}
  c.strokeStyle='#2a1a10';c.lineWidth=7;c.strokeRect(FENGP.x,FENGP.y,FENGP.w,FENGP.h);c.beginPath();c.moveTo(FENGP.x+FENGP.w/2,FENGP.y);c.lineTo(FENGP.x+FENGP.w/2,FENGP.y+FENGP.h);c.stroke();
  [[300,690],[300,330],[800,330]].forEach(([x,y])=>{c.fillStyle='#0c0908';c.fillRect(x,y,130,180);c.strokeStyle='#2a1a10';c.strokeRect(x,y,130,180)});
  c.fillStyle='#2e1d0e';c.fillRect(PORTE.x,PORTE.y,PORTE.w,SOLMUR-PORTE.y);
  // glycine
  c.strokeStyle='#2a1d12';c.lineWidth=9;c.lineJoin='round';c.beginPath();TRONC.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
  c.lineWidth=4;[[3,[680,940]],[5,[520,640]],[6,[700,520]],[8,[540,420]]].forEach(([i,[x,y]])=>{c.beginPath();c.moveTo(TRONC[i][0],TRONC[i][1]);c.quadraticCurveTo((TRONC[i][0]+x)/2,y-30,x,y);c.stroke()});
  GRAPPES.forEach(g=>{c.fillStyle=g.c;c.beginPath();c.ellipse(g.x,g.y+g.l,5,g.l,0,0,7);c.fill()});
  // jardin et route
  c.fillStyle='#0e1612';c.fillRect(-200,SOLMUR,1700,ROUTE-SOLMUR);c.fillStyle='#24201a';c.fillRect(-200,ROUTE-20,1700,400);
  c.fillStyle='rgba(255,255,255,.04)';for(let x=-200;x<1500;x+=34)c.fillRect(x,ROUTE-6+((x/34)%2)*8,14,3);
}
function grappeTombe(c,t){const u=seg(t,12.5,13.6);if(u<=0||u>=1)return;const x=650+u*40,y=lerp(560,SOLMUR-10,u*u);
  c.save();c.translate(x,y);c.rotate(u*4);c.fillStyle='#8a6aaa';c.beginPath();c.ellipse(0,0,6,16,0,0,7);c.fill();c.restore();
  for(let k=0;k<6;k++){const fy=lerp(560,SOLMUR,u)-k*30*u;c.fillStyle=`rgba(160,130,190,${.7*(1-u)})`;c.fillRect(640+Math.sin(k*2+t*6)*30,fy,3,3)}}
function voiture(c,t){
  const dep=t>20.6?L.eic(seg(t,20.6,22.8))*1100:0,x=860+dep,gy=ROUTE+40;
  const clign=(t>17.75&&t<17.95)||(t>18.1&&t<18.3)?0:1;
  if(t<21.6)L.phares(c,x+304,gy-112,(t<9?.5:.9)*clign);
  const louiseDedans=t>19.45;
  c.save();c.translate(x,gy);c.scale(1.6,1.6);L.mini(c,0,0,{roue:dep/24,louise:louiseDedans?{look:0,lean:0}:false,celestin:{look:0,lean:louiseDedans?.6:0}});c.restore();
  if(t>20.4&&t<23){for(let k=0;k<5;k++){const a=(t-20.4-k*.25);if(a<0||a>1.2)continue;c.fillStyle=`rgba(200,200,210,${.25*(1-a/1.2)})`;c.beginPath();c.arc(x-10-a*60,gy-40-a*20,8+a*18,0,7);c.fill()}}
}

/* ---------- le plan coté (bleu d'architecte) ---------- */
function bleu(c,t){
  const k=.52,ox=262,oy=24,P=(x,y)=>[ox+x*k,oy+y*k];
  c.fillStyle='#1d3a63';c.fillRect(0,0,W,H);
  c.strokeStyle='rgba(232,240,255,.08)';c.lineWidth=1;for(let x=0;x<W;x+=24){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}for(let y=0;y<H;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  c.strokeStyle='#e8f0ff';c.fillStyle='#e8f0ff';c.lineWidth=1.6;
  const ligne=(pts,p)=>{if(p<=0)return;const n=pts.length-1,kk=p*n,i=Math.floor(kk);c.beginPath();let a=P(...pts[0]);c.moveTo(a[0],a[1]);
    for(let j=1;j<=Math.min(i,n);j++){a=P(...pts[j]);c.lineTo(a[0],a[1])}if(i<n){const f=kk-i,A=P(...pts[i]),B=P(...pts[i+1]);c.lineTo(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f)}c.stroke()};
  const rect=(x,y,w,h,p)=>ligne([[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],p);
  rect(260,40,780,SOLMUR-40,seg(t,3.4,4.4));rect(FEN.x,FEN.y,FEN.w,FEN.h,seg(t,4,4.6));rect(FENGP.x,FENGP.y,FENGP.w,FENGP.h,seg(t,4.2,4.7));rect(PORTE.x,PORTE.y,PORTE.w,SOLMUR-PORTE.y,seg(t,4.3,4.8));[[300,690],[300,330],[800,330]].forEach(([x,y],i)=>rect(x,y,130,180,seg(t,4.4+i*.1,4.9+i*.1)));
  c.lineWidth=2.6;ligne(TRONC,seg(t,4.6,5.8));c.lineWidth=1.2;
  c.setLineDash([6,5]);ligne([[200,SOLMUR],[1100,SOLMUR]],seg(t,4.4,5));c.setLineDash([]);
  // cotes
  const cote=(x,y1,y2,txt,t0)=>{const p=seg(t,t0,t0+.6);if(p<=0)return;const a=P(x,y1),b=P(x,lerp(y1,y2,p));c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
    [a,b].forEach((q,i)=>{c.beginPath();c.moveTo(q[0]-5,q[1]+(i?-8:8));c.lineTo(q[0],q[1]);c.lineTo(q[0]+5,q[1]+(i?-8:8));c.stroke()});
    if(p>=1){c.save();c.font="13px "+L.F.machine;c.textAlign='right';c.fillText(txt,a[0]-10,(a[1]+b[1])/2+4);c.restore()}};
  cote(460,SOLMUR,FEN.y+FEN.h,'4,10 m',5.6);cote(1090,SOLMUR,40,'5,60 m',6);
  c.font="12px "+L.F.machine;c.textAlign='left';
  [[2,'prise 1'],[4,'prise 2'],[6,'prise 3'],[8,'appui']].forEach(([i,txt],n)=>{if(t<6.2+n*.25)return;const q=P(...TRONC[i]);c.beginPath();c.arc(q[0],q[1],5,0,7);c.stroke();c.beginPath();c.moveTo(q[0]+5,q[1]);c.lineTo(q[0]+60,q[1]-14);c.stroke();c.fillText(txt,q[0]+64,q[1]-12)});
  if(t>6.6){c.fillText('glycine — tronc Ø 8 cm, tient bon',P(640,1010)[0]+40,P(640,1010)[1]);c.fillText('fenêtre : 1er étage, ouvre en dedans',P(700,200)[0]+40,P(700,200)[1])}
  if(t>6.9){const q=P(860,1290);c.fillText('LA MINI (moteur coupé)',q[0],q[1]);c.strokeRect(q[0]-6,q[1]-40,170,30)}
  // cartouche
  const ca=seg(t,6.8,7.2);if(ca>0){c.save();c.globalAlpha=ca;c.strokeRect(930,600,300,90);c.beginPath();c.moveTo(930,632);c.lineTo(1230,632);c.stroke();
    c.font="15px "+L.F.titre;c.fillText('PLAN COTÉ · GLYCINE',942,624);c.font="12px "+L.F.machine;c.fillText('Purpan · éch. 1:50',942,656);c.fillText('dessiné par C. Delacroix',942,676);c.restore()}
}

const OUVERTURE=[{s:'LA NUIT DE L’ÉVASION',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Un dessinateur prépare toujours un plan.',y:380,f:"italic 44px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<8.6)bleu(c,t);
  if(t>7.4){
    const lo=louise(t);
    let camY=0;if(t>9.6){const y=lo&&lo.hipY!=null?lo.hipY:1050;camY=clamp(y-330,0,640)}
    if(t>17.5)camY=640;
    c.save();c.globalAlpha=seg(t,7.4,8.6);
    const z=lerp(.84,1,eio(seg(t,7.4,9.4)));c.translate(640,360);c.scale(z,z);c.translate(-640,-360-camY);
    facade(c,t);grappeTombe(c,t);
    if(lo){c.save();c.globalAlpha*=lo.alpha;L.pantin(c,lo,'L',0);c.restore()}
    GRAPPES.slice(0,14).forEach(g=>{c.fillStyle=g.c;c.beginPath();c.ellipse(g.x+8,g.y+g.l+6,4,g.l*.8,0,0,7);c.fill()});
    voiture(c,t);
    c.restore();
    c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(60,90,150,.08)';c.fillRect(0,0,W,H);c.restore();
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>23.1?(t-23.1)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,24);
  // le crayon sur le calque
  for(let w=3.4;w<7.3;w+=.12+Math.random()*.15)K.noise(T+w,.08+Math.random()*.1,'highpass',3500,.7,.012+Math.random()*.012,.01);
  K.phrase(L.THEME.motif.slice(0,4),T+3.6,.6,'piano',null,.035);
  // tension
  K.nappe(T+8,13,'lowpass',180,.7,[[1,.05],[12,.05],[13,0]]);
  K.souffle(46,T+8.7,.4,{g:.012,cut:600,vib:10,att:.08});
  for(let i=0;i<26;i++){const w=10+Math.random()*7;if(w>12.4&&w<14.5)continue;K.noise(T+w,.15,'bandpass',900+Math.random()*900,1,.025,.04)}
  K.noise(T+12.47,.08,'highpass',1500,.5,.16,.001);K.noise(T+12.5,.25,'bandpass',600,1,.08,.003);
  K.noise(T+13.05,.4,'bandpass',2400,.8,.03,.08);K.noise(T+14.25,.05,'bandpass',2000,4,.04,.002);
  [[14.6,62],[15.4,64],[16.2,65],[17,67]].forEach(([w,m])=>K.piano(m,T+w,.03));
  K.noise(T+17.55,.15,'lowpass',200,.8,.12,.004);
  // les phares, la portière, le Petit Citron
  [17.78,18.13].forEach(w=>K.noise(T+w,.03,'bandpass',2500,4,.04,.002));
  K.noise(T+19.45,.12,'lowpass',300,1,.12,.004);
  const mo=ac.createOscillator();mo.type='sawtooth';mo.frequency.setValueAtTime(38,T+20.3);mo.frequency.linearRampToValueAtTime(58,T+22.8);
  const am=ac.createGain();am.gain.value=0;const lfo=ac.createOscillator();lfo.frequency.setValueAtTime(9,T+20.3);lfo.frequency.linearRampToValueAtTime(16,T+22.8);const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);
  const mg=ac.createGain();mg.gain.setValueAtTime(0,T+20.3);mg.gain.linearRampToValueAtTime(.06,T+20.5);mg.gain.setValueAtTime(.06,T+22);mg.gain.linearRampToValueAtTime(0,T+23.2);
  mo.connect(K.lp(500)).connect(am).connect(mg).connect(K.out);mo.start(T+20.3);lfo.start(T+20.3);mo.stop(T+23.3);lfo.stop(T+23.3);
  const o=K.bus();K.orchestre(T+20.8,.42,['Dm9','G13'],o,{piano:.02});K.phrase(L.THEME.reponse,T+20.9,.42,'trompette',o,.045);
  K.finale(T,24);
}

L.film({duree:24,rendu,partition,affiche:13.4});
})();
