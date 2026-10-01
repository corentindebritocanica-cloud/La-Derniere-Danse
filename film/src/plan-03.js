/* Plan 03 — Le petit hibou de Purpan (23 s)
   La chambre de Louise chez ses grands-parents. Elle lit Freud à la bougie, adossée au lit, Chopin au pied du lit.
   La trompette sonne au loin : elle cache Freud sous l'oreiller, souffle la bougie, prend son manteau
   et ses partitions (« leçon de piano chez madame Castaing ») et s'éclipse. Dans le noir, il ne reste que les yeux de Chopin. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL;
const BOUGIE={x:330,y:470},PORTE={x:40,w:112},FENETRE={x:980,y:140,w:180,h:280},CHAT={x:930,y:668,s:.5},HORLOGE={x:880,y:150};

/* ---------- Louise ---------- */
const LIT={tA:-.14,hd:.32,aF:[1.0,1.05],aB:[.9,1.15],lF:[1.45,-.05],lB:[1.5,-.1]};
const PENCHE={tA:.55,hd:.3,aF:[.85,.15],aB:[.2,.3],lF:[.3,0],lB:[-.25,0]};
const SOUFFLE={tA:.4,hd:-.1,aF:[.6,.6],aB:[.1,.4],lF:[.2,0],lB:[-.2,0]};
function louise(t){
  let st={x:440,F:1,p:L.melange(LIT,LIT,0),hipY:528,alpha:1},livre='ouvert';
  st.p.hd=lerp(.32,-.3,eio(seg(t,11,11.6)))+lerp(0,.4,eio(seg(t,12,12.5)));
  st.p.tA+=.015*Math.sin(t*1.8);
  if(t>12.4)livre='ferme';
  const lev=eio(seg(t,12.8,13.6));
  if(lev>0){st.p=L.melange(st.p,L.POSES.debout,lev);st.hipY=lerp(528,524,lev);st.x=lerp(440,470,lev);if(lev>=1)st.hipY=undefined}
  const tour=seg(t,13.7,14.1);if(tour>0)st.F=Math.cos(Math.PI*eio(tour));
  const pe=eio(seg(t,14.2,14.7))*(1-eio(seg(t,15.0,15.3)));if(pe>0)st.p=L.melange(st.p,PENCHE,pe);
  if(t>14.9)livre=null;
  const av=seg(t,15.0,15.4);if(av>0&&av<1){st.x=lerp(470,392,eio(av));st.p=L.pas(st.p,(t-15)*12,.3,0)}else if(av>=1)st.x=392;
  const so=eio(seg(t,15.3,15.5))*(1-eio(seg(t,15.7,16)));if(so>0)st.p=L.melange(st.p,SOUFFLE,so);
  const ma=seg(t,16,17.4);if(ma>0){st.x=lerp(392,190,eio(ma));if(ma<1)st.p=L.pas(L.POSES.debout,(t-16)*11,.3,0)}
  const so2=seg(t,17.9,18.7);if(so2>0){st.x=lerp(190,96,eio(so2));st.p=L.pas(L.POSES.debout,(t-17.9)*11,.3,0);st.alpha=1-seg(t,18.3,18.75)}
  return{st,livre};
}

/* ---------- la chambre ---------- */
function chambre(c,t,lum){
  const g=c.createLinearGradient(0,0,0,560);g.addColorStop(0,'#7a6142');g.addColorStop(1,'#a8875a');c.fillStyle=g;c.fillRect(0,0,W,560);
  c.fillStyle='rgba(90,62,27,.09)';for(let x=0;x<W;x+=36)c.fillRect(x,130,14,430);
  c.strokeStyle='rgba(90,62,27,.6)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=24)c.lineTo(x,(x/24)%2?112:124);c.stroke();
  c.fillStyle='#5a3e1b';c.fillRect(0,96,W,6);
  const fl=c.createLinearGradient(0,560,0,H);fl.addColorStop(0,'#4a3017');fl.addColorStop(1,'#24170b');c.fillStyle=fl;c.fillRect(0,560,W,H-560);
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1;for(let i=0;i<8;i++){const y=572+i*20;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  // fenêtre et rideaux
  const F=FENETRE;c.fillStyle='#0d1b33';c.fillRect(F.x,F.y,F.w,F.h);
  c.fillStyle='#ede3cf';c.beginPath();c.arc(F.x+120,F.y+70,16,0,7);c.fill();c.fillStyle='#0d1b33';c.beginPath();c.arc(F.x+127,F.y+65,15,0,7);c.fill();
  c.fillStyle='rgba(241,231,211,.8)';[[30,40],[60,150],[150,190],[40,230],[100,110]].forEach(([x,y])=>c.fillRect(F.x+x,F.y+y,1.6,1.6));
  c.strokeStyle='#3a2410';c.lineWidth=6;c.strokeRect(F.x,F.y,F.w,F.h);c.lineWidth=4;c.beginPath();c.moveTo(F.x+F.w/2,F.y);c.lineTo(F.x+F.w/2,F.y+F.h);c.moveTo(F.x,F.y+F.h*.45);c.lineTo(F.x+F.w,F.y+F.h*.45);c.stroke();
  [[F.x-26,1],[F.x+F.w+26,-1]].forEach(([x,d])=>{c.fillStyle='#7a1813';c.beginPath();c.moveTo(x-d*20,F.y-26);c.lineTo(x+d*34,F.y-26);c.quadraticCurveTo(x+d*14,F.y+F.h*.5,x+d*30,F.y+F.h+40);c.lineTo(x-d*20,F.y+F.h+40);c.closePath();c.fill()});
  c.fillStyle='#3a2410';c.fillRect(F.x-50,F.y-32,F.w+100,8);
  // horloge à balancier
  const hx=HORLOGE.x,hy=HORLOGE.y;c.fillStyle='#3a2410';c.fillRect(hx-26,hy,52,190);c.beginPath();c.arc(hx,hy,26,Math.PI,0);c.fill();
  c.fillStyle='#e8dcc2';c.beginPath();c.arc(hx,hy+8,19,0,7);c.fill();
  c.strokeStyle=L.C.encre;c.lineWidth=2;c.beginPath();c.moveTo(hx,hy+8);c.lineTo(hx+2,hy-6);c.moveTo(hx,hy+8);c.lineTo(hx+9,hy+12);c.stroke();
  c.fillStyle='#1d140b';c.fillRect(hx-16,hy+40,32,140);
  const bal=Math.sin(t*Math.PI)*.32;c.save();c.translate(hx,hy+44);c.rotate(bal);c.strokeStyle=L.C.or;c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,110);c.stroke();c.fillStyle=L.C.or;c.beginPath();c.arc(0,114,8,0,7);c.fill();c.restore();
  // porte, patère, partitions
  c.fillStyle='#2e1d0e';c.fillRect(PORTE.x-10,226,PORTE.w+20,SOL-226);
  const ouv=eio(seg(t,17.6,18))*(1-eio(seg(t,18.85,19.3)));
  c.fillStyle='#4a2f16';c.fillRect(PORTE.x,236,PORTE.w*(1-.82*ouv),SOL-236);
  c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=2;if(ouv<.5){c.strokeRect(PORTE.x+14,256,PORTE.w-28,150);c.strokeRect(PORTE.x+14,424,PORTE.w-28,170)}
  c.fillStyle=L.C.or;c.beginPath();c.arc(PORTE.x+PORTE.w*(1-.82*ouv)-14,430,4,0,7);c.fill();
  c.fillStyle='#1d140b';c.fillRect(184,268,8,6);
  if(t<17.15){c.fillStyle='#241612';c.beginPath();c.moveTo(178,272);c.lineTo(198,272);c.lineTo(212,420);c.lineTo(166,420);c.closePath();c.fill();
    c.fillStyle='#1a0f0c';c.beginPath();c.ellipse(188,262,15,8,0,Math.PI,0);c.fill();c.fillRect(173,260,30,4)}
  if(t<17.3){c.save();c.translate(214,560);c.rotate(-.14);c.fillStyle='#1f3a5f';c.fillRect(0,0,30,40);c.fillStyle='#e8dcc2';c.font="7px "+L.F.machine;c.textAlign='center';c.fillText('PIANO',15,18);c.restore()}
  // lit
  c.fillStyle='#3a2410';c.fillRect(350,412,22,SOL-412);c.beginPath();c.arc(361,412,14,Math.PI,0);c.fill();
  c.fillStyle='#3a2410';c.fillRect(806,486,22,SOL-486);c.fillRect(372,566,436,12);
  c.fillStyle='#e8dcc2';c.fillRect(372,530,436,38);
  c.fillStyle='#a8201a';c.fillRect(520,526,288,46);c.fillStyle='rgba(227,178,60,.5)';for(let x=532;x<808;x+=26)c.fillRect(x,530,2,38);
  const bosse=t>14.9?Math.max(0,Math.sin(Math.min(1,(t-14.9)/.4)*Math.PI))*3:0;
  c.fillStyle='#f4ead6';c.beginPath();c.ellipse(404,522-bosse,32,15+bosse,0,0,7);c.fill();
  c.fillStyle='#2e1d0e';[[372,598],[800,598]].forEach(([x,y])=>c.fillRect(x,578,8,SOL-578));
  // table de nuit et bougie
  c.fillStyle='#3a2410';c.fillRect(272,494,72,SOL-494);c.fillStyle='#4a2f16';c.fillRect(266,488,84,8);c.fillStyle='#2a1a0c';c.fillRect(282,520,52,30);
  c.fillStyle='#e8dcc2';c.fillRect(BOUGIE.x-5,BOUGIE.y,10,18);c.fillStyle=L.C.or;c.fillRect(BOUGIE.x-12,BOUGIE.y+16,24,3);
  if(lum>0){const f=1+.12*Math.sin(t*17)+.08*Math.sin(t*29);c.fillStyle=`rgba(255,215,120,${lum})`;c.beginPath();c.ellipse(BOUGIE.x,BOUGIE.y-8,4*f,10*f,0,0,7);c.fill();
    c.fillStyle=`rgba(255,250,230,${lum})`;c.beginPath();c.ellipse(BOUGIE.x,BOUGIE.y-6,2,5,0,0,7);c.fill()}
}
function lumiereBougie(c,t,lum){
  if(lum<=0)return;const f=1+.06*Math.sin(t*17)+.05*Math.sin(t*29+1);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(BOUGIE.x,BOUGIE.y-8,4,BOUGIE.x,BOUGIE.y-8,520*f);
  g.addColorStop(0,`rgba(255,190,100,${.38*lum})`);g.addColorStop(.4,`rgba(255,170,80,${.12*lum})`);g.addColorStop(1,'rgba(255,170,80,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
}
function nuit(c,t,noirceur){
  if(noirceur<=0)return;
  c.fillStyle=`rgba(4,8,20,${.84*noirceur})`;c.fillRect(0,0,W,H);
  const F=FENETRE;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=noirceur;
  c.fillStyle='rgba(90,120,180,.16)';c.beginPath();c.moveTo(F.x,F.y+F.h*.45);c.lineTo(F.x+F.w,F.y+F.h*.45);c.lineTo(F.x+F.w-90,SOL+70);c.lineTo(F.x-260,SOL+70);c.closePath();c.fill();
  c.fillStyle='rgba(60,90,150,.35)';c.fillRect(F.x+3,F.y+3,F.w-6,F.h-6);c.restore();
  const ouv=eio(seg(t,17.6,18))*(1-eio(seg(t,18.85,19.3)));
  if(ouv>0){c.save();c.globalCompositeOperation='lighter';const w=PORTE.w*.82*ouv,x=PORTE.x+PORTE.w-w;
    c.fillStyle=`rgba(255,190,110,${.38*ouv})`;c.fillRect(x,236,w,SOL-236);
    c.fillStyle=`rgba(255,190,110,${.18*ouv})`;c.beginPath();c.moveTo(x,SOL);c.lineTo(x+w,SOL);c.lineTo(x+w+260,H);c.lineTo(x-40,H);c.closePath();c.fill();c.restore()}
}
function fumee(c,t){
  const a=seg(t,15.55,15.7)*(1-seg(t,16.6,17.6));if(a<=0)return;
  c.strokeStyle=`rgba(220,220,230,${.45*a})`;c.lineWidth=1.5;c.beginPath();
  for(let i=0;i<30;i++){const y=BOUGIE.y-10-i*4,x=BOUGIE.x+Math.sin(i*.35+t*3)*(2+i*.4);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
}
function livre(c,m,etat,F,t){
  if(!etat)return;c.save();c.translate(m.x,m.y);
  if(etat==='ouvert'){c.rotate(F>0?.35:-.35);c.fillStyle=L.C.rouge;c.fillRect(-14,-11,28,20);c.fillStyle='#efe4cc';c.fillRect(-12,-9,11,16);c.fillRect(1,-9,11,16);
    const tp=seg(t,7,7.5);if(tp>0&&tp<1){c.fillStyle='#fff8e8';const w=11*Math.cos(Math.PI*tp);c.fillRect(Math.min(1,1+w),-10,Math.abs(w),16)}}
  else{c.rotate(.2);c.fillStyle=L.C.rouge;c.fillRect(-7,-12,14,22);c.fillStyle=L.C.or;c.fillRect(-4,-6,8,1.5)}
  c.restore();
}
function yeuxChopin(c,t,a){
  if(a<=0)return;const cl=(t>20.5&&t<20.68)||(t>22.1&&t<22.25)?.1:1,s=CHAT.s;
  c.save();c.globalCompositeOperation='lighter';
  [-14,14].forEach(dx=>{const x=CHAT.x+dx*s,y=CHAT.y-126*s;const g=c.createRadialGradient(x,y,0,x,y,18);g.addColorStop(0,`rgba(255,210,90,${.9*a})`);g.addColorStop(1,'rgba(255,210,90,0)');
    c.fillStyle=g;c.beginPath();c.arc(x,y,18,0,7);c.fill();c.fillStyle=`rgba(255,226,120,${a})`;c.beginPath();c.ellipse(x,y,4,4.6*cl+.3,0,0,7);c.fill();
    c.fillStyle=`rgba(10,8,6,${a})`;c.beginPath();c.ellipse(x,y,1,3.8*cl+.2,0,0,7);c.fill()});
  c.restore();
}
const MOT="« leçon de piano chez madame Castaing »";
const OUVERTURE=[{s:'PURPAN · CHEZ LES SARRAIL',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Le petit hibou ne dort jamais.',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const lum=t<15.55?1:0,noir=eoc(seg(t,15.55,15.9));
    c.save();const z=1+.05*eio(seg(t,3,15));c.translate(560,430);c.scale(z,z);c.translate(-560,-430);
    chambre(c,t,lum);
    const lo=louise(t);
    c.save();c.globalAlpha=lo.st.alpha;const r=L.pantin(c,lo.st,'L',0);livre(c,r.main,lo.livre,lo.st.F,t);
    if(t>17.15&&t<18.8){c.fillStyle='#1f3a5f';c.fillRect(r.hanche.x+(lo.st.F>0?6:-24),r.hanche.y-46,18,24)}
    c.restore();
    L.chopin(c,CHAT.x,CHAT.y,CHAT.s,t*Math.PI*1.0,(t>9.3&&t<9.5)?1:0);
    lumiereBougie(c,t,lum);
    nuit(c,t,noir);fumee(c,t);
    yeuxChopin(c,t,seg(t,19.2,19.8));
    const ma=seg(t,16.3,16.9)*(1-seg(t,18.4,19));
    if(ma>0){c.save();c.globalAlpha=ma;c.fillStyle='#f6ecd8';c.font="32px "+L.F.main;c.textAlign='center';c.fillText(MOT,420,300-6*seg(t,16.3,19));c.restore()}
    c.restore();
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>22.2?(t-22.2)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,23);
  for(let s=4;s<22;s++){K.noise(T+s,.03,'bandpass',s%2?2600:1900,4,.05,.002)}
  // ronronnement de Chopin
  const src=ac.createBufferSource();src.buffer=K.nb;src.loop=true;const lpf=K.lp(260);const g=ac.createGain();g.gain.value=0;
  const am=ac.createGain();am.gain.value=0;const lfo=ac.createOscillator();lfo.frequency.value=24;const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);
  src.connect(lpf).connect(am).connect(g).connect(K.out);g.gain.setValueAtTime(0,T+3.5);g.gain.linearRampToValueAtTime(.09,T+5);g.gain.setValueAtTime(.09,T+10.6);g.gain.linearRampToValueAtTime(0,T+11.4);
  src.start(T+3.5);lfo.start(T+3.5);src.stop(T+12);lfo.stop(T+12);
  K.noise(T+7,.25,'highpass',3000,.7,.03,.05);
  // la trompette, très loin, dans la ville
  const loin=K.bus();const f=K.lp(900);loin.disconnect();loin.connect(f).connect(K.out);
  K.phrase(L.THEME.motif.slice(0,5),T+10.8,.62,'trompette',loin,.03);
  K.noise(T+14.9,.15,'lowpass',300,.7,.08,.02);
  K.noise(T+15.45,.35,'bandpass',900,.7,.06,.04);
  K.souffle(40,T+17.6,.45,{g:.02,cut:600,vib:9,att:.1});K.noise(T+19.2,.25,'lowpass',180,.8,.12,.005);
  K.piano(79,T+19.5,.03);K.piano(84,T+20.1,.025);K.piano(76,T+21.2,.02);
  K.finale(T,23);
}

L.film({duree:23,rendu,partition,affiche:9});
})();
