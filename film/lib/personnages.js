/* La Dernière Danse — personnages communs
   Pantins articulés en silhouette (Célestin, Louise), la Mini, Léon, Chopin.
   Angles en radians : 0 = vers le bas, positif = vers l'avant du personnage. */
(function(){
const L=window.LDD=window.LDD||{};
const lerp=(a,b,t)=>a+(b-a)*t;
L.SOL=612;

L.POSES={
  debout:{tA:0,hd:0,aF:[.12,.15],aB:[-.08,.12],lF:[.06,0],lB:[-.06,0]},
  timide:{tA:.08,hd:.42,aF:[.35,.9],aB:[.3,.8],lF:[.04,0],lB:[-.02,0]},
  invite:{tA:.22,hd:-.05,aF:[1.35,.12],aB:[-.25,.3],lF:[.18,0],lB:[-.12,0]},
  tenue:{tA:.06,hd:-.08,aF:[1.15,.55],aB:[1.0,1.0],lF:[.1,0],lB:[-.1,0]},
  bras_leve:{tA:.02,hd:-.25,aF:[2.75,.1],aB:[-.5,.6],lF:[.08,0],lB:[-.08,0]},
  promenade:{tA:.05,hd:-.1,aF:[1.0,.4],aB:[-.6,.4],lF:[.1,0],lB:[-.1,0]},
  renverse_C:{tA:.42,hd:.2,aF:[1.45,.2],aB:[1.6,.5],lF:[.42,-.12],lB:[-.38,.04]},
  renverse_L:{tA:-1.05,hd:-.55,aF:[1.9,-.2],aB:[-2.3,-.3],lF:[1.05,-.2],lB:[-.1,.05]},
  assis:{tA:-.08,hd:0,aF:[.7,.9],aB:[.6,1.0],lF:[1.5,-1.45],lB:[1.4,-1.35]},
  assis_volant:{tA:-.05,hd:0,aF:[1.0,.75],aB:[.9,.85],lF:[1.5,-1.45],lB:[1.4,-1.35]},
  peint:{tA:.04,hd:-.05,aF:[1.9,.5],aB:[.5,.9],lF:[.12,0],lB:[-.12,0]},
  lit:{tA:.12,hd:.35,aF:[.9,1.2],aB:[.8,1.3],lF:[1.5,-1.45],lB:[1.4,-1.35]}
};
L.melange=function(p,q,u){const r={};for(const k in p){r[k]=Array.isArray(p[k])?p[k].map((v,i)=>lerp(v,q[k][i],u)):lerp(p[k],q[k],u)}return r};
L.pas=function(p,ph,amp,coup){const q=JSON.parse(JSON.stringify(p));const s=Math.sin(ph);
  q.lF=[q.lF[0]+amp*s,-.45*Math.max(0,Math.sin(ph+1.6))];q.lB=[q.lB[0]-amp*s,-.45*Math.max(0,-Math.sin(ph+1.6))];
  if(coup>0){q.lF=[lerp(q.lF[0],.95,coup),lerp(q.lF[1],.35,coup)]}return q};

const pt=(j,a,len,F)=>({x:j.x+F*Math.sin(a)*len,y:j.y+Math.cos(a)*len});
function limb(c,a,b,w){c.lineWidth=w;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}

/* st = {x, F (sens : 1 droite, -1 gauche, entre les deux = de face en pirouette), p (pose),
         lift, s (échelle), hipY (hanche imposée, sinon pieds au sol), sol}
   kind = 'C' (Célestin) ou 'L' (Louise). Renvoie la position de la tête. */
L.pantin=function(c,st,kind,flare){
  flare=flare||0;const isC=kind==='C',sc=isC?1:.93,F=st.F,aF=Math.abs(F),p=st.p,s=st.s||1,INK=L.C.ombre;
  const T=(isC?74:66)*sc,th=(isC?52:47)*sc,sh=(isC?52:47)*sc,ua=(isC?37:32)*sc,la=(isC?35:30)*sc;
  const hip={x:0,y:0};
  const kF=pt(hip,p.lF[0],th,F),fF=pt(kF,p.lF[0]+p.lF[1],sh,F),kB=pt(hip,p.lB[0],th,F),fB=pt(kB,p.lB[0]+p.lB[1],sh,F);
  const hipY=st.hipY!=null?st.hipY:(st.sol||L.SOL)-s*Math.max(fF.y,fB.y)-(st.lift||0);
  const S={x:F*Math.sin(p.tA)*T,y:-Math.cos(p.tA)*T};
  const ha=p.tA+p.hd,Hc={x:S.x+F*Math.sin(ha)*17*sc,y:S.y-Math.cos(ha)*17*sc};
  const eF=pt(S,p.aF[0],ua,F),hF=pt(eF,p.aF[0]+p.aF[1],la,F),eB=pt(S,p.aB[0],ua,F),hB=pt(eB,p.aB[0]+p.aB[1],la,F);
  c.save();c.translate(st.x,hipY);c.scale(s,s);
  c.strokeStyle=INK;c.fillStyle=INK;c.lineCap='round';c.lineJoin='round';
  const legW=isC?13:7.5,armW=isC?10:7;
  const shoe=f=>{c.beginPath();c.ellipse(f.x+F*5,f.y,isC?11:8,isC?4.5:3.5,0,0,7);c.fill()};
  c.globalAlpha=.92;limb(c,hip,kB,legW);limb(c,kB,fB,legW-1);shoe(fB);limb(c,S,eB,armW);limb(c,eB,hB,armW-1);c.globalAlpha=1;
  const ax=S.x,ay=S.y,al=Math.hypot(ax,ay),nx=-ay/al,ny=ax/al;
  const shW=lerp(isC?18:13,isC?11:9,aF),hpW=lerp(isC?15:12,isC?10:9,aF);
  c.beginPath();c.moveTo(nx*hpW,ny*hpW);c.lineTo(S.x+nx*shW,S.y+ny*shW);c.lineTo(S.x-nx*shW,S.y-ny*shW);c.lineTo(-nx*hpW,-ny*hpW);c.closePath();c.fill();
  limb(c,hip,kF,legW);limb(c,kF,fF,legW-1);shoe(fF);
  if(!isC){
    const top={x:ax*.3,y:ay*.3},hemY=42-flare*12,hw=22+flare*36;
    c.beginPath();c.moveTo(top.x-12,top.y);c.lineTo(top.x+12,top.y);
    c.quadraticCurveTo(hw*.7,20,hw,hemY);c.quadraticCurveTo(0,hemY+8-flare*6,-hw,hemY);c.quadraticCurveTo(-hw*.7,20,top.x-12,top.y);c.fill();
    c.lineWidth=1.6;
    for(let i=-6;i<=6;i++){const fx=i/6*hw,fy=hemY+(1-Math.abs(i/6))*(6-flare*4);c.beginPath();c.moveTo(fx,fy-1);c.lineTo(fx+i*flare*1.6,fy+9-flare*3);c.stroke()}
    c.fillStyle=L.C.rouge;c.fillRect(-13,-4,26,4.5);c.fillStyle=INK;
  }
  limb(c,S,eF,armW);limb(c,eF,hF,armW-1);c.beginPath();c.arc(hF.x,hF.y,isC?5:4,0,7);c.fill();c.beginPath();c.arc(hB.x,hB.y,isC?5:4,0,7);c.fill();
  c.lineWidth=isC?11:8;c.beginPath();c.moveTo(S.x,S.y);c.lineTo(Hc.x,Hc.y+6);c.stroke();
  c.save();c.translate(Hc.x,Hc.y);c.rotate(F*ha);
  if(isC){
    c.beginPath();c.arc(0,0,13,0,7);c.fill();
    c.beginPath();[[-13,-4],[-11,-17],[-5,-12],[0,-21],[5,-13],[11,-18],[13,-4]].forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
    if(aF>.3){c.strokeStyle=L.C.papier;c.lineWidth=1.6;c.beginPath();c.arc(F*7,1,4.4,0,7);c.stroke()}
  }else{
    c.beginPath();c.arc(0,0,11.5,0,7);c.fill();
    c.beginPath();c.ellipse(-F*1.5,-2,13.5,12.5,0,Math.PI,0);c.fill();c.fillRect(-13.5,-3,27,8);
    c.fillRect(F>=0?-13.5:4.5,-3,9,15);
    if(aF>.3){c.fillStyle=L.C.papier;c.beginPath();c.arc(F*6,1,2.9,0,7);c.fill();c.fillStyle=INK;c.beginPath();c.arc(F*6.9,1,1.4,0,7);c.fill()}
  }
  c.restore();c.restore();
  return{tete:{x:st.x+s*Hc.x,y:hipY+s*Hc.y},main:{x:st.x+s*hF.x,y:hipY+s*hF.y},hanche:{x:st.x,y:hipY}};
};

/* La Mini (Citroën Type C jaune), tournée vers la droite.
   o = {roue (angle), louise:{look, lean}, celestin:{look, lean}, vide:true} ; renvoie les têtes. */
function roue(c,cx,cy,ang){
  c.fillStyle='#0d0b09';c.beginPath();c.arc(cx,cy,24,0,7);c.fill();
  c.strokeStyle='#2a2420';c.lineWidth=4;c.beginPath();c.arc(cx,cy,22,0,7);c.stroke();
  c.strokeStyle='rgba(201,161,58,.85)';c.lineWidth=2;
  for(let i=0;i<10;i++){const a=ang+i*Math.PI/5;c.beginPath();c.moveTo(cx+Math.cos(a)*5,cy+Math.sin(a)*5);c.lineTo(cx+Math.cos(a)*19,cy+Math.sin(a)*19);c.stroke()}
  c.fillStyle=L.C.or;c.beginPath();c.arc(cx,cy,5,0,7);c.fill();
}
L.mini=function(c,x,gy,o){
  o=o||{};const ink=L.C.ombre,tetes={};
  if(!o.vide){
    const lo=o.louise||{},ce=o.celestin||{};
    const pl=L.melange(L.POSES.assis,L.POSES.assis,0);pl.hd=.05-.5*(lo.look||0);
    const pc=L.melange(L.POSES.assis_volant,L.POSES.assis_volant,0);pc.hd=-.5*(ce.look||0);
    tetes.louise=L.pantin(c,{x:x+56+(lo.lean||0)*5,F:1,p:pl,s:.76,hipY:gy-38},'L').tete;
    tetes.celestin=L.pantin(c,{x:x+84-(ce.lean||0)*4,F:1,p:pc,s:.76,hipY:gy-38},'C').tete;
  }
  const bg=c.createLinearGradient(0,gy-74,0,gy-34);bg.addColorStop(0,'#e8bb48');bg.addColorStop(1,'#a8801f');
  c.fillStyle=bg;c.beginPath();
  c.moveTo(x,gy-34);c.quadraticCurveTo(x-4,gy-72,x+30,gy-74);c.lineTo(x+104,gy-68);c.lineTo(x+176,gy-60);
  c.quadraticCurveTo(x+190,gy-58,x+190,gy-46);c.lineTo(x+188,gy-34);c.closePath();c.fill();
  c.strokeStyle='rgba(90,62,27,.7)';c.lineWidth=1.5;
  c.beginPath();c.moveTo(x+104,gy-66);c.lineTo(x+106,gy-36);c.stroke();
  for(let i=0;i<4;i++){c.beginPath();c.moveTo(x+132+i*10,gy-56);c.lineTo(x+132+i*10,gy-44);c.stroke()}
  c.fillStyle='#3a2e22';c.fillRect(x+186,gy-64,7,30);
  c.fillStyle='rgba(241,231,211,.08)';c.beginPath();c.moveTo(x+106,gy-68);c.lineTo(x+100,gy-104);c.lineTo(x+104,gy-104);c.lineTo(x+110,gy-68);c.fill();
  c.strokeStyle='rgba(241,231,211,.55)';c.lineWidth=2.5;c.beginPath();c.moveTo(x+108,gy-68);c.lineTo(x+101,gy-104);c.stroke();
  c.strokeStyle=ink;c.lineWidth=3;c.beginPath();c.moveTo(x+100,gy-70);c.lineTo(x+95,gy-84);c.stroke();
  const ang=o.roue||0;roue(c,x+40,gy-24,ang);roue(c,x+150,gy-24,ang);
  c.strokeStyle=ink;c.lineWidth=7;c.lineCap='round';
  c.beginPath();c.arc(x+40,gy-24,29,Math.PI*1.05,Math.PI*1.95);c.stroke();
  c.beginPath();c.arc(x+150,gy-24,29,Math.PI*1.05,Math.PI*1.95);c.stroke();
  c.lineWidth=4;c.beginPath();c.moveTo(x+68,gy-32);c.lineTo(x+122,gy-32);c.stroke();c.lineCap='butt';
  c.fillStyle='#3a2e22';c.fillRect(x+180,gy-66,3,8);
  c.fillStyle='#fff3d0';c.beginPath();c.arc(x+186,gy-70,6.5,0,7);c.fill();
  c.save();c.globalCompositeOperation='lighter';const hg=c.createRadialGradient(x+186,gy-70,2,x+186,gy-70,34);hg.addColorStop(0,'rgba(255,230,160,.6)');hg.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=hg;c.beginPath();c.arc(x+186,gy-70,34,0,7);c.fill();c.restore();
  return tetes;
};
/* faisceau des phares */
L.phares=function(c,x,y,a){
  c.save();c.globalCompositeOperation='lighter';
  const g=c.createLinearGradient(x,0,x+620,0);g.addColorStop(0,`rgba(227,178,60,${.22*a})`);g.addColorStop(1,'rgba(227,178,60,0)');
  c.fillStyle=g;c.beginPath();c.moveTo(x,y-4);c.lineTo(x+640,y-150);c.lineTo(x+640,y+70);c.closePath();c.fill();c.restore();
};

/* Léon et sa trompette dorée. leve = 0..1 (trompette vers le plafond), saut = rebond en px */
L.leon=function(c,x,y,leve,saut){
  y+=saut||0;const col='#22160f';
  c.fillStyle=col;c.beginPath();c.arc(x,y-112,13,0,7);c.fill();c.fillRect(x-14,y-98,28,62);c.fillRect(x-12,y-38,10,38);c.fillRect(x+2,y-38,10,38);
  c.save();c.translate(x-6,y-110);c.rotate(Math.PI+.35+leve*.65);
  c.strokeStyle=col;c.lineWidth=8;c.beginPath();c.moveTo(-8,30);c.lineTo(0,8);c.stroke();
  c.strokeStyle=L.C.or;c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(0,46);c.stroke();
  c.fillStyle=L.C.or;c.beginPath();c.moveTo(-9,56);c.lineTo(9,56);c.lineTo(3,42);c.lineTo(-3,42);c.closePath();c.fill();c.restore();
};

/* Maurice, patron du Cabaret des Étoiles : tout en rondeur, moustache claire, nœud papillon rouge,
   chaîne de montre dorée. o = {main:{x,y} (main droite, coordonnées locales depuis les pieds), chapeau:true, rire 0..1}.
   Renvoie la position de la main droite. */
L.maurice=function(c,x,sol,o){
  o=o||{};const col='#120d0a',r=(o.rire||0)*Math.abs(Math.sin((o.t||0)*11))*4;
  c.save();c.translate(x,sol);c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';
  c.fillRect(-30,-64,24,64);c.fillRect(6,-64,24,64);
  c.beginPath();c.ellipse(-20,-2,18,6,0,0,7);c.fill();c.beginPath();c.ellipse(20,-2,18,6,0,0,7);c.fill();
  c.beginPath();c.ellipse(0,-118-r,48,56,0,0,7);c.fill();
  c.strokeStyle=L.C.or;c.lineWidth=1.6;c.beginPath();c.moveTo(-26,-110-r);c.quadraticCurveTo(0,-92-r,22,-112-r);c.stroke();
  c.fillStyle=L.C.or;c.beginPath();c.arc(22,-112-r,3,0,7);c.fill();
  c.fillStyle=col;c.fillRect(-10,-178-r,20,12);
  c.beginPath();c.arc(0,-194-r,21,0,7);c.fill();
  c.beginPath();c.ellipse(0,-210-r,22,9,0,Math.PI,0);c.fill();
  c.fillStyle='#e8dcc2';c.beginPath();c.moveTo(-18,-186-r);c.quadraticCurveTo(-9,-194-r,0,-188-r);c.quadraticCurveTo(9,-194-r,18,-186-r);c.quadraticCurveTo(9,-180-r,0,-184-r);c.quadraticCurveTo(-9,-180-r,-18,-186-r);c.fill();
  c.fillStyle=L.C.rouge;c.beginPath();c.moveTo(-12,-170-r);c.lineTo(0,-165-r);c.lineTo(-12,-160-r);c.closePath();c.fill();c.beginPath();c.moveTo(12,-170-r);c.lineTo(0,-165-r);c.lineTo(12,-160-r);c.closePath();c.fill();
  // bras gauche : tient le chapeau haut-de-forme retourné devant lui
  c.strokeStyle=col;c.lineWidth=13;c.beginPath();c.moveTo(-40,-148-r);c.lineTo(-50,-110);c.lineTo(-20,-96);c.stroke();
  if(o.chapeau!==false){c.fillStyle='#050403';c.fillRect(-40,-96,44,40);c.beginPath();c.ellipse(-18,-96,32,7,0,0,7);c.fill();
    c.fillStyle='#2a1d14';c.beginPath();c.ellipse(-18,-96,22,4,0,0,7);c.fill();c.fillStyle=L.C.rouge;c.fillRect(-40,-66,44,5)}
  // bras droit
  const m=o.main||{x:52,y:-96};
  c.strokeStyle=col;c.lineWidth=13;c.beginPath();c.moveTo(40,-148-r);const ex=(40+m.x)/2+18,ey=(-148-r+m.y)/2+10;c.quadraticCurveTo(ex,ey,m.x,m.y);c.stroke();
  c.fillStyle=col;c.beginPath();c.arc(m.x,m.y,7,0,7);c.fill();
  c.restore();
  return{x:x+m.x,y:sol+m.y};
};

/* Amélie Sarrail, la grand-mère : chignon haut, robe longue, ras-de-cou de perles.
   o = {F (sens), s (échelle), pointe 0..1 (bras tendu, doigt accusateur), tempe 0..1 (main sur la tempe : la migraine stratégique)} */
L.amelie=function(c,x,sol,o){
  o=o||{};const F=o.F||1,s=o.s||1,col='#100b09';
  c.save();c.translate(x,sol);c.scale(s,s);c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';
  c.beginPath();c.moveTo(-14,-118);c.lineTo(14,-118);c.lineTo(36,0);c.lineTo(-36,0);c.closePath();c.fill();
  c.beginPath();c.moveTo(-15,-170);c.lineTo(15,-170);c.lineTo(13,-116);c.lineTo(-13,-116);c.closePath();c.fill();
  c.fillRect(-5,-184,10,16);c.beginPath();c.arc(F*2,-196,13,0,7);c.fill();
  c.beginPath();c.arc(-F*4,-214,9,0,7);c.fill();
  c.fillStyle='#e8dcc2';[-6,-2,2,6].forEach(d=>{c.beginPath();c.arc(d,-180,1.3,0,7);c.fill()});
  const p=o.pointe||0,tp=o.tempe||0;c.lineWidth=7;
  const ap=lerp(.25,1.75,p);c.beginPath();c.moveTo(F*6,-164);c.lineTo(F*(6+Math.sin(ap)*30),-164+Math.cos(ap)*30);c.lineTo(F*(6+Math.sin(ap)*58),-164+Math.cos(ap)*58-(p*6));c.stroke();
  if(tp>0){c.beginPath();c.moveTo(-F*6,-164);c.lineTo(-F*(14+10*tp),-150-20*tp);c.lineTo(F*lerp(-12,-4,tp),lerp(-130,-198,tp));c.stroke()}
  else{c.beginPath();c.moveTo(-F*6,-164);c.lineTo(-F*12,-136);c.lineTo(-F*6,-112);c.stroke()}
  c.restore();
};

/* Chopin, grand chat gris assis, de face. queue = phase, cligne = 0..1 */
L.chopin=function(c,x,y,s,queue,cligne){
  c.save();c.translate(x,y);c.scale(s,s);const g=L.C.grisChat;
  c.strokeStyle=g;c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(40,-6);
  c.quadraticCurveTo(80,-10+Math.sin(queue)*10,74,-48+Math.sin(queue*1.3)*14);c.quadraticCurveTo(70,-70,84+Math.sin(queue)*8,-86);c.stroke();
  c.fillStyle=g;c.beginPath();c.moveTo(-40,0);c.quadraticCurveTo(-48,-66,-18,-96);c.lineTo(18,-96);c.quadraticCurveTo(50,-66,42,0);c.closePath();c.fill();
  c.beginPath();c.arc(0,-124,34,0,7);c.fill();
  c.beginPath();c.moveTo(-30,-140);c.lineTo(-34,-178);c.lineTo(-8,-154);c.closePath();c.fill();c.beginPath();c.moveTo(30,-140);c.lineTo(34,-178);c.lineTo(8,-154);c.closePath();c.fill();
  const o=1-(cligne||0);
  c.fillStyle=L.C.or;c.beginPath();c.ellipse(-14,-126,8,9*o+.5,0,0,7);c.fill();c.beginPath();c.ellipse(14,-126,8,9*o+.5,0,0,7);c.fill();
  c.fillStyle=L.C.ombre;c.beginPath();c.ellipse(-14,-126,2,7*o+.3,0,0,7);c.fill();c.beginPath();c.ellipse(14,-126,2,7*o+.3,0,0,7);c.fill();
  c.fillStyle=L.C.rouge;c.beginPath();c.moveTo(-4,-110);c.lineTo(4,-110);c.lineTo(0,-105);c.fill();
  c.strokeStyle='rgba(241,231,211,.7)';c.lineWidth=1;[[-1,-4],[-1,4],[1,-4],[1,4]].forEach(([d,o2])=>{c.beginPath();c.moveTo(d*20,-106+o2*.6);c.lineTo(d*42,-108+o2*1.5);c.stroke()});
  c.restore();
};
})();
