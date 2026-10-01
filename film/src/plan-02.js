/* Plan 02 — Le peintre à sa fenêtre (22 s)
   Toulouse la nuit : la Garonne, le Pont-Neuf et ses oculi. Travelling de droite à gauche
   jusqu'à la façade de brique de la boulangerie, puis zoom dans la fenêtre en demi-lune où Célestin peint. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H;
const EAU=470,TABLIER=380,FEN={x:175,y:140,r:52};

/* ---------- caméra ---------- */
function camera(t){
  const p1=eio(seg(t,3.6,12)),p2=eio(seg(t,12,18.6));
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
  const ph=t*3.1,actif=seg(t,18.4,18.8)*(1-seg(t,20.6,21));
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

const OUVERTURE=[{s:'TOULOUSE · RUE DE LA RÉPUBLIQUE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Dessinateur le jour, peintre la nuit.',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const cam=camera(t);
    L.ciel(c,0,520);L.etoiles(c,t,0,0,false,430);
    c.save();c.globalCompositeOperation='lighter';const lune=c.createRadialGradient(1080,110,4,1080,110,120);lune.addColorStop(0,'rgba(241,231,211,.18)');lune.addColorStop(1,'rgba(241,231,211,0)');c.fillStyle=lune;c.fillRect(900,0,380,260);c.restore();
    c.fillStyle='#ede3cf';c.beginPath();c.arc(1080,110,22,0,7);c.fill();c.fillStyle='#0b1526';c.beginPath();c.arc(1090,104,20,0,7);c.fill();
    c.save();c.translate(W/2,H/2);c.scale(cam.z,cam.z);c.translate(-cam.cx,-cam.cy);
    L.toulouse(c,1500+(cam.cx-640)*.82,EAU-58,0,1.5,{fond:'#0d1626'});
    c.fillStyle='#0f1622';c.fillRect(-1200,EAU-60,5000,60);
    garonne(c,t);pont(c,t);facade(c,t,seg(t,14,21));
    c.restore();
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>21.1?(t-21.1)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,22);
  K.nappe(T+2.8,19.4,'lowpass',420,.5,[[1,.07],[6,.09],[11,.07],[16,.05],[19.2,0]]);
  for(let i=0;i<40;i++){const w=3.5+Math.random()*16;K.noise(T+w,.25+Math.random()*.3,'bandpass',500+Math.random()*500,1.5,.02+Math.random()*.025,.08)}
  [12.6,14.4,16.2].forEach(w=>{K.cloche(43,T+w,null,.09);K.cloche(55,T+w+.02,null,.04)});
  K.phrase(L.THEME.lent,T+5,.8,'piano',null,.04);
  K.nappeAccord('Dm9',T+12,5,null,.008);K.nappeAccord('Fmaj9',T+17,4.6,null,.01);
  for(let w=18.5;w<20.6;w+=1.01){K.noise(T+w,.18,'bandpass',2600,1,.03,.05)}
  K.piano(81,T+20.7,.03);K.piano(76,T+20.95,.025);
  K.finale(T,22);
}

L.film({duree:22,rendu,partition,affiche:19.6});
})();
