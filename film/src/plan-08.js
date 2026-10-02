/* Plan 08 — La troisième fenêtre à gauche (chapitre 7, ~115 s)
   Prologue : le plan coté de l'enveloppe 3 se dessine (« relevé effectué au briquet, entre 19 h et 22 h »).
   A. La façade la nuit : Célestin dans le jardin, la fenêtre de Louise, le bureau du grand-père allumé.
      « Vous êtes fou. » « C'est possible. » … « De vous enlever, petit hibou. » … « Attendez-moi. »
   B. La chambre : la robe bleue jetée sur le lit, la robe couleur de nuit, le pantalon de golf dessous,
      le traversin en dormeuse, Chopin qui ouvre un œil avec un mépris absolu ; la lampe s'éteint.
   C. La descente : « Trois points d'appui. Toujours trois. » La seconde suspendue ; la glycine craque mais tient ;
      une frange s'accroche à mi-hauteur ; à un mètre du sol il la reçoit. « Vous en êtes un. »
   D. Le jardin en courant, la grille qui ne grince pas ; le fou rire dans l'allée, le pantalon de Gaston.
   E. La Mini sous le réverbère : elle la baptise ; « Une fois sur deux » ; elle démarre.
   F. Le traversin, sous la garde d'un chat qui n'en pensait pas moins. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,S=L.SARRAIL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l));if(a<=0)continue;const h=tetes[l[1]];if(h)act.push([l,a,h.x+(l[4]||0),h.y-(l[5]||62)])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}
// une silhouette teintée (la robe bleue sans col)
let OFF=null;
function teinte(c,col,dessin){if(!OFF){OFF=document.createElement('canvas');OFF.width=W;OFF.height=H}const o=OFF.getContext('2d');o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,W,H);
  o.setTransform(c.getTransform());const r=dessin(o);o.setTransform(1,0,0,1,0,0);o.globalCompositeOperation='source-atop';o.fillStyle=col;o.fillRect(0,0,W,H);o.globalCompositeOperation='source-over';
  c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(OFF,0,0);c.restore();return r}
// le pantalon de golf du cousin Gaston, sous la robe (à carreaux, serré sous le genou)
function golf(c,r,s){const y0=r.hanche.y+40*s,y1=r.hanche.y+66*s,x=r.hanche.x;c.save();c.fillStyle='#3b2c20';c.fillRect(x-13*s,y0,26*s,y1-y0);
  c.strokeStyle='rgba(200,170,120,.45)';c.lineWidth=1;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-13*s,y0+k*(y1-y0)/4);c.lineTo(x+13*s,y0+k*(y1-y0)/4);c.stroke()}
  for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-13*s+k*6.5*s,y0);c.lineTo(x-13*s+k*6.5*s,y1);c.stroke()}c.restore()}

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

/* ================= A et C. la façade, à l'échelle 1 du plan coté ================= */
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
// page qui tourne dans le bureau du grand-père
function pageGP(c,t,tours){const r=S.rdc[S.grandPere];for(const w of tours){const u=seg(t,w,w+.5);if(u>0&&u<1){c.save();c.fillStyle='rgba(240,230,210,.9)';c.translate(r.x+42,r.y+36);c.scale(Math.cos(Math.PI*u),1);c.fillRect(0,0,12,30);c.restore()}}}

const LA=[[10.4,'L','Vous êtes fou.',1.4],[12,'C','C’est possible.',1.4],[13.7,'L','Et depuis quand êtes-vous là ?',1.7],[15.6,'C','Un peu avant sept heures.',1.6],
  [17.5,'C','J’avais une glycine à étudier.',1.8],[19.6,'C','Toutes les fenêtres sont noires, sauf la vôtre…',2.1],[22,'L','C’est le bureau de mon grand-père.',1.9],[24.1,'C','Ah.',1],
  [26.2,'L','Il reste à lire jusqu’à minuit.',1.8],[28.2,'C','Alors on a le temps.',1.5],[29.9,'L','Le temps de quoi ?',1.4],[31.6,'C','De vous enlever, petit hibou.',2],
  [34,'C','Regardez à droite de votre fenêtre.',1.9],[36.6,'L','Attendez-moi.',1.4]];
function sceneA(c,t){
  ciel(c,t);
  const ouvre=eio(seg(t,9.6,10.2))*(1-eio(seg(t,37.6,38.1)));
  c.save();c.translate(OX,OY);jardin(c);
  L.maisonSarrail(c,{lumLouise:1,ouvre,lumGP:1,ombreGP:true,grappes:false});pageGP(c,t,[25.2]);banc(c);
  // Louise à sa fenêtre (cadrée par la fenêtre)
  const f=S.etage[S.louise];let rl=null;
  if(ouvre>.3||t<38){c.save();c.beginPath();c.rect(f.x+3,f.y+3,f.w-6,f.h-6);c.clip();
    const pl=cp(P.debout);pl.aF=[.5,.6];pl.hd=.35;
    const penche=eio(seg(t,34.4,35))*(1-eio(seg(t,36.2,36.7)));pl.tA=.32*penche;pl.hd=lerp(.35,-.1,penche);
    if(t>29.9&&t<31.4)pl.hd=.25;
    rl=L.pantin(c,{x:f.x+26+10*penche,F:1,p:pl,s:.8,hipY:f.y+f.h+16},'L');c.restore()}
  // Célestin, dans le jardin, les mains dans les poches, la tête levée
  const pc=cp(P.debout);pc.hd=-.5;pc.aF=[.15,.6];pc.aB=[-.05,.6];
  if(t>21.6&&t<23.8)pc.hd=-.2; // il regarde vers le bureau
  if(t>33.8&&t<35.6){pc.aF=[lerp(.15,2.2,seg(t,33.8,34.2)),.1]}
  const rc=L.pantin(c,{x:540,F:-1,p:pc,s:.8,sol:640},'C');
  c.restore();
  // le souffle dans le froid
  dire(c,t,LA,{L:scr(rl&&rl.tete),C:scr(rc.tete)});
  heure(c,'PURPAN · DIX HEURES DU SOIR',env(t,9.6,6));
}

/* ================= B. la chambre ================= */
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
function chambre(c,t,o){
  const lum=o.lum;
  const g=c.createLinearGradient(0,0,0,612);g.addColorStop(0,L.mix('#14161f','#4a4250',lum));g.addColorStop(1,L.mix('#1b1a22','#62564e',lum));c.fillStyle=g;c.fillRect(0,0,W,612);
  c.fillStyle=`rgba(255,255,255,${.03*lum})`;for(let x=0;x<W;x+=46)c.fillRect(x,0,18,612);
  // la fenêtre (de l'intérieur) : la nuit, la glycine dehors
  c.fillStyle='#0b1526';c.fillRect(560,150,160,250);c.fillStyle='rgba(241,231,211,.5)';[[590,190],[650,230],[700,175]].forEach(([x,y])=>c.fillRect(x,y,2,2));
  c.strokeStyle='#2a1d12';c.lineWidth=5;c.beginPath();c.moveTo(712,400);c.quadraticCurveTo(700,300,716,160);c.stroke();
  // les deux battants vitrés, qui s'ouvrent vers l'intérieur
  const ouv=o.ouvre||0,bw=80*(1-.75*ouv);c.strokeStyle=L.mix('#3a2a1c','#6b5236',lum);c.lineWidth=4;
  [[560,1],[720,-1]].forEach(([x0,d])=>{c.fillStyle=`rgba(180,200,230,${.08+.06*lum})`;c.fillRect(Math.min(x0,x0+d*bw),150,bw,250);
    c.strokeRect(Math.min(x0,x0+d*bw),150,bw,250);for(let k=1;k<4;k++){c.beginPath();c.moveTo(Math.min(x0,x0+d*bw),150+k*62.5);c.lineTo(Math.max(x0,x0+d*bw),150+k*62.5);c.stroke()}});
  c.strokeStyle='#3a2a1c';c.lineWidth=8;c.strokeRect(556,146,168,258);c.fillStyle=L.mix('#2a1d14','#6d4f5a',lum);c.fillRect(520,130,36,300);c.fillRect(724,130,36,300);
  // armoire
  const arm=o.armoire||0;c.fillStyle='#2e1d0e';c.fillRect(900,170,220,442);c.fillStyle='#120b07';c.fillRect(910,180,200*arm,420);
  if(arm>0){c.fillStyle='#7a6a5a';c.fillRect(920,190,40*arm,300);c.fillStyle='#8a7a9a';c.fillRect(964,190,36*arm,280)}
  c.fillStyle='#3d2715';c.fillRect(910+200*arm,180,200*(1-arm),420);c.strokeStyle='#1d120a';c.lineWidth=2;c.beginPath();c.moveTo(1010+100*arm,180);c.lineTo(1010+100*arm,600);c.stroke();
  // lit et table de chevet, lampe
  c.fillStyle='#2e1d0e';c.fillRect(120,400,22,212);c.fillRect(520,480,16,132);c.fillRect(130,566,400,16);
  c.fillStyle=L.mix('#2e2a28','#d9d0be',.3+.7*lum);c.fillRect(142,506,380,62);
  c.fillStyle=L.mix('#2a2430','#9c8a9a',.3+.7*lum);c.fillRect(220,494,302,46);
  c.fillStyle=L.mix('#3a3632','#ece5d6',.3+.7*lum);c.beginPath();c.ellipse(188,500,40,15,0,0,7);c.fill();
  const tr=o.traversin||0;if(tr>0){c.fillStyle=L.mix('#2a2430','#9c8a9a',.3+.7*lum);c.beginPath();c.ellipse(330,494,110*tr,22*tr,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(212,498,26*tr,16*tr,0,Math.PI,0);c.fill()}
  if(o.robeBleue){c.fillStyle='#24426b';c.beginPath();c.moveTo(o.robeBleue.x-30,o.robeBleue.y);c.quadraticCurveTo(o.robeBleue.x,o.robeBleue.y-24,o.robeBleue.x+34,o.robeBleue.y-4);c.lineTo(o.robeBleue.x+20,o.robeBleue.y+10);c.closePath();c.fill()}
  chatEnBoule(c,470,488,o.oeil||0);
  c.fillStyle='#3a2616';c.fillRect(30,480,80,132);c.fillStyle='#1d140b';c.fillRect(60,456,14,24);
  c.fillStyle=lum>.5?'rgba(255,226,150,.95)':'#4a4032';c.fillRect(56,436,22,20);
  if(lum>0){c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(67,446,4,67,446,700);lg.addColorStop(0,`rgba(255,190,100,${.4*lum})`);lg.addColorStop(1,'rgba(255,190,100,0)');c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore()}
  else{c.save();c.globalCompositeOperation='lighter';const mg=c.createLinearGradient(640,150,500,612);mg.addColorStop(0,'rgba(150,170,210,.14)');mg.addColorStop(1,'rgba(150,170,210,0)');c.fillStyle=mg;c.beginPath();c.moveTo(560,150);c.lineTo(720,150);c.lineTo(620,612);c.lineTo(300,612);c.closePath();c.fill();c.restore()}
  c.fillStyle='#1d140f';c.fillRect(0,612,W,108);
}
function sceneB(c,t){
  const robe=seg(t,39.8,40.6),arm=eio(seg(t,40.8,41.3))*(1-eio(seg(t,42.4,42.9))),habille=t>42.2;
  const tr=eio(seg(t,45,46.2)),oeil=Math.sin(Math.PI*seg(t,46.6,48.6)),eteint=t>49.2?0:1;
  // la robe bleue vole vers le lit
  let rb=null;if(robe>0){const u=eio(robe);rb={x:lerp(700,330,u),y:lerp(470,506,u)-Math.sin(Math.PI*u)*110}}
  chambre(c,t,{lum:eteint,armoire:arm,traversin:tr,oeil,robeBleue:rb,ouvre:eio(seg(t,49.6,50.1))});
  // Louise : de la fenêtre à l'armoire, au lit, à la lampe, à la fenêtre
  let x=760,F=1;const p=cp(P.debout);
  const chemin=[[38.6,760],[41,880],[43.6,880],[44.6,360],[46.4,360],[48.4,130],[49.3,130],[50.2,620]];
  let marche=false;for(let i=1;i<chemin.length;i++){const[a,xa]=chemin[i-1],[b,xb]=chemin[i];if(t>=a&&t<b){const u=(t-a)/(b-a);x=lerp(xa,xb,eio(u));marche=Math.abs(xb-xa)>1;F=xb>=xa?(xb===xa?F:1):-1;break}if(t>=b)x=xb}
  if(t<38.6){x=760;F=1}
  if(marche)Object.assign(p,L.pas(P.debout,t*11,.3,0));
  if(t>39.6&&t<40.4)p.aF=[lerp(.2,2.4,seg(t,39.6,40)),.2],F=-1;
  if(t>41.6&&t<42.6)p.aF=[1.5,.3];
  if(t>43.1&&t<43.5)p.aF=[1.1,1.2],p.hd=.3; // les chaussures de danse dans la poche, le rouge, le carnet
  if(t>45&&t<46.3){p.tA=.5;p.aF=[1.2,.2];p.aB=[1,.3];F=1}
  if(t>46.6&&t<48.4){p.hd=.15;F=1}
  if(t>48.8&&t<49.3)p.aF=[1.6,.2],F=-1;
  const dess=o=>L.pantin(o,{x,F,p,s:1.15},'L');
  let r;if(!habille)r=teinte(c,'#24426b',dess);else{r=dess(c);golf(c,r,1.15)}
  if(eteint===0){c.fillStyle='rgba(4,6,14,.35)';c.fillRect(0,0,W,H)}
}

/* ================= C. la descente ================= */
const GRIMPE={tA:.12,hd:-.25,aF:[2.75,-.2],aB:[2.45,.35],lF:[.95,-1.25],lB:[.15,.15]};
// hanche de Louise (coordonnées du plan) : la seconde suspendue, la descente, la frange, les bras de Célestin
const DESC=[[52.6,330],[54.4,336],[55.6,368],[56.4,372],[57.6,404],[58.3,410],[58.5,404],[59.8,436],[60.6,446],[61.6,468]];
function hanche(t){if(t<=DESC[0][0])return DESC[0][1];for(let i=1;i<DESC.length;i++){const[a,ya]=DESC[i-1],[b,yb]=DESC[i];if(t<=b)return lerp(ya,yb,eio((t-a)/(b-a)))}return DESC[DESC.length-1][1]}
const LC=[[50.6,'C','Trois points d’appui. Toujours trois.',2],[53.2,'L','Je suis complètement folle.',1.6],[55.2,'L','Je ne me suis jamais sentie aussi vivante.',2.1],
  [57.6,'C','À gauche, un peu plus bas, voilà, parfait, encore une.',2.6],[63.6,'L','Trois points d’appui. Vous en êtes un.',2.4]];
function sceneC(c,t){
  ciel(c,t);
  c.save();c.translate(OX,OY);jardin(c);
  L.maisonSarrail(c,{lumLouise:0,ouvre:1,lumGP:1,ombreGP:true,grappes:false});pageGP(c,t,[64.4]);banc(c);
  frange(c,seg(t,58.4,58.6));
  // Louise
  let rl=null,y=hanche(t);const recu=seg(t,61.8,62.3),pose=seg(t,65.8,66.6);
  if(t<52.6){ // elle enjambe le rebord
    const f=S.etage[S.louise],u=eio(seg(t,51.2,52.6));const p=L.melange(P.assis,GRIMPE,u);
    rl=L.pantin(c,{x:lerp(f.x+30,412,u),F:1,p,s:.8,hipY:lerp(f.y+f.h+2,330,u)},'L')}
  else if(recu<=0){
    const bouge=Math.abs(hanche(t+.05)-y)>.12,ph=t*7,p=cp(GRIMPE);
    if(t<54.4){p.lF=[.1,0];p.lB=[.9,-.2];p.aF=[2.6+.05*Math.sin(t*30),-.1];p.aB=[2.9,.1]} // un pied sur le rebord, un pied dans le vide
    else if(bouge){p.aF=[2.75+.25*Math.sin(ph),-.2];p.aB=[2.45-.25*Math.sin(ph),.35];p.lF=[.95+.35*Math.sin(ph),-1.25];p.lB=[.15-.3*Math.sin(ph),.15]}
    if(t>58.3&&t<58.6){p.aB=[1.2,.6]} // elle tire d'un coup sec
    rl=L.pantin(c,{x:412,F:1,p,s:.8,hipY:y},'L')}
  // Célestin : la tête levée, il la guide ; il vient la recevoir
  const pc=cp(P.debout);pc.hd=-.55;pc.aF=[.15,.6];pc.aB=[-.05,.6];let xc=540,Fc=-1;
  const vient=eio(seg(t,60.4,61.4));xc=lerp(540,440,vient);
  if(t>57.4&&t<60.2){pc.aF=[lerp(.15,1.9,seg(t,57.4,57.8)),.2]}
  if(t>61.2){pc.aF=[lerp(2.4,1.3,recu),lerp(.1,.7,recu)];pc.aB=[lerp(2.2,1.2,recu),lerp(.2,.8,recu)];pc.hd=lerp(-.6,.1,recu)}
  if(pose>0){pc.aF=[lerp(1.3,.6,pose),.8];pc.aB=[lerp(1.2,.5,pose),.8]}
  if(recu>0){ // dans ses bras, les pieds pas tout à fait sur le sol
    const p=L.melange(GRIMPE,{...P.debout,hd:-.25,aF:[2.2,.4],aB:[1.6,.6]},recu);
    rl=L.pantin(c,{x:lerp(412,452,recu),F:1,p,s:.8,hipY:lerp(468,lerp(552,563,pose),recu)},'L')}
  const rc=L.pantin(c,{x:xc,F:Fc,p:pc,s:.8,sol:640},'C');
  if(rl)golf(c,rl,.8);
  c.restore();
  dire(c,t,LC,{L:scr(rl&&rl.tete),C:scr(rc.tete)});
}

/* ================= D. le jardin, la grille, l'allée ================= */
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
const LD=[[68.4,'L','J’ai vingt-six ans et je viens de m’évader de chez moi par une glycine.',2.7],[71.3,'L','En pantalon de golf.',1.5],[73,'C','Il vous va très bien.',1.5],
  [74.7,'L','Il appartenait à mon cousin Gaston. Gaston est dans les Ordres.',2.7],[77.6,'C','Il vous va mieux qu’à Gaston, j’en suis sûr.',2.2]];
function sceneD(c,t){
  L.ciel(c,0,540);L.etoiles(c,t,0,0,false,300);
  c.fillStyle='#0d1712';c.fillRect(0,HS-4,W,GBAS-HS+4);
  c.save();c.translate(HX,HY);c.scale(KM,KM);L.maisonSarrail(c,{lumLouise:0,ouvre:1,lumGP:1,ombreGP:true,grappes:false});c.restore();perron(c);
  c.fillStyle='#29251e';c.beginPath();c.moveTo(HX+390*KM-46,HS+36);c.lineTo(HX+390*KM+46,HS+36);c.lineTo(GX0+GW,GBAS);c.lineTo(GX0,GBAS);c.closePath();c.fill();
  [[.78,570,215],[1.04,604,262]].forEach(([s,y,o],i)=>{platane(c,640-o,y,330,i+1,s);platane(c,640+o,y,330,i+6,s)});
  // ils courent, courbés, main dans la main, du pied de la glycine à la grille
  const run=seg(t,67,68.4),dehors=t>=68.4;
  const ouv=eio(seg(t,67.7,68))*(1-eio(seg(t,68.8,69.2)));
  const xg=HX+440*KM;
  if(!dehors){const u=eio(seg(t,66.4,67.9)),s=lerp(.48,.95,u),sol=lerp(HS+2,GBAS+4,u);
    const pc=L.pas(P.debout,t*14,.3,0);pc.tA=.2;pc.aB=[-.6,.2];const pl=L.pas(P.debout,t*14+3,.28,0);pl.tA=.2;pl.aF=[.6,.2];
    L.pantin(c,{x:lerp(xg+14,GX0+GW/2+20,u),F:1,p:pc,s,sol},'C');const r=L.pantin(c,{x:lerp(xg-8,GX0+GW/2-14,u),F:1,p:pl,s,sol},'L');golf(c,r,s)}
  pave(c,GBAS);grille(c,ouv);
  let rc=null,rl=null;
  if(dehors){
    const u=eio(seg(t,68.4,69.6));
    const pc=u<1?L.pas(P.debout,t*12,.28,0):cp(P.debout);pc.aF=[.15,.6];pc.aB=[-.05,.6];
    rc=L.pantin(c,{x:lerp(GX0+GW/2+10,480,u),F:-1,p:pc},'C');
    const pl=u<1?L.pas(P.debout,t*12+3,.28,0):cp(P.debout);let Fl=-1;
    const tourne=seg(t,69.6,70);if(tourne>0)Fl=lerp(-1,1,eio(tourne)); // elle se retourne vers la maison
    const rire=seg(t,70.2,70.6)*(1-seg(t,73.4,73.8));if(rire>0){pl.tA=.38*rire+.04*Math.sin(t*22)*rire;pl.aF=[lerp(.2,2.5,rire),lerp(.2,1.6,rire)];pl.aB=[lerp(-.1,2.3,rire),lerp(.2,1.6,rire)];pl.hd=.2*rire}
    if(t>73.8)Fl=-1;
    rl=L.pantin(c,{x:lerp(GX0+GW/2-10,580,u),F:Fl,p:pl},'L');golf(c,rl,1)}
  dire(c,t,LD,{L:rl&&rl.tete,C:rc&&rc.tete});
}

/* ================= E. la Mini ================= */
const LE=[[81,'L','Qu’est-ce que c’est ?',1.4],[82.6,'C','C’est une Citroën. Type C, cinq chevaux.',2.1],[84.9,'C','Tout le monde appelle ce modèle le Petit Citron.',2.3],
  [87.5,'L','Elle a un nom ?',1.3],[88.9,'C','Non.',1],[90.1,'L','Il lui faut un nom.',1.4],[91.7,'C','Alors trouvez-lui-en un.',1.6],
  [93.6,'L','La Mini. Tout simplement.',1.8],[95.6,'C','Ce mot n’existe pas.',1.5],[97.3,'L','Il existera. Comme votre danse.',2],
  [99.6,'C','Mademoiselle Sarrail, la Mini vous attend.',2.2],[104.6,'C','Une fois sur deux.',1.6],[107.9,'L','Où allons-nous ?',1.3],[109.4,'C','À la soirée des lendemains.',1.8]];
const MX=660,MG=L.SOL;
function sceneE(c,t){
  L.ciel(c,0,520);L.etoiles(c,t,0,0,false,400);
  c.fillStyle='#0d1712';c.fillRect(0,520,W,92);
  for(let k=0;k<6;k++){const s=lerp(.5,1,k/5),x=lerp(1180,60,k/5);platane(c,x,lerp(560,612,k/5),330,k+2,s)}
  pave(c,L.SOL);reverbere(c,560,330,1);
  const dep=eic(seg(t,111.6,114.4)),x=MX+dep*900,dedans=t>=102.2;
  const toux=(t>103.2&&t<104.2)||(t>106.2&&t<106.8)?Math.sin(t*60)*2:0,ronron=t>106.8&&t<111.6?Math.sin(t*45)*.8:0;
  let tetes={};
  c.save();c.translate(x,MG+toux+ronron);c.scale(1.3,1.3);c.translate(-x,-MG);
  if(t>106.8)L.phares(c,x+186,MG-70,.9);
  const tm=L.mini(c,x,MG,dedans?{roue:dep*40,louise:{look:t>107.8&&t<109.3?.3:0},celestin:{look:t>109.3&&t<111.3?-.2:0}}:{vide:true});
  if(t>103.2&&t<114){for(let k=0;k<5;k++){const a=((t-103.2)*1.3+k*.2)%1;c.fillStyle=`rgba(200,200,210,${.2*(1-a)})`;c.beginPath();c.arc(x-6-a*40,MG-26-a*16,4+a*10,0,7);c.fill()}}
  const k13=v=>v&&{x:x+(v.x-x)*1.3,y:MG+(v.y-MG)*1.3};
  c.restore();
  if(dedans){tetes.L=k13(tm.louise);tetes.C=k13(tm.celestin)}
  if(!dedans){
    // Célestin près de la portière ; Louise fait le tour, caresse le capot
    const arr=seg(t,79,80.6);
    const pc=arr<1?L.pas(P.debout,t*11,.3,0):cp(P.debout);pc.aF=[.15,.6];pc.aB=[-.05,.6];let xc=lerp(-40,520,eio(arr));
    const rev=Math.sin(Math.PI*seg(t,99.4,101.6));if(rev>0){pc.tA=.45*rev;pc.aF=[lerp(.15,1.4,rev),.1];pc.aB=[lerp(-.05,-.6,rev),.3];pc.hd=.2*rev}
    tetes.C=L.pantin(c,{x:xc,F:1,p:pc},'C').tete;
    const ch=[[79.2,-90],[80.8,600],[87.2,600],[89,900],[90.6,900],[92.4,880],[98.8,880],[100.6,600]];
    let xl=-90,F=1,marche=false;for(let i=1;i<ch.length;i++){const[a,xa]=ch[i-1],[b,xb]=ch[i];if(t>=a&&t<b){xl=lerp(xa,xb,eio((t-a)/(b-a)));marche=xa!==xb;F=xb>=xa?1:-1;if(!marche)F=xl>700?-1:1;break}if(t>=b){xl=xb;F=xb>700?-1:1}}
    const pl=marche?L.pas(P.debout,t*11,.28,0):cp(P.debout);
    if(t>90.4&&t<92){pl.aF=[1.2,.2];pl.tA=.25;F=-1} // la main sur le capot, froid comme de la glace
    if(t>100.6)F=1;
    const r=L.pantin(c,{x:xl,F,p:pl,levres:true},'L');golf(c,r,1);tetes.L=r.tete}
  dire(c,t,LE,tetes);
  heure(c,'AU BOUT DE L’ALLÉE',env(t,79.2,4));
}

/* ================= F. le traversin ================= */
function sceneF(c,t){chambre(c,t,{lum:0,traversin:1,oeil:0,robeBleue:{x:330,y:506},ouvre:0})}

const OUVERTURE=[{s:'CHAPITRE 7 · LA TROISIÈME FENÊTRE À GAUCHE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Le froid entra dans la chambre',y:376,f:"italic 46px "+L.F.texte},{s:'comme un chat.',y:430,f:"italic 46px "+L.F.texte}];
const FIN=[{s:'… un traversin dormait paisiblement sous les couvertures',y:330,f:"italic 34px "+L.F.texte},{s:'à la place de sa petite-fille,',y:380,f:"italic 34px "+L.F.texte},{s:'sous la garde d’un chat qui n’en pensait pas moins.',y:466,f:"40px "+L.F.main,c:L.C.or}];
const DUREE=124;
const COUPES=[[38.4,.4],[50.3,.4],[66.2,.4],[78.9,.45],[115,.45]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<119.5){
    if(t<9.2){ // le plan coté se dessine, puis la caméra s'y pose et il devient la vraie façade
      const u=eio(seg(t,7.3,9.1)),z=lerp(.9,1,u),ax=lerp(640-531.5*.9,OX,u),ay=lerp(360-367*.9,OY,u);
      ciel(c,t);c.save();c.translate(ax,ay);c.scale(z,z);jardin(c);L.maisonSarrail(c,{lumLouise:1,ouvre:0,lumGP:1,ombreGP:true,grappes:false});banc(c);
      plan(c,t,1-seg(t,7.8,8.9));c.restore()}
    else if(t<38.4)sceneA(c,t);else if(t<50.3)sceneB(c,t);else if(t<66.2)sceneC(c,t);else if(t<78.9)sceneD(c,t);else if(t<115)sceneE(c,t);else sceneF(c,t);
    if(t>8&&t<66.2){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(60,90,150,.05)';c.fillRect(0,0,W,H);c.restore()}
  }
  let n=t<3.6?1-seg(t,2.9,3.6):t>118.6?seg(t,118.6,119.4):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),500);
  L.carton(c,FIN,seg(t,119.6,120.4)*(1-seg(t,123.2,124)),560);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // le plan coté : la plume sur le papier
  for(let w=3.3;w<7.3;w+=.12+Math.random()*.15)K.noise(T+w,.08+Math.random()*.1,'highpass',3500,.7,.012+Math.random()*.012,.01);
  K.phrase(L.THEME.motif.slice(0,4),T+3.6,.6,'piano',null,.035);
  // le vent d'hiver, tout le long du dehors
  K.nappe(T+8,58,'lowpass',200,.7,[[1,.04],[57,.04],[58,0]]);
  K.souffle(46,T+9.6,.4,{g:.012,cut:600,vib:10,att:.08}); // la fenêtre
  const p=K.bus();
  K.phrase(L.THEME.lent,T+12,1.05,'piano',p,.03);[[12,'Dm9'],[17.4,'G13']].forEach(([w,n])=>K.nappeAccord(n,T+w,5,p,.005));
  [25.2,64.4].forEach(w=>K.noise(T+w,.45,'bandpass',2400,.8,.025,.08)); // la page de La Dépêche
  K.phrase(L.THEME.reponse,T+31.6,.7,'piano',p,.035);K.nappeAccord('Fmaj9',T+31.6,5,p,.006);
  K.souffle(46,T+37.6,.35,{g:.012,cut:600,vib:10,att:.08});
  // la chambre : la robe, l'armoire, le traversin, la lampe
  K.noise(T+39.8,.4,'bandpass',800,1,.03,.05);K.noise(T+40.8,.3,'lowpass',300,1,.05,.02);K.noise(T+45,1,'bandpass',500,1,.02,.2);
  K.cloche(91,T+46.8,null,.012);K.noise(T+49.2,.05,'bandpass',2000,4,.04,.002);K.souffle(46,T+49.6,.35,{g:.012,cut:600,vib:10,att:.08});
  // la descente : la glycine craque mais tient
  const d=K.bus();K.nappeAccord('A7b9',T+52.6,3.4,d,.006);
  for(let i=0;i<14;i++){const w=54.4+i*.5+Math.random()*.2;K.noise(T+w,.12,'bandpass',700+Math.random()*600,3,.03,.03)}
  K.noise(T+58.35,.06,'highpass',2500,.6,.05,.002); // la frange qu'elle arrache
  K.phrase(L.THEME.lent,T+57.6,.7,'piano',d,.03);
  K.noise(T+62,.2,'lowpass',200,.8,.1,.004);K.nappeAccord('Fmaj9',T+62,4,d,.008);
  // le jardin en courant
  for(let w=66.4;w<68.4;w+=.16)K.noise(T+w,.04,'bandpass',1400,1.4,.03,.003);
  K.cloche(84,T+70.4,null,.012);K.cloche(88,T+70.7,null,.012);
  // la Mini : le starter, la toux, le ronronnement
  const starter=w=>{for(let k=0;k<4;k++)K.noise(T+w+k*.22,.15,'lowpass',180,1,.1,.01)};starter(103.2);starter(106.2);
  const mo=ac.createOscillator();mo.type='sawtooth';mo.frequency.setValueAtTime(34,T+106.8);mo.frequency.setValueAtTime(34,T+111.6);mo.frequency.linearRampToValueAtTime(60,T+114.4);
  const am=ac.createGain();am.gain.value=.5;const lfo=ac.createOscillator();lfo.frequency.setValueAtTime(10,T+106.8);lfo.frequency.linearRampToValueAtTime(16,T+114.4);const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg).connect(am.gain);
  const mg=ac.createGain();mg.gain.setValueAtTime(0,T+106.8);mg.gain.linearRampToValueAtTime(.05,T+107);mg.gain.setValueAtTime(.05,T+113);mg.gain.linearRampToValueAtTime(0,T+115);
  mo.connect(K.lp(500)).connect(am).connect(mg).connect(K.out);mo.start(T+106.8);lfo.start(T+106.8);mo.stop(T+115.2);lfo.stop(T+115.2);
  const o=K.bus();K.orchestre(T+110,.42,['Dm9','G13','Cmaj9'],o,{piano:.016,batterie:false});K.phrase(L.THEME.reponse,T+110.2,.42,'trompette',o,.035);
  // le traversin et le chat
  K.cloche(86,T+115.6,null,.02);K.phrase([[0,81,2],[2,77,3]],T+116,.8,'piano',null,.03);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:62.6});
})();
