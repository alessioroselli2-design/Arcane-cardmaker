// card.js — motore di disegno carte (fronte/retro) + stato + bind UI
// (Fix: pannelli prendono panelColor+panelAlpha, retro full-bleed come prima, icone più “fantasy”)

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
  panelColor: '#cdbb7d',  // colore scelto da UI per i pannelli
  panelAlpha: 0.85,       // opacità pannelli (0..1)

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

/* ===== Canvas ===== */
const frontCanvas = document.getElementById('cardFront');
const backCanvas  = document.getElementById('cardBack');
const ctxF = frontCanvas?.getContext('2d') || null;
const ctxB = backCanvas?.getContext('2d') || null;
if (!ctxF || !ctxB) console.warn('[card.js] canvas non trovati, salto init');

/* ===== Icone DB (più “fantasy”, ma leggere) ===== */
const ICONS = {
  guerriero:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs>
      <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#f7e7a1'/><stop offset='.6' stop-color='#d4af37'/><stop offset='1' stop-color='#fff2b3'/>
      </linearGradient>
    </defs>
    <circle cx='50' cy='50' r='40' fill='url(#g1)' stroke='#6b5a2a' stroke-width='3'/>
    <path d='M50 18 l12 16 h14 l-12 10 5 16 -19-10 -19 10 5-16 -12-10 h14z' fill='#fff' opacity='.7'/>
  </svg>`,
  druido:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><linearGradient id='leaf' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#a8e0a3'/><stop offset='1' stop-color='#4f8e46'/></linearGradient></defs>
    <path d='M50 10 C26 38,26 60,50 90 C74 60,74 38,50 10 Z' fill='url(#leaf)' stroke='#1c3d19' stroke-width='3'/>
    <path d='M50 22 C44 40,44 60,50 78' stroke='#1c3d19' stroke-width='2' fill='none'/>
  </svg>`,
  mago:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><radialGradient id='m' cx='.4' cy='.3' r='.9'><stop offset='0' stop-color='#dbeafe'/><stop offset='1' stop-color='#60a5fa'/></radialGradient></defs>
    <path d='M50 16 l24 42 -48 0 z' fill='url(#m)' stroke='#2a3a6b' stroke-width='2'/>
    <circle cx='50' cy='62' r='6' fill='#fff'/>
  </svg>`,
  paladino:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M20 20 h60 v28 c0 24 -30 36 -30 36 s-30 -12 -30 -36 z' fill='#e5ddb5' stroke='#8a7b45' stroke-width='2'/>
    <path d='M50 26 v36' stroke='#8a7b45' stroke-width='3'/>
  </svg>`,
  ranger:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M22 78 l56 -56' stroke='#4a8f3b' stroke-width='6'/>
    <path d='M68 26 l12 -6 -6 12 z' fill='#4a8f3b'/>
  </svg>`,
  ladro:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <rect x='18' y='40' width='64' height='20' rx='6' fill='#1f2937'/>
    <circle cx='34' cy='50' r='6' fill='#ddd'/><circle cx='66' cy='50' r='6' fill='#ddd'/>
  </svg>`,
  stregone:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='24' fill='none' stroke='#9cf' stroke-width='4'/>
    <circle cx='50' cy='50' r='7' fill='#9cf'/><path d='M50 26 v-8' stroke='#9cf' stroke-width='3'/>
  </svg>`,
  barbaro:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <rect x='18' y='28' width='20' height='44' rx='4' fill='#9b4d2e'/><rect x='62' y='28' width='20' height='44' rx='4' fill='#9b4d2e'/>
    <rect x='46' y='18' width='8' height='64' fill='#5b371f'/>
  </svg>`,
  chierico:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M48 16 h4 v28 h28 v4 h-28 v28 h-4 v-28 h-28 v-4 h28 z' fill='#e9e2d3' stroke='#7b6a4a' stroke-width='2'/>
  </svg>`,
  bardo:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M30 20 c40 0 40 60 0 60' fill='none' stroke='#b5649c' stroke-width='6'/>
    <circle cx='54' cy='48' r='6' fill='#fff'/>
  </svg>`,
  warlock:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M50 14 l18 22 -18 50 -18 -50 z' fill='#7d4bb3' stroke='#4b2a6b' stroke-width='2'/>
  </svg>`,
  artificiere:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <rect x='22' y='38' width='56' height='24' rx='6' fill='#bdbdbd' stroke='#666' stroke-width='2'/>
    <circle cx='34' cy='50' r='6' fill='#333'/><circle cx='66' cy='50' r='6' fill='#333'/>
  </svg>`
};
window.ICONS = ICONS;

/* ===== Helpers ===== */
function svgToImage(svg,cb){
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const img=new Image(); img.onload=()=>cb(img); img.src=url;
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
// colore pannelli da hex+alpha
function hexToRgba(hex, a=1){
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#ffffff');
  const r = m ? parseInt(m[1],16) : 255;
  const g = m ? parseInt(m[2],16) : 255;
  const b = m ? parseInt(m[3],16) : 255;
  return `rgba(${r},${g},${b},${Math.max(0,Math.min(1,a))})`;
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
  c.fill(); c.restore();
  // interno (spazio tra cornice e pannelli)
  rr(c,28,28,W-56,H-56,18);
  c.fillStyle = state.innerColor;
  c.fill();
}
function defaultSymbolPos(){
  const W=750, s=state.classSize, right=W-44, y=71 - s/2;
  state.classX = right - s;
  state.classY = y;
}

/* ===== Front ===== */
export function drawFront(){
  if(!ctxF) return;
  const W=750, H=1050;
  ctxF.clearRect(0,0,W,H);
  paintFrame(ctxF,W,H);

  // pannello TITOLO (margini “staccati” + colore da panelColor/alpha)
  const t = { x: 40, y: 40, w: W-80, h: 96, r: 16 };
  rr(ctxF, t.x, t.y, t.w, t.h, t.r);
  ctxF.fillStyle = hexToRgba(state.panelColor, state.panelAlpha ?? .85);
  ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = hexToRgba(state.panelColor, 0.9);
  ctxF.stroke();
  // highlight morbido
  const gTop = ctxF.createLinearGradient(0,t.y,0,t.y+t.h*0.6);
  gTop.addColorStop(0,'rgba(255,255,255,.35)'); gTop.addColorStop(1,'rgba(255,255,255,0)');
  ctxF.save(); rr(ctxF, t.x+2, t.y+2, t.w-4, t.h*0.45, t.r-4); ctxF.clip();
  ctxF.fillStyle = gTop; ctxF.fillRect(t.x, t.y, t.w, t.h*0.6); ctxF.restore();

  // immagine (leggermente più dentro)
  const ax=56, ay=152, aw=W-112, ah=452;
  if(state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18);
  else { ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }

  // pannello DESCRIZIONE (stesso colore del titolo)
  const b = { x: 40, y: 628, w: W-80, h: 382, r: 18 };
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = hexToRgba(state.panelColor, state.panelAlpha ?? .85);
  ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = hexToRgba(state.panelColor, 0.9);
  ctxF.stroke();

  // titolo (ombra + foil opzionali)
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
  ctxF.fillText(state.title || '', t.x+16, t.y + t.h/2, t.w - 200);

  // simbolo di classe
  if(state.imgClass){
    if(state.classX==null || state.classY==null) defaultSymbolPos();
    cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10);
  }

  // mana
  if(state.showMana && (state.mana||'').trim()){
    ctxF.shadowColor='transparent';
    ctxF.fillStyle='#222';
    ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`;
    ctxF.textAlign='right';
    const right=W-56;
    const x = state.imgClass ? Math.min(right-8,(state.classX??(right-40))-10) : right;
    ctxF.fillText(state.mana, x, t.y + t.h/2);
    ctxF.textAlign='left';
  }

  // descrizione
  const bx=b.x+14, by=b.y+20, bw=b.w-28;
  ctxF.save();
  ctxF.fillStyle=state.descColor;
  ctxF.font=`${state.descSize}px ${state.descFont}`;
  wrapText(ctxF,state.rulesText||'',bx,by,bw,state.descSize*1.3);
  ctxF.restore();
}

/* ===== Back (ripristino: immagine fino alla cornice interna, 28px) ===== */
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

/* ===== Text wrap (supporta **grassetto**) ===== */
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  if(!text) return;
  const parts = (text||'').split(/(\*\*.*?\*\*)|\s+/g).filter(Boolean);
  let line='', yy=y;
  function flush(){ ctx.fillText(line,x,yy,maxWidth); line=''; yy+=lineHeight; }
  for (const tok of parts){
    let chunk=tok, bold=false;
    if (/^\*\*.*\*\*$/.test(tok)){ bold=true; chunk=tok.slice(2,-2); }
    const test=line+chunk+(chunk.match(/\s/)?'':' ');
    if (ctx.measureText(test).width>maxWidth && line) flush();
    if (bold){
      ctx.save();
      const font = ctx.font.replace(/^(\d+(\.\d+)?px)\s+/,'$1 ');
      ctx.font = '700 ' + font.replace(/^700\s+/,'');
      ctx.fillText(chunk,x,yy,maxWidth);
      ctx.restore();
      line+=' ';
    } else {
      line+=chunk+(chunk.match(/\s/)?'':' ');
    }
  }
  if (line.trim()) ctx.fillText(line,x,yy,maxWidth);
}

/* ===== Snapshot / Restore ===== */
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

/* ===== PNG ===== */
export function frontPNG(){ return frontCanvas.toDataURL('image/png'); }
export function backPNG(){ return backCanvas.toDataURL('image/png'); }

/* ===== Drag simbolo ===== */
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

/* ===== Bind UI ===== */
const $id = (x)=>document.getElementById(x);
function bind(){
  // titolo
  $id('title')?.addEventListener('input',e=>{state.title=e.target.value;drawFront();});
  $id('titleFont')?.addEventListener('change',e=>{state.titleFont=e.target.value;drawFront();});
  $id('titleSize')?.addEventListener('input',e=>{state.titleSize=+e.target.value;drawFront();});
  $id('titleColor')?.addEventListener('input',e=>{state.titleColor=e.target.value;drawFront();});
  $id('titleFoil')?.addEventListener('change',e=>{state.titleFoil=e.target.value;drawFront();});
  $id('titleShadow')?.addEventListener('change',e=>{state.titleShadow=e.target.checked;drawFront();});

  // mana
  $id('showMana')?.addEventListener('change',e=>{state.showMana=e.target.checked;drawFront();});
  $id('mana')?.addEventListener('input',e=>{state.mana=e.target.value;drawFront();});

  // descrizione
  $id('descFont')?.addEventListener('change',e=>{state.descFont=e.target.value;drawFront();});
  $id('descSize')?.addEventListener('input',e=>{state.descSize=+e.target.value;drawFront();});
  $id('descColor')?.addEventListener('input',e=>{state.descColor=e.target.value;drawFront();});
  $id('rulesText')?.addEventListener('input',e=>{state.rulesText=e.target.value;drawFront();});

  // cornice
  $id('frameStyle')?.addEventListener('change',e=>{state.frameStyle=e.target.value;drawFront();drawBack();});
  $id('frameColor')?.addEventListener('input',e=>{state.frameColor=e.target.value;drawFront();drawBack();});
  $id('innerColor')?.addEventListener('input',e=>{state.innerColor=e.target.value;drawFront();drawBack();});

  // pannelli
  $id('panelColor')?.addEventListener('input',e=>{state.panelColor=e.target.value;drawFront();});
  $id('panelAlpha')?.addEventListener('input',e=>{state.panelAlpha=+e.target.value/100;drawFront();});

  // simbolo classe
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

  // upload icone/font
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

/* ===== Init ===== */
function init(){
  bind();
  loadDbIcon(state.clazz);
  drawFront();
  drawBack();

  // welcome coerente con index
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
