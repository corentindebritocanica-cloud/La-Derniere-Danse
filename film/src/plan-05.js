/* Plan 05 — La danse qui n'existe pas encore (58 s) — chapitre 3, seconde partie
   Trois danses : un fox-trot (« Ne comptez pas »), un tango (l'erreur devenue figure, deux mesures de regard),
   puis le morceau de Léon, lent, chaloupé, qui n'a pas de nom. « Faites-moi confiance. » Il l'envoie au bout de son bras
   comme un cerf-volant, le long d'une ligne invisible, et la ramène. Silence, puis toute la salle se lève.
   Ils ne gagnent pas ; Maurice leur donne une bouteille « pour la plus belle troisième danse ».
   Interprétation visuelle (à signaler) : la ligne invisible apparaît en filet d'or sur le parquet. */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,P=L.POSES,SOLP=640,S=1.05;

const TANGO_C={tA:-.12,hd:-.1,aF:[1.3,.35],aB:[1.15,.95],lF:[.42,-.08],lB:[-.5,.1]};
const TANGO_L={tA:-.36,hd:-.32,aF:[1.6,.2],aB:[1.0,1.0],lF:[.62,-.2],lB:[-.3,.1]};
const COUPLES=[{x:300,ph:0},{x:930,ph:1.7},{x:1110,ph:3.1}];

function parole(c,s,x,y,a,taille){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.font=(taille||27)+"px "+L.F.main;c.lineWidth=5;c.strokeStyle='rgba(20,12,8,.85)';c.strokeText(s,x,y);c.fillStyle='#fbf3e2';c.fillText(s,x,y);c.restore()}

const REGP=[];
function paroleP(c,t,s,x,y,A,D,sz){const du=L.lue([A,0,s,D]),a=env(t,A,du);if(a<=0)return;
  if(!REGP.some(r=>r[0]===A&&r[1]===x))REGP.push([A,x,y]);
  let o=0;for(const r of REGP)if(r[0]>A&&Math.abs(r[1]-x)<700&&Math.abs(r[2]-y)<120)o+=44*L.seg(t,r[0]-.25,r[0]+.1);
  parole(c,s,x,Math.max(50,y-o),a,sz)}
const env=(t,a,d)=>seg(t,a,a+.3)*(1-seg(t,a+d-.3,a+d));

/* ---------- le couple ---------- */
function couple(t){
  let C={x:585,F:1,p:L.melange(P.tenue,P.tenue,0),s:S,sol:SOLP},Lo={x:695,F:-1,p:L.melange(P.tenue,P.tenue,0),s:S,sol:SOLP,levres:true},fil=null,flare=.1,ligne=0,yeux=0;
  if(t<16){
    // le fox-trot
    const arret=t>6.15&&t<6.7,raide=t>6.7&&t<11.4,lib=eio(seg(t,11.4,12.6)),ph=(t-3.6)/.5*Math.PI;
    const X=640+(arret?0:42*Math.sin((t-3.6)*.9));C.x=X-55;Lo.x=X+55;
    const amp=arret?0:raide?.14:.3;
    C.p=L.pas(P.tenue,ph,amp,0);Lo.p=L.pas(P.tenue,ph+Math.PI,amp,0);
    if(arret){Lo.p.hd=.42;Lo.p.tA=.06}else if(raide){Lo.p.hd=.22;Lo.p.tA=.03}
    if(t>11.5&&t<12.4)Lo.p.tA=-.14;
    if(t>15.6){const u=eio(seg(t,15.6,16));C.p=L.melange(C.p,P.debout,u);Lo.p=L.melange(Lo.p,P.debout,u)}
  }else if(t<17.4){
    // la musique s'arrête : il ne lui lâche pas la main… puis il la lâche
    const lache=eio(seg(t,16.8,17.3));C.x=600-lache*12;Lo.x=680+lache*12;
    C.p=L.melange(P.debout,P.debout,0);Lo.p=L.melange(P.debout,P.debout,0);C.p.aF=[lerp(1.2,.15,lache),.1];Lo.p.aF=[lerp(1.2,.15,lache),.1];Lo.p.hd=-.08;
  }else if(t<30.2){
    // le tango
    const ph=(t-17.6)/.62*Math.PI;let X=640+60*Math.sin((t-17.6)*.5);
    const faux=eio(seg(t,20.2,20.9))*(1-eio(seg(t,21.8,22.3)));X+=faux*-90;
    C.x=X-58;Lo.x=X+58;
    const pose=seg(t,22.5,22.8)*(1-seg(t,25,25.3));
    C.p=L.pas(TANGO_C,ph,.42*(1-pose),0);Lo.p=L.pas(TANGO_L,ph+Math.PI,.42*(1-pose),0);
    const tour=seg(t,20.9,21.7);if(tour>0&&tour<1)Lo.F=-Math.cos(2*Math.PI*eio(tour));
    if(pose>0){C.p=L.melange(C.p,{...TANGO_C,tA:-.18,hd:-.2,lF:[.55,-.05],lB:[-.6,.1]},pose);Lo.p=L.melange(Lo.p,{...TANGO_L,tA:-.5,hd:-.42,lF:[.85,-.15]},pose);C.x+=8*pose;Lo.x-=8*pose;yeux=pose}
    if(t>29.6){const u=eio(seg(t,29.6,30.2));C.p=L.melange(C.p,P.debout,u);Lo.p=L.melange(Lo.p,P.debout,u)}
  }else if(t<34.2){
    // Léon lance le morceau sans nom ; Célestin écoute deux mesures, les yeux fermés
    C.x=600;Lo.x=690;C.p=L.melange(P.debout,P.debout,0);Lo.p=L.melange(P.debout,P.debout,0);
    C.p.hd=lerp(0,.35,eio(seg(t,31.4,31.8)))*(1-eio(seg(t,33,33.3)));Lo.p.hd=-.05;
    const tend=eio(seg(t,33.4,34));C.p.aF=[lerp(.15,1.25,tend),lerp(.1,.15,tend)];
    const prend=eio(seg(t,33.8,34.2));Lo.p.aF=[lerp(.15,1.25,prend),.15];
  }else if(t<48.2){
    // la troisième danse : la ligne invisible
    const Xc=520;C.x=Xc;C.F=1;ligne=seg(t,34.3,35);
    const per=2.6,u=((t-34.2)%per)/per,cyc=Math.floor((t-34.2)/per);
    const d=70+130*Math.sin(Math.PI*u)**1.4;
    Lo.x=Xc+d;const sortant=u<.5;
    const tourne=sortant?0:1;Lo.F=sortant?(u<.08?-Math.cos(Math.PI*u/.08):1):(u<.58?Math.cos(Math.PI*(u-.5)/.08):-1);
    const ph=(t-34.2)/.36*Math.PI;
    C.p=L.pas(P.debout,ph*.5,.08,0);C.p.tA=.04*Math.sin(t*2.4);C.p.aF=[1.35,.1];C.p.hd=-.05;
    Lo.p=L.pas(P.debout,ph,.32,0);
    if(Lo.F>0){Lo.p.aB=[-1.3,-.1];Lo.p.aF=[.5+.3*Math.sin(t*3),.6]}else{Lo.p.aF=[1.35,.1];Lo.p.aB=[-.4,.5]}
    const audace=seg(t,40,42);Lo.p.tA=.08*Math.sin(t*4.2)*audace;Lo.p.hd=-.08+.08*Math.sin(t*2)*audace;flare=.15+.25*audace*Math.abs(Math.sin(t*4.2));
    if(t>47.6){const v=eio(seg(t,47.6,48.2));Lo.x=lerp(Lo.x,Xc+95,v);Lo.F=-1;Lo.p=L.melange(Lo.p,P.debout,v);C.p=L.melange(C.p,P.debout,v);Lo.p.aF=[lerp(1.35,.15,v),.1];C.p.aF=[lerp(1.35,.15,v),.1]}
    fil=true;
  }else{
    const Xc=520;C.x=Xc;Lo.x=Xc+95;Lo.F=-1;C.p=L.melange(P.debout,P.debout,0);Lo.p=L.melange(P.debout,P.debout,0);
    Lo.p.hd=-.1;C.p.hd=.02;ligne=1-seg(t,48.5,50);
    if(t>53.2){C.p.aF=[.7,.8]}
  }
  return{C,L:Lo,fil,flare,ligne,yeux};
}

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9){
    const st=couple(t),X=(st.C.x+st.L.x)/2;
    const z=1.18,cx=lerp(640,X+30,.7),cy=420;
    c.save();c.translate(640,360);c.scale(z,z);c.translate(-cx,-cy);
    const silence=t>48.2&&t<49.2;
    L.salleCabaret(c,t,{});
    const joue=t<15.7||(t>17.5&&t<30)||(t>30.6&&t<48.2)?1:0;
    L.orchestreSix(c,t,joue);
    const lv=t>30.1&&t<31.5?1:joue?.25+.15*Math.sin(t*2):.05;
    c.save();c.translate(760,L.SCENE.haut);c.scale(.82,.82);L.leon(c,0,0,lv,joue?-Math.abs(Math.sin(t*Math.PI*2))*3:0);c.restore();
    // le clin d'œil de Léon
    if(t>30.2&&t<30.7){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.9)';c.beginPath();c.arc(760+4,L.SCENE.haut-92,3,0,7);c.fill();c.restore()}
    // Maurice remet la coupe, puis la bouteille de mousseux
    if(t>50.2){const a=seg(t,50.2,50.8);c.save();c.globalAlpha=a;c.translate(640,L.SCENE.haut);c.scale(.8,.8);const m=L.maurice(c,0,0,{main:t>52.4?{x:68,y:-232}:{x:52,y:-96},chapeau:false,rire:t>50.8&&t<51.8?1:0,t});c.restore();
      if(t>52.4&&t<53.6){c.fillStyle='#1f3a24';c.fillRect(640+68*.8-5,L.SCENE.haut-232*.8-36,10,34);c.fillStyle=L.C.or;c.fillRect(640+68*.8-4,L.SCENE.haut-232*.8-42,8,8)}
      c.save();c.globalAlpha=a;L.pantin(c,{x:880,F:-1,p:{...P.debout,aF:[2.6,.1]},s:.8,sol:L.SCENE.haut},'X');L.pantin(c,{x:950,F:-1,p:{...P.debout,aF:[2.5,.1]},s:.76,sol:L.SCENE.haut},'Y');
      c.fillStyle=L.C.or;c.beginPath();c.moveTo(870,L.SCENE.haut-205);c.lineTo(890,L.SCENE.haut-205);c.lineTo(884,L.SCENE.haut-188);c.lineTo(876,L.SCENE.haut-188);c.closePath();c.fill();c.restore()}
    // les autres couples, au fond ; ils s'arrêtent quand Léon joue le morceau inconnu
    COUPLES.forEach((k,i)=>{const arret=t>31.4&&t<48.2,ph=(t+k.ph)/.5*Math.PI,amp=arret?0:.25;
      const pa=L.pas(P.tenue,ph,amp,0),pb=L.pas(P.tenue,ph+Math.PI,amp,0);if(arret){pa.aF=[.15,.2];pb.aF=[.15,.2]}
      const dx=arret?24:0;L.pantin(c,{x:k.x-44-dx,F:1,p:pa,s:.8,sol:520},i===1?'B':'X');L.pantin(c,{x:k.x+44+dx,F:-1,p:pb,s:.78,sol:520},'Y',.1)});
    // la ligne invisible
    if(st.ligne>0){c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(500,0,760,0);g.addColorStop(0,`rgba(255,215,120,${.0})`);g.addColorStop(.15,`rgba(255,215,120,${.55*st.ligne})`);g.addColorStop(1,'rgba(255,215,120,0)');
      c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(500,SOLP+4);c.lineTo(790,SOLP+4);c.stroke();c.restore()}
    c.fillStyle='rgba(0,0,0,.35)';[st.C,st.L].forEach(d=>{c.beginPath();c.ellipse(d.x,SOLP+3,30,6,0,0,7);c.fill()});
    const rc=L.pantin(c,st.C,'C'),rl=L.pantin(c,st.L,'L',st.flare);
    if(st.fil){const a=rc.main,b=st.L.F>0?rl.mainDos:rl.main;c.save();c.strokeStyle='rgba(255,215,120,.55)';c.lineWidth=1.5;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.restore()}
    if(st.yeux>.5){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,250,235,${(st.yeux-.5)*1.4})`;c.beginPath();c.arc(rc.tete.x+8,rc.tete.y,2.5,0,7);c.fill();c.restore()}
    const rire=(t>45&&t<45.6)||(t>33.2&&t<33.5);if(rire){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,250,235,.9)';c.beginPath();c.arc(rc.tete.x+8,rc.tete.y,3,0,7);c.fill();c.restore()}
    if(t>53.4){const m=rc.main;c.fillStyle='#1f3a24';c.save();c.translate(m.x,m.y);c.rotate(.3);c.fillRect(-5,-30,10,30);c.fillRect(-2.5,-40,5,10);c.restore()}
    L.tablesCabaret(c,t);
    c.restore();
    L.public(c,t,seg(t,49.2,49.6)*(1-seg(t,52,53)));
    // les voix
    const pc=x=>x;
    paroleP(c,t,'Pardon.',760,200,6.3,.9);
    paroleP(c,t,'Ne comptez pas.',520,200,7.2,1.1);
    paroleP(c,t,'Si je ne compte pas, je me trompe.',760,200,8.3,1.3);
    paroleP(c,t,'Vous vous trompez aussi en comptant.',520,190,9.6,1.1);
    paroleP(c,t,'Au moins, sans compter, vous vous tromperez en musique.',560,190,10.6,1.3);
    paroleP(c,t,'C’est de la peinture ?',760,200,12.5,.95);
    paroleP(c,t,'Bleu de Prusse. Vous avez l’œil.',520,200,13.4,1);
    paroleP(c,t,'Vous êtes peintre ?',760,200,14.35,.8);
    paroleP(c,t,'La nuit. Le jour, je dessine des avions.',520,200,15.05,1.15);
    paroleP(c,t,'Vous faites toujours ça ?',760,190,25.4,1);
    paroleP(c,t,'Transformer les erreurs des autres en quelque chose de beau.',640,190,26.4,1.2);
    paroleP(c,t,'En dessin industriel, on appelle ça la tolérance.',560,190,27.6,1.2);
    paroleP(c,t,'C’est très romantique, votre dessin industriel.',760,190,28.8,1.1);
    paroleP(c,t,'Vous n’avez pas idée.',520,200,29.85,1);
    paroleP(c,t,'Faites-moi confiance.',520,200,33.5,1.2,30);
    paroleP(c,t,'Pour la plus belle troisième danse !',640,110,52.2,1.6,30);
    paroleP(c,t,'Qu’est-ce que c’était ? Cette danse ?',760,190,54,1.4);
    paroleP(c,t,'Je ne sais pas. Je crois qu’elle n’existe pas encore.',600,190,55.5,2,29);
  }
  L.noir(c,t<3?1:t<3.6?1-(t-3)/.6:t>57.2?(t-57.2)/.8:0);
  L.carton(c,[{s:'UN FOX-TROT · UN TANGO · ET CE QUE L’ORCHESTRE VOUDRA',y:300,f:"19px "+L.F.machine,c:'#b9a98c',ls:'4px'},{s:'« Ne comptez pas. »',y:380,f:"italic 50px "+L.F.texte}],t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie);
  K.projecteur(T,58);
  K.nappe(T+2.9,55,'lowpass',700,.7,[[.5,.03],[45,.03],[45.3,0],[46.3,.03],[54,.02],[55,0]]);
  // le fox-trot
  const fox=K.bus();K.orchestre(T+3.6,.5,['Dm9','G13','Cmaj9','A7','Dm9','G13'],fox);
  K.phrase(L.THEME.reponse,T+4.6,.5,'trompette',fox,.04);K.phrase(L.THEME.reponse,T+10.6,.5,'trompette',fox,.04);
  fox.gain.setValueAtTime(1,T+15.4);fox.gain.linearRampToValueAtTime(0,T+15.7);
  K.applaudissements(T+15.7,1.2);
  // le tango : habanera, bandonéon imaginaire
  const tg=K.bus(),b=.62;
  for(let i=0;i<20;i++){const w=T+17.6+i*b*2;if(w>T+29.8)break;const pause=w>T+22.5&&w<T+25;[[0,1],[.75,.6],[1,.8],[1.5,.6]].forEach(([o,v])=>{if(!pause)K.basse([38,38,43,45][i%4],w+o*b,tg,.18*v)});
    if(!pause){K.piano([62,65,69][i%3],w,.025,tg);K.piano([62,65,69][i%3]+12,w+b,.018,tg)}}
  [[0,74,2],[2,72,1],[3,70,1],[4,69,4],[10,77,2],[12,76,1],[13,74,1],[14,73,3]].forEach(([o,m,d])=>K.souffle(m,T+17.6+o*b,d*b*.95,{g:.035,cut:1300,vib:4.5,att:.08},tg));
  K.nappeAccord('A7b9',T+22.6,2.4,tg,.01);
  K.applaudissements(T+21.8,.8);K.applaudissements(T+29.9,1);
  // le morceau sans nom : lent, chaloupé, une basse qui traîne, une trompette qui bâille
  const sn=K.bus(),bl=.72;
  for(let i=0;i<5;i++){const w=T+30.8+i*bl*4;['Dm9','G13','Cmaj9','A7','Dm9'][i]&&[0,1.5,2.5].forEach(o=>K.accord(['Dm9','G13','Cmaj9','A7','Dm9'][i],w+o*bl,.02,sn));
    (L.THEME.basses[['Dm9','G13','Cmaj9','A7','Dm9'][i]]||[38,40,41,45]).forEach((m,k)=>K.basse(m-12+12,w+k*bl+.06,sn,.22));[1,3].forEach(k=>K.charleston(w+k*bl+.08,sn,.03))}
  K.phrase(L.THEME.lent,T+32.2,.72,'trompette',sn,.04);
  K.phrase(L.THEME.motif.map(([o,m,d])=>[o,m+12,d]),T+40.4,.72,'trompette',sn,.03);
  sn.gain.setValueAtTime(1,T+48.1);sn.gain.linearRampToValueAtTime(0,T+48.2);
  // silence total… puis la salle se lève
  K.applaudissements(T+49.2,3.6);
  K.cloche(93,T+52.3,null,.02);
  [[54.1,69],[54.6,72],[55.6,74],[56.2,77]].forEach(([w,m])=>K.piano(m,T+w,.035));
  K.finale(T,58);
}

L.film({duree:58,rendu,partition,affiche:41.2});
})();
