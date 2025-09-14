// card.js — motore di disegno carte (fronte/retro) + stato
export let state = {
  title: '',
  titleFont: '"Cinzel",serif',
  titleSize: 42,
  titleColor: '#ffffff',
  titleFoil: 'none',
  titleShadow: false,

  mana: '',
  showMana: true,

  classSource: 'db',
  clazz: 'druido',
  imgClass: null,
  classX: null,
  classY: null,
  classSize: 64,

  frameStyle: 'flat',
  frameColor: '#d8cfae',
  innerColor: '#f7f5ef',

  panelColor: '#cdbb7d',
  panelAlpha: 85,

  imgFront: null,
  imgBack: null,

  rulesText: '',
  descFont: '"Spectral",serif',
  descSize: 18,
  descColor: '#111111'
};

const canvasF = document.getElementById('cardFront');
const canvasB = document.getElementById('cardBack');
const ctxF = canvasF.getContext('2d');
const ctxB = canvasB.getContext('2d');

/* ========== Helpers ========== */
function rr(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function cover(ctx,img,x,y,w,h,r=0){
  ctx.save();
  if(r>0){ rr(ctx,x,y,w,h,r); ctx.clip(); }
  ctx.drawImage(img,x,y,w,h);
  ctx.restore();
}
function makeFoilGradient(ctx,x,y,w,h,kind){
  const g = ctx.createLinearGradient(x,y,x+w,y+h);
  if (kind==='gold'){
    g.addColorStop(0,'#fff8d0');
    g.addColorStop(.5,'#d4af37');
    g.addColorStop(1,'#fff8d0');
  } else if (kind==='silver'){
    g.addColorStop(0,'#ffffff');
    g.addColorStop(.5,'#c0c0c0');
    g.addColorStop(1,'#ffffff');
  } else if (kind==='rainbow'){
    g.addColorStop(0,'#ff0000');
    g.addColorStop(.2,'#ffa500');
    g.addColorStop(.4,'#ffff00');
    g.addColorStop(.6,'#00ff00');
    g.addColorStop(.8,'#0000ff');
    g.addColorStop(1,'#8b00ff');
  } else {
    g.addColorStop(0,state.frameColor);
    g.addColorStop(1,state.frameColor);
  }
  return g;
}

/* ========== Cornice ========== */
function paintFrame(ctx,W,H){
  ctx.save();
  rr(ctx,0,0,W,H,28);
  if (state.frameStyle.startsWith('foil-')){
    const kind = state.frameStyle.replace('foil-','');
    ctx.fillStyle = makeFoilGradient(ctx,0,0,W,H,kind);
  } else {
    ctx.fillStyle = state.frameColor;
  }
  ctx.fill();
  ctx.restore();

  // area interna
  rr(ctx,16,16,W-32,H-32,20);
  ctx.fillStyle = state.innerColor;
  ctx.fill();
}

/* ========== Disegno FRONTE ========== */
export function drawFront(){
  const W=750,H=1050;
  ctxF.clearRect(0,0,W,H);

  paintFrame(ctxF,W,H);

  // ===== Riquadro TITOLO =====
  const t = {x:28, y:28, w:W-56, h:86, r:16};
  rr(ctxF, t.x, t.y, t.w, t.h, t.r);
  ctxF.fillStyle = '#e6f2e6';
  ctxF.fill();
  ctxF.lineWidth = 2;
  ctxF.strokeStyle = '#89b97f';
  ctxF.stroke();
  // highlight
  const gTop = ctxF.createLinearGradient(0,t.y,0,t.y+t.h*0.6);
  gTop.addColorStop(0,'rgba(255,255,255,.65)');
  gTop.addColorStop(1,'rgba(255,255,255,0)');
  ctxF.save();
  rr(ctxF, t.x+2, t.y+2, t.w-4, t.h*0.45, t.r-4);
  ctxF.clip();
  ctxF.fillStyle = gTop;
  ctxF.fillRect(t.x, t.y, t.w, t.h*0.6);
  ctxF.restore();

  // ===== Immagine =====
  const ax=44, ay=132, aw=W-88, ah=460;
  if (state.imgFront) cover(ctxF,state.imgFront,ax,ay,aw,ah,18);
  else { ctxF.fillStyle='#cfcfcf'; rr(ctxF,ax,ay,aw,ah,18); ctxF.fill(); }

  // ===== Riquadro DESCRIZIONE =====
  const b = {x:28, y:610, w:W-56, h:412, r:18};
  rr(ctxF, b.x, b.y, b.w, b.h, b.r);
  ctxF.fillStyle = '#fcfcf8';
  ctxF.fill();
  ctxF.lineWidth = 2;
  ctxF.strokeStyle = 'rgba(122,177,114,.7)';
  ctxF.stroke();

  // ===== Titolo =====
  ctxF.textBaseline='middle';
  ctxF.textAlign='left';
  ctxF.font=`700 ${state.titleSize}px ${state.titleFont}`;

  if (state.titleShadow){
    ctxF.shadowColor='rgba(0,0,0,.55)';
    ctxF.shadowBlur=8; ctxF.shadowOffsetX=0; ctxF.shadowOffsetY=2;
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

  // ===== Simbolo di classe =====
  if (state.imgClass){
    if (state.classX == null || state.classY == null){
      const s = state.classSize, right=W-44, cy=71-s/2;
      state.classX = right - s; state.classY = cy;
    }
    cover(ctxF,state.imgClass,state.classX,state.classY,state.classSize,state.classSize,10);
  }

  // ===== Mana =====
  if (state.showMana && (state.mana||'').trim()){
    ctxF.shadowColor='transparent';
    ctxF.fillStyle='#222';
    ctxF.font=`600 ${Math.max(18,state.titleSize-2)}px Inter,sans-serif`;
    ctxF.textAlign='right';
    const right=750-44;
    const x = state.imgClass ? Math.min(right-8, (state.classX ?? (right-40)) - 10) : right;
    ctxF.fillText(state.mana, x, 71);
    ctxF.textAlign='left';
  }

  // ===== Descrizione =====
  const bx=b.x+12, by=b.y+18, bw=b.w-24;
  ctxF.save();
  ctxF.fillStyle=state.descColor;
  ctxF.font=`${state.descSize}px ${state.descFont}`;
  wrapText(ctxF,state.rulesText||'',bx,by,bw,state.descSize*1.3);
  ctxF.restore();
}

/* ========== Disegno RETRO ========== */
export function drawBack(){
  const W=750,H=1050;
  ctxB.clearRect(0,0,W,H);
  paintFrame(ctxB,W,H);
  if (state.imgBack) cover(ctxB,state.imgBack,28,28,W-56,H-56,20);
}

/* ========== Utils testo ========== */
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  if(!text) return;
  const words=text.split(/\s+/), lines=[];
  let line='';
  for(let n=0;n<words.length;n++){
    const test=line+words[n]+' ';
    const m=ctx.measureText(test);
    if(m.width>maxWidth && n>0){
      lines.push(line);
      line=words[n]+' ';
    } else line=test;
  }
  lines.push(line);
  for(let k=0;k<lines.length;k++){
    ctx.fillText(lines[k],x,y+lineHeight*k,maxWidth);
  }
}

/* ========== Snapshot ========== */
export function snapshot(forExport){
  const snap=JSON.parse(JSON.stringify(state));
  if(forExport){
    delete snap.imgFront;
    delete snap.imgBack;
    delete snap.imgClass;
  }
  return snap;
}
export async function applySnap(snap){
  state={...state,...snap};
  drawFront(); drawBack();
}

/* ========== PNG ========== */
export function frontPNG(){ return canvasF.toDataURL('image/png'); }
export function backPNG(){ return canvasB.toDataURL('image/png'); }
