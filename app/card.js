// card.js — motore di disegno carte (fronte/retro) + stato + bind UI

// ======== STATO ========
export let state = {
  // titolo / mana
  title: '',
  titleFont: '"Cinzel",serif',
  titleSize: 42,
  titleColor: '#ffffff',
  titleFoil: 'none',      // 'none' | 'foil-gold' | 'foil-silver' | 'foil-rainbow'
  titleShadow: false,

  mana: '',
  showMana: true,

  // simbolo classe
  classSource: 'db',      // 'db' | 'upload' | 'none'
  clazz: 'druido',
  imgClass: null,
  classX: null,
  classY: null,
  classSize: 64,

  // cornice
  frameStyle: 'flat',     // 'flat' | 'foil-gold' | 'foil-silver' | 'foil-rainbow'
  frameColor: '#d8cfae',
  innerColor: '#f7f5ef',

  // riquadri / linee
  panelColor: '#cdbb7d',
  panelAlpha: 0.85,       // (0..1) tenuto per compatibilità

  // immagini
  imgFront: null,
  imgBack: null,

  // descrizione
  rulesText: '',
  descFont: '"Spectral",serif',
  descSize: 18,
  descColor: '#111111'
};
window.state = state;

// ======== CANVAS ========
const frontCanvas = document.getElementById('cardFront');
const backCanvas  = document.getElementById('cardBack');
const ctxF = frontCanvas?.getContext('2d') || null;
const ctxB = backCanvas?.getContext('2d') || null;

// se per qualche motivo non ci sono i canvas, esco silenziosamente (evita “anteprima sparita”)
if (!ctxF || !ctxB) {
  console.warn('[card.js] canvas non trovati, salto init');
}

// ======== ICONE DB (FANTASY) ========
const ICONS = {
  guerriero: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <linearGradient id='gSword' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#f7f7f7'/><stop offset='1' stop-color='#c9c9c9'/>
    </linearGradient>
  </defs>
  <rect x='20' y='20' width='60' height='60' rx='10' fill='none' stroke='#2b2b2b' stroke-width='3'/>
  <path d='M28 64 l20 -20 l4 4 l-20 20 z' fill='#8c6b3c' stroke='#2b2b2b' stroke-width='2'/>
  <path d='M52 28 l20 20 l-18 18 l-20 -20 z' fill='url(#gSword)' stroke='#2b2b2b' stroke-width='2'/>
  <circle cx='62' cy='38' r='3' fill='#2b2b2b'/>
</svg>`,
  druido: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <radialGradient id='gLeaf' cx='0.5' cy='0.3' r='0.8'>
      <stop offset='0' stop-color='#9fe29f'/><stop offset='1' stop-color='#4f8b4f'/>
    </radialGradient>
  </defs>
  <path d='M50 12 C26 36,24 62,50 90 C76 62,74 36,50 12 Z' fill='url(#gLeaf)' stroke='#1f4a1c' stroke-width='3'/>
  <path d='M50 90 C48 66,46 46,48 28' stroke='#1f4a1c' stroke-width='3' fill='none'/>
  <path d='M36 42 c10 2 18 -2 24 -8' stroke='#1f4a1c' stroke-width='2' fill='none'/>
</svg>`,
  monaco: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='30' fill='none' stroke='#caa96b' stroke-width='6'/>
  <path d='M50 18 v64' stroke='#caa96b' stroke-width='6'/>
  <path d='M35 42 h30' stroke='#caa96b' stroke-width='4' opacity='.7'/>
</svg>`,
  mago: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <linearGradient id='gHat' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#6fb7ff'/><stop offset='1' stop-color='#2a69d1'/>
    </linearGradient>
  </defs>
  <path d='M50 16 l24 44 h-48 z' fill='url(#gHat)' stroke='#173b75' stroke-width='3'/>
  <circle cx='50' cy='64' r='5' fill='#fff' stroke='#173b75' stroke-width='2'/>
  <path d='M22 66 h56' stroke='#173b75' stroke-width='3'/>
</svg>`,
  ladro: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <rect x='20' y='34' width='60' height='28' rx='6' fill='#1e1e1e' stroke='#333' stroke-width='3'/>
  <path d='M20 45 h60' stroke='#666' stroke-width='3'/>
  <circle cx='36' cy='48' r='5' fill='#ddd'/><circle cx='64' cy='48' r='5' fill='#ddd'/>
  <path d='M72 70 l8 8' stroke='#1e1e1e' stroke-width='6' stroke-linecap='round'/>
</svg>`,
  barbaro: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M24 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
  <path d='M58 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
  <rect x='46' y='18' width='8' height='64' fill='#5b371f' stroke='#2c170c' stroke-width='2'/>
  <path d='M28 30 l10 0 0 12 -10 0 z M62 30 l10 0 0 12 -10 0 z' fill='#c89b72' opacity='.35'/>
</svg>`,
  paladino: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M20 20 h60 v26 c0 26 -30 38 -30 38 s-30 -12 -30 -38 z'
        fill='#e6dfb8' stroke='#8a7b45' stroke-width='3'/>
  <path d='M50 26 v40' stroke='#8a7b45' stroke-width='3'/>
  <path d='M38 46 h24' stroke='#8a7b45' stroke-width='3'/>
</svg>`,
  chierico: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='28' fill='#efe8d8' stroke='#876' stroke-width='3'/>
  <path d='M48 28 h4 v18 h18 v4 h-18 v18 h-4 v-18 h-18 v-4 h18 z' fill='#876'/>
</svg>`,
  bardo: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M32 20 c40 0 40 60 0 60' fill='none' stroke='#b46ec9' stroke-width='6'/>
  <circle cx='56' cy='48' r='6' fill='#fff' stroke='#7c3a93' stroke-width='2'/>
  <path d='M58 30 q10 6 14 0' stroke='#b46ec9' stroke-width='3' fill='none'/>
</svg>`,
  ranger: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M22 78 l56 -56' stroke='#2f7d2b' stroke-width='6' stroke-linecap='round'/>
  <path d='M70 22 l12 -6 -6 12 z' fill='#2f7d2b'/>
  <path d='M26 70 q12 -8 20 -2' stroke='#5aa34f' stroke-width='3' fill='none'/>
</svg>`,
  stregone: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='24' fill='none' stroke='#90c9ff' stroke-width='4'/>
  <path d='M50 26 v10 M50 64 v10 M26 50 h10 M64 50 h10' stroke='#90c9ff' stroke-width='3'/>
  <circle cx='50' cy='50' r='6' fill='#90c9ff'/>
</svg>`,
  warlock: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M50 14 l16 22 -16 48 -16 -48 z' fill='#7d4bb3' stroke='#3e2560' stroke-width='3'/>
  <circle cx='50' cy='40' r='7' fill='#c7a3ff' stroke='#3e2560' stroke-width='2'/>
</svg>`,
  artificiere: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='26' fill='#b9c3ce' stroke='#3a4a5a' stroke-width='3'/>
  <path d='M50 22 v10 M50 68 v10 M22 50 h10 M68 50 h10 M33 33 l7 7 M67 67 l7 7 M33 67 l7 -7 M67 33 l7 -7'
        stroke='#3a4a5a' stroke-width='3'/>
  <path d='M50 32 l14 4 -8 8 z' fill='#3a4a5a'/>
</svg>`
};
window.ICONS = ICONS;

// ======== HELPERS ========
function svgToImage(svg,cb){
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const img=new Image();
  img.onload=()=>cb(img);
  img.src=url;
}
function rr(c,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  c.beginPath();
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r);
  c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r);
  c.arcTo(x,y,x+w,y,r);
  c.closePath();
}
function cover(c,img,dx,dy,dw,dh,r=0){
  const ir=img.width/img.height, dr=dw/dh;
  let sx,sy,sw,sh;
  if(ir>dr){ sh=img.height; sw=sh*dr; sx=(img.width-sw)/2; sy=0; }
  else{ sw=img.width; sh=sw/dr; sx=0; sy=(img.height-sh)/2; }
  c.save();
  if(r>0){ rr(c,dx,dy,dw,dh,r); c.clip(); }
  c.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
  c.restore();
}
function makeFoilGradient(ctx,x,y,w,h,kind){
  const g = ctx.createLinearGradient(x,y,x+w,y+h);
  if (kind==='gold'){
    g.addColorStop(0,'#fff8d0'); g.addColorStop(.5,'#d4af37'); g.addColorStop(1,'#fff8d0');
  } else if (kind==='silver'){
    g.addColorStop(0,'#ffffff'); g.addColorStop(.5,'#c0c0c0'); g.addColorStop(1,'#ffffff');
  } else if (kind==='rainbow'){
    g.addColorStop(0,'#ff0000'); g.addColorStop(.2,'#ffa500'); g.addColorStop(.4,'#ffff00');
    g.addColorStop(.6,'#00ff00'); g.addColorStop(.8,'#0000ff'); g.addColorStop(1,'#8b00ff');
  } else {
    g.addColorStop(0,state.frameColor); g.addColorStop(1,state.frameColor);
  }
  return g;
}
function paintFrame(c,W,H){
  // cornice esterna
  c.save();
  rr(c,12,12,W-24,H-24,22);
  if (state.frameStyle?.startsWith('foil-')){
    const kind = state.frameStyle.replace('foil-','');
    c.fillStyle = makeFoilGradient(c,12,12,W-24,H-24, kind);
  } else {
    c.fillStyle = state.frameColor;
  }
  c.fill();
  c.restore();
  // interno
  rr(c,28,28,W-56,H-56,18);
  c.fillStyle = state.innerColor;
  c.fill();
}
function defaultSymbolPos(){
  const W=750, s=state.classSize, right=W-44, y=71 - s/2;
  state.classX = right - s;
  state.classY = y;
}

// ======== FRONT ========
export function drawFront(){
  if(!ctxF) return;
  const W=750, H=1050;
  ctxF.clearRect(0,0,W,H);
  paintFrame(ctxF,W,H);

  // Riquadro TITOLO
  const t = {x:28, y:28, w:W-56, h:86, r:16};
  rr(ctxF, t.x, t.y, t.w, t.h, t.r);
  ctxF.fillStyle = '#e6f2e6'; ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = '#89b97f'; ctxF.stroke();
  const gTop = ctxF.createLinearGradient(0,t.y,0,t.y+t.h*0.6);
  gTop.addColorStop(0,'rgba(255,255,255,.65)'); gTop.addColorStop(1,'rgba(255,255,255,0)');
  ctxF.save(); rr(ctxF, t.x+2, t.y+2, t.w-4, t.h*0.45, t.r-4); ctxF.clip();
  ctxF.fillStyle = gTop; ctxF.fillRect(t.x, t.y, t.w, t.h*0.6); ctxF.restore();

  // Immagine
  const ax=44, ay=132, aw=W-88, ah=460;
  if(state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18);
  else { ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }

  // Riquadro DESCRIZIONE
  const b = {x:28, y:610, w:W-56, h:412, r:18};
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = '#fcfcf8'; ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = 'rgba(122,177,114,.7)'; ctxF.stroke();

  // Titolo (ombra + foil)
  ctxF.textBaseline='middle';
  ctxF.textAlign='left';
  ctxF.font = `700 ${state.titleSize}px ${state.titleFont}`;
  if(state.titleShadow){
    ctxF.shadowColor='rgba(0,0,0,.55)'; ctxF.shadowBlur=8; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=2;
  } else {
    ctxF.shadowColor='transparent'; ctxF.shadowBlur=0; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=0;
  }
  if (state.titleFoil && state.titleFoil!=='none'){
    const kind = state.titleFoil.replace('foil-','');
    ctxF.fillStyle = makeFoilGradient(ctxF, t.x, t.y, t.w, t.h, kind);
  } else {
    ctxF.fillStyle = state.titleColor || '#ffffff';
  }
  ctxF.fillText(state.title || '', 44, 71, 520);

  // Simbolo di classe
  if(state.imgClass){
    if(state.classX==null || state.classY==null) defaultSymbolPos();
    cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10);
  }

  // Mana
  if(state.showMana && (state.mana||'').trim()){
    ctxF.shadowColor='transparent';
    ctxF.fillStyle='#222';
    ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`;
    ctxF.textAlign='right';
    const right=750-44;
    const x = state.imgClass ? Math.min(right-8,(state.classX??(right-40))-10) : right;
    ctxF.fillText(state.mana, x, 71);
    ctxF.textAlign='left';
  }

  // Descrizione
  const bx=b.x+12, by=b.y+18, bw=b.w-24;
  ctxF.save();
  ctxF.fillStyle=state.descColor;
  ctxF.font=`${state.descSize}px ${state.descFont}`;
  wrapText(ctxF,state.rulesText||'',bx,by,bw,state.descSize*1.3);
  ctxF.restore();
}

// ======== BACK ========
export function drawBack(){
  if(!ctxB) return;
  const W=750,H=1050;
  ctxB.clearRect(0,0,W,H);
  paintFrame(ctxB,W,H);
  if(state.imgBack) cover(ctxB,state.imgBack,28,28,W-56,H-56,18);
  else{
    ctxB.save(); rr(ctxB,40,40,W-80,H-80,14);
    ctxB.fillStyle='#d5d5d5'; ctxB.globalAlpha=.35; ctxB.fill(); ctxB.restore();
    ctxB.fillStyle='#6b7280'; ctxB.font='16px Inter,sans-serif';
    ctxB.fillText('Carica immagine retro (full-bleed)',48,62);
  }
}

// ======== TEXT WRAP (supporta **grassetto**) ========
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  if(!text) return;
  const parts = (text||'').split(/(\*\*.*?\*\*)|\s+/g).filter(Boolean);
  let line='', yy=y;
  function flush(){ ctx.fillText(line,x,yy); line=''; yy+=lineHeight; }
  for (const tok of parts){
    let chunk=tok, bold=false;
    if (/^\*\*.*\*\*$/.test(tok)){ bold=true; chunk=tok.slice(2,-2); }
    const test=line+chunk+(chunk.match(/\s/)?'':' ');
    if (ctx.measureText(test).width>maxWidth && line) flush();
    if (bold){
      ctx.save();
      const font = ctx.font.replace(/^(\d+(\.\d+)?px)\s+/,'$1 ');
      ctx.font = '700 ' + font.replace(/^700\s+/,'');
      ctx.fillText(chunk,x,yy);
      ctx.restore();
      line+=' ';
    } else {
      line+=chunk+(chunk.match(/\s/)?'':' ');
    }
  }
  if (line.trim()) ctx.fillText(line,x,yy);
}

// ======== SNAPSHOT / RESTORE ========
export function snapshot(includeImages = true){
  const out = { ...state };
  delete out.imgFront; delete out.imgBack; delete out.imgClass;
  if (includeImages){
    out._imgFront = state.imgFront?.src || null;
    out._imgBack  = state.imgBack?.src  || null;
    out._imgClass = (state.classSource === 'upload') ? (state.imgClass?.src || null) : null;
  }
  return out;
}
export async function applySnap(s) {
  Object.assign(state, s || {});
  const loadImg = (url) => new Promise((res,rej)=>{
    if(!url) return res(null);
    const img=new Image(); img.crossOrigin='anonymous';
    img.onload=()=>res(img); img.onerror=rej; img.src=url;
  });
  try{
    const [f,b,c] = await Promise.all([
      s?._imgFront ? loadImg(s._imgFront) : null,
      s?._imgBack  ? loadImg(s._imgBack)  : null,
      s?._imgClass ? loadImg(s._imgClass) : null,
    ]);
    if (f) state.imgFront=f; if (b) state.imgBack=b; if (c) state.imgClass=c;
  } finally {
    drawFront(); drawBack();
  }
}

// ======== PNG ========
export function frontPNG(){ return frontCanvas.toDataURL('image/png'); }
export function backPNG(){ return backCanvas.toDataURL('image/png'); }

// ======== DRAG SIMBOLO ========
let dragging=false,dx=0,dy=0;
frontCanvas?.addEventListener('pointerdown',e=>{
  if(!state.imgClass) return;
  const rect=frontCanvas.getBoundingClientRect(), sx=frontCanvas.width/rect.width, sy=frontCanvas.height/rect.height;
  const x=(e.clientX-rect.left)*sx, y=(e.clientY-rect.top)*sy, s=state.classSize;
  if(x>=state.classX&&x<=state.classX+s&&y>=state.classY&&y<=state.classY+s){
    dragging=true; dx=x-state.classX; dy=y-state.classY; frontCanvas.setPointerCapture(e.pointerId);
  }
});
frontCanvas?.addEventListener('pointermove',e=>{
  if(!dragging) return;
  const rect=frontCanvas.getBoundingClientRect(), sx=frontCanvas.width/rect.width, sy=frontCanvas.height/rect.height;
  let nx=(e.clientX-rect.left)*sx-dx, ny=(e.clientY-rect.top)*sy-dy, s=state.classSize;
  nx=Math.max(0,Math.min(frontCanvas.width-s,nx));
  ny=Math.max(0,Math.min(frontCanvas.height-s,ny));
  state.classX=nx; state.classY=ny; drawFront();
});
frontCanvas?.addEventListener('pointerup',e=>{ if(dragging){dragging=false; frontCanvas.releasePointerCapture(e.pointerId);} });
frontCanvas?.addEventListener('pointercancel',()=>dragging=false);

// ======== BIND UI ========
const $id = (x)=>document.getElementById(x);
function bind(){
  $id('title')?.addEventListener('input',e=>{state.title=e.target.value;drawFront();});
  $id('showMana')?.addEventListener('change',e=>{state.showMana=e.target.checked;drawFront();});
  $id('mana')?.addEventListener('input',e=>{state.mana=e.target.value;drawFront();});

  $id('titleFont')?.addEventListener('change',e=>{state.titleFont=e.target.value;drawFront();});
  $id('titleSize')?.addEventListener('input',e=>{state.titleSize=+e.target.value;drawFront();});
  $id('titleColor')?.addEventListener('input',e=>{state.titleColor=e.target.value;drawFront();});

  // ✅ FIX: mancavano questi due
  $id('titleFoil')?.addEventListener('change',e=>{state.titleFoil=e.target.value;drawFront();});
  $id('titleShadow')?.addEventListener('change',e=>{state.titleShadow=e.target.checked;drawFront();});

  $id('descFont')?.addEventListener('change',e=>{state.descFont=e.target.value;drawFront();});
  $id('descSize')?.addEventListener('input',e=>{state.descSize=+e.target.value;drawFront();});
  $id('descColor')?.addEventListener('input',e=>{state.descColor=e.target.value;drawFront();});
  $id('rulesText')?.addEventListener('input',e=>{state.rulesText=e.target.value;drawFront();});

  $id('frameStyle')?.addEventListener('change',e=>{state.frameStyle=e.target.value;drawFront();drawBack();});
  $id('frameColor')?.addEventListener('input',e=>{state.frameColor=e.target.value;drawFront();drawBack();});
  $id('innerColor')?.addEventListener('input',e=>{state.innerColor=e.target.value;drawFront();drawBack();});

  $id('panelColor')?.addEventListener('input',e=>{state.panelColor=e.target.value;drawFront();});
  $id('panelAlpha')?.addEventListener('input',e=>{state.panelAlpha=+e.target.value/100;drawFront();});

  $id('classSource')?.addEventListener('change',e=>{
    state.classSource=e.target.value;
    const dbRow=document.getElementById('dbClassRow');
    const upRow=document.getElementById('uploadClassRow');
    if(dbRow) dbRow.style.display=(state.classSource==='db')?'block':'none';
    if(upRow) upRow.style.display=(state.classSource==='upload')?'block':'none';
    if(state.classSource==='none') state.imgClass=null;
    if(state.classSource==='db') loadDbIcon($id('clazz')?.value||'druido');
    if(state.classSource!=='upload') $id('classImg') && ($id('classImg').value='');
    drawFront();
  });
  $id('clazz')?.addEventListener('change',e=>{ if(state.classSource==='db') loadDbIcon(e.target.value); });
  $id('classSize')?.addEventListener('input',e=>{state.classSize=+e.target.value; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();});

  $id('classImg')?.addEventListener('change',e=>{
    if(state.classSource!=='upload')return;
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgClass=img; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  $id('artFront')?.addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgFront=img; drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });
  $id('artBack')?.addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgBack=img; drawBack();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  // font custom
  $id('titleFontFile')?.addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf);
    await ff.load(); document.fonts.add(ff); drawFront();
  });
  $id('descFontFile')?.addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf);
    await ff.load(); document.fonts.add(ff); drawFront();
  });
}

function loadDbIcon(key){
  const svg = ICONS[key];
  if(!svg){ state.imgClass=null; drawFront(); return; }
  svgToImage(svg, img => {
    state.imgClass = img;
    if(state.classX==null||state.classY==null) defaultSymbolPos();
    drawFront();
  });
}

// ======== INIT ========
function init(){
  bind();
  loadDbIcon(state.clazz);
  drawFront();
  drawBack();

  // welcome coerente con index (non blocca canvas)
  const el = document.getElementById('welcome');
  const p = new URLSearchParams(location.search);
  const force = p.get('welcome') === '1';
  const hide  = localStorage.getItem('cm_hide_welcome') === 'true';
  if (el){
    if (force){ localStorage.removeItem('cm_hide_welcome'); el.style.display='flex'; }
    else if (hide){ el.style.display='none'; }
  }
  document.getElementById('btnGuest')?.addEventListener('click',()=>{
    const dont=document.getElementById('dontShow');
    if(dont?.checked) localStorage.setItem('cm_hide_welcome','true');
    el && (el.style.display='none');
  });
}

try{ init(); }catch(e){ console.error('[card.js] init failed', e); }
