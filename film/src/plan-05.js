/* Plan 05 — La danse qui n'existe pas encore (33 s) */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,P=L.POSES,SOL=L.SOL,B=.5;

/* ---------- chorégraphie ---------- */
function danseurs(t){
  let C={x:470,F:1,p:P.debout,z:0},Lo={x:820,F:-1,p:P.timide,z:1},flare=0;
  const souffle=Math.sin(t*2.2)*.02;
  if(t<7){C.p=L.melange(P.debout,P.debout,0);C.p.tA+=souffle;Lo.p=L.melange(P.timide,P.timide,0);Lo.p.tA+=souffle}
  else if(t<10){
    const w=seg(t,7,8.1);C.x=lerp(470,570,eio(w));C.p=w<1&&w>0?L.pas(P.debout,(t-7)*9,.32,0):P.debout;
    C.p=L.melange(C.p,P.invite,eio(seg(t,8.1,8.7)));
    Lo.p=L.melange(P.timide,P.debout,eio(seg(t,8.6,9.1)));
    const lw=seg(t,9,9.7);Lo.x=lerp(820,684,eio(lw));if(lw>0&&lw<1)Lo.p=L.pas(Lo.p,(t-9)*9,.3,0);
    const h=eio(seg(t,9.6,10));C.p=L.melange(C.p,P.tenue,h);Lo.p=L.melange(Lo.p,P.tenue,h);
  }
  else if(t<14){
    const ph=(t-10)/B*Math.PI,X=627+28*Math.sin((t-10)*Math.PI/2);
    C.x=X-57;Lo.x=X+57;C.p=L.pas(P.tenue,ph,.3,0);Lo.p=L.pas(P.tenue,ph+Math.PI,.3,0);
    C.p.tA+=.05*Math.sin(ph);Lo.p.tA+=.05*Math.sin(ph);
  }
  else if(t<16.5){
    const p=seg(t,14,16.5),ang=eio(p)*7*Math.PI;
    C.x=575;Lo.x=690;C.p=L.melange(P.tenue,P.bras_leve,eio(seg(t,14,14.3)));C.p=L.melange(C.p,P.promenade,eio(seg(t,16.1,16.5)));
    Lo.F=-Math.cos(ang);Lo.p=L.melange(P.tenue,P.bras_leve,eio(seg(t,14,14.3)));Lo.p=L.pas(Lo.p,(t-14)*14,.12,0);Lo.p=L.melange(Lo.p,P.promenade,eio(seg(t,16.1,16.5)));
    flare=Math.sin(Math.PI*p);
  }
  else if(t<20){
    const p=eio(seg(t,16.5,20)),base=lerp(560,780,p),ph=(t-16.5)/B*Math.PI;
    const temps=((t-16.5)/B)%2,coup=temps>1?Math.sin((temps-1)*Math.PI):0;
    C.x=base;Lo.x=base+62;Lo.F=1;Lo.z=-1;
    C.p=L.pas(P.promenade,ph,.3,coup);Lo.p=L.pas(P.promenade,ph,.3,coup);Lo.p.aF=[.6,.3];
    flare=.25*coup;
  }
  else if(t<24){
    const demi=Math.cos(Math.PI*eio(seg(t,20,20.4)));
    const p=seg(t,20.3,24),th=Math.pow(p,1.25)*6*Math.PI,X=lerp(780,640,eio(seg(t,20,21)));
    const cs=Math.cos(th),sn=Math.sin(th);
    C.x=X-58*cs;Lo.x=X+58*cs;C.F=cs;Lo.F=t<20.3?demi:-cs;C.z=sn;Lo.z=-sn;
    C.p=L.pas(P.tenue,(t-20)*16,.18,0);Lo.p=L.pas(P.tenue,(t-20)*16+Math.PI,.18,0);
    C.p.tA-=.12*Math.min(1,p*3);Lo.p.tA-=.12*Math.min(1,p*3);
    flare=.5+.5*Math.sin(Math.PI*p);
  }
  else{
    const u=eoc(seg(t,24,24.6));C.x=600;Lo.x=lerp(698,712,u);
    C.p=L.melange(P.tenue,P.renverse_C,u);Lo.p=L.melange(P.tenue,P.renverse_L,u);flare=.35*(1-u)+.15;
  }
  return{C,L:Lo,flare};
}

/* ---------- chaque pas allume un rayon ---------- */
const RR=L.rng(1412),ordre=[...Array(24).keys()].sort(()=>RR()-.5);
function rayon(t,i){const k=ordre.indexOf(i),tk=10+k*B;let v=t<tk?0:.55+.45*Math.exp(-(t-tk)*2.5);
  const fin=seg(t,24.2,24.5);return Math.max(v,fin*(.8+.2*Math.exp(-(t-24.3)*1.2)))}
function etincelles(c,t){
  c.save();c.globalCompositeOperation='lighter';
  for(let k=0;k<28;k++){const tk=10+k*B,age=t-tk;if(age<0||age>.8)continue;
    const st=danseurs(tk),d=k%2?st.L:st.C,x=d.x,a=1-age/.8;
    c.strokeStyle=`rgba(255,215,120,${.8*a})`;c.lineWidth=2;c.beginPath();c.ellipse(x,SOL+2,14+age*90,3+age*14,0,0,7);c.stroke();
    c.fillStyle=`rgba(255,235,180,${.5*a})`;for(let i=0;i<5;i++){const an=-Math.PI*(i+.5)/5;c.fillRect(x+Math.cos(an)*age*70,SOL+Math.sin(an)*age*60,2,2)}}
  c.restore();
}

const OUVERTURE=[
  {s:'CABARET DES ÉTOILES · SAMEDI 14 DÉCEMBRE',y:290,f:"20px "+L.F.machine,c:'#b9a98c',ls:'5px'},
  {s:'Le peintre et la débutante.',y:372,f:"italic 50px "+L.F.texte},
  {s:'Personne ne leur a dit quelle danse danser.',y:418,f:"italic 24px "+L.F.texte,c:'#b9a98c'}];
const FIN=[
  {s:'Une danse qui n’existait pas encore.',y:350,f:"italic 50px "+L.F.texte},
  {s:'FIN DU PLAN',y:420,f:"20px "+L.F.titre,c:L.C.or,ls:'8px'}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,L.W,L.H);
  if(t>2.9&&t<29.4){
    const st=danseurs(t),vac=t<4.2?(Math.random()<.3?.4:1):1,spot=eoc(seg(t,3.6,4.1))*vac,X=(st.C.x+st.L.x)/2;
    c.save();const zm=1.2+.04*eio(seg(t,10,24));c.translate(640,560);c.scale(zm,zm);c.translate(-640,-560);
    const es=eoc(seg(t,24.25,24.8));
    L.cabaret(c,{spot,X,rayon:i=>rayon(t,i),etoile:es,pulse:1+.05*Math.sin((t-24.8)*5),enseigne:0});
    const joue=t>10&&t<24.4;
    L.leon(c,1040,556,joue?.35+(t>20&&t<24.4?.3:0):0,joue?Math.abs(Math.sin((t-10)*Math.PI/B))*-4:0);
    c.fillStyle='rgba(0,0,0,.45)';[st.C,st.L].forEach(d=>{c.beginPath();c.ellipse(d.x,SOL+3,34,6,0,0,7);c.fill()});
    (st.C.z<=st.L.z?[['C',st.C],['L',st.L]]:[['L',st.L],['C',st.C]]).forEach(([k,d])=>L.pantin(c,d,k,st.flare));
    etincelles(c,t);
    c.restore();
    c.fillStyle=L.C.or;c.font="26px "+L.F.titre;c.textAlign='center';L.setLS(c,'6px');c.globalAlpha=.55+.45*spot;c.fillText('CABARET DES ÉTOILES',640,108);c.globalAlpha=1;L.setLS(c,'0px');
    L.public(c,t,seg(t,24.6,25)*(1-seg(t,28.5,29.4)));
    const fl=t>24.3?Math.exp(-(t-24.3)*6):0;if(fl>.01){c.fillStyle=`rgba(255,245,225,${.5*fl})`;c.fillRect(0,0,L.W,L.H)}
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>28.4?(t-28.4)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),476);
  L.carton(c,FIN,t<29.2?0:Math.min(1,(t-29.2)/.8),480);
}

/* ---------- son ---------- */
function partition(ac,sortie,T){
  const K=L.kit(ac,sortie),TH=L.THEME;
  K.projecteur(T,33);
  K.nappe(T+2.9,4.3,'lowpass',650,.7,[[.7,.05],[2.9,.05],[4.1,0]]);
  K.roulement(T+4.6,T+6.9);K.cymbale(T+6.95,null,.05,.9);
  K.piano(69,T+8.2,.05);K.piano(76,T+8.2,.03);
  K.souffle(74,T+9.75,1.1,{g:.05,cut:1500,att:.12});
  const orch=K.bus(),S=T+10;
  K.orchestre(S,B,['Dm9','G13','Cmaj9','A7b9','Dm9','G13','A7'],orch);
  [[1,69,1],[2,72,.5],[2.5,74,.5],[3,77,1],[4,76,.5],[4.5,74,.5],[5,71,.5],[5.5,72,2],
   [8,74,.25],[8.25,76,.25],[8.5,77,.25],[8.75,79,.25],[9,81,1.5],[10.5,79,.5],
   [12,77,.5],[12.5,76,.5],[13,74,.5],[13.5,73,1.5],
   [16,69,.5],[16.5,72,.5],[17,74,.5],[17.5,77,.5],[18,76,1],[19,74,1],
   [20,69,.5],[20.5,72,.5],[21,76,.5],[21.5,79,.5],[22,81,.5],[22.5,84,.5],[23,81,.5],[23.5,79,.5],
   [24,79,.5],[24.5,81,.5],[25,84,.5],[25.5,86,2.2]].forEach(([o,m,d])=>K.trompette(m,S+o*B,d*B*.95,orch));
  K.nappe(T+22.4,2,'highpass',5000,.5,[[0,.0001],[1.85,.05],[1.92,0]],orch);
  orch.gain.setValueAtTime(1,T+24.2);orch.gain.linearRampToValueAtTime(0,T+24.3);
  const fin=T+24.3;K.accord('D69',fin,.05);K.souffle(86,fin,1.3,{g:.06,cut:2200,vib:6,att:.02});K.souffle(78,fin,1.3,{g:.04,cut:2000,vib:6,att:.02});
  K.cymbale(fin,null,.09,2.2);
  K.applaudissements(T+24.6,4.4);
  [[0,69],[.45,72],[.9,74],[1.35,77],[2.4,76],[2.85,74],[3.3,72]].forEach(([o,m])=>K.piano(m,T+29.4+o,.05));
  K.finale(T,33.2);
}

L.film({duree:33,rendu,partition,affiche:15.15});
})();
