/* Plan 06 — L'heure des hiboux (chapitre 4, ~62 s)
   A. Rue des Teinturiers, minuit passé, givre : « Où habitez-vous ? » « Purpan. » … « Alors on marche. »
   B. La marche, bras dessus bras dessous : rue de la République (la fenêtre en demi-lune, sombre),
      avenue de Grande-Bretagne et ses platanes nus, la Cartoucherie ; le carrefour au réverbère qui grésille.
   C. Le banc près du lavoir, deux heures du matin : le mousseux au goulot. « Un petit hibou. »
   D. Purpan, l'allée de platanes, quatre heures moins dix. « Pour les hiboux, si. » La grille ne grince pas.
   E. « Il savait enfin quoi peindre. » */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL,P=L.POSES;

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.fillStyle=L.C.or;c.font="30px "+L.F.machine;L.setLS(c,'3px');c.fillText(s,1230,64);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font="27px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';
  const w=c.measureText(s).width;x=clamp(x,w/2+30,W-w/2-30);c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));
function dire(c,t,lignes,tetes){const act=[];for(const l of lignes){const a=env(t,l[0],L.lue(l))*L.coupe(t,lignes,l);if(a<=0)continue;const h=tetes[l[1]];if(h)act.push([l,a,h.x+(l[1]==='C'?-20:20),h.y-62])}act.sort((p,q)=>p[0][0]-q[0][0]);let sa=0,sy=0;for(const e of act){sa+=e[1];sy+=e[1]*e[3]}const Ya=sa?sy/sa:0;act.forEach((e,i)=>{let r=0;for(let j=i+1;j<act.length;j++)r+=Math.min(1,3*act[j][1]);parole(c,e[0][2],e[2],Math.max(46,Ya-34*r),e[1])})}
// petits nuages de souffle dans le froid
function souffles(c,t,lignes,tetes,F){
  for(const l of lignes){const age=t-l[0];if(age<0||age>1.6)continue;const h=tetes[l[1]];if(!h)continue;const f=F[l[1]]||1;
    for(let k=0;k<3;k++){const a=age-k*.18;if(a<0)continue;const u=a/1.3;if(u>1)continue;
      c.fillStyle=`rgba(225,232,240,${.22*(1-u)})`;c.beginPath();c.ellipse(h.x+f*(16+u*44+k*6),h.y+8-u*16,6+u*16,4+u*9,0,0,7);c.fill()}}
}
function bouteille(c,m,ang){if(!m)return;c.save();c.translate(m.x,m.y);c.rotate(ang||0);c.fillStyle='#16241a';c.fillRect(-5,-30,10,28);c.fillRect(-2.5,-42,5,13);c.fillStyle=L.C.or;c.fillRect(-3,-44,6,4);c.restore()}
function pave(c,y0,givre,ox){
  c.fillStyle='#14100d';c.fillRect(0,y0,W,H-y0);c.strokeStyle='rgba(255,255,255,.045)';c.lineWidth=1;
  for(let r=0;r<6;r++){const off=((r%2)*20-(ox||0))%40;for(let x=off-40;x<W+40;x+=40){c.beginPath();c.ellipse(x,y0+22+r*20,17,7,0,0,7);c.stroke()}}
  if(givre){for(let k=0;k<160;k++){const x=((k*97.3-(ox||0))%W+W)%W,y=y0+8+((k*53)%110);c.fillStyle=`rgba(230,238,250,${.08+.1*((k*7)%5)/5})`;c.fillRect(x,y,2,1.5)}}
}
function reverbere(c,x,top,on,k){k=k==null?1:k;
  c.fillStyle='#0b0706';c.fillRect(x-3,top+28,6,SOL-top-28);c.fillRect(x-12,top+18,24,14);c.beginPath();c.moveTo(x-14,top+18);c.lineTo(x,top);c.lineTo(x+14,top+18);c.fill();
  c.fillStyle=`rgba(255,226,150,${.2+.8*on})`;c.fillRect(x-9,top+20,18,10);
  if(on>0){c.save();c.globalCompositeOperation='lighter';
    const g=c.createRadialGradient(x,top+25,2,x,top+25,130);g.addColorStop(0,`rgba(255,214,130,${.6*on*k})`);g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(x,top+25,130,0,7);c.fill();
    const p=c.createRadialGradient(x,SOL,2,x,SOL,170);p.addColorStop(0,`rgba(255,214,130,${.25*on})`);p.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=p;c.beginPath();c.ellipse(x,SOL,170,28,0,0,7);c.fill();c.restore()}
}
function platane(c,x,base,h,k,sc){ // platane nu, écorce tachée
  sc=sc||1;c.save();c.translate(x,base);c.scale(sc,sc);
  c.strokeStyle='#0a0d12';c.lineCap='round';
  const br=(x0,y0,a,l,w,d)=>{if(d>5||l<7)return;const x1=x0+Math.sin(a)*l,y1=y0-Math.cos(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();br(x1,y1,a-.4-((d*k)%3)*.06,l*.72,w*.62,d+1);br(x1,y1,a+.36+((d+k)%3)*.06,l*.7,w*.62,d+1)};
  c.fillStyle='#2a2318';c.fillRect(-11,-h*.55,22,h*.55);c.fillStyle='rgba(150,140,115,.22)';c.fillRect(-7,-h*.45,9,26);c.fillRect(1,-h*.25,8,30);c.fillRect(-5,-h*.12,7,14);
  br(0,-h*.5,0,h*.32,16,0);c.restore();
}
function couple(c,x,ph,amp,o){ // bras dessus bras dessous, vers la droite
  o=o||{};const pc=L.pas(P.debout,ph,amp,0),pl=L.pas(P.debout,ph+Math.PI*.95,amp*.9,0);
  pc.aF=[.55,1.25];pc.aB=[-.08-.18*Math.sin(ph)*amp*3,.2];pc.hd=o.hdC!=null?o.hdC:-.04+.05*Math.sin(ph*.13);
  pl.aB=[-.35,-.9];pl.aF=[.12+.12*Math.sin(ph)*amp*3,.3];pl.hd=o.hdL!=null?o.hdL:-.06+.05*Math.sin(ph*.17+1);
  if(o.pointe){const u=o.pointe;pc.aB=[lerp(pc.aB[0],2.5,u),lerp(pc.aB[1],.1,u)];pc.hd=lerp(pc.hd,-.45,u);pl.hd=lerp(pl.hd,-.4,u)}
  const rl=L.pantin(c,{x:x+34,F:1,p:pl,levres:true},'L');
  const rc=L.pantin(c,{x,F:1,p:pc},'C');
  return{C:rc,L:rl};
}

/* ---------- A. rue des Teinturiers ---------- */
const LA=[[4.6,'C','Où habitez-vous ?'],[6.2,'L','Purpan.',1.1],[7.4,'C','Purpan ? Mais c’est à l’autre bout de la ville.',1.7],
  [9.2,'L','À pied. Comme une grande.',1.6],[11.4,'C','Alors on marche.',1.5]];
function sceneA(c,t){
  L.ciel(c,0,300);L.etoiles(c,t,0,0,false,120);
  c.fillStyle='#2c1712';c.fillRect(0,120,W,SOL-120);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;
  for(let y=126;y<SOL;y+=12){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=((y/12)%2)*15;x<W;x+=30){c.beginPath();c.moveTo(x,y-12);c.lineTo(x,y);c.stroke()}}
  c.save();c.translate(60,300);c.rotate(-.03);c.scale(.32,.32);L.afficheConcours(c);c.restore();
  c.fillStyle='#0b0a0a';c.fillRect(470,170,340,86);c.strokeStyle='#3a3530';c.lineWidth=4;c.strokeRect(476,176,328,74);
  c.fillStyle=L.C.or;c.font="27px "+L.F.titre;c.textAlign='center';L.setLS(c,'3px');c.fillText('CABARET DES ÉTOILES',640,224);L.setLS(c,'0px');
  [[492,190],[788,190],[500,238],[780,238],[640,190]].forEach(([x,y],i)=>L.star(c,x,y,i===4?7:6,i===4?3:2.5,L.C.or));
  c.fillStyle='#0b0a0a';c.fillRect(632,140,16,32);c.fillRect(600,138,80,6);
  const ouv=eio(seg(t,3.3,3.7))*(1-eio(seg(t,4.4,4.8)));
  c.fillStyle='#180c08';c.fillRect(560,290,160,322);c.fillStyle='rgba(255,200,120,.85)';c.fillRect(564,294,152*ouv,318);
  c.fillStyle='#8a1a14';c.fillRect(564+152*ouv*.9,294,152*(1-ouv*.9),318);
  c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(640,150,2,640,150,170);lg.addColorStop(0,'rgba(255,214,130,.55)');lg.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=lg;c.fillRect(440,0,400,330);
  if(ouv>0){const pg=c.createRadialGradient(640,612,4,640,612,360);pg.addColorStop(0,`rgba(255,190,110,${.5*ouv})`);pg.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=pg;c.fillRect(260,520,760,200)}c.restore();
  reverbere(c,1060,330,1);
  pave(c,SOL,true,0);
  // ils sortent
  const sort=seg(t,3.5,4.6),dep=seg(t,12.2,14.4);
  let xc=lerp(630,560,eio(sort))+lerp(0,820,eio(dep)),xl=lerp(650,700,eio(sort))+lerp(0,820,eio(dep));
  let pc,pl,Fl=-1;
  if(dep>0){const ph=(t-12.2)*9;const r=couple(c,xc,ph,.32);souffles(c,t,LA,{C:r.C.tete,L:r.L.tete},{C:1,L:1});bouteille(c,r.C.mainDos,.15);
    heure(c,'RUE DES TEINTURIERS · MINUIT PASSÉ',1-seg(t,12.5,13.2));dire(c,t,LA,{C:r.C.tete,L:r.L.tete});return}
  pc=sort<1?L.pas(P.debout,(t-3.5)*9,.3,0):JSON.parse(JSON.stringify(P.debout));
  pl=sort<1?L.pas(P.debout,(t-3.5)*9+3,.28,0):JSON.parse(JSON.stringify(P.debout));
  if(sort<.6){Fl=1}
  // il s'arrête net à « Purpan »
  const net=seg(t,6.2,6.5);pc.hd=lerp(0,.12,net)*(1-seg(t,7.3,7.6));
  // il regarde le ciel, remonte son col, offre son bras
  const ciel=seg(t,10.1,10.5)*(1-seg(t,10.8,11.1));pc.hd-= .55*eio(ciel);
  const col=Math.sin(Math.PI*seg(t,10.9,11.5));if(col>0){pc.aF=[lerp(.12,2.4,col),lerp(.15,2.5,col)];pc.aB=[lerp(-.08,2.3,col),lerp(.12,2.6,col)]}
  const bras=seg(t,11.5,11.9);if(bras>0){pc.aF=[lerp(pc.aF[0],.55,bras),lerp(pc.aF[1],1.25,bras)];pc.tA=.06*bras}
  pl.aF=[.2,.25];pl.hd=-.08;if(t>9.2&&t<10.6)pl.hd=-.18;
  const rc=L.pantin(c,{x:xc,F:1,p:pc},'C');
  const rl=L.pantin(c,{x:xl,F:Fl,p:pl,levres:true},'L');
  bouteille(c,rc.mainDos,.15);
  souffles(c,t,LA,{C:rc.tete,L:rl.tete},{C:1,L:Fl});
  heure(c,'RUE DES TEINTURIERS · MINUIT PASSÉ',seg(t,3.6,4.3));
  dire(c,t,LA,{C:rc.tete,L:rl.tete});
}

/* ---------- B1. rue de la République : la fenêtre en demi-lune ---------- */
function sceneB1(c,t){
  const u=t-14.4;
  L.ciel(c,0,330);L.etoiles(c,t,0,0,false,140);
  // rangée d'immeubles de brique, la boulangerie au milieu
  const ox=u*22;
  const IMM=[{x:-60,w:300,h:330},{x:250,w:330,h:420,fabre:true},{x:590,w:280,h:360},{x:880,w:320,h:390},{x:1210,w:300,h:340}];
  for(const m of IMM){const x=m.x-ox,top=SOL-m.h;
    c.fillStyle=m.fabre?'#3d1f18':'#2a1612';c.fillRect(x,top,m.w,m.h);
    c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1;for(let y=top+8;y<SOL;y+=8){c.beginPath();c.moveTo(x,y);c.lineTo(x+m.w,y);c.stroke()}
    c.fillStyle='#121821';c.beginPath();c.moveTo(x-8,top);c.lineTo(x+30,top-90);c.lineTo(x+m.w-30,top-90);c.lineTo(x+m.w+8,top);c.closePath();c.fill();
    for(let r=0;r<2;r++)for(let k=0;k<3;k++){c.fillStyle='#0d0a09';c.fillRect(x+40+k*(m.w-110)/2,top+40+r*92,44,60)}
    if(m.fabre){
      // la fenêtre en demi-lune du grenier, sombre
      const cx=x+m.w/2,cy=top-14;c.fillStyle='#0b0d12';c.beginPath();c.arc(cx,cy,46,Math.PI,0);c.closePath();c.fill();
      c.strokeStyle='#3a2a1a';c.lineWidth=4;c.beginPath();c.arc(cx,cy,46,Math.PI,0);c.closePath();c.stroke();
      c.lineWidth=2;for(let k=1;k<4;k++){const a=Math.PI+k*Math.PI/4;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+46*Math.cos(a),cy+46*Math.sin(a));c.stroke()}
      c.fillStyle='#120c09';c.fillRect(x+10,SOL-118,m.w-20,118);c.fillStyle='#1d140f';c.fillRect(x+10,SOL-118,m.w-20,24);
      c.fillStyle=L.C.or;c.font="15px "+L.F.titre;c.textAlign='center';L.setLS(c,'4px');c.fillText('BOULANGERIE · FABRE',x+m.w/2,SOL-101);L.setLS(c,'0px');
      c.fillStyle='#0a0706';c.fillRect(x+28,SOL-84,170,74);c.fillRect(x+220,SOL-84,80,84);
    }}
  reverbere(c,1000-ox,330,1);
  pave(c,SOL,true,ox);
  // ils arrivent par la gauche, s'arrêtent presque avant la boulangerie (l'enseigne reste lisible), il montre la fenêtre, puis ils repartent devant la vitrine
  const s1=seg(t,14.4,16.6),s2=seg(t,16.6,19.2),s3=seg(t,19.2,20.2);
  const x=s3>0?lerp(150,330,s3):s2>0?lerp(118,150,s2):lerp(-90,118,eoc(s1));
  const ph=s2>0&&s3<=0?(16.6-14.4)*9+(t-16.6)*3:(t-14.4)*9,amp=s2>0&&s3<=0?.12:.32;
  const pt=Math.sin(Math.PI*seg(t,16.6,19.2));
  const r=couple(c,x,ph,amp,{pointe:clamp(pt*1.6,0,1)});
  bouteille(c,r.C.main,.1);
  heure(c,'RUE DE LA RÉPUBLIQUE',env(t,14.6,5.4));
}

/* ---------- B2. avenue de Grande-Bretagne, la Cartoucherie ---------- */
const LB2=[[21.6,'C','Je crois que je cherche un visage.',1.8],[23.5,'L','Quel visage ?',1.2],[24.9,'C','Si je le savais, je l’aurais déjà peint.',1.9]];
function sceneB2(c,t){
  const xw=500+(t-20.2)*95,ox=xw-500;
  L.ciel(c,0,520);L.etoiles(c,t,0,0,false,420);
  // la Cartoucherie : longs bâtiments de brique à sheds, derrière leurs grilles
  const cx=900-ox*.55;
  c.fillStyle='#24120e';c.fillRect(cx,400,900,160);
  c.fillStyle='#161012';for(let k=0;k<9;k++){c.beginPath();c.moveTo(cx+k*100,400);c.lineTo(cx+k*100+70,352);c.lineTo(cx+k*100+100,400);c.closePath();c.fill()}
  c.fillStyle='#0d0a09';for(let k=0;k<9;k++){c.fillRect(cx+20+k*100,440,30,52);c.fillRect(cx+60+k*100,440,22,52)}
  c.fillStyle='#1a0e0a';c.fillRect(cx+380,270,34,130);c.fillStyle='#2a1612';c.fillRect(cx+374,266,46,8);
  c.fillStyle='rgba(200,170,120,.35)';c.font="16px "+L.F.titre;c.textAlign='center';L.setLS(c,'5px');c.fillText('CARTOUCHERIE',cx+450,428);L.setLS(c,'0px');
  c.strokeStyle='#0b0706';c.lineWidth=2.5;for(let x=cx-40;x<cx+940;x+=14){c.beginPath();c.moveTo(x,560);c.lineTo(x,486);c.stroke()}
  c.lineWidth=3;c.beginPath();c.moveTo(cx-40,500);c.lineTo(cx+940,500);c.stroke();
  // trottoir et chaussée
  c.fillStyle='#1b1511';c.fillRect(0,560,W,52);
  pave(c,SOL,true,ox);
  // platanes nus, en rangée, tous les 300 px
  for(let k=-1;k<9;k++){const x=k*300+160-ox;if(x<-260||x>W+260)continue;platane(c,x,SOL,420,k+3,1)}
  for(let k=0;k<5;k++){const x=k*700+500-ox;if(x<-200||x>W+200)continue;reverbere(c,x,360,1,.55)}
  const r=couple(c,500,(t-20.2)*9,.32);
  bouteille(c,r.C.main,.1);
  souffles(c,t,LB2,{C:r.C.tete,L:r.L.tete},{C:1,L:1});
  heure(c,'AVENUE DE GRANDE-BRETAGNE · 1 H',env(t,20.4,6.6));
  dire(c,t,LB2,{C:r.C.tete,L:r.L.tete});
}

/* ---------- B3. le carrefour, le réverbère qui grésille ---------- */
const LB3=[[29.8,'C','De quoi souffre-t-elle, mademoiselle Sarrail ?',2],[32.6,'L','D’étouffement, je crois.',2]];
function sceneB3(c,t){
  L.ciel(c,0,520);L.etoiles(c,t,0,0,false,420);
  // maisons basses aux volets clos, mur de cimetière, cyprès
  c.fillStyle='#1b100d';[[40,170],[260,150],[880,160],[1090,180]].forEach(([x,w])=>{c.fillRect(x,440,w,172);c.fillStyle='#10151f';c.beginPath();c.moveTo(x-6,440);c.lineTo(x+w/2,404);c.lineTo(x+w+6,440);c.fill();c.fillStyle='#2a1a10';c.fillRect(x+30,480,26,44);c.fillRect(x+w-56,480,26,44);c.fillStyle='#1b100d'});
  c.fillStyle='#262019';c.fillRect(440,500,400,112);c.fillStyle='#3a3026';c.fillRect(436,494,408,8);
  c.fillStyle='#08100c';[[500,500,120],[620,500,150],[760,500,110]].forEach(([x,y,h])=>{c.beginPath();c.ellipse(x,y-h/2,18,h/2,0,0,7);c.fill()});
  const n=Math.floor(t*14),on=(t>28&&((n*7)%11<2||(n*13)%17===0))?.25:1;
  reverbere(c,600,170,on);
  pave(c,SOL,true,0);
  const arr=seg(t,27.2,29.3);
  if(arr<1){const r=couple(c,lerp(380,560,eio(arr)),(t-27.2)*9*(1-arr*.6),.32*(1-arr));bouteille(c,r.C.main,.1);dire(c,t,LB3,{C:r.C.tete,L:r.L.tete});heure(c,'UN CARREFOUR',env(t,27.4,8));return}
  const pc=JSON.parse(JSON.stringify(P.debout)),pl=JSON.parse(JSON.stringify(P.debout));
  pl.hd=-.05+.25*seg(t,30.9,31.6)*(1-seg(t,32.3,32.7));pl.aF=[.25,.4];pc.hd=-.05;
  const rc=L.pantin(c,{x:560,F:1,p:pc},'C');
  const rl=L.pantin(c,{x:640,F:-1,p:pl,levres:true},'L');
  bouteille(c,rc.mainDos,.1);
  souffles(c,t,LB3,{C:rc.tete,L:rl.tete},{C:1,L:-1});
  heure(c,'UN CARREFOUR',env(t,27.4,8));
  dire(c,t,LB3,{C:rc.tete,L:rl.tete});
}

/* ---------- C. le banc près du lavoir, deux heures du matin ---------- */
const LC=[[39,'L','Ma nourrice disait que j’étais une chouette.',2],[41.2,'C','Pas une chouette. Un hibou.',1.7],[43,'C','Un petit hibou.',1.6],[44.9,'L','Petit hibou…',1.5]];
function sceneC(c,t){
  L.ciel(c,0,520);L.etoiles(c,t,0,0,false,420);
  // le lavoir : toit de tuiles sur poteaux, bassin
  c.fillStyle='#1a1210';c.fillRect(700,470,460,142);
  c.fillStyle='#131820';c.beginPath();c.moveTo(670,392);c.lineTo(1190,392);c.lineTo(1150,350);c.lineTo(710,350);c.closePath();c.fill();
  c.fillStyle='#0b0706';[715,860,1005,1145].forEach(x=>c.fillRect(x-6,392,12,140));
  c.fillStyle='#24303c';c.fillRect(720,532,430,30);c.fillStyle='rgba(200,215,235,.18)';for(let k=0;k<6;k++)c.fillRect(740+k*70+(Math.sin(t*1.3+k)*8),544,30,2);
  c.fillStyle='#3a3026';c.fillRect(712,524,446,10);
  platane(c,230,SOL,430,4,1);
  pave(c,SOL,true,0);
  // le banc de pierre
  c.fillStyle='#3a3229';c.fillRect(330,548,300,16);c.fillStyle='#2a241d';c.fillRect(350,564,24,48);c.fillRect(586,564,24,48);
  // assis
  const pc=JSON.parse(JSON.stringify(P.assis)),pl=JSON.parse(JSON.stringify(P.assis));
  // il boit, passe, elle boit
  const bC=Math.sin(Math.PI*seg(t,36.3,37.4)),bL=Math.sin(Math.PI*seg(t,37.9,38.9));
  pc.aF=[lerp(.9,1.75,bC),lerp(1.1,2.1,bC)];pc.hd=-.05-.35*bC;
  pl.aF=[lerp(.7,1.75,bL),lerp(.9,2.1,bL)];pl.hd=-.08-.35*bL;
  const tend=seg(t,37.4,37.9);
  // le rire de Louise
  const rire=seg(t,45.6,46.1)*(1-seg(t,47.4,47.9));if(rire>0){pl.hd=.05+.22*rire+.06*Math.sin(t*26)*rire;pl.tA=-.08+.12*rire}
  // il la regarde
  if(t>40.8)pc.hd=-.02;
  const rc=L.pantin(c,{x:440,F:1,p:pc,hipY:540},'C');
  const rl=L.pantin(c,{x:540,F:-1,p:pl,hipY:540,levres:true},'L');
  if(t<37.65)bouteille(c,rc.main,lerp(.6,-2.5,bC)*(bC>0?1:0)+(bC>0?0:.2));
  else if(t<38.1)bouteille(c,{x:lerp(rc.main.x,rl.main.x,tend),y:lerp(rc.main.y,rl.main.y,tend)},.2);
  else bouteille(c,rl.main,bL>0?lerp(-.6,2.5,bL):-.2);
  souffles(c,t,LC,{C:rc.tete,L:rl.tete},{C:1,L:-1});
  heure(c,'PRÈS D’UN LAVOIR · 2 H DU MATIN',env(t,35.7,13));
  dire(c,t,LC,{C:rc.tete,L:rl.tete});
}

/* ---------- D. Purpan, l'allée de platanes, quatre heures moins dix ---------- */
const KM=.6,HS=520,HX=640-390*KM,HY=HS-640*KM; // la maison du plan coté, au bout d'une courte allée
const GX0=575,GW=130,GTOP=402,GBAS=600; // la grille de fer forgé peinte en vert
function grille(c,ouv){
  c.save();c.strokeStyle='#1f3a2c';c.fillStyle='#1f3a2c';c.lineWidth=3;
  for(let x=4;x<W;x+=14){if(x>GX0-8&&x<GX0+GW+8)continue;c.beginPath();c.moveTo(x,GBAS);c.lineTo(x,GTOP+10);c.stroke();c.beginPath();c.moveTo(x-4,GTOP+12);c.lineTo(x,GTOP-4);c.lineTo(x+4,GTOP+12);c.fill()}
  c.lineWidth=4;[[0,GX0-8],[GX0+GW+8,W]].forEach(([a,b])=>[GTOP+34,GBAS-30].forEach(y=>{c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.stroke()}));
  c.strokeStyle='rgba(150,200,160,.18)';c.lineWidth=1;for(let x=5;x<W;x+=14){if(x>GX0-8&&x<GX0+GW+8)continue;c.beginPath();c.moveTo(x,GBAS);c.lineTo(x,GTOP+12);c.stroke()}
  // piliers de pierre
  [[GX0-22],[GX0+GW+6]].forEach(([x])=>{c.fillStyle='#4a4238';c.fillRect(x,GTOP-24,18,GBAS-GTOP+24);c.fillStyle='#5a5246';c.fillRect(x-4,GTOP-30,26,8)});
  // le vantail, qui s'ouvre vers le jardin (ne grince pas)
  c.translate(GX0+2,0);c.scale(1-.85*ouv,1);c.strokeStyle='#1f3a2c';c.fillStyle='#1f3a2c';c.lineWidth=3;
  for(let x=6;x<GW-4;x+=12){c.beginPath();c.moveTo(x,GBAS);c.lineTo(x,GTOP+18);c.stroke();c.beginPath();c.moveTo(x-4,GTOP+20);c.lineTo(x,GTOP+4);c.lineTo(x+4,GTOP+20);c.fill()}
  c.lineWidth=4;[GTOP+34,GBAS-30].forEach(y=>{c.beginPath();c.moveTo(0,y);c.lineTo(GW-4,y);c.stroke()});c.beginPath();c.arc(GW/2-2,(GTOP+GBAS)/2+8,18,0,7);c.stroke();
  c.restore();
}
function lanterne(c,x,y){
  c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,1,x,y,46);g.addColorStop(0,'rgba(235,225,200,.42)');g.addColorStop(1,'rgba(235,225,200,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,46,0,7);c.fill();c.restore();
  c.fillStyle='#0b0706';c.fillRect(x-1,y-16,2,8);c.beginPath();c.moveTo(x-7,y-8);c.lineTo(x+7,y-8);c.lineTo(x+5,y+6);c.lineTo(x-5,y+6);c.closePath();c.fill();
  c.fillStyle='rgba(250,232,190,.9)';c.fillRect(x-4,y-5,8,9);
}
function perron(c){ // six marches de pierre devant la porte
  const px=HX+390*KM;
  for(let k=0;k<6;k++){const y=HS+k*6,w=56+k*12;c.fillStyle=k%2?'#463e34':'#4c443a';c.fillRect(px-w/2,y,w,6);c.fillStyle='rgba(235,225,200,.12)';c.fillRect(px-w/2,y,w,1)}
}
const LD=[[52.3,'C','Maurice organise une soirée demain.',1.8],[54.2,'L','Demain, c’est ce soir.',1.5],[55.8,'L','Je ne sais pas si je pourrai.',1.6],
  [57.6,'L','Mais j’essaierai.',1.4],[59.5,'C','Bonne nuit, petit hibou.',1.6],[61.3,'L','Il est quatre heures du matin, monsieur le peintre.',2.1],
  [63.5,'L','Ce n’est plus la nuit.',1.5],[65.3,'C','Pour les hiboux, si.',1.7]];
function sceneD(c,t){
  L.ciel(c,0,540);L.etoiles(c,t,0,0,false,300);
  // le jardin, givré
  c.fillStyle='#0d1712';c.fillRect(0,HS-4,W,GBAS-HS+4);
  // la maison noire ; seule une lanterne au-dessus du perron ; la fenêtre de sa chambre entrouverte. Glycine d'hiver.
  c.save();c.translate(HX,HY);c.scale(KM,KM);L.maisonSarrail(c,{lumLouise:0,ouvre:.25,grappes:false});c.restore();
  perron(c);lanterne(c,HX+390*KM,HY+438*KM);
  // l'allée, du perron à la grille
  c.fillStyle='#29251e';c.beginPath();c.moveTo(HX+390*KM-46,HS+36);c.lineTo(HX+390*KM+46,HS+36);c.lineTo(GX0+GW,GBAS);c.lineTo(GX0,GBAS);c.closePath();c.fill();
  for(let k=0;k<70;k++){const x=((k*131.7)%W),y=HS+4+((k*37)%(GBAS-HS-6));c.fillStyle='rgba(225,235,245,.09)';c.fillRect(x,y,2,1.5)}
  // l'allée de platanes, qui commence à la grille
  [[.78,570,215],[1.04,604,262]].forEach(([s,y,o],i)=>{platane(c,640-o,y,330,i+1,s);platane(c,640+o,y,330,i+6,s)});
  // Louise : arrivée, face à face, puis la grille, le jardin en courant sur la pointe des pieds, le coin de la maison
  const arr=seg(t,49.5,51.8),f1=seg(t,67.4,68.1),f2=seg(t,68.1,70);
  const ouv=eio(seg(t,67.5,67.9))*(1-eio(seg(t,68.8,69.2)));
  let rc,rl=null,dedans=null;
  const CX=470;
  // Louise dans le jardin (derrière la grille)
  if(f2>0&&t<72.6){
    const coin=HX+(S.facade.x+S.facade.w)*KM+14,u=eio(f2);
    let x=lerp(GX0+GW/2,coin,u);const sol=lerp(GBAS+4,HS+2,u),s=lerp(.92,.6,u);
    const dis=seg(t,72.1,72.5);x+=dis*30;
    const pl=f2<1?L.pas(P.debout,(t-68.1)*13,.26,0):JSON.parse(JSON.stringify(P.debout));
    const tour=seg(t,70.1,70.5),F=lerp(1,-1,eio(tour));
    const lv=seg(t,71.3,71.7)*(1-seg(t,72.2,72.5));if(lv>0)pl.aF=[lerp(.12,2.6,lv),lerp(.15,.2,lv)];
    c.save();c.globalAlpha=1-dis;dedans=L.pantin(c,{x,F:Math.abs(F)<.02?.02:F,p:pl,s,sol,levres:true},'L');c.restore();
  }
  pave(c,GBAS,true,0);
  grille(c,ouv);
  if(arr<1){const r=couple(c,lerp(200,CX,eio(arr)),(t-49.5)*9*(1-arr*.5),.32*(1-arr));rc=r.C;rl=r.L}
  else{
    const pc=JSON.parse(JSON.stringify(P.debout));pc.hd=-.06;
    // les mains dans les poches, immobile ; il lève la main le premier
    if(t>67)pc.aF=[.15,.6],pc.aB=[-.05,.6];
    if(t>68.2)pc.hd=-.16;
    const leve=seg(t,70.8,71.2)*(1-seg(t,72.5,72.9));if(leve>0)pc.aF=[lerp(.15,2.5,leve),lerp(.6,.3,leve)];
    rc=L.pantin(c,{x:CX,F:1,p:pc},'C');
    if(f2<=0){
      const ap=seg(t,51.8,52.4);let pl,x,F;
      if(f1>0){x=lerp(CX+90,GX0+GW/2,eio(f1));pl=L.pas(P.debout,(t-67.4)*13,.26,0);F=1}
      else{x=lerp(CX+34,CX+90,eio(ap));pl=ap<1?L.pas(P.debout,(t-51.8)*10,.2,0):JSON.parse(JSON.stringify(P.debout));pl.aF=[.2,.3];pl.hd=-.08;F=lerp(1,-1,eio(seg(t,52,52.4)))}
      rl=L.pantin(c,{x,F:Math.abs(F)<.02?.02:F,p:pl,levres:true},'L');
    }
  }
  if(rc&&rl){const FL=t<52.2||t>67.4?1:-1;souffles(c,t,LD,{C:rc.tete,L:rl.tete},{C:1,L:FL});
    // leurs souffles se mêlent entre eux, même sans parler
    if(arr>=1&&t>52.4&&t<67){const m={x:(rc.tete.x+rl.tete.x)/2,y:rc.tete.y+10};const a=.12+.06*Math.sin(t*2.2);c.fillStyle=`rgba(225,232,240,${a})`;c.beginPath();c.ellipse(m.x,m.y,14+6*Math.sin(t*1.7),7,0,0,7);c.fill()}
    dire(c,t,LD,{C:rc.tete,L:rl.tete})}
  heure(c,'PURPAN · QUATRE HEURES MOINS DIX',env(t,49.6,6));
}

const OUVERTURE=[{s:'CHAPITRE 4 · L’HEURE DES HIBOUX',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Il n’y a plus de tramway à cette heure-ci.',y:380,f:"italic 46px "+L.F.texte}];
const FIN=[{s:'Il ne se coucha pas. Il alla droit au chevalet,',y:330,f:"italic 38px "+L.F.texte},{s:'où la toile vierge l’attendait depuis dix jours.',y:384,f:"italic 38px "+L.F.texte},{s:'Il savait enfin quoi peindre.',y:470,f:"46px "+L.F.main,c:L.C.or}];
const DUREE=79;
// fondus au noir entre les tableaux
const COUPES=[[14.4,.35],[20.2,.35],[27.2,.35],[35.4,.45],[49.4,.45]];
function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<73.6){
    if(t<14.4)sceneA(c,t);else if(t<20.2)sceneB1(c,t);else if(t<27.2)sceneB2(c,t);else if(t<35.4)sceneB3(c,t);else if(t<49.4)sceneC(c,t);else sceneD(c,t);
  }
  let n=t<3?1:t<4?1-(t-3):t>72.8?Math.min(1,(t-72.8)/.8):0;
  for(const[k,d]of COUPES){const a=1-Math.abs(t-k)/d;if(a>n)n=a}
  L.noir(c,n);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,seg(t,74,74.8)*(1-seg(t,78,78.8)),560);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,DUREE);
  // A : la porte du cabaret, l'orchestre qui s'échappe puis se ferme, le froid
  K.nappe(T+2.9,11.5,'bandpass',260,.6,[[0,.02],[.4,.07],[1.6,.012],[11.2,.012],[11.5,0]]);
  K.nappe(T+2.9,70,'lowpass',380,.5,[[1,.022],[69,.018],[70,0]]);
  // pas dans la nuit
  const pas=(a,b,cad,g)=>{for(let t=a;t<b;t+=cad){K.noise(T+t,.05,'bandpass',1200,1.4,g,.003);K.noise(T+t+cad*.47,.05,'bandpass',1700,1.4,g*.7,.003)}};
  pas(3.5,4.6,.62,.05);pas(12.2,14.4,.62,.05);pas(14.4,20.2,.62,.05);pas(20.2,27.2,.62,.05);pas(27.2,29.3,.7,.045);pas(49.5,51.8,.68,.045);pas(67.5,70.2,.34,.025);
  // le thème, lentement, au piano, pendant la marche
  const p=K.bus();
  K.phrase(L.THEME.lent,T+13.2,.9,'piano',p,.045);
  [[13.2,'Dm9'],[17.8,'G13'],[22.4,'Cmaj9'],[27,'Fmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,4.8,p,.007));
  [[13.2,38],[17.8,43],[22.4,36],[27,41]].forEach(([w,n])=>K.basse(n,T+w,p,.13));
  // le réverbère qui grésille
  for(let t=28;t<35;t+=.07){const n=Math.floor(t*14);if((n*7)%11<2||(n*13)%17===0)K.noise(T+t,.06,'highpass',3000,.8,.02,.002)}
  // C : le bouchon déjà sauté ; deux gorgées ; le rire de Louise, jaune de Naples
  K.noise(T+36.4,.3,'bandpass',600,3,.02,.05);K.noise(T+38,.3,'bandpass',650,3,.02,.05);
  K.phrase(L.THEME.reponse,T+39.5,.95,'piano',p,.04);
  [[39.5,'Am9'],[43.3,'Dm9']].forEach(([w,n])=>K.nappeAccord(n,T+w,4,p,.006));
  [79,83,86,91,88,95].forEach((m,i)=>K.cloche(m,T+45.7+i*.13,null,.02));
  // D : Purpan
  K.phrase(L.THEME.lent,T+51,1.05,'piano',p,.04);
  [[51,'Dm9'],[56.4,'G13'],[61.8,'Cmaj9'],[67.2,'Fmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,5.4,p,.007));
  [[51,38],[56.4,43],[61.8,36],[67.2,41]].forEach(([w,n])=>K.basse(n,T+w,p,.12));
  // les mains levées, puis la fin
  K.cloche(91,T+71.2,null,.03);K.cloche(86,T+71.6,null,.025);
  K.nappeAccord('Fmaj9',T+74,4.6,p,.01);K.phrase([[0,79,2],[2,84,4]],T+74.3,.9,'piano',p,.035);
  K.finale(T,DUREE);
}

L.film({duree:DUREE,rendu,partition,affiche:43});
})();
