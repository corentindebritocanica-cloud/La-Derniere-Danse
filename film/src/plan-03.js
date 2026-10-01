/* Plan 03 — La maison de Purpan (37,5 s) — chapitre 2
   Minuit passé : Louise lit l'Introduction à la psychanalyse (couverture jaune) dans son lit.
   Elle sort du double fond de sa table de chevet le prospectus du concours (l'affiche de l'enveloppe 0) :
   le samedi quatorze, le dîner avec Henri Lasserre… ou le concours. Elle sait ce qu'elle choisira.
   La maison s'endort. Elle ouvre la fenêtre, s'assoit sur le rebord dans son châle ; Chopin vient la rejoindre.
   Sous la Voie lactée, elle se demande si quelqu'un d'autre, dans cette ville, ne dort pas. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL;
const LAMPE={x:308,y:452},PORTE={x:40,w:112},FENETRE={x:980,y:140,w:180,h:280},HORLOGE={x:880,y:150};

/* ---------- Louise, dans la chambre ---------- */
const LIT={tA:-.14,hd:.32,aF:[1.0,1.05],aB:[.9,1.15],lF:[1.45,-.05],lB:[1.5,-.1]};
const PENCHE={tA:.62,hd:.35,aF:[.7,.25],aB:[.3,.4],lF:[1.45,-.05],lB:[1.5,-.1]};
function louise(t){
  const st={x:440,F:1,p:L.melange(LIT,LIT,0),hipY:528};let livre='ouvert';
  st.p.tA+=.015*Math.sin(t*1.8);st.p.hd+=.04*Math.sin(t*.7);
  if(t>9.4)livre='ferme';if(t>10.3)livre=null;
  const tour=eio(seg(t,10.2,10.6))*(1-eio(seg(t,18.2,18.6)));if(tour>0)st.F=lerp(1,-1,tour);
  const pe=eio(seg(t,10.5,11))*(1-eio(seg(t,12.2,12.6)))+eio(seg(t,17.3,17.6))*(1-eio(seg(t,18,18.3)));if(pe>0)st.p=L.melange(st.p,PENCHE,Math.min(1,pe));
  if(t>18.6){st.p.hd=lerp(.32,.05,eio(seg(t,18.6,19.2)))}
  if(t>22.2&&t<22.7){st.F=lerp(1,-1,eio(seg(t,22.2,22.35)));st.p=L.melange(st.p,PENCHE,.6)}
  return{st,livre,papier:t>11.9&&t<17.6};
}

/* ---------- la chambre ---------- */
function chambre(c,t,lum){
  const g=c.createLinearGradient(0,0,0,560);g.addColorStop(0,'#7a6142');g.addColorStop(1,'#a8875a');c.fillStyle=g;c.fillRect(0,0,W,560);
  c.fillStyle='rgba(90,62,27,.09)';for(let x=0;x<W;x+=36)c.fillRect(x,130,14,430);
  c.strokeStyle='rgba(90,62,27,.6)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=24)c.lineTo(x,(x/24)%2?112:124);c.stroke();
  c.fillStyle='#5a3e1b';c.fillRect(0,96,W,6);
  const fl=c.createLinearGradient(0,560,0,H);fl.addColorStop(0,'#4a3017');fl.addColorStop(1,'#24170b');c.fillStyle=fl;c.fillRect(0,560,W,H-560);
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1;for(let i=0;i<8;i++){const y=572+i*20;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  const F=FENETRE;c.fillStyle='#0d1b33';c.fillRect(F.x,F.y,F.w,F.h);
  c.fillStyle='rgba(241,231,211,.8)';[[30,40],[60,150],[150,190],[40,230],[100,110],[130,60]].forEach(([x,y])=>c.fillRect(F.x+x,F.y+y,1.6,1.6));
  c.strokeStyle='#3a2410';c.lineWidth=6;c.strokeRect(F.x,F.y,F.w,F.h);c.lineWidth=4;c.beginPath();c.moveTo(F.x+F.w/2,F.y);c.lineTo(F.x+F.w/2,F.y+F.h);c.moveTo(F.x,F.y+F.h*.45);c.lineTo(F.x+F.w,F.y+F.h*.45);c.stroke();
  [[F.x-26,1],[F.x+F.w+26,-1]].forEach(([x,d])=>{c.fillStyle='#7a1813';c.beginPath();c.moveTo(x-d*20,F.y-26);c.lineTo(x+d*34,F.y-26);c.quadraticCurveTo(x+d*14,F.y+F.h*.5,x+d*30,F.y+F.h+40);c.lineTo(x-d*20,F.y+F.h+40);c.closePath();c.fill()});
  c.fillStyle='#3a2410';c.fillRect(F.x-50,F.y-32,F.w+100,8);
  const hx=HORLOGE.x,hy=HORLOGE.y;c.fillStyle='#3a2410';c.fillRect(hx-26,hy,52,190);c.beginPath();c.arc(hx,hy,26,Math.PI,0);c.fill();
  c.fillStyle='#e8dcc2';c.beginPath();c.arc(hx,hy+8,19,0,7);c.fill();
  c.strokeStyle=L.C.encre;c.lineWidth=2;c.beginPath();c.moveTo(hx,hy+8);c.lineTo(hx+1,hy-7);c.moveTo(hx,hy+8);c.lineTo(hx+3,hy-5);c.stroke();
  c.fillStyle='#1d140b';c.fillRect(hx-16,hy+40,32,140);
  const bal=Math.sin(t*Math.PI)*.32;c.save();c.translate(hx,hy+44);c.rotate(bal);c.strokeStyle=L.C.or;c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,110);c.stroke();c.fillStyle=L.C.or;c.beginPath();c.arc(0,114,8,0,7);c.fill();c.restore();
  // porte fermée à clé ; la lumière du couloir sous la porte
  c.fillStyle='#2e1d0e';c.fillRect(PORTE.x-10,226,PORTE.w+20,SOL-226);c.fillStyle='#4a2f16';c.fillRect(PORTE.x,236,PORTE.w,SOL-236);
  c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=2;c.strokeRect(PORTE.x+14,256,PORTE.w-28,150);c.strokeRect(PORTE.x+14,424,PORTE.w-28,170);
  const couloir=1-seg(t,21.6,21.9);if(couloir>0){c.fillStyle=`rgba(255,200,120,${.8*couloir})`;c.fillRect(PORTE.x,SOL-3,PORTE.w,3)}
  // lit
  c.fillStyle='#3a2410';c.fillRect(350,412,22,SOL-412);c.beginPath();c.arc(361,412,14,Math.PI,0);c.fill();
  c.fillStyle='#3a2410';c.fillRect(806,486,22,SOL-486);c.fillRect(372,566,436,12);
  c.fillStyle='#e8dcc2';c.fillRect(372,530,436,38);
  c.fillStyle='#a8201a';c.fillRect(520,526,288,46);c.fillStyle='rgba(227,178,60,.5)';for(let x=532;x<808;x+=26)c.fillRect(x,530,2,38);
  c.fillStyle='#f4ead6';c.beginPath();c.ellipse(404,522,32,15,0,0,7);c.fill();
  c.fillStyle='#2e1d0e';[372,800].forEach(x=>c.fillRect(x,578,8,SOL-578));
  // table de chevet : tiroir à double fond, lampe
  c.fillStyle='#3a2410';c.fillRect(272,494,72,SOL-494);c.fillStyle='#4a2f16';c.fillRect(266,488,84,8);
  const ti=eio(seg(t,10.9,11.3))*(1-eio(seg(t,17.9,18.3)));
  c.fillStyle='#2a1a0c';c.fillRect(282-ti*40,516,52,30);c.fillStyle=L.C.or;c.beginPath();c.arc(308-ti*40,531,2.5,0,7);c.fill();
  const fond=Math.sin(Math.PI*seg(t,11.4,12.1));if(fond>0){c.fillStyle='#8a6a42';c.save();c.translate(258-ti*40+20,516);c.rotate(-fond*.6);c.fillRect(-18,-2,36,3);c.restore()}
  if(t>10.3&&t<99){c.fillStyle='#d9b23a';c.fillRect(278,478,30,10);c.fillStyle='#8a6a1a';c.fillRect(278,478,30,2)}
  c.fillStyle='#1d140b';c.fillRect(LAMPE.x-3,LAMPE.y,6,36);c.fillRect(LAMPE.x-12,LAMPE.y+32,24,4);
  c.fillStyle=lum>0?'#e8b45a':'#4a3a24';c.beginPath();c.moveTo(LAMPE.x-18,LAMPE.y+2);c.lineTo(LAMPE.x+18,LAMPE.y+2);c.lineTo(LAMPE.x+11,LAMPE.y-20);c.lineTo(LAMPE.x-11,LAMPE.y-20);c.closePath();c.fill();
}
function lumiereLampe(c,t,lum){
  if(lum<=0)return;c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(LAMPE.x,LAMPE.y,4,LAMPE.x,LAMPE.y,560);
  g.addColorStop(0,`rgba(255,190,100,${.36*lum})`);g.addColorStop(.45,`rgba(255,170,80,${.1*lum})`);g.addColorStop(1,'rgba(255,170,80,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
}
function livre(c,m,etat,F,t){
  if(!etat)return;c.save();c.translate(m.x,m.y);
  if(etat==='ouvert'){c.rotate(F>0?.35:-.35);c.fillStyle='#d9b23a';c.fillRect(-16,-12,32,22);c.fillStyle='#efe4cc';c.fillRect(-14,-10,13,17);c.fillRect(1,-10,13,17);
    const tp=seg(t,7.1,7.6);if(tp>0&&tp<1){c.fillStyle='#fff8e8';const w=13*Math.cos(Math.PI*tp);c.fillRect(Math.min(1,1+w),-11,Math.abs(w),17)}}
  else{c.rotate(.2);c.fillStyle='#d9b23a';c.fillRect(-9,-13,18,24);c.fillStyle='#8a6a1a';c.fillRect(-9,-13,3,24)}
  c.restore();
}
/* la couverture du livre, en gros plan */
function couverture(c,t,a){
  if(a<=0)return;c.save();c.globalAlpha=a;c.fillStyle='#120c08';c.fillRect(0,0,W,H);
  c.translate(640,360);c.rotate(-.04);c.fillStyle='#d9b23a';c.fillRect(-170,-240,340,480);c.fillStyle='rgba(120,80,20,.25)';c.fillRect(-170,-240,24,480);
  c.strokeStyle='#5a3e1b';c.lineWidth=2;c.strokeRect(-140,-210,290,420);
  c.fillStyle='#2a1a0c';c.textAlign='center';c.font="18px "+L.F.texte;L.setLS(c,'4px');c.fillText('S. FREUD',10,-130);
  c.font="700 30px "+L.F.texte;L.setLS(c,'1px');c.fillText('INTRODUCTION',10,-50);c.font="italic 22px "+L.F.texte;c.fillText('à la',10,-14);c.font="700 30px "+L.F.texte;c.fillText('PSYCHANALYSE',10,26);
  c.font="13px "+L.F.texte;L.setLS(c,'2px');c.fillText('TRADUIT DE L’ALLEMAND',10,90);c.font="15px "+L.F.texte;c.fillText('PAYOT · PARIS',10,170);L.setLS(c,'0px');
  c.restore();
}
/* le prospectus, sorti du double fond, qui se déplie */
function prospectus(c,t,a){
  if(a<=0)return;c.save();c.globalAlpha=a;c.fillStyle='rgba(12,8,6,.92)';c.fillRect(0,0,W,H);
  const u1=eio(seg(t,12.5,13.1)),u2=eio(seg(t,13.1,13.7)),k=.78;
  c.translate(640,370);c.rotate(.02*Math.sin(t*.6));c.scale(k*(.5+.5*u1),k*(.5+.5*u2));c.translate(-279.5,-397);
  L.afficheConcours(c);
  c.strokeStyle='rgba(90,62,27,.35)';c.lineWidth=2;c.beginPath();c.moveTo(279.5,0);c.lineTo(279.5,794);c.moveTo(0,397);c.lineTo(559,397);c.stroke();
  c.restore();
}

/* ---------- dehors : le rebord, Chopin, la Voie lactée ---------- */
const VL=(function(){const R=L.rng(1925),a=[];for(let i=0;i<700;i++){const u=R(),v=(R()+R()+R()-1.5)*.5;a.push({u,v,s:.4+R()*1.3,b:.3+R()*.7})}return a})();
function voieLactee(c,t,dy){
  c.save();c.translate(0,dy);
  const g=c.createLinearGradient(0,-400,0,700);g.addColorStop(0,'#030712');g.addColorStop(1,'#0e1a2e');c.fillStyle=g;c.fillRect(0,-400,W,1200);
  L.etoiles(c,t,0,0,false,800);
  c.save();c.translate(640,40);c.rotate(-.5);
  const band=c.createLinearGradient(0,-130,0,130);band.addColorStop(0,'rgba(230,225,215,0)');band.addColorStop(.5,'rgba(230,225,215,.13)');band.addColorStop(1,'rgba(230,225,215,0)');c.fillStyle=band;c.fillRect(-900,-130,1800,260);
  VL.forEach(s=>{c.fillStyle=`rgba(245,240,230,${s.b*(.6+.4*Math.sin(t*2+s.u*40))})`;c.fillRect(s.u*1800-900,s.v*220,s.s,s.s)});
  c.restore();c.restore();
}
function arbreNu(c,x,y,h,k){c.strokeStyle='#05080d';c.lineCap='round';const br=(x0,y0,a,l,w,d)=>{if(d>5||l<6)return;const x1=x0+Math.sin(a)*l,y1=y0-Math.cos(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();br(x1,y1,a-.42-((d*k)%3)*.05,l*.72,w*.65,d+1);br(x1,y1,a+.38+((d+k)%3)*.05,l*.7,w*.65,d+1)};br(x,y,0,h,14,0)}
function dehors(c,t){
  const desc=eio(seg(t,24,27.6)),K=1.8,C={x:395,y:lerp(-170,250,desc)};
  voieLactee(c,t,0);
  c.save();c.translate(640,420);c.scale(K,K);c.translate(-C.x,-C.y);
  arbreNu(c,40,640,120,1);arbreNu(c,760,640,130,2);
  c.fillStyle='#0d1712';c.fillRect(-300,S.sol,1400,200);c.fillStyle='rgba(220,230,240,.12)';c.fillRect(-300,S.sol,1400,6);
  const ouv=eio(seg(t,27.7,28.2))*(1-eio(seg(t,35.9,36.3)));
  L.maisonSarrail(c,{lumLouise:0,ouvre:ouv});
  const f=S.etage[S.louise];
  // Louise sur le rebord, dans son châle
  const assise=seg(t,28.3,29.2)*(1-seg(t,35.3,35.8));
  if(assise>0){c.save();c.globalAlpha=assise;
    const p=L.melange(L.POSES.assis,L.POSES.assis,0);p.lF=[1.45,-1.35];p.lB=[1.35,-1.25];p.aF=[.5,.8];p.aB=[.4,.9];
    p.hd=lerp(-.35,-.15,seg(t,31,33))+(t>32.6?-.1:0);
    const r=L.pantin(c,{x:f.x+14,F:1,p,s:.62,hipY:f.y+f.h-2},'L');
    c.fillStyle='#4a3b2c';c.beginPath();c.moveTo(r.tete.x-10,r.tete.y+9);c.lineTo(r.tete.x+12,r.tete.y+11);c.lineTo(r.tete.x+4,r.tete.y+44);c.lineTo(r.tete.x-14,r.tete.y+40);c.closePath();c.fill();
    c.restore()}
  // Chopin vient la rejoindre
  const ch=seg(t,29.8,30.8)*(1-seg(t,35.4,35.9));
  if(ch>0){c.save();c.globalAlpha=ch;L.chopin(c,f.x+f.w-10,f.y+f.h+1,.15,t*1.3,(t>33.4&&t<33.55)?1:0);c.restore()}
  c.restore();
  // la ville au loin, et une seule autre fenêtre allumée
  const pen=seg(t,32.6,33.4)*(1-seg(t,36.2,36.8));
  if(pen>0){c.save();c.globalAlpha=pen;c.globalCompositeOperation='lighter';const g=c.createRadialGradient(1180,560,1,1180,560,16);g.addColorStop(0,'rgba(255,214,130,.9)');g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(1180,560,16,0,7);c.fill();c.restore()}
}

function pensee(c,s,x,y,a,taille){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font=(taille||30)+"px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const OUVERTURE=[{s:'PURPAN · LA MAISON DES SARRAIL · MINUIT PASSÉ',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'« Je lisais les psaumes. »',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<24.2){
    const lum=t<22.6?1:0;
    c.save();const z=1+.05*eio(seg(t,5,22));c.translate(560,430);c.scale(z,z);c.translate(-560,-430);
    chambre(c,t,lum);lumiereLampe(c,t,lum);
    const lo=louise(t),r=L.pantin(c,lo.st,'L',0);livre(c,r.main,lo.livre,lo.st.F,t);
    if(lo.papier){c.save();c.translate(r.main.x,r.main.y);c.rotate(.3);c.fillStyle='#f1e7d3';c.fillRect(-9,-12,18,24);c.fillStyle=L.C.rouge;c.fillRect(-6,-8,12,2);c.restore()}
    if(t>=22.6){c.fillStyle='rgba(4,8,20,.82)';c.fillRect(0,0,W,H)}
    pensee(c,'Le samedi quatorze. Le dîner avec Henri Lasserre.',640,200,seg(t,17.6,18.1)*(1-seg(t,20.2,20.6)));
    pensee(c,'Le concours au Cabaret des Étoiles.',640,250,seg(t,18.7,19.2)*(1-seg(t,20.2,20.6)));
    pensee(c,'Elle savait lequel des deux elle allait choisir.',640,225,seg(t,20.6,21.1)*(1-seg(t,22.3,22.7)),32);
    c.restore();
    couverture(c,t,t<5.2?1:1-seg(t,5.2,6));
    prospectus(c,t,seg(t,12.3,12.6)*(1-seg(t,17,17.4)));
  }
  if(t>=23.4){c.save();c.globalAlpha=seg(t,23.4,24.2);dehors(c,t);c.restore();
    pensee(c,'Y a-t-il, quelque part dans cette ville, quelqu’un d’autre qui ne dort pas ?',640,96,seg(t,32.6,33.3)*(1-seg(t,35.4,35.9)),30)}
  L.noir(c,t<3?1:t<3.6?1-(t-3)/.6:t>36.6?(t-36.6)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,37.5);
  for(let s=6;s<22;s++)K.noise(T+s,.03,'bandpass',s%2?2600:1900,4,.04,.002);
  K.noise(T+4,.3,'highpass',3000,.7,.02,.05);K.noise(T+7.15,.25,'highpass',3000,.7,.03,.05);
  K.noise(T+9.4,.08,'lowpass',300,1,.06,.004);
  K.noise(T+10.95,.35,'bandpass',500,1,.05,.04);K.noise(T+11.6,.1,'bandpass',1500,1,.03,.01);
  K.noise(T+12.5,.4,'highpass',2500,.6,.04,.04);K.noise(T+13.1,.4,'highpass',2500,.6,.04,.04);
  const p=K.bus();K.phrase(L.THEME.motif,T+12.8,.62,'piano',p,.04);K.nappeAccord('Dm9',T+12.6,4.6,p,.006);
  K.noise(T+16.9,.4,'highpass',2500,.6,.03,.04);K.noise(T+17.95,.3,'bandpass',500,1,.05,.04);
  [17.8,18.6].forEach((w,i)=>K.piano([62,65][i],T+w,.025));K.piano(69,T+20.7,.035);
  // la maison s'endort : les pas du grand-père, une porte, la petite toux de la grand-mère, la lampe
  [20.4,20.9,21.4,21.9].forEach(w=>K.noise(T+w,.08,'lowpass',220,1,.06,.004));K.noise(T+22.05,.15,'lowpass',260,1,.06,.004);
  [22.25,22.4].forEach(w=>K.noise(T+w,.08,'bandpass',700,3,.035,.004));K.noise(T+22.62,.02,'bandpass',3000,5,.06,.001);
  // dehors
  K.nappe(T+23.4,14,'lowpass',300,.6,[[1.5,.05],[13,.05],[14,0]]);
  K.souffle(46,T+27.7,.45,{g:.012,cut:600,vib:10,att:.08});
  [[31,0],[31.35,0]].forEach(([w])=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(420,T+w);o.frequency.exponentialRampToValueAtTime(220,T+w+.14);const g=ac.createGain();K.env(g,T+w,.005,.025,.16);o.connect(K.lp(1100)).connect(g).connect(K.out);o.start(T+w);o.stop(T+w+.25)});
  [[78,1],[84,.7]].forEach(([m,v])=>{const o=ac.createOscillator();o.type='triangle';o.frequency.setValueAtTime(K.mf(m)*.97,T+32.2);o.frequency.linearRampToValueAtTime(K.mf(m),T+32.5);const g=ac.createGain();g.gain.setValueAtTime(0,T+32.2);g.gain.linearRampToValueAtTime(.018*v,T+32.4);g.gain.setValueAtTime(.018*v,T+33.4);g.gain.linearRampToValueAtTime(0,T+34);o.connect(K.lp(1600)).connect(g).connect(K.out);o.start(T+32.2);o.stop(T+34.1)});
  const v=K.bus();K.phrase(L.THEME.lent.slice(0,5),T+30,.7,'violon',v,.028);K.nappeAccord('Fmaj9',T+29.6,6.5,v,.006);
  K.souffle(46,T+35.9,.4,{g:.01,cut:600,vib:10,att:.08});K.noise(T+36.3,.1,'lowpass',220,1,.06,.004);
  K.finale(T,37.5);
}

L.film({duree:37.5,rendu,partition,affiche:15});
})();
