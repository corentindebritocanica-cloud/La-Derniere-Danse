/* Plan 02 — L'atelier du Pont-Neuf (34 s) — chapitre 1
   Toulouse la nuit : la Garonne, le Pont-Neuf et ses oculi ; travelling jusqu'à la fenêtre en demi-lune.
   Dans le grenier : Célestin peint la Garonne sous la pluie. Julien monte avec une bouteille et parle du concours.
   Quand il est parti, Célestin retourne la toile contre le mur, pose une toile vierge et reste devant jusqu'à deux heures,
   « d'attendre un modèle qui n'était pas encore arrivé ». */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H;
const EAU=470,TABLIER=380,FEN={x:175,y:140,r:52};

/* ---------- caméra ---------- */
function camera(t){
  const p1=eio(seg(t,3.6,8.6)),p2=eio(seg(t,8.6,11.4));
  const cx=lerp(lerp(1640,640,p1),FEN.x+8,p2),cy=lerp(360,FEN.y-24,p2),z=Math.exp(Math.log(3.5)*p2);
  return{cx,cy,z};
}

/* ---------- le Pont-Neuf : sept arches inégales et leurs oculi ---------- */
const ARCHES=[];(function(){let x=640;[150,190,230,250,230,190,150].forEach((sp,i)=>{x+=40;ARCHES.push({cx:x+sp/2,sp,rise:Math.min(78,sp*.36)});x+=sp});ARCHES.fin=x+40})();
const LANTERNES=[660,860,1100,1360,1620,1870,2090,2310];
function pont(c,t){
  c.fillStyle='#2b1813';c.beginPath();c.rect(640,TABLIER,ARCHES.fin-640,EAU-TABLIER+2);
  ARCHES.forEach(a=>{c.moveTo(a.cx+a.sp/2,EAU+2);c.ellipse(a.cx,EAU+2,a.sp/2,a.rise,0,0,Math.PI,true);c.closePath()});
  ARCHES.slice(0,-1).forEach(a=>{const x=a.cx+a.sp/2+20;c.moveTo(x+13,418);c.arc(x,418,13,0,Math.PI*2,true)});
  c.fill('evenodd');
  c.strokeStyle='rgba(227,178,60,.12)';c.lineWidth=1.5;ARCHES.forEach(a=>{c.beginPath();c.ellipse(a.cx,EAU+2,a.sp/2+6,a.rise+6,0,Math.PI,0);c.stroke()});
  c.fillStyle='#21130e';c.fillRect(640,TABLIER-12,ARCHES.fin-640,12);
  LANTERNES.forEach((x,i)=>{c.fillStyle='#120b08';c.fillRect(x-2,TABLIER-48,4,36);c.fillRect(x-6,TABLIER-56,12,10);
    const f=.85+.15*Math.sin(t*7+i*2);c.save();c.globalCompositeOperation='lighter';
    const g=c.createRadialGradient(x,TABLIER-51,1,x,TABLIER-51,40);g.addColorStop(0,`rgba(255,214,130,${.8*f})`);g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(x,TABLIER-51,40,0,7);c.fill();c.restore()});
}
function garonne(c,t){
  const g=c.createLinearGradient(0,EAU,0,H+200);g.addColorStop(0,'#13243b');g.addColorStop(1,'#060c16');c.fillStyle=g;c.fillRect(-1200,EAU,5000,600);
  c.save();c.beginPath();c.rect(-1200,EAU,5000,600);c.clip();
  c.translate(0,2*EAU);c.scale(1,-1);c.globalAlpha=.22;pont(c,t);c.restore();
  c.save();c.globalCompositeOperation='lighter';
  LANTERNES.forEach((x,i)=>{for(let k=0;k<9;k++){const y=EAU+12+k*13,w=10+18*Math.abs(Math.sin(t*1.7+k*1.3+i)),o=Math.sin(t*1.1+k*.9+i)*6;
    c.fillStyle=`rgba(255,200,110,${.32-k*.03})`;c.fillRect(x-w/2+o,y,w,2)}});
  c.restore();
  c.strokeStyle='rgba(120,150,190,.12)';c.lineWidth=1;
  for(let k=0;k<26;k++){const y=EAU+8+k*9,x=((k*173+t*(14+k%5*4))%2600)-700;c.beginPath();c.moveTo(x,y);c.lineTo(x+60+k%4*20,y);c.stroke()}
}

/* ---------- la façade de brique ---------- */
function facade(c,t,peinture){
  // immeuble voisin
  c.fillStyle='#1d100d';c.fillRect(-420,70,430,EAU-70);c.fillStyle='#10141b';c.beginPath();c.moveTo(-430,70);c.lineTo(-380,10);c.lineTo(-30,10);c.lineTo(20,70);c.closePath();c.fill();
  [[-360,150],[-240,150],[-120,150],[-360,250],[-240,250],[-120,250],[-360,340],[-240,340],[-120,340]].forEach(([x,y])=>{c.fillStyle='#0b0807';c.fillRect(x,y,50,62)});
  // quai
  c.fillStyle='#24150f';c.fillRect(-1200,EAU,1830,400);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;
  for(let y=EAU+18;y<EAU+400;y+=20){c.beginPath();c.moveTo(-1200,y);c.lineTo(630,y);c.stroke();for(let x=-1200+((y/20)%2)*30;x<630;x+=60){c.beginPath();c.moveTo(x,y-20);c.lineTo(x,y);c.stroke()}}
  c.fillStyle='#3a2318';c.fillRect(-1200,EAU-4,1834,6);
  // la maison : brique toulousaine
  c.fillStyle='#3d1f18';c.fillRect(10,150,330,EAU-150);
  c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=1;
  for(let y=156;y<EAU;y+=8){c.beginPath();c.moveTo(10,y);c.lineTo(340,y);c.stroke();for(let x=10+((y/8)%2)*11;x<340;x+=22){c.beginPath();c.moveTo(x,y-8);c.lineTo(x,y);c.stroke()}}
  [[50,175],[150,175],[250,175],[50,262],[150,262],[250,262]].forEach(([x,y])=>{c.fillStyle='#0d0a09';c.fillRect(x,y,48,60);
    c.strokeStyle='#241812';c.lineWidth=2;c.beginPath();c.moveTo(x+24,y);c.lineTo(x+24,y+60);c.stroke();
    c.fillStyle='#5a3e1b';c.fillRect(x-4,y+60,56,4)});
  // boulangerie
  c.fillStyle='#120c09';c.fillRect(18,352,316,118);
  c.fillStyle='#1d140f';c.fillRect(18,352,316,24);
  c.fillStyle=L.C.or;c.font="15px "+L.F.titre;c.textAlign='center';L.setLS(c,'4px');c.fillText('BOULANGERIE · FABRE',176,369);L.setLS(c,'0px');
  c.fillStyle='#0a0706';c.fillRect(36,388,180,74);c.fillRect(236,388,80,82);
  c.save();c.globalCompositeOperation='lighter';const four=c.createRadialGradient(80,450,2,80,450,60);four.addColorStop(0,'rgba(255,150,70,.22)');four.addColorStop(1,'rgba(255,150,70,0)');c.fillStyle=four;c.fillRect(36,388,180,74);c.restore();
  // toit mansardé
  c.fillStyle='#121821';c.beginPath();c.moveTo(0,152);c.lineTo(36,52);c.lineTo(314,52);c.lineTo(350,152);c.closePath();c.fill();
  c.strokeStyle='rgba(120,140,170,.12)';for(let y=62;y<150;y+=10){c.beginPath();c.moveTo(36-(y-52)*.36,y);c.lineTo(314+(y-52)*.36,y);c.stroke()}
  c.fillStyle='#1d100d';c.fillRect(70,22,26,32);c.fillRect(260,28,22,26);
  fenetre(c,t,peinture);
  // réverbère du quai
  const lx=470;c.fillStyle='#0d0907';c.fillRect(lx-3,330,6,EAU-330);c.fillRect(lx-9,318,18,14);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(lx,325,2,lx,325,90);g.addColorStop(0,'rgba(255,214,130,.75)');g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(lx,325,90,0,7);c.fill();c.restore();
}

/* ---------- la fenêtre en demi-lune ---------- */
function fenetre(c,t,peinture){
  const {x,y,r}=FEN;
  c.save();c.beginPath();c.moveTo(x-r,y);c.arc(x,y,r,Math.PI,0);c.closePath();c.clip();
  const g=c.createRadialGradient(x+18,y-8,4,x,y,r*1.2);g.addColorStop(0,'#ffd98a');g.addColorStop(.6,'#e3a53c');g.addColorStop(1,'#8a5a1f');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,r);
  // chevalet et toile
  c.strokeStyle='#3a2410';c.lineWidth=2;c.beginPath();c.moveTo(x+34,y);c.lineTo(x+40,y-40);c.moveTo(x+52,y);c.lineTo(x+44,y-40);c.stroke();
  c.fillStyle='#f4ead6';c.save();c.translate(x+42,y-26);c.rotate(-.08);c.fillRect(-13,-15,26,30);
  // ce qu'il peint : la Garonne de nuit, touche après touche
  c.fillStyle=L.C.bleu;const n=Math.floor(peinture*9);for(let i=0;i<n;i++){c.fillRect(-11,-13+i*3.2,8+((i*7)%14),2.4)}
  if(peinture>.6){c.fillStyle=L.C.or;c.fillRect(-4,-9,2.5,2.5)}
  c.restore();
  // Célestin
  const ph=t*3.1,actif=1;
  const p=L.melange(L.POSES.peint,L.POSES.peint,0);
  p.aF=[1.75+.28*Math.sin(ph)*actif,.55+.25*Math.cos(ph)*actif];p.hd=-.05+.12*Math.sin(t*.7);
  const m=L.pantin(c,{x:x-12,F:1,p,s:.7,hipY:y+42},'C');
  c.strokeStyle='#5a3e1b';c.lineWidth=1.6;c.beginPath();c.moveTo(m.main.x,m.main.y);c.lineTo(m.main.x+9,m.main.y-6);c.stroke();
  c.fillStyle=L.C.bleu;c.beginPath();c.arc(m.main.x+9.5,m.main.y-6.4,1.6,0,7);c.fill();
  c.restore();
  // menuiserie en soleil rayonnant
  c.strokeStyle='rgba(42,26,16,.55)';c.lineWidth=1.3;for(let i=1;i<6;i++){const a=Math.PI+i*Math.PI/6;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.stroke()}
  c.beginPath();c.arc(x,y,16,Math.PI,0);c.stroke();
  c.strokeStyle='#6b5a45';c.lineWidth=8;c.beginPath();c.arc(x,y,r+4,Math.PI,0);c.stroke();
  c.fillStyle='#6b5a45';c.fillRect(x-r-12,y,2*r+24,7);
  // halo vers l'extérieur
  c.save();c.globalCompositeOperation='lighter';const h=c.createRadialGradient(x,y-20,10,x,y-20,150);h.addColorStop(0,'rgba(255,200,110,.18)');h.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=h;c.beginPath();c.arc(x,y-20,150,0,7);c.fill();c.restore();
}

/* ---------- le grenier, à l'intérieur ---------- */
const FI={x:800,y:340,r:175};
const TOILE={x:470,y:296,w:160,h:200};
const DIALOGUE=[
  {t:12.75,qui:'C',s:'C’est ouvert !'},
  {t:15.9,qui:'J',s:'Tu as vu l’affiche ? Maurice organise un concours.'},
  {t:18,qui:'J',s:'Un confirmé avec quelqu’un qui débute. Tirage au sort.'},
  {t:20.1,qui:'C',s:'Madame Fabre danserait très bien. Elle pétrit en trois temps.'},
  {t:22.2,qui:'C',s:'Je peins la Garonne, le Pont-Neuf… Mais il n’y a rien dedans.'},
  {t:24.3,qui:'J',s:'Tu veux dire qu’il n’y a personne dedans.'},
  {t:26,qui:'J',s:'Inscris-toi. On ne sait jamais sur qui on tombe.'}];
function garonnePeinte(c,x,y,w,h,t){
  c.fillStyle='#e9e0cc';c.fillRect(x,y,w,h);
  c.fillStyle='#55657a';c.fillRect(x+6,y+6,w-12,h*.45);c.fillStyle='#2f4560';c.fillRect(x+6,y+h*.55,w-12,h*.45-6);
  c.fillStyle='#3a2a20';c.fillRect(x+6,y+h*.42,w-12,h*.1);
  c.fillStyle='#55657a';for(let k=0;k<4;k++){c.beginPath();c.ellipse(x+22+k*38,y+h*.52,14,10,0,Math.PI,0);c.fill()}
  c.strokeStyle='rgba(220,225,235,.5)';c.lineWidth=1;for(let k=0;k<14;k++){const xx=x+10+k*11;c.beginPath();c.moveTo(xx,y+10);c.lineTo(xx-8,y+h*.4);c.stroke()}
  c.fillStyle='rgba(227,178,60,.8)';for(let k=0;k<4;k++)c.fillRect(x+20+k*38,y+h*.62+((k*7)%10),3,10);
}
function toile(c,t){
  // la toile de la Garonne se retourne, puis une toile vierge prend sa place
  const ret=seg(t,27.3,27.9),pose=seg(t,27.9,28.5),vierge=seg(t,28.6,29.2);
  const T=TOILE;
  if(ret<1){const k=Math.cos(Math.PI/2*ret);c.save();c.translate(T.x+T.w/2,0);c.scale(Math.max(.02,k),1);c.translate(-(T.x+T.w/2),0);garonnePeinte(c,T.x,T.y,T.w,T.h,t);c.restore()}
  else{const x=lerp(T.x,40,eio(pose)),y=lerp(T.y,T.y+110,eio(pose));c.fillStyle='#6b4a2a';c.fillRect(x,y,T.w*.7,T.h*.9);c.strokeStyle='#3a2410';c.lineWidth=3;c.strokeRect(x+6,y+6,T.w*.7-12,T.h*.9-12);c.beginPath();c.moveTo(x+6,y+6);c.lineTo(x+T.w*.7-6,y+T.h*.9-6);c.stroke()}
  if(vierge>0){const k=eio(vierge);c.save();c.translate(T.x+T.w/2,0);c.scale(k,1);c.translate(-(T.x+T.w/2),0);c.fillStyle='#f6efe0';c.fillRect(T.x,T.y,T.w,T.h);c.strokeStyle='rgba(90,62,27,.3)';c.strokeRect(T.x+4,T.y+4,T.w-8,T.h-8);c.restore()}
}
function grenier(c,t){
  const nuit=seg(t,29.3,33);
  const g=c.createLinearGradient(0,0,0,612);g.addColorStop(0,'#33241a');g.addColorStop(1,'#5a4128');c.fillStyle=g;c.fillRect(0,0,W,612);
  c.fillStyle='#1d140d';c.beginPath();c.moveTo(0,0);c.lineTo(360,0);c.lineTo(0,250);c.closePath();c.fill();c.beginPath();c.moveTo(W,0);c.lineTo(1000,0);c.lineTo(W,190);c.closePath();c.fill();
  // la fenêtre en demi-lune, vue de l'intérieur : le Pont-Neuf
  c.save();c.beginPath();c.moveTo(FI.x-FI.r,FI.y);c.arc(FI.x,FI.y,FI.r,Math.PI,0);c.closePath();c.clip();
  c.fillStyle='#0b1628';c.fillRect(FI.x-FI.r,FI.y-FI.r,2*FI.r,FI.r);
  c.fillStyle='rgba(241,231,211,.8)';[[-120,-120],[-60,-150],[30,-130],[100,-100],[140,-60],[-140,-50]].forEach(([dx,dy])=>c.fillRect(FI.x+dx,FI.y+dy,1.6,1.6));
  const lx=FI.x+90-nuit*120;c.fillStyle='#ede3cf';c.beginPath();c.arc(lx,FI.y-110+nuit*30,11,0,7);c.fill();
  c.fillStyle='#14243a';c.fillRect(FI.x-FI.r,FI.y-34,2*FI.r,34);
  c.fillStyle='#1a0f0b';c.fillRect(FI.x-FI.r,FI.y-62,2*FI.r,18);for(let k=0;k<5;k++){c.fillStyle='#14243a';c.beginPath();c.ellipse(FI.x-140+k*70,FI.y-44,24,16,0,Math.PI,0);c.fill()}
  c.save();c.globalCompositeOperation='lighter';for(let k=0;k<5;k++){const x=FI.x-150+k*70;c.fillStyle='rgba(255,214,130,.8)';c.fillRect(x,FI.y-72,3,4);for(let j=0;j<3;j++){c.fillStyle=`rgba(255,200,110,${.3-j*.08})`;c.fillRect(x-4+Math.sin(t*2+k+j)*3,FI.y-26+j*8,10,2)}}c.restore();
  c.restore();
  c.strokeStyle='#2a1a10';c.lineWidth=3;for(let i=1;i<6;i++){const a=Math.PI+i*Math.PI/6;c.beginPath();c.moveTo(FI.x,FI.y);c.lineTo(FI.x+Math.cos(a)*FI.r,FI.y+Math.sin(a)*FI.r);c.stroke()}
  c.beginPath();c.arc(FI.x,FI.y,40,Math.PI,0);c.stroke();c.lineWidth=12;c.beginPath();c.arc(FI.x,FI.y,FI.r+5,Math.PI,0);c.stroke();c.fillStyle='#2a1a10';c.fillRect(FI.x-FI.r-14,FI.y,2*FI.r+28,12);
  // plancher
  c.fillStyle='#2a1a0c';c.fillRect(0,612,W,108);c.strokeStyle='rgba(0,0,0,.25)';for(let y=622;y<720;y+=16){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  // toiles retournées contre le mur, croquis punaisés
  [[20,430,70,180],[60,450,80,160],[100,470,60,140]].forEach(([x,y,w,h])=>{c.fillStyle='#5a3e22';c.fillRect(x,y,w,h);c.strokeStyle='#3a2410';c.lineWidth=2;c.strokeRect(x+5,y+5,w-10,h-10)});
  [[200,200],[250,180],[300,215]].forEach(([x,y],i)=>{c.save();c.translate(x,y);c.rotate((i-1)*.08);c.fillStyle='#e8dcc2';c.fillRect(-18,-24,36,48);c.strokeStyle='rgba(31,58,95,.6)';c.beginPath();c.moveTo(-10,10);c.lineTo(0,-12);c.lineTo(10,8);c.stroke();c.restore()});
  // table : pots de confiture, pinceaux, lampe, gramophone
  c.fillStyle='#3a2410';c.fillRect(150,470,200,10);c.fillRect(160,480,8,132);c.fillRect(332,480,8,132);
  [[230,450],[252,452],[274,449]].forEach(([x,y])=>{c.fillStyle='rgba(220,230,240,.35)';c.fillRect(x-7,y,14,20);c.strokeStyle='#5a3e1b';c.lineWidth=2;c.beginPath();c.moveTo(x-2,y);c.lineTo(x-5,y-22);c.moveTo(x+2,y);c.lineTo(x+6,y-18);c.stroke()});
  c.fillStyle='#1d140b';c.fillRect(165,440,40,30);c.fillStyle=L.C.or;c.beginPath();c.moveTo(188,440);c.lineTo(214,392);c.lineTo(234,404);c.closePath();c.fill();
  const tourne=t>11.2&&t<25.4?t*3:0;c.fillStyle='#0a0705';c.beginPath();c.ellipse(185,438,16,4,0,0,7);c.fill();c.fillStyle='#a8201a';c.beginPath();c.ellipse(185,438,4,1.2,tourne,0,7);c.fill();
  c.fillStyle='#1d140b';c.fillRect(306,440,16,30);c.fillStyle='rgba(255,226,150,.95)';c.fillRect(308,424,12,16);
  // chevalet
  c.strokeStyle='#3a2410';c.lineWidth=7;c.beginPath();c.moveTo(TOILE.x+20,612);c.lineTo(TOILE.x+80,TOILE.y-30);c.lineTo(TOILE.x+140,612);c.moveTo(TOILE.x+80,TOILE.y-30);c.lineTo(TOILE.x+96,612);c.stroke();c.fillStyle='#3a2410';c.fillRect(TOILE.x-8,TOILE.y+TOILE.h,TOILE.w+16,9);
  toile(c,t);
  // lit étroit, poêle en fonte, porte
  c.fillStyle='#2e1d0e';c.fillRect(900,548,230,14);c.fillRect(900,562,8,50);c.fillRect(1122,562,8,50);c.fillStyle='#6b4a2a';c.fillRect(900,532,230,18);c.fillStyle='#e8dcc2';c.fillRect(904,524,50,12);
  c.fillStyle='#120c08';c.fillRect(1150,520,56,92);c.fillRect(1170,200,14,320);c.fillStyle=`rgba(255,120,50,${.5+.15*Math.sin(t*6)})`;c.fillRect(1162,560,30,18);
  const porte=eio(seg(t,12.9,13.3))*(1-eio(seg(t,26.9,27.3)));c.fillStyle='#120b08';c.fillRect(1214,300,66,312);c.fillStyle='rgba(255,200,120,.25)';c.fillRect(1214,300,66*porte,312);c.fillStyle='#4a2f16';c.fillRect(1214+66*porte,300,66*(1-porte),312);
}
function lumiere(c,t){
  const nuit=seg(t,29.3,33),f=1+.05*Math.sin(t*9);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(314,430,6,314,430,620*f);g.addColorStop(0,`rgba(255,190,100,${.38*(1-.5*nuit)})`);g.addColorStop(1,'rgba(255,190,100,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  if(nuit>0){c.fillStyle=`rgba(5,8,18,${.35*nuit})`;c.fillRect(0,0,W,H)}
}
function julien(t){
  if(t<13||t>27.1)return null;
  let st={x:1245,F:-1,p:L.melange(L.POSES.debout,L.POSES.debout,0),alpha:seg(t,13,13.3)*(1-seg(t,26.7,27.1))};
  if(t<13.9){const n=Math.sin(t*16);st.p.aF=[1.6+.4*n,1.2];st.p.aB=[1.4-.4*n,1.3]}
  const ent=seg(t,13.3,14.8);if(t<15){st.x=lerp(1245,990,eio(ent));if(ent>0&&ent<1)st.p=L.pas(st.p,(t-13.3)*11,.32,0)}
  if(t>=14.8&&t<25.4){const s=eio(seg(t,14.8,15.3));st.x=990;st.p=L.melange(st.p,L.POSES.assis,s);if(s>=1)st.hipY=548;else st.hipY=lerp(526,548,s);
    const dent=Math.sin(Math.PI*seg(t,15.4,16));st.p.aF=[lerp(.9,2.45,dent),lerp(1,.35,dent)];st.p.hd=-.15*dent}
  if(t>=25.4){const u=seg(t,25.4,25.8);st.p=L.melange(L.POSES.assis,L.POSES.debout,eio(u));st.hipY=u<1?lerp(548,526,u):undefined;
    const so=seg(t,25.9,27);st.x=lerp(990,1245,eio(so));st.F=so>0?1:-1;if(so>0&&so<1)st.p=L.pas(L.POSES.debout,(t-25.9)*11,.32,0)}
  return st;
}
function celestin(t){
  const p=L.melange(L.POSES.peint,L.POSES.peint,0),peint=t<15.6?1:0,ph=t*3.2;
  p.aF=[1.7+.25*Math.sin(ph)*peint,.55+.2*Math.cos(ph)*peint];
  if(t>=15.6){p.aF=[lerp(1.7,.3,eio(seg(t,15.6,16.2))),.3];p.hd=0}
  if(t>21.9&&t<24)p.hd=-.3;
  let x=400,F=1;
  if(t>=27.2){p.aF=[lerp(.3,1.4,Math.sin(Math.PI*seg(t,27.2,29))),.4];p.aB=[lerp(-.1,1.2,Math.sin(Math.PI*seg(t,27.3,28.9))),.4]}
  if(t>=29.2){p.aF=[.15,.3];p.aB=[-.05,.2];p.hd=.12+.05*Math.sin(t*.8);p.tA=.04}
  return{x,F,p};
}
function paroles(c,t,tetes){
  c.save();c.textAlign='center';c.font="25px "+L.F.main;L.setLS(c,'0px');
  for(const d of DIALOGUE){const l=[d.t,d.qui,d.s],du=L.lue(l);if(t<d.t||t>d.t+du)continue;const h=tetes[d.qui];if(!h)continue;
    c.globalAlpha=L.seg(t,d.t,d.t+.3)*(1-L.seg(t,d.t+du-.3,d.t+du))*L.coupe(t,DIALOGUE.map(e=>[e.t]),l);const x=clamp(h.x+(d.qui==='C'?60:-60),300,W-300),y=250-L.pile(t,DIALOGUE.map(e=>[e.t]),l)+34;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';c.strokeText(d.s,x,y);c.fillStyle='#fbf3e2';c.fillText(d.s,x,y)}
  c.restore();
}
function interieur(c,t){
  grenier(c,t);lumiere(c,t);
  const ce=celestin(t);
  const r=L.pantin(c,{x:ce.x,F:1,p:ce.p,s:1.15},'C');
  if(t<15.6||t>=29.2){const m=r.main;c.strokeStyle='#5a3e1b';c.lineWidth=2.4;c.beginPath();c.moveTo(m.x,m.y);c.lineTo(m.x+16,m.y-14);c.stroke();c.fillStyle=L.C.bleu;c.beginPath();c.arc(m.x+16,m.y-14,2.4,0,7);c.fill()}
  const jt=julien(t);let tj=null;
  if(jt){c.save();c.globalAlpha=jt.alpha;const rj=L.pantin(c,{...jt,s:1.12},'J');tj=rj.tete;
    if(t<25.5){const m=rj.main;c.save();c.translate(m.x,m.y);c.rotate(jt.F>0?-.4:.4);c.fillStyle='#1f3a24';c.fillRect(-5,-30,10,30);c.fillRect(-2.5,-40,5,10);c.restore()}
    c.restore()}
  if(t>15.85&&t<16.6){const u=seg(t,15.85,16.6);c.fillStyle='#c9a67a';c.beginPath();c.arc(990-30-u*80,370-u*60+u*u*140,3,0,7);c.fill()}
  const nuit=seg(t,29.3,33);if(nuit>0){c.fillStyle=`rgba(5,8,18,${.25*nuit})`;c.fillRect(0,0,W,H)}
  paroles(c,t,{C:r.tete,J:tj});
  const h2=seg(t,29.4,30)*(1-seg(t,33,33.6));
  if(h2>0){c.save();c.globalAlpha=h2;c.fillStyle='#d9c9a8';c.textAlign='center';c.font="20px "+L.F.machine;L.setLS(c,'8px');c.fillText('DEUX HEURES DU MATIN',640,680);L.setLS(c,'0px');c.restore()}
  const h3=seg(t,30.6,31.4)*(1-seg(t,33.1,33.7));
  if(h3>0){c.save();c.globalAlpha=h3;c.fillStyle='#f6ecd8';c.textAlign='center';c.font="30px "+L.F.main;c.fillText('… d’attendre un modèle qui n’était pas encore arrivé.',640,120);c.restore()}
}

const OUVERTURE=[{s:'TOULOUSE · RUE DE LA RÉPUBLIQUE · UN JEUDI SOIR',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Dessinateur le jour, peintre la nuit.',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<11.8){
    const cam=camera(t);
    L.ciel(c,0,520);L.etoiles(c,t,0,0,false,430);
    c.save();c.globalCompositeOperation='lighter';const lune=c.createRadialGradient(1080,110,4,1080,110,120);lune.addColorStop(0,'rgba(241,231,211,.18)');lune.addColorStop(1,'rgba(241,231,211,0)');c.fillStyle=lune;c.fillRect(900,0,380,260);c.restore();
    c.fillStyle='#ede3cf';c.beginPath();c.arc(1080,110,22,0,7);c.fill();c.fillStyle='#0b1526';c.beginPath();c.arc(1090,104,20,0,7);c.fill();
    c.save();c.translate(W/2,H/2);c.scale(cam.z,cam.z);c.translate(-cam.cx,-cam.cy);
    L.toulouse(c,1500+(cam.cx-640)*.82,EAU-58,0,1.5,{fond:'#0d1626'});
    c.fillStyle='#0f1622';c.fillRect(-1200,EAU-60,5000,60);
    garonne(c,t);pont(c,t);facade(c,t,.75);
    c.restore();
  }
  if(t>=11.2){c.save();c.globalAlpha=seg(t,11.2,11.8);interieur(c,t);c.restore()}
  L.noir(c,t<3?1:t<4?1-(t-3):t>33.2?(t-33.2)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,34);
  K.nappe(T+2.8,9,'lowpass',420,.5,[[1,.07],[7.6,.07],[8.6,0]]);
  for(let i=0;i<16;i++){const w=3.5+Math.random()*7;K.noise(T+w,.25+Math.random()*.3,'bandpass',500+Math.random()*500,1.5,.02+Math.random()*.025,.08)}
  K.phrase(L.THEME.lent.slice(0,4),T+4.2,.8,'piano',null,.035);
  // le gramophone du grenier : un disque de jazz, tout doucement
  const disque=K.bus();const f=K.lp(1400);disque.disconnect();disque.connect(f).connect(K.out);disque.gain.setValueAtTime(0,T+11);disque.gain.linearRampToValueAtTime(.55,T+11.8);disque.gain.setValueAtTime(.55,T+15.4);disque.gain.linearRampToValueAtTime(.28,T+16);disque.gain.setValueAtTime(.28,T+24.8);disque.gain.linearRampToValueAtTime(0,T+25.6);
  K.orchestre(T+11.2,.6,['Dm9','G13','Cmaj9','A7','Dm9','G13'],disque,{piano:.02,batterie:false});
  K.phrase(L.THEME.motif,T+11.8,.6,'trompette',disque,.03);
  K.gramophone(T+11.2,14.4);
  // on frappe, la porte, le bouchon
  [12.55,12.75].forEach(w=>K.noise(T+w,.08,'lowpass',260,1,.14,.004));
  K.souffle(43,T+12.95,.35,{g:.01,cut:600,vib:9,att:.08});
  K.noise(T+15.85,.05,'bandpass',900,2,.12,.002);K.noise(T+15.86,.08,'lowpass',200,1,.08,.003);
  K.souffle(43,T+26.9,.35,{g:.01,cut:600,vib:9,att:.08});K.noise(T+27.25,.12,'lowpass',200,1,.12,.004);
  // la toile qu'on retourne, la toile vierge
  K.noise(T+27.35,.4,'bandpass',1200,.8,.04,.05);K.noise(T+28.6,.3,'bandpass',1800,.8,.03,.05);
  // l'attente : le thème qui ne s'achève pas
  [[29.6,69],[30.4,72],[31.2,74],[32,77]].forEach(([w,m])=>K.piano(m,T+w,.035));
  K.finale(T,34);
}

L.film({duree:34,rendu,partition,affiche:18.2});
})();
