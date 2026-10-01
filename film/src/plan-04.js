/* Plan 04 — La soirée des parrains (43,5 s) — chapitre 3, première partie
   18 h 40 : la migraine épouvantable, main sur la tempe. 19 h 40 : l'escalier de service, chaussures à la main,
   la porte du potager. Le rouge à lèvres mis dans la vitre noire du tramway. La porte rouge sous l'enseigne en fer
   peinte d'étoiles dorées. Solange, les débutants en rang, les parrains en face, Célestin adossé à une colonne.
   Maurice tire les noms dans deux chapeaux melon : « Monsieur Delacroix… avec mademoiselle Sarrail ! » */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,SOL=L.SOL,S=L.SARRAIL,P=L.POSES;

function heure(c,s,a){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='right';c.fillStyle=L.C.or;c.font="34px "+L.F.machine;L.setLS(c,'3px');c.fillText(s,1220,70);L.setLS(c,'0px');c.restore()}
function parole(c,s,x,y,a,taille){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font=(taille||27)+"px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));

/* ---------- A. le salon de Purpan, 18 h 40 ---------- */
function salon(c,t){
  const g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,'#3e4a3e');g.addColorStop(1,'#5a6450');c.fillStyle=g;c.fillRect(0,0,W,612);
  c.fillStyle='rgba(20,30,20,.15)';for(let x=0;x<W;x+=48)c.fillRect(x,0,20,612);
  c.fillStyle='#2a1a10';c.fillRect(0,600,W,120);c.fillStyle='#5a3e1b';c.fillRect(0,596,W,6);
  // cheminée, miroir, pendule
  c.fillStyle='#d9cdb4';c.fillRect(840,360,300,240);c.fillStyle='#1a0f0b';c.fillRect(890,440,200,160);c.fillStyle='#e8dcc2';c.fillRect(820,350,340,16);
  c.fillStyle='#8a7a5a';c.fillRect(870,150,240,190);c.fillStyle='#4a5a5a';c.fillRect(882,162,216,166);
  c.fillStyle=L.C.or;c.beginPath();c.arc(990,320,18,0,7);c.fill();c.fillRect(975,320,30,30);
  c.save();c.globalCompositeOperation='lighter';const f=c.createRadialGradient(990,560,4,990,560,200);f.addColorStop(0,'rgba(255,140,60,.35)');f.addColorStop(1,'rgba(255,140,60,0)');c.fillStyle=f;c.fillRect(780,380,420,240);c.restore();
  // fauteuil, porte
  c.fillStyle='#4a1a14';c.fillRect(560,470,140,130);c.fillRect(560,420,30,180);
  c.fillStyle='#2e1d0e';c.fillRect(70,210,130,390);const o=eio(seg(t,3.4,3.9));c.fillStyle='#4a2f16';c.fillRect(80+110*o*.8,220,110*(1-o*.8),380);
}
function sceneA(c,t){
  salon(c,t);
  const am=seg(t,3.7,4.8);
  L.amelie(c,lerp(150,330,eio(am)),SOL-12,{F:1,s:1.05,pointe:0,tempe:0});
  const p=L.melange(P.debout,P.debout,0);const m=eio(seg(t,4.6,5))*(1-eio(seg(t,8.6,9)));
  p.aF=[lerp(.12,2.75,m),lerp(.15,1.95,m)];p.hd=lerp(0,.25,m);p.tA=lerp(0,-.06,m);
  L.pantin(c,{x:760,F:-1,p,sol:SOL-12},'L');
  parole(c,'… une migraine épouvantable.',760,250,env(t,5.1,2.3));
  parole(c,'Monte te coucher. Je dirai que tu es souffrante.',380,240,env(t,7.2,2.4));
  heure(c,'18 H 40',seg(t,3.2,3.6)*(1-seg(t,9.4,9.8)));
}
/* ---------- B. le jardin, 19 h 40 : la fuite par la porte du potager ---------- */
function sceneB(c,t){
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#060b15');g.addColorStop(1,'#13233b');c.fillStyle=g;c.fillRect(0,0,W,H);
  L.etoiles(c,t,0,0,false,300);
  const K=1,ox=640-390*K,oy=620-S.sol*K;
  c.save();c.translate(ox,oy);c.scale(K,K);
  L.maisonSarrail(c,{lumGP:0});
  // la salle à manger éclairée : le dîner des Lasserre
  [0,1].forEach(i=>{const r=S.rdc[i];c.fillStyle='#c99a52';c.fillRect(r.x,r.y,r.w,r.h);c.fillStyle='rgba(20,12,8,.8)';[12,34,50].forEach((dx,k)=>{const b=Math.sin(t*3+i+k)*1.5;c.beginPath();c.arc(r.x+dx,r.y+60+b,7,0,7);c.fill();c.fillRect(r.x+dx-8,r.y+68+b,16,40)});c.strokeStyle='#2a1a10';c.lineWidth=3;c.strokeRect(r.x,r.y,r.w,r.h)});
  c.fillStyle='#0d1712';c.fillRect(-300,S.sol,1400,200);
  // la porte du potager, sur le côté
  const pp=eio(seg(t,10.4,10.7))*(1-eio(seg(t,11.2,11.5)));c.fillStyle='#1a0f0b';c.fillRect(640,560,26,80);c.fillStyle='rgba(255,200,120,.5)';c.fillRect(640,560,26*pp,80);
  c.restore();
  const u=seg(t,10.7,13.7);
  if(u>0&&u<1){const x=lerp(ox+655,-60,u),p=L.pas(P.debout,(t-10.7)*16,.55,0);p.tA=.2;p.aF=[.9,.6];p.aB=[-.6,.4];
    const r=L.pantin(c,{x,F:-1,p,s:.62,sol:oy+S.sol+40},'L');c.fillStyle='#0b0907';c.beginPath();c.ellipse(r.main.x-4,r.main.y+3,6,3,0,0,7);c.fill();c.beginPath();c.ellipse(r.main.x+4,r.main.y+5,6,3,0,0,7);c.fill()}
  heure(c,'19 H 40',seg(t,9.9,10.3)*(1-seg(t,14,14.4)));
}
/* ---------- C. le tramway : le rouge à lèvres dans la vitre noire ---------- */
function sceneC(c,t){
  const sway=Math.sin(t*5)*1.5;c.save();c.translate(0,sway);
  c.fillStyle='#3a2414';c.fillRect(0,0,W,H);c.fillStyle='#2a1a0c';c.fillRect(0,0,W,120);c.fillRect(0,470,W,250);
  const vg=c.createLinearGradient(640,150,1240,450);vg.addColorStop(0,'#26324a');vg.addColorStop(1,'#141c2c');c.fillStyle=vg;c.fillRect(640,150,600,300);
  c.save();c.beginPath();c.rect(640,150,600,300);c.clip();
  for(let k=0;k<14;k++){const x=1240-((t*420+k*173)%900),y=200+((k*97)%220);c.fillStyle='rgba(255,210,130,.55)';c.fillRect(x,y,26,3)}
  c.restore();
  c.strokeStyle='#1a0f08';c.lineWidth=12;c.strokeRect(640,150,600,300);c.beginPath();c.moveTo(940,150);c.lineTo(940,450);c.stroke();
  c.fillStyle='#4a2f16';c.fillRect(380,470,330,26);c.fillRect(380,400,22,96);
  [[200,60],[520,60],[860,60]].forEach(([x,y])=>{c.fillStyle='#e8c87a';c.beginPath();c.arc(x,y+40,8,0,7);c.fill()});
  const lev=t>17.1;
  const p=L.melange(P.assis,P.assis,0);const m=eio(seg(t,15.8,16.3))*(1-eio(seg(t,17.4,17.9)));
  p.aF=[lerp(.7,2.35,m),lerp(.9,1.45,m)+Math.sin(t*40)*.04*m];p.hd=-.08;
  L.pantin(c,{x:540,F:1,p,hipY:470,levres:lev},'L');
  c.save();c.beginPath();c.rect(640,150,600,300);c.clip();c.globalAlpha=.55;
  L.pantin(c,{x:800,F:-1,p,hipY:470,levres:lev},'L');c.restore();
  const k=seg(t,17.5,18.2);if(k>0){const pk=L.melange(P.debout,P.debout,0);pk.hd=.1;L.pantin(c,{x:250,F:1,p:pk,sol:SOL+30},'K')}
  c.restore();
}
/* ---------- D. rue des Teinturiers : la porte rouge ---------- */
function sceneD(c,t){
  c.fillStyle='#2c1712';c.fillRect(0,0,W,612);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;
  for(let y=6;y<612;y+=12){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=((y/12)%2)*15;x<W;x+=30){c.beginPath();c.moveTo(x,y-12);c.lineTo(x,y);c.stroke()}}
  c.save();c.translate(160,250);c.rotate(-.03);c.scale(.36,.36);L.afficheConcours(c);c.restore();
  // l'enseigne en fer, peinte d'étoiles dorées
  c.fillStyle='#0b0a0a';c.fillRect(470,170,340,86);c.strokeStyle='#3a3530';c.lineWidth=4;c.strokeRect(476,176,328,74);
  c.fillStyle=L.C.or;c.font="27px "+L.F.titre;c.textAlign='center';L.setLS(c,'3px');c.fillText('CABARET DES ÉTOILES',640,224);L.setLS(c,'0px');
  [[492,190],[788,190],[500,238],[780,238],[640,190]].forEach(([x,y],i)=>L.star(c,x,y,i===4?7:6,i===4?3:2.5,L.C.or));
  c.fillStyle='#0b0a0a';c.fillRect(632,140,16,32);c.fillRect(600,138,80,6);
  // la porte rouge
  const ouv=eio(seg(t,21.8,22.5));
  c.fillStyle='#180c08';c.fillRect(560,290,160,322);c.fillStyle='rgba(255,200,120,.85)';c.fillRect(564,294,152*ouv,318);
  c.fillStyle='#8a1a14';c.fillRect(564+152*ouv*.9,294,152*(1-ouv*.9),318);c.strokeStyle='#5e110d';c.lineWidth=3;c.strokeRect(574+152*ouv*.9,306,Math.max(0,132*(1-ouv)),140);
  c.save();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(640,150,2,640,150,160);lg.addColorStop(0,'rgba(255,214,130,.6)');lg.addColorStop(1,'rgba(255,214,130,0)');c.fillStyle=lg;c.fillRect(440,0,400,330);
  if(ouv>0){const pg=c.createRadialGradient(640,612,4,640,612,360);pg.addColorStop(0,`rgba(255,190,110,${.5*ouv})`);pg.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=pg;c.fillRect(260,520,760,200)}c.restore();
  c.fillStyle='#15100d';c.fillRect(0,612,W,108);
  const u=seg(t,19.8,21.3);const p=u<1?L.pas(P.debout,(t-19.8)*10,.32,0):L.melange(P.debout,P.debout,0);p.aF=[.15,.2];
  L.pantin(c,{x:lerp(140,520,eio(u)),F:1,p,levres:true},'L');
}
/* ---------- E. la salle : le tirage au sort ---------- */
const DEB=[{x:110,k:'Y',s:.95},{x:185,k:'X',s:1},{x:400,k:'X',s:.96},{x:465,k:'Y',s:.93}];
const PAR=[{x:830,k:'X',s:1.08,acc:'curedent'},{x:905,k:'X',s:.9,acc:'moustache'},{x:980,k:'Y',s:.98,acc:'fume'},{x:1055,k:'B',s:1}];
function figurant(c,f,t,F,dx){
  const p=L.melange(P.debout,P.debout,0);p.tA=.02*Math.sin(t+f.x);p.aF=[.15,.2];
  const r=L.pantin(c,{x:f.x+(dx||0),F,p,s:f.s},f.k);
  c.strokeStyle='#0b0907';c.lineWidth=2;
  if(f.acc==='curedent'){c.strokeStyle='#d9c9a8';c.beginPath();c.moveTo(r.tete.x+F*12,r.tete.y+8);c.lineTo(r.tete.x+F*22,r.tete.y+5);c.stroke()}
  if(f.acc==='moustache'){c.fillStyle='#0b0907';c.fillRect(r.tete.x+F*8-4,r.tete.y+5,8,3)}
  if(f.acc==='fume'){c.strokeStyle='#0b0907';c.lineWidth=2;c.beginPath();c.moveTo(r.tete.x+F*12,r.tete.y+8);c.lineTo(r.tete.x+F*52,r.tete.y-4);c.stroke();c.fillStyle='rgba(220,220,230,.3)';c.beginPath();c.arc(r.tete.x+F*56,r.tete.y-12-Math.sin(t*2)*3,5,0,7);c.fill()}
  return r;
}
function sceneE(c,t){
  const z=lerp(1,1.42,eio(seg(t,36.8,40))),cx=lerp(640,650,eio(seg(t,36.8,40))),cy=lerp(360,440,eio(seg(t,36.8,40)));
  c.save();c.translate(640,360);c.scale(z,z);c.translate(-cx,-cy);
  L.salleCabaret(c,t,{});
  const joue=t<26.4?1:t>42.6?1:0;
  L.orchestreSix(c,t,joue);
  c.save();c.translate(760,L.SCENE.haut);c.scale(.82,.82);L.leon(c,0,0,joue?.25+.2*Math.sin(t*2):.05,joue?-Math.abs(Math.sin(t*Math.PI*2))*3:0);c.restore();
  // Maurice et les deux chapeaux melon
  const ma=seg(t,25.9,26.8);
  if(ma>0){const ys=L.SCENE.haut;
    const chap=seg(t,29.6,30.2);if(chap>0){c.fillStyle='#2a1a0c';c.fillRect(712,ys-46,40,4);c.fillRect(730,ys-42,4,42);[[706,1],[758,2]].forEach(([x])=>{c.fillStyle='#050403';c.beginPath();c.ellipse(x,ys-50,15,6,0,0,7);c.fill();c.beginPath();c.ellipse(x,ys-50,11,12,0,Math.PI,0);c.fill()})}
    let main={x:52,y:-96};
    const tir=(a)=>{if(t>a&&t<a+.4)return{x:lerp(52,82,seg(t,a,a+.4)),y:-80};if(t>=a+.4&&t<a+.8)return{x:lerp(82,134,seg(t,a+.4,a+.8)),y:-80};if(t>=a+.8&&t<a+3)return{x:68,y:-232};return null};
    main=tir(30.6)||tir(33.6)||main;
    c.save();c.globalAlpha=ma;c.translate(lerp(560,640,eio(ma)),ys);c.scale(.8,.8);L.maurice(c,0,0,{main,chapeau:false,rire:(t>28.6&&t<29.4)?1:0,t});c.restore();
    [[30.6],[33.6]].forEach(([a])=>{if(t>a+.8&&t<a+3){const px=640+68*.8,py=ys-232*.8-12;c.fillStyle='#f4ead6';c.fillRect(px-14,py-9,28,18)}});
  }
  // serveur qui apporte les chapeaux
  const sv=seg(t,28.8,30.4);if(sv>0&&sv<1){const x=lerp(1000,760,Math.sin(Math.PI*sv)),p=L.pas(P.debout,t*11,.3,0);p.aF=[1.4,.2];c.save();c.translate(0,0);L.pantin(c,{x,F:sv<.5?-1:1,p,s:.78,sol:L.SCENE.haut},'X');c.restore()}
  // les débutants en rang, les parrains en face
  DEB.forEach(f=>figurant(c,f,t,1,(t>32.5&&f.x===185)?lerp(0,180,eio(seg(t,32.5,33.5))):0));
  PAR.forEach(f=>figurant(c,f,t,-1,(t>32.5&&f.acc==='moustache')?lerp(0,-260,eio(seg(t,32.5,33.5))):0));
  // Solange
  const so=seg(t,23.2,24.2);let sx=lerp(620,375,eio(so));if(t>25.3)sx=lerp(375,360,seg(t,25.3,26.2));if(t>36.5)sx=lerp(360,420,eio(seg(t,36.5,37.4)));
  const ps=L.melange(P.debout,P.debout,0);if(t>24.3&&t<25.3){ps.aF=[2.1,.5];}if(t>25.3&&t<26.2||t>36.6&&t<37.4){ps.aF=[1.5,.1];ps.tA=.15}
  L.pantin(c,{x:sx,F:-1,p:ps,s:.97},'S',.1);
  // Louise
  let lx=lerp(250,330,eio(seg(t,23.4,24.2)));if(t>25.3)lx=lerp(330,300,eio(seg(t,25.3,26.2)));
  const centre=eio(seg(t,36.7,37.8));lx=lerp(lx,600,centre);
  let pl=L.melange(P.debout,P.debout,0);if(centre>0&&centre<1)pl=L.pas(pl,t*11,.3,0);pl.hd=t>36.5?-.05:.1;if(t>38.8)pl.hd=-.12;
  L.pantin(c,{x:lx,F:1,p:pl,levres:true},'L',.15);
  // Célestin, adossé à la colonne, qui regarde l'orchestre
  const tra=eio(seg(t,37.3,38.7));let cxp=lerp(1122,700,tra);
  let pc=L.melange(P.debout,P.debout,0);pc.tA=lerp(-.12,0,tra);pc.hd=t<34.9?-.32:lerp(-.32,.02,eio(seg(t,34.9,35.3)));pc.aB=[.5+.08*Math.sin(t*Math.PI*4)*(t<34.9?1:0),1.1];
  if(tra>0&&tra<1)pc=L.pas(pc,t*10,.3,0);
  const sal=Math.sin(Math.PI*seg(t,38.8,39.5));if(sal>0)pc.tA=.28*sal;
  const rc=L.pantin(c,{x:cxp,F:-1,p:pc},'C');
  const sourire=seg(t,41.8,42)*(1-seg(t,42.3,42.6));if(sourire>0){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,250,235,${sourire})`;c.beginPath();c.arc(rc.tete.x-7,rc.tete.y,3,0,7);c.fill();c.restore()}
  L.tablesCabaret(c,t);
  c.restore();
  // les voix
  parole(c,'Te voilà, ma chérie ! On tire les couples dans dix minutes.',640,140,env(t,23.4,1.6));
  parole(c,'Le rouge est un peu de travers. Viens là.',640,140,env(t,24.9,1.4));
  parole(c,'Un confirmé, un débutant. Le hasard décide !',640,120,env(t,26.9,1.7),30);
  parole(c,'Et surtout, que tout le monde boive !',640,120,env(t,28.6,1.2),30);
  parole(c,'Monsieur Ferrand, avec mademoiselle Pujol !',640,120,env(t,31.6,1.8),32);
  parole(c,'Monsieur Delacroix…',640,120,env(t,34.6,1.2),34);
  parole(c,'… avec mademoiselle Sarrail !',640,120,env(t,35.8,1.4),34);
  parole(c,'Célestin.',780,250,env(t,39.3,1));parole(c,'Louise.',520,250,env(t,39.9,.9));
  parole(c,'Vous dansez depuis longtemps, Louise ?',780,230,env(t,40.3,1.2));parole(c,'Trois mois.',520,250,env(t,41.5,.9));
  parole(c,'C’est parfait.',780,230,env(t,42,1.2));
}

const OUVERTURE=[{s:'PURPAN · SAMEDI 14 DÉCEMBRE',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Le soir du dîner. Le soir du concours.',y:380,f:"italic 46px "+L.F.texte}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  const scenes=[[sceneA,2.9,9.9],[sceneB,9.7,14.9],[sceneC,14.7,19.8],[sceneD,19.6,23.2],[sceneE,22.9,99]];
  scenes.forEach(([f,a,b])=>{if(t>a&&t<b){c.save();c.globalAlpha=Math.min(seg(t,a,a+.35),1-seg(t,b-.35,b));f(c,t);c.restore()}});
  const flash=seg(t,22.4,22.9)*(1-seg(t,22.9,23.4));if(flash>0){c.fillStyle=`rgba(255,226,170,${flash})`;c.fillRect(0,0,W,H)}
  L.noir(c,t<3?1:t<3.6?1-(t-3)/.6:t>42.7?(t-42.7)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,43.5);
  // A : la pendule du salon, le feu
  for(let s=3.5;s<9.6;s+=.5)K.noise(T+s,.025,'bandpass',s%1?2500:1800,4,.03,.002);
  K.nappe(T+3,6.6,'lowpass',500,.6,[[.5,.02],[6,.02],[6.6,0]]);
  [62,65,69].forEach((m,i)=>K.piano(m,T+5.2+i*.5,.03));
  // B : le rire d'Henri Lasserre derrière les vitres, la course sur le gravier
  [10.1,10.25,10.4,10.55].forEach(w=>K.noise(T+w,.09,'bandpass',520,3,.05,.01));
  for(let w=10.8;w<13.6;w+=.2)K.noise(T+w,.05,'bandpass',2600,1,.04,.003);
  // C : le tramway
  K.cloche(91,T+14.9,null,.03);K.cloche(91,T+15.15,null,.03);
  K.nappe(T+14.8,5,'lowpass',160,.7,[[.3,.08],[4.6,.08],[5,0]]);for(let w=15;w<19.6;w+=.55)K.noise(T+w,.04,'bandpass',1200,3,.04,.002);
  K.piano(76,T+17.2,.03);
  // D : la rue, la porte, la musique qui tombe dessus « comme une averse chaude »
  for(let w=19.8;w<21.3;w+=.42)K.noise(T+w,.05,'lowpass',300,1,.05,.003);
  const ex=ac.createGain();const ef=K.lp(600);ex.connect(ef).connect(K.out);ex.gain.setValueAtTime(.6,T);ex.gain.setValueAtTime(.6,T+21.8);ex.gain.linearRampToValueAtTime(1.6,T+22.5);ex.gain.setValueAtTime(1.6,T+23);ex.gain.linearRampToValueAtTime(0,T+23.2);
  K.orchestre(T+19.6,.42,['Dm9','G13'],ex);
  // E : la salle
  const orch=K.bus();K.orchestre(T+22.9,.42,['Dm9','G13'],orch);K.phrase(L.THEME.reponse,T+23.1,.42,'trompette',orch,.045);
  orch.gain.setValueAtTime(1,T+26.2);orch.gain.linearRampToValueAtTime(0,T+26.6);
  K.nappe(T+22.9,20.6,'lowpass',700,.7,[[.5,.06],[3.3,.05],[4,.025],[12.8,.025],[13,.004],[13.6,.03],[20,.025],[20.6,0]]);
  [28.9,29.05,29.2].forEach(w=>K.noise(T+w,.12,'bandpass',600,1.5,.05,.01));
  K.roulement(T+30.5,T+31.5);K.cymbale(T+31.55,null,.04,.8);K.applaudissements(T+32.4,1.2);
  K.roulement(T+33.5,T+34.5);K.cymbale(T+34.55,null,.04,.6);
  K.applaudissements(T+36.4,1.4);
  K.piano(69,T+39.3,.03);K.piano(72,T+39.9,.03);K.piano(76,T+42,.035);
  // et l'orchestre attaque le fox-trot
  const fox=K.bus();K.orchestre(T+42.6,.36,['Dm9'],fox,{piano:.03});
  K.finale(T,43.5);
}

L.film({duree:43.5,rendu,partition,affiche:35.6});
})();
