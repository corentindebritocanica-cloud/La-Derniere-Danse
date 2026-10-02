/* Plan 12 — Le bureau du rez-de-chaussée (chapitre 11, ~112 s)
   A. Lundi 23 décembre au matin : Marthe secoue les tapis, voit quelque chose dans la glycine, à mi-hauteur,
      et la décroche avec le manche d'un balai : une frange de soie noire.
   B. Le bureau : lambris, livres de droit reliés en rouge, bureau d'acajou, lampe à abat-jour vert. « Tu sors la nuit. »
      « Oui, grand-père. Je sors la nuit. » … « Et c'est lui que j'aime. » « Amélie… je vous prie. »
      Derrière trois volumes du Dalloz, un étui noir : le violon. Rose, Montpellier, cinquante ans d'étui.
      « Je voudrais voir ce portrait. Et je voudrais voir ce garçon. Pas par la fenêtre. Par la porte d'entrée. »
   C. La nuit de Noël : un violon monte à travers le plancher. Il hésite, se trompe, recommence.
   Les passages du chapitre qui évoquent le mariage ne sont pas repris. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL,P=L.POSES;
const cp=p=>JSON.parse(JSON.stringify(p));

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="30px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,64);c.fillStyle=L.C.or;c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l));if(a<=0)continue;const h=tetes[l[1]];if(h)act.push([l,a,h.x+(l[4]||0),h.y-(l[5]||62)])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}
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

function narr(c,s,a,y){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="italic 32px "+L.F.texte;c.lineWidth=5;c.strokeStyle='rgba(8,10,18,.85)';c.strokeText(s,640,y);c.fillStyle='#f1e7d3';c.fillText(s,640,y);c.restore()}
function frangeTenue(c,x,y){c.strokeStyle='#050403';c.lineWidth=1.6;for(let k=0;k<6;k++){c.beginPath();c.moveTo(x+k*1.8,y);c.lineTo(x+k*1.8+(k-2.5)*.7,y+16+k%2*3);c.stroke()}}

/* ================= A. Marthe et la frange ================= */
function sceneA(c,t){
  // un matin d'hiver, gris et clair
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#8c98a8');g.addColorStop(1,'#c9c2b4');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.translate(OX,OY);
  c.fillStyle='#4a5048';[[-150,470,95],[880,470,100],[960,540,90]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(x,y,r,r*1.3,0,0,7);c.fill();c.fillRect(x-6,y,12,640-y)});
  c.fillStyle='#7d8a78';c.fillRect(-300,640,1700,120);for(let k=0;k<140;k++){c.fillStyle='rgba(255,255,255,.4)';c.fillRect(-260+((k*131.7)%1600),646+((k*37)%60),2,1.5)}
  L.maisonSarrail(c,{lumLouise:0,ouvre:0,grappes:false});
  // la fenêtre voisine ouverte ; Marthe, le tapis, puis le balai
  const f=S.etage[3];c.fillStyle='#1a1410';c.fillRect(f.x+3,f.y+3,f.w-6,f.h-6);
  c.save();c.beginPath();c.rect(f.x-40,f.y-20,f.w+80,f.h+40);c.clip();
  const pm=cp(P.debout);pm.tA=.35;pm.hd=t>6.4?.6:.2;
  const secoue=t<6.2?Math.sin(t*14):0;pm.aF=[2+.2*secoue,.2];pm.aB=[1.8+.2*secoue,.3];
  const balai=seg(t,7.4,8.4)*(1-seg(t,10.4,11.2));if(balai>0){pm.aF=[lerp(2,3.3,balai),.1];pm.aB=[lerp(1.8,3.1,balai),.1]}
  const rm=L.pantin(c,{x:f.x+20,F:-1,p:pm,s:.78,hipY:f.y+f.h+14},'Y');c.fillStyle='#e8e1d0';c.beginPath();c.ellipse(rm.tete.x,rm.tete.y-11,10,4,0,0,7);c.fill();
  c.restore();
  if(t<6.2){c.fillStyle='#7a1a14';c.save();c.translate(rm.main.x,rm.main.y);c.rotate(.3*secoue);c.fillRect(-30,0,60,20);c.fillStyle='#c9a13a';c.fillRect(-26,4,52,3);c.restore()}
  // le manche du balai jusqu'à la branche, à mi-hauteur, sous la chambre de mademoiselle
  const fr={x:437,y:452};let fx=fr.x,fy=fr.y;
  if(balai>0){const bx=lerp(rm.main.x,fr.x+4,balai),by=lerp(rm.main.y,fr.y+2,balai);c.strokeStyle='#7a5a32';c.lineWidth=3;c.beginPath();c.moveTo(rm.main.x,rm.main.y);c.lineTo(bx,by);c.stroke();
    if(t>9.4){const u=seg(t,9.4,10.8);fx=lerp(fr.x,rm.main.x,u);fy=lerp(fr.y,rm.main.y,u)}}
  if(t<11)frangeTenue(c,fx,fy);
  c.restore();
  heure(c,'LUNDI 23 DÉCEMBRE · LE MATIN',env(t,3.4,4));
  narr(c,'Une frange de soie noire, longue comme un doigt.',env(t,10.8,2.8),680);
  narr(c,'Amélie Sarrail connaissait par cœur toutes les robes de la maison. Aucune n’avait de franges.',env(t,13.6,3.4),680);
}

/* ================= B. le bureau ================= */
const LB=[[19.4,'E','Assieds-toi.',1.3],[21,'E','Tu sors la nuit.',1.5],[23,'L','Oui, grand-père. Je sors la nuit.',2.1],[25.5,'E','Où vas-tu ?',1.2],
  [26.9,'L','Au Cabaret des Étoiles, rue des Teinturiers. Je danse.',2.4],[29.5,'L','J’apprends à danser depuis septembre',1.8],[31.4,'L','chez une ancienne danseuse du Moulin-Rouge qui s’appelle Solange.',2.6],
  [34.2,'A','Seigneur.',1.2],[35.6,'E','Et tu y vas seule ?',1.4],[37.2,'L','Non. J’y vais avec quelqu’un. Il s’appelle Célestin Delacroix.',2.7],
  [40.1,'L','C’est lui qui m’a aidée à descendre par la glycine.',2.3],[42.6,'L','Et c’est lui que j’aime.',2.2],
  [47.4,'E','Amélie. Voulez-vous nous laisser, je vous prie ?',2.4],[50,'A','Édouard, je ne…',1.5],[51.7,'E','Je vous prie.',1.5],
  [58.6,'E','Il était à moi. J’avais dix-neuf ans.',2.1],[60.9,'E','Je jouais dans un petit orchestre, à Montpellier, pendant mes études de droit.',3],
  [64.1,'E','Il y avait une chanteuse. Elle s’appelait Rose.',2.3],[66.6,'E','Je voulais partir avec elle à Paris. Je voulais jouer.',2.5],
  [69.4,'E','Et je n’ai plus jamais sorti ce violon de son étui.',2.4],[72.1,'E','Je ne te regardais pas beaucoup, Louise. Je le sais.',2.4],
  [74.8,'E','J’avais peur que tu fasses ce que j’ai fait.',2.2],[77.2,'E','Et j’avais encore plus peur que tu ne le fasses pas.',2.5],
  [80.2,'E','Ce garçon. Ce peintre. Il est honnête ?',2.2],[82.6,'L','C’est l’homme le plus honnête que je connaisse.',2.2],[85,'E','Il t’aime ?',1.2],
  [86.4,'L','Il m’a peinte, grand-père. Il m’a peinte telle que je suis.',2.6],[89.6,'E','Je voudrais voir ce portrait. Et je voudrais voir ce garçon.',2.6],
  [92.4,'E','Pas par la fenêtre. Par la porte d’entrée. Dimanche, à quinze heures.',3],
  [99.4,'L','Je veux passer le baccalauréat. Et entrer à la faculté de médecine.',2.8],[102.4,'E','Une chose à la fois, ma petite. Une chose à la fois.',2.6]];
const BIB={x:60,y:110,w:470,h:500};
function bureau(c,t){
  c.fillStyle='#24160e';c.fillRect(0,0,W,SOL);
  c.fillStyle='rgba(0,0,0,.25)';for(let x=0;x<W;x+=90){c.fillRect(x,360,2,252)}c.fillStyle='#3a2414';c.fillRect(0,354,W,8);
  // la bibliothèque : livres de droit reliés en rouge ; le Dalloz en bas
  c.fillStyle='#1a0f09';c.fillRect(BIB.x,BIB.y,BIB.w,BIB.h);
  for(let r=0;r<5;r++){c.fillStyle='#2e1d0e';c.fillRect(BIB.x,BIB.y+r*100+92,BIB.w,8);
    for(let k=0;k<26;k++){const bx=BIB.x+8+k*17.6,bh=70+((k*7+r*3)%14);const vide=r===4&&k>=3&&k<=5&&t>55&&t<56.6;if(vide)continue;
      const dep=r===4&&k>=3&&k<=5?eio(seg(t,54.2,55))*(1-eio(seg(t,56.6,57.2))):0;
      c.fillStyle=(k+r)%5===0?'#5a1410':'#7a1a14';c.fillRect(bx+dep*(k-2)*30,BIB.y+r*100+92-bh,15,bh);c.fillStyle='#c9a13a';c.fillRect(bx+3+dep*(k-2)*30,BIB.y+r*100+92-bh+10,9,2)}}
  // la fenêtre du bureau (rez-de-chaussée, à droite) : un jour gris
  c.fillStyle='#8c98a8';c.fillRect(1040,140,170,210);c.strokeStyle='#2e1d0e';c.lineWidth=8;c.strokeRect(1040,140,170,210);c.beginPath();c.moveTo(1125,140);c.lineTo(1125,350);c.stroke();
  c.fillStyle='#1a120c';c.fillRect(0,SOL,W,H-SOL);c.fillStyle='#5a1410';c.fillRect(200,624,880,60);
}
function bureauAvant(c,t,o){
  // le bureau d'acajou, la lampe à abat-jour vert, la frange, l'étui
  c.fillStyle='#4a2414';c.fillRect(500,520,300,14);c.fillStyle='#3a1c10';c.fillRect(510,534,280,78);
  c.fillStyle='#1d140b';c.fillRect(530,478,8,42);c.fillStyle='#2f5a3a';c.beginPath();c.moveTo(510,480);c.lineTo(558,480);c.lineTo(548,458);c.lineTo(520,458);c.closePath();c.fill();
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(534,500,4,534,500,380);g.addColorStop(0,'rgba(200,230,160,.28)');g.addColorStop(1,'rgba(200,230,160,0)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  if(o.frange)frangeTenue(c,600,514);
  if(o.etui){const op=o.ouvert;c.fillStyle='#0b0907';c.beginPath();c.ellipse(680,512,70,13,0,0,7);c.fill();
    if(op>0){c.fillStyle='#5a2a2a';c.beginPath();c.ellipse(680,508,62,9,0,0,7);c.fill();c.fillStyle='#7a4a22';c.beginPath();c.ellipse(660,507,26,7,0,0,7);c.fill();c.fillRect(686,505,48,3); // le violon
      c.save();c.globalAlpha=1-op;c.fillStyle='#0b0907';c.beginPath();c.ellipse(680,500,70,12,0,0,7);c.fill();c.restore()}
    for(let k=0;k<12;k++){c.fillStyle=`rgba(230,220,200,${.3*Math.sin(t*2+k)**2})`;c.fillRect(620+k*11,492+Math.sin(t+k)*6,2,2)}} // la poussière de l'étui
}
function fauteuil(c,x,F){c.fillStyle='#3a1c10';c.fillRect(x-40,540,80,72);c.fillRect(x-F*46-6,470,12,142);c.fillStyle='#4a2414';c.fillRect(x-44,532,88,14)}
function sceneB(c,t){
  bureau(c,t);
  const tetes={};
  fauteuil(c,400,1);fauteuil(c,900,-1);
  // Amélie, debout derrière lui, très droite, la frange entre deux doigts ; elle sort
  const sort=seg(t,53.4,55.4);
  if(sort<1){const x=lerp(300,1180,eio(sort));c.save();c.globalAlpha=1-seg(t,55,55.4);L.amelie(c,x,SOL,{F:sort>0?1:1,s:1,tempe:t>34&&t<36?1:0});c.restore();tetes.A={x,y:SOL-196}}
  // Édouard : assis ; il se lève, va à la bibliothèque, revient avec l'étui ; il effleure les cordes
  let xe=400,assis=true;const pe=cp(P.assis);pe.aF=[.9,.9];pe.hd=0;
  const leve=seg(t,53.8,54.4);if(t>53.8&&t<57.6){assis=false;xe=lerp(400,330,eio(seg(t,53.8,54.4)));if(t>56.8)xe=lerp(330,400,eio(seg(t,56.8,57.6)))}
  if(t>59.2&&t<62)pe.aF=[1.5,.3]; // il effleure les cordes
  if(t>72&&t<80)pe.hd=-.05;
  const epaule=t>95.2&&t<99;
  let re;
  if(assis&&!epaule){re=L.pantin(c,{x:xe,F:1,p:pe,hipY:560,s:1.05},'B')}
  else if(!assis){const p=L.pas(P.debout,t*8,.2,0);p.tA=.06;if(t>54.4&&t<56.6){p.aF=[1.3,.6];p.tA=.25}if(t>56.6)p.aF=[1.2,.9];re=L.pantin(c,{x:xe,F:t>56.6?1:-1,p,s:1.05},'B');
    if(t>56.6){c.fillStyle='#0b0907';c.fillRect(re.main.x-10,re.main.y-8,90,18)}}
  else{const p=cp(P.debout);p.aF=[1.3,.8];p.aB=[1.2,.9];p.hd=.1;re=L.pantin(c,{x:420,F:1,p,s:1.05},'B')}
  tetes.E=re.tete;
  // Louise, assise face à lui ; elle soutient son regard ; elle fait le tour du bureau
  const tour=seg(t,94.2,96);let rl;
  if(tour<=0){const pl=cp(P.assis);pl.aF=[.8,1];pl.hd=t>44.8&&t<47?-.02:0;if(t>76&&t<88)pl.hd=.1;rl=L.pantin(c,{x:900,F:-1,p:pl,hipY:560,levres:true},'L')}
  else{const p=tour<1?L.pas(P.debout,t*10,.3,0):cp(P.debout);if(tour>=1){p.aF=[1.3,.8];p.aB=[1.2,.9];p.hd=-.2}const xt=tour<.5?lerp(900,860,tour*2):lerp(860,462,eio((tour-.5)*2));rl=L.pantin(c,{x:xt,F:-1,p,levres:true},'L')}
  tetes.L=rl.tete;
  if(t>76&&t<90){c.fillStyle='rgba(200,220,255,.8)';c.beginPath();c.arc(rl.tete.x-6,rl.tete.y+8+(t*20)%8,1.6,0,7);c.fill()} // les larmes
  bureauAvant(c,t,{frange:t>54.6,etui:t>57.4&&t<1000,ouvert:eio(seg(t,57.8,58.4))*(1-eio(seg(t,88.8,89.4)))});
  dire(c,t,LB,tetes);
  heure(c,'MIDI · LE BUREAU DU REZ-DE-CHAUSSÉE',env(t,18.2,4));
}

/* ================= C. la nuit de Noël, le violon ================= */
function sceneC(c,t){
  L.ciel(c,0,480);L.etoiles(c,t,0,0,false,300);
  c.save();c.translate(OX,OY);jardin(c);L.maisonSarrail(c,{lumLouise:.25,ouvre:0,lumGP:1,ombreGP:false,grappes:false});banc(c);
  // dans le bureau, une ombre qui joue du violon
  const r=S.rdc[S.grandPere];c.fillStyle='rgba(20,12,8,.88)';c.beginPath();c.arc(r.x+28,r.y+38,8,0,7);c.fill();c.fillRect(r.x+20,r.y+46,16,64);
  c.strokeStyle='rgba(20,12,8,.9)';c.lineWidth=2;const arc=Math.sin(t*3)*12;c.beginPath();c.moveTo(r.x+18,r.y+52+arc);c.lineTo(r.x+52,r.y+44-arc);c.stroke();
  c.restore();
  heure(c,'VEILLE DE NOËL · DEUX HEURES DU MATIN',env(t,108.2,4));
  narr(c,'Il hésitait, se trompait, recommençait. Il jouait faux, puis un peu moins faux.',env(t,108.8,4.4),684);
}

const OUVERTURE=[{s:'CHAPITRE 11 · LE BUREAU DU REZ-DE-CHAUSSÉE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Ce fut Marthe qui la trahit, sans le vouloir.',y:380,f:"italic 44px "+L.F.texte}];
const FIN=[{s:'Louise resta éveillée à l’écouter,',y:320,f:"italic 36px "+L.F.texte},{s:'les yeux grands ouverts dans le noir.',y:370,f:"italic 36px "+L.F.texte},{s:'Elle comprit alors de qui elle tenait ses nuits blanches.',y:460,f:"38px "+L.F.main,c:L.C.or}];
const DUREE=122;
const COUPES=[[17.6,.45],[107.4,.5]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<115.4){if(t<17.6)sceneA(c,t);else if(t<107.4)sceneB(c,t);else sceneC(c,t)}
  let n=t<3.6?1-seg(t,2.9,3.6):t>114.6?seg(t,114.6,115.4):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,seg(t,115.6,116.4)*(1-seg(t,121.2,122)),540);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // le tapis secoué, le balai
  for(let w=3.6;w<6.2;w+=.28)K.noise(T+w,.08,'lowpass',400,1,.06,.005);K.noise(T+9.4,.2,'bandpass',1200,2,.02,.02);
  K.nappeAccord('A7b9',T+11,6,null,.005);
  // le bureau : la pendule, le silence
  for(let w=18;w<53;w+=1.2)K.noise(T+w,.03,'bandpass',2200,8,.035,.002);
  K.basse(33,T+21,null,.12);K.nappeAccord('Dm9',T+42.6,4,null,.006);
  K.noise(T+54.4,.5,'lowpass',300,1,.04,.05);K.noise(T+57.8,.4,'bandpass',800,1,.03,.05); // les volumes du Dalloz, l'étui
  // les cordes détendues ne produisent qu'un murmure
  [55,57,62,64].forEach((m,i)=>K.souffle(m,T+59.4+i*.3,.6,{g:.008,cut:900,vib:3,att:.2}));
  const v=K.bus();K.nappeAccord('Dm9',T+64,6,v,.005);K.nappeAccord('Bbmaj7',T+70,6,v,.005);K.nappeAccord('Fmaj9',T+86,6,v,.006);K.nappeAccord('Cmaj9',T+94,8,v,.006);
  K.phrase(L.THEME.reponse,T+89.6,.8,'piano',v,.025);
  // la nuit de Noël : un violon qui hésite, se trompe, recommence
  const notes=L.THEME.lent;let w=T+108;const fausse=[0,15,0,-20,0,0,30,0];
  notes.forEach(([o,m,d],i)=>{const t0=w+o*.8;const o2=ac.createOscillator();o2.type='sawtooth';o2.frequency.value=L.mf(m);o2.detune.value=fausse[i%8];
    const g=ac.createGain();g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(.025,t0+.2);g.gain.setValueAtTime(.025,t0+d*.8-.1);g.gain.linearRampToValueAtTime(0.0001,t0+d*.8+.1);
    o2.connect(K.lp(2400)).connect(g).connect(K.out);o2.start(t0);o2.stop(t0+d*.8+.2)});
  K.violon(69,T+116.4,1.2,null,.022);K.violon(72,T+117.6,.8,null,.022);K.violon(74,T+118.4,2,null,.022);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:62});
})();
