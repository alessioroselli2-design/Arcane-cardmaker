// card.js — motore di disegno carte (versione con riquadri come esempio)

// ===== Stato globale =====
export const state = {
  // titolo/descrizione
  title:'', mana:'', showMana:true,
  titleFont:'"Cinzel",serif', titleSize:42, titleColor:'#ffffff',
  titleFoil:'none',          // none | foil-gold | foil-silver | foil-rainbow
  titleShadow:false,         // ombra del titolo
  descText:'', descFont:'"Spectral",serif', descSize:18, descColor:'#111111',
  // pannelli/cornice
  // (i controlli panelColor/panelAlpha sono ignorati per riprodurre esattamente il look richiesto)
  panelColor:'#cdbb7d', panelAlpha:.85,
  frameStyle:'flat', frameColor:'#d8cfae', innerColor:'#f7f5ef',
  // simbolo classe
  classSource:'db', clazz:'guerriero', classSize:64,
  imgClass:null, classX:null, classY:null,
  // immagini
  imgFront:null, imgBack:null
};
window.state = state;

// ===== Canvas =====
const frontCanvas = document.getElementById('cardFront');
const backCanvas  = document.getElementById('cardBack');
const ctxF = frontCanvas.getContext('2d');
const ctxB = backCanvas.getContext('2d');

// ===== Icone DB (demo) =====
const ICONS = {
  guerriero:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10 l12 18 h18 l-15 12 6 20 -21-12 -21 12 6-20 -15-12 h18z' fill='#e7d08a' stroke='#2a1d0a' stroke-width='2'/><rect x='42' y='60' width='16' height='22' rx='4' fill='#f4f1e6' stroke='#2a1d0a' stroke-width='2'/></svg>`,
  druido:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10 C28 36,26 60,50 90 C74 60,72 36,50 10 Z' fill='#6da86a' stroke='#1c3d19' stroke-width='2'/></svg>`,
  monaco:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='32' fill='none' stroke='#caa96b' stroke-width='6'/><path d='M50 18 v64' stroke='#caa96b' stroke-width='6'/></svg>`,
  mago:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 16 l22 40 -44 0 z' fill='#5aa3ff'/><circle cx='50' cy='66' r='6' fill='#fff'/></svg>`,
  ladro:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M18 40 h64 v20 h-64 z' fill='#333'/><circle cx='34' cy='50' r='6' fill='#ddd'/><circle cx='66' cy='50' r='6' fill='#ddd'/></svg>`,
  barbaro:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 30 l20 0 0 40 -20 0 z M80 30 l-20 0 0 40 20 0 z' fill='#9b4d2e'/><rect x='45' y='20' width='10' height='60' fill='#5b371f'/></svg>`,
  paladino:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 20 h60 v28 c0 24 -30 36 -30 36 s-30 -12 -30 -36 z' fill='#e0d8a8' stroke='#8a7b45' stroke-width='2'/></svg>`,
  chierico:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M48 16 h4 v28 h28 v4 h-28 v28 h-4 v-28 h-28 v-4 h28 z' fill='#d9d1c0'/></svg>`,
  bardo:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M30 20 c40 0 40 60 0 60' fill='none' stroke='#d6a' stroke-width='6'/><circle cx='54' cy='48' r='6' fill='#fff'/></svg>`,
  ranger:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 80 l60 -60' stroke='#4a8f3b' stroke-width='6'/><path d='M68 26 l12 -6 -6 12 z' fill='#4a8f3b'/></svg>`,
  stregone:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='22' fill='none' stroke='#9cf' stroke-width='4'/><circle cx='50' cy='50' r='6' fill='#9cf'/></svg>`,
  warlock:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 16 l16 20 -16 48 -16 -48 z' fill='#7d4bb3'/></svg>`,
  artificiere:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='22' y='38' width='56' height='24' rx='6' fill='#aaa'/><circle cx='34' cy='50' r='6' fill='#333'/><circle cx='66' cy='50' r='6' fill='#333'/></svg>`
};
window.ICONS = ICONS;

// ===== Util =====
function svgToImage(svg,cb){const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);const img=new Image();img.onload=()=>cb(img);img.src=url;}
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function cover(c,img,dx,dy,dw,dh,r=0){const ir=img.width/img.height,dr=dw/dh;let sx,sy,sw,sh;if(ir>dr){sh=img.height;sw=sh*dr;sx=(img.width-sw)/2;sy=0;}else{sw=img.width;sh=sw/dr;sx=0;sy=(img.height-sh)/2;} if(r>0){c.save();rr(c,dx,dy,dw,dh,r);c.clip();} c.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh); if(r>0)c.restore();}

// ===== Foil gradiente =====
function makeFoilGradient(ctx, x, y, w, h, kind='gold'){
  const g = ctx.createLinearGradient(x, y, x+w, y+h);
  if (kind === 'gold'){
    g.addColorStop(0.00, '#6b4e00');
    g.addColorStop(0.25, '#f3d36b');
    g.addColorStop(0.50, '#9a6f00');
    g.addColorStop(0.75, '#ffe8a3');
    g.addColorStop(1.00, '#6b4e00');
  } else if (kind === 'silver'){
    g.addColorStop(0.00, '#3a3a3a');
    g.addColorStop(0.25, '#dcdcdc');
    g.addColorStop(0.50, '#7a7a7a');
    g.addColorStop(0.75, '#f1f1f1');
    g.addColorStop(1.00, '#3a3a3a');
  } else { // rainbow
    g.addColorStop(0.00, '#ff0040');
    g.addColorStop(0.20, '#ffa000');
    g.addColorStop(0.40, '#ffe600');
    g.addColorStop(0.60, '#00d060');
    g.addColorStop(0.80, '#4090ff');
    g.addColorStop(1.00, '#b040ff');
  }
  return g;
}

// ===== Texture semplici =====
function textureWood(ctx, x, y, w, h){
  ctx.fillStyle = '#b08b57'; ctx.fillRect(x,y,w,h);
  ctx.globalAlpha=0.25; ctx.strokeStyle='#7a5a2b';
  for(let i=0;i<6;i++){ ctx.beginPath(); const off=i*(w/6); ctx.moveTo(x+off, y+h*0.1); ctx.bezierCurveTo(x+off+w/12,y+h*0.3, x+off+w/12,y+h*0.7, x+off, y+h*0.9); ctx.stroke(); }
  ctx.globalAlpha=1;
}
function textureStone(ctx, x, y, w, h){
  ctx.fillStyle = '#a4a6ab'; ctx.fillRect(x,y,w,h);
  ctx.globalAlpha=0.35; ctx.fillStyle='#000';
  for(let i=0;i<60;i++){ const rx=x+Math.random()*w, ry=y+Math.random()*h, rr2=1+Math.random()*2; ctx.beginPath(); ctx.arc(rx,ry,rr2,0,Math.PI*2); ctx.fill(); }
  ctx.globalAlpha=1;
}
function textureArcane(ctx, x, y, w, h){
  const g=ctx.createLinearGradient(x,y,x+w,y+h); g.addColorStop(0,'#1b1733'); g.addColorStop(1,'#2f0f4a'); ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  ctx.globalAlpha=.25; ctx.strokeStyle='#8ad9ff';
  for(let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(x+w*(0.3+i*0.2), y+h*(0.3), w*0.12, 0, Math.PI*2); ctx.stroke(); }
  ctx.globalAlpha=1;
}
function textureNature(ctx, x, y, w, h){
  const g=ctx.createLinearGradient(x,y,x+w,y+h); g.addColorStop(0,'#305d34'); g.addColorStop(1,'#264d2a'); ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  ctx.globalAlpha=.3; ctx.strokeStyle='#86c27a';
  for(let i=0;i<40;i++){ const rx=x+Math.random()*w, ry=y+Math.random()*h; ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+3,ry-6); ctx.stroke(); }
  ctx.globalAlpha=1;
}

// ===== Cornice =====
function paintFrame(c,W,H){
  const outer = {x:12,y:12,w:W-24,h:H-24,r:22};
  const inner = {x:28,y:28,w:W-56,h:H-56,r:18};

  c.save();
  c.beginPath();
  rr(c,outer.x,outer.y,outer.w,outer.h,outer.r);
  c.save();

  if (state.frameStyle === 'flat'){
    c.fillStyle = state.frameColor;
    c.fill();
  } else if (state.frameStyle.startsWith('foil-')){
    const kind = state.frameStyle.replace('foil-','');
    c.fillStyle = makeFoilGradient(c, outer.x, outer.y, outer.w, outer.h, kind);
    c.fill();
  } else {
    const off = document.createElement('canvas'); off.width=W; off.height=H;
    const cx = off.getContext('2d');
    if (state.frameStyle==='wood')  textureWood(cx, outer.x, outer.y, outer.w, outer.h);
    if (state.frameStyle==='stone') textureStone(cx, outer.x, outer.y, outer.w, outer.h);
    if (state.frameStyle==='arcane')textureArcane(cx, outer.x, outer.y, outer.w, outer.h);
    if (state.frameStyle==='nature')textureNature(cx, outer.x, outer.y, outer.w, outer.h);
    c.drawImage(off,0,0);
  }

  // ritaglia l'interno
  c.globalCompositeOperation='destination-out';
  rr(c,inner.x,inner.y,inner.w,inner.h,inner.r);
  c.fill();
  c.restore();

  // area interna
  rr(c,inner.x,inner.y,inner.w,inner.h,inner.r);
  c.fillStyle=state.innerColor;
  c.fill();
  c.restore();
}

function defaultSymbolPos(){const W=750,s=state.classSize,right=W-44,y=71-s/2;state.classX=right-s;state.classY=y;}

// ===== Disegno front =====
export function drawFront(){
  const W=750,H=1050; ctxF.clearRect(0,0,W,H); paintFrame(ctxF,W,H);

  // === Riquadro TITOLO (stile come nel tuo esempio) ===
  // pill verde chiaro con bordo tenue e leggero highlight superiore
  const t = {x:28, y:28, w:W-56, h:86, r:16};
  rr(ctxF, t.x, t.y, t.w, t.h, t.r);
  ctxF.fillStyle = '#e6f2e6';        // riempimento molto chiaro
  ctxF.fill();
  ctxF.lineWidth = 2;
  ctxF.strokeStyle = '#89b97f';      // bordo verde tenue
  ctxF.stroke();
  // highlight morbido in alto
  const gTop = ctxF.createLinearGradient(0,t.y,0,t.y+t.h*0.6);
  gTop.addColorStop(0,'rgba(255,255,255,.65)');
  gTop.addColorStop(1,'rgba(255,255,255,0)');
  ctxF.save();
  rr(ctxF, t.x+2, t.y+2, t.w-4, t.h*0.45, t.r-4);
  ctxF.clip();
  ctxF.fillStyle = gTop; ctxF.fillRect(t.x, t.y, t.w, t.h*0.6);
  ctxF.restore();

  // === Riquadro DESCRIZIONE (bianco con bordo) ===
  const b = {x:28, y:610, w:W-56, h:412, r:18};
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = '#fcfcf8';        // quasi bianco
  ctxF.fill();
  ctxF.lineWidth = 2;
  ctxF.strokeStyle = 'rgba(122,177,114,.7)'; // bordo verde leggero
  ctxF.stroke();

  // immagine centrale
  const ax=44,ay=132,aw=W-88,ah=460;
  if(state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18);
  else{ ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }

  // TITOLO (foil/ombra opzionali)
  const titleArea = t;
  ctxF.textBaseline='middle'; ctxF.textAlign='left';
  ctxF.font=`700 ${state.titleSize}px ${state.titleFont}`;

  if(state.titleShadow){
    ctxF.shadowColor='rgba(0,0,0,.55)'; ctxF.shadowBlur=8; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=2;
  } else {
    ctxF.shadowColor='transparent'; ctxF.shadowBlur=0; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=0;
  }

  if(state.titleFoil !== 'none'){
    const kind = state.titleFoil.replace('foil-','');
    ctxF.fillStyle = makeFoilGradient(ctxF, titleArea.x, titleArea.y, titleArea.w, titleArea.h, kind);
  } else {
    ctxF.fillStyle = state.titleColor;
  }

  ctxF.fillText(state.title||'',44,71,520);

  // simbolo
  if(state.imgClass){ if(state.classX==null||state.classY==null) defaultSymbolPos(); cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10); }

  // mana
  if(state.showMana && (state.mana||'').trim()){
    ctxF.fillStyle='#222';
    ctxF.shadowColor='transparent';
    ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`; ctxF.textAlign='right';
    const right=750-44; const x = state.imgClass ? Math.min(right-8,(state.classX??(right-40))-10) : right;
    ctxF.fillText(state.mana, x, 71); ctxF.textAlign='left';
  }

  // descrizione (+ **grassetto** semplice)
  const bx=b.x+12, by=b.y+8, bw=b.w-24, bh=b.h-16;
  ctxF.save(); rr(ctxF,bx-12,by-8,bw+24,bh+16,b.r-2); ctxF.clip();
  ctxF.fillStyle=state.descColor; ctxF.font=`400 ${state.descSize}px ${state.descFont}`;
  const text=(state.descText||''); const words=text.split(/(\*\*.*?\*\*)|\s+/g).filter(Boolean); let line='',yy=by+18;
  function flush(){ctxF.fillText(line,bx,yy); line=''; yy+=state.descSize*1.45;}
  words.forEach(tok=>{ let chunk=tok; let bold=false; if(/^\*\*.*\*\*$/.test(tok)){bold=true; chunk=tok.slice(2,-2);} const test=line+chunk+(chunk.match(/\s/)?'':' ');
    if(ctxF.measureText(test).width>bw && line) flush();
    if(bold){ ctxF.save(); ctxF.font=`700 ${state.descSize}px ${state.descFont}`; ctxF.fillText(chunk,bx,yy); ctxF.restore(); line+=' '; }
    else line+=chunk+(chunk.match(/\s/)?'':' '); });
  if(line.trim()) ctxF.fillText(line,bx,yy); ctxF.restore();
}

// ===== Disegno retro =====
export function drawBack(){
  const W=750,H=1050; ctxB.clearRect(0,0,W,H); paintFrame(ctxB,W,H);
  if(state.imgBack) cover(ctxB,state.imgBack,28,28,W-56,H-56,18);
  else{ ctxB.save(); rr(ctxB,40,40,W-80,H-80,14); ctxB.fillStyle='#d5d5d5'; ctxB.globalAlpha=.35; ctxB.fill(); ctxB.restore();
    ctxB.fillStyle='#6b7280'; ctxB.font='16px Inter,sans-serif'; ctxB.fillText('Carica immagine retro (full-bleed)', 48, 62);}
}

// ===== Drag simbolo =====
let dragging=false,dx=0,dy=0;
frontCanvas.addEventListener('pointerdown',e=>{
  if(!state.imgClass) return; const rect=frontCanvas.getBoundingClientRect(),sx=frontCanvas.width/rect.width,sy=frontCanvas.height/rect.height;
  const x=(e.clientX-rect.left)*sx, y=(e.clientY-rect.top)*sy, s=state.classSize;
  if(x>=state.classX&&x<=state.classX+s&&y>=state.classY&&y<=state.classY+s){dragging=true;dx=x-state.classX;dy=y-state.classY; frontCanvas.setPointerCapture(e.pointerId);}
});
frontCanvas.addEventListener('pointermove',e=>{
  if(!dragging) return; const rect=frontCanvas.getBoundingClientRect(),sx=frontCanvas.width/rect.width,sy=frontCanvas.height/rect.height;
  let nx=(e.clientX-rect.left)*sx-dx, ny=(e.clientY-rect.top)*sy-dy, s=state.classSize; nx=Math.max(0,Math.min(frontCanvas.width-s,nx)); ny=Math.max(0,Math.min(frontCanvas.height-s,ny));
  state.classX=nx; state.classY=ny; drawFront();
});
frontCanvas.addEventListener('pointerup',e=>{ if(dragging){dragging=false; frontCanvas.releasePointerCapture(e.pointerId);} });
frontCanvas.addEventListener('pointercancel',()=>dragging=false);

// ===== Bind UI =====
const $id = id=>document.getElementById(id);
function bind(){
  $id('title').oninput=e=>{state.title=e.target.value;drawFront();};
  $id('titleFont').onchange=e=>{state.titleFont=e.target.value;drawFront();};
  $id('titleSize').oninput=e=>{state.titleSize=+e.target.value;drawFront();};
  $id('titleColor').oninput=e=>{state.titleColor=e.target.value;drawFront();};
  $id('titleFoil').onchange=e=>{state.titleFoil=e.target.value;drawFront();};
  $id('titleShadow').onchange=e=>{state.titleShadow=e.target.checked;drawFront();};

  $id('showMana').onchange=e=>{state.showMana=e.target.checked;drawFront();};
  $id('mana').oninput=e=>{state.mana=e.target.value;drawFront();};

  $id('descFont').onchange=e=>{state.descFont=e.target.value;drawFront();};
  $id('descSize').oninput=e=>{state.descSize=+e.target.value;drawFront();};
  $id('descColor').oninput=e=>{state.descColor=e.target.value;drawFront();};
  $id('rulesText').oninput=e=>{state.descText=e.target.value;drawFront();};

  // questi due controlli ora non influenzano i riquadri (look fisso come richiesto)
  $id('panelColor').oninput=()=>drawFront();
  $id('panelAlpha').oninput=()=>drawFront();

  $id('frameStyle').onchange=e=>{state.frameStyle=e.target.value;drawFront();drawBack();};
  $id('frameColor').oninput=e=>{state.frameColor=e.target.value;drawFront();drawBack();};
  $id('innerColor').oninput=e=>{state.innerColor=e.target.value;drawFront();drawBack();};

  $id('classSource').onchange=e=>{
    state.classSource=e.target.value;
    document.getElementById('dbClassRow').style.display=(state.classSource==='db')?'block':'none';
    document.getElementById('uploadClassRow').style.display=(state.classSource==='upload')?'block':'none';
    if(state.classSource==='none') state.imgClass=null;
    if(state.classSource==='db') loadDbIcon($id('clazz').value);
    if(state.classSource!=='upload') $id('classImg').value='';
    drawFront();
  };
  $id('clazz').onchange=e=>{ if(state.classSource==='db') loadDbIcon(e.target.value); };
  $id('classSize').oninput=e=>{state.classSize=+e.target.value; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();};

  $id('classImg').addEventListener('change',e=>{
    if(state.classSource!=='upload')return; const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgClass=img; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  $id('artFront').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return; const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgFront=img; drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });
  $id('artBack').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return; const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgBack=img; drawBack();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  // Font upload
  $id('titleFontFile').addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return; const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf); await ff.load(); document.fonts.add(ff); drawFront();
  });
  $id('descFontFile').addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return; const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf); await ff.load(); document.fonts.add(ff); drawFront();
  });
}

function loadDbIcon(key){ const svg=ICONS[key]; if(!svg){state.imgClass=null;drawFront();return;}
  svgToImage(svg,img=>{state.imgClass=img; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();});
}

// ===== Snapshot / Restore =====
export function snapshot(includeImages=true){
  const out={...state};
  delete out.imgFront; delete out.imgBack; delete out.imgClass;
  if(includeImages){
    out._imgFront=state.imgFront?.src||null;
    out._imgBack =state.imgBack?.src ||null;
    out._imgClass=(state.classSource==='upload')?(state.imgClass?.src||null):null;
  }
  return out;
}

export async function applySnap(s) {
  Object.assign(state, s || {});
  const loadImg = (url) =>
    new Promise((resolve, reject) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });

  try {
    const [f, b, c] = await Promise.all([
      s?._imgFront ? loadImg(s._imgFront) : null,
      s?._imgBack  ? loadImg(s._imgBack)  : null,
      s?._imgClass ? loadImg(s._imgClass) : null,
    ]);
    if (f) state.imgFront = f;
    if (b) state.imgBack  = b;
    if (c) state.imgClass = c;
    drawFront(); drawBack();
  } catch (err) {
    console.error('[applySnap] errore caricamento immagini:', err);
    drawFront(); drawBack();
    throw err;
  }
}

export function frontPNG(){ return frontCanvas.toDataURL('image/png'); }
export function backPNG(){  return backCanvas.toDataURL('image/png'); }

// ===== Init =====
function init(){
  bind();
  loadDbIcon(state.clazz);
  drawFront(); drawBack();

  const force=new URLSearchParams(location.search).get('welcome')==='1';
  const flag=localStorage.getItem('cm_hide_welcome');
  if(force){ localStorage.removeItem('cm_hide_welcome'); document.getElementById('welcome').style.display='flex'; }
  else if(flag==='true'){ document.getElementById('welcome').style.display='none'; }
  const dont=document.getElementById('dontShow');
  document.getElementById('btnGuest')?.addEventListener('click',()=>{ if(dont?.checked) localStorage.setItem('cm_hide_welcome','true'); document.getElementById('welcome').style.display='none'; });
}
init();
