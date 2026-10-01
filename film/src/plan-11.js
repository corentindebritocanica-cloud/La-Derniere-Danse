/* Plan 11 — Le portrait (chapitre 10, ~100 s)
   A. Deux temps : celui de Purpan, réglé comme la pendule de la cheminée ; et l'autre, celui des mardis et des nuits.
      Le mardi, il l'attend à l'arrêt du tramway de Saint-Cyprien, adossé à un réverbère.
   B. Chez Solange : « le peintre » donne un coup de main. Il danse une minute avec chacun, et ils dansent mieux.
      Le carnet : « Il soigne les gens avec les mains, comme je voudrais les soigner avec des mots. »
   C. « Vous m'aviez fait une promesse. » L'escalier en colimaçon, le grenier, le chevalet. « Quand avez-vous peint ça ? »
      … « D'une mémoire que je n'avais pas encore. » « Personne ne m'a jamais regardée comme ça. » « Alors les autres sont aveugles. »
   D. Les nuits volées : la glycine devenue escalier, la Mini capote relevée le long du canal, le cercle des habitués,
      Louise qui lit Freud à voix haute sur le lit trop étroit.
   E. Le jeudi au Cabaret : Henri, Jeanne, « Exposition au midi ». « Tes grands-parents ne voulaient pas non plus que tu danses. Et regarde-toi. » */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){for(const l of lignes){const a=env(t,l[0],l[3]||1.5);if(a<=0)continue;const h=tetes[l[1]];if(h)parole(c,l[2],h.x+(l[4]||0),h.y-(l[5]||62),a)}}
const OX=640-440,OY=660-640; // le pied de la glycine au centre, le sol à 660 px
const scr=p=>p&&{x:p.x+OX,y:p.y+OY};
function ciel(c,t){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#060b15');g.addColorStop(1,'#13233b');c.fillStyle=g;c.fillRect(0,0,W,H);L.etoiles(c,t,0,0,false,300)}
function jardin(c){
  c.fillStyle='#070d12';[[-150,470,95],[-90,540,80],[880,470,100],[960,540,90],[1050,500,120]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(x,y,r,r*1.3,0,0,7);c.fill();c.fillRect(x-6,y,12,640-y)});
  c.fillStyle='#0d1712';c.fillRect(-300,640,1700,120);
  for(let k=0;k<140;k++){const x=-260+((k*131.7)%1600),y=646+((k*37)%60);c.fillStyle='rgba(225,235,245,.1)';c.fillRect(x,y,2,1.5)}
}
// le banc de pierre au pied de la glycine (il y reviendra au chapitre 9)
function banc(c){c.fillStyle='#3a3229';c.fillRect(470,612,90,10);c.fillStyle='#2a241d';c.fillRect(478,622,10,18);c.fillRect(542,622,10,18)}
const FRANGE={x:437,y:452};
function frange(c,a){if(a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle='#050403';c.lineWidth=1.3;for(let k=0;k<5;k++){c.beginPath();c.moveTo(FRANGE.x+k*1.6,FRANGE.y);c.lineTo(FRANGE.x+k*1.6+(k-2)*.6,FRANGE.y+10+k%2*2);c.stroke()}c.restore()}
const GRIMPE={tA:.12,hd:-.25,aF:[2.75,-.2],aB:[2.45,.35],lF:[.95,-1.25],lB:[.15,.15]};
function platane(c,x,base,h,k,sc){sc=sc||1;c.save();c.translate(x,base);c.scale(sc,sc);c.strokeStyle='#0a0d12';c.lineCap='round';
  const br=(x0,y0,a,l,w,d)=>{if(d>5||l<7)return;const x1=x0+Math.sin(a)*l,y1=y0-Math.cos(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();br(x1,y1,a-.4-((d*k)%3)*.06,l*.72,w*.62,d+1);br(x1,y1,a+.36+((d+k)%3)*.06,l*.7,w*.62,d+1)};
  c.fillStyle='#2a2318';c.fillRect(-11,-h*.55,22,h*.55);c.fillStyle='rgba(150,140,115,.22)';c.fillRect(-7,-h*.45,9,26);c.fillRect(1,-h*.25,8,30);br(0,-h*.5,0,h*.32,16,0);c.restore()}
function pave(c,y0){c.fillStyle='#14100d';c.fillRect(0,y0,W,H-y0);c.strokeStyle='rgba(255,255,255,.045)';c.lineWidth=1;
  for(let r=0;r<6;r++){const off=(r%2)*20;for(let x=off-40;x<W+40;x+=40){c.beginPath();c.ellipse(x,y0+22+r*20,17,7,0,0,7);c.stroke()}}
  for(let k=0;k<160;k++){const x=(k*97.3)%W,y=y0+8+((k*53)%110);c.fillStyle=`rgba(230,238,250,${.08+.1*((k*7)%5)/5})`;c.fillRect(x,y,2,1.5)}}
function reverbere(c,x,top,on){const SOL=L.SOL;
  c.fillStyle='#0b0706';c.fillRect(x-3,top+28,6,SOL-top-28);c.fillRect(x-12,top+18,24,14);c.beginPath();c.moveTo(x-14,top+18);c.lineTo(x,top);c.lineTo(x+14,top+18);c.fill();
  c.fillStyle=`rgba(255,226,150,${.2+.8*on})`;c.fillRect(x-9,top+20,18,10);
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,top+25,2,x,top+25,120);g.addColorStop(0,`rgba(255,214,130,${.5*on})`);g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(x,top+25,120,0,7);c.fill();
  const p=c.createRadialGradient(x,SOL,2,x,SOL,200);p.addColorStop(0,`rgba(255,214,130,${.28*on})`);p.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=p;c.beginPath();c.ellipse(x,SOL,200,30,0,0,7);c.fill();c.restore()}
const KM=.6,HS=520,HX=640-390*KM,HY=HS-640*KM;
const GX0=575,GW=130,GTOP=402,GBAS=600;
function grille(c,ouv){
  c.save();c.strokeStyle='#1f3a2c';c.fillStyle='#1f3a2c';c.lineWidth=3;
  for(let x=4;x<W;x+=14){if(x>GX0-8&&x<GX0+GW+8)continue;c.beginPath();c.moveTo(x,GBAS);c.lineTo(x,GTOP+10);c.stroke();c.beginPath();c.moveTo(x-4,GTOP+12);c.lineTo(x,GTOP-4);c.lineTo(x+4,GTOP+12);c.fill()}
  c.lineWidth=4;[[0,GX0-8],[GX0+GW+8,W]].forEach(([a,b])=>[GTOP+34,GBAS-30].forEach(y=>{c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.stroke()}));
  [GX0-22,GX0+GW+6].forEach(x=>{c.fillStyle='#4a4238';c.fillRect(x,GTOP-24,18,GBAS-GTOP+24);c.fillStyle='#5a5246';c.fillRect(x-4,GTOP-30,26,8)});
  c.translate(GX0+2,0);c.scale(1-.85*ouv,1);c.strokeStyle='#1f3a2c';c.fillStyle='#1f3a2c';c.lineWidth=3;
  for(let x=6;x<GW-4;x+=12){c.beginPath();c.moveTo(x,GBAS);c.lineTo(x,GTOP+18);c.stroke();c.beginPath();c.moveTo(x-4,GTOP+20);c.lineTo(x,GTOP+4);c.lineTo(x+4,GTOP+20);c.fill()}
  c.lineWidth=4;[GTOP+34,GBAS-30].forEach(y=>{c.beginPath();c.moveTo(0,y);c.lineTo(GW-4,y);c.stroke()});c.beginPath();c.arc(GW/2-2,(GTOP+GBAS)/2+8,18,0,7);c.stroke();c.restore()}
function perron(c){const px=HX+390*KM;for(let k=0;k<6;k++){const y=HS+k*6,w=56+k*12;c.fillStyle=k%2?'#463e34':'#4c443a';c.fillRect(px-w/2,y,w,6)}}
const FI={x:800,y:340,r:175},TOILE={x:470,y:296,w:160,h:200};
// le portrait à l'huile, sans esquisse : visage de trois quarts tourné vers la gauche, carré à la garçonne, grands yeux sombres
function portrait(c,x,y,w,h,u){
  c.save();c.translate(x,y);c.scale(w/160,h/200);
  c.fillStyle='#f4ead6';c.fillRect(0,0,160,200);
  const a=(s,e)=>eio(seg(u,s,e)),lay=(al,f)=>{if(al<=0)return;c.globalAlpha=al;f();c.globalAlpha=1};
  lay(a(0,.14),()=>{const g=c.createLinearGradient(0,0,160,200);g.addColorStop(0,'#4a3424');g.addColorStop(1,'#2a1d18');c.fillStyle=g;c.fillRect(0,0,160,200)});
  lay(a(.5,.62),()=>{c.fillStyle='#14181f';c.beginPath();c.moveTo(20,200);c.quadraticCurveTo(30,158,74,150);c.quadraticCurveTo(118,156,140,200);c.closePath();c.fill()});
  lay(a(.12,.32),()=>{c.fillStyle='#d9b08c';c.fillRect(66,124,22,30);c.fillStyle='#e6c3a0';c.beginPath();c.ellipse(76,98,32,42,-.08,0,7);c.fill();
    c.fillStyle='rgba(120,70,50,.28)';c.beginPath();c.ellipse(96,104,14,34,-.08,0,7);c.fill();c.fillStyle='rgba(210,120,100,.25)';c.beginPath();c.arc(62,112,9,0,7);c.fill()});
  lay(a(.3,.52),()=>{c.fillStyle='#2b1a12';c.beginPath();c.moveTo(40,120);c.quadraticCurveTo(34,62,72,52);c.quadraticCurveTo(114,50,116,96);c.lineTo(118,128);c.lineTo(102,130);c.lineTo(102,84);c.quadraticCurveTo(80,74,52,82);c.lineTo(50,124);c.closePath();c.fill();
    c.beginPath();c.moveTo(46,84);c.quadraticCurveTo(76,70,106,84);c.lineTo(104,90);c.lineTo(48,90);c.closePath();c.fill()});
  lay(a(.62,.8),()=>{[[60,100],[86,98]].forEach(([ex,ey],i)=>{c.fillStyle='#efe4d2';c.beginPath();c.ellipse(ex,ey,i?7:8,5,0,0,7);c.fill();c.fillStyle='#1b120d';c.beginPath();c.arc(ex-1.5,ey,4.2,0,7);c.fill();
      c.fillStyle='#f6efe0';c.fillRect(ex-3,ey-2.5,1.6,1.6);c.strokeStyle='#2b1a12';c.lineWidth=1.8;c.beginPath();c.moveTo(ex-8,ey-9);c.quadraticCurveTo(ex,ey-13,ex+7,ey-9);c.stroke()})});
  lay(a(.8,.94),()=>{c.strokeStyle='rgba(120,70,50,.6)';c.lineWidth=1.6;c.beginPath();c.moveTo(70,104);c.lineTo(66,118);c.lineTo(72,120);c.stroke();
    c.fillStyle='#b5534a';c.beginPath();c.moveTo(60,130);c.quadraticCurveTo(70,126,80,129);c.quadraticCurveTo(70,137,60,130);c.fill();c.fillStyle='rgba(181,83,74,.45)';c.fillRect(62,128,6,2)});
  lay(a(.94,1),()=>{c.fillStyle='rgba(255,236,200,.35)';c.beginPath();c.ellipse(58,82,10,5,-.4,0,7);c.fill();c.fillRect(48,120,3,8)});
  c.restore();
  // où en est le pinceau (pour le bras de Célestin)
  const cibles=[[.14,[40,40]],[.32,[76,98]],[.52,[80,66]],[.62,[80,176]],[.8,[73,99]],[.94,[70,128]],[1,[58,84]]];
  for(const[k,pt]of cibles)if(u<k)return{x:x+pt[0]*w/160+Math.sin(u*90)*4,y:y+pt[1]*h/200+Math.cos(u*70)*4};return null;
}
function grenier(c,t,soir){
  const jour=1-soir;
  const g=c.createLinearGradient(0,0,0,612);g.addColorStop(0,L.mix('#2a1d14','#4a3726',jour));g.addColorStop(1,L.mix('#4a3622','#6b5236',jour));c.fillStyle=g;c.fillRect(0,0,W,612);
  c.fillStyle='#1d140d';c.beginPath();c.moveTo(0,0);c.lineTo(360,0);c.lineTo(0,250);c.closePath();c.fill();c.beginPath();c.moveTo(W,0);c.lineTo(1000,0);c.lineTo(W,190);c.closePath();c.fill();
  // la fenêtre en demi-lune : le Pont-Neuf, de jour ou au crépuscule
  c.save();c.beginPath();c.moveTo(FI.x-FI.r,FI.y);c.arc(FI.x,FI.y,FI.r,Math.PI,0);c.closePath();c.clip();
  const sg=c.createLinearGradient(0,FI.y-FI.r,0,FI.y);sg.addColorStop(0,L.mix('#8fa6bd','#14213a',soir));sg.addColorStop(1,L.mix('#d9d6c8','#c9865a',soir));c.fillStyle=sg;c.fillRect(FI.x-FI.r,FI.y-FI.r,2*FI.r,FI.r);
  c.fillStyle=L.mix('#7d8a96','#2a3346',soir);c.fillRect(FI.x-FI.r,FI.y-34,2*FI.r,34);
  c.fillStyle=L.mix('#8a6a50','#2a1a12',soir);c.fillRect(FI.x-FI.r,FI.y-62,2*FI.r,18);
  for(let k=0;k<5;k++){c.fillStyle=L.mix('#7d8a96','#2a3346',soir);c.beginPath();c.ellipse(FI.x-140+k*70,FI.y-44,24,16,0,Math.PI,0);c.fill()}
  c.restore();
  c.strokeStyle='#2a1a10';c.lineWidth=3;for(let i=1;i<6;i++){const a=Math.PI+i*Math.PI/6;c.beginPath();c.moveTo(FI.x,FI.y);c.lineTo(FI.x+Math.cos(a)*FI.r,FI.y+Math.sin(a)*FI.r);c.stroke()}
  c.beginPath();c.arc(FI.x,FI.y,40,Math.PI,0);c.stroke();c.lineWidth=12;c.beginPath();c.arc(FI.x,FI.y,FI.r+5,Math.PI,0);c.stroke();c.fillStyle='#2a1a10';c.fillRect(FI.x-FI.r-14,FI.y,2*FI.r+28,12);
  if(jour>0){c.save();c.globalCompositeOperation='lighter';const lg=c.createLinearGradient(800,340,520,612);lg.addColorStop(0,`rgba(255,240,205,${.2*jour})`);lg.addColorStop(1,'rgba(255,240,205,0)');
    c.fillStyle=lg;c.beginPath();c.moveTo(640,340);c.lineTo(960,340);c.lineTo(760,612);c.lineTo(420,612);c.closePath();c.fill();c.restore()}
  c.fillStyle='#2a1a0c';c.fillRect(0,612,W,108);c.strokeStyle='rgba(0,0,0,.25)';for(let y=622;y<720;y+=16){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  // toiles retournées (le fleuve, les ponts, les toits)
  [[20,430,70,180],[60,450,80,160],[100,470,60,140]].forEach(([x,y,w,h])=>{c.fillStyle='#5a3e22';c.fillRect(x,y,w,h);c.strokeStyle='#3a2410';c.lineWidth=2;c.strokeRect(x+5,y+5,w-10,h-10)});
  // table : pots de confiture et pinceaux, trois tasses de café, la lampe
  c.fillStyle='#3a2410';c.fillRect(150,470,200,10);c.fillRect(160,480,8,132);c.fillRect(332,480,8,132);
  [[230,450],[252,452]].forEach(([x,y])=>{c.fillStyle='rgba(220,230,240,.35)';c.fillRect(x-7,y,14,20);c.strokeStyle='#5a3e1b';c.lineWidth=2;c.beginPath();c.moveTo(x-2,y);c.lineTo(x-5,y-22);c.moveTo(x+2,y);c.lineTo(x+6,y-18);c.stroke()});
  [[176,462],[196,462],[284,462]].forEach(([x,y])=>{c.fillStyle='#e8e1d0';c.fillRect(x-6,y-6,12,12)});
  c.fillStyle='#1d140b';c.fillRect(306,440,16,30);c.fillStyle=soir>0?`rgba(255,226,150,${.4+.55*soir})`:'#6b5a3a';c.fillRect(308,424,12,16);
  // chevalet et portrait
  c.strokeStyle='#3a2410';c.lineWidth=7;c.beginPath();c.moveTo(TOILE.x+20,612);c.lineTo(TOILE.x+80,TOILE.y-30);c.lineTo(TOILE.x+140,612);c.moveTo(TOILE.x+80,TOILE.y-30);c.lineTo(TOILE.x+96,612);c.stroke();c.fillStyle='#3a2410';c.fillRect(TOILE.x-8,TOILE.y+TOILE.h,TOILE.w+16,9);
  // lit étroit, poêle, la porte
  c.fillStyle='#2e1d0e';c.fillRect(900,548,230,14);c.fillRect(900,562,8,50);c.fillRect(1122,562,8,50);c.fillStyle='#6b4a2a';c.fillRect(900,532,230,18);c.fillStyle='#e8dcc2';c.fillRect(904,524,50,12);
  c.fillStyle='#120c08';c.fillRect(1150,520,56,92);c.fillRect(1170,200,14,320);c.fillStyle=`rgba(255,120,50,${.45+.15*Math.sin(t*6)})`;c.fillRect(1162,560,30,18);
  // la patère : veste
  c.fillStyle='#120b08';c.fillRect(1200,250,10,8);
}
function porte(c,ouv){c.fillStyle='#120b08';c.fillRect(1214,300,66,312);c.fillStyle='rgba(255,200,120,.22)';c.fillRect(1214,300,66*ouv,312);c.fillStyle='#4a2f16';c.fillRect(1214+66*ouv,300,66*(1-ouv),312)}
function lampe(c,soir,f){if(soir<=0)return;c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(314,430,6,314,430,620*f);g.addColorStop(0,`rgba(255,190,100,${.38*soir})`);g.addColorStop(1,'rgba(255,190,100,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore()}

function narr(c,s,a,y,coul){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="italic 32px "+L.F.texte;c.lineWidth=5;c.strokeStyle='rgba(8,10,18,.85)';c.strokeText(s,640,y);c.fillStyle=coul||'#f1e7d3';c.fillText(s,640,y);c.restore()}
function main(c,s,a,y){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="34px "+L.F.main;c.lineWidth=6;c.strokeStyle='rgba(8,10,18,.85)';c.strokeText(s,640,y);c.fillStyle=L.C.or;c.fillText(s,640,y);c.restore()}
function lunettes(c,r,F){c.save();c.strokeStyle=L.C.papier;c.lineWidth=1.4;c.beginPath();c.arc(r.tete.x+F*7,r.tete.y+1,4,0,7);c.stroke();c.restore()}

/* ================= A. deux temps ================= */
function pendule(c,x,y,t,lent){c.fillStyle='#2e1d0e';c.fillRect(x-40,y-90,80,180);c.fillStyle='#e8dcc2';c.beginPath();c.arc(x,y-40,28,0,7);c.fill();
  c.strokeStyle=L.C.encre;c.lineWidth=2;const h=Math.floor(t/lent);c.beginPath();c.moveTo(x,y-40);c.lineTo(x+Math.sin(h*.5)*18,y-40-Math.cos(h*.5)*18);c.moveTo(x,y-40);c.lineTo(x,y-62);c.stroke();
  c.strokeStyle='#c9a13a';c.lineWidth=3;const a=.35*Math.sin(t*Math.PI/lent);c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(a)*60,y+Math.cos(a)*60);c.stroke();c.fillStyle='#c9a13a';c.beginPath();c.arc(x+Math.sin(a)*60,y+Math.cos(a)*60,8,0,7);c.fill()}
function sceneA(c,t){
  // le salon de Purpan, gris : la broderie, le thé de cinq heures
  c.fillStyle='#3a3836';c.fillRect(0,0,W,SOL);c.fillStyle='rgba(255,255,255,.03)';for(let x=0;x<W;x+=46)c.fillRect(x,0,18,SOL);c.fillStyle='#24201c';c.fillRect(0,SOL,W,H-SOL);
  c.fillStyle='#2a2420';c.fillRect(160,360,240,252);c.fillStyle='#1a1512';c.fillRect(180,430,200,182);
  pendule(c,280,260,t,1.6);
  const pl=cp(P.assis);pl.aF=[1.1,.8+.15*Math.sin(t*2)];pl.hd=.25;L.pantin(c,{x:720,F:-1,p:pl,hipY:560},'L');c.fillStyle='#e8e1d0';c.fillRect(640,540,26,18);
  c.fillStyle='#2e1d0e';c.fillRect(680,560,80,52);
  L.amelie(c,960,SOL,{F:-1,s:1});c.fillStyle='#f0ece2';c.fillRect(900,470,14,10);
  heure(c,'PURPAN · LE TEMPS DE LA PENDULE',env(t,3.4,5));
  narr(c,'Le petit déjeuner à huit heures, le thé à cinq heures, les visites, la broderie…',env(t,4,4.4),680);
}
function sceneA2(c,t){
  // l'arrêt du tramway de Saint-Cyprien, la nuit
  L.ciel(c,0,480);L.etoiles(c,t,0,0,false,300);
  c.fillStyle='#22140f';[[0,300],[300,340],[640,300],[960,360]].forEach(([x,h])=>{c.fillRect(x,SOL-h,300,h);for(let r=0;r<2;r++)for(let k=0;k<3;k++){c.fillStyle=(r+k+x/300)%3===0?'rgba(227,178,60,.6)':'#0d0a09';c.fillRect(x+40+k*90,SOL-h+40+r*90,36,52)}c.fillStyle='#22140f'});
  pave(c,SOL);reverbere(c,760,330,1);
  // le tramway repart
  const tr=seg(t,9,12.4),tx=lerp(260,-560,eic(tr));c.fillStyle='#7a1813';c.fillRect(tx,430,460,150);c.fillStyle='#e8c97a';for(let k=0;k<6;k++)c.fillRect(tx+20+k*72,452,52,46);c.fillStyle='#0b0706';c.fillRect(tx+60,580,40,24);c.fillRect(tx+360,580,40,24);
  c.strokeStyle='#0b0706';c.lineWidth=2;c.beginPath();c.moveTo(tx+230,430);c.lineTo(tx+260,330);c.stroke();
  // lui, adossé au réverbère, les mains dans les poches ; elle se retient de courir
  const pc=cp(P.debout);pc.tA=-.06;pc.aF=[.15,.6];pc.aB=[-.05,.6];const vue=t>11.6;if(vue)pc.hd=-.05;
  L.pantin(c,{x:792,F:-1,p:pc},'C');
  const arr=seg(t,10.4,13.2),pl=arr<1&&arr>0?L.pas(P.debout,t*13,.36,0):cp(P.debout);pl.tA=arr>0&&arr<1?.12:0;
  L.pantin(c,{x:lerp(330,700,eio(arr)),F:1,p:pl,levres:true},'L');
  heure(c,'SAINT-CYPRIEN · LE MARDI',env(t,8.8,4));
}

/* ================= B. chez Solange ================= */
function salleSolange(c){
  c.fillStyle='#4a3a2e';c.fillRect(0,0,W,SOL);c.fillStyle='rgba(255,255,255,.04)';for(let x=0;x<W;x+=120)c.fillRect(x,0,4,SOL);
  c.fillStyle='#c9cbd0';c.fillRect(80,120,420,300);c.fillStyle='rgba(30,40,60,.5)';c.fillRect(90,130,400,280); // le miroir
  c.fillStyle='#2e1d0e';c.fillRect(0,300,W,8); // la barre
  [[640,90],[900,110]].forEach(([x,y])=>{c.fillStyle='#e8dcc2';c.beginPath();c.arc(x,y,6,0,7);c.fill()});
  c.fillStyle='#3a2414';c.fillRect(0,SOL,W,H-SOL);c.strokeStyle='rgba(0,0,0,.2)';for(let x=0;x<W;x+=60){c.beginPath();c.moveTo(x,SOL);c.lineTo(x,H);c.stroke()}
  c.fillStyle='#1d140b';c.fillRect(1060,470,120,142);c.fillStyle='#0d0806';c.fillRect(1070,480,100,40); // le piano
}
function sceneB(c,t){
  salleSolange(c);
  // Solange, au piano
  const ps=cp(P.assis);ps.aF=[1.3,.4+.1*Math.sin(t*8)];L.pantin(c,{x:1120,F:-1,p:ps,hipY:540},'S');
  // Louise au fond, qui observe
  const pl=cp(P.debout);pl.hd=-.02;pl.aF=[.9,1.3];L.pantin(c,{x:160,F:1,p:pl,s:.86,sol:560,levres:true},'L');
  // il prend les élèves un par un, danse une minute : d'abord raides, puis ils dansent mieux sans savoir pourquoi
  const k=Math.floor((t-14)/4.4),u=((t-14)%4.4)/4.4;
  const types=['Y','X','Y'],eleve=types[clamp(k,0,2)];
  const ph=(t-14)/.5*Math.PI,amp=lerp(.1,.32,eio(seg(u,.2,.7))),raide=1-seg(u,.2,.7);
  const X=640+30*Math.sin(t*.8);
  const pc=L.pas(P.tenue,ph,amp,0),pe=L.pas(P.tenue,ph+Math.PI,amp,0);pe.tA=-.05*raide;pe.hd=.3*raide;
  L.pantin(c,{x:X-55,F:1,p:pc},'C');L.pantin(c,{x:X+55,F:-1,p:pe,s:eleve==='Y'?.95:1},eleve);
  heure(c,'CHEZ SOLANGE · LE MARDI',env(t,14.2,4));
  main(c,'« Il soigne les gens avec les mains, comme je voudrais les soigner avec des mots. »',env(t,21.4,5.6),110);
}

/* ================= C. le grenier ================= */
const LC=[[29,'L','Vous m’aviez fait une promesse.',1.8],
  [42.2,'L','Quand avez-vous peint ça ?',1.6],[44,'C','Dimanche matin. En rentrant de Purpan. Jusqu’à midi.',2.4],[46.7,'L','Mais vous ne me connaissiez que depuis une nuit.',2.3],
  [49.4,'C','Je crois que je vous ai peinte de mémoire, petit hibou.',2.5],[52.1,'C','D’une mémoire que je n’avais pas encore.',2.3],
  [57.2,'L','Personne ne m’a jamais regardée comme ça.',2.2],[59.6,'C','Alors les autres sont aveugles.',1.9]];
function sceneC1(c,t){ // le Pont-Neuf, la fenêtre en demi-lune ; il hésite, ouvre la porte
  L.ciel(c,0,480);L.etoiles(c,t,0,0,false,300);
  c.fillStyle='#3d1f18';c.fillRect(390,150,500,462);c.fillStyle='#121821';c.beginPath();c.moveTo(380,150);c.lineTo(420,70);c.lineTo(860,70);c.lineTo(900,150);c.closePath();c.fill();
  const cx=640,cy=140;c.fillStyle='#0b0d12';c.beginPath();c.arc(cx,cy,56,Math.PI,0);c.closePath();c.fill();c.strokeStyle='#3a2a1a';c.lineWidth=4;c.beginPath();c.arc(cx,cy,56,Math.PI,0);c.closePath();c.stroke();
  for(let r=0;r<2;r++)for(let k=0;k<3;k++){c.fillStyle='#0d0a09';c.fillRect(440+k*150,220+r*100,50,64)}
  c.fillStyle='#120c09';c.fillRect(400,494,480,118);c.fillStyle=L.C.or;c.font="16px "+L.F.titre;c.textAlign='center';L.setLS(c,'4px');c.fillText('BOULANGERIE · FABRE',640,512);L.setLS(c,'0px');
  const ouv=eio(seg(t,31.4,31.9));c.fillStyle='#0a0706';c.fillRect(820,520,56,92);c.fillStyle='rgba(255,200,120,.3)';c.fillRect(820,520,56*ouv,92);
  pave(c,SOL);
  const pc=cp(P.debout);pc.hd=t<30.8?-.5:-.05;if(t>31.2&&t<32)pc.aF=[1.4,.2];const ent=seg(t,32.2,33.4);
  L.pantin(c,{x:lerp(760,850,ent),F:1,p:ent>0&&ent<1?L.pas(P.debout,t*10,.3,0):pc},'C');
  const pl=cp(P.debout);pl.hd=-.5;L.pantin(c,{x:lerp(680,850,eio(seg(t,32.6,33.6))),F:1,p:pl,levres:true},'L');
  heure(c,'LE PONT-NEUF',env(t,28.4,3.4));
}
function sceneC2(c,t){ // l'escalier en colimaçon, qui sent la farine et la térébenthine
  c.fillStyle='#1d140d';c.fillRect(0,0,W,H);
  const r=seg(t,33.8,36.6);
  for(let k=0;k<14;k++){const a=k*.55-r*3,y=640-k*40+r*300,x=640+Math.sin(a)*170;const w=Math.cos(a)*90;c.fillStyle=Math.cos(a)>0?'#5a3e22':'#3a2414';c.fillRect(x-Math.abs(w)/2,y,Math.abs(w)+20,12)}
  c.strokeStyle='#120b07';c.lineWidth=14;c.beginPath();c.moveTo(640,-10);c.lineTo(640,H+10);c.stroke();
  for(let k=0;k<30;k++){c.fillStyle='rgba(240,232,210,.18)';c.fillRect((k*97+t*12)%W,(k*53+t*30)%H,2,2)} // la farine dans l'air
  const pl=L.pas(P.debout,t*8,.32,0);pl.lF=[.5+.3*Math.sin(t*8),-.4];L.pantin(c,{x:600,F:1,p:pl,s:1.1,sol:600,levres:true},'L');
}
function sceneC3(c,t){ // le grenier ; le chevalet
  grenier(c,t,.6);
  const zoom=t>54.6&&t<56.6?1:0;
  lampe(c,1,1+.04*Math.sin(t*9));
  portrait(c,TOILE.x,TOILE.y,TOILE.w,TOILE.h,1);
  porte(c,eio(seg(t,36.8,37.4))*(1-eio(seg(t,38.8,39.2))));
  // elle entre, voit le désordre, puis s'arrête devant le chevalet ; elle s'en approche, très près
  const ent=seg(t,37.2,39.6),xs=lerp(1240,800,eio(ent));
  let xl=xs,pl=ent>0&&ent<1?L.pas(P.debout,t*10,.3,0):cp(P.debout);
  if(t>39.6&&t<41.4){xl=lerp(800,700,eio(seg(t,39.6,41.4)));pl=L.pas(P.debout,t*8,.18,0)}
  if(t>=41.4)xl=700;
  if(t>40.6&&t<41.8)pl.hd=-.15;
  // elle se tourne vers lui ; elle traverse le grenier et se jette dans ses bras
  const vers=seg(t,59.6,61.6);let Fl=-1;if(t>56.4&&t<59.6)Fl=1;
  if(vers>0){xl=lerp(700,950,eio(vers));Fl=1;if(vers<1)pl=L.pas(P.debout,t*12,.34,0)}
  const pc=cp(P.debout);pc.aF=[.15,.6];pc.aB=[-.05,.6];pc.hd=.05;
  if(t>61.4){pc.aF=[1.3,.8];pc.aB=[1.2,.9];pl.aF=[1.3,.8];pl.aB=[1.2,.9];pl.hd=-.25}
  const rc=L.pantin(c,{x:t>61.4?980:1010,F:-1,p:pc},'C');
  if(zoom>0){ // le portrait, de près : ses propres yeux, peints par quelqu'un d'autre
    c.save();c.fillStyle='#120c08';c.fillRect(0,0,W,H);portrait(c,640-150,60,300,375,1);
    L.pantin(c,{x:lerp(900,820,seg(t,54.6,56.6)),F:-1,p:{...P.debout,hd:-.12},s:1.5,sol:H+60},'L');c.restore()}
  if(zoom){dire(c,t,LC,{});return}
  const rl=L.pantin(c,{x:xl,F:t>41.4&&t<56.4?-1:Fl,p:pl,levres:true},'L');
  if(t>56.6&&t<59.6){c.fillStyle='rgba(200,220,255,.8)';c.beginPath();c.arc(rl.tete.x+6,rl.tete.y+8+(t*20)%8,1.6,0,7);c.fill()} // les joues mouillées
  dire(c,t,LC,{L:rl.tete,C:rc.tete});
}

/* ================= D. les nuits volées ================= */
function sceneD(c,t){
  const k=Math.floor((t-62.4)/4.4),u=((t-62.4)%4.4)/4.4;
  if(k<=0){ // la glycine, devenue un escalier familier ; la fourche où l'on peut se reposer
    L.ciel(c,0,480);L.etoiles(c,t,0,0,false,300);c.save();c.translate(OX,OY);jardin(c);L.maisonSarrail(c,{lumLouise:0,ouvre:1,grappes:false});banc(c);
    const y=lerp(470,330,eio(u)),p=cp(GRIMPE),ph=t*7;p.aF=[2.75+.25*Math.sin(ph),-.2];p.aB=[2.45-.25*Math.sin(ph),.35];p.lF=[.95+.35*Math.sin(ph),-1.25];p.lB=[.15-.3*Math.sin(ph),.15];
    L.pantin(c,{x:412,F:1,p,s:.8,hipY:y},'L');const pc=cp(P.debout);pc.hd=-.55;pc.aF=[.15,.6];pc.aB=[-.05,.6];L.pantin(c,{x:520,F:-1,p:pc,s:.8,sol:640},'C');c.restore()}
  else if(k===1){ // la Mini, capote relevée cette fois, le long du canal
    L.ciel(c,0,480);L.etoiles(c,t,0,0,false,300);const ox=(t-66.8)*90;
    for(let j=0;j<8;j++){const x=((j*240-ox)%(W+240)+W+240)%(W+240)-120;platane(c,x,520,320,j+2,.9)}
    c.fillStyle='#0b1220';c.fillRect(0,600,W,120);for(let j=0;j<10;j++){c.fillStyle='rgba(255,214,130,.2)';c.fillRect(((j*150-ox*.5)%W+W)%W,630+j%3*20,40,2)}
    c.fillStyle='#14100d';c.fillRect(0,540,W,60);
    const x=480,gy=560;c.save();c.translate(x,gy);c.scale(1.2,1.2);c.translate(-x,-gy);L.phares(c,x+186,gy-70,.8);L.mini(c,x,gy,{roue:t*6});
    c.fillStyle='#3a2e22';c.beginPath();c.moveTo(x+40,gy-70);c.quadraticCurveTo(x+60,gy-130,x+110,gy-122);c.lineTo(x+110,gy-68);c.closePath();c.fill();c.restore(); // la capote
  }
  else if(k===2){ // au Cabaret, les habitués font cercle ; Léon joue le morceau sans nom
    L.salleCabaret(c,t,{});L.orchestreSix(c,t,1);c.save();c.translate(760,L.SCENE.haut);c.scale(.82,.82);L.leon(c,0,0,.3,-Math.abs(Math.sin(t*6))*3);c.restore();
    for(let j=0;j<9;j++){const a=Math.PI*(.1+j*.1),x=640+Math.cos(a)*380,sol=560-Math.sin(a)*40;L.pantin(c,{x,F:x<640?1:-1,p:{...P.debout,aF:[.4,.6]},s:.82,sol},j%2?'X':'Y')}
    const per=2.2,v=(t%per)/per,d=80+130*Math.sin(Math.PI*v);const pc=cp(P.debout);pc.aF=[1.35,.1];L.pantin(c,{x:520,F:1,p:pc,sol:640},'C');
    const pl=L.pas(P.debout,t*7,.3,0);pl.aF=[1.35,.1];L.pantin(c,{x:520+d,F:v<.5?1:-1,p:pl,sol:640,levres:true},'L',.3);L.tablesCabaret(c,t)}
  else{ // au grenier : il peint, elle lit le docteur Freud à voix haute, allongée sur le lit trop étroit
    grenier(c,t,1);lampe(c,1,1);portrait(c,TOILE.x,TOILE.y,TOILE.w,TOILE.h,1);
    const pc=cp(P.peint);pc.aF=[1.7+.2*Math.sin(t*3),.55];L.pantin(c,{x:400,F:1,p:pc,s:1.15},'C');
    c.save();c.translate(1000,520);c.rotate(-Math.PI/2+.2);const rl=L.pantin(c,{x:0,F:1,p:{...P.debout,aF:[2,.6],hd:-.2},hipY:0},'L');c.restore();
    c.fillStyle='#d9b23a';c.fillRect(1020,440,30,22); // le livre jaune
    if(u>.2&&u<.9)parole(c,'… les rêves sont des lettres qu’on s’écrit à soi-même…',990,380,Math.sin(Math.PI*(u-.2)/.7));
  }
  const tit=['LA GLYCINE, DEVENUE UN ESCALIER','LE LONG DU CANAL','LÉON JOUE LE MORCEAU SANS NOM','AU GRENIER, JUSQU’À L’AUBE'][clamp(k,0,3)];
  heure(c,tit,Math.sin(Math.PI*clamp(u,0,1))*1.4>1?1:Math.sin(Math.PI*clamp(u,0,1))*1.4);
}

/* ================= E. la société secrète ================= */
const LE=[[85.8,'L','Mes grands-parents ne voudront jamais.',2],[88.2,'Je','Tes grands-parents ne voulaient pas non plus que tu danses.',2.6],[91,'Je','Et regarde-toi.',1.6]];
function sceneE(c,t){
  L.salleCabaret(c,t,{});L.orchestreSix(c,t,.4);c.save();c.translate(760,L.SCENE.haut);c.scale(.82,.82);L.leon(c,0,0,.2,0);c.restore();
  const tetes={};
  const pa=cp(P.assis);
  const rc=L.pantin(c,{x:420,F:1,p:{...pa,aF:[.9,.9],tA:t>92.6?.06*Math.abs(Math.sin(t*12)):0},hipY:592},'C');tetes.C=rc.tete;
  const rh=L.pantin(c,{x:540,F:-1,p:{...pa,aF:[1,.6]},hipY:592},'X');lunettes(c,rh,-1);
  const rj=L.pantin(c,{x:740,F:1,p:{...pa,aF:[t>88&&t<92?1.6:.9,.5]},hipY:592},'Y');tetes.Je=rj.tete;
  const regarde=t>92.8?.45:0;const rl=L.pantin(c,{x:860,F:-1,p:{...pa,aF:[.8,1],hd:regarde},hipY:592,levres:true},'L');tetes.L=rl.tete;
  [[480,600],[800,600]].forEach(([x,y])=>{c.save();c.translate(x,y);c.scale(1.1,1.1);c.fillStyle='#0d0806';c.beginPath();c.ellipse(0,0,64,13,0,0,7);c.fill();c.fillRect(-5,0,10,54);c.restore()});
  c.fillStyle='#d9b23a';c.fillRect(770,580,24,16); // les livres que Jeanne lui prête
  L.tablesCabaret(c,t);
  heure(c,'LE JEUDI SOIR · MOT DE PASSE : « EXPOSITION AU MIDI »',env(t,80.6,4.6));
  dire(c,t,LE,tetes);
  narr(c,'Elle vit ses mains, un peu écorchées par la glycine. Ses chaussures de danse, usées au bout.',env(t,93,3.6),684);
}

const OUVERTURE=[{s:'CHAPITRE 10 · LE PORTRAIT',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Celui des mardis et des jeudis. Celui des nuits.',y:380,f:"italic 44px "+L.F.texte}];
const FIN=[{s:'Elle comprit qu’elle avait déjà choisi.',y:330,f:"italic 38px "+L.F.texte},{s:'Et qu’un jour, il faudrait le dire.',y:440,f:"42px "+L.F.main,c:L.C.or}];
const DUREE=104;
const COUPES=[[8.6,.4],[13.8,.4],[28.2,.45],[33.6,.3],[36.8,.3],[54.6,.3],[56.6,.3],[62.4,.45],[66.8,.3],[71.2,.3],[75.6,.3],[80,.4]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<97.8){
    if(t<8.6)sceneA(c,t);else if(t<13.8)sceneA2(c,t);else if(t<28.2)sceneB(c,t);else if(t<33.6)sceneC1(c,t);else if(t<36.8)sceneC2(c,t);else if(t<62.4)sceneC3(c,t);else if(t<80)sceneD(c,t);else sceneE(c,t);
    if(t>28.2&&t<33.6)dire(c,t,LC.slice(0,1),{L:{x:680,y:420}});
  }
  let n=t<3.6?1-seg(t,2.9,3.6):t>97?seg(t,97,97.8):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,seg(t,98,98.8)*(1-seg(t,103.2,104)),540);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // la pendule de Purpan
  for(let w=3.4;w<8.6;w+=1.6)K.noise(T+w,.03,'bandpass',2200,8,.04,.002);
  K.nappeAccord('A7b9',T+3.4,5,null,.004);
  // le tramway, le mardi
  for(let w=8.8;w<12.4;w+=.3)K.noise(T+w,.1,'lowpass',300,1,.04,.01);K.cloche(84,T+9,null,.03);K.cloche(84,T+9.3,null,.02);
  // chez Solange : le piano
  const s=K.bus();K.orchestre(T+14,.5,['Dm9','G13','Cmaj9','A7','Dm9','G13','Cmaj9'],s,{batterie:false,piano:.022});
  // le grenier : le thème, au violon
  const g=K.bus();K.phrase(L.THEME.lent,T+29,.9,'piano',g,.03);[[29,'Dm9'],[37,'G13'],[41.6,'Cmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,4.6,g,.005));
  K.cloche(91,T+41.4,g,.02);K.phrase(L.THEME.lent,T+44,.9,'violon',g,.026);K.nappeAccord('Fmaj9',T+53.8,4,g,.007);K.phrase(L.THEME.reponse,T+57.2,.8,'violon',g,.028);
  // les nuits volées : l'orchestre de Léon, plus vif
  const o=K.bus();K.orchestre(T+62.4,.46,['Dm9','G13','Cmaj9','A7','Dm9','G13','Cmaj9','A7','Dm9'],o,{piano:.018});K.phrase(L.THEME.motif,T+71.4,.46,'trompette',o,.04);
  o.gain.setValueAtTime(1,T+79);o.gain.linearRampToValueAtTime(.3,T+80.4);
  K.nappe(T+80,17,'bandpass',900,.6,[[.5,.02],[16,.02],[17,0]]);
  K.nappeAccord('Bbmaj7',T+93,4,null,.006);K.phrase([[0,81,2],[2,77,3]],T+98.4,.8,'piano',null,.03);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:55});
})();
