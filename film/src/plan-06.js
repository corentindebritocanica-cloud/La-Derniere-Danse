/* Plan 06 — La marche jusqu'à Purpan (23 s)
   Long travelling latéral : ils marchent côte à côte dans la nuit, la ville défile en couches,
   chaque réverbère s'allume à leur passage. Bribes de conversation. Arrivée au portail de Purpan
   (la glycine est déjà là, sur le mur). « Bonne nuit, le peintre. » */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL;
const X0=420,V=125;

function couple(t){
  let x,vit;
  if(t<16.4){x=X0+V*Math.max(0,t-3);vit=1}
  else{const u=seg(t,16.4,18.4);x=X0+V*13.4+V*2*(u-u*u/2);vit=1-u}
  return{x,vit};
}
const camX=t=>couple(t).x-500;

/* ---------- décor ---------- */
const R=L.rng(406),MAISONS=[];
(function(){let x=-120;while(x<1350){const w=110+R()*80,h=150+R()*120;MAISONS.push({x,w,h,fen:[...Array(6)].map(()=>R()<.22)});x+=w+6}})();
const REVERBERES=[360,640,920,1200,1480,1760,2040];
const PLATANES=[1320,1520,1720,1920,2110];
function allume(t,lx){const tx=couple(t).x+40;return eoc(clamp((tx-lx)/50,0,1))}

function ville(c,t,ox){
  // maisons (couche du milieu)
  const f=.55;
  for(const m of MAISONS){const x=m.x-ox*f;if(x>W+10||x+m.w<-10)continue;const top=560-m.h;
    c.fillStyle='#1b100d';c.fillRect(x,top,m.w,m.h);
    c.fillStyle='#10151f';c.beginPath();c.moveTo(x-6,top);c.lineTo(x+m.w*.5,top-34);c.lineTo(x+m.w+6,top);c.closePath();c.fill();
    m.fen.forEach((on,i)=>{const fx=x+14+(i%3)*((m.w-40)/2),fy=top+24+Math.floor(i/3)*58;c.fillStyle=on?'rgba(227,178,60,.75)':'#0b0807';c.fillRect(fx,fy,14,24)})}
  // champs et arbres lointains après la ville
  c.fillStyle='#0c1420';for(let k=0;k<10;k++){const x=1380+k*150-ox*f;if(x<-80||x>W+80)continue;c.beginPath();c.ellipse(x,520,60,46,0,0,7);c.fill();c.fillRect(x-4,520,8,40)}
}
function rue(c,t,ox){
  c.fillStyle='#14100d';c.fillRect(0,600,W,120);c.fillStyle='#2a211a';c.fillRect(0,598,W,5);
  c.strokeStyle='rgba(255,255,255,.04)';c.lineWidth=1;
  for(let r=0;r<5;r++){const off=((r%2)*20-ox)%40;for(let x=off-40;x<W+40;x+=40){c.beginPath();c.ellipse(x,624+r*20,17,7,0,0,7);c.stroke()}}
  // platanes
  for(const px of PLATANES){const x=px-ox;if(x<-160||x>W+160)continue;
    c.fillStyle='#2a2318';c.fillRect(x-10,330,20,272);c.fillStyle='rgba(120,110,90,.25)';c.fillRect(x-6,380,8,30);c.fillRect(x+1,460,7,40);
    c.fillStyle='#0a111b';c.beginPath();c.ellipse(x,300,120,90,0,0,7);c.fill();c.beginPath();c.ellipse(x-70,330,60,50,0,0,7);c.fill();c.beginPath();c.ellipse(x+80,320,70,56,0,0,7);c.fill()}
  // panneau
  const sx=2150-ox;if(sx>-80&&sx<W+80){c.fillStyle='#0b0706';c.fillRect(sx-3,470,6,132);
    c.fillStyle='#e8dcc2';c.beginPath();c.moveTo(sx-6,470);c.lineTo(sx+78,470);c.lineTo(sx+92,484);c.lineTo(sx+78,498);c.lineTo(sx-6,498);c.closePath();c.fill();
    c.fillStyle=L.C.encre;c.font="13px "+L.F.machine;c.textAlign='left';L.setLS(c,'2px');c.fillText('PURPAN',sx+2,489);L.setLS(c,'0px')}
  // le mur et le portail des Sarrail
  const gx=2300-ox;if(gx<W+40){
    // la maison Sarrail, exactement celle du plan coté (porte dans l'axe de la grille)
    c.save();const k=.62;c.translate(gx+105-390*k,602-640*k);c.scale(k,k);L.maisonSarrail(c,{});c.restore();
    c.fillStyle='#2b241d';c.fillRect(gx-200,450,1200,152);c.strokeStyle='rgba(0,0,0,.25)';for(let y=466;y<602;y+=16){c.beginPath();c.moveTo(gx-200,y);c.lineTo(gx+1000,y);c.stroke()}
    c.fillStyle='#4a3d30';c.fillRect(gx-200,444,1200,8);
    // piliers et grille (la grille est dessinée après les personnages)
    c.fillStyle='#4a3d30';c.fillRect(gx+30,410,34,192);c.fillRect(gx+146,410,34,192);c.fillStyle='#5a4a3a';c.fillRect(gx+26,402,42,10);c.fillRect(gx+142,402,42,10);
    c.fillStyle='#0b0706';c.fillRect(gx+64,452,82,150);
  }
}
function grille(c,t,ox){
  const gx=2300-ox;if(gx>W+40)return;const ouv=eio(seg(t,20.2,20.7))*(1-eio(seg(t,21.4,21.9)));
  c.save();c.translate(gx+64,0);c.scale(1-.7*ouv,1);
  c.strokeStyle='#0a0705';c.lineWidth=3;for(let i=0;i<=8;i++){const x=i*10.25;c.beginPath();c.moveTo(x,602);c.lineTo(x,448);c.stroke();c.beginPath();c.moveTo(x-3,452);c.lineTo(x,440);c.lineTo(x+3,452);c.fill()}
  c.lineWidth=2.5;[480,560].forEach(y=>{c.beginPath();c.moveTo(0,y);c.lineTo(82,y);c.stroke()});
  c.beginPath();c.arc(41,520,14,0,7);c.stroke();c.restore();
}
function reverbere(c,t,ox,lx){
  const x=lx-ox;if(x<-120||x>W+120)return;const a=allume(t,lx);
  c.fillStyle='#0b0706';c.fillRect(x-3,380,6,222);c.fillRect(x-12,370,24,14);c.beginPath();c.moveTo(x-14,370);c.lineTo(x,352);c.lineTo(x+14,370);c.fill();
  c.fillStyle=a>0?`rgba(255,226,150,${.25+.75*a})`:'#2a2418';c.fillRect(x-9,372,18,10);
  if(a>0){c.save();c.globalCompositeOperation='lighter';
    const g=c.createRadialGradient(x,377,2,x,377,120);g.addColorStop(0,`rgba(255,214,130,${.65*a})`);g.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=g;c.beginPath();c.arc(x,377,120,0,7);c.fill();
    const p=c.createRadialGradient(x,604,2,x,604,150);p.addColorStop(0,`rgba(255,214,130,${.28*a})`);p.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=p;c.beginPath();c.ellipse(x,604,150,26,0,0,7);c.fill();
    const fl=1-seg(t-(lx-X0)/V-3,0,.35);if(fl>0&&fl<1){c.fillStyle=`rgba(255,240,200,${.6*fl})`;c.beginPath();c.arc(x,377,22*fl+4,0,7);c.fill()}
    c.restore()}
}
function bornes(c,ox){c.fillStyle='#050403';for(let k=0;k<8;k++){const x=k*420+130-ox*1.3;if(x<-40||x>W+40)continue;c.fillRect(x-9,664,18,56);c.beginPath();c.arc(x,664,9,Math.PI,0);c.fill()}
  c.fillStyle='#070605';c.fillRect(0,700,W,20)}

/* ---------- conversation ---------- */
const PAROLES=[
  {t:4.5,qui:'C',s:'Vous dansiez vraiment pour la première fois ?'},
  {t:6.6,qui:'L',s:'Pour la première fois devant quelqu’un.'},
  {t:8.7,qui:'L',s:'Et vous, vous peignez quoi, la nuit ?'},
  {t:10.8,qui:'C',s:'Ce qu’on ne voit pas le jour.'},
  {t:12.9,qui:'L',s:'Vous avez lu Freud ?'},
  {t:15.0,qui:'C',s:'Non… vous me le prêterez ?'},
  {t:17.0,qui:'L',s:'En cachette, alors.'},
  {t:20.5,qui:'L',s:'Bonne nuit, le peintre.'}];
function paroles(c,t,tetes){
  c.save();c.textAlign='center';c.font="27px "+L.F.main;L.setLS(c,'0px');
  for(const p of PAROLES){const u=(t-p.t)/1.95;if(u<0||u>1)continue;const h=tetes[p.qui];if(!h)continue;
    c.globalAlpha=Math.sin(Math.PI*u)*.95;c.fillStyle='#f6ecd8';c.fillText(p.s,clamp(h.x+(p.qui==='C'?-30:40),220,W-220),h.y-58-u*36)}
  c.restore();
}

const OUVERTURE=[{s:'DE LA RUE DES TEINTURIERS À PURPAN',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},{s:'Il a proposé de la raccompagner.',y:380,f:"italic 48px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const ox=camX(t),cp=couple(t);
    L.ciel(c,0,560);L.etoiles(c,t,0,0,false,480);
    c.fillStyle='#ede3cf';c.beginPath();c.arc(1120,96,18,0,7);c.fill();c.fillStyle='#08101e';c.beginPath();c.arc(1127,91,17,0,7);c.fill();
    L.toulouse(c,520-ox*.06,560,0,1.3,{fond:'#0d1626'});
    ville(c,t,ox);rue(c,t,ox);
    REVERBERES.forEach(lx=>reverbere(c,t,ox,lx));
    // Célestin et Louise
    const ph=cp.x/18,amp=.34*cp.vit;
    let pc=L.pas(L.POSES.debout,ph,amp,0),pl=L.pas(L.POSES.debout,ph+Math.PI*.9,amp*.9,0);
    pc.aF=[.18+.2*Math.sin(ph+Math.PI)*cp.vit,.2];pc.aB=[-.1-.2*Math.sin(ph)*cp.vit,.2];pc.hd=-.06+.05*Math.sin(t*.9);
    pl.aF=[.25+.15*Math.sin(ph)*cp.vit,.3];pl.aB=[-.08,.25];pl.hd=-.05+.06*Math.sin(t*1.1+1);
    let xc=cp.x-ox,xl=cp.x+56-ox,Fl=1,al=1;
    const face=eio(seg(t,18.5,19));if(face>0)Fl=Math.cos(Math.PI*face);
    const salut=Math.sin(Math.PI*seg(t,19.3,20.1));if(salut>0){pc=L.melange(pc,{...pc,tA:.32,hd:.2},salut);pl=L.melange(pl,{...pl,tA:.18,hd:.25},salut)}
    const part=seg(t,20.5,21.4);if(part>0){Fl=lerp(-1,1,Math.min(1,part*3));xl+=110*eio(part);pl=L.pas(L.POSES.debout,(t-20.5)*11,.3*(1-part),0)}
    if(t>21.6)Fl=lerp(1,-1,eio(seg(t,21.6,22)));
    const tc=L.pantin(c,{x:xc,F:1,p:pc},'C').tete;
    const tl=L.pantin(c,{x:xl,F:Fl,p:pl},'L').tete;
    grille(c,t,ox);
    reverbere(c,t,ox,2350);
    bornes(c,ox);
    paroles(c,t,{C:tc,L:tl});
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>22.2?(t-22.2)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,23);
  K.nappe(T+2.9,19.5,'lowpass',350,.5,[[1,.03],[19,.025],[19.5,0]]);
  // pas sur les pavés : un pas toutes les demi-foulées de chacun
  let dern={C:null,L:null};
  for(let t=3;t<18.4;t+=.01){const x=couple(t).x;['C','L'].forEach((k,i)=>{const n=Math.floor((x+(i?28:0))/56.5);if(dern[k]!==null&&n!==dern[k]){K.noise(T+t,.05,'bandpass',i?1700:1100,1.4,i?.05:.07,.003);K.noise(T+t,.04,'lowpass',180,.7,.06,.003)}dern[k]=n})}
  // un tintement à chaque réverbère qui s'allume
  REVERBERES.concat([2350]).forEach((lx,i)=>{for(let t=3;t<19;t+=.01){if(couple(t).x+40>=lx){if(t>3.05)K.cloche([86,88,91,93,95,91,98,93][i%8],T+t,null,.022);break}}});
  // le thème, lentement, au piano
  const p=K.bus();
  K.phrase(L.THEME.lent,T+4,.85,'piano',p,.045);
  [[4,'Dm9'],[8.4,'G13'],[12.8,'Cmaj9'],[17.2,'Fmaj9']].forEach(([w,n])=>K.nappeAccord(n,T+w,4.6,p,.007));
  K.basse(38,T+4,p,.14);K.basse(43,T+8.4,p,.14);K.basse(36,T+12.8,p,.14);K.basse(41,T+17.2,p,.14);
  // le portail
  K.souffle(46,T+20.2,.5,{g:.015,cut:700,vib:11,att:.1});K.noise(T+21.85,.2,'bandpass',900,2,.07,.003);
  K.violon(76,T+20.6,1.4,null,.03);K.violon(74,T+22,1,null,.025);
  K.finale(T,23);
}

L.film({duree:23,rendu,partition,affiche:11.4});
})();
