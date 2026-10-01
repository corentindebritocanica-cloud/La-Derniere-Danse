/* Plan 10 — L'étoile filante (30 s) */
(function(){
const L=LDD,{clamp,lerp,eio,eoc,seg}=L,W=L.W,H=L.H,GY=628;

function voiture(t){const p=eoc(seg(t,3,13.5));const carW=-320+1820*p;return{carW,ox:Math.max(0,carW-560),roule:1-p}}
const aube=t=>eio(seg(t,20,27));

const TOUFFES=[];for(let k=0;k<60;k++)TOUFFES.push({wx:k*61+((k*37)%40),h:6+((k*29)%12)});
function route(c,ox,d){
  L.collines(c,ox,.3,478,14,170,63,L.mix('#101d32','#3a3442',d));
  L.collines(c,ox,.6,538,14,120,47,L.mix('#0b1424','#2a2430',d));
  L.cypres(c,ox,.6,538,14,120,47,L.mix('#070c16','#221d25',d));
  c.fillStyle=L.mix('#14110f','#3a2e26',d);c.fillRect(0,586,W,56);
  c.fillStyle=L.mix('#2a241e','#5a4a3a',d);c.fillRect(0,586,W,2);
  const bx=1400-ox;if(bx>-60&&bx<W+60){
    c.fillStyle=L.mix('#b9ae98','#e8dcc2',d);c.fillRect(bx-17,548,34,40);
    c.fillStyle=L.mix('#7a1813','#a8201a',d);c.beginPath();c.moveTo(bx-17,552);c.arc(bx,552,17,Math.PI,0);c.closePath();c.fill();
    c.fillStyle=L.C.encre;c.textAlign='center';L.setLS(c,'0px');c.font="8px "+L.F.machine;c.fillText('TOULOUSE',bx,568);c.font="13px "+L.F.machine;c.fillText('3',bx,582)}
  c.fillStyle=L.mix('#05080e','#1b1714',d);c.fillRect(0,642,W,H-642);
  c.strokeStyle=L.mix('#0c1220','#2a2420',d);c.lineWidth=2;
  for(const tf of TOUFFES){const sx=((tf.wx-ox*1.25)%3700+3700)%3700-100;if(sx<-10||sx>W+10)continue;
    c.beginPath();c.moveTo(sx,646);c.lineTo(sx-3,646-tf.h);c.moveTo(sx+4,646);c.lineTo(sx+6,646-tf.h*.8);c.stroke()}
}
function filante(c,t){
  const s=14.6,e=16.3,A=[360,128],B=[1010,330],dx=B[0]-A[0],dy=B[1]-A[1],Ln=Math.hypot(dx,dy),ux=dx/Ln,uy=dy/Ln;
  c.save();c.globalCompositeOperation='lighter';
  if(t>s&&t<e){
    const p=(t-s)/(e-s),hx=lerp(A[0],B[0],p),hy=lerp(A[1],B[1],p),a=Math.sin(Math.PI*Math.min(1,p*1.15));
    const tl=300*Math.min(1,p*3.5),tx=hx-ux*tl,ty=hy-uy*tl;
    const g=c.createLinearGradient(tx,ty,hx,hy);g.addColorStop(0,'rgba(255,248,230,0)');g.addColorStop(1,`rgba(255,248,230,${.95*a})`);
    c.strokeStyle=g;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(tx,ty);c.lineTo(hx,hy);c.stroke();
    const rg=c.createRadialGradient(hx,hy,0,hx,hy,22);rg.addColorStop(0,`rgba(255,250,240,${a})`);rg.addColorStop(1,'rgba(255,250,240,0)');
    c.fillStyle=rg;c.beginPath();c.arc(hx,hy,22,0,7);c.fill();
    c.strokeStyle=`rgba(241,231,211,${.18*a})`;c.lineWidth=1;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(tx,ty);c.stroke();
  }else if(t>=e&&t<e+1.6){c.strokeStyle=`rgba(241,231,211,${.22*(1-(t-e)/1.6)})`;c.lineWidth=1;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke()}
  c.restore();
}
function heure(c,t){
  const a=seg(t,15.2,15.8)*(1-seg(t,19.3,20));if(a<=0)return;
  c.save();c.globalAlpha=a;c.textAlign='right';
  c.fillStyle=L.C.or;c.font="48px "+L.F.machine;L.setLS(c,'2px');c.fillText('0 h 48',1210,96);
  c.fillStyle=L.C.papier;c.font="italic 22px "+L.F.texte;L.setLS(c,'0px');c.fillText('16 décembre 1925',1210,130);c.restore();
}
const MOTS=[{t:20.6,s:"et toi, tu rêves de quoi ?",dx:-40},{t:21.8,s:"les étoiles, ça se peint ?",dx:60},{t:23.0,s:"raconte encore…",dx:-20},{t:24.2,s:"pas déjà le jour…",dx:50},{t:25.3,s:"encore cinq minutes",dx:0}];
function paroles(c,t,x,gy){
  c.save();c.textAlign='center';c.font="30px "+L.F.main;L.setLS(c,'0px');
  for(const w of MOTS){const p=(t-w.t)/3.4;if(p<0||p>1)continue;c.globalAlpha=Math.sin(Math.PI*p)*.95;c.fillStyle='#f6ecd8';c.fillText(w.s,x+90+w.dx+p*14,gy-130-p*90)}
  c.restore();
}
const OUVERTURE=[{s:'TOULOUSE · ROUTE DE PURPAN',y:300,f:"20px "+L.F.machine,c:'#b9a98c',ls:'6px'},{s:'Un peu avant une heure du matin…',y:380,f:"italic 48px "+L.F.texte}];
const FIN=[{s:'Ils ont parlé jusqu’à l’aube.',y:350,f:"italic 52px "+L.F.texte},{s:'FIN DU PLAN',y:420,f:"20px "+L.F.titre,c:L.C.or,ls:'8px'}];

function rendu(c,t){
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(t>2.9&&t<27.6){
    const d=aube(t),v=voiture(t),x=v.carW-v.ox;
    L.ciel(c,d);L.etoiles(c,t,d,.28*eio(seg(t,20,26.5)));filante(c,t);
    L.toulouse(c,1000-v.ox*.08,472,d);route(c,v.ox,d);
    L.phares(c,x+190,GY-70,1-d*.7);
    const look=eoc(seg(t,14.9,15.5))*(1-eio(seg(t,20,21.2))),lean=eio(seg(t,20.4,21.9)),gy=GY+Math.sin(t*28)*1.3*v.roule;
    const tetes=L.mini(c,x,gy,{roue:v.carW/24,louise:{look,lean},celestin:{look,lean}});
    const reflet=clamp(1-Math.abs(t-15.35)/.25,0,1);
    if(reflet>0&&tetes.celestin){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,250,235,${reflet})`;c.beginPath();c.arc(tetes.celestin.x+6,tetes.celestin.y-1,2+reflet*2,0,7);c.fill();c.restore()}
    heure(c,t);paroles(c,t,x,gy);
  }
  L.noir(c,t<3?1:t<4?1-(t-3):t>26.6?(t-26.6)/.8:0);
  L.carton(c,OUVERTURE,t<.6?t/.6:t<2.4?1:Math.max(0,1-(t-2.4)/.6),450);
  L.carton(c,FIN,t<27.4?0:Math.min(1,(t-27.4)/.8),480);
}

function partition(ac,sortie,T){
  const K=L.kit(ac,sortie),b=.625,S=T+3;
  K.projecteur(T,30,[[14.3,19.8]]);
  const musique=K.bus();
  ['Dm9','G13','Cmaj9','A7b9'].forEach((nom,i)=>{[0,1.5].forEach(o=>K.accord(nom,S+(i*4+o)*b,.028,musique));
    L.THEME.basses[nom].forEach((m,k)=>K.basse(m,S+(i*4+k)*b,musique));[1,3].forEach(k=>K.charleston(S+(i*4+k)*b,musique,.05))});
  K.accord('Dm9',S+16*b,.028,musique);
  [[1,69,1],[2,72,.5],[2.5,74,.5],[3,77,1.5],[4.5,76,.5],[5,74,1],[6,71,.5],[6.5,72,1.5],[8,72,.5],[8.5,74,.5],[9,76,1],[10,79,1],[11,76,.5],[11.5,74,.5],[12,73,2],[14,76,1],[15,79,2.6]]
    .forEach(([o,m,d])=>K.trompette(m,S+o*b,d*b*.95,musique));
  musique.gain.setValueAtTime(1,T+14.3);musique.gain.linearRampToValueAtTime(0,T+14.45);
  [[15.0,91],[15.35,86],[15.9,88],[16.6,93]].forEach(([w,m])=>K.cloche(m,T+w));
  const aubeBus=K.bus();
  K.nappeAccord('Fmaj9',T+20.4,4.4,aubeBus);K.nappeAccord('Bbmaj7',T+24.4,3,aubeBus);K.nappeAccord('Fadd9',T+27.2,3,aubeBus);
  K.phrase(L.THEME.lent,T+20.8,.7,'violon',aubeBus);
  K.finale(T,30.4);
}

L.film({duree:30,rendu,partition,affiche:15.75});
})();
