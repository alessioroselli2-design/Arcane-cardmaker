// app/card.js — motore di disegno carte (fronte/retro) + stato + bind UI
// Layout aggiornato: margine interno uniforme + retro full-bleed.
// Effetti Premium: titolo (fx-*) e cornici (frame-*) con gating.

export let state = {
  // titolo / mana
  title: '',
  titleFont: '"Cinzel",serif',
  titleSize: 42,
  titleColor: '#ffffff',
  // 'none' | 'foil-gold' | 'foil-silver' | 'foil-rainbow' | 'fx-celestial' | 'fx-infernal' | 'fx-obsidian' | 'fx-royal' | 'fx-starlight'
  titleFoil: 'none',
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

  // cornice (standard + premium)
  // standard: 'flat' | 'foil-gold' | 'foil-silver' | 'foil-rainbow' | 'wood' | 'stone' | 'arcane' | 'nature'
  // premium:  'frame-celestial' | 'frame-infernal' | 'frame-obsidian' | 'frame-royal' | 'frame-starlight' | 'frame-frost' | 'frame-bloom' | 'frame-storm' | 'frame-vampiric' | 'frame-chronos'
  frameStyle: 'flat',
  frameColor: '#d8cfae',
  innerColor: '#f7f5ef',

  // riquadri / linee
  panelColor: '#cdbb7d',
  panelAlpha: 0.85,

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
if (!ctxF || !ctxB) console.warn('[card.js] canvas non trovati, salto init');

// ======== ICONE DB ========
const ICONS = {
  guerriero: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><linearGradient id='gSword' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#f7f7f7'/><stop offset='1' stop-color='#c9c9c9'/></linearGradient></defs>
    <rect x='20' y='20' width='60' height='60' rx='10' fill='none' stroke='#2b2b2b' stroke-width='3'/>
    <path d='M28 64 l20 -20 l4 4 l-20 20 z' fill='#8c6b3c' stroke='#2b2b2b' stroke-width='2'/>
    <path d='M52 28 l20 20 l-18 18 l-20 -20 z' fill='url(#gSword)' stroke='#2b2b2b' stroke-width='2'/>
    <circle cx='62' cy='38' r='3' fill='#2b2b2b'/></svg>`,
  druido: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><radialGradient id='gLeaf' cx='0.5' cy='0.3' r='0.8'>
      <stop offset='0' stop-color='#9fe29f'/><stop offset='1' stop-color='#4f8b4f'/></radialGradient></defs>
    <path d='M50 12 C26 36,24 62,50 90 C76 62,74 36,50 12 Z' fill='url(#gLeaf)' stroke='#1f4a1c' stroke-width='3'/>
    <path d='M50 90 C48 66,46 46,48 28' stroke='#1f4a1c' stroke-width='3' fill='none'/>
    <path d='M36 42 c10 2 18 -2 24 -8' stroke='#1f4a1c' stroke-width='2' fill='none'/></svg>`,
  monaco: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='30' fill='none' stroke='#caa96b' stroke-width='6'/>
    <path d='M50 18 v64' stroke='#caa96b' stroke-width='6'/>
    <path d='M35 42 h30' stroke='#caa96b' stroke-width='4' opacity='.7'/></svg>`,
  mago: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><linearGradient id='gHat' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#6fb7ff'/><stop offset='1' stop-color='#2a69d1'/></linearGradient></defs>
    <path d='M50 16 l24 44 h-48 z' fill='url(#gHat)' stroke='#173b75' stroke-width='3'/>
    <circle cx='50' cy='64' r='5' fill='#fff' stroke='#173b75' stroke-width='2'/>
    <path d='M22 66 h56' stroke='#173b75' stroke-width='3'/></svg>`,
  ladro: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <rect x='20' y='34' width='60' height='28' rx='6' fill='#1e1e1e' stroke='#333' stroke-width='3'/>
    <path d='M20 45 h60' stroke='#666' stroke-width='3'/>
    <circle cx='36' cy='48' r='5' fill='#ddd'/><circle cx='64' cy='48' r='5' fill='#ddd'/>
    <path d='M72 70 l8 8' stroke='#1e1e1e' stroke-width='6' stroke-linecap='round'/></svg>`,
  barbaro: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M24 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
    <path d='M58 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
    <rect x='46' y='18' width='8' height='64' fill='#5b371f' stroke='#2c170c' stroke-width='2'/>
    <path d='M28 30 l10 0 0 12 -10 0 z M62 30 l10 0 0 12 -10 0 z' fill='#c89b72' opacity='.35'/></svg>`,
  paladino: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M20 20 h60 v26 c0 26 -30 38 -30 38 s-30 -12 -30 -38 z' fill='#e6dfb8' stroke='#8a7b45' stroke-width='3'/>
    <path d='M50 26 v40' stroke='#8a7b45' stroke-width='3'/><path d='M38 46 h24' stroke='#8a7b45' stroke-width='3'/></svg>`,
  chierico: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='28' fill='#efe8d8' stroke='#876' stroke-width='3'/>
    <path d='M48 28 h4 v18 h18 v4 h-18 v18 h-4 v-18 h-18 v-4 h18 z' fill='#876'/></svg>`,
  bardo: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M32 20 c40 0 40 60 0 60' fill='none' stroke='#b46ec9' stroke-width='6'/>
    <circle cx='56' cy='48' r='6' fill='#fff' stroke='#7c3a93' stroke-width='2'/>
    <path d='M58 30 q10 6 14 0' stroke='#b46ec9' stroke-width='3' fill='none'/></svg>`,
  ranger: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M22 78 l56 -56' stroke='#2f7d2b' stroke-width='6' stroke-linecap='round'/>
    <path d='M70 22 l12 -6 -6 12 z' fill='#2f7d2b'/>
    <path d='M26 70 q12 -8 20 -2' stroke='#5aa34f' stroke-width='3' fill='none'/></svg>`,
  stregone: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='24' fill='none' stroke='#90c9ff' stroke-width='4'/>
    <path d='M50 26 v10 M50 64 v10 M26 50 h10 M64 50 h10' stroke='#90c9ff' stroke-width='3'/>
    <circle cx='50' cy='50' r='6' fill='#90c9ff'/></svg>`,
  warlock: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M50 14 l16 22 -16 48 -16 -48 z' fill='#7d4bb3' stroke='#3e2560' stroke-width='3'/>
    <circle cx='50' cy='40' r='7' fill='#c7a3ff' stroke='#3e2560' stroke-width='2'/></svg>`,
  artificiere: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='26' fill='#b9c3ce' stroke='#3a4a5a' stroke-width='3'/>
    <path d='M50 22 v10 M50 68 v10 M22 50 h10 M68 50 h10 M33 33 l7 7 M67 67 l7 7 M33 67 l7 -7 M67 33 l7 -7'
          stroke='#3a4a5a' stroke-width='3'/>
    <path d='M50 32 l14 4 -8 8 z' fill='#3a4a5a'/></svg>`
};
window.ICONS = ICONS;

// ======== HELPERS ========
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

// === Premium gating & NORMALIZZAZIONE =================================
function isPremiumUnlocked(){
  // 1) Se premium.js è caricato, chiediamo a lui
  if (window.premium?.isPro && window.premium.isPro()) return true;
  // 2) User premium da auth
  if (window.user && window.user.isPremium) return true;
  // 3) Local device flag (supporta entrambe le chiavi storiche)
  if (localStorage.getItem('acm_pro') === '1') return true;
  if (localStorage.getItem('acm_premium') === '1') return true;
  return false;
}
function isPremiumEffect(val){ return /^fx-/.test(val||''); }
function isPremiumFrame(val){ return /^frame-/.test(val||''); }

// Mappa le etichette (in qualsiasi lingua) alle chiavi fx-* (titolo)
function normalizeEffect(val=''){
  const v = (val||'').toString().trim().toLowerCase();
  if (v.startsWith('fx-')) return v;

  // compatibilità con vecchi value tipo "foil-celestial", ecc.
  const m = v.match(/^foil-(celestial|infernal|obsidian|royal|starlight)$/);
  if (m) return `fx-${m[1]}`;

  const map = [
    [/^celest/, 'fx-celestial'],
    [/^infer/,  'fx-infernal'],
    [/^obsid/,  'fx-obsidian'],
    [/^royal|reale/, 'fx-royal'],
    [/^star|stell/,  'fx-starlight'],
  ];
  for (const [re,out] of map) if (re.test(v)) return out;

  if (v.includes('foil') && v.includes('gold'))   return 'foil-gold';
  if (v.includes('foil') && v.includes('silver')) return 'foil-silver';
  if (v.includes('foil') && (v.includes('rainbow')||v.includes('arcobal')||v.includes('regenbogen'))) return 'foil-rainbow';
  if (['none','nessuno','ninguno','keiner'].includes(v)) return 'none';
  return val;
}

// Mappa etichette cornice → chiavi canoniche (incluse nuove premium)
function normalizeFrameStyle(val=''){
  const v = (val||'').toString().trim().toLowerCase();
  if (v.startsWith('frame-')) return v;

  // premium
  const mapP = [
    [/^celest/,      'frame-celestial'],
    [/^infer/,       'frame-infernal'],
    [/^obsid/,       'frame-obsidian'],
    [/^royal|reale/,'frame-royal'],
    [/^star|stell/,  'frame-starlight'],
    [/^frost/,       'frame-frost'],
    [/^bloom/,       'frame-bloom'],
    [/^storm/,       'frame-storm'],
    [/^vamp/,        'frame-vampiric'],
    [/^chrono/,      'frame-chronos'],
  ];
  for (const [re,out] of mapP) if (re.test(v)) return out;

  // standard
  if (v.includes('foil') && v.includes('gold'))   return 'foil-gold';
  if (v.includes('foil') && v.includes('silver')) return 'foil-silver';
  if (v.includes('foil') && (v.includes('rainbow')||v.includes('arcobal')||v.includes('regenbogen'))) return 'foil-rainbow';
  if (v.includes('wood') || v.includes('legno'))  return 'wood';
  if (v.includes('stone')|| v.includes('pietra')) return 'stone';
  if (v.includes('arcane')||v.includes('arcano')) return 'arcane';
  if (v.includes('nature')||v.includes('natura')) return 'nature';
  if (['flat','colore piatto','color plano','farbe'].some(k=>v.includes(k))) return 'flat';
  return val;
}

// Effetti premium: disegno del TITOLO
function paintTitleWithEffect(ctx, text, x, y, w, h, effectKey){
  ctx.save();
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  switch(effectKey){
    case 'fx-celestial': {
      const g = ctx.createLinearGradient(x, y-h*0.6, x+w, y+h*0.6);
      g.addColorStop(0, '#b08cff'); g.addColorStop(0.5, '#83a6ff'); g.addColorStop(1, '#a38bff');
      ctx.fillStyle = g;
      ctx.shadowColor = 'rgba(120,90,255,0.55)'; ctx.shadowBlur = 12;
      ctx.fillText(text, x, y, w);
      ctx.shadowBlur = 0; ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=1;
      ctx.strokeText(text, x, y, w);
      break;
    }
    case 'fx-infernal': {
      const g = ctx.createLinearGradient(x, y-h*0.5, x, y+h*0.5);
      g.addColorStop(0, '#ffeb9a'); g.addColorStop(0.5, '#ff7a00'); g.addColorStop(1, '#d01414');
      ctx.fillStyle = g;
      ctx.shadowColor='rgba(255,80,0,.65)'; ctx.shadowBlur=14;
      ctx.fillText(text, x, y, w);
      ctx.shadowBlur=0; ctx.strokeStyle='rgba(0,0,0,.4)'; ctx.lineWidth=1.5;
      ctx.strokeText(text, x, y, w);
      break;
    }
    case 'fx-obsidian': {
      const g = ctx.createLinearGradient(x, y-h*0.6, x+w, y+h*0.6);
      g.addColorStop(0, '#1b1b1d'); g.addColorStop(0.5, '#3a3a43'); g.addColorStop(1, '#0f0f12');
      ctx.fillStyle = g;
      ctx.shadowColor='rgba(0,0,0,.6)'; ctx.shadowBlur=10;
      ctx.fillText(text, x, y, w);
      ctx.shadowBlur=0; ctx.strokeStyle='rgba(200,200,220,.35)'; ctx.lineWidth=1;
      ctx.strokeText(text, x, y, w);
      break;
    }
    case 'fx-royal': {
      const g = ctx.createLinearGradient(x, y-h*0.5, x, y+h*0.5);
      g.addColorStop(0, '#6a2bb8'); g.addColorStop(1, '#9a66ff');
      ctx.fillStyle = g;
      ctx.shadowColor='rgba(140,90,255,.45)'; ctx.shadowBlur=10;
      ctx.fillText(text, x, y, w);
      ctx.shadowBlur=0; ctx.strokeStyle='#d4af37'; ctx.lineWidth=1.4;
      ctx.strokeText(text, x, y, w);
      break;
    }
    case 'fx-starlight': {
      const g = ctx.createLinearGradient(x, y-h*0.6, x+w, y+h*0.6);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfe3ff');
      ctx.fillStyle=g;
      ctx.shadowColor='rgba(255,255,255,.55)'; ctx.shadowBlur=8;
      ctx.fillText(text, x, y, w);
      ctx.shadowBlur=0;
      const dots = 10; ctx.fillStyle='rgba(255,255,255,.9)';
      for(let i=0;i<dots;i++){
        const rx = x + Math.random()*Math.min(w,520);
        const ry = y + (Math.random()*h - h/2) * 0.6;
        ctx.beginPath(); ctx.arc(rx, ry, Math.random()*1.6+0.6, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
    default:
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x, y, w);
  }
  ctx.restore();
}

// ======== GEOMETRIA ========
const W=750, H=1050;
const FRAME = { x:12, y:12, w:W-24, h:H-24, r:22 };     // cornice esterna
const INNER = { x:28, y:28, w:W-56, h:H-56, r:18 };      // bordo interno (colore “carta”)
const P = 22;                                            // padding
const TITLE_H = 86;
const GAP = 18;
const IMG_H = 460;

// ======== CORNICE (include premium) ========
function paintFrame(c){
  c.save();
  rr(c,FRAME.x,FRAME.y,FRAME.w,FRAME.h,FRAME.r);

  // normalizza e (se non premium) ripiega a flat
  let fs = normalizeFrameStyle(state.frameStyle || 'flat');
  if (isPremiumFrame(fs) && !isPremiumUnlocked()) fs = 'flat';

  if (fs.startsWith('foil-')){
    const kind = fs.replace('foil-','');
    c.fillStyle = makeFoilGradient(c,FRAME.x,FRAME.y,FRAME.w,FRAME.h, kind);
    c.fill();
  } else if (fs === 'wood'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#8a6a3b'); g.addColorStop(1,'#5d4525');
    c.fillStyle=g; c.fill();
  } else if (fs === 'stone'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#cfcfd4'); g.addColorStop(1,'#a8a8ad');
    c.fillStyle=g; c.fill();
  } else if (fs === 'arcane'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#3a2a58'); g.addColorStop(1,'#6a4fb3');
    c.fillStyle=g; c.fill();
  } else if (fs === 'nature'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#7bb077'); g.addColorStop(1,'#3d6b38');
    c.fillStyle=g; c.fill();

  // --- PREMIUM ---
  } else if (fs === 'frame-celestial'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#b08cff'); g.addColorStop(0.5,'#83a6ff'); g.addColorStop(1,'#a38bff');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-infernal'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#ffeb9a'); g.addColorStop(0.5,'#ff7a00'); g.addColorStop(1,'#d01414');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-obsidian'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#1b1b1d'); g.addColorStop(0.5,'#3a3a43'); g.addColorStop(1,'#0f0f12');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-royal'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#6a2bb8'); g.addColorStop(1,'#9a66ff');
    c.fillStyle=g; c.fill();
    c.lineWidth=3; c.strokeStyle='#d4af37'; c.stroke();
  } else if (fs === 'frame-starlight'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#cfe3ff');
    c.fillStyle=g; c.fill();

  } else if (fs === 'frame-frost'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#e8f6ff'); g.addColorStop(0.5,'#b8d9ff'); g.addColorStop(1,'#7fb2ff');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-bloom'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#f7e8ff'); g.addColorStop(0.5,'#c1f2c7'); g.addColorStop(1,'#7ad67a');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-storm'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#0f1a2b'); g.addColorStop(1,'#254a7a');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-vampiric'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x,FRAME.y+FRAME.h);
    g.addColorStop(0,'#3b0a0a'); g.addColorStop(1,'#b80f2e');
    c.fillStyle=g; c.fill();
  } else if (fs === 'frame-chronos'){
    const g = c.createLinearGradient(FRAME.x,FRAME.y,FRAME.x+FRAME.w,FRAME.y+FRAME.h);
    g.addColorStop(0,'#fff3c4'); g.addColorStop(0.5,'#d6b65a'); g.addColorStop(1,'#a8802a');
    c.fillStyle=g; c.fill();

  } else {
    // flat
    c.fillStyle = state.frameColor;
    c.fill();
  }
  c.restore();

  // Interno (campo chiaro)
  rr(c,INNER.x,INNER.y,INNER.w,INNER.h,INNER.r);
  c.fillStyle = state.innerColor;
  c.fill();
}

function defaultSymbolPos(){
  const s=state.classSize, right=W-(INNER.x+P);
  const cy = INNER.y + P + TITLE_H/2;
  state.classX = right - s;
  state.classY = cy - s/2;
}

// ======== FRONT ========
export function drawFront(){
  if(!ctxF) return;
  ctxF.clearRect(0,0,W,H);
  paintFrame(ctxF);

  // === Titolo (riquadro) ===
  const t = { x: INNER.x + P, y: INNER.y + P, w: INNER.w - P*2, h: TITLE_H, r: 16 };
  rr(ctxF, t.x, t.y, t.w, t.h, t.r);
  ctxF.fillStyle = '#e6f2e6'; ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = '#89b97f'; ctxF.stroke();
  const gTop = ctxF.createLinearGradient(0,t.y,0,t.y+t.h*0.6);
  gTop.addColorStop(0,'rgba(255,255,255,.65)'); gTop.addColorStop(1,'rgba(255,255,255,0)');
  ctxF.save(); rr(ctxF, t.x+2, t.y+2, t.w-4, t.h*0.45, Math.max(0,t.r-4)); ctxF.clip();
  ctxF.fillStyle = gTop; ctxF.fillRect(t.x, t.y, t.w, t.h*0.6); ctxF.restore();

  // === Immagine ===
  const ax = INNER.x + P + 16, ay = t.y + t.h + GAP;
  const aw = INNER.w - (P+16)*2, ah = IMG_H;
  if(state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18);
  else { ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }

  // === Descrizione (riquadro) ===
  const b = {
    x: INNER.x + P,
    y: ay + ah + GAP,
    w: INNER.w - P*2,
    h: (INNER.y + INNER.h) - (ay + ah + GAP) - P,
    r: 18
  };
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = '#fcfcf8'; ctxF.fill();
  ctxF.lineWidth = 2; ctxF.strokeStyle = 'rgba(122,177,114,.7)'; ctxF.stroke();

  // === Titolo (testo) ===
  ctxF.textBaseline='middle';
  ctxF.textAlign='left';
  ctxF.font = `700 ${state.titleSize}px ${state.titleFont}`;

  if(state.titleShadow){
    ctxF.shadowColor='rgba(0,0,0,.55)'; ctxF.shadowBlur=8; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=2;
  } else {
    ctxF.shadowColor='transparent'; ctxF.shadowBlur=0; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=0;
  }

  const titleX = t.x + 16;
  const titleY = t.y + t.h/2;
  const titleW = t.w - 140;

  // normalizza effetto titolo e applica gating runtime
  let eff = normalizeEffect(state.titleFoil || 'none');
  if (isPremiumEffect(eff) && !isPremiumUnlocked()) eff = 'none';

  if (isPremiumEffect(eff)) {
    paintTitleWithEffect(ctxF, state.title || '', titleX, titleY, titleW, t.h, eff);
  } else if (eff !== 'none') {
    const kind = eff.replace('foil-','');
    ctxF.fillStyle = makeFoilGradient(ctxF, t.x, t.y, t.w, t.h, kind);
    ctxF.fillText(state.title || '', titleX, titleY, titleW);
  } else {
    ctxF.fillStyle = state.titleColor || '#ffffff';
    ctxF.fillText(state.title || '', titleX, titleY, titleW);
  }

  // === Simbolo di classe ===
  if(state.imgClass){
    if(state.classX==null || state.classY==null) defaultSymbolPos();
    cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10);
  }

  // === Mana ===
  if(state.showMana && (state.mana||'').trim()){
    ctxF.shadowColor='transparent';
    ctxF.fillStyle='#222';
    ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`;
    ctxF.textAlign='right';
    const right = INNER.x + INNER.w - P;
    const x = state.imgClass ? Math.min(right-8,(state.classX??(right-40))-10) : right;
    ctxF.fillText(state.mana, x, t.y + t.h/2);
    ctxF.textAlign='left';
  }

  // === Descrizione (wrap con **grassetto**) ===
  const bx=b.x+14, by=b.y+18, bw=b.w-28;
  ctxF.save();
  ctxF.fillStyle=state.descColor;
  ctxF.font=`${state.descSize}px ${state.descFont}`;
  wrapText(ctxF,state.rulesText||'',bx,by,bw,state.descSize*1.3);
  ctxF.restore();
}

// ======== BACK (full-bleed entro la cornice interna) ========
export function drawBack(){
  if(!ctxB) return;
  ctxB.clearRect(0,0,W,H);
  paintFrame(ctxB);
  if(state.imgBack){
    cover(ctxB,state.imgBack,INNER.x,INNER.y,INNER.w,INNER.h,INNER.r);
  } else {
    ctxB.save(); rr(ctxB,INNER.x+12,INNER.y+12,INNER.w-24,INNER.h-24,INNER.r-6);
    ctxB.fillStyle='#d5d5d5'; ctxB.globalAlpha=.35; ctxB.fill(); ctxB.restore();
    ctxB.fillStyle='#6b7280'; ctxB.font='16px Inter,sans-serif';
    ctxB.fillText('Carica immagine retro (full-bleed)',INNER.x+20,INNER.y+22);
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

  // Effetto titolo con gating robusto
  $id('titleFoil')?.addEventListener('change',e=>{
    const raw = e.target.value;
    const val = normalizeEffect(raw);
    const opt = e.target.selectedOptions?.[0];
    const isUiPremium = opt?.getAttribute('data-premium') === '1';
    const looksPremium = isUiPremium || isPremiumEffect(val);

    if (looksPremium && !isPremiumUnlocked()){
      const fb = (state.titleFoil && !isPremiumEffect(normalizeEffect(state.titleFoil)))
        ? normalizeEffect(state.titleFoil) : 'none';
      state.titleFoil = fb; e.target.value = fb;
      const msg = (window.intl?.t && window.intl.t('premium_title_msg')) ||
                  'Effetto Premium disponibile con abbonamento.';
      alert(msg); drawFront(); return;
    }
    state.titleFoil = val; e.target.value = val; drawFront();
  });
  $id('titleShadow')?.addEventListener('change',e=>{state.titleShadow=e.target.checked;drawFront();});

  $id('descFont')?.addEventListener('change',e=>{state.descFont=e.target.value;drawFront();});
  $id('descSize')?.addEventListener('input',e=>{state.descSize=+e.target.value;drawFront();});
  $id('descColor')?.addEventListener('input',e=>{state.descColor=e.target.value;drawFront();});
  $id('rulesText')?.addEventListener('input',e=>{state.rulesText=e.target.value;drawFront();});

  // Cornice con normalizzazione + gating
  $id('frameStyle')?.addEventListener('change',e=>{
    const raw = e.target.value;
    const val = normalizeFrameStyle(raw);
    if (isPremiumFrame(val) && !isPremiumUnlocked()){
      const fb = normalizeFrameStyle(state.frameStyle);
      const backTo = (fb && !isPremiumFrame(fb)) ? fb : 'flat';
      state.frameStyle = backTo; e.target.value = backTo;
      const msg = (window.intl?.t && window.intl.t('premium_frame_msg')) ||
                  'Cornice Premium. Disponibile con abbonamento.';
      alert(msg);
      drawFront(); drawBack(); return;
    }
    state.frameStyle = val; e.target.value = val;
    drawFront(); drawBack();
  });

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

  // Stato iniziale visibilità righe classi + valore select (fix iOS)
  {
    const dbRow=$id('dbClassRow');
    const upRow=$id('uploadClassRow');
    if (dbRow) dbRow.style.display=(state.classSource==='db')?'block':'none';
    if (upRow) upRow.style.display=(state.classSource==='upload')?'block':'none';

    const selClazz = $id('clazz');
    if (selClazz) {
      selClazz.value = state.clazz || selClazz.value || 'druido';
      selClazz.addEventListener('touchend', ()=> { try{ selClazz.blur(); selClazz.focus(); }catch{} });
    }
  }
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

// --- Multilingua "soft" (IT/EN) senza cambiare l'HTML --- //
(async () => {
  try{
    const intl = await import('./intl.js');

    const hdr = document.querySelector('header');
    if (hdr && !document.getElementById('lang')) {
      const sel = document.createElement('select');
      sel.id = 'lang';
      sel.style.marginLeft = '10px';
      sel.style.padding = '4px 6px';
      sel.style.borderRadius = '8px';
      sel.innerHTML = `<option value="it">IT</option><option value="en">EN</option>`;
      const row = hdr.querySelector('.row') || hdr;
      row.appendChild(sel);
      sel.value = intl.getLocale();
      sel.addEventListener('change', () => intl.setLocale(sel.value));
    }

    const map = () => ([
      { type:'ph', el: document.getElementById('title'),      key:'ph_title',      it:'Nome incantesimo', en:'Spell name' },
      { type:'ph', el: document.getElementById('mana'),       key:'ph_mana',       it:'{G}{U} o 2G',      en:'{G}{U} or 2G' },
      { type:'ph', el: document.getElementById('rulesText'),  key:'ph_rules',      it:'Testo/incantesimo… **parole chiave** in grassetto.', en:'Rules text… **keywords** in bold.' },
      { type:'ph', el: document.getElementById('cardName'),   key:'ph_card',       it:'Es. Lame del Bosco', en:'e.g. Forest Blades' },
      { type:'ph', el: document.getElementById('deckName'),   key:'ph_deck',       it:'Es. Incantesimi Druido', en:'e.g. Druid Spells' },
      { type:'txt', el: document.getElementById('saveLocal'),   key:'btn_save_local', it:'Salva locale', en:'Save locally' },
      { type:'txt', el: document.getElementById('loadLocal'),   key:'btn_load_local', it:'Apri libreria locale', en:'Open local library' },
      { type:'txt', el: document.getElementById('btnCloudSave'),  key:'btn_cloud_save',  it:'Salva su cloud', en:'Save to cloud' },
      { type:'txt', el: document.getElementById('btnCloudPull'),  key:'btn_cloud_pull',  it:'Apri libreria cloud', en:'Open cloud library' },
      { type:'txt', el: document.getElementById('btnCloudClear'), key:'btn_cloud_clear', it:'Svuota cloud', en:'Clear cloud' },
      { type:'txt', el: document.getElementById('pngFront'),       key:'btn_png_front', it:'PNG (fronte)', en:'PNG (front)' },
      { type:'txt', el: document.getElementById('pngBack'),        key:'btn_png_back',  it:'PNG (retro)',  en:'PNG (back)' },
      { type:'txt', el: document.getElementById('pdfSingleFront'), key:'btn_pdf_single_f', it:'PDF singola (fronte)', en:'Single PDF (front)' },
      { type:'txt', el: document.getElementById('pdfSingleBack'),  key:'btn_pdf_single_b', it:'PDF singola (retro)',  en:'Single PDF (back)' },
      { type:'txt', el: document.getElementById('pdfA4Front'),     key:'btn_pdf_a4_f',  it:'PDF A4 3×3 (fronti)',  en:'A4 PDF 3×3 (fronts)' },
      { type:'txt', el: document.getElementById('pdfA4Back'),      key:'btn_pdf_a4_b',  it:'PDF A4 3×3 (retro)',   en:'A4 PDF 3×3 (backs)' },
      { type:'txt', el: document.getElementById('pdfA4Both'),      key:'btn_pdf_a4_both', it:'PDF A4 3×3 (fronte+retro)', en:'A4 PDF 3×3 (front+back)' },
    ]);

    const asDict = (loc) =>
      Object.fromEntries(map().map(({key, it, en}) => [key, loc==='it'?it:en]));

    intl.addLocale('it', asDict('it'));
    intl.addLocale('en', asDict('en'));

    function applyLocale(){
      map().forEach(({type, el, key})=>{
        if(!el) return;
        const txt = intl.t(key);
        if(type==='ph'){ el.setAttribute('placeholder', txt); }
        else { el.textContent = txt; }
      });
    }
    applyLocale();
    intl.onChange(applyLocale);

  }catch(e){
    console.warn('[intl] non attivo:', e?.message||e);
  }
})();
