/* Plan 07 — Le lendemain (chapitre 5, ~82 s)
   A. Purpan, la chambre de Louise, le matin : elle se réveille en souriant, sort le carnet du double fond
      et écrit « Observation clinique. Sujet : moi-même. » (la page de l'enveloppe 2).
   B. La salle à manger, « un tribunal avant l'entrée des juges » : le grand-père derrière La Dépêche,
      la grand-mère et sa biscotte, Marthe qui sert le café et baisse les yeux. « Même avec la peste. »
   C. Le grenier, midi : Célestin peint à l'huile, sans esquisse ; Julien arrive, regarde longtemps.
      « Il y a quelqu'un, dedans. » … « Qu'on les retrouve. »
   D. Dix-huit heures cinq : le petit garçon, le mot du petit hibou (celui de l'enveloppe 2, mot pour mot),
      Célestin prend sa veste et dévale l'escalier. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l));if(a<=0)continue;const h=tetes[l[1]];if(h)act.push([l,a,h.x+(l[4]||0),h.y-62])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}

/* ================= A. la chambre de Louise, le matin ================= */
function chambre(c,t){
  const g=c.createLinearGradient(0,0,0,612);g.addColorStop(0,'#3d4152');g.addColorStop(1,'#5a5560');c.fillStyle=g;c.fillRect(0,0,W,612);
  c.fillStyle='rgba(255,255,255,.035)';for(let x=0;x<W;x+=46)c.fillRect(x,0,18,612);
  // fenêtre, lumière d'hiver
  c.fillStyle='#c9cdd2';c.fillRect(930,150,170,260);c.fillStyle='#e6e1d2';c.fillRect(940,160,150,240);
  c.strokeStyle='#4a3d30';c.lineWidth=6;c.strokeRect(930,150,170,260);c.beginPath();c.moveTo(1015,150);c.lineTo(1015,410);c.moveTo(930,280);c.lineTo(1100,280);c.stroke();
  c.fillStyle='#6d4f5a';c.fillRect(900,130,40,320);c.fillRect(1090,130,40,320);
  c.save();c.globalCompositeOperation='lighter';const lg=c.createLinearGradient(1000,280,600,612);lg.addColorStop(0,'rgba(255,240,210,.22)');lg.addColorStop(1,'rgba(255,240,210,0)');
  c.fillStyle=lg;c.beginPath();c.moveTo(940,160);c.lineTo(1090,160);c.lineTo(820,612);c.lineTo(520,612);c.closePath();c.fill();c.restore();
  c.fillStyle='#2a1d17';c.fillRect(0,612,W,108);c.strokeStyle='rgba(0,0,0,.25)';for(let y=624;y<720;y+=16){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  // le lit
  c.fillStyle='#2e1d0e';c.fillRect(240,380,22,232);c.fillRect(700,470,16,142);c.fillRect(250,560,460,16);
  c.fillStyle='#d9d0be';c.fillRect(262,500,440,62);c.fillStyle='#9c8a9a';c.fillRect(380,488,330,46);
  c.fillStyle='#ece5d6';c.beginPath();c.ellipse(310,494,44,16,0,0,7);c.fill();
  // table de chevet, tiroir à double fond
  const tir=eio(seg(t,8,8.5));
  c.fillStyle='#3a2616';c.fillRect(760,470,96,142);c.fillStyle='#4e3420';c.fillRect(766,486+0,84,34);
  if(tir>0){c.fillStyle='#5e3f27';c.fillRect(766-30*tir,486,84,34);c.fillStyle='#1d120a';c.fillRect(770-30*tir,490,76,8)}
  c.fillStyle='#c9a13a';c.beginPath();c.arc(808-30*tir,503,3,0,7);c.fill();
  c.fillStyle='#1d140b';c.fillRect(790,446,14,24);c.fillStyle='#e8dcc2';c.fillRect(792,432,10,14);
  // Louise : allongée, le sourire « trouvé au fond d'une poche », le cri dans l'oreiller, elle se redresse, va au tiroir
  const leve=eio(seg(t,6.2,7)),glisse=eio(seg(t,7,7.8));
  const cri=Math.sin(Math.PI*seg(t,5,5.8));
  let p=L.melange(P.debout,P.assis,leve);p.hd=leve>0?-.05:-.1+.2*cri;
  if(t>7.7){p.aF=[lerp(.7,1.5,seg(t,7.8,8.2)),lerp(.9,.3,seg(t,7.8,8.2))]}
  const x=lerp(470,690,glisse),hy=lerp(510,540,leve);
  c.save();c.translate(x,hy);c.rotate(lerp(-Math.PI/2,0,leve));
  L.pantin(c,{x:0,F:1,p,hipY:0},'L');c.restore();
  // la couverture sur elle, tant qu'elle est couchée
  if(leve<1){c.globalAlpha=1-leve;c.fillStyle='#9c8a9a';c.fillRect(420,486,290,50);c.globalAlpha=1}
  if(t>8.3){c.fillStyle='#7a1a14';c.fillRect(760-30*tir+10,478-24*seg(t,8.3,8.6),26,18)}
}
const PAGE={x:330,y:40,w:620,h:640};
const CARNET=[
  ['15 décembre 1925',90,'d'],['Observation clinique. Sujet : moi-même.',152,'s'],
  ['Symptômes : insomnie (habituelle), euphorie',196],['(passagère inhabituelle), difficulté à se concentrer,',240,'b'],
  ['tendance à sourire sans raison, sensation de chaleur',284],['dans la poitrine à l’évocation d’un pouce taché de',328],
  ['bleu de Prusse.',372],['Pensées récurrentes.',416],['Désir contradictoire d’être embrassée et soulagement',460],
  ['de ne pas l’avoir été. (À noter : très intéressant',504],['d’un point de vue scientifique.)',548],['Diagnostic :',618]];
const T_ECR=[9.1,9.6,10.2,10.8,11.4,12,12.6,12.9,13.3,13.9,14.5,15.3],D_ECR=[.45,.55,.55,.6,.6,.6,.25,.35,.6,.6,.45,.5];
function carnet(c,t){
  c.fillStyle='#1a1410';c.fillRect(0,0,W,H);
  c.save();c.translate(PAGE.x,PAGE.y);c.rotate(-.012);
  c.fillStyle='rgba(0,0,0,.4)';c.fillRect(8,10,PAGE.w,PAGE.h);
  c.fillStyle='#f5ecdc';c.fillRect(0,0,PAGE.w,PAGE.h);
  c.strokeStyle='#b9c3d6';c.lineWidth=1;for(let y=30;y<PAGE.h;y+=44){c.beginPath();c.moveTo(0,y+8);c.lineTo(PAGE.w,y+8);c.stroke()}
  c.strokeStyle='#d07a7a';c.beginPath();c.moveTo(64,0);c.lineTo(64,PAGE.h);c.stroke();
  c.font="25px "+L.F.main;c.fillStyle='#1d2433';c.strokeStyle='#1d2433';
  let pointe=null;
  CARNET.forEach(([s,y,k],i)=>{const u=seg(t,T_ECR[i],T_ECR[i]+D_ECR[i]);if(u<=0)return;
    const w=c.measureText(s).width,x0=k==='d'?PAGE.w-40-w:84;
    c.save();c.beginPath();c.rect(x0-4,y-34,(w+8)*u,52);c.clip();c.textAlign='left';c.fillText(s,x0,y);
    if(k==='s'){c.lineWidth=1.6;c.beginPath();c.moveTo(x0,y+6);c.lineTo(x0+w,y+6);c.stroke()}
    if(k==='b'){const wb=c.measureText('(passagère').width,w0=c.measureText('(').width;c.lineWidth=1.6;c.beginPath();c.moveTo(x0+w0,y-7);c.lineTo(x0+wb,y-9);c.stroke()}
    c.restore();if(u<1)pointe={x:x0+w*u,y}});
  // le crayon : il écrit, puis, à « Diagnostic : », il hésite
  if(!pointe&&t>T_ECR[11]){const w=c.measureText('Diagnostic :').width;pointe={x:84+w+18+6*Math.sin(t*5),y:618-16-14*Math.abs(Math.sin(t*2.2))}}
  c.restore();
  if(pointe){const px=PAGE.x+pointe.x,py=PAGE.y+pointe.y-(pointe.x*.012);c.save();c.translate(px,py);c.rotate(-.75);
    c.fillStyle='#c9a13a';c.fillRect(-4,-150,8,140);c.fillStyle='#e8c99a';c.beginPath();c.moveTo(-4,-10);c.lineTo(4,-10);c.lineTo(0,0);c.closePath();c.fill();
    c.fillStyle='#3a2a20';c.fillRect(-4,-152,8,6);c.restore();
}
}

/* ================= B. la salle à manger ================= */
const LB=[[19.2,'L','Bonjour, grand-père. Bonjour, grand-mère.',2.2],[21.7,'A','Tu vas mieux ?',1.4],[23.3,'L','Beaucoup mieux, merci.',1.6],
  [25.2,'E','Parce qu’Henri Lasserre revient dîner ce soir.',2.2,-40],[27.7,'L','Ce soir ?',1.3],[29.3,'E','Ce soir. Et cette fois, tu seras présente.',2.3,-60],
  [31.9,'E','Même avec une migraine. Même avec la peste.',2.4,-80],[36.1,'L','Bien, grand-père.',1.6]];
const TABLE=548;
function salle(c,t){
  // boiseries sombres, buffet et service de Limoges, pendule
  c.fillStyle='#2a1c14';c.fillRect(0,0,W,612);c.fillStyle='#3a281c';for(let x=20;x<W;x+=160){c.fillRect(x,80,130,300);c.strokeStyle='#1d130d';c.lineWidth=3;c.strokeRect(x+10,90,110,280)}
  c.fillStyle='#1e140e';c.fillRect(0,380,W,12);
  c.fillStyle='#d9d4c6';c.fillRect(100,180,150,190);c.fillStyle='#2a1c14';c.fillRect(110,190,130,170);
  for(let k=0;k<3;k++){c.fillStyle='#f0ece2';c.beginPath();c.arc(140+k*36,240,15,0,7);c.fill();c.strokeStyle='#3f5f8a';c.lineWidth=1.5;c.beginPath();c.arc(140+k*36,240,11,0,7);c.stroke()}
  for(let k=0;k<3;k++){c.fillStyle='#f0ece2';c.beginPath();c.arc(140+k*36,300,15,0,7);c.fill();c.strokeStyle='#3f5f8a';c.beginPath();c.arc(140+k*36,300,11,0,7);c.stroke()}
  c.fillStyle='#1b120c';c.fillRect(1120,140,70,150);c.fillStyle='#e8dcc2';c.beginPath();c.arc(1155,190,24,0,7);c.fill();c.strokeStyle=L.C.encre;c.lineWidth=2;
  const sec=Math.floor(t);c.beginPath();c.moveTo(1155,190);c.lineTo(1155,172);c.moveTo(1155,190);c.lineTo(1155+14*Math.sin(sec*.105),190-14*Math.cos(sec*.105));c.stroke();
  c.fillStyle='#c9a13a';c.fillRect(1152,230,6,40+8*Math.sin(t*Math.PI));
  c.fillStyle='#24180f';c.fillRect(0,612,W,108);
  // lumière grise du dimanche matin
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(640,200,20,640,200,700);g.addColorStop(0,'rgba(200,205,215,.12)');g.addColorStop(1,'rgba(200,205,215,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();

  const tetes={};
  // la grand-mère : biscotte beurrée « avec des gestes secs »
  L.amelie(c,600,TABLE+100,{F:-1,s:1});tetes.A={x:600,y:TABLE+100-196};
  // le grand-père derrière La Dépêche, qu'il replie enfin
  const pg=cp(P.assis);pg.aF=[1.2,.9];pg.aB=[1.1,1];pg.hd=-.05;
  const replie=eio(seg(t,29.1,29.8));if(replie>0){pg.aF=[lerp(1.2,.6,replie),lerp(.9,.8,replie)];pg.aB=[lerp(1.1,.5,replie),.8]}
  const rg=L.pantin(c,{x:960,F:-1,p:pg,hipY:TABLE+8},'B');tetes.E=rg.tete;
  // Marthe, qui sert le café, puis baisse les yeux
  const pm=cp(P.debout);const tourne=eio(seg(t,34.2,34.6)),baisse=eio(seg(t,34.6,35.1));
  pm.aF=[1.3,.6];pm.hd=lerp(.15,.55,baisse);
  const verse=Math.sin(Math.PI*seg(t,22,25));pm.aF=[lerp(1.3,1.7,verse),lerp(.6,.2,verse)];
  const Fm=lerp(1,-1,tourne)||.02;
  const rm=L.pantin(c,{x:820,F:Fm,p:pm,s:1.05,sol:TABLE+90},'Y');
  c.fillStyle='#e8e1d0';c.fillRect(rm.hanche.x-12,rm.hanche.y-52,24,64);c.beginPath();c.ellipse(rm.tete.x,rm.tete.y-12,11,5,0,0,7);c.fill();
  c.save();c.translate(rm.main.x,rm.main.y);c.fillStyle='#d9d4c6';c.fillRect(-9,-4,18,24);c.beginPath();c.moveTo(9*Fm,2);c.lineTo(20*Fm,-8);c.lineTo(11*Fm,8);c.fill();c.restore();
  // Louise entre par la gauche et s'assoit
  const ent=seg(t,16.4,18.4);let rl;
  if(ent<1){rl=L.pantin(c,{x:lerp(-40,340,eio(ent)),F:1,p:L.pas(P.debout,(t-16.4)*10,.3,0)},'L')}
  else{const pl=cp(P.assis);pl.aF=[.9,1];pl.hd=lerp(.05,-.02,seg(t,25.2,25.6));
    if(t>27.4&&t<28.6)pl.hd=-.15;
    const regard=seg(t,33.8,34.2)*(1-seg(t,35.6,36));pl.hd+= -.12*regard;
    if(t>36.9){const bu=Math.sin(Math.PI*seg(t,37,38.4));pl.aF=[lerp(.9,1.9,bu),lerp(1,.4,bu)];pl.hd=-.1*bu}
    rl=L.pantin(c,{x:360,F:1,p:pl,hipY:TABLE+8},'L')}
  tetes.L=rl.tete;
  // la table, la nappe, le service
  c.fillStyle='#3a2616';c.fillRect(260,TABLE-6,820,12);c.fillStyle='#e6dfcf';c.beginPath();c.moveTo(250,TABLE);c.lineTo(1090,TABLE);c.lineTo(1100,TABLE+70);c.lineTo(240,TABLE+70);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.08)';for(let x=280;x<1080;x+=60)c.fillRect(x,TABLE+8,2,62);
  c.fillStyle='#3a2616';c.fillRect(270,TABLE+70,14,42);c.fillRect(1060,TABLE+70,14,42);
  [[400,0],[570,0],[920,0]].forEach(([x])=>{c.fillStyle='#f0ece2';c.beginPath();c.ellipse(x,TABLE-4,30,6,0,0,7);c.fill();c.fillStyle='#f6f2ea';c.fillRect(x+30,TABLE-20,14,16);c.strokeStyle='#3f5f8a';c.lineWidth=1.2;c.beginPath();c.ellipse(x,TABLE-4,24,4,0,0,7);c.stroke()});
  // biscotte et couteau, gestes secs
  const k=t>18&&t<35?Math.sign(Math.sin(t*7))*6:0;c.fillStyle='#d9b77a';c.fillRect(548,TABLE-14,30,6);c.fillStyle='#bfbfbf';c.save();c.translate(560+k,TABLE-18);c.rotate(-.3);c.fillRect(-14,-2,28,3);c.restore();
  // La Dépêche
  {const m=rg.main,h=lerp(118,26,replie),w=lerp(96,70,replie),x=m.x-w/2-6,y=lerp(m.y-h+14,TABLE-26,replie);
    c.fillStyle='#e7e1d2';c.fillRect(x,y,w,h);c.fillStyle='#2a2420';c.font="10px "+L.F.titre;c.textAlign='center';if(replie<.6)c.fillText('LA DÉPÊCHE',x+w/2,y+16);
    c.fillStyle='rgba(40,34,30,.35)';if(replie<.6)for(let r=0;r<7;r++){c.fillRect(x+8,y+28+r*11,w/2-12,3);c.fillRect(x+w/2+4,y+28+r*11,w/2-12,3)}
    if(replie<.3){tetes.E={x:x+w/2,y:y+10}}}
  heure(c,'PURPAN · DIMANCHE MATIN',env(t,16.2,6));
  dire(c,t,LB,tetes);
}

/* ================= C et D. le grenier ================= */
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

const LC=[[42.4,'J','Alors ? Tu es tombé sur madame Fabre ?',2],[48.4,'J','Qui c’est ?',1.4],[50.1,'C','Elle s’appelle Louise.',1.6],[52,'J','Tu l’as connue quand ?',1.5],[53.8,'C','Hier soir.',1.3],
  [55.5,'J','Il y a quelqu’un, dedans.',1.9],[57.8,'J','Pas qu’on les rencontre. Qu’on les retrouve.',2.4]];
function sceneC(c,t){
  grenier(c,t,0);
  const prog=t<44?lerp(.58,.97,seg(t,38.6,44)):1;
  const pin=portrait(c,TOILE.x,TOILE.y,TOILE.w,TOILE.h,prog);
  // Célestin : peint, puis s'écarte du chevalet, puis nettoie un pinceau
  const ecart=eio(seg(t,44.2,45));const p=cp(P.peint);
  if(pin&&t<44.2){const ph=t*3.2;p.aF=[1.7+.22*Math.sin(ph),.55+.2*Math.cos(ph)]}
  if(t>=44.2){p.aF=[lerp(1.7,.5,ecart),lerp(.55,.9,ecart)];p.aB=[lerp(-.05,.5,ecart),.9];p.hd=.05}
  if(t>52.8){const n=Math.sin(t*4);p.aF=[.7+.08*n,1.2];p.aB=[.6-.08*n,1.25];p.hd=.25}
  const rc=L.pantin(c,{x:lerp(400,300,ecart),F:1,p,s:1.15},'C');
  if(t<44.2){const m=rc.main;c.strokeStyle='#5a3e1b';c.lineWidth=2.4;c.beginPath();c.moveTo(m.x,m.y);c.lineTo(m.x+16,m.y-14);c.stroke();c.fillStyle=L.C.bleu;c.beginPath();c.arc(m.x+16,m.y-14,2.4,0,7);c.fill()}
  if(t>52.8){const m=rc.main;c.fillStyle='#d9d0be';c.fillRect(m.x-8,m.y-4,18,14)}
  // Julien : entre, regarde la toile en silence, s'assoit sur le lit ; puis se lève, prend son chapeau, s'arrête sur le seuil
  let tj=null,ouv=eio(seg(t,41.2,41.6))*(1-eio(seg(t,60.2,60.6)));
  if(t>41.3&&t<60.3){const pj={x:1245,F:-1,p:cp(P.debout)};
    if(t<42.4){const n=Math.sin(t*16);pj.p.aF=[1.6+.4*n,1.2]}
    const ent=seg(t,42.4,44.8);pj.x=lerp(1245,720,eio(ent));if(ent>0&&ent<1)pj.p=L.pas(P.debout,(t-42.4)*10,.3,0);
    if(t>45&&t<55)pj.p.hd=.08;
    const ass=seg(t,49.8,50.6),ret=seg(t,55.2,55.6);
    if(ass>0&&ret<=0){pj.x=lerp(720,960,eio(seg(t,49.8,50.4)));pj.p=t<50.4?L.pas(P.debout,(t-49.8)*10,.25,0):cp(P.assis);if(t>=50.4){pj.hipY=548}}
    if(ret>0){const so=seg(t,55.6,57.4);pj.x=lerp(960,1170,eio(so));pj.p=so>0&&so<1?L.pas(P.debout,(t-55.6)*10,.3,0):cp(P.debout);pj.hipY=undefined;
      if(t>57.4){pj.F=-1;pj.p.aF=[t<57.8?lerp(.2,2.8,seg(t,57.4,57.8)):2.8*(1-seg(t,59.6,60))+.15,.1]}
      if(t>59.8){pj.F=1;pj.x=lerp(1170,1290,seg(t,59.8,60.3))}}
    const rj=L.pantin(c,{...pj,s:1.12},'J');tj=rj.tete}
  porte(c,ouv);
  dire(c,t,LC,{C:rc.tete,J:tj});
  heure(c,'RUE DE LA RÉPUBLIQUE · MIDI',env(t,38.8,5));
}
function sceneD(c,t){
  grenier(c,t,1);
  portrait(c,TOILE.x,TOILE.y,TOILE.w,TOILE.h,1);
  lampe(c,1,1+.04*Math.sin(t*9));
  // Célestin, sa meilleure chemise, qui attend ; il prend le papier ; plus tard il file
  const fuite=seg(t,75.6,77.2);
  const p=cp(P.debout);p.hd=.04;let x=820,F=1;
  if(t>62.6)p.hd=-.05;
  if(t>67.4&&t<68.4)p.aF=[lerp(.15,1.4,seg(t,67.4,67.8)),.3];
  if(t>68.4&&t<75.6){p.aF=[1.3,.8];p.aB=[1.2,.9];p.hd=.4}
  if(fuite>0){x=lerp(820,1300,eic(fuite));p.aF=[.5,1];p.aB=[-.4,.6];Object.assign(p,L.pas(p,(t-75.6)*16,.42,0))}
  if(t>75.2&&t<75.6){p.aF=[2.4,.2]}
  const rc=L.pantin(c,{x,F,p,s:1.15},'C');
  if(t>68.4&&t<75.6){const m=rc.main;c.fillStyle='#f3eadb';c.fillRect(m.x-14,m.y-22,30,24)}
  // le petit garçon, essoufflé, rouge de froid
  let tb=null;const ouv=eio(seg(t,62.2,62.6))*(1-eio(seg(t,77.6,78)));
  if(t>62.4){const pb={x:1250,F:-1,p:cp(P.debout)};const ent=seg(t,62.6,63.8);pb.x=lerp(1250,1000,eio(ent));if(ent>0&&ent<1)pb.p=L.pas(P.debout,(t-62.6)*12,.3,0);
    if(t>66.8&&t<67.8)pb.p.aF=[lerp(.2,1.4,seg(t,66.8,67.2)),.2];
    if(t>73.8&&t<74.8)pb.p.aF=[1.1,.4];
    if(t>76.2){pb.F=1}
    const rb=L.pantin(c,{...pb,s:.66},'X');tb=rb.tete;
    c.fillStyle='rgba(168,32,26,.8)';c.beginPath();c.arc(rb.tete.x-2,rb.tete.y+3,3,0,7);c.fill();
    if(t>66.8&&t<67.6){c.fillStyle='#f3eadb';c.fillRect(rb.main.x-8,rb.main.y-6,14,10)}
    if(t>74.2){c.fillStyle=L.C.or;c.beginPath();c.arc(rb.main.x,rb.main.y,3,0,7);c.fill()}}
  porte(c,ouv);
  // souffle du garçon
  if(tb&&t<66){for(let k=0;k<2;k++){const a=((t*1.6+k*.5)%1);c.fillStyle=`rgba(225,232,240,${.18*(1-a)})`;c.beginPath();c.ellipse(tb.x-14-a*26,tb.y+6-a*8,5+a*10,3+a*5,0,0,7);c.fill()}}
  dire(c,t,[[64.2,'B','C’est une dame qui m’a donné dix sous pour vous l’apporter.',2.4],[66.9,'B','Elle a dit de faire vite.',1.5]],{B:tb});
  heure(c,'DIX-HUIT HEURES CINQ',env(t,61.2,5));
}
const eic=L.eic;
// le mot du petit hibou, tel qu'il est dans l'enveloppe 2
const MOT=[['Mon grand-père sait que je suis sortie. Il',150],['m’enferme ce soir. Dîner avec H. L. à 20 h. Je',202],['ne pourrai pas venir. Je suis désolée. Je voulais',254],['tant venir.',306]];
function mot(c,t){
  c.fillStyle='#120c08';c.fillRect(0,0,W,H);
  const dep=eio(seg(t,68.6,69.4));
  c.save();c.translate(640,360);c.rotate(lerp(-.06,.015,dep));c.scale(lerp(.9,1,dep),1);
  const w=860,h=560;c.fillStyle='rgba(0,0,0,.45)';c.fillRect(-w/2+10,-h/2+12,w,h);
  c.fillStyle='#f6eedf';c.fillRect(-w/2,-h/2,w,h);
  c.strokeStyle='rgba(90,62,27,.18)';c.lineWidth=1;c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.moveTo(0,-h/2);c.lineTo(0,h/2);c.stroke();
  c.translate(-w/2,-h/2);c.fillStyle='#1d2433';c.textAlign='left';c.font="34px "+L.F.main;
  const lit=seg(t,69.2,70.2);c.globalAlpha=lit;
  MOT.forEach(([s,y])=>c.fillText(s,70,y-44));
  c.textAlign='right';c.fillText('— Le petit hibou.',w-90,380-44);
  const vite=seg(t,71.6,72.6);c.textAlign='left';c.font="31px "+L.F.main;
  c.save();c.beginPath();c.rect(60,440,(w-120)*vite,60);c.clip();c.save();c.translate(70,474);c.rotate(-.025);c.fillText('Troisième fenêtre à gauche. Premier étage.',0,0);c.restore();c.restore();
  c.restore();
  // il relit trois fois
  const re=seg(t,72.8,75.2);if(re>0&&re<1){const k=Math.floor(re*3),f=(re*3)%1;c.save();c.globalAlpha=.16*Math.sin(Math.PI*f);c.fillStyle=L.C.or;c.fillRect(260,150+k*52+(-20),760*f,30);c.restore()}
}

const OUVERTURE=[{s:'CHAPITRE 5 · LE LENDEMAIN',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Louise dormit trois heures',y:376,f:"italic 46px "+L.F.texte},{s:'et se réveilla en souriant.',y:430,f:"italic 46px "+L.F.texte}];
const FIN=[{s:'Il relut le message trois fois.',y:330,f:"italic 38px "+L.F.texte},{s:'Puis il prit sa veste, ses clés,',y:384,f:"italic 38px "+L.F.texte},{s:'et dévala l’escalier quatre à quatre.',y:470,f:"44px "+L.F.main,c:L.C.or}];
const DUREE=83;
const COUPES=[[8.9,.35],[16,.45],[38.4,.45],[61,.5],[68.6,.35],[75.3,.35]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<78.4){
    if(t<8.9)chambre(c,t);else if(t<16)carnet(c,t);else if(t<38.4)salle(c,t);else if(t<61)sceneC(c,t);else if(t<68.6||t>=75.3)sceneD(c,t);else mot(c,t);
  }
  let n=t<3.6?1-seg(t,2.9,3.6):t>77.6?seg(t,77.6,78.4):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),500);
  L.carton(c,FIN,seg(t,78.6,79.4)*(1-seg(t,82,82.8)),560);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  const p=K.bus();
  // A : le réveil, le sourire ; le cri étouffé dans l'oreiller
  K.phrase(L.THEME.motif,T+3.6,.6,'piano',p,.035);K.nappeAccord('Fmaj9',T+3.6,5,p,.006);
  K.noise(T+5.1,.25,'lowpass',500,1,.05,.03);
  K.noise(T+8.1,.15,'bandpass',700,2,.05,.01);K.noise(T+8.35,.08,'bandpass',1500,3,.04,.005);
  // le crayon sur le papier
  T_ECR.forEach((a,i)=>{for(let w=a;w<a+D_ECR[i];w+=.06+Math.random()*.05)K.noise(T+w,.05,'bandpass',3600,2,.012,.01)});
  K.phrase(L.THEME.reponse,T+9.2,.75,'piano',p,.03);
  // B : la pendule, le tribunal ; le café ; le journal replié
  for(let w=16.4;w<38;w+=1)K.noise(T+w,.03,'bandpass',2600,8,.03,.002);
  K.nappeAccord('A7b9',T+18.5,8,p,.004);K.basse(33,T+25.2,p,.12);
  K.noise(T+22.2,1.6,'bandpass',900,1.5,.012,.3);
  K.noise(T+29.1,.5,'bandpass',2200,1,.05,.02);K.noise(T+29.5,.3,'bandpass',1600,1,.04,.02);
  K.basse(31,T+32,p,.14);K.nappeAccord('Dm9',T+32,4,p,.005);
  K.cloche(76,T+37.2,null,.01);
  // C : le portrait ; trois coups à la porte ; le silence de Julien ; « qu'on les retrouve »
  const q=K.bus();
  K.phrase(L.THEME.lent,T+38.8,.62,'piano',q,.04);[[38.8,'Dm9'],[42.4,'G13']].forEach(([w,n])=>K.nappeAccord(n,T+w,3.6,q,.006));
  [41.2,41.45,41.7].forEach(w=>{K.noise(T+w,.12,'lowpass',220,1,.12,.004);K.noise(T+w,.04,'bandpass',900,2,.03,.002)});
  q.gain.setValueAtTime(1,T+44.4);q.gain.linearRampToValueAtTime(0,T+45.4);
  const r=K.bus();K.nappeAccord('Cmaj9',T+55.5,5,r,.007);K.phrase(L.THEME.reponse,T+57.8,.7,'piano',r,.035);
  K.noise(T+60.3,.18,'lowpass',180,.8,.1,.004);
  // D : on frappe ; le garçon ; le mot (violon) ; il dévale l'escalier
  [61.9,62.1].forEach(w=>K.noise(T+w,.12,'lowpass',240,1,.12,.004));
  const v=K.bus();K.phrase(L.THEME.lent,T+69.2,.62,'violon',v,.03);K.nappeAccord('Dm9',T+69.2,3,v,.006);K.nappeAccord('Bbmaj7',T+72.2,3,v,.007);
  K.cloche(86,T+71.6,null,.02);
  for(let w=75.7;w<77.5;w+=.16)K.noise(T+w,.05,'lowpass',260,1,.09,.003);
  K.noise(T+77.8,.25,'lowpass',160,.8,.14,.004);
  K.orchestre(T+78.4,.5,['Dm9','G13'],null,{piano:.016,batterie:false});
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:44.6});
})();
