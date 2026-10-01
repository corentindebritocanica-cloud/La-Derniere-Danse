/* Plan 04 — Le tirage au sort (20 s)
   Rue des Teinturiers : l'enseigne au néon s'allume, l'affiche du concours, la porte et ses ampoules.
   À l'intérieur, Maurice tire deux papiers de son haut-de-forme ; le projecteur trouve Célestin, puis Louise,
   dans le public. Les deux papiers tombent au ralenti vers nous. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL;

/* ---------- dehors : la façade ---------- */
function neon(t){if(t<3.6)return 0;if((t>3.75&&t<3.85)||(t>3.98&&t<4.05)||(t>4.3&&t<4.34))return .15;return 1}
function facade(c,t){
  const n=neon(t);
  c.fillStyle='#3a1d17';c.fillRect(0,0,W,600);
  c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;
  for(let y=6;y<600;y+=10){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=((y/10)%2)*13;x<W;x+=26){c.beginPath();c.moveTo(x,y-10);c.lineTo(x,y);c.stroke()}}
  // affiche du concours
  c.save();c.translate(225,385);c.rotate(-.03);
  c.fillStyle='#e8dcc2';c.fillRect(-105,-135,210,270);c.strokeStyle=L.C.rouge;c.lineWidth=3;c.strokeRect(-95,-125,190,250);
  L.star(c,0,-88,22,9,L.C.rouge);
  c.textAlign='center';c.fillStyle=L.C.rouge;c.font="20px "+L.F.titre;c.fillText('GRAND CONCOURS',0,-36);
  c.fillStyle=L.C.encre;c.font="38px "+L.F.titre;c.fillText('DE DANSE',0,6);
  c.font="13px "+L.F.machine;L.setLS(c,'2px');c.fillText('SAMEDI 14 DÉCEMBRE',0,46);c.fillText('21 HEURES',0,66);L.setLS(c,'0px');
  c.fillStyle=L.C.bleu;c.font="italic 13px "+L.F.texte;c.fillText('confirmés et débutants',0,92);c.fillText('tirés au sort',0,108);
  c.restore();
  // porte et ampoules
  c.fillStyle='#1a0f0b';c.fillRect(530,286,220,316);
  c.fillStyle='#0d0806';c.fillRect(548,304,90,296);c.fillRect(642,304,90,296);
  c.fillStyle='rgba(227,178,60,.5)';c.fillRect(566,330,54,40);c.fillRect(660,330,54,40);
  c.save();c.globalCompositeOperation='lighter';const fe=c.createLinearGradient(626,0,654,0);fe.addColorStop(0,'rgba(255,190,110,0)');fe.addColorStop(.5,'rgba(255,190,110,.9)');fe.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=fe;c.fillRect(626,304,28,296);
  const sol=c.createRadialGradient(640,604,4,640,604,220);sol.addColorStop(0,'rgba(255,190,110,.35)');sol.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=sol;c.fillRect(380,560,520,160);c.restore();
  const amp=[];for(let y=592;y>=296;y-=22)amp.push([530,y]);for(let x=530;x<=750;x+=22)amp.push([x,286]);for(let y=296;y<=592;y+=22)amp.push([750,y]);
  amp.forEach(([x,y],i)=>{const on=Math.floor(t*6-i*.5)%3===0;c.fillStyle=on?'#ffe3a0':'#7a5a2a';c.beginPath();c.arc(x,y,4,0,7);c.fill();
    if(on){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,210,120,.25)';c.beginPath();c.arc(x,y,10,0,7);c.fill();c.restore()}});
  // enseigne
  c.fillStyle='#120b08';c.fillRect(380,150,520,104);c.strokeStyle='#b88f2e';c.lineWidth=3;c.strokeRect(388,158,504,88);
  c.save();c.textAlign='center';c.font="44px "+L.F.titre;L.setLS(c,'5px');
  if(n>.5){c.shadowColor='rgba(255,200,90,.9)';c.shadowBlur=18}c.fillStyle=n>.5?'#ffd76a':'#5e4a24';c.fillText('CABARET DES ÉTOILES',640,218);c.restore();L.setLS(c,'0px');
  // étoile rouge en néon
  c.save();c.lineJoin='round';
  const etoile=()=>{c.beginPath();for(let i=0;i<10;i++){const r=i%2?20:48,an=-Math.PI/2+i*Math.PI/5;c.lineTo(640+Math.cos(an)*r,92+Math.sin(an)*r)}c.closePath()};
  if(n>.5){c.shadowColor='rgba(255,60,40,.95)';c.shadowBlur=26}c.strokeStyle=n>.5?'#ff5a44':'#4a1612';c.lineWidth=6;etoile();c.stroke();
  c.shadowBlur=0;if(n>.5){c.strokeStyle='#ffd0c4';c.lineWidth=1.6;etoile();c.stroke()}c.restore();
  if(n>.5){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(640,140,10,640,140,520);g.addColorStop(0,'rgba(255,80,50,.22)');g.addColorStop(1,'rgba(255,80,50,0)');c.fillStyle=g;c.fillRect(0,0,W,600);c.restore()}
  // trottoir et pavés
  c.fillStyle='#15100d';c.fillRect(0,600,W,120);c.fillStyle='#2a201a';c.fillRect(0,600,W,6);
  c.strokeStyle='rgba(255,255,255,.05)';for(let r=0;r<5;r++)for(let x=(r%2)*20;x<W;x+=40){c.beginPath();c.ellipse(x,628+r*20,17,7,0,0,7);c.stroke()}
  // réverbère
  c.fillStyle='#0b0706';c.fillRect(1098,250,7,352);c.fillRect(1088,236,26,18);
  c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(1101,245,2,1101,245,130);lg.addColorStop(0,'rgba(255,214,130,.7)');lg.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=lg;c.beginPath();c.arc(1101,245,130,0,7);c.fill();c.restore();
}

/* ---------- dedans : le tirage ---------- */
const REPOS={x:52,y:-96},CHAPEAU={x:-18,y:-104},HAUT={x:72,y:-252};
function mainMaurice(t){
  const fouille=(t0)=>({x:CHAPEAU.x+Math.sin(t*30)*4,y:CHAPEAU.y+6+Math.cos(t*26)*3});
  const lerpP=(a,b,u)=>({x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u)});
  if(t<9)return REPOS;
  if(t<9.5)return lerpP(REPOS,CHAPEAU,eio(seg(t,9,9.5)));
  if(t<9.9)return fouille();
  if(t<12.6)return lerpP(CHAPEAU,HAUT,eoc(seg(t,9.9,10.4)));
  if(t<13.3)return lerpP(HAUT,CHAPEAU,eio(seg(t,12.6,13.3)));
  if(t<13.7)return fouille();
  if(t<16.3)return lerpP(CHAPEAU,HAUT,eoc(seg(t,13.7,14.2)));
  return lerpP(HAUT,{x:90,y:-280},eoc(seg(t,16.3,16.6)));
}
function papier(c,x,y,s,rot,ouvre,l1,l2){
  c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s*Math.max(.12,ouvre));
  c.fillStyle='#f4ead6';c.fillRect(-58,-30,116,60);c.strokeStyle='rgba(90,62,27,.5)';c.lineWidth=1;c.strokeRect(-54,-26,108,52);
  c.fillStyle=L.C.rouge;c.font="10px "+L.F.machine;c.textAlign='center';L.setLS(c,'2px');c.fillText(l1,0,-8);L.setLS(c,'0px');
  c.fillStyle=L.C.encre;c.font="15px "+L.F.main;c.fillText(l2,0,16);
  c.restore();
}
const P1=['CONFIRMÉ','« le peintre »'],P2=['DÉBUTANTE','Mlle L. Sarrail'];
function projecteur2(c,t){
  let tx=null,a=0;
  if(t>10.9&&t<13){tx=lerp(640,330,eio(seg(t,10.9,11.7)));a=seg(t,10.9,11.2)*(1-seg(t,12.7,13))}
  else if(t>14.4&&t<16.6){tx=lerp(640,950,eio(seg(t,14.4,15.2)));a=seg(t,14.4,14.7)*(1-seg(t,16.3,16.6))}
  if(!tx||a<=0)return;
  c.save();c.globalCompositeOperation='lighter';
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(255,240,210,${.03*a})`);g.addColorStop(1,`rgba(255,240,210,${.2*a})`);
  c.fillStyle=g;c.beginPath();c.moveTo(620,0);c.lineTo(660,0);c.lineTo(tx+120,H);c.lineTo(tx-120,H);c.closePath();c.fill();
  const r=c.createRadialGradient(tx,620,10,tx,620,170);r.addColorStop(0,`rgba(255,240,210,${.35*a})`);r.addColorStop(1,'rgba(255,240,210,0)');c.fillStyle=r;c.beginPath();c.arc(tx,620,170,0,7);c.fill();
  c.restore();
}
function interieur(c,t){
  L.cabaret(c,{spot:1,X:640,rayon:i=>.08+.06*Math.sin(t*2+i),enseigne:1});
  L.leon(c,1040,556,t>10.35&&t<11.2||t>14.15&&t<15?.9:.1,0);
  // présentoir pour le premier papier
  c.fillStyle='#2a1a0c';c.fillRect(468,500,6,60);c.fillRect(452,556,38,5);c.fillRect(448,486,48,14);
  const m=L.maurice(c,640,SOL,{main:mainMaurice(t),rire:(t>10.4&&t<11.4)||(t>14.2&&t<15.2)?1:0,t});
  // papier 1
  if(t>9.9&&t<16.4){
    let x=m.x,y=m.y-18,s=.9,ouv=eoc(seg(t,10.15,10.5));
    if(t>12.6){const u=eio(seg(t,12.6,13.1));x=lerp(m.x,472,u);y=lerp(m.y-18,470,u);s=lerp(.9,.55,u)}
    papier(c,x,y,s,-.06,ouv,...P1);
  }
  if(t>13.7&&t<16.4)papier(c,m.x,m.y-18,.9,.05,eoc(seg(t,13.95,14.3)),...P2);
  // dans le public : Célestin puis Louise se lèvent
  const lc=eoc(seg(t,11.5,12.1));
  if(lc>0){const p=L.melange(L.POSES.debout,L.POSES.bras_leve,.45*eio(seg(t,12.1,12.5))*(1-eio(seg(t,13.6,14))));p.hd=-.1;
    L.pantin(c,{x:330,F:1,p,s:1.55,sol:lerp(980,770,lc)},'C')}
  const ll=eoc(seg(t,15.1,15.7));
  if(ll>0){const p=L.melange(L.POSES.timide,L.POSES.debout,eio(seg(t,16,16.5)));
    L.pantin(c,{x:950,F:-1,p,s:1.55,sol:lerp(980,772,ll)},'L')}
  L.public(c,t,(t>10.6&&t<11.8)||(t>14.5&&t<15.4)?.6:0);
  projecteur2(c,t);
}
/* ---------- les papiers tombent au ralenti ---------- */
function chute(c,t){
  if(t<16.4)return;
  const u=seg(t,16.4,19.6),e=eio(u);
  [[P1,560,-1],[P2,720,1]].forEach(([txt,x0,d],k)=>{
    const s=lerp(.9,7.5,Math.pow(u,1.6)),x=lerp(x0,640+d*(260+k*40),e),y=lerp(300,420+Math.sin(u*Math.PI)*-120,e)+Math.sin(t*2.2+k)*18;
    const rot=d*(.15+Math.sin(t*1.7+k*2)*.35),ouv=.6+.4*Math.abs(Math.cos(t*1.3+k));
    papier(c,x,y,s,rot,ouv,...txt);
  });
}

const OUVERTURE=[{s:'RUE DES TEINTURIERS',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Samedi 14 décembre. Soir de concours.',y:380,f:"italic 46px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<8){
    c.save();const z=Math.exp(Math.log(3.4)*eio(seg(t,5.6,7.9)));c.translate(640,445);c.scale(z,z);c.translate(-640,-445);facade(c,t);c.restore();
  }
  if(t>=7.8){
    c.save();const z=1.06-.06*eio(seg(t,7.8,9));c.translate(640,420);c.scale(z,z);c.translate(-640,-420);interieur(c,t);c.restore();
    chute(c,t);
  }
  const flash=seg(t,7.2,7.8)*(1-seg(t,7.8,8.5));
  if(flash>0){c.fillStyle=`rgba(255,226,170,${flash})`;c.fillRect(0,0,W,H)}
  L.noir(c,t<3?1:t<4?1-(t-3):t>19.2?(t-19.2)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,20);
  // dehors : la rue, le néon, le jazz étouffé derrière la porte
  K.nappe(T+3,5,'lowpass',500,.6,[[.5,.03],[4.6,.03],[5,0]]);
  const neonB=ac.createOscillator();neonB.type='sawtooth';neonB.frequency.value=100;const ng=ac.createGain();ng.gain.setValueAtTime(0,T+3.6);ng.gain.linearRampToValueAtTime(.006,T+3.7);ng.gain.setValueAtTime(.006,T+7.6);ng.gain.linearRampToValueAtTime(0,T+7.8);
  neonB.connect(K.lp(400)).connect(ng).connect(K.out);neonB.start(T+3.6);neonB.stop(T+8);
  const etouffe=ac.createGain();const ef=K.lp(650);etouffe.connect(ef).connect(K.out);etouffe.gain.setValueAtTime(.7,T);etouffe.gain.setValueAtTime(.7,T+5.6);etouffe.gain.linearRampToValueAtTime(1.6,T+7.7);etouffe.gain.linearRampToValueAtTime(0,T+7.9);
  K.orchestre(T+3,.5,['Dm9','G13'],etouffe);
  K.phrase(L.THEME.motif,T+3.5,.5,'trompette',etouffe,.04);
  // dedans : le brouhaha, le verre, les roulements
  K.nappe(T+7.8,12,'lowpass',700,.7,[[.3,.06],[1.1,.06],[1.6,.02],[2.6,.015],[8.4,.02],[9,.004],[12,0]]);
  K.cloche(96,T+8.6,null,.03);K.cloche(96,T+8.8,null,.03);
  K.roulement(T+9,T+10.35);K.cymbale(T+10.4,null,.07,1.4);
  [[0,74],[.12,78],[.24,81],[.36,86]].forEach(([o,m])=>K.trompette(m,T+10.42+o,o===.36?.7:.11));
  K.nappe(T+10.5,1.4,'bandpass',500,.8,[[.3,.05],[1.4,0]]);
  K.applaudissements(T+10.6,1.2);
  K.roulement(T+13,T+14.15);K.cymbale(T+14.2,null,.07,1.4);
  [[0,69],[.12,73],[.24,76],[.36,81]].forEach(([o,m])=>K.trompette(m,T+14.22+o,o===.36?.7:.11));
  K.applaudissements(T+14.5,1);
  // le ralenti
  K.nappeAccord('Dm9',T+16.3,3.8,null,.012);
  [[0,69],[1.1,72],[2.2,74]].forEach(([o,m])=>K.piano(m,T+16.6+o,.04));
  K.finale(T,20);
}

L.film({duree:20,rendu,partition,affiche:14.6});
})();
