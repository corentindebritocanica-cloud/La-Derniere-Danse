/* Plan 07 — Le portrait / la chambre fermée (22 s)
   À gauche, dans son grenier, Célestin peint Louise de mémoire au bleu de Prusse.
   L'écran se partage : à droite, à Purpan, la grand-mère surgit — « Élisabeth ! » — et ferme à double tour.
   Louise trace une étoile sur la vitre embuée ; Célestin achève les yeux du portrait. Une seule lune pour les deux. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL;
const TOILE={x:318,y:250,w:190,h:250},PRUSSE='#1f3a5f';

/* ---------- le portrait, trait après trait ---------- */
function trait(c,pts,p){if(p<=0)return null;const n=pts.length-1,k=p*n,i=Math.floor(k);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let j=1;j<=Math.min(i,n);j++)c.lineTo(pts[j][0],pts[j][1]);let fin=pts[Math.min(i,n)];
  if(i<n){const f=k-i,a=pts[i],b=pts[i+1];fin=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];c.lineTo(fin[0],fin[1])}c.stroke();return fin}
const ovale=[...Array(41)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI*2/40;return[95+Math.cos(a)*48,128+Math.sin(a)*62]});
const cheveux=[];for(let i=0;i<14;i++){const x=44+i*7.6,k=(x-95)/51;cheveux.push([[x,142],[x-k*2,112],[95+(x-95)*.75,84-Math.abs(k)*-6],[95+(x-95)*.4,68+Math.abs(k)*4]])}
const frange=[[48,106],[142,106]];
const cou=[[78,186],[80,214],[60,232],[30,246]],cou2=[[112,186],[110,214],[132,232],[162,246]];
const nez=[[96,128],[92,152],[99,154]],bouche=[[84,170],[96,168],[108,171]];
function portrait(c,t){
  c.save();c.translate(TOILE.x,TOILE.y);
  c.fillStyle='#f4ead6';c.fillRect(0,0,TOILE.w,TOILE.h);c.strokeStyle='rgba(90,62,27,.35)';c.lineWidth=1;c.strokeRect(4,4,TOILE.w-8,TOILE.h-8);
  c.strokeStyle=PRUSSE;c.fillStyle=PRUSSE;c.lineCap='round';c.lineJoin='round';
  let pinceau=null;const garde=(f)=>{if(f)pinceau=f};
  c.lineWidth=3;garde(trait(c,ovale,seg(t,3.8,5.6)));
  c.lineWidth=7;c.globalAlpha=.85;cheveux.forEach((s,i)=>garde(trait(c,s,seg(t,5.6+i*.2,5.9+i*.2))));c.globalAlpha=1;
  c.lineWidth=5;garde(trait(c,frange,seg(t,8.4,8.9)));
  c.lineWidth=2.5;garde(trait(c,cou,seg(t,9,10)));garde(trait(c,cou2,seg(t,9.6,10.6)));
  c.lineWidth=2;garde(trait(c,nez,seg(t,13.4,14)));garde(trait(c,bouche,seg(t,14.2,14.8)));
  // les yeux du petit hibou, en dernier
  [[78,128],[114,128]].forEach(([x,y],k)=>{const p=seg(t,16.6+k*.6,17.1+k*.6);if(p<=0)return;
    c.lineWidth=2.5;c.beginPath();c.ellipse(x,y,11,12,0,-Math.PI/2,-Math.PI/2+Math.PI*2*p);c.stroke();
    if(p>.8){c.globalAlpha=(p-.8)*5;c.beginPath();c.arc(x+1,y+1,4.5,0,7);c.fill();c.globalAlpha=1}
    if(p<1)pinceau=[x+Math.cos(-Math.PI/2+Math.PI*2*p)*11,y+Math.sin(-Math.PI/2+Math.PI*2*p)*12]});
  c.restore();
  return pinceau?{x:TOILE.x+pinceau[0],y:TOILE.y+pinceau[1]}:null;
}

/* ---------- à gauche : le grenier ---------- */
function grenier(c,t){
  const g=c.createLinearGradient(0,0,0,612);g.addColorStop(0,'#3e2c1c');g.addColorStop(1,'#6b4f30');c.fillStyle=g;c.fillRect(-500,0,2200,612);
  c.fillStyle='#24180e';c.beginPath();c.moveTo(-500,0);c.lineTo(900,0);c.lineTo(-500,300);c.closePath();c.fill();
  c.strokeStyle='#1a1009';c.lineWidth=14;[[-200,40],[100,-20]].forEach(([x,y])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+700,y+620);c.stroke()});
  // fenêtre en demi-lune, vue de l'intérieur
  c.fillStyle='#0d1b33';c.beginPath();c.moveTo(70,330);c.arc(150,330,80,Math.PI,0);c.closePath();c.fill();
  c.strokeStyle='#3a2410';c.lineWidth=3;for(let i=1;i<6;i++){const a=Math.PI+i*Math.PI/6;c.beginPath();c.moveTo(150,330);c.lineTo(150+Math.cos(a)*80,330+Math.sin(a)*80);c.stroke()}
  c.lineWidth=8;c.beginPath();c.arc(150,330,82,Math.PI,0);c.stroke();c.fillStyle='#3a2410';c.fillRect(62,330,176,8);
  // plancher, lampe
  c.fillStyle='#2a1a0c';c.fillRect(-500,612,2200,200);
  c.fillStyle='#1a1009';c.fillRect(600,540,40,72);c.fillStyle=L.C.or;c.fillRect(610,512,20,28);
  c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(620,510,4,620,510,420);lg.addColorStop(0,'rgba(255,190,100,.42)');lg.addColorStop(1,'rgba(255,190,100,0)');c.fillStyle=lg;c.fillRect(-500,0,2200,812);c.restore();
  // chevalet
  c.strokeStyle='#3a2410';c.lineWidth=6;c.beginPath();c.moveTo(TOILE.x+20,612);c.lineTo(TOILE.x+80,TOILE.y-30);c.lineTo(TOILE.x+170,612);c.moveTo(TOILE.x+95,TOILE.y-30);c.lineTo(TOILE.x+120,612);c.stroke();
  c.fillStyle='#3a2410';c.fillRect(TOILE.x-10,TOILE.y+TOILE.h,TOILE.w+20,10);
  const pin=portrait(c,t);
  // Célestin : le bras suit le pinceau
  const S={x:255,y:612-118},s=1.35,peint=pin&&t<17.9;
  const p=L.melange(L.POSES.debout,L.POSES.debout,0);p.tA=.08;
  const regarde=eio(seg(t,18.1,18.8));p.hd=lerp(.05,-.55,regarde);
  let cible=pin||{x:TOILE.x+30,y:TOILE.y+150};
  const sx=S.x+Math.sin(p.tA)*74*s,sy=S.y-Math.cos(p.tA)*74*s,dx=cible.x-sx,dy=cible.y-sy,d=Math.hypot(dx,dy);
  const a=Math.atan2(dx,dy);p.aF=peint?[a,.05]:[lerp(a,.6,seg(t,17.9,18.4)),.3];p.aB=[-.1,.4];
  const r=L.pantin(c,{x:S.x,F:1,p,s,hipY:S.y},'C');
  if(peint){const m=r.main,ux=(cible.x-m.x),uy=(cible.y-m.y),dd=Math.hypot(ux,uy);c.strokeStyle='#5a3e1b';c.lineWidth=2.4;c.beginPath();c.moveTo(m.x,m.y);c.lineTo(m.x+ux*Math.min(1,46/dd),m.y+uy*Math.min(1,46/dd));c.stroke();
    c.fillStyle=PRUSSE;c.beginPath();c.arc(cible.x,cible.y,3,0,7);c.fill()}
}

/* ---------- à droite : Purpan ---------- */
const FEN={x:150,y:150,w:300,h:320};
function purpan(c,t){
  c.fillStyle='#0b1526';c.fillRect(-100,0,900,720);
  c.fillStyle='#3a3026';c.fillRect(-100,90,900,630);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;for(let y=100;y<720;y+=16){c.beginPath();c.moveTo(-100,y);c.lineTo(800,y);c.stroke()}
  // glycine
  c.strokeStyle='#2a1d12';c.lineWidth=4;c.beginPath();c.moveTo(520,720);c.quadraticCurveTo(500,500,540,330);c.quadraticCurveTo(560,200,500,120);c.stroke();
  for(let k=0;k<16;k++){const y=150+k*30,x=520+Math.sin(k*1.7)*26;c.fillStyle=k%2?'#6b4a8a':'#7a5a9a';c.beginPath();c.ellipse(x,y,6,15,0,0,7);c.fill()}
  // intérieur vu par la fenêtre
  c.save();c.beginPath();c.rect(FEN.x,FEN.y,FEN.w,FEN.h);c.clip();
  const lum=1-.45*seg(t,12.3,12.8);
  c.fillStyle=L.mix('#6b5537','#a8875a',lum);c.fillRect(FEN.x,FEN.y,FEN.w,FEN.h);
  c.fillStyle='rgba(90,62,27,.12)';for(let x=FEN.x;x<FEN.x+FEN.w;x+=30)c.fillRect(x,FEN.y,12,FEN.h);
  const ouv=eio(seg(t,9.6,10))*(1-eio(seg(t,11.9,12.3)));
  c.fillStyle='#2e1d0e';c.fillRect(368,200,80,280);c.fillStyle='rgba(255,210,140,.75)';c.fillRect(372,204,72*ouv,276);
  if(ouv>.05){c.save();c.beginPath();c.rect(372,204,72*ouv,276);c.clip();
    L.amelie(c,408,486,{F:-1,s:.95,pointe:eio(seg(t,10.9,11.3))*(1-seg(t,11.7,11.9))});c.restore()}
  c.fillStyle='#4a2f16';c.fillRect(372+72*ouv,204,72*(1-ouv),276);
  // Louise
  let F=-1;const tour=eio(seg(t,9.7,10.1))*(1-eio(seg(t,13.6,14.1)));F=lerp(-1,1,tour);
  const p=L.melange(L.POSES.debout,L.POSES.debout,0);p.hd=.08;
  const sursaut=Math.sin(Math.PI*seg(t,10.4,10.9));p.tA=-.18*sursaut;
  const main=eio(seg(t,14.4,15))*(1-eio(seg(t,19.2,19.8)));p.aF=[lerp(.15,1.85,main),lerp(.2,.15,main)];
  L.pantin(c,{x:lerp(330,295,eio(seg(t,13.8,14.4))),F,p,s:1.25,hipY:445},'L');
  // buée et étoile tracée du doigt
  const bu=seg(t,13.8,14.8);if(bu>0){c.fillStyle=`rgba(215,222,232,${.32*bu})`;c.fillRect(FEN.x,FEN.y,FEN.w,FEN.h)}
  const etp=seg(t,15,18.2);if(etp>0){const pts=[];for(let i=0;i<=10;i++){const r=i%2?17:42,an=-Math.PI/2+i*Math.PI/5;pts.push([228+Math.cos(an)*r,292+Math.sin(an)*r])}
    c.strokeStyle='rgba(255,220,150,.95)';c.lineWidth=7;c.lineCap='round';c.lineJoin='round';trait(c,pts,etp)}
  c.restore();
  c.strokeStyle='#2a1a10';c.lineWidth=10;c.strokeRect(FEN.x,FEN.y,FEN.w,FEN.h);c.lineWidth=5;
  c.beginPath();c.moveTo(FEN.x+FEN.w/2,FEN.y);c.lineTo(FEN.x+FEN.w/2,FEN.y+FEN.h);[1,2].forEach(k=>{c.moveTo(FEN.x,FEN.y+FEN.h*k/3);c.lineTo(FEN.x+FEN.w,FEN.y+FEN.h*k/3)});c.stroke();
  c.fillStyle='#4a3d30';c.fillRect(FEN.x-16,FEN.y+FEN.h,FEN.w+32,12);
  c.save();c.globalCompositeOperation='lighter';const h=c.createRadialGradient(300,320,10,300,320,330);h.addColorStop(0,`rgba(255,200,110,${.16*lum})`);h.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=h;c.fillRect(-100,0,900,720);c.restore();
}
function serrure(c,t){
  const a=seg(t,12.3,12.5)*(1-seg(t,13.5,13.75));if(a<=0)return;
  c.save();c.globalAlpha=a;c.fillStyle='#120b08';c.fillRect(0,0,640,720);
  c.translate(320,360);c.fillStyle='#8a6a2a';c.beginPath();c.ellipse(0,0,90,170,0,0,7);c.fill();c.strokeStyle='#e3b23c';c.lineWidth=4;c.stroke();
  c.fillStyle='#0a0605';c.beginPath();c.arc(0,-30,26,0,7);c.fill();c.beginPath();c.moveTo(-14,-14);c.lineTo(14,-14);c.lineTo(22,60);c.lineTo(-22,60);c.closePath();c.fill();
  const rot=eio(seg(t,12.65,12.95))*Math.PI/2+eio(seg(t,13.05,13.35))*Math.PI/2;
  c.save();c.translate(0,-10);c.rotate(rot);c.fillStyle='#c9a13a';c.fillRect(-7,-110,14,100);c.beginPath();c.arc(0,-130,34,0,7);c.fill();c.fillStyle='#120b08';c.beginPath();c.arc(0,-130,14,0,7);c.fill();c.restore();
  c.fillStyle=L.C.papier;c.font="italic 26px "+L.F.texte;c.textAlign='center';c.fillText('à double tour',0,250);
  c.restore();
}
function elisabeth(c,t){
  const a=seg(t,10.35,10.5)*(1-seg(t,11.5,11.8));if(a<=0)return;
  const sh=(1-seg(t,10.35,11))*4;c.save();c.globalAlpha=a;c.translate(320+(Math.random()-.5)*sh,96+(Math.random()-.5)*sh);
  c.font="64px "+L.F.titre;c.textAlign='center';L.setLS(c,'3px');c.lineWidth=6;c.strokeStyle='#120b08';c.strokeText('« Élisabeth ! »',0,0);c.fillStyle=L.C.rouge;c.fillText('« Élisabeth ! »',0,0);L.setLS(c,'0px');c.restore();
}

const OUVERTURE=[{s:'LE LENDEMAIN SOIR',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Il la peint de mémoire.',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const e=eio(seg(t,8.6,9.6)),coupe=lerp(W,640,e),off=lerp(640-(TOILE.x+TOILE.w/2),320-(TOILE.x+TOILE.w/2)+20,e);
    const z=lerp(1.08,1,e);
    c.save();c.beginPath();c.rect(0,0,coupe,H);c.clip();c.translate(off+(TOILE.x+TOILE.w/2),360);c.scale(z,z);c.translate(-(TOILE.x+TOILE.w/2),-360);grenier(c,t);c.restore();
    if(e>0){c.save();c.beginPath();c.rect(coupe,0,W-coupe,H);c.clip();c.translate(coupe,0);purpan(c,t);serrure(c,t);elisabeth(c,t);c.restore();
      c.fillStyle='#b88f2e';c.fillRect(coupe-2,0,4,H);c.fillRect(coupe-9,0,18,3);c.fillRect(coupe-9,H-3,18,3)}
    // une seule lune pour les deux
    const lu=seg(t,9.6,10.6);if(lu>0){c.save();c.globalAlpha=lu;c.globalCompositeOperation='lighter';const g=c.createRadialGradient(640,70,4,640,70,90);g.addColorStop(0,'rgba(241,231,211,.35)');g.addColorStop(1,'rgba(241,231,211,0)');c.fillStyle=g;c.beginPath();c.arc(640,70,90,0,7);c.fill();c.restore();
      c.save();c.globalAlpha=lu;c.fillStyle='#ede3cf';c.beginPath();c.arc(640,70,26,0,7);c.fill();c.restore()}
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>21.2?(t-21.2)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,22);
  const p=K.bus();
  K.phrase(L.THEME.motif,T+3.8,.75,'piano',p,.04);
  K.nappeAccord('Dm9',T+3.8,5.2,p,.006);
  for(let w=3.9;w<10.5;w+=.37+Math.random()*.2)K.noise(T+w,.12,'bandpass',2400,1.2,.018,.03);
  p.gain.setValueAtTime(1,T+9.9);p.gain.linearRampToValueAtTime(0,T+10.2);
  K.noise(T+9.65,.5,'bandpass',300,1,.05,.05);
  // « Élisabeth ! »
  [50,51,56,57].forEach(m=>K.piano(m,T+10.38,.06));K.souffle(38,T+10.38,.9,{g:.04,cut:500,vib:4,att:.02});K.souffle(39,T+10.38,.9,{g:.03,cut:500,vib:4,att:.02});
  K.noise(T+11.95,.3,'lowpass',160,.8,.16,.004);
  // la clé, à double tour
  [12.95,13.35].forEach(w=>{K.noise(T+w,.05,'bandpass',3200,6,.12,.002);K.noise(T+w+.03,.08,'bandpass',1400,4,.06,.002)});
  // l'étoile sur la vitre, le portrait achevé
  const v=K.bus();K.phrase(L.THEME.lent,T+14,.62,'violon',v,.032);
  K.nappeAccord('Dm9',T+14,4,v,.006);K.nappeAccord('Bbmaj7',T+18,3.6,v,.007);
  [15.4,16.2,17,17.8].forEach((w,i)=>K.cloche([93,91,88,86][i],T+w,null,.012));
  K.cloche(86,T+19,null,.03);
  K.finale(T,22);
}

L.film({duree:22,rendu,partition,affiche:17.4});
})();
