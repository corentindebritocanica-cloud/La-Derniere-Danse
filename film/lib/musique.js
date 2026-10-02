/* La Dernière Danse — musique commune
   Instruments synthétisés (Web Audio) et « le morceau sans nom » de Léon. */
(function(){
const L=window.LDD=window.LDD||{};
L.mf=m=>440*Math.pow(2,(m-69)/12);

/* Le thème : [temps en battements, note MIDI, durée en battements] */
L.THEME={
  motif:[[0,69,1],[1,72,.5],[1.5,74,.5],[2,77,1.5],[3.5,76,.5],[4,74,1],[5,71,.5],[5.5,72,1.5]],
  reponse:[[0,72,.5],[.5,74,.5],[1,76,1],[2,79,1],[3,76,.5],[3.5,74,.5],[4,73,2]],
  lent:[[0,69,1.5],[1.5,72,.75],[2.25,74,.75],[3,77,2.5],[5.5,76,.75],[6.25,74,.75],[7,72,1.5],[8.5,69,3]],
  accords:{Dm9:[50,53,57,60,64],G13:[43,53,59,64],Cmaj9:[48,52,55,59,62],A7b9:[45,55,61,70],A7:[45,55,61,67],Fmaj9:[53,57,60,64,67],Bbmaj7:[46,53,57,62],Fadd9:[41,53,57,60,67],D69:[38,50,57,62,66,69,71,74],Am9:[45,48,52,55,59]},
  basses:{Dm9:[38,40,41,45],G13:[43,45,47,50],Cmaj9:[36,38,40,43],A7b9:[45,49,52,43],A7:[45,47,49,52]},
  grille:['Dm9','G13','Cmaj9','A7b9']
};

/* Trousse d'instruments reliée à une sortie */
L.kit=function(ac,sortie){
  const out=ac.createGain();out.connect(sortie);
  const nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const lp=f=>{const n=ac.createBiquadFilter();n.type='lowpass';n.frequency.value=f;return n};
  const env=(g,t0,a,peak,dec)=>{g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+a+dec)};
  const K={ac,out,nb,lp,env,mf:L.mf,
    bus(){const g=ac.createGain();g.connect(out);return g},
    noise(w,dur,type,f,q,g0,att,dest){const s=ac.createBufferSource();s.buffer=nb;s.loop=true;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();
      g.gain.setValueAtTime(0.0001,w);g.gain.linearRampToValueAtTime(g0,w+att);g.gain.exponentialRampToValueAtTime(0.0001,w+att+dur);s.connect(fl).connect(g).connect(dest||out);s.start(w,Math.random()*1.5);s.stop(w+att+dur+.05);return g},
    /* bruit continu filtré ; points = [[temps, gain], …] (paliers linéaires) */
    nappe(T,fin,type,f,q,points,dest){const s=ac.createBufferSource();s.buffer=nb;s.loop=true;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();
      g.gain.setValueAtTime(0,T);points.forEach(([t,v])=>g.gain.linearRampToValueAtTime(v,T+t));s.connect(fl).connect(g).connect(dest||out);s.start(T);s.stop(T+fin);return g},
    /* ronronnement du projecteur, avec silences [[de, à], …] */
    projecteur(T,fin,silences){const pts=[[.6,.016]];(silences||[]).forEach(([a,b])=>{pts.push([a,.016],[a+.15,0],[b,0],[b+1,.014])});pts.push([fin-.6,.014],[fin,0]);return K.nappe(T,fin+.2,'bandpass',2400,.6,pts)},
    gramophone(T,fin){K.nappe(T,fin,'bandpass',3200,.4,[[.3,.03],[fin-.4,.03],[fin,0]]);
      for(let i=0;i<fin*5;i++){const w=T+Math.random()*fin;K.noise(w,.012,'highpass',3000,.5,.02+Math.random()*.05,.001)}},
    piano(m,w,g0,dest){const o=ac.createOscillator();o.type='triangle';o.frequency.value=L.mf(m);const g=ac.createGain();env(g,w,.006,g0==null?.03:g0,1.3);o.connect(lp(2300)).connect(g).connect(dest||out);o.start(w);o.stop(w+1.5)},
    accord(nom,w,g0,dest){L.THEME.accords[nom].forEach(m=>K.piano(m,w,g0,dest))},
    basse(m,w,dest,g0){const o=ac.createOscillator();o.type='sine';o.frequency.value=L.mf(m);const g=ac.createGain();env(g,w,.01,g0||.2,.5);o.connect(g).connect(dest||out);o.start(w);o.stop(w+.65)},
    grosseCaisse(w,dest){const o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(110,w);o.frequency.exponentialRampToValueAtTime(45,w+.12);const g=ac.createGain();env(g,w,.003,.18,.18);o.connect(g).connect(dest||out);o.start(w);o.stop(w+.25)},
    charleston(w,dest,g0){K.noise(w,.08,'highpass',7000,.7,g0||.045,.002,dest)},
    roulement(a,b,dest){for(let w=a;w<b;w+=.045)K.noise(w,.04,'bandpass',1800,.8,.008+.03*((w-a)/(b-a)),.003,dest)},
    cymbale(w,dest,g0,dur){K.noise(w,dur||1.8,'highpass',4500,.5,g0||.08,.004,dest)},
    /* trompette (ou violon avec d'autres réglages) */
    souffle(m,w,dur,o2,dest){o2=o2||{};const g0=o2.g||.05,cut=o2.cut||1700,vib=o2.vib||5.5,att=o2.att||.04;
      const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=L.mf(m);
      const l=ac.createOscillator();l.frequency.value=vib;const lg=ac.createGain();lg.gain.setValueAtTime(0,w);lg.gain.linearRampToValueAtTime(L.mf(m)*.006,w+Math.min(.35,dur));l.connect(lg).connect(o.frequency);
      const g=ac.createGain();g.gain.setValueAtTime(0.0001,w);g.gain.linearRampToValueAtTime(g0,w+att);g.gain.setValueAtTime(g0,w+Math.max(att,dur-.08));g.gain.linearRampToValueAtTime(0.0001,w+dur+.1);
      const f=lp(cut);f.Q.value=1.2;o.connect(f).connect(g).connect(dest||out);o.start(w);l.start(w);o.stop(w+dur+.2);l.stop(w+dur+.2)},
    trompette(m,w,dur,dest,g0){K.souffle(m,w,dur,{g:g0||.05,cut:1700},dest)},
    violon(m,w,dur,dest,g0){K.souffle(m,w,dur,{g:g0||.035,cut:2600,vib:6,att:.25},dest)},
    nappeAccord(nom,w,dur,dest,g0){L.THEME.accords[nom].forEach(m=>[-4,4].forEach(dt=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=L.mf(m);o.detune.value=dt;const g=ac.createGain();
      g.gain.setValueAtTime(0.0001,w);g.gain.linearRampToValueAtTime(g0||.012,w+1.5);g.gain.setValueAtTime(g0||.012,w+dur-1);g.gain.linearRampToValueAtTime(0.0001,w+dur+.6);o.connect(lp(900)).connect(g).connect(dest||out);o.start(w);o.stop(w+dur+.7)}))},
    cloche(m,w,dest,g0){[1,2.76].forEach((h,k)=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=L.mf(m)*h;const g=ac.createGain();env(g,w,.004,k?(g0||.06)*.3:(g0||.06),3.6);o.connect(g).connect(dest||out);o.start(w);o.stop(w+3.8)})},
    /* joue une phrase du thème : notes [[b,m,d]], battement b secondes, instrument 'trompette'|'violon'|'piano' */
    phrase(notes,w,b,instr,dest,g0){notes.forEach(([o,m,d])=>{if(instr==='piano')K.piano(m,w+o*b,g0||.05,dest);else K[instr](m,w+o*b,d*b*.95,dest,g0)})},
    /* l'orchestre de Léon : grille d'accords en charleston, contrebasse qui marche, batterie */
    orchestre(w,b,grille,dest,o2){o2=o2||{};grille.forEach((nom,i)=>{const x=w+i*4*b;
      [0,1.5].forEach(o=>K.accord(nom,x+o*b,o2.piano||.026,dest));(L.THEME.basses[nom]||L.THEME.basses.Dm9).forEach((m,k)=>K.basse(m,x+k*b,dest));
      if(o2.batterie!==false){[0,2].forEach(k=>K.grosseCaisse(x+k*b,dest));[1,3].forEach(k=>K.charleston(x+k*b,dest));[1.5,3.5].forEach(k=>K.charleston(x+k*b,dest,.02))}})},
    applaudissements(a,dur,dest){for(let i=0;i<120*dur;i++){const w=a+Math.pow(Math.random(),1.6)*dur;K.noise(w,.035,'bandpass',1200+Math.random()*1600,1.2,.03*(1-(w-a)/(dur+.6)),.002,dest)}},
    finale(T,fin){out.gain.setValueAtTime(1,T+fin-.8);out.gain.linearRampToValueAtTime(0,T+fin)}
  };
  return K;
};
})();
