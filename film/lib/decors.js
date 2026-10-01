/* La Dernière Danse — décors communs
   Ciel de nuit toulousain, silhouette de la ville, collines, scène du Cabaret des Étoiles, public. */
(function(){
const L=window.LDD=window.LDD||{};
const W=1280,H=720;

/* ---------- la nuit ---------- */
const R=L.rng(1612);
const ETOILES=[];for(let i=0;i<260;i++)ETOILES.push({x:R()*W*1.7-W*.35,y:R()*560-60,s:.5+R()*1.5,p:R()*6.28,sp:.6+R()*2.2});
const GEMEAUX=[{x:318,y:104,s:3.2},{x:352,y:126,s:3.6}];

/* d = 0 (pleine nuit) → 1 (aube) */
L.ciel=function(c,d,horizon){
  horizon=horizon||480;const g=c.createLinearGradient(0,0,0,horizon);
  g.addColorStop(0,L.mix('#060b15','#2b3a55',d));g.addColorStop(.6,L.mix('#11203a','#6d5a6c',d));g.addColorStop(1,L.mix('#1f3a5f','#e0995a',d));
  c.fillStyle=g;c.fillRect(0,0,W,H);
  if(d>0){const rg=c.createRadialGradient(1060,horizon,10,1060,horizon,460);rg.addColorStop(0,`rgba(240,190,90,${.45*d})`);rg.addColorStop(1,'rgba(240,190,90,0)');c.fillStyle=rg;c.fillRect(0,0,W,H)}
};
/* rot = rotation de la voûte (radians), gem = afficher les Gémeaux, maxY = bas des étoiles */
L.etoiles=function(c,t,d,rot,gem,maxY){
  rot=rot||0;maxY=maxY||470;const px=W*.55,py=-900,cs=Math.cos(rot),sn=Math.sin(rot),base=1-.88*d;
  const tr=(x,y)=>{const dx=x-px,dy=y-py;return[px+dx*cs-dy*sn,py+dx*sn+dy*cs]};
  for(const s of ETOILES){const[x,y]=tr(s.x,s.y);if(x<-4||x>W+4||y<-4||y>maxY)continue;
    c.fillStyle=`rgba(241,231,211,${base*(.5+.5*Math.sin(t*s.sp+s.p))})`;c.fillRect(x,y,s.s,s.s)}
  if(gem!==false)for(const s of GEMEAUX){const[x,y]=tr(s.x,s.y);c.fillStyle=`rgba(255,246,225,${base})`;c.beginPath();c.arc(x,y,s.s*.6,0,7);c.fill();
    c.strokeStyle=`rgba(255,246,225,${base*.45})`;c.lineWidth=1;c.beginPath();c.moveTo(x-s.s*2.4,y);c.lineTo(x+s.s*2.4,y);c.moveTo(x,y-s.s*2.4);c.lineTo(x,y+s.s*2.4);c.stroke()}
};
/* Toulouse au loin : toits, clocher de Saint-Sernin, dôme de la Grave. b = centre, y = horizon, k = échelle */
L.toulouse=function(c,b,y,d,k,couleurs){
  k=k||1;c.save();c.translate(b,y);c.scale(k,k);
  c.fillStyle=couleurs&&couleurs.fond||L.mix('#15253b','#3b3446',d);
  c.beginPath();c.moveTo(-260,0);
  [[-260,-10],[-220,-16],[-170,-12],[-130,-20],[-90,-14],[-40,-18],[30,-12],[80,-22],[140,-14],[200,-10],[260,-6]].forEach(r=>{c.lineTo(r[0],r[1]);c.lineTo(r[0]+38,r[1])});
  c.lineTo(300,0);c.closePath();c.fill();
  const sx=-60;[[22,14],[18,12],[14,11],[11,10],[8,9]].reduce((yy,[w,h])=>{c.fillRect(sx-w/2,yy-h,w,h);return yy-h},-14);
  c.beginPath();c.moveTo(sx-6,-70);c.lineTo(sx,-104);c.lineTo(sx+6,-70);c.fill();
  c.beginPath();c.arc(120,-30,20,Math.PI,0);c.fill();c.fillRect(100,-30,40,10);c.fillRect(117,-58,6,10);
  const lit=1-d;if(lit>0){c.fillStyle=`rgba(227,178,60,${.8*lit})`;[[-200,-8],[-118,-12],[-30,-10],[46,-6],[96,-14],[170,-8]].forEach(w=>c.fillRect(w[0],w[1],2.2,2.2))}
  c.restore();
};
L.colline=(wx,base,amp,f1,f2)=>base+amp*Math.sin(wx/f1)+amp*.5*Math.sin(wx/f2+1.3);
L.collines=function(c,ox,f,base,amp,f1,f2,col){c.fillStyle=col;c.beginPath();c.moveTo(-20,H);for(let sx=-20;sx<=W+20;sx+=16)c.lineTo(sx,L.colline(sx+ox*f,base,amp,f1,f2));c.lineTo(W+20,H);c.closePath();c.fill()};
const CYPRES=[];for(let k=0;k<14;k++)CYPRES.push({wx:k*230+((k*97)%120)-200,h:58+((k*53)%40)});
L.cypres=function(c,ox,f,base,amp,f1,f2,col){c.fillStyle=col;for(const cp of CYPRES){const sx=cp.wx-ox*f;if(sx<-30||sx>W+30)continue;const gy=L.colline(cp.wx,base,amp,f1,f2)+6;c.beginPath();c.ellipse(sx,gy-cp.h/2,8,cp.h/2,0,0,7);c.fill()}};

/* ---------- le Cabaret des Étoiles ---------- */
/* o = {spot 0..1, X (centre du projecteur), rayon(i) → 0..1 (rayons allumés), etoile 0..1, pulse, enseigne 0..1} */
L.cabaret=function(c,o){
  const RC={x:640,y:560},SOL=L.SOL;
  const g=c.createLinearGradient(0,0,0,560);g.addColorStop(0,'#160c0a');g.addColorStop(1,'#2e1410');c.fillStyle=g;c.fillRect(0,0,W,560);
  for(let i=0;i<24;i++){
    const a0=Math.PI+(i+.5)*Math.PI/24-.022,a1=a0+.044,v=o.rayon?o.rayon(i):0;
    c.fillStyle=v>0?`rgba(227,178,60,${.12+.55*v})`:'rgba(90,62,27,.35)';
    c.beginPath();c.moveTo(RC.x,RC.y);c.lineTo(RC.x+Math.cos(a0)*760,RC.y+Math.sin(a0)*760);c.lineTo(RC.x+Math.cos(a1)*760,RC.y+Math.sin(a1)*760);c.closePath();c.fill();
  }
  c.strokeStyle='rgba(227,178,60,.28)';c.lineWidth=2;[120,190].forEach(r=>{c.beginPath();c.arc(RC.x,RC.y,r,Math.PI,0);c.stroke()});
  const s=o.etoile||0;if(s>0){
    const k=s*(o.pulse||1);c.save();c.translate(RC.x,RC.y-215);c.scale(k,k);
    c.globalCompositeOperation='lighter';const gl=c.createRadialGradient(0,0,0,0,0,130);gl.addColorStop(0,'rgba(255,220,150,.55)');gl.addColorStop(1,'rgba(255,220,150,0)');c.fillStyle=gl;c.beginPath();c.arc(0,0,130,0,7);c.fill();
    c.globalCompositeOperation='source-over';L.star(c,0,0,68,28,L.C.rouge,L.C.or,3);c.restore();
  }
  c.fillStyle=L.C.or;c.font="26px "+L.F.titre;c.textAlign='center';L.setLS(c,'6px');
  c.globalAlpha=o.enseigne==null?1:o.enseigne;c.fillText('CABARET DES ÉTOILES',640,112);c.globalAlpha=1;L.setLS(c,'0px');
  const fg=c.createLinearGradient(0,560,0,720);fg.addColorStop(0,'#2a1c13');fg.addColorStop(1,'#120b07');c.fillStyle=fg;c.fillRect(0,560,W,160);
  c.strokeStyle='rgba(227,178,60,.08)';c.lineWidth=1;for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(640+i*40,560);c.lineTo(640+i*130,720);c.stroke()}
  c.fillStyle=L.C.or;c.fillRect(0,558,W,3);
  const spot=o.spot||0,X=o.X||640;
  if(spot>0){
    c.save();c.globalCompositeOperation='lighter';
    const cg=c.createLinearGradient(0,0,0,620);cg.addColorStop(0,`rgba(255,240,210,${.02*spot})`);cg.addColorStop(1,`rgba(255,240,210,${.13*spot})`);
    c.fillStyle=cg;c.beginPath();c.moveTo(X-40,0);c.lineTo(X+40,0);c.lineTo(X+200,SOL);c.lineTo(X-200,SOL);c.closePath();c.fill();
    const fl=c.createRadialGradient(X,SOL,10,X,SOL,220);fl.addColorStop(0,`rgba(255,240,210,${.4*spot})`);fl.addColorStop(1,'rgba(255,240,210,0)');
    c.fillStyle=fl;c.beginPath();c.ellipse(X,SOL,220,34,0,0,7);c.fill();c.restore();
  }
  [[0,1],[W,-1]].forEach(([x0,dir])=>{for(let i=0;i<6;i++){const x=x0+dir*i*24;c.fillStyle=i%2?'#5e110d':'#7a1813';c.beginPath();c.moveTo(x,0);c.lineTo(x+dir*26,0);c.quadraticCurveTo(x+dir*(30+i*4),360,x+dir*(16+i*6),720);c.lineTo(x,720);c.closePath();c.fill()}});
  c.fillStyle='#0f0a08';c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,48);for(let i=0;i<=8;i++){c.lineTo(W-150-i*122,48+(i%2?14:0))}c.lineTo(0,48);c.closePath();c.fill();
  c.strokeStyle='#b88f2e';c.lineWidth=2;c.beginPath();c.moveTo(150,60);c.lineTo(W-150,60);c.stroke();
};

/* Le public, de dos, au premier plan. bravo = 0..1 (applaudit) */
const RP=L.rng(1412);
const TETES=[];for(let i=0;i<22;i++)TETES.push({x:i*62+((i*37)%30)-10,r:24+((i*13)%8),chapeau:i%3===0,plume:i%7===3,ph:RP()*6});
L.public=function(c,t,bravo){
  c.fillStyle='#050403';
  for(const h of TETES){const by=bravo?Math.abs(Math.sin(t*9+h.ph))*-7*bravo:Math.sin(t*1.3+h.ph)*1.5,y=724+by;
    c.beginPath();c.arc(h.x,y-h.r*.4,h.r,0,7);c.fill();c.fillRect(h.x-h.r*1.3,y,h.r*2.6,40);
    if(h.chapeau){c.beginPath();c.ellipse(h.x,y-h.r*.9,h.r*1.15,h.r*.55,0,Math.PI,0);c.fill()}
    if(h.plume){c.beginPath();c.moveTo(h.x+6,y-h.r*1.2);c.quadraticCurveTo(h.x+22,y-h.r*2.6,h.x+10,y-h.r*3);c.quadraticCurveTo(h.x+14,y-h.r*2,h.x+2,y-h.r*1.2);c.fill()}
    if(bravo>0){c.beginPath();c.arc(h.x+(Math.sin(t*18+h.ph)>0?10:4),y-h.r*1.6,6,0,7);c.fill()}}
};

/* ---------- la maison Sarrail, à Purpan ----------
   Géométrie reprise telle quelle du plan coté de l'enveloppe 3 (« Étude de résistance — glycine »,
   plan n° 0714) : coordonnées du plan (1 unité = 10 mm à l'échelle 1:50 du dessin). */
L.SARRAIL={
  facade:{x:110,y:170,w:560,h:470},sol:640,cordon:400,
  toit:[[90,170],[390,70],[690,170]],
  etage:[140,245,350,475,580].map(x=>({x,y:240,w:60,h:110})),
  rdc:[140,245,475,580].map(x=>({x,y:470,w:60,h:110})),
  porte:{x:350,y:490,w:80,h:150},
  louise:2,grandPere:2,
  tiges:['M432 640 C 436 590, 426 560, 434 520 C 442 480, 428 450, 432 410 C 436 370, 426 330, 430 280 C 433 250, 438 220, 452 190',
         'M450 640 C 454 600, 462 570, 456 530 C 450 490, 462 460, 458 420 C 454 380, 464 340, 458 300 C 455 270, 470 240, 488 210'],
  branches:['M434 520 C 410 512, 400 500, 392 486','M430 350 C 418 346, 414 338, 412 330','M458 420 C 482 410, 492 398, 500 384','M456 300 C 480 292, 494 280, 502 262'],
  pattes:[588,528,468,408,348,288],patteBranlante:468,fourche:{x:444,y:410}
};
const GRAPPES_S=(function(){const R=L.rng(714),g=[];for(let i=0;i<40;i++){const y=200+R()*420,x=432+(R()-.5)*(y<300?110:80)+(y<300?20:0);g.push({x,y,l:5+R()*7,c:R()<.5?'#6b4a8a':'#8a6aaa'})}return g})();
/* Dessine la façade de nuit, en coordonnées du plan (l'appelant choisit l'échelle).
   o = {lumLouise 0..1, ouvre 0..1 (fenêtre de Louise), lumGP 0..1 (fenêtre du grand-père, rez-de-chaussée), ombreGP true, grappes true} */
L.maisonSarrail=function(c,o){
  o=o||{};const S=L.SARRAIL,f=S.facade;
  c.fillStyle='#16121a';c.beginPath();c.moveTo(...S.toit[0]);c.lineTo(...S.toit[1]);c.lineTo(...S.toit[2]);c.closePath();c.fill();
  c.fillStyle='#3a3026';c.fillRect(f.x,f.y,f.w,f.h);
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=.5;for(let y=f.y+8;y<S.sol;y+=8){c.beginPath();c.moveTo(f.x,y);c.lineTo(f.x+f.w,y);c.stroke()}
  c.fillStyle='#4a3d30';c.fillRect(f.x-4,S.cordon-3,f.w+8,6);c.fillRect(f.x-6,f.y-4,f.w+12,6);
  const fen=(r,lum,ouv)=>{c.fillStyle=lum>0?L.mix('#0c0908','#c99a52',lum):'#0c0908';c.fillRect(r.x,r.y,r.w,r.h);
    c.fillStyle='#2a1a10';const lw=r.w/2*(1-.85*(ouv||0));c.fillRect(r.x,r.y,lw,r.h);c.fillRect(r.x+r.w-lw,r.y,lw,r.h);
    if(lum>0&&lw>4){c.fillStyle=`rgba(255,200,120,${.35*lum})`;c.fillRect(r.x+3,r.y+3,lw-6,r.h-6);c.fillRect(r.x+r.w-lw+3,r.y+3,lw-6,r.h-6)}
    c.strokeStyle='#2a1a10';c.lineWidth=3;c.strokeRect(r.x,r.y,r.w,r.h);c.fillStyle='#4a3d30';c.fillRect(r.x-6,r.y+r.h,r.w+12,5)};
  S.etage.forEach((r,i)=>fen(r,i===S.louise?(o.lumLouise||0):0,i===S.louise?o.ouvre:0));
  S.rdc.forEach((r,i)=>fen(r,i===S.grandPere?(o.lumGP||0):0,0));
  if(o.ombreGP&&o.lumGP>0){const r=S.rdc[S.grandPere],a=o.lumGP;c.fillStyle=`rgba(20,12,8,${.85*a})`;c.beginPath();c.arc(r.x+22,r.y+40,8,0,7);c.fill();c.fillRect(r.x+14,r.y+48,16,62);
    c.fillStyle=`rgba(240,230,210,${.9*a})`;c.fillRect(r.x+30,r.y+36,24,30)}
  const p=S.porte;c.fillStyle='#2e1d0e';c.fillRect(p.x,p.y,p.w,p.h);c.strokeStyle='#1a1009';c.lineWidth=2;c.beginPath();c.moveTo(p.x+p.w/2,p.y);c.lineTo(p.x+p.w/2,p.y+p.h);c.stroke();
  c.beginPath();c.arc(p.x+p.w/2,p.y,p.w/2,Math.PI,0);c.fillStyle='#3a3026';c.fill();
  // glycine : deux tiges, branches, pattes de scellement, grappes
  c.strokeStyle='#2a1d12';c.lineCap='round';c.lineJoin='round';
  c.lineWidth=7;c.stroke(new Path2D(S.tiges[0]));c.lineWidth=5.5;c.stroke(new Path2D(S.tiges[1]));
  c.lineWidth=3;S.branches.forEach(b=>c.stroke(new Path2D(b)));
  c.fillStyle='#16110c';S.pattes.forEach(y=>c.fillRect(426,y,12,5));
  if(o.grappes!==false)GRAPPES_S.forEach(g=>{c.fillStyle=g.c;c.beginPath();c.ellipse(g.x,g.y+g.l,2.6,g.l,0,0,7);c.fill()});
};

/* L'affiche du concours, identique à celle de l'enveloppe 0 (559 × 794, coordonnées de l'artefact).
   L'appelant place et met à l'échelle. */
L.afficheConcours=function(c){
  const R=L.C.rouge,I=L.C.encre,P=L.C.papier,cx=279.5,TX=L.F.texte,TI=L.F.titre;
  c.save();c.fillStyle=P;c.fillRect(0,0,559,794);
  c.strokeStyle=R;c.lineWidth=3;c.strokeRect(23.5,23.5,512,747);c.strokeStyle=I;c.lineWidth=1;c.strokeRect(30.5,30.5,498,733);
  c.textAlign='center';c.fillStyle=I;
  const txt=(s,y,font,col,ls)=>{c.font=font;c.fillStyle=col||I;L.setLS(c,(ls||0)+'px');c.fillText(s,cx,y);L.setLS(c,'0px')};
  txt('RUE DES TEINTURIERS · TOULOUSE',76,"11px "+TX,I,4);
  c.save();c.translate(cx-150,84);c.strokeStyle=I;c.lineWidth=1;[[20,10],[60,4],[105,1],[150,0],[195,1],[240,4],[280,10]].forEach(([x,y])=>{c.beginPath();c.moveTo(150,44);c.lineTo(x,y);c.stroke()});
  c.fillStyle=R;c.beginPath();[[150,14],[154,26],[166,26],[156,33],[160,45],[150,38],[140,45],[144,33],[134,26],[146,26]].forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.restore();
  txt('CABARET DES',176,"30px "+TI,I,3);txt('ÉTOILES',246,"66px "+TI,R,2);
  c.fillStyle=I;c.fillRect(60,286,120,1);c.fillRect(379,286,120,1);txt('Samedi 14 décembre',292,"italic 700 17px "+TX);
  txt('PREMIÈRE',336,"13px "+TX,I,5);txt('GRANDE SOIRÉE',374,"700 32px "+TX,I,1);txt('DES PARRAINS',408,"700 32px "+TX,I,1);
  c.font="25px "+TI;L.setLS(c,'3px');const wc=c.measureText('CONCOURS DE DANSE').width+44;L.setLS(c,'0px');c.fillStyle=I;c.fillRect(cx-wc/2,428,wc,46);txt('CONCOURS DE DANSE',460,"25px "+TI,P,3);
  c.font="700 16px "+TX;L.setLS(c,'1px');const a='UN DANSEUR CONFIRMÉ',b='UN DÉBUTANT',wa=c.measureText(a).width,wb=c.measureText(b).width,ws=18,tot=wa+wb+ws*2;
  c.textAlign='left';c.fillStyle=I;c.fillText(a,cx-tot/2,512);c.fillText(b,cx-tot/2+wa+ws*2,512);L.setLS(c,'0px');c.fillStyle=R;c.fillText('✦',cx-tot/2+wa+ws-7,512);c.textAlign='center';
  txt('Les couples seront tirés au sort le soir même',536,"italic 15px "+TX);
  txt('FOX-TROT · TANGO · ET CE QUE L’ORCHESTRE VOUDRA',560,"13px "+TX,I,2);
  c.strokeStyle=I;c.strokeRect(60.5,580.5,212,58);c.strokeStyle=R;c.strokeRect(286.5,580.5,212,58);
  c.font="11px "+TX;L.setLS(c,'3px');c.fillStyle=I;c.fillText('ORCHESTRE DE JAZZ',166,602);c.fillStyle=R;c.fillText('PRIX DU CONCOURS',392,602);L.setLS(c,'0px');
  c.font="italic 700 16px "+TX;c.fillStyle=I;c.fillText('sous la direction de Léon',166,624);c.fillStyle=R;c.fillText('Une coupe & cinquante francs',392,624);
  txt('TIRAGE DES COUPLES À 20 H 30',690,"12px "+TX,I,3);txt('Inscriptions au comptoir · Consommation obligatoire',710,"italic 11px "+TX);txt('LA DIRECTION : MAURICE',732,"10px "+TX,I,3);
  c.restore();
};

/* Soleil rayonnant art déco (titres, ouverture). o = {x,y,r,n,rot,couleur,epais,alpha} */
L.soleil=function(c,o){
  const n=o.n||24;c.save();c.translate(o.x,o.y);c.rotate(o.rot||0);c.globalAlpha=o.alpha==null?1:o.alpha;
  for(let i=0;i<n;i++){const a=i*2*Math.PI/n,w=(o.epais||.05);c.fillStyle=typeof o.couleur==='function'?o.couleur(i):o.couleur;
    c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a-w)*o.r,Math.sin(a-w)*o.r);c.lineTo(Math.cos(a+w)*o.r,Math.sin(a+w)*o.r);c.closePath();c.fill()}
  c.restore();
};
})();
