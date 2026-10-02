/* Plan 09 — La soirée des lendemains (chapitre 8, ~125 s)
   A. La porte rouge, un peu après 22 h 40 : Solange pousse un cri, traverse la piste ; le pantalon de Gaston ;
      « une tenue pour chasser la bécasse » ; elle emmène Louise dans l'arrière-salle. Maurice : « Tu as fait vite, le peintre. »
   B. L'atmosphère de fin de noce : le grand blond et sa coupe, la dactylo qui refait son grand écart sur une table,
      les deux aviateurs de chez Latécoère. Louise revient en robe de soie champagne brodée de perles ; il pose son verre sans le finir.
   C. Fox-trot, charleston (mal, avec une joie féroce), valse lente (la cuisine de Castres, les un-deux-trois).
   D. À table : « Il faudra le remercier. » … « Tout a à voir avec tout, petit hibou. »
   E. Léon sur scène : « Il n'a pas encore de nom. » « Hier c'était un accident. Aujourd'hui c'est un choix. »
   F. Le morceau sans nom, plus lent : elle joue avec la ligne, s'arrête dos tourné, revient jusqu'à lui.
      La trompette tient une note, puis silence. Le premier baiser, sur la pointe des pieds. La salle explose.
   G. « Pardon… » « Moi je sais. » « La même chose qu'à moi, petit hibou. » Le second baiser ; Léon rejoue le morceau.
   Liberté reprise du plan 05 : la ligne invisible en filet d'or sur le parquet. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,eic=L.eic,W=L.W,H=L.H,P=L.POSES,SC=L.SCENE;
const cp=p=>JSON.parse(JSON.stringify(p));
const SOLP=640,FOND=520;

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.font="28px "+L.F.machine;L.setLS(c,'3px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,1230,40);c.fillStyle=L.C.or;c.fillText(s,1230,40);L.setLS(c,'0px');c.restore()}
function titre(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="24px "+L.F.machine;L.setLS(c,'8px');
  c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.8)';c.strokeText(s,640,700);c.fillStyle=L.C.or;c.fillText(s,640,700);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);y=clamp(y,40,H-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
// caméra fixe (z) : les têtes renvoyées par les pantins sont converties en coordonnées d'écran
const Z=1.08,CX=640,CY=420;
const ecran=p=>p&&{x:640+(p.x-CX)*Z,y:360+(p.y-CY)*Z};
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l))*L.coupe(t,lignes,l);if(a<=0)continue;const h=ecran(tetes[l[1]]);if(h)act.push([l,a,h.x+(l[4]||0),h.y-(l[5]||66)])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}

// la robe de soie champagne brodée de perles, qui accroche la lumière des lampes à chaque pas
let OFF=null;
function champagne(c,t,st,flare){
  if(!OFF){OFF=document.createElement('canvas');OFF.width=W;OFF.height=H}const o=OFF.getContext('2d');
  o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,W,H);o.setTransform(c.getTransform());o.globalAlpha=c.globalAlpha;
  const r=L.pantin(o,st,'L',flare||0),s=st.s||1;o.globalAlpha=1;
  o.globalCompositeOperation='source-atop';const g=o.createLinearGradient(0,r.hanche.y-64*s,0,r.hanche.y+52*s);g.addColorStop(0,'#c9ad7a');g.addColorStop(1,'#e2c994');o.fillStyle=g;
  o.fillRect(r.hanche.x-70*s,r.hanche.y-58*s,140*s,108*s);
  for(let k=0;k<26;k++){const a=.5+.5*Math.sin(t*7+k*2.3);o.fillStyle=`rgba(255,250,235,${.75*a})`;o.fillRect(r.hanche.x+(((k*37)%60)-30)*s,r.hanche.y+(((k*53)%96)-52)*s,2*s,2*s)}
  o.globalCompositeOperation='source-over';o.setTransform(1,0,0,1,0,0);
  c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(OFF,0,0);c.restore();return r}
function golf(c,r,s){const y0=r.hanche.y+40*s,y1=r.hanche.y+66*s,x=r.hanche.x;c.save();c.fillStyle='#3b2c20';c.fillRect(x-13*s,y0,26*s,y1-y0);
  c.strokeStyle='rgba(200,170,120,.45)';c.lineWidth=1;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-13*s,y0+k*(y1-y0)/4);c.lineTo(x+13*s,y0+k*(y1-y0)/4);c.stroke();c.beginPath();c.moveTo(x-13*s+k*6.5*s,y0);c.lineTo(x-13*s+k*6.5*s,y1);c.stroke()}c.restore()}
// profondeur : du fond de la salle (sol 520, petit) au premier plan (sol 640)
const prof=u=>({sol:lerp(FOND,SOLP,u),s:lerp(.78,1,u)});
function verre(c,m){if(!m)return;c.fillStyle='rgba(240,230,200,.8)';c.beginPath();c.moveTo(m.x-5,m.y-14);c.lineTo(m.x+5,m.y-14);c.lineTo(m.x,m.y-6);c.closePath();c.fill();c.fillRect(m.x-.8,m.y-6,1.6,6)}
function coupe(c,m){if(!m)return;c.fillStyle=L.C.or;c.beginPath();c.moveTo(m.x-11,m.y-26);c.lineTo(m.x+11,m.y-26);c.lineTo(m.x+6,m.y-12);c.lineTo(m.x-6,m.y-12);c.closePath();c.fill();c.fillRect(m.x-2,m.y-12,4,10);c.fillRect(m.x-7,m.y-3,14,3)}
// les portes : la porte rouge de la rue, à gauche ; l'arrière-salle, à droite
function portes(c,ouvRue,ouvArr){
  c.fillStyle='#120806';c.fillRect(22,250,96,150);c.fillStyle='rgba(30,40,70,.9)';c.fillRect(26,254,88*ouvRue,146);c.fillStyle='#8a1a14';c.fillRect(26+88*ouvRue,254,88*(1-ouvRue),146);
  c.fillStyle='#120806';c.fillRect(1168,250,86,150);c.fillStyle='rgba(255,200,120,.6)';c.fillRect(1172,254,78*ouvArr,146);c.fillStyle='#3a2410';c.fillRect(1172+78*ouvArr,254,78*(1-ouvArr),146);
  // le bar
  c.fillStyle='#1d120b';c.fillRect(880,330,250,70);c.fillStyle='#3a2410';c.fillRect(874,322,262,10);
  [[900,312],[930,308],[1080,310]].forEach(([x,y])=>{c.fillStyle='rgba(31,58,36,.9)';c.fillRect(x,y-24,8,24)});
}
function petiteTable(c,x,y,k){c.save();c.translate(x,y);c.scale(k,k);c.fillStyle='#0d0806';c.beginPath();c.ellipse(0,0,64,13,0,0,7);c.fill();c.fillRect(-5,0,10,54);c.restore()}

/* ---------------- les figurants de la soirée ---------------- */
function figurants(c,t,o){
  // le grand blond au cure-dent fait visiter sa coupe
  const pb=cp(P.debout);pb.aF=[2.2+.3*Math.sin(t*3),.2];const rb=L.pantin(c,{x:300+40*Math.sin(t*.4),F:1,p:pb,s:.82,sol:560},'X');coupe(c,rb.main);
  c.fillStyle='#e8dcc2';c.fillRect(rb.tete.x+8,rb.tete.y+6,9,1.5);
  // la dactylo du grand écart, qui le refait sur une table
  petiteTable(c,1000,532,.9);
  const ec=o.ecart==null?(.5+.5*Math.sin(t*1.1)):o.ecart;const pd=cp(P.debout);pd.lF=[lerp(.1,1.5,ec),0];pd.lB=[lerp(-.1,-1.5,ec),0];pd.aF=[2.6,.1];pd.aB=[-2.6,.1];
  L.pantin(c,{x:1000,F:1,p:pd,s:.8,hipY:532-lerp(80,6,ec)},'Y');
}
function aviateurs(c,t,o){
  const r=[];[[o.x,-1],[o.x+64,-1]].forEach(([x,F],i)=>{const p=cp(P.debout);p.aF=[o.leve?2.5:1.3,o.leve?.1:.6];const rr=L.pantin(c,{x,F,p,s:.95,sol:600},'K');verre(c,rr.main);r.push(rr)});return r}

/* ================= A. l'arrivée ================= */
const LA=[[5.4,'S','La voilà ! Ma petite ! On te croyait morte !',2.2],[8,'S','Qu’est-ce que c’est que ça ?',1.6],[9.8,'L','C’est à mon cousin Gaston. Il est dans les Ordres.',2.3],
  [12.3,'S','Ce n’est pas une tenue pour danser, c’est une tenue pour chasser la bécasse.',2.8],[15.3,'S','Il lui manque une frange. Viens, j’ai mieux pour toi.',2.3],
  [17.9,'M','Tu as fait vite, le peintre.',1.7,0,250],[19.8,'C','J’avais une bonne raison.',1.6]];
function sceneA(c,t){
  const ouv=eio(seg(t,3.2,3.7))*(1-eio(seg(t,5,5.5)));portes(c,ouv,eio(seg(t,16.6,17))*(1-eio(seg(t,18.2,18.6))));
  figurants(c,t,{});
  const tetes={};
  // ils entrent par la porte rouge et avancent sur la piste
  const av=eio(seg(t,3.6,5.6)),pr=prof(av),marche=t>3.6&&t<5.6;
  const pc=marche?L.pas(P.debout,t*10,.3,0):cp(P.debout);pc.aF=[.15,.6];pc.aB=[-.05,.6];
  if(t>17.2&&t<18.2)pc.aF=[1.2,.3]; // la poignée de main
  const xc=lerp(80,500,av);const rc=L.pantin(c,{x:xc,F:1,p:pc,s:pr.s,sol:pr.sol},'C');tetes.C=rc.tete;
  // Louise, puis l'arrière-salle avec Solange
  const sort=eio(seg(t,15.8,17.4)),ps=prof(1-sort);
  let xl=lerp(130,580,av);if(sort>0)xl=lerp(580,1200,sort);
  const pl=(marche||(sort>0&&sort<1))?L.pas(P.debout,t*10+3,.28,0):cp(P.debout);pl.hd=-.05;
  if(t>8.2&&t<9.4)pl.hd=.3; // elle baisse les yeux sur le pantalon
  const Fl=sort>0?1:(t>6&&t<15.8?1:1);
  const rl=t<17.4?L.pantin(c,{x:xl,F:Fl,p:pl,s:sort>0?ps.s:pr.s,sol:sort>0?ps.sol:pr.sol,levres:true},'L'):null;if(rl){golf(c,rl,sort>0?ps.s:pr.s);tetes.L=rl.tete}
  // Solange : le cri, la traversée de la piste, plumes au vent, l'étreinte, le recul
  const court=eio(seg(t,4.6,5.8));let xs=lerp(1010,660,court);let Fs=-1;const ss=cp(P.debout);
  if(court>0&&court<1)Object.assign(ss,L.pas(P.debout,t*14,.42,0));
  if(t>5.8&&t<7.4){ss.aF=[1.5,.9];ss.aB=[1.4,1];xs=lerp(660,618,eio(seg(t,5.8,6.1)))}
  if(t>=7.4&&t<15.8){xs=lerp(618,680,eio(seg(t,7.4,7.8)));if(t>7.9&&t<9.6){ss.tA=-.12;ss.hd=.3}}
  if(t>12.3&&t<15)ss.aF=[1.4+.3*Math.sin(t*6),.2];
  if(sort>0){xs=lerp(680,1240,sort);Fs=1;if(sort<1)Object.assign(ss,L.pas(P.debout,t*10,.28,0))}
  if(t<17.6){const rs=L.pantin(c,{x:xs,F:Fs,p:ss,s:sort>0?ps.s:1,sol:sort>0?ps.sol:SOLP},'S');tetes.S=rs.tete}
  if(t>4.4&&t<5.2){c.fillStyle='rgba(240,230,200,.8)';c.beginPath();c.arc(1000,560+(t-4.4)*60,4,0,7);c.fill()} // le verre renversé
  // Maurice et son clin d'œil
  if(t>16.4){const am=eio(seg(t,16.4,17.4));c.save();L.maurice(c,lerp(900,640,am),SOLP,{chapeau:false,main:t>17.2&&t<18.2?{x:-40,y:-120}:{x:52,y:-96}});c.restore();tetes.M={x:lerp(900,640,am),y:SOLP};
    if(t>18.6&&t<18.9){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.9)';c.beginPath();c.arc(lerp(900,640,am)+6,SOLP-196,3,0,7);c.fill();c.restore()}}
  return tetes;
}
/* ================= B. la fin de noce, la robe champagne ================= */
function sceneB(c,t){
  portes(c,0,eio(seg(t,25.4,25.8))*(1-eio(seg(t,27,27.4))));
  figurants(c,t,{});
  const tetes={};
  const rav=aviateurs(c,t,{x:760,leve:t>22.4&&t<24});
  // Célestin, un verre à la main ; il le pose sans le finir
  const pc=cp(P.debout);pc.aF=[1.3,.6];pc.F=1;const pose=seg(t,28.4,29.2);if(pose>0)pc.aF=[lerp(1.3,.9,pose),lerp(.6,1.1,pose)];if(t>29.2)pc.aF=[.15,.6];pc.hd=t>26.6?-.05:.05;
  const fx=t>26.4?1:-1;const rc=L.pantin(c,{x:640,F:fx,p:pc},'C');if(t<29.2)verre(c,rc.main);else{c.fillStyle='rgba(240,230,200,.8)';c.fillRect(560,598,6,10)}
  tetes.C=rc.tete;
  // Louise revient de l'arrière-salle
  if(t>25.6){const u=eio(seg(t,25.6,28.4)),pr=prof(u);const pl=u<1?L.pas(P.debout,t*9,.26,0):cp(P.debout);pl.hd=-.06;
    const rl=champagne(c,t,{x:lerp(1200,800,u),F:-1,p:pl,s:pr.s,sol:pr.sol,levres:true},.12);tetes.L=rl.tete}
  return tetes;
}
/* ================= C. trois danses ================= */
function sceneC(c,t){
  portes(c,0,0);figurants(c,t,{});
  const st={C:{x:585,F:1,p:cp(P.tenue)},L:{x:695,F:-1,p:cp(P.tenue),levres:true},flare:.1};
  if(t<34.4){ // fox-trot, pour se retrouver
    const ph=(t-30)/.5*Math.PI,X=640+50*Math.sin((t-30)*.8);st.C.x=X-55;st.L.x=X+55;st.C.p=L.pas(P.tenue,ph,.3,0);st.L.p=L.pas(P.tenue,ph+Math.PI,.3,0)}
  else if(t<38.8){ // charleston : mal, avec une joie féroce
    const ph=(t-34.4)/.2*Math.PI,X=640;st.C.x=X-80;st.L.x=X+80;st.C.F=1;st.L.F=-1;
    const k=Math.sin(ph),k2=Math.sin(ph+.6+.4*Math.sin(t*3)); // elle, un peu à contretemps
    st.C.p={tA:.05,hd:-.05,aF:[.9+.5*k,.6],aB:[-.9+.5*k,.6],lF:[.4*k,-.5*Math.max(0,k)],lB:[-.3*k,-.4*Math.max(0,-k)]};
    st.L.p={tA:.12*k2,hd:-.1+.1*k2,aF:[1.2+.9*k2,.4],aB:[-1.2+.9*k2,.4],lF:[.7*k2,-.7*Math.max(0,k2)],lB:[-.5*k2,-.5*Math.max(0,-k2)]};st.flare=.3+.3*Math.abs(k2)}
  else{ // valse lente : la cuisine de Castres
    const ph=(t-38.8)/.55*Math.PI*2/3,ang=(t-38.8)*1.4,X=640+60*Math.sin((t-38.8)*.6);
    const cx=Math.cos(ang);st.C.x=X-55*cx;st.L.x=X+55*cx;st.C.F=cx>=0?1:-1;st.L.F=-st.C.F;if(Math.abs(cx)<.15){st.C.F=cx>=0?.2:-.2;st.L.F=-st.C.F}
    st.C.p=L.pas(P.tenue,ph,.22,0);st.L.p=L.pas(P.tenue,ph+Math.PI,.22,0);st.flare=.2}
  c.fillStyle='rgba(0,0,0,.35)';[st.C,st.L].forEach(d=>{c.beginPath();c.ellipse(d.x,SOLP+3,30,6,0,0,7);c.fill()});
  const rc=L.pantin(c,{...st.C,sol:SOLP},'C'),rl=champagne(c,t,{...st.L,sol:SOLP},st.flare);
  return{C:rc.tete,L:rl.tete};
}
/* ================= D. à table ================= */
const LD=[[46,'C','Il faudra le remercier.',1.6],[47.8,'L','Qui ?',1],[49,'C','Henri Lasserre. Sans son dîner,',1.8],
  [51,'C','je n’aurais jamais eu trois heures devant moi pour étudier votre glycine.',2.8],[54.1,'L','La glycine n’a rien à voir avec Henri Lasserre.',2.2],
  [56.6,'C','Tout a à voir avec tout, petit hibou.',2.2],[59,'C','Les gens usinés l’un pour l’autre.',2]];
function aTable(c,t,o){
  // la table au bord de la piste, la bouteille entamée
  const pc=cp(P.assis);pc.aF=[.9,.9];pc.hd=o.hdC||0;
  const pl=cp(P.assis);pl.aF=[.8,1];pl.hd=o.hdL||0;
  const rire=t>51&&t<53.6?Math.abs(Math.sin(t*14))*.06:0;pc.tA+=rire;
  let rc=null;if(!o.debout)rc=L.pantin(c,{x:560,F:1,p:pc,hipY:592},'C');
  const rl=champagne(c,t,{x:720,F:-1,p:pl,hipY:592,levres:true},.1);
  petiteTable(c,640,600,1.1);c.fillStyle='rgba(31,58,36,.95)';c.fillRect(632,560,12,26);c.fillRect(635,548,6,12);
  verre(c,{x:604,y:586});verre(c,{x:676,y:586});
  return{C:rc&&rc.tete,L:rl.tete};
}
function sceneD(c,t){portes(c,0,0);figurants(c,t,{ecart:.2});
  const regard=t>58.6;return aTable(c,t,{hdC:regard?-.02:0,hdL:regard?-.06:0})}
/* ================= E. Léon ================= */
const LE=[[61.2,'Le','Mesdames, messieurs.',1.6,0,24],[63,'Le','Hier soir, deux personnes ont dansé sur ma musique',2.2,0,24],[65.3,'Le','une chose que je n’avais jamais vue.',1.9,0,24],
  [67.4,'Le','Il n’a pas encore de nom. Il n’a pas encore de pas.',2.4,0,24],[70,'Le','Il n’a que deux danseurs. Je voudrais qu’ils l’essaient.',2.5,0,24],
  [73.3,'L','Je ne peux pas. Pas devant tout le monde.',2.2],[75.6,'L','Hier c’était un accident.',1.6],
  [77.5,'C','Hier c’était un accident. Aujourd’hui c’est un choix.',2.5],[80.2,'C','Faites-moi confiance.',1.8]];
function sceneE(c,t){
  portes(c,0,0);
  const tetes={};
  // Célestin se lève, lui tend la main, paume ouverte, sans la saisir
  const debout=t>76.8;
  const r=aTable(c,t,{debout,hdL:t>72.6&&t<77?.25:-.05,hdC:t<72.6?-.25:0});tetes.L=r.L;tetes.C=r.C;
  if(debout){const p=cp(P.debout);const tend=eio(seg(t,77.2,77.8));p.aF=[lerp(.15,1.35,tend),lerp(.1,-.15,tend)];p.tA=.05*tend;
    const rc=L.pantin(c,{x:lerp(560,600,eio(seg(t,76.8,77.3))),F:1,p},'C');tetes.C=rc.tete;
    if(t>77.8){c.save();c.globalAlpha=.9;c.fillStyle=L.C.bleu;c.beginPath();c.arc(rc.main.x+2,rc.main.y-3,2.4,0,7);c.fill();c.restore()}} // la tache bleue sur le pouce
  return tetes;
}
/* ================= F. le morceau sans nom ================= */
// la danse : il l'envoie au bout de son bras ; elle joue avec la ligne, ralentit, s'arrête dos tourné, revient jusqu'à lui
function danse(t){
  const Xc=520;const C={x:Xc,F:1,p:cp(P.debout)},Lo={x:Xc+90,F:-1,p:cp(P.debout),levres:true};let flare=.15,fil=false,ligne=seg(t,84,85)*(1-seg(t,101.6,103));
  if(t<83.6){ // il la mène sur la piste
    const u=eio(seg(t,82,83.6));C.x=lerp(600,Xc,u);Lo.x=lerp(720,Xc+90,u);C.p=u<1?L.pas(P.debout,t*9,.25,0):C.p;Lo.p=u<1?L.pas(P.debout,t*9+3,.22,0):Lo.p;C.p.aF=[1.2,.2];Lo.p.aF=[1.2,.2];Lo.F=-1}
  else if(t<99.4){
    fil=true;const per=3.4,tt=t-83.6;let u=(tt%per)/per;const cyc=Math.floor(tt/per);
    // elle ralentit quand il l'attend vite (cycle 2), s'arrête au bout de la ligne, dos tourné (cycle 3)
    if(cyc===2)u=Math.pow(u,1.6);
    let d=80+150*Math.pow(Math.sin(Math.PI*u),1.3);
    const arret=cyc===3&&u>.38&&u<.8;if(arret)d=230;
    Lo.x=Xc+d;const sortant=u<.5;
    Lo.F=sortant?(u<.08?-Math.cos(Math.PI*u/.08):1):(u<.58?Math.cos(Math.PI*(u-.5)/.08):-1);
    if(arret){Lo.F=1;C.x=Xc+lerp(0,120,eio(seg(u,.5,.8)))} // il vient la chercher
    const ph=t/.42*Math.PI;C.p=L.pas(P.debout,ph*.5,.08,0);C.p.tA=.04*Math.sin(t*2);C.p.aF=[1.35,.1];C.p.hd=-.05;
    Lo.p=arret?cp(P.debout):L.pas(P.debout,ph,.3,0);
    if(Lo.F>0){Lo.p.aB=[-1.3,-.1];Lo.p.aF=[.5+.3*Math.sin(t*3),.6]}else{Lo.p.aF=[1.35,.1];Lo.p.aB=[-.4,.5]}
    if(arret){Lo.p.aB=[-.9,-.1];Lo.p.hd=-.15;Lo.p.tA=-.05}
    // les perles comme un défi
    const defi=cyc===1&&u>.42&&u<.6;if(defi){Lo.p.tA=.12*Math.sin(t*16);flare=.5}
    else flare=.15+.2*Math.abs(Math.sin(t*3));
  }else{ // la dernière mesure : elle continue, jusqu'à lui
    const u=eio(seg(t,99.4,100.6));Lo.x=lerp(Xc+150,Xc+34,u);Lo.F=-1;C.p=cp(P.debout);C.p.aF=[lerp(1.35,.9,u),.6];C.p.hd=lerp(-.05,.18,u);
    Lo.p=cp(P.debout);Lo.p.hd=lerp(-.05,-.32,u);Lo.p.aF=[lerp(1.3,1.1,u),.4];
    const pointe=seg(t,102.6,103);Lo.lift=8*pointe*(1-seg(t,104.2,104.6));
    if(pointe>0){C.p.tA=.08;C.p.hd=.3}
  }
  return{C,L:Lo,fil,flare,ligne};
}
function sceneF(c,t){
  portes(c,0,0);
  const st=danse(t);
  if(st.ligne>0){c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(500,0,780,0);g.addColorStop(0,'rgba(255,215,120,0)');g.addColorStop(.15,`rgba(255,215,120,${.55*st.ligne})`);g.addColorStop(1,'rgba(255,215,120,0)');
    c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(500,SOLP+4);c.lineTo(790,SOLP+4);c.stroke();c.restore()}
  c.fillStyle='rgba(0,0,0,.35)';[st.C,st.L].forEach(d=>{c.beginPath();c.ellipse(d.x,SOLP+3,30,6,0,0,7);c.fill()});
  const rc=L.pantin(c,{...st.C,sol:SOLP},'C'),rl=champagne(c,t,{...st.L,sol:SOLP},st.flare);
  if(st.fil){const a=rc.main,b=st.L.F>0?rl.mainDos:rl.main;c.save();c.strokeStyle='rgba(255,215,120,.55)';c.lineWidth=1.5;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.restore()}
  return{C:rc.tete,L:rl.tete};
}
/* ================= G. après le baiser ================= */
const LG=[[106.2,'L','Pardon… Je ne sais pas ce qui m’a pris.',2.3],[108.7,'C','Moi je sais.',1.3],[110.2,'L','Ah oui ? Et qu’est-ce qui m’a pris, monsieur le peintre ?',2.6],
  [113.2,'C','La même chose qu’à moi, petit hibou.',2.4]];
function sceneG(c,t){
  portes(c,0,0);
  const Xc=520;const pc=cp(P.debout),pl=cp(P.debout);
  pc.hd=.1;pl.hd=-.25;pl.aF=[.3,.4];pc.aF=[.2,.4];
  const mains=eio(seg(t,112.6,113.2));if(mains>0){pc.aF=[lerp(.2,1.75,mains),lerp(.4,.5,mains)];pc.aB=[lerp(-.05,1.6,mains),.55]} // son visage entre ses mains tachées de bleu
  const baiser=seg(t,115.8,116.4);if(baiser>0){pc.tA=.08;pc.hd=.32;pl.hd=-.35}
  const rc=L.pantin(c,{x:Xc,F:1,p:pc,sol:SOLP},'C'),rl=champagne(c,t,{x:Xc+40,F:-1,p:pl,sol:SOLP,lift:6*baiser,levres:true},.12);
  return{C:rc.tete,L:rl.tete};
}

/* ================= la salle, la scène, Léon ================= */
function leon(c,t,o){c.save();c.translate(760,SC.haut);c.scale(.82,.82);L.leon(c,0,0,o.leve,o.saut);c.restore()}
const TETE_LEON={x:760,y:SC.haut-112*.82};
function joueOrchestre(t){return (t>29.8&&t<44.6)||(t>83.2&&t<100.8)||(t>116.4)?1:0}

const OUVERTURE=[{s:'CHAPITRE 8 · LA SOIRÉE DES LENDEMAINS',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Il n’y avait ni jury, ni tirage au sort, ni coupe.',y:380,f:"italic 44px "+L.F.texte}];
const FIN=[{s:'Si longtemps que Léon, sur la scène,',y:330,f:"italic 36px "+L.F.texte},{s:'finit par reprendre sa trompette et rejouer le morceau sans nom,',y:382,f:"italic 32px "+L.F.texte},{s:'depuis le début, rien que pour eux.',y:466,f:"42px "+L.F.main,c:L.C.or}];
const DUREE=127;
const COUPES=[[21.6,.4],[29.8,.4],[45.4,.45],[60.6,.4],[81.8,.35],[105.6,.3]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<121.5){
    c.save();c.translate(640,360);c.scale(Z,Z);c.translate(-CX,-CY);
    const silence=t>101.8&&t<102.8;
    L.salleCabaret(c,t,{});
    const joue=joueOrchestre(t);L.orchestreSix(c,t,joue);
    const leve=t>100.8&&t<101.8?1:t>104.2&&t<106?.9+.1*Math.sin(t*9):joue?.25+.15*Math.sin(t*2):.05;
    leon(c,t,{leve,saut:joue?-Math.abs(Math.sin(t*Math.PI*2))*3:t>104.2&&t<106?-Math.abs(Math.sin(t*12))*6:0});
    let tetes={};
    if(t<21.6)tetes=sceneA(c,t);else if(t<29.8)tetes=sceneB(c,t);else if(t<45.4)tetes=sceneC(c,t);else if(t<60.6)tetes=sceneD(c,t);else if(t<81.8)tetes=sceneE(c,t);else if(t<105.6)tetes=sceneF(c,t);else tetes=sceneG(c,t);
    // la salle explose : Solange pleure dans les bras de Maurice, les aviateurs lèvent leurs coupes
    if(t>103.2&&t<121.5){const a=seg(t,103.2,103.6);c.save();c.globalAlpha=a;L.maurice(c,960,SOLP,{chapeau:false,rire:1,t,main:{x:-30,y:-150}});
      const ps=cp(P.debout);ps.aF=[1.6,1];ps.hd=.4;L.pantin(c,{x:920,F:1,p:ps,s:1},'S');aviateurs(c,t,{x:200,leve:true});c.restore()}
    L.tablesCabaret(c,t);
    c.restore();
    const bravo=(t>4&&t<4.8?.4:0)+(t>70.6&&t<72.4?.8:0)+(t>102.8&&t<106?1:0);
    L.public(c,t,clamp(bravo,0,1));
    // les répliques, au-dessus des têtes
    dire(c,t,LA.concat(LD,LE,LG),{...tetes,Le:TETE_LEON});
    heure(c,'VINGT-DEUX HEURES QUARANTE',env(t,3.4,5));heure(c,'UN PEU PLUS DE VINGT-TROIS HEURES',env(t,60.8,4.6));
    titre(c,'FOX-TROT',env(t,30.2,3.6));titre(c,'CHARLESTON',env(t,34.6,3.8));titre(c,'VALSE LENTE',env(t,39,4));titre(c,'LE MORCEAU SANS NOM',env(t,84,4));
    if(t>39.6&&t<44.2)parole(c,'Un, deux, trois…',ecran(tetes.C||{x:560,y:400}).x-30,ecran(tetes.C||{x:560,y:400}).y-60,env(t,40.2,2.4));
    if(silence){c.fillStyle='rgba(0,0,0,.08)';c.fillRect(0,0,W,H)}
  }
  let n=t<3.6?1-seg(t,2.9,3.6):t>120.6?seg(t,120.6,121.4):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),500);
  L.carton(c,FIN,seg(t,121.6,122.4)*(1-seg(t,126.2,127)),560);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // la rumeur de la salle, sauf pendant le silence
  K.nappe(T+3,98,'bandpass',900,.6,[[.5,.025],[97,.025],[98,0]]);
  K.nappe(T+3,8,'lowpass',400,.6,[[.2,.03],[2.4,.008],[8,0]]); // le froid de la rue, par la porte ouverte
  // le cri de Solange, le verre renversé
  K.souffle(81,T+4.4,.5,{g:.025,cut:3000,vib:9,att:.02});K.noise(T+4.9,.2,'highpass',3000,.6,.05,.002);
  // un gramophone, à la fin de noce (on attend l'orchestre)
  const g=K.bus();K.gramophone(T+6,23);K.phrase(L.THEME.motif,T+8,.6,'piano',g,.02);K.phrase(L.THEME.reponse,T+16,.6,'piano',g,.02);
  // fox-trot, charleston, valse lente
  const o=K.bus();K.orchestre(T+30,.5,['Dm9','G13','Cmaj9','A7'],o);K.phrase(L.THEME.reponse,T+31,.5,'trompette',o,.035);
  K.orchestre(T+34.4,.36,['Dm9','G13','Cmaj9'],o,{piano:.024});K.phrase(L.THEME.motif.map(([a,m,d])=>[a,m+12,d]),T+34.6,.36,'trompette',o,.03);
  const vb=.55;for(let i=0;i<9;i++){const w=T+38.8+i*vb*3,nom=['Fmaj9','Dm9','G13','Cmaj9'][i%4];K.basse((L.THEME.basses[nom]||[41])[0],w,o,.18);K.accord(nom,w+vb,.016,o);K.accord(nom,w+2*vb,.014,o)}
  K.phrase(L.THEME.lent,T+39.4,.55,'violon',o,.025);
  o.gain.setValueAtTime(1,T+44.4);o.gain.linearRampToValueAtTime(0,T+45.4);
  // à table : le rire
  K.nappeAccord('Fmaj9',T+46,6,null,.004);K.nappeAccord('Cmaj9',T+56.6,4,null,.005);
  // Léon fait taire ses musiciens ; les applaudissements
  K.applaudissements(T+72.4,1.6);K.nappeAccord('A7b9',T+73.2,4,null,.005);
  // il compte quatre temps
  [82.4,82.9,83.4,83.9].forEach(w=>K.noise(T+w,.04,'bandpass',2400,5,.06,.002));
  // le morceau sans nom, plus lent, plus lourd : la contrebasse qui rentre à trois heures du matin, le piano en gouttes de pluie
  const sn=K.bus(),bl=.85;const gr=['Dm9','G13','Cmaj9','A7','Dm9'];
  for(let i=0;i<5;i++){const w=T+84.4+i*bl*4,nom=gr[i];
    (L.THEME.basses[nom]||[38,40,41,45]).forEach((m,k)=>K.basse(m,w+k*bl+.09,sn,.22));
    for(let k=0;k<6;k++)K.piano(L.THEME.accords[nom][k%L.THEME.accords[nom].length]+12,w+k*bl*.66+.2,.014,sn);[1,3].forEach(k=>K.charleston(w+k*bl+.1,sn,.025))}
  K.phrase(L.THEME.lent,T+85.4,.85,'trompette',sn,.04);
  K.phrase(L.THEME.reponse,T+94.6,.85,'trompette',sn,.035);
  K.trompette(81,T+99.6,2,sn,.045); // la trompette tient une note, très longtemps
  sn.gain.setValueAtTime(1,T+101.6);sn.gain.linearRampToValueAtTime(0,T+101.8);
  // une seconde, une éternité ; puis la salle explose
  K.applaudissements(T+103.2,3.4);K.cloche(93,T+103.3,null,.02);
  // « la même chose qu'à moi » ; Léon rejoue le morceau depuis le début
  K.nappeAccord('Fmaj9',T+113,4,null,.006);
  const re=K.bus();K.phrase(L.THEME.lent,T+116.4,.85,'trompette',re,.04);
  for(let i=0;i<2;i++){const w=T+116.4+i*bl*4,nom=gr[i];(L.THEME.basses[nom]||[38]).forEach((m,k)=>K.basse(m,w+k*bl+.09,re,.18))}
  re.gain.setValueAtTime(1,T+120.6);re.gain.linearRampToValueAtTime(.4,T+122);re.gain.setValueAtTime(.4,T+125.5);re.gain.linearRampToValueAtTime(0,T+126.6);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:103.4});
})();
