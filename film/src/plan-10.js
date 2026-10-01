/* Plan 10 — L'étoile filante (chapitre 9, ~146 s)
   A. La Mini démarre du premier coup ; la Garonne, le grenier du Pont-Neuf : « Je vous le montrerai. » « C'est une promesse. »
   B. À la grille, elle remet le pantalon sous la robe champagne. Au pied de la glycine : « Trois points d'appui ? » …
      « Je crois que vous serez toujours en dessous. » Elle remonte ; son visage dans l'encadrement ; les mains levées.
   C. Il repart seul, la route droite entre les champs gelés. La montre : minuit quarante-huit. L'étoile, vers l'est,
      blanche presque bleue. Il freine. Il fait un vœu (on ne l'entend pas). Demi-tour.
   D. Elle est sur le rebord, dans une couverture, elle pleure et rit : « Vous l'avez vue ? » … « Minuit quarante-huit. »
      Il s'assoit sur le banc de pierre ; Chopin le juge, puis décide qu'il peut rester.
   E. La couverture lancée, relancée, abandonnée sur une branche. La fenêtre de Marthe s'allume.
      « Pour les hiboux, c'est encore la nuit. » Chopin se love contre elle.
   Ciel conforme à la carte de l'enveloppe 4 : pleine Lune haute, Jupiter près du Taureau, Mars à l'est, les Géminides. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,S=L.SARRAIL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){for(const l of lignes){const a=env(t,l[0],l[3]||1.5);if(a<=0)continue;const h=tetes[l[1]];if(h)parole(c,l[2],h.x+(l[4]||0),h.y-(l[5]||62),a)}}
function golf(c,r,s){const y0=r.hanche.y+40*s,y1=r.hanche.y+66*s,x=r.hanche.x;c.save();c.fillStyle='#3b2c20';c.fillRect(x-13*s,y0,26*s,y1-y0);
  c.strokeStyle='rgba(200,170,120,.45)';c.lineWidth=1;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-13*s,y0+k*(y1-y0)/4);c.lineTo(x+13*s,y0+k*(y1-y0)/4);c.stroke()}
  for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-13*s+k*6.5*s,y0);c.lineTo(x-13*s+k*6.5*s,y1);c.stroke()}c.restore()}

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
function chatEnBoule(c,x,y,oeil){
  c.save();c.translate(x,y);c.fillStyle=L.C.grisChat;
  c.beginPath();c.ellipse(0,0,36,20,0,0,7);c.fill();
  c.strokeStyle=L.C.grisChat;c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(30,8);c.quadraticCurveTo(10,26,-26,14);c.stroke();
  c.beginPath();c.arc(-28,-6,15,0,7);c.fill();
  c.beginPath();c.moveTo(-38,-14);c.lineTo(-40,-30);c.lineTo(-28,-20);c.closePath();c.fill();c.beginPath();c.moveTo(-22,-18);c.lineTo(-16,-32);c.lineTo(-14,-16);c.closePath();c.fill();
  // un œil qui s'ouvre, jaune
  const o=clamp(oeil,0,1);c.fillStyle=L.C.or;c.beginPath();c.ellipse(-33,-7,3.6,3.6*o+.4,0,0,7);c.fill();if(o>.2){c.fillStyle=L.C.ombre;c.fillRect(-33.6,-7-3*o,1.2,6*o)}
  c.strokeStyle='rgba(20,18,16,.5)';c.lineWidth=1;if(o<.3){c.beginPath();c.moveTo(-36,-7);c.lineTo(-30,-7);c.stroke()}
  c.beginPath();c.moveTo(-23,-7);c.lineTo(-29,-7);c.stroke();
  c.restore();
}
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

/* la robe champagne (plan 09), sous la couverture ou en grimpant */
let OFF=null;
function champagne(c,t,st,flare){
  if(!OFF){OFF=document.createElement('canvas');OFF.width=W;OFF.height=H}const o=OFF.getContext('2d');
  o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,W,H);o.setTransform(c.getTransform());o.globalAlpha=c.globalAlpha;
  const r=L.pantin(o,st,'L',flare||0),s=st.s||1;o.globalAlpha=1;
  o.globalCompositeOperation='source-atop';o.fillStyle='#d6bc88';o.fillRect(r.hanche.x-70*s,r.hanche.y-58*s,140*s,98*s);
  for(let k=0;k<20;k++){const a=.5+.5*Math.sin(t*7+k*2.3);o.fillStyle=`rgba(255,250,235,${.6*a})`;o.fillRect(r.hanche.x+(((k*37)%60)-30)*s,r.hanche.y+(((k*53)%90)-52)*s,2*s,2*s)}
  o.globalCompositeOperation='source-over';o.setTransform(1,0,0,1,0,0);
  c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(OFF,0,0);c.restore();return r}

/* ---------- le ciel de la carte (enveloppe 4) ---------- */
function lune(c,x,y,r){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,r*.5,x,y,r*6);g.addColorStop(0,'rgba(220,226,240,.35)');g.addColorStop(1,'rgba(220,226,240,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r*6,0,7);c.fill();c.restore();
  c.fillStyle='#f4f0e2';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.fillStyle='rgba(180,176,160,.35)';[[-.3,-.2,.22],[.25,.15,.18],[-.1,.35,.12]].forEach(([a,b,k])=>{c.beginPath();c.arc(x+a*r,y+b*r,k*r,0,7);c.fill()})}
function planete(c,x,y,col,r){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r*4,0,7);c.fill();c.restore();c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()}
function cielCarte(c,t,o){o=o||{};const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,L.mix('#081022','#2b3a55',o.aube||0));g.addColorStop(1,L.mix('#1a2c4a','#6d5a6c',o.aube||0));c.fillStyle=g;c.fillRect(0,0,W,H);
  L.etoiles(c,t,o.aube||0,0,true,o.maxY||460);
  if(o.lune!==false)lune(c,o.luneX||700,o.luneY||80,16);
  if(o.planetes!==false){planete(c,o.jupX||240,o.jupY||150,'rgba(255,240,210,.95)',3.2);planete(c,o.marsX||1180,o.marsY||400,'rgba(220,110,80,.95)',2.6)}}
// l'étoile filante : vers l'est, au-dessus de la ville, blanche presque bleue, d'un bout à l'autre du ciel en une seconde ; la traînée met une seconde à s'éteindre
function filante(c,t,t0,x0,y0,x1,y1){const u=seg(t,t0,t0+1),f=1-seg(t,t0+1,t0+2);if(u<=0||f<=0)return;
  const hx=lerp(x0,x1,eoc(u)),hy=lerp(y0,y1,eoc(u));c.save();c.globalCompositeOperation='lighter';
  const g=c.createLinearGradient(x0,y0,hx,hy);g.addColorStop(0,'rgba(200,220,255,0)');g.addColorStop(1,`rgba(225,238,255,${.9*f})`);c.strokeStyle=g;c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(hx,hy);c.stroke();
  if(u<1){const h=c.createRadialGradient(hx,hy,0,hx,hy,18);h.addColorStop(0,'rgba(240,248,255,1)');h.addColorStop(1,'rgba(200,220,255,0)');c.fillStyle=h;c.beginPath();c.arc(hx,hy,18,0,7);c.fill()}c.restore()}

/* ================= A. la Garonne, en Mini ================= */
const LA=[[4.6,'C','Elle vous aime bien. Elle ne démarre jamais du premier coup.',2.6],[7.4,'L','Elle a bon goût.',1.5],[10.6,'L','C’est là que vous peignez ?',1.5],[12.3,'C','C’est là.',1],
  [13.5,'L','Qu’est-ce que vous avez peint aujourd’hui ?',2],[15.7,'C','Je vous le montrerai.',1.5],[17.4,'L','Ce n’est pas une réponse.',1.5],[19.1,'C','C’est une promesse. C’est mieux qu’une réponse.',2.4]];
function sceneA(c,t){
  const ox=(t-3)*70;
  cielCarte(c,t,{luneX:820,luneY:70,marsX:-50});
  // les immeubles du quai, la façade de la boulangerie et sa fenêtre en demi-lune (elle passe vers 11 s)
  const IMM=[{x:0,w:260,h:300},{x:270,w:300,h:350},{x:580,w:280,h:330},{x:870,w:300,h:390,fabre:true},{x:1180,w:280,h:320},{x:1470,w:300,h:350},{x:1780,w:260,h:300}];
  for(const m of IMM){const x=m.x-ox*.6,top=470-m.h;if(x>W||x+m.w<0)continue;c.fillStyle=m.fabre?'#3d1f18':'#2a1612';c.fillRect(x,top,m.w,m.h);
    c.fillStyle='#121821';c.beginPath();c.moveTo(x-8,top);c.lineTo(x+30,top-70);c.lineTo(x+m.w-30,top-70);c.lineTo(x+m.w+8,top);c.closePath();c.fill();
    for(let r=0;r<2;r++)for(let k=0;k<3;k++){c.fillStyle='#0d0a09';c.fillRect(x+40+k*(m.w-110)/2,top+40+r*92,40,56)}
    if(m.fabre){const cx=x+m.w/2,cy=top-12;c.fillStyle='#0b0d12';c.beginPath();c.arc(cx,cy,40,Math.PI,0);c.closePath();c.fill();c.strokeStyle='#3a2a1a';c.lineWidth=4;c.beginPath();c.arc(cx,cy,40,Math.PI,0);c.closePath();c.stroke();
      c.lineWidth=2;for(let k=1;k<4;k++){const a=Math.PI+k*Math.PI/4;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+40*Math.cos(a),cy+40*Math.sin(a));c.stroke()}}}
  // le quai, le parapet, la Garonne noire et lente, les reflets des réverbères qui tremblent
  c.fillStyle='#1b1511';c.fillRect(0,470,W,90);c.fillStyle='#2a2219';c.fillRect(0,556,W,14);
  c.fillStyle='#070b14';c.fillRect(0,570,W,150);
  for(let k=0;k<8;k++){const x=((k*260+120-ox)%(W+260)+W+260)%(W+260)-130;
    c.fillStyle='#0b0706';c.fillRect(x-3,380,6,176);c.fillRect(x-10,370,20,12);c.fillStyle='rgba(255,226,150,.95)';c.fillRect(x-7,372,14,8);
    c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,376,2,x,376,90);g.addColorStop(0,'rgba(255,214,130,.4)');g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(x,376,90,0,7);c.fill();
    for(let j=0;j<7;j++){c.fillStyle=`rgba(255,200,110,${.32-j*.04})`;c.fillRect(x-8+Math.sin(t*2.4+k+j)*5,584+j*16,16-j,2)}c.restore()}
  // la Mini, capote repliée ; la tête de Louise sur son épaule, sa main dans la sienne
  const x=380,gy=548;c.save();c.translate(x,gy);c.scale(1.3,1.3);c.translate(-x,-gy);
  L.phares(c,x+186,gy-70,.8);const tm=L.mini(c,x,gy,{roue:t*5,louise:{lean:t>8?1:0,look:t>10.4&&t<11.8?.5:0},celestin:{lean:.4}});c.restore();
  const k13=v=>v&&{x:x+(v.x-x)*1.3,y:gy+(v.y-gy)*1.3};
  dire(c,t,LA,{L:k13(tm.louise),C:k13(tm.celestin)});
  heure(c,'LE LONG DE LA GARONNE',env(t,3.6,5));
}

/* ================= B1. à la grille : le pantalon ================= */
function sceneB1(c,t){
  cielCarte(c,t,{luneX:760,luneY:70});
  c.fillStyle='#0d1712';c.fillRect(0,HS-4,W,GBAS-HS+4);
  c.save();c.translate(HX,HY);c.scale(KM,KM);L.maisonSarrail(c,{lumLouise:0,ouvre:.25,lumGP:0,grappes:false});c.restore();perron(c);
  [[.78,570,215],[1.04,604,262]].forEach(([s,y,o],i)=>{platane(c,640-o,y,330,i+1,s);platane(c,640+o,y,330,i+6,s)});
  pave(c,GBAS);grille(c,0);
  const x=520,gy=L.SOL+40,j=t>23.2&&t<25.6?Math.sin(t*30)*1.5:0;
  c.save();c.translate(x,gy);c.scale(1.4,1.4);c.translate(-x,-gy);
  const tm=L.mini(c,x,gy+j,{louise:{lean:j*2,look:-.2},celestin:{look:t>22.8&&t<26?.9:0}});c.restore(); // il regarde les étoiles avec une politesse exagérée
  const k=v=>v&&{x:x+(v.x-x)*1.4,y:gy+(v.y-gy)*1.4};
  dire(c,t,[[26.2,'L','Gardez-les. J’aurai besoin de mes deux mains et d’au moins un pied.',2.8]],{L:k(tm.louise)});
  heure(c,'PURPAN · LA MAISON EST NOIRE',env(t,22.2,3.6));
}

/* ================= B2. au pied de la glycine ================= */
const LB=[[31.2,'L','Trois points d’appui ?',1.4],[32.8,'C','Toujours trois.',1.3],[34.3,'L','Et si je tombe ?',1.3],[35.8,'C','Je serai en dessous.',1.5],[37.6,'L','Oui. Je crois que vous serez toujours en dessous.',2.6]];
const MONTE=[[41,468],[42.2,440],[43.2,404],[44.2,372],[45.2,340],[45.8,328]];
function hautMonte(t){if(t<=MONTE[0][0])return MONTE[0][1];for(let i=1;i<MONTE.length;i++){const[a,ya]=MONTE[i-1],[b,yb]=MONTE[i];if(t<=b)return lerp(ya,yb,eio((t-a)/(b-a)))}return MONTE[MONTE.length-1][1]}
function sceneB2(c,t){
  cielCarte(c,t,{luneX:760,luneY:70});
  const f=S.etage[S.louise],ouvre=1-eio(seg(t,48,48.6));
  c.save();c.translate(OX,OY);jardin(c);L.maisonSarrail(c,{lumLouise:0,ouvre,lumGP:0,grappes:false});banc(c);frange(c,1);
  const arr=eio(seg(t,29,30.8));
  // Célestin
  const pc=cp(P.debout);pc.hd=-.1;pc.aF=[.15,.6];pc.aB=[-.05,.6];if(arr<1)Object.assign(pc,L.pas(P.debout,t*10,.28*(1-arr),0));
  if(t>40.6){pc.hd=-.55}
  if(t>46.8&&t<48.2)pc.aF=[lerp(.15,2.6,seg(t,46.8,47.1)),.1]; // il lève la main
  const xc=lerp(700,480,arr);const rc=L.pantin(c,{x:xc,F:-1,p:pc,s:.8,sol:640},'C');
  // Louise : jusqu'à la glycine, le baiser rapide, l'ascension, la fenêtre
  let rl=null;
  if(t<41){const pl=cp(P.debout);pl.hd=-.15;if(arr<1)Object.assign(pl,L.pas(P.debout,t*10+3,.26*(1-arr),0));
    let xl=lerp(760,440,arr),lift=0;if(t>40.2&&t<40.8){xl=452;lift=5;pl.hd=-.35}
    rl=champagne(c,t,{x:xl,F:1,p:pl,s:.8,sol:640,lift,levres:true},.1);if(t>40.2&&t<40.8){}golf(c,rl,.8);
    rl.F=1}
  else if(t<46){const y=hautMonte(t),p=cp(GRIMPE),ph=t*7;p.aF=[2.75+.25*Math.sin(ph),-.2];p.aB=[2.45-.25*Math.sin(ph),.35];p.lF=[.95+.35*Math.sin(ph),-1.25];p.lB=[.15-.3*Math.sin(ph),.15];
    const ent=seg(t,45.2,46);rl=champagne(c,t,{x:lerp(412,f.x+30,ent),F:1,p,s:.8,hipY:y},.1);golf(c,rl,.8)}
  else if(t>46.4&&t<48.4){ // son visage réapparaît, pâle dans l'encadrement noir ; elle lève la main
    c.save();c.beginPath();c.rect(f.x+3,f.y+3,f.w-6,f.h-6);c.clip();const pl=cp(P.debout);pl.hd=.15;pl.aF=[t>46.9?2.6:.4,.1];
    rl=L.pantin(c,{x:f.x+30,F:1,p:pl,s:.8,hipY:f.y+f.h+16},'L');c.restore()}
  c.restore();
  if(t<41.6||(t>46.4&&t<48.4))dire(c,t,LB,{L:scr(rl&&rl.tete),C:scr(rc.tete)});else dire(c,t,LB,{C:scr(rc.tete)});
}

/* ================= C. la route, l'étoile, le vœu ================= */
function champs(c,t,ox){
  c.fillStyle='#1c2634';c.fillRect(0,470,W,250);
  for(let k=0;k<14;k++){const y=480+k*k*1.6;c.strokeStyle=`rgba(200,215,235,${.05+k*.006})`;c.lineWidth=1;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  for(let k=0;k<220;k++){const x=((k*97.7-ox*(.4+(k%5)*.15))%W+W)%W,y=480+((k*53)%230);c.fillStyle=`rgba(230,240,255,${.12+.1*((k*7)%5)/5})`;c.fillRect(x,y,2,1.5)} // le givre
  c.fillStyle='#14100d';c.fillRect(0,600,W,40);c.fillStyle='rgba(255,255,255,.05)';for(let x=-((ox*1.2)%60);x<W;x+=60)c.fillRect(x,618,26,2);
}
function sceneC(c,t){
  if(t>=53.2&&t<56.6){ // la montre, à la lueur du tableau de bord
    c.fillStyle='#120c08';c.fillRect(0,0,W,H);
    const g=c.createLinearGradient(0,380,0,720);g.addColorStop(0,'#3a2412');g.addColorStop(1,'#1d120a');c.fillStyle=g;c.fillRect(0,420,W,300);
    c.fillStyle='#0a0705';c.beginPath();c.arc(980,520,58,0,7);c.fill();c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(980,520,4,980,520,240);lg.addColorStop(0,'rgba(255,190,110,.35)');lg.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();
    c.fillStyle=L.C.ombre;c.beginPath();c.moveTo(200,720);c.quadraticCurveTo(420,520,640,500);c.lineTo(760,540);c.quadraticCurveTo(520,600,420,720);c.closePath();c.fill(); // le poignet
    const cx=600,cy=470;c.fillStyle='#3a2a18';c.fillRect(cx-34,cy-110,68,220);c.fillStyle='#c9a13a';c.beginPath();c.arc(cx,cy,70,0,7);c.fill();c.fillStyle='#f2ead6';c.beginPath();c.arc(cx,cy,62,0,7);c.fill();
    c.strokeStyle=L.C.encre;c.lineWidth=2;for(let k=0;k<12;k++){const a=k*Math.PI/6;c.beginPath();c.moveTo(cx+Math.sin(a)*52,cy-Math.cos(a)*52);c.lineTo(cx+Math.sin(a)*58,cy-Math.cos(a)*58);c.stroke()}
    c.fillStyle=L.C.encre;c.font="14px "+L.F.texte;c.textAlign='center';c.fillText('XII',cx,cy-38);
    const ah=(48/60)*Math.PI/6,am=48/60*Math.PI*2+(t-53.2)*.01;c.lineCap='round';
    c.lineWidth=4;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(ah)*32,cy-Math.cos(ah)*32);c.stroke();c.lineWidth=2.6;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(am)*50,cy-Math.cos(am)*50);c.stroke();
    c.fillStyle=L.C.rouge;c.beginPath();c.arc(cx,cy,3,0,7);c.fill();
    heure(c,'MINUIT QUARANTE-HUIT',env(t,53.6,3));return null}
  const roule=t<57.8,demi=t>68.4,arret=t>=57.8&&t<=68.4;
  const ox=t<57.8?(t-50)*160:(57.8-50)*160+(t>68.4?-(t-68.4)*120:0);
  cielCarte(c,t,{luneX:560,luneY:60,marsX:1150,marsY:430,jupX:150,jupY:170,maxY:470});
  L.toulouse(c,1040,476,0,1.1,{fond:'#0d1626'}); // la ville, à l'est
  filante(c,t,56.8,1240,150,90,250);
  champs(c,t,ox);
  // la Mini, seule ; il freine au bord de la route (petit hoquet), puis fait demi-tour
  const hoquet=t>57.8&&t<58.2?Math.sin((t-57.8)*40)*3:0,x=460;
  c.save();c.translate(x+95,600);if(demi){const u=seg(t,68.4,69.4);c.scale(lerp(1,-1,eio(u))||.02,1)}c.scale(1.3,1.3);c.translate(-(x+95),-600);
  if(!arret||t<58)L.phares(c,x+186,600-70,.85);
  const leve=t>57.8&&t<60;const tm=L.mini(c,x,600+hoquet,{roue:roule||demi?t*6:0,louise:false,celestin:{look:leve?1:t>60&&t<61?.4:0}});c.restore();
  // les yeux fermés, comme quand il avait sept ans
  if(t>60.8&&t<66.4){const h=tm.celestin;const hx=x+95+(h.x-x-95)*1.3,hy=600+(h.y-600)*1.3;c.strokeStyle='rgba(241,231,211,.8)';c.lineWidth=1.4;c.beginPath();c.moveTo(hx+5,hy);c.lineTo(hx+11,hy);c.stroke()}
  // le récit, sans le vœu : personne ne l'entendit
  const narr=(s,a,y)=>{if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="italic 34px "+L.F.texte;c.lineWidth=5;c.strokeStyle='rgba(8,10,18,.85)';c.strokeText(s,640,y);c.fillStyle='#f1e7d3';c.fillText(s,640,y);c.restore()};
  narr('Il fit un vœu quand même.',env(t,60.8,3),690);narr('Personne ne l’entendit. Personne ne l’entendra jamais.',env(t,64,3.6),690);
  heure(c,'LA ROUTE DROITE · LES CHAMPS GELÉS',env(t,50.4,2.6));
  return null;
}

/* ================= D, E. le rebord, le banc, jusqu'à l'aube ================= */
const LD=[[73.6,'L','Vous l’avez vue ?',1.4],[75.6,'L','Moi aussi. Vers l’est. Au-dessus de la ville.',2.2],[78.1,'C','Minuit quarante-huit.',1.5],
  [79.9,'L','Vous avez regardé l’heure ? Vous êtes incroyable.',2.2],[82.4,'C','Déformation professionnelle. On note tout.',2.1],
  [84.9,'L','Vous avez fait un vœu ?',1.4],[86.5,'C','Oui.',.9],[87.6,'L','Moi aussi.',1.1],[89,'C','Vous me le dites ?',1.3],[90.5,'L','Jamais. Sinon il ne se réalise pas.',2],
  [92.8,'C','Alors je ne vous dirai pas le mien non plus.',2.2],
  [116,'L','Il faut partir.',1.3],[117.5,'C','Je sais.',1],[118.7,'L','Quand est-ce que je vous revois ?',1.6],[120.5,'C','Mardi. Chez madame Castaing. Enfin, chez Solange.',2.5],
  [123.2,'L','Mardi, c’est demain soir.',1.5],[124.9,'C','Je sais. C’est très long.',1.5],[126.6,'L','C’est interminable.',1.4],
  [131.4,'C','Bonne nuit, petit hibou.',1.6],[133.2,'L','Marthe est déjà levée, monsieur le peintre.',2.2],[135.6,'C','Pour les hiboux, c’est encore la nuit.',2.1]];
// la couverture : lancée, relancée, abandonnée sur une branche à mi-hauteur
const SILL={x:385,y:356},BANC={x:515,y:575},BRANCHE={x:492,y:396};
function couverture(t){
  const vols=[[105.4,SILL,BANC],[106.8,BANC,SILL],[108.2,SILL,BANC],[109.6,BANC,BRANCHE],[128.6,BRANCHE,SILL]];
  for(const[a,p,q]of vols){const u=seg(t,a,a+.9);if(u>0&&u<1)return{x:lerp(p.x,q.x,u),y:lerp(p.y,q.y,u)-Math.sin(Math.PI*u)*70,vol:true,r:u*5}}
  if(t<105.4)return{sur:'L'};if(t<106.3)return{x:BANC.x,y:BANC.y-40,sur:'C'};if(t<107.7)return{sur:'L'};if(t<109.1)return{x:BANC.x,y:BANC.y-40,sur:'C'};if(t<128.6)return{x:BRANCHE.x,y:BRANCHE.y,branche:true};return{sur:'L'}}
function drap(c,x,y,r,a){c.save();c.translate(x,y);c.rotate(r||0);c.fillStyle='#6b5a48';c.beginPath();c.moveTo(-22,-10);c.quadraticCurveTo(0,-18,22,-8);c.lineTo(18,14);c.quadraticCurveTo(0,20,-20,12);c.closePath();c.fill();
  c.strokeStyle='rgba(168,32,26,.6)';c.lineWidth=2;c.beginPath();c.moveTo(-18,8);c.lineTo(16,6);c.stroke();c.restore()}
function sceneD(c,t){
  const aube=seg(t,113,135)*.35;
  cielCarte(c,t,{luneX:lerp(820,1040,seg(t,70,140)),luneY:lerp(70,150,seg(t,70,140)),aube,marsX:-50});
  heure(c,t<100?'PURPAN · UNE HEURE DU MATIN':t<104?'DEUX HEURES':t<111?'TROIS HEURES':t<114?'QUATRE HEURES':'L’AUBE NE VIENT PAS ENCORE',env(t,70.6,4)+env(t,100.4,3.4)+env(t,104.2,3)+env(t,111,2.8));
  const f=S.etage[S.louise],ouvre=1-eio(seg(t,137.8,138.4));
  c.save();c.translate(OX,OY);jardin(c);L.maisonSarrail(c,{lumLouise:0,ouvre,lumGP:0,grappes:false});banc(c);frange(c,1);
  // la fenêtre de la cuisine, où Marthe commence sa journée
  const cuis=seg(t,114.6,115.2);if(cuis>0){const r=S.rdc[0];c.fillStyle=`rgba(230,170,90,${.85*cuis})`;c.fillRect(r.x+4,r.y+4,r.w-8,r.h-8)}
  const cv=couverture(t);
  // Louise sur le rebord, les jambes dans le vide, la tête levée ; elle pleure et rit
  const pl=cp(P.assis);pl.hd=t<73?-.5:-.05;pl.aF=[.7,.9];pl.aB=[.6,1];
  if(t>73&&t<77){pl.tA=.04*Math.sin(t*14)}
  if(t>105.2&&t<105.6||t>108&&t<108.4){pl.aF=[1.8,.2]}
  if(t>129.4&&t<129.8)pl.aF=[2.2,.3];
  if(t>131&&t<137.6)pl.tA=.25;
  let rl=null;if(t<138){rl=L.pantin(c,{x:SILL.x,F:1,p:pl,s:.8,hipY:SILL.y-4},'L');golf(c,rl,.8)}
  if(cv.sur==='L'&&rl){c.fillStyle='#6b5a48';c.beginPath();c.ellipse(rl.hanche.x+4,rl.hanche.y-34,22,34,0,0,7);c.fill();c.strokeStyle='rgba(168,32,26,.6)';c.lineWidth=2;c.beginPath();c.moveTo(rl.hanche.x-14,rl.hanche.y-20);c.lineTo(rl.hanche.x+20,rl.hanche.y-22);c.stroke()}
  // Chopin vient s'asseoir à côté d'elle, contemple Célestin un long moment, puis décide qu'il peut rester
  if(t>95.2&&t<138){const a=seg(t,95.2,95.8);c.save();c.globalAlpha=a;const juge=t>96&&t<99.6;L.chopin(c,f.x+f.w-12,SILL.y-2,.2,t>99.6?t*3:0,juge?.55:(t>99.6&&t<100?1:0));c.restore()}
  // Célestin : il arrive, il hoche la tête, il s'assoit sur le banc de pierre
  const arr=eio(seg(t,70.4,72.6)),assis=t>94.6,lev=t>128.2&&t<129.2;
  const pc=assis&&!lev&&t<128.2||(t>129.4&&t<130.4)?cp(P.assis):cp(P.debout);pc.hd=-.55;
  if(arr<1&&!assis)Object.assign(pc,L.pas(P.debout,t*10,.3*(1-arr),0)),pc.hd=-.2;
  if(t>74.8&&t<75.4)pc.hd=-.3+.15*Math.sin((t-74.8)*20); // il ne put que hocher la tête
  if(cv.sur==='C')pc.aF=[1.2,.6],pc.aB=[1.1,.7];
  if(t>106.6&&t<106.9||t>109.4&&t<109.7)pc.aF=[2.6,.1];
  if(lev||(t>128.4&&t<129.2))pc.aF=[2.5,.1];
  if(t>130.4){pc.aF=[.15,.6];pc.aB=[-.05,.6]}
  const sit=(assis&&!(t>128.2&&t<130.4))&&t<130.4;
  const rc=sit?L.pantin(c,{x:BANC.x,F:-1,p:pc,s:.8,hipY:BANC.y+2},'C'):L.pantin(c,{x:assis?BANC.x-30:lerp(720,500,arr),F:-1,p:pc,s:.8,sol:640},'C');
  if(cv.vol||cv.branche||cv.sur==='C')drap(c,cv.x,cv.y,cv.r);
  // ils rient (la couverture sur la branche)
  c.restore();
  dire(c,t,LD,{L:scr(rl&&rl.tete),C:scr(rc.tete)});
}
/* ================= F. Chopin se love contre elle ================= */
function sceneF(c,t){
  c.fillStyle='#14161f';c.fillRect(0,0,W,612);c.fillStyle='#1d140f';c.fillRect(0,612,W,108);
  c.save();c.globalCompositeOperation='lighter';const mg=c.createLinearGradient(640,150,500,612);mg.addColorStop(0,'rgba(170,180,210,.16)');mg.addColorStop(1,'rgba(170,180,210,0)');c.fillStyle=mg;c.beginPath();c.moveTo(560,150);c.lineTo(720,150);c.lineTo(620,612);c.lineTo(300,612);c.closePath();c.fill();c.restore();
  c.fillStyle='#0b1526';c.fillRect(560,150,160,250);c.strokeStyle='#3a2a1c';c.lineWidth=8;c.strokeRect(556,146,168,258);
  c.fillStyle='#2e1d0e';c.fillRect(120,400,22,212);c.fillRect(520,480,16,132);c.fillRect(130,566,400,16);c.fillStyle='#3a3632';c.fillRect(142,506,380,62);
  c.fillStyle='#4a4250';c.fillRect(220,494,302,46);c.fillStyle='#5a5650';c.beginPath();c.ellipse(188,500,40,15,0,0,7);c.fill();
  // Louise endormie, en souriant ; Chopin, le museau dans son cou, qui ronronne
  c.save();c.translate(300,494);c.rotate(-Math.PI/2);L.pantin(c,{x:0,F:1,p:{...P.debout,hd:-.1},hipY:0,s:.95},'L');c.restore();
  c.fillStyle='#4a4250';c.fillRect(300,488,222,40);
  const ronr=1+.03*Math.sin(t*9);c.save();c.translate(206,474);c.scale(ronr,ronr);chatEnBoule(c,0,0,0);c.restore();
}

const OUVERTURE=[{s:'CHAPITRE 9 · L’ÉTOILE FILANTE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'La Mini démarra du premier coup.',y:380,f:"italic 46px "+L.F.texte}];
const FIN=[{s:'Madame Fabre, qui sortait ses premières fournées,',y:310,f:"italic 34px "+L.F.texte},{s:'le vit passer. Elle ne dit rien.',y:360,f:"italic 34px "+L.F.texte},{s:'Mais elle lui monta deux croissants au lieu d’un.',y:450,f:"40px "+L.F.main,c:L.C.or}];
const DUREE=150;
const COUPES=[[21.6,.4],[28.6,.4],[50,.5],[53.2,.3],[56.6,.3],[70,.5],[138.8,.5]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<145){
    if(t<21.6)sceneA(c,t);else if(t<28.6)sceneB1(c,t);else if(t<50)sceneB2(c,t);else if(t<70)sceneC(c,t);else if(t<138.8)sceneD(c,t);else sceneF(c,t);
  }
  let n=t<3.6?1-seg(t,2.9,3.6):t>144.2?seg(t,144.2,145):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,seg(t,145.2,146)*(1-seg(t,149.2,150)),540);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // le moteur de la Mini (démarre du premier coup)
  const moteur=(a,b,f0,g0)=>{const mo=ac.createOscillator();mo.type='sawtooth';mo.frequency.value=f0;const am=ac.createGain();am.gain.value=.5;const lfo=ac.createOscillator();lfo.frequency.value=12;const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);
    const mg=ac.createGain();mg.gain.setValueAtTime(0,T+a);mg.gain.linearRampToValueAtTime(g0,T+a+.3);mg.gain.setValueAtTime(g0,T+b-.4);mg.gain.linearRampToValueAtTime(0,T+b);mo.connect(K.lp(420)).connect(am).connect(mg).connect(K.out);mo.start(T+a);lfo.start(T+a);mo.stop(T+b+.1);lfo.stop(T+b+.1)};
  moteur(3.2,21.4,36,.035);moteur(50,57.9,36,.035);moteur(68.2,70,36,.03);
  K.nappe(T+3,18,'lowpass',260,.6,[[1,.03],[17,.03],[18,0]]); // le vent sur les joues
  const p=K.bus();K.phrase(L.THEME.lent,T+5,.9,'piano',p,.035);[[5,'Dm9'],[9.5,'G13'],[14,'Cmaj9'],[18.5,'Fmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,4.6,p,.005));
  // la glycine, le baiser rapide, la fenêtre
  for(let i=0;i<10;i++)K.noise(T+41+i*.5,.12,'bandpass',800+Math.random()*500,3,.025,.03);
  K.phrase(L.THEME.reponse,T+37.6,.7,'piano',p,.03);K.souffle(46,T+48,.35,{g:.012,cut:600,vib:10,att:.08});
  // la route : silence immense ; la montre ; l'étoile
  K.nappe(T+50,20,'lowpass',160,.7,[[1,.03],[19,.03],[20,0]]);
  [53.4,54.4,55.4].forEach(w=>K.noise(T+w,.02,'highpass',4000,1,.03,.001)); // le tic-tac
  const e=K.bus();[96,93,91,88,84,81].forEach((m,i)=>K.cloche(m,T+56.8+i*.16,e,.03));K.violon(88,T+57,2.2,e,.03);
  K.noise(T+57.8,.25,'lowpass',200,1,.08,.01); // il freine, petit hoquet
  K.nappeAccord('Fmaj9',T+60.8,7,e,.007);K.phrase([[0,77,3],[3,76,1.5],[4.5,72,3]],T+61.4,.8,'violon',e,.022);
  // le rebord, la conversation
  const d=K.bus();K.phrase(L.THEME.lent,T+72,1,'piano',d,.03);[[72,'Dm9'],[77,'G13'],[82,'Cmaj9'],[87,'Fmaj9'],[92,'Dm9']].forEach(([w,n])=>K.nappeAccord(n,T+w,5.2,d,.005));
  K.phrase(L.THEME.reponse,T+93,.8,'violon',d,.02);
  [96.2,97.4].forEach(w=>K.noise(T+w,.2,'bandpass',500,1,.01,.05)); // Chopin
  K.phrase(L.THEME.motif,T+100.6,.8,'piano',d,.028);
  [105.4,106.8,108.2,109.6,128.6].forEach(w=>K.noise(T+w,.5,'bandpass',600,1,.025,.08)); // la couverture
  K.cloche(84,T+110.6,null,.015);K.cloche(88,T+110.9,null,.015);
  K.phrase(L.THEME.lent,T+116,1,'violon',d,.025);K.nappeAccord('Bbmaj7',T+121,5,d,.006);K.nappeAccord('Fmaj9',T+131,6,d,.007);
  // Chopin ronronne
  K.nappe(T+139,6,'lowpass',90,1,[[.5,.06],[5.5,.06],[6,0]]);
  K.phrase([[0,81,2],[2,77,3]],T+145.4,.8,'piano',null,.03);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:57.4});
})();
