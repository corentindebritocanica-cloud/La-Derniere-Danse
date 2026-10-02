/* Plan 14 — Épilogue : Toulouse, près d'un siècle plus tard (~92 s)
   A. Une petite galerie de la rue des Filatiers : le tableau que personne ne regarde vraiment, entre une nature morte
      et le Capitole sous la neige. Le cartel. Au dos de la toile : « 15 décembre. Minuit quarante-huit. Le vœu s'est réalisé. »
   B. Ce qu'on raconte : la danse élastique, tous les samedis soir, jusqu'à un âge très avancé ; la petite voiture jaune.
   C. « Mais les légendes, parfois, recommencent. » Une salle de danse, un week-end de compétition : deux silhouettes d'aujourd'hui ;
      celles de 1925 s'y superposent un instant, puis s'effacent.
   D. La route, une petite voiture d'aujourd'hui, minuit quarante-huit, une étoile. Il a fait un vœu (on ne sait pas lequel).
   E. « Mais deux ans plus tard, ils dansent toujours. » Fin, étoile rouge. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,SOL=L.SOL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l));if(a<=0)continue;const h=tetes[l[1]];if(h)act.push([l,a,h.x+(l[4]||0),h.y-(l[5]||62)])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}
let OFF=null;
function teinte(c,col,dessin){if(!OFF){OFF=document.createElement('canvas');OFF.width=W;OFF.height=H}const o=OFF.getContext('2d');o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,W,H);
  o.setTransform(c.getTransform());const r=dessin(o);o.setTransform(1,0,0,1,0,0);o.globalCompositeOperation='source-atop';o.fillStyle=col;o.fillRect(0,0,W,H);o.globalCompositeOperation='source-over';
  c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(OFF,0,0);c.restore();return r}
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

function narr(c,s,a,y,taille){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="italic "+(taille||32)+"px "+L.F.texte;c.lineWidth=5;c.strokeStyle='rgba(8,10,18,.85)';c.strokeText(s,640,y);c.fillStyle='#f1e7d3';c.fillText(s,640,y);c.restore()}

/* ================= A. la galerie ================= */
function cadre(c,x,y,w,h){c.fillStyle='#8a6a2a';c.fillRect(x-14,y-14,w+28,h+28);c.fillStyle='#c9a13a';c.fillRect(x-8,y-8,w+16,h+16);c.fillStyle='#5a4220';c.fillRect(x-3,y-3,w+6,h+6)}
function natureMorte(c,x,y,w,h){c.fillStyle='#3a2a1a';c.fillRect(x,y,w,h);c.fillStyle='#a8501a';c.beginPath();c.arc(x+w*.4,y+h*.62,w*.14,0,7);c.fill();c.fillStyle='#c9a13a';c.beginPath();c.arc(x+w*.62,y+h*.66,w*.11,0,7);c.fill();c.fillStyle='#5a6a3a';c.fillRect(x+w*.2,y+h*.3,w*.12,h*.42);c.fillStyle='#6b5a48';c.fillRect(x,y+h*.78,w,h*.22)}
function capitoleNeige(c,x,y,w,h){c.fillStyle='#9aa4b4';c.fillRect(x,y,w,h);c.fillStyle='#c9a080';c.fillRect(x+w*.1,y+h*.42,w*.8,h*.34);c.fillStyle='#e8e4dc';c.fillRect(x+w*.1,y+h*.38,w*.8,h*.05);
  for(let k=0;k<8;k++){c.fillStyle='#e8dcc2';c.fillRect(x+w*.14+k*w*.095,y+h*.48,w*.03,h*.22)}c.fillStyle='#f4f2ee';c.fillRect(x,y+h*.76,w,h*.24);for(let k=0;k<40;k++){c.fillStyle='rgba(255,255,255,.8)';c.fillRect(x+((k*37)%w),y+((k*53)%(h*.7)),2,2)}}
function sceneA(c,t){
  const z=lerp(1,1.9,eio(seg(t,8,15))),cx=lerp(640,640,0),cy=lerp(330,300,eio(seg(t,8,15)));
  c.fillStyle='#2a2622';c.fillRect(0,0,W,H);
  c.save();c.translate(640,360);c.scale(z,z);c.translate(-cx,-cy);
  c.fillStyle='#4a443e';c.fillRect(-200,0,1700,560);c.fillStyle='#2a2420';c.fillRect(-200,560,1700,200);
  c.save();c.globalCompositeOperation='lighter';[[300,0],[640,0],[980,0]].forEach(([x])=>{const g=c.createRadialGradient(x,40,4,x,200,300);g.addColorStop(0,'rgba(255,230,180,.28)');g.addColorStop(1,'rgba(255,230,180,0)');c.fillStyle=g;c.fillRect(x-300,0,600,560)});c.restore();
  cadre(c,200,200,180,150);natureMorte(c,200,200,180,150);
  cadre(c,900,190,200,160);capitoleNeige(c,900,190,200,160);
  // le petit hibou, dans un coin, entre les deux
  const flip=seg(t,15.4,16.6),k=Math.cos(Math.PI*flip);
  c.save();c.translate(640,300);c.scale(Math.abs(k)||.01,1);c.translate(-640,-300);
  cadre(c,580,226,120,150);
  if(k>0)portrait(c,580,226,120,150,1);
  else{c.fillStyle='#c9b48e';c.fillRect(580,226,120,150);c.strokeStyle='#7a5a32';c.lineWidth=5;c.strokeRect(586,232,108,138);c.beginPath();c.moveTo(586,300);c.lineTo(694,300);c.moveTo(640,232);c.lineTo(640,370);c.stroke();
    c.save();c.translate(640,280);c.rotate(-.08);c.fillStyle='rgba(60,50,40,.85)';c.textAlign='center';c.font="7.5px "+L.F.main;c.fillText('15 décembre.',0,0);c.fillText('Minuit quarante-huit.',0,12);c.fillText('Le vœu s’est réalisé.',0,24);c.restore()}
  c.restore();
  // le cartel
  c.fillStyle='#e8e1d0';c.fillRect(612,404,56,22);c.fillStyle='#3a3026';c.font="3.4px "+L.F.texte;c.textAlign='left';
  ['Anonyme, école toulousaine, vers 1925.','Huile sur toile. Portrait de jeune femme,','dit Le Petit Hibou.'].forEach((s,i)=>c.fillText(s,615,411+i*5));
  c.restore();
  heure(c,'RUE DES FILATIERS',env(t,3.4,4));
  narr(c,'Il existe, dans une petite galerie de la rue des Filatiers, un tableau que personne ne regarde vraiment.',env(t,3.6,4.4),660,28);
  narr(c,'« Anonyme, école toulousaine, vers 1925. Huile sur toile. Portrait de jeune femme, dit Le Petit Hibou. »',env(t,8.4,5.4),660,26);
  narr(c,'Au dos de la toile, que personne ne retourne jamais, quelqu’un a écrit au crayon :',env(t,14.2,2.4),660,28);
  if(t>16.8&&t<22){c.save();c.globalAlpha=env(t,17,4.8);c.textAlign='center';c.font="40px "+L.F.main;c.lineWidth=6;c.strokeStyle='rgba(8,10,18,.8)';
    [['15 décembre. Minuit quarante-huit.',600],['Le vœu s’est réalisé.',652]].forEach(([s,y])=>{c.strokeText(s,640,y);c.fillStyle=L.C.or;c.fillText(s,640,y)});c.restore()}
}

/* ================= B. ce qu'on raconte ================= */
function sceneB(c,t){
  if(t<33.6){ // la danse élastique, jusqu'à un âge très avancé
    L.salleCabaret(c,t,{});L.orchestreSix(c,t,1);
    const per=3.6,u=((t-22)%per)/per,d=70+110*Math.pow(Math.sin(Math.PI*u),1.3),Xc=520;
    const pc=cp(P.debout);pc.tA=.1;pc.aF=[1.3,.1];const pl=L.pas(P.debout,t*6,.2,0);pl.tA=.08;pl.aF=[1.3,.1];
    c.save();c.globalAlpha=.94;const rc=L.pantin(c,{x:Xc,F:1,p:pc},'C');const rl=L.pantin(c,{x:Xc+d,F:u<.5?1:-1,p:pl,levres:true},'L',.2);
    c.fillStyle='rgba(220,220,220,.5)';[rc,rl].forEach(r=>{c.beginPath();c.arc(r.tete.x,r.tete.y-6,10,Math.PI,0);c.fill()});c.restore(); // les cheveux blancs
    L.tablesCabaret(c,t);
    narr(c,'On raconte qu’ils dansaient tous les samedis soir, jusqu’à un âge très avancé,',env(t,22.4,5.2),640,28);
    narr(c,'une danse bizarre, élastique, que personne d’autre ne savait danser.',env(t,27.8,5.4),640,28);
  }else{ // la petite voiture jaune
    L.ciel(c,.1,480);L.etoiles(c,t,.1,0,false,300);L.toulouse(c,640,500,0,1.4,{fond:'#101a2a'});
    c.fillStyle='#14100d';c.fillRect(0,560,W,160);
    const x=lerp(-260,1300,seg(t,33.6,41.4)),gy=640;const toux=Math.sin(t*40)*(t>35&&t<35.6?2:0);
    c.save();c.translate(x,gy+toux);c.scale(1.2,1.2);c.translate(-x,-gy);L.phares(c,x+186,gy-70,.8);L.mini(c,x,gy,{roue:t*6,louise:{lean:1},celestin:{lean:.4}});c.restore();
    narr(c,'On raconte qu’ils conduisaient une petite voiture jaune qui ne démarrait qu’une fois sur deux,',env(t,34,4),120,28);
    narr(c,'et qu’ils ne l’ont jamais changée.',env(t,38,3.2),120,28);
  }
}

/* ================= C. les légendes recommencent ================= */
function salleCompetition(c,t){
  const g=c.createLinearGradient(0,0,0,SOL);g.addColorStop(0,'#0e1220');g.addColorStop(1,'#1d2234');c.fillStyle=g;c.fillRect(0,0,W,SOL);
  // les projecteurs d'aujourd'hui, les numéros de dossard, le public sur les gradins
  c.save();c.globalCompositeOperation='lighter';[[300,.5],[640,1],[980,.5]].forEach(([x,k])=>{const g2=c.createLinearGradient(0,0,0,SOL);g2.addColorStop(0,`rgba(200,220,255,${.05*k})`);g2.addColorStop(1,`rgba(200,220,255,${.16*k})`);c.fillStyle=g2;c.beginPath();c.moveTo(x-30,0);c.lineTo(x+30,0);c.lineTo(x+200,SOL);c.lineTo(x-200,SOL);c.closePath();c.fill()});c.restore();
  for(let r=0;r<3;r++)for(let k=0;k<26;k++){c.fillStyle='#0a0c14';c.beginPath();c.arc(20+k*50+(r%2)*25,240+r*40+Math.sin(t*2+k)*1.5,12,0,7);c.fill();c.fillRect(8+k*50+(r%2)*25,250+r*40,24,30)}
  c.fillStyle='#2a2e40';c.fillRect(0,SOL,W,H-SOL);c.strokeStyle='rgba(255,255,255,.06)';for(let x=0;x<W;x+=80){c.beginPath();c.moveTo(x,SOL);c.lineTo(x+(x-640)*.3,H);c.stroke()}
}
function sceneC(c,t){
  salleCompetition(c,t);
  // deux personnes qui ne se connaissaient pas : lui dansait depuis toujours, elle apprenait
  const Xc=520,per=3.2,u=((t-44)%per)/per,danse=t>44;
  const apr=seg(t,42,44);
  let xl=lerp(900,Xc+90,eio(apr));const pc=cp(P.debout),pl=cp(P.debout);
  if(danse){const d=80+130*Math.pow(Math.sin(Math.PI*u),1.3);xl=Xc+d;Object.assign(pl,L.pas(P.debout,t*7,.28,0));pc.aF=[1.35,.1];if(u<.5){pl.aB=[-1.3,-.1];pl.aF=[.5,.6]}else{pl.aF=[1.35,.1]}}
  else if(t>41.6)pc.aF=[lerp(.15,1.35,seg(t,41.6,42.2)),-.15];
  const Fl=danse?(u<.5?1:-1):-1;
  // d'aujourd'hui : en gris-bleu ; elle, robe courte de compétition
  teinte(c,'#c8cfde',o=>L.pantin(o,{x:Xc,F:1,p:pc},'C'));teinte(c,'#c8cfde',o=>L.pantin(o,{x:xl,F:Fl,p:pl},'L',.25));
  // les silhouettes de 1925 se superposent un instant, puis s'effacent
  const fant=Math.sin(Math.PI*seg(t,48,54));if(fant>0){c.save();c.globalAlpha=.55*fant;teinte(c,'#c9a13a',o=>L.pantin(o,{x:Xc+8,F:1,p:pc},'C'));teinte(c,'#c9a13a',o=>L.pantin(o,{x:xl+8,F:Fl,p:pl},'L',.3));c.restore()}
  narr(c,'Mais les légendes, parfois, recommencent.',env(t,40.4,3.4),110,34);
  narr(c,'Près d’un siècle plus tard, en décembre, dans une salle de danse de Toulouse,',env(t,44,4.2),110,28);
  narr(c,'le hasard a de nouveau mis face à face deux personnes qui ne se connaissaient pas.',env(t,48.4,4.4),110,28);
  narr(c,'Ils ont parlé. Beaucoup. Toute la nuit, puis la nuit suivante,',env(t,53.2,4),110,28);
  narr(c,'comme s’ils reprenaient une conversation interrompue depuis longtemps.',env(t,57.2,4.2),110,28);
}

/* ================= D. la route, minuit quarante-huit ================= */
function voitureAujourdhui(c,x,gy,s,phare){c.save();c.translate(x,gy);c.scale(s,s);
  if(phare){c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(170,0,800,0);g.addColorStop(0,'rgba(240,245,255,.22)');g.addColorStop(1,'rgba(240,245,255,0)');c.fillStyle=g;c.beginPath();c.moveTo(170,-40);c.lineTo(800,-150);c.lineTo(800,60);c.closePath();c.fill();c.restore()}
  c.fillStyle='#0a0c12';c.beginPath();c.moveTo(0,-20);c.quadraticCurveTo(4,-52,40,-58);c.lineTo(70,-86);c.quadraticCurveTo(110,-96,140,-84);c.lineTo(168,-56);c.quadraticCurveTo(180,-50,180,-34);c.lineTo(180,-18);c.closePath();c.fill();
  c.fillStyle='rgba(120,140,170,.35)';c.beginPath();c.moveTo(76,-80);c.quadraticCurveTo(110,-88,136,-78);c.lineTo(158,-58);c.lineTo(72,-58);c.closePath();c.fill();
  [[42,-16],[142,-16]].forEach(([wx,wy])=>{c.fillStyle='#050608';c.beginPath();c.arc(wx,wy,17,0,7);c.fill();c.fillStyle='#4a4e58';c.beginPath();c.arc(wx,wy,7,0,7);c.fill()});
  c.fillStyle='#f4f6ff';c.fillRect(170,-46,10,6);c.fillStyle='#a8201a';c.fillRect(0,-44,6,6);c.restore()}
function sceneD(c,t){
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#081022');g.addColorStop(1,'#1a2c4a');c.fillStyle=g;c.fillRect(0,0,W,H);
  L.etoiles(c,t,0,0,true,470);
  // le même ciel que sur la carte : la pleine Lune, Jupiter, Mars à l'est
  c.fillStyle='#f4f0e2';c.beginPath();c.arc(560,64,15,0,7);c.fill();c.fillStyle='rgba(255,240,210,.95)';c.beginPath();c.arc(170,160,3,0,7);c.fill();c.fillStyle='rgba(220,110,80,.95)';c.beginPath();c.arc(1150,420,2.6,0,7);c.fill();
  L.toulouse(c,1040,476,0,1.1,{fond:'#0d1626'});
  // l'étoile, vers l'est, au-dessus de la ville
  const u=seg(t,69,70),f=1-seg(t,70,71);if(u>0&&f>0){const x0=1240,y0=150,x1=90,y1=250,hx=lerp(x0,x1,eoc(u)),hy=lerp(y0,y1,eoc(u));c.save();c.globalCompositeOperation='lighter';
    const gg=c.createLinearGradient(x0,y0,hx,hy);gg.addColorStop(0,'rgba(200,220,255,0)');gg.addColorStop(1,`rgba(225,238,255,${.9*f})`);c.strokeStyle=gg;c.lineWidth=2.4;c.beginPath();c.moveTo(x0,y0);c.lineTo(hx,hy);c.stroke();c.restore()}
  c.fillStyle='#1c2634';c.fillRect(0,470,W,250);for(let k=0;k<200;k++){c.fillStyle='rgba(230,240,255,.12)';c.fillRect((k*97.7-t*40*(k%3+1))%W+W*((k*97.7-t*40*(k%3+1))%W<0),480+((k*53)%230),2,1.5)}
  c.fillStyle='#14100d';c.fillRect(0,600,W,40);
  const roule=t<70.4,x=lerp(380,460,seg(t,62,70.4));voitureAujourdhui(c,x,620,1.25,true);
  heure(c,'MINUIT QUARANTE-HUIT',env(t,66.6,4));
  narr(c,'Et cette nuit-là, en rentrant chez lui au volant de sa petite voiture,',env(t,62.2,3.4),690,28);
  narr(c,'seul sur la route, il a levé les yeux vers le ciel au-dessus de la ville.',env(t,65.4,3.4),690,28);
  narr(c,'Une étoile est tombée.',env(t,69.8,2.4),690,34);
  narr(c,'Il a fait un vœu.',env(t,72.4,2.2),690,34);
  narr(c,'On ne sait pas lequel. Il ne faut jamais le dire, sinon il ne se réalise pas.',env(t,74.8,3.8),690,28);
}

const OUVERTURE=[{s:'ÉPILOGUE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'8px'},{s:'Toulouse, près d’un siècle plus tard',y:380,f:"italic 48px "+L.F.texte}];
const FIN=[{s:'Mais deux ans plus tard, ils dansent toujours.',y:330,f:"44px "+L.F.main,c:L.C.or},{s:'FIN',y:440,f:"40px "+L.F.titre,c:L.C.papier,ls:'12px'}];
const DUREE=92;
const COUPES=[[22,.5],[33.6,.4],[40,.5],[62,.5]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<79.4){if(t<22)sceneA(c,t);else if(t<40)sceneB(c,t);else if(t<62)sceneC(c,t);else sceneD(c,t)}
  let n=t<3.6?1-seg(t,2.9,3.6):t>78.6?seg(t,78.6,79.4):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,seg(t,79.8,80.8)*(1-seg(t,91.2,92)),520);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // la galerie : le thème, très doux
  const p=K.bus();K.phrase(L.THEME.lent,T+3.8,1.05,'piano',p,.026);[[3.8,'Dm9'],[9.4,'G13'],[15,'Cmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,5.4,p,.005));
  K.noise(T+15.4,.8,'bandpass',500,1,.02,.1);K.cloche(91,T+17,p,.02);K.nappeAccord('Fmaj9',T+17,5,p,.007);
  // la danse élastique ; la petite voiture jaune
  const sn=K.bus(),bl=.9;['Dm9','G13','Cmaj9'].forEach((nom,i)=>{const w=T+22+i*bl*4;(L.THEME.basses[nom]||[38]).forEach((m,k)=>K.basse(m,w+k*bl+.09,sn,.16));[1,3].forEach(k=>K.charleston(w+k*bl+.1,sn,.02))});
  K.phrase(L.THEME.lent,T+22.6,.9,'trompette',sn,.03);sn.gain.setValueAtTime(1,T+33.2);sn.gain.linearRampToValueAtTime(0,T+33.8);
  for(let k=0;k<4;k++)K.noise(T+34.6+k*.22,.15,'lowpass',180,1,.06,.01);K.phrase(L.THEME.reponse,T+35.6,.7,'piano',null,.026);
  // aujourd'hui : le même thème, plus moderne, et le violon de 1925 qui passe
  const m=K.bus();K.orchestre(T+42,.5,['Dm9','G13','Cmaj9','A7','Dm9','G13','Cmaj9','A7','Dm9','G13'],m,{piano:.016});K.phrase(L.THEME.motif,T+44,.5,'trompette',m,.03);
  K.phrase(L.THEME.lent,T+48,.6,'violon',m,.02);m.gain.setValueAtTime(1,T+60.6);m.gain.linearRampToValueAtTime(0,T+62);
  // la route ; l'étoile ; le vœu
  K.nappe(T+62,17,'lowpass',160,.7,[[1,.03],[16,.03],[17,0]]);
  [96,93,91,88,84,81].forEach((n,i)=>K.cloche(n,T+69+i*.16,null,.03));K.violon(88,T+69.2,2.2,null,.026);
  K.nappeAccord('Fmaj9',T+72,7,null,.007);
  // fin
  const f=K.bus();K.phrase(L.THEME.lent,T+80,.85,'violon',f,.03);K.phrase(L.THEME.lent,T+80.4,.85,'trompette',f,.02);K.nappeAccord('D69',T+80,10,f,.008);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:18.6});
})();
