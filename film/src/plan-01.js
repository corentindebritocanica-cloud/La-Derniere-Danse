/* Plan 01 — Ouverture (20 s)
   Le soleil art déco se lève, l'étoile rouge s'allume comme un néon, le titre s'écrit lettre par lettre,
   puis l'iris se referme sur l'étoile. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H;
const CX=640,CY=770,ETOILE={x:640,y:236};
const TITRE='LA DERNIÈRE DANSE',T0=6.2,PAS=.2;

function etoileAllumee(t){
  if(t<4.4)return 0;
  if((t>4.6&&t<4.72)||(t>4.86&&t<4.98))return .25;
  return Math.min(1,(t-4.4)/.15);
}
function soleil(c,t){
  const r=900*eoc(seg(t,1.4,6)),rot=-.06+.03*Math.sin(t*.25);
  if(r<=0)return;
  L.soleil(c,{x:CX,y:CY,r,n:40,rot,epais:.032,couleur:i=>i%2?'rgba(90,62,27,.55)':'rgba(227,178,60,.42)'});
  const g=c.createRadialGradient(CX,CY,0,CX,CY,r*.6);g.addColorStop(0,'rgba(227,178,60,.35)');g.addColorStop(1,'rgba(227,178,60,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.strokeStyle=L.C.or;c.lineWidth=2;
  [[200,2.2],[290,2.7],[380,3.2]].forEach(([rr,d])=>{const p=eio(seg(t,d,d+1.4));if(p<=0)return;c.globalAlpha=.6;c.beginPath();c.arc(CX,CY,rr,Math.PI,Math.PI+Math.PI*p);c.stroke();c.globalAlpha=1});
  c.fillStyle=L.C.ombre;c.beginPath();c.arc(CX,CY,150,Math.PI,0);c.fill();
  c.strokeStyle=L.C.or;c.lineWidth=3;c.beginPath();c.arc(CX,CY,150*eoc(seg(t,1.6,3)),Math.PI,0);c.stroke();
}
function etoile(c,t){
  const a=etoileAllumee(t);if(a<=0)return;
  const k=1+.04*Math.sin((t-5)*3);
  c.save();c.globalCompositeOperation='lighter';
  const g=c.createRadialGradient(ETOILE.x,ETOILE.y,0,ETOILE.x,ETOILE.y,170);g.addColorStop(0,`rgba(255,120,90,${.45*a})`);g.addColorStop(1,'rgba(255,120,90,0)');
  c.fillStyle=g;c.beginPath();c.arc(ETOILE.x,ETOILE.y,170,0,7);c.fill();c.restore();
  c.save();c.globalAlpha=.35+.65*a;L.star(c,ETOILE.x,ETOILE.y,64*k,26*k,L.C.rouge,L.C.or,3);c.restore();
}
function titre(c,t){
  c.save();c.font="96px "+L.F.titre;L.setLS(c,'4px');c.textAlign='left';c.textBaseline='alphabetic';
  const larg=c.measureText(TITRE).width;let x=CX-larg/2;
  for(let i=0;i<TITRE.length;i++){
    const ch=TITRE[i],w=c.measureText(ch).width,ti=T0+i*PAS,p=seg(t,ti,ti+.5);
    if(p>0&&ch!==' '){
      c.globalAlpha=p;c.fillStyle=L.C.papier;c.fillText(ch,x,430-18*(1-eoc(p)));
      const eclat=1-seg(t,ti,ti+.7);
      if(eclat>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=eclat;c.fillStyle='rgba(255,215,120,.9)';c.beginPath();c.arc(x+w/2,350,3+eclat*5,0,7);c.fill();c.restore()}
    }
    x+=w;
  }
  c.restore();
  const fin=T0+TITRE.length*PAS,pl=eio(seg(t,fin,fin+1.3));
  if(pl>0){c.strokeStyle=L.C.or;c.lineWidth=1.5;
    [462,470].forEach((y,k)=>{const l=(420-k*40)*pl;c.beginPath();c.moveTo(CX-30,y);c.lineTo(CX-30-l,y);c.moveTo(CX+30,y);c.lineTo(CX+30+l,y);c.stroke()});
    c.fillStyle=L.C.or;c.beginPath();c.moveTo(CX,458);c.lineTo(CX+9,466);c.lineTo(CX,474);c.lineTo(CX-9,466);c.closePath();c.globalAlpha=pl;c.fill();c.globalAlpha=1}
  const sa=seg(t,fin+.6,fin+1.8);
  if(sa>0){c.save();c.globalAlpha=sa;c.fillStyle='#d9c9a8';c.font="22px "+L.F.machine;L.setLS(c,'8px');c.textAlign='center';c.fillText('TOULOUSE · DÉCEMBRE 1925',CX,522);c.restore()}
}
function iris(c,t){
  const p=seg(t,16.8,19.4);if(p<=0)return;
  const r=lerp(1500,0,eio(p));
  c.fillStyle='#000';c.beginPath();c.rect(0,0,W,H);c.arc(ETOILE.x,ETOILE.y,Math.max(0,r),0,Math.PI*2,true);c.fill('evenodd');
  if(r>2){c.strokeStyle='rgba(227,178,60,.5)';c.lineWidth=2;c.beginPath();c.arc(ETOILE.x,ETOILE.y,r,0,7);c.stroke()}
}

function rendu(c,t){
  c.fillStyle=L.C.ombre;c.fillRect(0,0,W,H);
  c.save();c.globalAlpha=seg(t,.8,3)*.8;L.etoiles(c,t,0,0,false,700);c.restore();
  soleil(c,t);
  const point=seg(t,.3,1)*(1-seg(t,1.4,2.2));
  if(point>0){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,215,120,${point})`;c.beginPath();c.arc(CX,700,4,0,7);c.fill();c.restore()}
  etoile(c,t);titre(c,t);iris(c,t);
  L.noir(c,t<.4?1-t/.4:t>19.4?1:0);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie),TH=L.THEME;
  K.gramophone(T,20);
  K.phrase(TH.motif,T+2.4,.72,'trompette',null,.055);
  K.cloche(93,T+4.42,null,.035);K.cloche(98,T+5.0,null,.025);
  K.nappe(T+4.2,1.6,'highpass',5000,.5,[[0,.0001],[.25,.03],[1.5,0]]);
  const lettres=[81,84,86,88,91,93,96,93,91,88,86,84,81,84,86,88,93];
  for(let i=0;i<TITRE.length;i++)if(TITRE[i]!==' ')K.piano(lettres[i%lettres.length],T+T0+i*PAS,.018);
  const acc=K.bus();
  K.nappeAccord('Dm9',T+9.2,4,acc,.01);K.nappeAccord('G13',T+12.8,3.4,acc,.01);K.nappeAccord('Dm9',T+15.8,4,acc,.012);
  K.phrase(TH.reponse,T+10.4,.72,'trompette',null,.045);
  K.basse(38,T+15.8,null,.18);K.accord('Dm9',T+15.8,.035);K.cloche(86,T+16,null,.03);
  K.finale(T,20);
}

L.film({duree:20,rendu,partition,affiche:14});
})();
