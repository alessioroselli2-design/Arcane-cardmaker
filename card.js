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

// ======== ICONE DB (semplici) ========
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

  // Riquadro TITOLO (verde con highlight)
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

  // Riquadro DESCRIZIONE (crema + bordo verde tenue)
  const b = {x:28, y:610, w:W-56, h:412, r:18};
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = '#fcfcf8'; ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = 'rgba(122,177,114,.7)'; ctxF.stroke();

  // Titolo (ombra opzionale + foil opzionale)
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

  // Descrizione (wrap semplice con **grassetto**)
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
