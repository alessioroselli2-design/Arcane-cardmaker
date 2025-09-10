// Stato globale
export const state = {
  // titolo/descrizione
  title:'', mana:'', showMana:true,
  titleFont:'"Cinzel",serif', titleSize:42, titleColor:'#ffffff',
  descText:'', descFont:'"Spectral",serif', descSize:18, descColor:'#111111',
  // pannelli/cornice
  panelColor:'#cdbb7d', panelAlpha:.85,
  frameStyle:'flat', frameColor:'#d8cfae', innerColor:'#f7f5ef',
  // simbolo classe
  classSource:'db', clazz:'guerriero', classSize:64,
  imgClass:null, classX:null, classY:null,
  // immagini
  imgFront:null, imgBack:null
};
window.state = state;

const frontCanvas = document.getElementById('cardFront');
const backCanvas  = document.getElementById('cardBack');
const ctxF = frontCanvas.getContext('2d');
const ctxB = backCanvas.getContext('2d');

// SVG minimal per database classi (puoi sostituire con icone più "fantasy")
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

function svgToImage(svg,cb){const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);const img=new Image();img.onload=()=>cb(img);img.src=url;}
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function cover(c,img,dx,dy,dw,dh,r=0){const ir=img.width/img.height,dr=dw/dh;let sx,sy,sw,sh;if(ir>dr){sh=img.height;sw=sh*dr;sx=(img.width-sw)/2;sy=0;}else{sw=img.width;sh=sw/dr;sx=0;sy=(img.height-sh)/2;} if(r>0){c.save();rr(c,dx,dy,dw,dh,r);c.clip();} c.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh); if(r>0)c.restore();}

function paintFrame(c,W,H){ // cornice esterna + interno
  c.fillStyle=state.frameColor; rr(c,12,12,W-24,H-24,22); c.fill();
  rr(c,28,28,W-56,H-56,18); c.fillStyle=state.innerColor; c.fill();
}

function defaultSymbolPos(){const W=750,s=state.classSize,right=W-44,y=71-s/2;state.classX=right-s;state.classY=y;}

export function drawFront(){
  const W=750,H=1050; ctxF.clearRect(0,0,W,H); paintFrame(ctxF,W,H);
  // pannelli
  ctxF.globalAlpha=state.panelAlpha; ctxF.fillStyle=state.panelColor;
  rr(ctxF,28,28,W-56,86,16); ctxF.fill(); rr(ctxF,28,610,W-56,412,18); ctxF.fill(); ctxF.globalAlpha=1;
  // immagine centrale
  const ax=44,ay=132,aw=W-88,ah=460;
  if(state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18); else{ ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }
  // titolo
  ctxF.textBaseline='middle'; ctxF.font=`700 ${state.titleSize}px ${state.titleFont}`; ctxF.fillStyle=state.titleColor; ctxF.textAlign='left';
  ctxF.fillText(state.title||'',44,71,520);
  // simbolo
  if(state.imgClass){ if(state.classX==null||state.classY==null) defaultSymbolPos(); cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10); }
  // mana
  if(state.showMana && (state.mana||'').trim()){ ctxF.fillStyle='#222'; ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`; ctxF.textAlign='right';
    const right=750-44; const x = state.imgClass ? Math.min(right-8,(state.classX??(right-40))-10) : right; ctxF.fillText(state.mana, x, 71); ctxF.textAlign='left'; }
  // descrizione (+ **grassetto** semplice)
  const bx=40,by=618,bw=W-80,bh=396; ctxF.save(); rr(ctxF,bx,by,bw,bh,18); ctxF.clip(); ctxF.fillStyle=state.descColor; ctxF.font=`400 ${state.descSize}px ${state.descFont}`;
  const text=(state.descText||''); const words=text.split(/(\*\*.*?\*\*)|\s+/g).filter(Boolean); let line='',yy=by+18;
  function flush(){ctxF.fillText(line,bx+18,yy); line=''; yy+=state.descSize*1.45;}
  words.forEach(tok=>{ let chunk=tok; let bold=false; if(/^\*\*.*\*\*$/.test(tok)){bold=true; chunk=tok.slice(2,-2);} const test=line+chunk+(chunk.match(/\s/)?'':' ');
    if(ctxF.measureText(test).width>bw-36 && line) flush();
    if(bold){ ctxF.save(); ctxF.font=`700 ${state.descSize}px ${state.descFont}`; ctxF.fillText(chunk,bx+18,yy); ctxF.restore(); line+=' '; }
    else line+=chunk+(chunk.match(/\s/)?'':' '); });
  if(line.trim()) ctxF.fillText(line,bx+18,yy); ctxF.restore();
}

export function drawBack(){
  const W=750,H=1050; ctxB.clearRect(0,0,W,H); paintFrame(ctxB,W,H);
  // full-bleed dentro la cornice interna
  if(state.imgBack) cover(ctxB,state.imgBack,28,28,W-56,H-56,18);
  else{ ctxB.save(); rr(ctxB,40,40,W-80,H-80,14); ctxB.fillStyle='#d5d5d5'; ctxB.globalAlpha=.35; ctxB.fill(); ctxB.restore();
    ctxB.fillStyle='#6b7280'; ctxB.font='16px Inter,sans-serif'; ctxB.fillText('Carica immagine retro (full-bleed)', 48, 62);}
}

// drag & drop simbolo
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

// Inputs bind
const $ = id=>document.getElementById(id);
function bind(){
  $('title').oninput=e=>{state.title=e.target.value;drawFront();};
  $('showMana').onchange=e=>{state.showMana=e.target.checked;drawFront();};
  $('mana').oninput=e=>{state.mana=e.target.value;drawFront();};
  $('titleFont').onchange=e=>{state.titleFont=e.target.value;drawFront();};
  $('titleSize').oninput=e=>{state.titleSize=+e.target.value;drawFront();};
  $('titleColor').oninput=e=>{state.titleColor=e.target.value;drawFront();};

  $('descFont').onchange=e=>{state.descFont=e.target.value;drawFront();};
  $('descSize').oninput=e=>{state.descSize=+e.target.value;drawFront();};
  $('descColor').oninput=e=>{state.descColor=e.target.value;drawFront();};
  $('rulesText').oninput=e=>{state.descText=e.target.value;drawFront();};

  $('panelColor').oninput=e=>{state.panelColor=e.target.value;drawFront();};
  $('panelAlpha').oninput=e=>{state.panelAlpha=+e.target.value/100;drawFront();};

  $('frameStyle').onchange=e=>{state.frameStyle=e.target.value;drawFront();drawBack();};
  $('frameColor').oninput=e=>{state.frameColor=e.target.value;drawFront();drawBack();};
  $('innerColor').oninput=e=>{state.innerColor=e.target.value;drawFront();drawBack();};

  $('classSource').onchange=e=>{
    state.classSource=e.target.value;
    document.getElementById('dbClassRow').style.display=(state.classSource==='db')?'block':'none';
    document.getElementById('uploadClassRow').style.display=(state.classSource==='upload')?'block':'none';
    if(state.classSource==='none') state.imgClass=null;
    if(state.classSource==='db') loadDbIcon($('clazz').value);
    if(state.classSource!=='upload') $('classImg').value='';
    drawFront();
  };
  $('clazz').onchange=e=>{ if(state.classSource==='db') loadDbIcon(e.target.value); };
  $('classSize').oninput=e=>{state.classSize=+e.target.value; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();};

  $('classImg').addEventListener('change',e=>{
    if(state.classSource!=='upload')return; const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgClass=img; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  $('artFront').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return; const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgFront=img; drawFront();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });
  $('artBack').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return; const r=new FileReader();
    r.onload=ev=>{const img=new Image(); img.onload=()=>{state.imgBack=img; drawBack();}; img.src=ev.target.result;}; r.readAsDataURL(f);
  });

  // Font upload
  $('titleFontFile').addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return; const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf); await ff.load(); document.fonts.add(ff); drawFront();
  });
  $('descFontFile').addEventListener('change', async e=>{
    const f=e.target.files?.[0]; if(!f)return; const buf=await f.arrayBuffer(); const ff=new FontFace('CardCustom',buf); await ff.load(); document.fonts.add(ff); drawFront();
  });
}

function loadDbIcon(key){ const svg=ICONS[key]; if(!svg){state.imgClass=null;drawFront();return;}
  svgToImage(svg,img=>{state.imgClass=img; if(state.classX==null||state.classY==null) defaultSymbolPos(); drawFront();});
}

export function snapshot(includeImages=true){
  const out={...state};
  if(includeImages){
    out._imgFront=state.imgFront?.src||null;
    out._imgBack=state.imgBack?.src||null;
    out._imgClass=(state.classSource==='upload')?(state.imgClass?.src||null):null;
  }
  return out;
}

export function applySnap(s){
  Object.assign(state,s||{});
  if(state.classSource==='db'){ loadDbIcon(state.clazz); }
  else if(state.classSource==='upload' && s?._imgClass){ const i=new Image(); i.onload=()=>{state.imgClass=i; drawFront();}; i.src=s._imgClass; }
  if(s?._imgFront){ const i=new Image(); i.onload=()=>{state.imgFront=i; drawFront();}; i.src=s._imgFront; }
  if(s?._imgBack){ const i=new Image(); i.onload=()=>{state.imgBack=i; drawBack();}; i.src=s._imgBack; }
  drawFront(); drawBack();
}

export function frontPNG(){ return frontCanvas.toDataURL('image/png'); }
export function backPNG(){  return backCanvas.toDataURL('image/png'); }

function init(){
  bind();
  loadDbIcon(state.clazz);
  drawFront(); drawBack();
  const force=new URLSearchParams(location.search).get('welcome')==='1';
  const flag=localStorage.getItem('cm_hide_welcome');
  if(force){ localStorage.removeItem('cm_hide_welcome'); document.getElementById('welcome').style.display='flex'; }
  else if(flag==='true'){ document.getElementById('welcome').style.display='none'; }
  // Welcome handlers
  const dont=document.getElementById('dontShow');
  document.getElementById('btnGuest').addEventListener('click',()=>{ if(dont?.checked) localStorage.setItem('cm_hide_welcome','true'); document.getElementById('welcome').style.display='none'; });
}
init();
